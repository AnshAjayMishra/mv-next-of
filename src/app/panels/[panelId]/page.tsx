"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function PanelPage({ params }: { params: { panelId: string } }) {
  const { user } = useUser()
  const currentUser = useQuery(api.users.getCurrentUser)
  const panel = useQuery(api.panels.getPanel, { panelId: params.panelId })
  const registrations = useQuery(api.panels.getPanelRegistrations, {
    panelId: params.panelId,
  })
  const registerStudent = useMutation(api.panels.registerStudent)
  const evaluateStudent = useMutation(api.panels.evaluateStudent)
  const [studentDetails, setStudentDetails] = useState({
    name: "",
    email: "",
    rollNumber: "",
    department: "",
  })
  const [evaluation, setEvaluation] = useState({
    technicalScore: 0,
    communicationScore: 0,
    problemSolvingScore: 0,
    feedback: "",
    strengths: [""],
    areasForImprovement: [""],
  })
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!panel || !currentUser) return

    try {
      await registerStudent({
        panelId: params.panelId,
        studentId: currentUser._id,
        ...studentDetails,
      })
      toast.success("Successfully registered for the panel")
      setStudentDetails({
        name: "",
        email: "",
        rollNumber: "",
        department: "",
      })
    } catch (error) {
      toast.error("Failed to register. Please try again.")
    }
  }

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStudent) return

    try {
      await evaluateStudent({
        registrationId: selectedStudent,
        ...evaluation,
      })
      toast.success("Evaluation submitted successfully")
      setEvaluation({
        technicalScore: 0,
        communicationScore: 0,
        problemSolvingScore: 0,
        feedback: "",
        strengths: [""],
        areasForImprovement: [""],
      })
      setSelectedStudent(null)
    } catch (error) {
      toast.error("Failed to submit evaluation. Please try again.")
    }
  }

  if (!panel || !currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{panel.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Description</p>
              <p className="text-muted-foreground">{panel.description}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Duration</p>
              <p className="text-muted-foreground">{panel.duration} minutes</p>
            </div>
            <div>
              <p className="text-sm font-medium">Maximum Students</p>
              <p className="text-muted-foreground">{panel.maxStudents}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Created By</p>
              <p className="text-muted-foreground">{panel.createdBy}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {currentUser.role === "student" && (
        <Card>
          <CardHeader>
            <CardTitle>Register for Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={studentDetails.name}
                    onChange={(e) =>
                      setStudentDetails({ ...studentDetails, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={studentDetails.email}
                    onChange={(e) =>
                      setStudentDetails({ ...studentDetails, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rollNumber">Roll Number</Label>
                  <Input
                    id="rollNumber"
                    value={studentDetails.rollNumber}
                    onChange={(e) =>
                      setStudentDetails({
                        ...studentDetails,
                        rollNumber: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={studentDetails.department}
                    onChange={(e) =>
                      setStudentDetails({
                        ...studentDetails,
                        department: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Register
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {currentUser.role === "faculty" && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Registered Students</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations?.map((registration) => (
                    <TableRow key={registration._id}>
                      <TableCell>{registration.name}</TableCell>
                      <TableCell>{registration.email}</TableCell>
                      <TableCell>{registration.rollNumber}</TableCell>
                      <TableCell>{registration.department}</TableCell>
                      <TableCell>{registration.status}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedStudent(registration._id)}
                        >
                          Evaluate
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {selectedStudent && (
            <Card>
              <CardHeader>
                <CardTitle>Evaluate Student</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEvaluate} className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="technicalScore">Technical Score</Label>
                      <Input
                        id="technicalScore"
                        type="number"
                        min="0"
                        max="10"
                        value={evaluation.technicalScore}
                        onChange={(e) =>
                          setEvaluation({
                            ...evaluation,
                            technicalScore: parseInt(e.target.value),
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="communicationScore">
                        Communication Score
                      </Label>
                      <Input
                        id="communicationScore"
                        type="number"
                        min="0"
                        max="10"
                        value={evaluation.communicationScore}
                        onChange={(e) =>
                          setEvaluation({
                            ...evaluation,
                            communicationScore: parseInt(e.target.value),
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="problemSolvingScore">
                        Problem Solving Score
                      </Label>
                      <Input
                        id="problemSolvingScore"
                        type="number"
                        min="0"
                        max="10"
                        value={evaluation.problemSolvingScore}
                        onChange={(e) =>
                          setEvaluation({
                            ...evaluation,
                            problemSolvingScore: parseInt(e.target.value),
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feedback">Feedback</Label>
                    <Textarea
                      id="feedback"
                      value={evaluation.feedback}
                      onChange={(e) =>
                        setEvaluation({
                          ...evaluation,
                          feedback: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="strengths">Strengths (comma-separated)</Label>
                    <Input
                      id="strengths"
                      value={evaluation.strengths.join(", ")}
                      onChange={(e) =>
                        setEvaluation({
                          ...evaluation,
                          strengths: e.target.value.split(",").map((s) => s.trim()),
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="areasForImprovement">
                      Areas for Improvement (comma-separated)
                    </Label>
                    <Input
                      id="areasForImprovement"
                      value={evaluation.areasForImprovement.join(", ")}
                      onChange={(e) =>
                        setEvaluation({
                          ...evaluation,
                          areasForImprovement: e.target.value
                            .split(",")
                            .map((s) => s.trim()),
                        })
                      }
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Submit Evaluation
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
} 
"use client"

import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@clerk/nextjs"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function DashboardPage() {
  const { user } = useUser()
  const router = useRouter()
  const currentUser = useQuery(api.users.getCurrentUser)
  const interviews = useQuery(api.interviews.getInterviews)
  const sessions = useQuery(api.sessions.getMySessions)
  const evaluations = useQuery(api.panels.getStudentEvaluations, {
    studentId: currentUser?._id || "",
  })

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {currentUser.role === "student" && (
          <Button onClick={() => router.push("/panels")}>
            View Available Panels
          </Button>
        )}
      </div>

      {currentUser.role === "student" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>My Evaluations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Panel</TableHead>
                  <TableHead>Technical Score</TableHead>
                  <TableHead>Communication Score</TableHead>
                  <TableHead>Problem Solving Score</TableHead>
                  <TableHead>Overall Score</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluations?.map(({ registration, evaluation }) => (
                  <TableRow key={registration._id}>
                    <TableCell>{registration.name}</TableCell>
                    <TableCell>
                      {evaluation?.technicalScore || "Not evaluated"}
                    </TableCell>
                    <TableCell>
                      {evaluation?.communicationScore || "Not evaluated"}
                    </TableCell>
                    <TableCell>
                      {evaluation?.problemSolvingScore || "Not evaluated"}
                    </TableCell>
                    <TableCell>
                      {evaluation?.overallScore || "Not evaluated"}
                    </TableCell>
                    <TableCell>{registration.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {currentUser.role === "faculty" && (
        <Card>
          <CardHeader>
            <CardTitle>My Panels</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/admin/create-panel")}>
              Create New Panel
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Welcome Card */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user?.firstName || "User"}!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You are logged in as a {currentUser.role}
            </p>
          </CardContent>
        </Card>

        {/* Interviews Card */}
        <Card>
          <CardHeader>
            <CardTitle>Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {interviews?.length || 0}
            </p>
            <p className="text-muted-foreground">
              Total interviews available
            </p>
          </CardContent>
        </Card>

        {/* Sessions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {sessions?.length || 0}
            </p>
            <p className="text-muted-foreground">
              Your interview sessions
            </p>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {sessions && sessions.length > 0 ? (
              <div className="space-y-4">
                {sessions.slice(0, 5).map((session) => (
                  <div
                    key={session._id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {session.interviewId}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Scheduled for {formatDate(session.scheduledAt)}
                      </p>
                    </div>
                    <div className="text-sm">
                      Status: {session.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No recent sessions found
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
"use client"

import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function PanelsPage() {
  const { user } = useUser()
  const router = useRouter()
  const currentUser = useQuery(api.users.getCurrentUser)
  const panels = useQuery(api.panels.getPanels)

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Available Panels</h1>
        {currentUser.role === "faculty" && (
          <Button onClick={() => router.push("/admin/create-panel")}>
            Create New Panel
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Panel Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Max Students</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {panels?.map((panel) => (
                <TableRow key={panel._id}>
                  <TableCell className="font-medium">{panel.name}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {panel.description}
                  </TableCell>
                  <TableCell>{panel.duration} minutes</TableCell>
                  <TableCell>{panel.maxStudents}</TableCell>
                  <TableCell>{panel.createdBy}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/panels/${panel._id}`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 
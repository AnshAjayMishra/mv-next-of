"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function RolesPage() {
  const { user } = useUser()
  const currentUser = useQuery(api.users.getCurrentUser)
  const users = useQuery(api.users.getAllUsers)
  const updateRole = useMutation(api.users.updateUserRole)
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({})

  if (!currentUser || !users) {
    return <div>Loading...</div>
  }

  if (currentUser.role !== "admin") {
    return <div>Unauthorized</div>
  }

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await updateRole({ userId, role })
      setSelectedRoles((prev) => ({ ...prev, [userId]: role }))
      alert("User role updated successfully")
    } catch (error) {
      console.error("Error updating role:", error)
      alert("Failed to update user role")
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage User Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Current Role</TableHead>
                <TableHead>Change Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Select
                      value={selectedRoles[user.userId] || user.role}
                      onValueChange={(value) => handleRoleChange(user.userId, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="faculty">Faculty</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                      </SelectContent>
                    </Select>
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
"use client"

import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"

export default function SetAdminPage() {
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const setInitialAdmin = useMutation(api.users.setInitialAdmin)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSetAdmin = async () => {
    if (!user) return

    try {
      await setInitialAdmin({
        userId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName} ${user.lastName}`,
      })
      alert("Successfully set as admin!")
      router.push("/dashboard")
    } catch (error) {
      console.error("Error setting admin:", error)
      alert("Error setting admin. Please try again.")
    }
  }

  if (!mounted) {
    return null
  }

  if (!isLoaded) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[200px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-10 w-[150px]" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Please sign in to access this page.</p>
            <Button onClick={() => router.push("/sign-in")}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Set Initial Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Click the button below to set yourself as the initial admin user.
            This can only be done once when there are no existing admins.
          </p>
          <Button onClick={handleSetAdmin}>Set Me as Admin</Button>
        </CardContent>
      </Card>
    </div>
  )
} 
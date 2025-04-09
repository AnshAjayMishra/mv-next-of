"use client"

import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function CreateAdminPage() {
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const createOrUpdateAdmin = useMutation(api.users.createOrUpdateAdmin)
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    console.log("User loaded:", isUserLoaded)
    console.log("User signed in:", isSignedIn)
    console.log("User data:", user)
    setMounted(true)
  }, [isUserLoaded, isSignedIn, user])

  const handleCreateAdmin = async () => {
    if (!user) {
      console.error("No user found")
      return
    }

    setIsLoading(true)
    console.log("Creating/updating admin with user:", {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      name: `${user.firstName} ${user.lastName}`,
    })

    try {
      const result = await createOrUpdateAdmin({
        userId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: `${user.firstName} ${user.lastName}`,
      })
      console.log("Admin creation/update successful:", result)
      
      toast({
        title: "Success",
        description: "Successfully created/updated admin role!",
      })
      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating/updating admin:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error creating/updating admin. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    console.log("Component not mounted yet")
    return null
  }

  if (!isUserLoaded) {
    console.log("User data still loading")
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
    console.log("User not signed in")
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

  console.log("Rendering admin creation form")
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Create/Update Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Click the button below to create or update your admin role.
            This will ensure you have admin access in the system.
          </p>
          <Button 
            onClick={handleCreateAdmin}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Create/Update Admin Role"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 
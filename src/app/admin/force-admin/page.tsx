"use client"

import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function ForceAdminPage() {
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const forceSetAdmin = useMutation(api.users.forceSetAdmin)
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleForceAdmin = async () => {
    if (!user) return

    try {
      await forceSetAdmin({
        userId: user.id,
      })
      toast({
        title: "Success",
        description: "Successfully set as admin!",
      })
      router.push("/dashboard")
    } catch (error) {
      console.error("Error setting admin:", error)
      toast({
        title: "Error",
        description: "Error setting admin. Please try again.",
        variant: "destructive",
      })
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
          <CardTitle>Force Set Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Click the button below to force set yourself as admin.
            This will update your role directly in the database.
          </p>
          <Button onClick={handleForceAdmin}>Force Set Me as Admin</Button>
        </CardContent>
      </Card>
    </div>
  )
} 
"use client"

import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"

export default function CheckUserPage() {
  const { user, isLoaded, isSignedIn } = useUser()
  const currentUser = useQuery(api.users.getCurrentUser)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
            <CardTitle>Not Signed In</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please sign in to view your user information.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Clerk User Info:</h3>
              <pre className="bg-muted p-2 rounded-md overflow-auto">
                {JSON.stringify({
                  id: user?.id,
                  email: user?.emailAddresses[0]?.emailAddress,
                  name: `${user?.firstName} ${user?.lastName}`,
                }, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold">Convex User Info:</h3>
              <pre className="bg-muted p-2 rounded-md overflow-auto">
                {JSON.stringify(currentUser, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
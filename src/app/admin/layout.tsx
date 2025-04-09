"use client"

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoaded: isUserLoaded, isSignedIn } = useUser()
  const router = useRouter()

  if (!isUserLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isSignedIn) {
    router.push('/sign-in')
    return null
  }

  return <>{children}</>
} 
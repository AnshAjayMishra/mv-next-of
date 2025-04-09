'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Panels', href: '/panels' },
  { name: 'Interviews', href: '/interviews' },
  { name: 'Sessions', href: '/sessions' },
  { name: 'Skills', href: '/skills' },
  { name: 'Users', href: '/admin/users' },
  { name: 'Roles', href: '/admin/roles' },
  { name: 'Create Panel', href: '/admin/create-panel' },
]

export function Navigation() {
  const pathname = usePathname()
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (!isUserLoaded) {
    return (
      <nav className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-xl font-bold">
                MockVault
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {isSignedIn &&
                navigation.map((item) => {
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium',
                        isActive
                          ? 'border-primary text-foreground'
                          : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                      )}
                    >
                      {item.name}
                    </Link>
                  )
                })}
            </div>
          </div>
          <div className="flex items-center">
            {!isSignedIn && (
              <SignInButton mode="modal">
                <Button variant="default">Sign In</Button>
              </SignInButton>
            )}
            {isSignedIn && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {user?.firstName} {user?.lastName}
                </span>
                <SignOutButton>
                  <Button variant="ghost">Sign Out</Button>
                </SignOutButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
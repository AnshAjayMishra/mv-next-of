'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    {
      name: 'Home',
      href: '/',
    },
    {
      name: 'Admin',
      href: '/admin',
    },
    {
      name: 'Student',
      href: '/student',
    },
  ]

  return (
    <div className="flex items-center md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="mr-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sr-only">Toggle menu</span>
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>
      {isOpen && (
        <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max gap-4 bg-background p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden">
          <nav className="grid grid-flow-row auto-rows-max text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex w-full items-center rounded-md px-2 py-2 hover:underline',
                  pathname === item.href
                    ? 'bg-muted font-medium'
                    : 'text-muted-foreground'
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
} 
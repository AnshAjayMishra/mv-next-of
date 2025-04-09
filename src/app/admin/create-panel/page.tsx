'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'

export default function CreatePanelPage() {
  const router = useRouter()
  const { userId, isLoaded } = useAuth()
  const createPanel = useMutation(api.panels.createPanel)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxStudents: 0,
    duration: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!isLoaded) {
      console.error("Auth is not loaded yet")
      toast.error('Authentication is not ready. Please wait.')
      setIsLoading(false)
      return
    }

    if (!userId) {
      console.error("No user ID found")
      toast.error('You must be logged in to create a panel')
      setIsLoading(false)
      return
    }

    try {
      await createPanel({
        name: formData.name,
        description: formData.description,
        maxStudents: formData.maxStudents,
        duration: formData.duration,
      })
      toast.success('Panel created successfully')
      router.push('/panels')
    } catch (error) {
      toast.error('Failed to create panel. Please try again.')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <div className="container max-w-4xl py-12">
      <Button
        variant="ghost"
        className="mb-8"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create New Interview Panel</CardTitle>
          <CardDescription>
            Set up a new interview panel for conducting mock interviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Panel Name</Label>
              <Input
                id="name"
                placeholder="Enter panel name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter panel description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxStudents">Maximum Students</Label>
                <Input
                  id="maxStudents"
                  type="number"
                  min="1"
                  value={formData.maxStudents}
                  onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) })}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Panel'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 
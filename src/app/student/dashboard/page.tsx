'use client'

import { useState } from 'react'

interface Interview {
  id: string
  panelName: string
  date: string
  time: string
  technicalFaculty: string
  communicationFaculty: string
  status: 'scheduled' | 'completed'
  technicalScore?: number
  communicationScore?: number
  feedback?: string
}

export default function StudentDashboard() {
  const [interviews, setInterviews] = useState<Interview[]>([
    {
      id: '1',
      panelName: 'Technical Panel 1',
      date: '2024-03-20',
      time: '10:00 AM',
      technicalFaculty: 'Dr. Smith',
      communicationFaculty: 'Prof. Johnson',
      status: 'scheduled',
    },
    {
      id: '2',
      panelName: 'Technical Panel 2',
      date: '2024-03-21',
      time: '02:00 PM',
      technicalFaculty: 'Dr. Brown',
      communicationFaculty: 'Prof. Davis',
      status: 'completed',
      technicalScore: 8,
      communicationScore: 7,
      feedback: 'Good technical knowledge but needs improvement in communication skills.',
    },
  ])

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Upcoming Interviews</h2>
            {interviews
              .filter((interview) => interview.status === 'scheduled')
              .map((interview) => (
                <div key={interview.id} className="border-b py-4">
                  <h3 className="font-medium">{interview.panelName}</h3>
                  <p className="text-gray-600">
                    {interview.date} at {interview.time}
                  </p>
                  <p className="text-sm text-gray-500">
                    Technical Faculty: {interview.technicalFaculty}
                  </p>
                  <p className="text-sm text-gray-500">
                    Communication Faculty: {interview.communicationFaculty}
                  </p>
                </div>
              ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Completed Interviews</h2>
            {interviews
              .filter((interview) => interview.status === 'completed')
              .map((interview) => (
                <div key={interview.id} className="border-b py-4">
                  <h3 className="font-medium">{interview.panelName}</h3>
                  <p className="text-gray-600">
                    {interview.date} at {interview.time}
                  </p>
                  <div className="mt-2">
                    <p className="text-sm">
                      Technical Score: {interview.technicalScore}/10
                    </p>
                    <p className="text-sm">
                      Communication Score: {interview.communicationScore}/10
                    </p>
                    <p className="text-sm mt-2 text-gray-600">
                      Feedback: {interview.feedback}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
} 
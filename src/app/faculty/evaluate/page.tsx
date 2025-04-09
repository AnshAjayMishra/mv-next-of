'use client'

import { useState } from 'react'

interface Student {
  id: string
  name: string
  email: string
  technicalScore?: number
  communicationScore?: number
  feedback?: string
}

export default function FacultyEvaluation() {
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
    },
  ])

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [evaluation, setEvaluation] = useState({
    technicalScore: 0,
    communicationScore: 0,
    feedback: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStudent) return

    // TODO: Add evaluation submission logic with Convex
    setStudents(
      students.map((student) =>
        student.id === selectedStudent.id
          ? {
              ...student,
              technicalScore: evaluation.technicalScore,
              communicationScore: evaluation.communicationScore,
              feedback: evaluation.feedback,
            }
          : student
      )
    )
    setSelectedStudent(null)
    setEvaluation({ technicalScore: 0, communicationScore: 0, feedback: '' })
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Student Evaluation</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Students</h2>
            <div className="space-y-4">
              {students.map((student) => (
                <div
                  key={student.id}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    selectedStudent?.id === student.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedStudent(student)}
                >
                  <h3 className="font-medium">{student.name}</h3>
                  <p className="text-sm text-gray-600">{student.email}</p>
                  {student.technicalScore && (
                    <p className="text-sm mt-2">
                      Technical Score: {student.technicalScore}/10
                    </p>
                  )}
                  {student.communicationScore && (
                    <p className="text-sm">
                      Communication Score: {student.communicationScore}/10
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {selectedStudent && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Evaluate {selectedStudent.name}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Technical Score (0-10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={evaluation.technicalScore}
                    onChange={(e) =>
                      setEvaluation({
                        ...evaluation,
                        technicalScore: parseInt(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Communication Score (0-10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={evaluation.communicationScore}
                    onChange={(e) =>
                      setEvaluation({
                        ...evaluation,
                        communicationScore: parseInt(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Feedback
                  </label>
                  <textarea
                    value={evaluation.feedback}
                    onChange={(e) =>
                      setEvaluation({ ...evaluation, feedback: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows={4}
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Submit Evaluation
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
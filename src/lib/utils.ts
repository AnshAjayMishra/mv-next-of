import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(typeof date === "number" ? date : date.getTime())
}

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) {
    return `${minutes} minutes`
  } else if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? "s" : ""}`
  } else {
    return `${hours} hour${hours > 1 ? "s" : ""} ${remainingMinutes} minute${
      remainingMinutes > 1 ? "s" : ""
    }`
  }
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export function getRandomColor() {
  const colors = [
    "bg-red-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export function getSkillColor(category: string) {
  const colors: { [key: string]: string } = {
    technical: "bg-blue-500",
    behavioral: "bg-green-500",
    communication: "bg-yellow-500",
    leadership: "bg-purple-500",
    problemSolving: "bg-red-500",
    softSkills: "bg-pink-500",
    industry: "bg-indigo-500",
  }
  return colors[category] || getRandomColor()
}

export function getDifficultyColor(difficulty: string) {
  const colors: { [key: string]: string } = {
    easy: "bg-green-500",
    medium: "bg-yellow-500",
    hard: "bg-red-500",
  }
  return colors[difficulty] || getRandomColor()
}

export function getInterviewTypeColor(type: string) {
  const colors: { [key: string]: string } = {
    technical: "bg-blue-500",
    behavioral: "bg-green-500",
    case: "bg-yellow-500",
    panel: "bg-purple-500",
  }
  return colors[type] || getRandomColor()
}

export function getStatusColor(status: string) {
  const colors: { [key: string]: string } = {
    scheduled: "bg-blue-500",
    in_progress: "bg-yellow-500",
    completed: "bg-green-500",
    cancelled: "bg-red-500",
  }
  return colors[status] || getRandomColor()
}

export function getRoleColor(role: string) {
  const colors: { [key: string]: string } = {
    admin: "bg-red-500",
    faculty: "bg-blue-500",
    student: "bg-green-500",
  }
  return colors[role] || getRandomColor()
}

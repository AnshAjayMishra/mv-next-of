import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("faculty"), v.literal("student")),
    skills: v.array(v.string()),
    bio: v.optional(v.string()),
    industry: v.optional(v.string()),
    experience: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  panels: defineTable({
    name: v.string(),
    description: v.string(),
    maxStudents: v.number(),
    duration: v.number(),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_createdBy", ["createdBy"]),

  panelRegistrations: defineTable({
    panelId: v.id("panels"),
    studentId: v.id("users"),
    name: v.string(),
    email: v.string(),
    rollNumber: v.string(),
    department: v.string(),
    status: v.union(
      v.literal("registered"),
      v.literal("evaluated"),
      v.literal("completed")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_panel", ["panelId"])
    .index("by_student", ["studentId"]),

  panelEvaluations: defineTable({
    registrationId: v.id("panelRegistrations"),
    evaluatorId: v.id("users"),
    technicalScore: v.number(),
    communicationScore: v.number(),
    problemSolvingScore: v.number(),
    feedback: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_registration", ["registrationId"])
    .index("by_evaluator", ["evaluatorId"]),

  interviews: defineTable({
    title: v.string(),
    description: v.string(),
    type: v.union(
      v.literal("technical"),
      v.literal("behavioral"),
      v.literal("case"),
      v.literal("panel")
    ),
    industry: v.string(),
    level: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")),
    duration: v.number(),
    createdBy: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_createdBy", ["createdBy"]),

  interviewSessions: defineTable({
    interviewId: v.id("interviews"),
    interviewerId: v.string(),
    intervieweeId: v.string(),
    scheduledAt: v.number(),
    status: v.union(
      v.literal("scheduled"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    feedback: v.optional(v.string()),
    rating: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_interviewer", ["interviewerId"])
    .index("by_interviewee", ["intervieweeId"])
    .index("by_interview", ["interviewId"]),

  questions: defineTable({
    interviewId: v.id("interviews"),
    question: v.string(),
    type: v.union(
      v.literal("technical"),
      v.literal("behavioral"),
      v.literal("case"),
      v.literal("general")
    ),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    category: v.string(),
    sampleAnswer: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_interview", ["interviewId"]),

  feedback: defineTable({
    sessionId: v.id("interviewSessions"),
    questionId: v.id("questions"),
    answer: v.string(),
    feedback: v.string(),
    rating: v.number(),
    improvements: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_session", ["sessionId"])
    .index("by_question", ["questionId"]),

  skills: defineTable({
    name: v.string(),
    category: v.string(),
    description: v.string(),
    resources: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_category", ["category"]),
}) 
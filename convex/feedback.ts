import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const createFeedback = mutation({
  args: {
    sessionId: v.id("interviewSessions"),
    questionId: v.id("questions"),
    answer: v.string(),
    feedback: v.string(),
    rating: v.number(),
    improvements: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("You must be logged in to provide feedback")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first()

    if (!user || user.role !== "faculty") {
      throw new Error("Only faculty members can provide feedback")
    }

    // Check if the session exists and belongs to this interviewer
    const session = await ctx.db.get(args.sessionId)
    if (!session) {
      throw new Error("Session not found")
    }

    if (session.interviewerId !== user.userId) {
      throw new Error("You can only provide feedback for your own sessions")
    }

    if (session.status !== "completed") {
      throw new Error("Can only provide feedback for completed sessions")
    }

    // Check if the question belongs to the interview
    const question = await ctx.db.get(args.questionId)
    if (!question) {
      throw new Error("Question not found")
    }

    if (question.interviewId !== session.interviewId) {
      throw new Error("Question does not belong to this interview session")
    }

    const feedbackId = await ctx.db.insert("feedback", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return feedbackId
  },
})

export const getSessionFeedback = query({
  args: { sessionId: v.id("interviewSessions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("You must be logged in to view feedback")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    // Check if the session exists
    const session = await ctx.db.get(args.sessionId)
    if (!session) {
      throw new Error("Session not found")
    }

    // Only the interviewer and interviewee can view the feedback
    if (session.interviewerId !== user.userId && session.intervieweeId !== user.userId) {
      throw new Error("You don't have permission to view this feedback")
    }

    return await ctx.db
      .query("feedback")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect()
  },
})

export const getQuestionFeedback = query({
  args: { questionId: v.id("questions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("You must be logged in to view feedback")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    // Check if the question exists
    const question = await ctx.db.get(args.questionId)
    if (!question) {
      throw new Error("Question not found")
    }

    // Get all feedback for this question
    const feedback = await ctx.db
      .query("feedback")
      .withIndex("by_question", (q) => q.eq("questionId", args.questionId))
      .collect()

    // Filter feedback based on user role and permissions
    if (user.role === "faculty") {
      // Faculty can only see feedback from their own sessions
      return feedback.filter(async (f) => {
        const session = await ctx.db.get(f.sessionId)
        return session?.interviewerId === user.userId
      })
    } else if (user.role === "student") {
      // Students can only see their own feedback
      return feedback.filter(async (f) => {
        const session = await ctx.db.get(f.sessionId)
        return session?.intervieweeId === user.userId
      })
    } else {
      // Admins can see all feedback
      return feedback
    }
  },
})

export const updateFeedback = mutation({
  args: {
    feedbackId: v.id("feedback"),
    feedback: v.optional(v.string()),
    rating: v.optional(v.number()),
    improvements: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("You must be logged in to update feedback")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first()

    if (!user || user.role !== "faculty") {
      throw new Error("Only faculty members can update feedback")
    }

    const feedback = await ctx.db.get(args.feedbackId)
    if (!feedback) {
      throw new Error("Feedback not found")
    }

    // Check if the session belongs to this interviewer
    const session = await ctx.db.get(feedback.sessionId)
    if (!session) {
      throw new Error("Session not found")
    }

    if (session.interviewerId !== user.userId) {
      throw new Error("You can only update your own feedback")
    }

    await ctx.db.patch(args.feedbackId, {
      ...args,
      updatedAt: Date.now(),
    })

    return args.feedbackId
  },
}) 
import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const scheduleSession = mutation({
  args: {
    interviewId: v.id("interviews"),
    interviewerId: v.string(),
    scheduledAt: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("You must be logged in to schedule a session")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    // Check if the interviewer exists and is a faculty member
    const interviewer = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.interviewerId))
      .first()

    if (!interviewer || interviewer.role !== "faculty") {
      throw new Error("Invalid interviewer selected")
    }

    // Check if the interview exists
    const interview = await ctx.db.get(args.interviewId)
    if (!interview) {
      throw new Error("Interview not found")
    }

    const sessionId = await ctx.db.insert("interviewSessions", {
      ...args,
      intervieweeId: user.userId,
      status: "scheduled",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return sessionId
  },
})

export const getMySessions = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("You must be logged in to view sessions")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    if (user.role === "faculty") {
      return await ctx.db
        .query("interviewSessions")
        .withIndex("by_interviewer", (q) => q.eq("interviewerId", user.userId))
        .collect()
    } else {
      return await ctx.db
        .query("interviewSessions")
        .withIndex("by_interviewee", (q) => q.eq("intervieweeId", user.userId))
        .collect()
    }
  },
})

export const getSession = query({
  args: { sessionId: v.id("interviewSessions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("You must be logged in to view this session")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    const session = await ctx.db.get(args.sessionId)
    if (!session) {
      throw new Error("Session not found")
    }

    // Only the interviewer and interviewee can view the session
    if (session.interviewerId !== user.userId && session.intervieweeId !== user.userId) {
      throw new Error("You don't have permission to view this session")
    }

    return session
  },
})

export const updateSessionStatus = mutation({
  args: {
    sessionId: v.id("interviewSessions"),
    status: v.union(
      v.literal("scheduled"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("You must be logged in to update session status")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    const session = await ctx.db.get(args.sessionId)
    if (!session) {
      throw new Error("Session not found")
    }

    // Only the interviewer can update the session status
    if (session.interviewerId !== user.userId) {
      throw new Error("Only the interviewer can update the session status")
    }

    await ctx.db.patch(args.sessionId, {
      status: args.status,
      updatedAt: Date.now(),
    })

    return args.sessionId
  },
})

export const provideFeedback = mutation({
  args: {
    sessionId: v.id("interviewSessions"),
    feedback: v.string(),
    rating: v.number(),
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

    if (!user) {
      throw new Error("User not found")
    }

    const session = await ctx.db.get(args.sessionId)
    if (!session) {
      throw new Error("Session not found")
    }

    // Only the interviewer can provide feedback
    if (session.interviewerId !== user.userId) {
      throw new Error("Only the interviewer can provide feedback")
    }

    if (session.status !== "completed") {
      throw new Error("Can only provide feedback for completed sessions")
    }

    await ctx.db.patch(args.sessionId, {
      feedback: args.feedback,
      rating: args.rating,
      updatedAt: Date.now(),
    })

    return args.sessionId
  },
}) 
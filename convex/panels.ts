import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { Id } from "./_generated/dataModel"

export const createPanel = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    maxStudents: v.number(),
    duration: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not authenticated")
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first()

    if (!currentUser) {
      throw new Error("User not found")
    }

    const panelId = await ctx.db.insert("panels", {
      name: args.name,
      description: args.description,
      maxStudents: args.maxStudents,
      duration: args.duration,
      createdBy: currentUser._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return panelId
  },
})

export const getPanels = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not authenticated")
    }

    const panels = await ctx.db.query("panels").collect()
    return panels
  },
})

export const getPanelById = query({
  args: { panelId: v.id("panels") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not authenticated")
    }

    const panel = await ctx.db.get(args.panelId)
    return panel
  },
})

export const registerStudent = mutation({
  args: {
    panelId: v.id("panels"),
    studentId: v.id("users"),
    name: v.string(),
    email: v.string(),
    rollNumber: v.string(),
    department: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("You must be logged in to register for a panel")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first()

    if (!user || user.role !== "student") {
      throw new Error("Only students can register for panels")
    }

    // Check if panel exists
    const panel = await ctx.db.get(args.panelId)
    if (!panel) {
      throw new Error("Panel not found")
    }

    // Check if student is already registered
    const existingRegistration = await ctx.db
      .query("panelRegistrations")
      .withIndex("by_panel", (q) => q.eq("panelId", args.panelId))
      .filter((q) => q.eq(q.field("studentId"), args.studentId))
      .first()

    if (existingRegistration) {
      throw new Error("You are already registered for this panel")
    }

    // Check if panel is full
    const registrations = await ctx.db
      .query("panelRegistrations")
      .withIndex("by_panel", (q) => q.eq("panelId", args.panelId))
      .collect()

    if (registrations.length >= panel.maxStudents) {
      throw new Error("Panel is full")
    }

    const registrationId = await ctx.db.insert("panelRegistrations", {
      ...args,
      status: "registered",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return registrationId
  },
})

export const evaluateStudent = mutation({
  args: {
    registrationId: v.id("panelRegistrations"),
    technicalScore: v.number(),
    communicationScore: v.number(),
    problemSolvingScore: v.number(),
    feedback: v.string(),
    strengths: v.array(v.string()),
    areasForImprovement: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("You must be logged in to evaluate a student")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first()

    if (!user || !["admin", "faculty"].includes(user.role)) {
      throw new Error("Only faculty can evaluate students")
    }

    const registration = await ctx.db.get(args.registrationId)
    if (!registration) {
      throw new Error("Registration not found")
    }

    const panel = await ctx.db.get(registration.panelId)
    if (!panel) {
      throw new Error("Panel not found")
    }

    if (panel.createdBy !== user.userId && user.role !== "admin") {
      throw new Error("You can only evaluate students in your own panels")
    }

    const overallScore =
      (args.technicalScore + args.communicationScore + args.problemSolvingScore) / 3

    const evaluationId = await ctx.db.insert("panelEvaluations", {
      ...args,
      evaluatorId: user._id,
      overallScore,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    // Update registration status
    await ctx.db.patch(registration._id, {
      status: "evaluated",
      updatedAt: Date.now(),
    })

    return evaluationId
  },
})

export const getPanelRegistrations = query({
  args: { panelId: v.id("panels") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("You must be logged in to view registrations")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    const panel = await ctx.db.get(args.panelId)
    if (!panel) {
      throw new Error("Panel not found")
    }

    if (user.role === "student") {
      const registration = await ctx.db
        .query("panelRegistrations")
        .withIndex("by_panel", (q) => q.eq("panelId", args.panelId))
        .filter((q) => q.eq(q.field("studentId"), user._id))
        .first()

      return registration ? [registration] : []
    }

    if (user.role === "faculty" && panel.createdBy !== user.userId) {
      throw new Error("You can only view registrations for your own panels")
    }

    return await ctx.db
      .query("panelRegistrations")
      .withIndex("by_panel", (q) => q.eq("panelId", args.panelId))
      .collect()
  },
})

export const getStudentEvaluations = query({
  args: { studentId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("You must be logged in to view evaluations")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    if (user.role === "student" && user._id !== args.studentId) {
      throw new Error("You can only view your own evaluations")
    }

    const registrations = await ctx.db
      .query("panelRegistrations")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .collect()

    const evaluations = await Promise.all(
      registrations.map(async (registration) => {
        const evaluation = await ctx.db
          .query("panelEvaluations")
          .withIndex("by_registration", (q) =>
            q.eq("registrationId", registration._id)
          )
          .first()
        return {
          registration,
          evaluation,
        }
      })
    )

    return evaluations
  },
})

export const updatePanel = mutation({
  args: {
    panelId: v.id("panels"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    maxStudents: v.optional(v.number()),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not authenticated")
    }

    const panel = await ctx.db.get(args.panelId)
    if (!panel) {
      throw new Error("Panel not found")
    }

    await ctx.db.patch(args.panelId, {
      ...(args.name && { name: args.name }),
      ...(args.description && { description: args.description }),
      ...(args.maxStudents && { maxStudents: args.maxStudents }),
      ...(args.duration && { duration: args.duration }),
      updatedAt: Date.now(),
    })

    return { success: true }
  },
})

export const deletePanel = mutation({
  args: { panelId: v.id("panels") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not authenticated")
    }

    const panel = await ctx.db.get(args.panelId)
    if (!panel) {
      throw new Error("Panel not found")
    }

    await ctx.db.delete(args.panelId)
    return { success: true }
  },
}) 
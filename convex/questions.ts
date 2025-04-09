import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const createQuestion = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("You must be logged in to create a question")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first()

    if (!user || !["admin", "faculty"].includes(user.role)) {
      throw new Error("You must be an admin or faculty to create questions")
    }

    // Check if the interview exists and the user has access to it
    const interview = await ctx.db.get(args.interviewId)
    if (!interview) {
      throw new Error("Interview not found")
    }

    if (user.role === "faculty" && interview.createdBy !== user.userId) {
      throw new Error("You don't have permission to add questions to this interview")
    }

    const questionId = await ctx.db.insert("questions", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return questionId
  },
})

export const getQuestions = query({
  args: { interviewId: v.id("interviews") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("You must be logged in to view questions")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    // Check if the interview exists
    const interview = await ctx.db.get(args.interviewId)
    if (!interview) {
      throw new Error("Interview not found")
    }

    // Students can only view questions for interviews they're scheduled for
    if (user.role === "student") {
      const session = await ctx.db
        .query("interviewSessions")
        .withIndex("by_interview", (q) => q.eq("interviewId", args.interviewId))
        .filter((q) => q.eq(q.field("intervieweeId"), user.userId))
        .first()

      if (!session) {
        throw new Error("You don't have access to these questions")
      }
    }

    return await ctx.db
      .query("questions")
      .withIndex("by_interview", (q) => q.eq("interviewId", args.interviewId))
      .collect()
  },
})

export const updateQuestion = mutation({
  args: {
    questionId: v.id("questions"),
    question: v.optional(v.string()),
    type: v.optional(
      v.union(
        v.literal("technical"),
        v.literal("behavioral"),
        v.literal("case"),
        v.literal("general")
      )
    ),
    difficulty: v.optional(v.union(v.literal("easy"), v.literal("medium"), v.literal("hard"))),
    category: v.optional(v.string()),
    sampleAnswer: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("You must be logged in to update a question")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first()

    if (!user || !["admin", "faculty"].includes(user.role)) {
      throw new Error("You must be an admin or faculty to update questions")
    }

    const question = await ctx.db.get(args.questionId)
    if (!question) {
      throw new Error("Question not found")
    }

    // Get the interview to check permissions
    const interview = await ctx.db.get(question.interviewId)
    if (!interview) {
      throw new Error("Interview not found")
    }

    if (user.role === "faculty" && interview.createdBy !== user.userId) {
      throw new Error("You don't have permission to update questions in this interview")
    }

    await ctx.db.patch(args.questionId, {
      ...args,
      updatedAt: Date.now(),
    })

    return args.questionId
  },
})

export const deleteQuestion = mutation({
  args: { questionId: v.id("questions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("You must be logged in to delete a question")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first()

    if (!user || !["admin", "faculty"].includes(user.role)) {
      throw new Error("You must be an admin or faculty to delete questions")
    }

    const question = await ctx.db.get(args.questionId)
    if (!question) {
      throw new Error("Question not found")
    }

    // Get the interview to check permissions
    const interview = await ctx.db.get(question.interviewId)
    if (!interview) {
      throw new Error("Interview not found")
    }

    if (user.role === "faculty" && interview.createdBy !== user.userId) {
      throw new Error("You don't have permission to delete questions from this interview")
    }

    await ctx.db.delete(args.questionId)
    return args.questionId
  },
}) 
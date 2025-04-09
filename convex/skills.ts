import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const createSkill = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    description: v.string(),
    resources: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("You must be logged in to create a skill")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first()

    if (!user || !["admin", "faculty"].includes(user.role)) {
      throw new Error("Only admins and faculty can create skills")
    }

    const skillId = await ctx.db.insert("skills", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return skillId
  },
})

export const getSkills = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("You must be logged in to view skills")
    }

    let skillsQuery = ctx.db.query("skills")

    if (args.category) {
      skillsQuery = skillsQuery.withIndex("by_category", (q) =>
        q.eq("category", args.category)
      )
    }

    return await skillsQuery.collect()
  },
})

export const updateSkill = mutation({
  args: {
    skillId: v.id("skills"),
    name: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    resources: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("You must be logged in to update a skill")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first()

    if (!user || !["admin", "faculty"].includes(user.role)) {
      throw new Error("Only admins and faculty can update skills")
    }

    const skill = await ctx.db.get(args.skillId)
    if (!skill) {
      throw new Error("Skill not found")
    }

    await ctx.db.patch(args.skillId, {
      ...args,
      updatedAt: Date.now(),
    })

    return args.skillId
  },
})

export const deleteSkill = mutation({
  args: { skillId: v.id("skills") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("You must be logged in to delete a skill")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first()

    if (!user || !["admin", "faculty"].includes(user.role)) {
      throw new Error("Only admins and faculty can delete skills")
    }

    const skill = await ctx.db.get(args.skillId)
    if (!skill) {
      throw new Error("Skill not found")
    }

    await ctx.db.delete(args.skillId)
    return args.skillId
  },
})

export const addUserSkills = mutation({
  args: {
    skills: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("You must be logged in to update your skills")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    // Verify that all skills exist
    for (const skillName of args.skills) {
      const skill = await ctx.db
        .query("skills")
        .filter((q) => q.eq(q.field("name"), skillName))
        .first()

      if (!skill) {
        throw new Error(`Skill "${skillName}" not found`)
      }
    }

    await ctx.db.patch(user._id, {
      skills: args.skills,
      updatedAt: Date.now(),
    })

    return user._id
  },
}) 
import { query } from "./_generated/server"
import { v } from "convex/values"

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return null
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first()

    return user
  },
})

export const mustGetCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("You must be logged in to perform this action")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first()

    if (!user) {
      throw new Error("You must be logged in to perform this action")
    }

    return user
  },
})

export const checkRole = query({
  args: {
    requiredRoles: v.array(v.union(v.literal("admin"), v.literal("faculty"), v.literal("student"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("You must be logged in to perform this action")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first()

    if (!user) {
      throw new Error("You must be logged in to perform this action")
    }

    if (!args.requiredRoles.includes(user.role)) {
      throw new Error(`You must be one of: ${args.requiredRoles.join(", ")} to perform this action`)
    }

    return user
  },
}) 
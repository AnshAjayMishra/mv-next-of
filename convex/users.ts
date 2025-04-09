import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { Id } from "./_generated/dataModel"

export const createUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("faculty"), v.literal("student")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not authenticated")
    }

    const userId = await ctx.db.insert("users", {
      userId: args.userId,
      email: args.email,
      name: args.name,
      role: args.role,
      skills: [],
      bio: "",
      industry: "",
      experience: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return userId
  },
})

export const getCurrentUser = query({
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

export const getAllUsers = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not authenticated")
    }

    const users = await ctx.db.query("users").collect()
    return users
  },
})

export const updateUser = mutation({
  args: {
    userId: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.union(v.literal("admin"), v.literal("faculty"), v.literal("student"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not authenticated")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    await ctx.db.patch(user._id, {
      ...(args.name && { name: args.name }),
      ...(args.email && { email: args.email }),
      ...(args.role && { role: args.role }),
      updatedAt: Date.now(),
    })

    return { success: true }
  },
})

export const assignRole = mutation({
  args: {
    userId: v.string(),
    role: v.union(v.literal("admin"), v.literal("faculty"), v.literal("student")),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("You must be logged in to assign roles")
    }

    // Check if the current user is an admin
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first()

    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("Only admins can assign roles")
    }

    // Check if user already has a role
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first()

    if (existingUser) {
      throw new Error("User already has a role assigned")
    }

    // Create new user with all required fields
    const userId = await ctx.db.insert("users", {
      userId: args.userId,
      email: args.email,
      name: args.name,
      role: args.role,
      skills: [],
      bio: "",
      industry: "",
      experience: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return userId
  },
})

export const updateRole = mutation({
  args: {
    userId: v.string(),
    role: v.union(v.literal("admin"), v.literal("faculty"), v.literal("student")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("You must be logged in to update roles")
    }

    // Check if the current user is an admin
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first()

    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("Only admins can update roles")
    }

    // Update user role
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    await ctx.db.patch(user._id, {
      role: args.role,
      updatedAt: Date.now(),
    })

    return user._id
  },
})

export const setInitialAdmin = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if any admin exists
    const existingAdmin = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "admin"))
      .first()

    if (existingAdmin) {
      throw new Error("Admin already exists")
    }

    // Create new admin user with all required fields
    await ctx.db.insert("users", {
      userId: args.userId,
      email: args.email,
      name: args.name,
      role: "admin",
      skills: [],
      bio: "",
      industry: "",
      experience: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return { success: true }
  },
})

export const updateUserRole = mutation({
  args: {
    userId: v.string(),
    role: v.union(v.literal("admin"), v.literal("faculty"), v.literal("student")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not authenticated")
    }

    // Check if the current user is an admin
    const currentUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first()

    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("Only admins can update roles")
    }

    // Find the user by Clerk userId
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    // Update the user's role
    await ctx.db.patch(user._id, {
      role: args.role,
      updatedAt: Date.now(),
    })

    return { success: true }
  },
})

export const forceSetAdmin = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the user
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    // Update the user's role to admin
    await ctx.db.patch(user._id, {
      role: "admin",
      updatedAt: Date.now(),
    })

    return user._id
  },
})

export const createOrUpdateAdmin = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first()

    if (existingUser) {
      // Update existing user to admin
      await ctx.db.patch(existingUser._id, {
        role: "admin",
        updatedAt: Date.now(),
      })
      return existingUser._id
    } else {
      // Create new admin user
      const userId = await ctx.db.insert("users", {
        userId: args.userId,
        email: args.email,
        name: args.name,
        role: "admin",
        skills: [],
        bio: "",
        industry: "",
        experience: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      return userId
    }
  },
}) 
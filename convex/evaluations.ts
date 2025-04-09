import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const createEvaluation = mutation({
  args: {
    studentId: v.id("students"),
    panelId: v.id("panels"),
    technicalScore: v.number(),
    communicationScore: v.number(),
    feedback: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.insert("evaluations", {
      ...args,
      evaluatedBy: identity.subject,
    });
  },
});

export const getEvaluationsByPanel = query({
  args: { panelId: v.id("panels") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    return await ctx.db
      .query("evaluations")
      .filter((q) => q.eq(q.field("panelId"), args.panelId))
      .collect();
  },
});

export const getStudentEvaluations = query({
  args: { studentId: v.id("students") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    return await ctx.db
      .query("evaluations")
      .filter((q) => q.eq(q.field("studentId"), args.studentId))
      .collect();
  },
}); 
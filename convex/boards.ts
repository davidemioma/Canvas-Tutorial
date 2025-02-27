import { v } from "convex/values";
import { mutation } from "./_generated/server";

const images = ["/placeh"];

export const createBoard = mutation({
  args: {
    orgId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    // Auth
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorised");
    }

    const userId = identity.subject;

    // Create Board
    const document = await ctx.db.insert("boards", {
      userId,
      title: args.title,
      parentDocument: args.parentDocument,
      isArchived: false,
      isPublished: false,
    });

    return document;
  },
});

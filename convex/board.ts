import { v } from "convex/values";
import { mutation } from "./_generated/server";

const images = [
  "/placeholders/1.svg",
  "/placeholders/2.svg",
  "/placeholders/3.svg",
  "/placeholders/4.svg",
  "/placeholders/5.svg",
  "/placeholders/6.svg",
  "/placeholders/7.svg",
  "/placeholders/8.svg",
  "/placeholders/9.svg",
  "/placeholders/10.svg",
];

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

    // Create Board
    const randomImage = images[Math.floor(Math.random() * images.length)];

    const board = await ctx.db.insert("boards", {
      orgId: args.orgId,
      title: args.title,
      authorId: identity.subject,
      authorName: identity.name as string,
      imageUrl: randomImage,
    });

    return board;
  },
});

export const deleteBoard = mutation({
  args: {
    id: v.id("boards"),
  },
  handler: async (ctx, args) => {
    // Auth
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorised");
    }

    // delete favorites

    // delete Board
    await ctx.db.delete(args.id);
  },
});

export const updateBoard = mutation({
  args: {
    id: v.id("boards"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    // Auth
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorised");
    }

    const title = args.title.trim();

    if (!title) {
      throw new Error("Title is required");
    }

    if (title.length > 60) {
      throw new Error("Title cannot be longer than 60 characters.");
    }

    // update Board
    await ctx.db.patch(args.id, { title: args.title });
  },
});

export const favoriteAction = mutation({
  args: {
    id: v.id("boards"),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    // Auth
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorised");
    }
  },
});

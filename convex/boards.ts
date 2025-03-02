import { v } from "convex/values";
import { query } from "./_generated/server";

export const getBoards = query({
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    favorites: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorised");
    }

    const query = args.search as string;

    let boards = [];

    if (query.trim().length > 0) {
      boards = await ctx.db
        .query("boards")
        .withSearchIndex("search_title", (q) =>
          q.search("title", query).eq("orgId", args.orgId)
        )
        .collect();
    } else {
      boards = await ctx.db
        .query("boards")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
        .order("desc")
        .collect();
    }

    const allBoards = await Promise.all(
      boards.map(async (board) => {
        const favourite = await ctx.db
          .query("userFavorites")
          .withIndex("by_user_board_org", (q) =>
            q
              .eq("userId", identity.subject)
              .eq("boardId", board._id)
              .eq("orgId", args.orgId)
          )
          .unique();

        return { ...board, isFavourite: !!favourite };
      })
    );

    return allBoards;
  },
});

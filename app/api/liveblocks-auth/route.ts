import { api } from "@/convex/_generated/api";
import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { auth, currentUser } from "@clerk/nextjs/server";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCK_SECRET_KEY as string,
});

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

export async function POST(request: Request) {
  // Get the current user from your database
  const authorization = await auth();

  const user = await currentUser();

  if (!authorization || !user) {
    return new Response("Unauthorized, You need to sign in!", { status: 401 });
  }

  // Room from liveblocks
  const { room } = await request.json();

  if (!room) {
    return new Response("Unauthorized, Room id is required!", { status: 401 });
  }

  const board = await convex.query(api.board.getBoardInfo, {
    id: room,
  });

  // Check if user belongs to board organization
  if (board?.orgId !== authorization.orgId) {
    return new Response(
      "Unauthorized, You're not a member of this organization",
      {
        status: 401,
      }
    );
  }

  // Start an auth session inside your endpoint
  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name:
        user.username || `${user.firstName} ${user.lastName}` || "Annonymous",
      picture: user.imageUrl,
    },
  });

  // Giving the user read and write access on their group
  session.allow(room, session.FULL_ACCESS);

  // Authorize the user and return the result
  const { status, body } = await session.authorize();

  return new Response(body, { status });
}

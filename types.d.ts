import { Id } from "./convex/_generated/dataModel";

export type BoardType = {
  _id: Id<"boards">;
  _creationTime: number;
  orgId: string;
  title: string;
  authorId: string;
  authorName: string;
  imageUrl: string;
  isFavourite: boolean;
};

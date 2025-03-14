import { Room } from "@/components/room";
import Canvas from "./_components/Canvas";
import CanvasLoading from "./_components/CanvasLoading";

export default async function BoardPage({
  params,
}: {
  params: Promise<{
    boardId?: string;
  }>;
}) {
  const { boardId } = await params;

  return (
    <div className="w-full h-screen">
      <Room roomId={boardId as string} fallback={<CanvasLoading />}>
        <Canvas boardId={boardId as string} />
      </Room>
    </div>
  );
}

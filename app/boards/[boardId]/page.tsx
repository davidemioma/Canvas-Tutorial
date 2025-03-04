import { Room } from "@/components/room";
import Canvas from "./_components/Canvas";
import CanvasLoading from "./_components/CanvasLoading";

export default function BoardPage({
  params: { boardId },
}: {
  params: {
    boardId?: string;
  };
}) {
  return (
    <div className="w-full h-screen">
      <Room roomId={boardId as string} fallback={<CanvasLoading />}>
        <Canvas boardId={boardId as string} />
      </Room>
    </div>
  );
}

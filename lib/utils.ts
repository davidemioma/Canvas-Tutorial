import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Camera, Color, Point, Side, XYWH } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COLORS = [
  "#FF5733", // Coral red
  "#33A8FF", // Sky blue
  "#4CAF50", // Material green
  "#9C27B0", // Purple
  "#FFC107", // Amber
  "#FF4081", // Pink
  "#2196F3", // Blue
  "#FF9800", // Orange
  "#00BCD4", // Cyan
  "#8BC34A", // Light green
];

export const getBorderColor = (connId: number): string => {
  return COLORS[connId % COLORS.length];
};

export const pointerEventToCursorPoint = ({
  e,
  camera,
}: {
  e: React.PointerEvent;
  camera: Camera;
}) => {
  const point = {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  };

  return point;
};

export const MAX_LAYERS = 100;

export const SELECTION_NET_THRESHOLD = 5;

export const colorToCss = (color: Color) => {
  return `#${color.r.toString(16).padStart(2, "0")}${color.g.toString(16).padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`;
};

export const resizeBounds = ({
  bounds,
  corner,
  point,
}: {
  bounds: XYWH;
  corner: Side;
  point: Point;
}): XYWH => {
  const result: XYWH = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  };

  if ((corner & Side.Left) === Side.Left) {
    result.x = Math.min(point.x, bounds.x + bounds.width);

    result.width = Math.abs(bounds.x + bounds.width - point.x);
  }

  if ((corner & Side.Right) === Side.Right) {
    result.x = Math.min(point.x, bounds.x);

    result.width = Math.abs(point.x - bounds.x);
  }

  if ((corner & Side.Top) === Side.Top) {
    result.y = Math.min(point.y, bounds.y + bounds.height);

    result.height = Math.abs(bounds.y + bounds.height - point.y);
  }

  if ((corner & Side.Bottom) === Side.Bottom) {
    result.y = Math.min(point.y, bounds.y);

    result.height = Math.abs(point.y - bounds.y);
  }

  return result;
};

export const findIntersectingLayersWithRectangle = () => {};

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Camera, Color, Layer, Point, Side, XYWH } from "@/types";

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

export const findIntersectingLayersWithRectangle = (
  layers: ReadonlyMap<string, Layer>,
  layersIds: readonly string[],
  a: Point,
  b: Point
) => {
  const rect = {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y),
  };

  const ids: string[] = [];

  for (const layerId of layersIds) {
    const layer = layers.get(layerId);

    if (!layer) continue;

    const { x, y, width, height } = layer;

    if (
      rect.x + rect.width > x &&
      rect.x < x + width &&
      rect.y + rect.height > y &&
      rect.y < y + height
    ) {
      ids.push(layerId);
    }
  }

  return ids;
};

export const calculateFontSize = ({
  width,
  height,
  isNote,
}: {
  width: number;
  height: number;
  isNote?: boolean;
}) => {
  const maxFontSize = 96;

  const scaleFactor = isNote ? 0.15 : 0.5;

  const fontWidth = width * scaleFactor;

  const fontHeight = height * scaleFactor;

  return Math.min(fontHeight, fontWidth, maxFontSize);
};

export const getConstractingTextColor = (color: Color) => {
  const luminance = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;

  return luminance > 182 ? "black" : "white";
};

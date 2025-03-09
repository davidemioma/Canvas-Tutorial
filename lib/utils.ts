import { Camera, Color } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export const colorToCss = (color: Color) => {
  return `#${color.r.toString(16).padStart(2, "0")}${color.g.toString(16).padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`;
};

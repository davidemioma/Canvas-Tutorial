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

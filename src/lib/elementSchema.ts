interface PptElement {
  id: number;
  type: "rect" | "text" | "image";
  x: number;
  y: number;
  width: number;
  height: number;
  src?: string;
  color?: string;
  text?: string;
  fontSize?: number;
  isBold?: boolean;
}

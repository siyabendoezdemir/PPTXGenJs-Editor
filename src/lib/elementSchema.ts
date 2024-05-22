interface PptElement {
  id: number;
  type: "rect" | "text" | "image";
  x: number;
  y: number;
  width: number;
  height: number;
  src?: string;
}

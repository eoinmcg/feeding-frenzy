export type Point = { x: number; y: number };

export interface UseInputReturn {
  mouseClick: Point | null;
  touchPosition: Point | null;
  p1Touch: Point | null;
  p2Touch: Point | null;
}

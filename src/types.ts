export type Point = { x: number; y: number };

export type UseInputReturn = {
  mousePosition: Point | null;
  mouseClick: Point | null;
  touchPosition: Point | null;
};

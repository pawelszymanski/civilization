export enum RiverEdgeBit {
  N = 1,
  NE = 2,
  SE = 4,
  S = 8,
  SW = 16,
  NW = 32,
}

export type RiverEdgeDir = 0 | 1 | 2 | 3 | 4 | 5;

export const RIVER_EDGE_BITS: RiverEdgeBit[] = [1, 2, 4, 8, 16, 32];

export const OPPOSITE_EDGE: Record<RiverEdgeDir, RiverEdgeDir> = {
  0: 3,
  1: 4,
  2: 5,
  3: 0,
  4: 1,
  5: 2,
};

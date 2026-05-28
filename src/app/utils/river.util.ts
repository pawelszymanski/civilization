import { Tile, Map } from '../models/map';
import { Coords } from '../models/utils';
import { RiverEdgeDir, RIVER_EDGE_BITS, OPPOSITE_EDGE } from '../models/river';

export function hasRiverOnEdge(tile: Tile, dir: RiverEdgeDir): boolean {
  if (!tile.rivers) return false;
  return (tile.rivers & RIVER_EDGE_BITS[dir]) !== 0;
}

export function setRiverOnEdge(tile: Tile, dir: RiverEdgeDir): void {
  const bit = RIVER_EDGE_BITS[dir];
  if (!tile.rivers) {
    tile.rivers = bit;
  } else {
    tile.rivers |= bit;
  }
}

export function clearRiverOnEdge(tile: Tile, dir: RiverEdgeDir): void {
  if (!tile.rivers) return;
  const bit = RIVER_EDGE_BITS[dir];
  tile.rivers &= ~bit;
  if (tile.rivers === 0) {
    tile.rivers = undefined;
  }
}

export function getRiverEdges(tile: Tile): RiverEdgeDir[] {
  if (!tile.rivers) return [];
  const edges: RiverEdgeDir[] = [];
  for (let i = 0; i < 6; i++) {
    if ((tile.rivers & RIVER_EDGE_BITS[i]) !== 0) {
      edges.push(i as RiverEdgeDir);
    }
  }
  return edges;
}

export function neighborCoords(tile: Tile, dir: RiverEdgeDir, map: Map): Coords | null {
  const { x, y } = tile.grid;
  const isOdd = y % 2 === 1;
  const width = map.width;

  let nx = x;
  let ny = y;

  if (isOdd) {
    switch (dir) {
      case 0: ny--; nx = x; break;
      case 1: ny--; nx = x + 1; break;
      case 2: ny++; nx = x + 1; break;
      case 3: ny++; nx = x; break;
      case 4: ny--; nx = x; break;
      case 5: ny++; nx = x - 1; break;
    }
  } else {
    switch (dir) {
      case 0: ny--; nx = x - 1; break;
      case 1: ny--; nx = x; break;
      case 2: ny++; nx = x; break;
      case 3: ny++; nx = x - 1; break;
      case 4: ny--; nx = x; break;
      case 5: ny++; nx = x + 1; break;
    }
  }

  if (ny < 0 || ny >= map.height) {
    return null;
  }

  nx = (((nx % width) + width) % width);

  return { x: nx, y: ny };
}

export function setRiverOnEdgeBothSides(map: Map, tile: Tile, dir: RiverEdgeDir): void {
  setRiverOnEdge(tile, dir);

  const neighborCoord = neighborCoords(tile, dir, map);
  if (neighborCoord) {
    const neighborTile = map.tiles.find(t => t.grid.x === neighborCoord.x && t.grid.y === neighborCoord.y);
    if (neighborTile) {
      setRiverOnEdge(neighborTile, OPPOSITE_EDGE[dir]);
    }
  }
}

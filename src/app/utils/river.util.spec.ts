import { Tile, Map } from '../models/map';
import { RiverEdgeDir, RIVER_EDGE_BITS, OPPOSITE_EDGE } from '../models/river';
import { TerrainBaseId, TerrainFeatureId, TerrainResourceId, TerrainImprovementId } from '../models/terrain';
import {
  hasRiverOnEdge,
  setRiverOnEdge,
  clearRiverOnEdge,
  getRiverEdges,
  neighborCoords,
  setRiverOnEdgeBothSides,
} from './river.util';

describe('River Util', () => {
  let testTile: Tile;
  let testMap: Map;

  beforeEach(() => {
    testTile = {
      grid: { x: 5, y: 5 },
      terrain: {
        base: { id: TerrainBaseId.GRASSLAND_FLAT, uiVariant: 0 },
        feature: { id: TerrainFeatureId.NONE, uiVariant: 0 },
        resourceId: TerrainResourceId.NONE,
        improvementId: TerrainImprovementId.NONE,
      },
    };

    testMap = {
      width: 100,
      height: 100,
      tiles: [testTile],
    };
  });

  describe('hasRiverOnEdge', () => {
    it('should return false for undefined rivers', () => {
      expect(hasRiverOnEdge(testTile, 0 as RiverEdgeDir)).toBe(false);
    });

    it('should return true when edge is set', () => {
      testTile.rivers = RIVER_EDGE_BITS[0];
      expect(hasRiverOnEdge(testTile, 0 as RiverEdgeDir)).toBe(true);
    });

    it('should return false when edge is not set', () => {
      testTile.rivers = RIVER_EDGE_BITS[1];
      expect(hasRiverOnEdge(testTile, 0 as RiverEdgeDir)).toBe(false);
    });
  });

  describe('setRiverOnEdge', () => {
    it('should set river bit when undefined', () => {
      setRiverOnEdge(testTile, 0 as RiverEdgeDir);
      expect(testTile.rivers).toBe(RIVER_EDGE_BITS[0]);
    });

    it('should set multiple river bits', () => {
      setRiverOnEdge(testTile, 0 as RiverEdgeDir);
      setRiverOnEdge(testTile, 1 as RiverEdgeDir);
      expect(testTile.rivers).toBe(RIVER_EDGE_BITS[0] | RIVER_EDGE_BITS[1]);
    });

    it('should not duplicate when setting same edge twice', () => {
      setRiverOnEdge(testTile, 0 as RiverEdgeDir);
      const firstSet = testTile.rivers;
      setRiverOnEdge(testTile, 0 as RiverEdgeDir);
      expect(testTile.rivers).toBe(firstSet);
    });
  });

  describe('clearRiverOnEdge', () => {
    it('should clear specific bit', () => {
      testTile.rivers = RIVER_EDGE_BITS[0] | RIVER_EDGE_BITS[1];
      clearRiverOnEdge(testTile, 0 as RiverEdgeDir);
      expect(testTile.rivers).toBe(RIVER_EDGE_BITS[1]);
    });

    it('should set rivers to undefined when all cleared', () => {
      testTile.rivers = RIVER_EDGE_BITS[0];
      clearRiverOnEdge(testTile, 0 as RiverEdgeDir);
      expect(testTile.rivers).toBeUndefined();
    });

    it('should handle clearing from undefined', () => {
      clearRiverOnEdge(testTile, 0 as RiverEdgeDir);
      expect(testTile.rivers).toBeUndefined();
    });
  });

  describe('getRiverEdges', () => {
    it('should return empty array when no rivers', () => {
      expect(getRiverEdges(testTile)).toEqual([]);
    });

    it('should return all set edges', () => {
      testTile.rivers = RIVER_EDGE_BITS[0] | RIVER_EDGE_BITS[2] | RIVER_EDGE_BITS[5];
      const edges = getRiverEdges(testTile);
      expect(edges).toContain(0);
      expect(edges).toContain(2);
      expect(edges).toContain(5);
      expect(edges.length).toBe(3);
    });

    it('should return all 6 edges when fully set', () => {
      let fullBitmask = 0;
      for (let i = 0; i < 6; i++) {
        fullBitmask |= RIVER_EDGE_BITS[i];
      }
      testTile.rivers = fullBitmask;
      const edges = getRiverEdges(testTile);
      expect(edges.length).toBe(6);
    });
  });

  describe('Set/clear round-trip', () => {
    it('should handle set then clear', () => {
      for (let i = 0; i < 6; i++) {
        testTile.rivers = undefined;
        setRiverOnEdge(testTile, i as RiverEdgeDir);
        expect(hasRiverOnEdge(testTile, i as RiverEdgeDir)).toBe(true);
        clearRiverOnEdge(testTile, i as RiverEdgeDir);
        expect(hasRiverOnEdge(testTile, i as RiverEdgeDir)).toBe(false);
      }
    });
  });

  describe('neighborCoords', () => {
    it('should return valid neighbor coordinates', () => {
      for (let dir = 0; dir < 6; dir++) {
        const neighbor = neighborCoords(testTile, dir as RiverEdgeDir, testMap);
        expect(neighbor).not.toBeNull();
        expect(neighbor!.x).toBeGreaterThanOrEqual(0);
        expect(neighbor!.x).toBeLessThan(testMap.width);
        expect(neighbor!.y).toBeGreaterThanOrEqual(0);
        expect(neighbor!.y).toBeLessThan(testMap.height);
      }
    });

    it('should return null for out of bounds neighbors', () => {
      const topTile = { ...testTile, grid: { x: 5, y: 0 } };
      const neighbor = neighborCoords(topTile, 0 as RiverEdgeDir, testMap);
      expect(neighbor).toBeNull();
    });

    it('should wrap horizontally at map edges', () => {
      const rightEdgeTile = { ...testTile, grid: { x: 99, y: 5 } };
      const neighbor = neighborCoords(rightEdgeTile, 1 as RiverEdgeDir, testMap);
      expect(neighbor).not.toBeNull();
      expect(neighbor!.x).toBe(0);
    });
  });

  describe('setRiverOnEdgeBothSides', () => {
    it('should set river on both tiles', () => {
      const neighbor: Tile = {
        grid: { x: 6, y: 5 },
        terrain: testTile.terrain,
      };
      testMap.tiles.push(neighbor);

      setRiverOnEdgeBothSides(testMap, testTile, 1 as RiverEdgeDir);

      expect(hasRiverOnEdge(testTile, 1 as RiverEdgeDir)).toBe(true);
      expect(hasRiverOnEdge(neighbor, OPPOSITE_EDGE[1])).toBe(true);
    });

    it('should maintain opposite symmetry', () => {
      const testDirs = [0, 1, 2, 3, 4, 5] as RiverEdgeDir[];
      for (const dir of testDirs) {
        const opposite = OPPOSITE_EDGE[dir];
        expect(OPPOSITE_EDGE[opposite]).toBe(dir);
      }
    });
  });
});

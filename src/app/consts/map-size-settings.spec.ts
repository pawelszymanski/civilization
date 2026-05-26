import { MAP_SIZE_SETTINGS_LIST } from './map-size-settings.const';
import { MapSizeId } from '../models/map-size';

describe('MAP_SIZE_SETTINGS_LIST', () => {
  it('contains all map sizes in order', () => {
    const ids = MAP_SIZE_SETTINGS_LIST.map(s => s.id);
    expect(ids).toEqual([
      MapSizeId.DUEL,
      MapSizeId.TINY,
      MapSizeId.SMALL,
      MapSizeId.STANDARD,
      MapSizeId.LARGE,
      MapSizeId.HUGE,
      MapSizeId.GIANT,
      MapSizeId.MAX,
    ]);
  });

  it('each size has larger dimensions than the previous', () => {
    for (let i = 1; i < MAP_SIZE_SETTINGS_LIST.length; i++) {
      const prev = MAP_SIZE_SETTINGS_LIST[i - 1];
      const curr = MAP_SIZE_SETTINGS_LIST[i];
      expect(curr.width).toBeGreaterThan(prev.width);
      expect(curr.height).toBeGreaterThan(prev.height);
    }
  });
});

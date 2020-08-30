import {Yield} from '../../models/game-map/yield';
import {OffMapResourceId} from '../../models/game-map/off-map-respource';

interface OffMapResource {
  name: string;
  yield: Partial<Yield>;
}

type OffMapResourceDb = {
  [key in OffMapResourceId]: OffMapResource;
}

export const OFF_MAP_RESOURCE_DB: OffMapResourceDb = {
  [OffMapResourceId.CINNAMON]: {
    name: 'Cinnamon',
    yield: {}
  },
  [OffMapResourceId.CLOVES]: {
    name: 'Cloves',
    yield: {}
  },
  [OffMapResourceId.COSMETICS]: {
    name: 'Cosmetics',
    yield: {}
  },
  [OffMapResourceId.JEANS]: {
    name: 'Jeans',
    yield: {}
  },
  [OffMapResourceId.PERFUME]: {
    name: 'Perfume',
    yield: {}
  },
  [OffMapResourceId.TOYS]: {
    name: 'Toys',
    yield: {}
  }
}

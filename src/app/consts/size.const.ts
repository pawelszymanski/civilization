import {Size} from '../models/size';

export const DEFAULT_SIZE: Size = {
  tile: {
    width: 0,
    height: 0,
    halfWidth: 0,
    halfHeight: 0,
    oneQuarterWidth: 0,
    oneQuarterHeight: 0,
    threeQuarterWidth: 0,
    threeQuarterHeight: 0,
  },
  row: {
    width: 0,
    height: 0,
  },
  map: {
    width: 0,
    height: 0,
  },
  screen: {
    width: 0,
    height: 0,
    halfWidth: 0,
    halfHeight: 0,
  },
  vertices: [
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0}
  ]
};

import {YieldId} from '../models/yield';

export const YIELD_IDS_IN_ORDER = [
  YieldId.FOOD,
  YieldId.PRODUCTION,
  YieldId.GOLD,
  YieldId.SCIENCE,
  YieldId.CULTURE,
  YieldId.FAITH,
  YieldId.POWER,
  YieldId.TOURISM
];

export const YIELD_ID_TO_ICON_CLASS_MAP = {
  [YieldId.FOOD]: 'fa-leaf',
  [YieldId.PRODUCTION]: 'fa-cog',
  [YieldId.GOLD]: 'fa-btc',
  [YieldId.SCIENCE]: 'fa-flask',
  [YieldId.CULTURE]: 'fa-music',
  [YieldId.FAITH]: 'fa-fire',
  [YieldId.POWER]: 'fa-bolt',
  [YieldId.TOURISM]: 'fa-suitcase'
};

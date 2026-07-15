import { collectRemoteOk } from './remoteOkCollector';
import { collectRemotive } from './remotiveCollector';
import { collectArbeitnow } from './arbeitnowCollector';
import { collectReddit } from './redditCollector';

export const COLLECTORS = {
  remoteok: collectRemoteOk,
  remotive: collectRemotive,
  arbeitnow: collectArbeitnow,
  reddit: collectReddit,
};

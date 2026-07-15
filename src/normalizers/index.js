import { normalizeRemoteOkItem } from './remoteOkNormalizer';
import { normalizeRemotiveItem } from './remotiveNormalizer';
import { normalizeArbeitnowItem } from './arbeitnowNormalizer';
import { normalizeRedditItem } from './redditNormalizer';

export const NORMALIZERS = {
  remoteok: normalizeRemoteOkItem,
  remotive: normalizeRemotiveItem,
  arbeitnow: normalizeArbeitnowItem,
  reddit: normalizeRedditItem,
};

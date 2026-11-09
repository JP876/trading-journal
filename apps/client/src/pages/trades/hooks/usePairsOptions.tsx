import { getDefaultStore, useAtomValue } from 'jotai';
import { useMemo } from 'react';

import { pairsAtom } from '../../../atoms';
import type { AutocompleteOption } from '../../../types';
import type { Pair } from '../../../types/pair';

const formatAssetClass = (assetClass: Pair['assetClass']) => {
  switch (assetClass) {
    case 'forex_major':
      return 'FX Major';
    case 'forex_minor':
      return 'FX Minor';
    case 'forex_exotic':
      return 'FX Exotic';
    case 'commodity':
      return 'Commodity';
    case 'crypto':
      return 'Crypto';
  }
};

const formatPairsData = (data: Pair[]) => {
  return data.map((pair) => ({
    value: pair.id,
    label: pair.pair,
    groupBy: formatAssetClass(pair.assetClass),
  }));
};

const usePairsOptions = () => {
  const pairs = useAtomValue(pairsAtom, { store: getDefaultStore() });

  return useMemo<AutocompleteOption[]>(() => {
    if (!Array.isArray(pairs)) return [];
    return formatPairsData(pairs);
  }, [pairs]);
};

export default usePairsOptions;

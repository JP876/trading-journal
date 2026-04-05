import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import type { Pair } from '../../../types/pair';
import { getPairs } from '../../../api/pairs';
import { QueryKey } from '../../../enums';
import type { AutocompleteOption } from '../../../types';

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

const usePairsOptions = () => {
  const pairsQuery = useQuery<Pair[]>({
    queryKey: [QueryKey.PAIRS],
    queryFn: () => getPairs(),
    staleTime: Infinity,
  });

  return useMemo<AutocompleteOption[]>(() => {
    if (!Array.isArray(pairsQuery.data)) return [];
    return pairsQuery.data.map((pair) => ({
      value: pair.id,
      label: pair.pair,
      groupBy: formatAssetClass(pair.assetClass),
    }));
  }, [pairsQuery.data]);
};

export default usePairsOptions;

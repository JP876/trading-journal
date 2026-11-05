import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getPairs } from '../../../api/pairs';
import { QueryKey } from '../../../enums';
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
  const pairsQuery = useQuery<Pair[]>({
    queryKey: [QueryKey.PAIRS],
    queryFn: () => getPairs(),
    staleTime: Infinity,
  });

  return useMemo<AutocompleteOption[]>(() => {
    if (!Array.isArray(pairsQuery.data)) return [];
    return formatPairsData(pairsQuery.data);
  }, [pairsQuery.isFetched]);
};

export default usePairsOptions;

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import type { Pair } from '../../../types/pair';
import type { AutocompleteOption } from '../../../components/form/AutocompleteInput';
import { getPairs } from '../../../api/pairs';

const usePairsOptions = () => {
  const pairsQuery = useQuery<Pair[]>({
    queryKey: ['pairs'],
    queryFn: () => getPairs(),
    staleTime: Infinity,
  });

  return useMemo<AutocompleteOption[]>(() => {
    if (!Array.isArray(pairsQuery.data)) return [];
    return pairsQuery.data.map((pair) => ({ value: pair.id, label: pair.pair, groupBy: pair.assetClass }));
  }, [pairsQuery.data]);
};

export default usePairsOptions;

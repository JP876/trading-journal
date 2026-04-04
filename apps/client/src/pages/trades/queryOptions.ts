import { queryOptions } from '@tanstack/react-query';

import { QueryKey } from '../../enums';
import { getTradesCountPerTradingSession } from '../../api/trades';

export const getTradesPerTradingSessionQuery = () => {
  return queryOptions({
    queryKey: [QueryKey.TRADES_COUNT_PER_TRADING_SESSION],
    queryFn: getTradesCountPerTradingSession,
    staleTime: Infinity,
  });
};

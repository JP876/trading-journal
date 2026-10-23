import { QueryKey } from '../enums';
import { queryClient } from '../lib/queryClient';
import type { TradingSessionsResult } from '../types/tradingSessions';

const useMainSession = () => {
  const sessions = queryClient.getQueryData<TradingSessionsResult>([QueryKey.TRADING_SESSIONS]);
  const mainSession = sessions?.results?.find((el) => el?.isMain);

  return [mainSession];
};

export default useMainSession;

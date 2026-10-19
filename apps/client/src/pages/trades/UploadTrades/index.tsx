import { memo, type ChangeEvent } from 'react';

import UploadButton from '../../../components/UploadButton';
import withCatch from '../../../lib/withCatch';
import readCSVFile from '../../../lib/readCSVFile';
import type { ClosedBy, Direction, Result, Trade } from '../../../types/trade';
import useSnackbar from '../../../hooks/useSnackbar';
import { addMultipleTradesDB } from '../../../lib/db/api/trades';
import { queryClient } from '../../../lib/queryClient';
import type { TradingSessionsResult } from '../../../types/tradingSessions';
import { QueryKey } from '../../../enums';
import type { Pair } from '../../../types/pair';
import { formatToPips } from '../../../lib/utils';

const UploadTrades = () => {
  const { openSnackbar } = useSnackbar();

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    let [sessions, pairs] = await Promise.all([
      queryClient.getQueryData<TradingSessionsResult>([QueryKey.TRADING_SESSIONS]),
      queryClient.getQueryData<Pair[]>([QueryKey.PAIRS]),
    ]);
    let mainSession = sessions?.results?.find((el) => el?.isMain);

    if (!mainSession) {
      console.error('Main trading session not found');
      return;
    }
    if (!pairs) {
      console.error('Pairs not found');
      return;
    }

    let files = event.target.files;

    if (!files) {
      openSnackbar({
        severity: 'error',
        message: 'This CSV appears to be empty. Check the file and upload it again.',
      });
      return;
    }

    let [err, result] = await withCatch(readCSVFile<Trade>(files[0]));
    if (err || (Array.isArray(result?.errors) && result?.errors?.length > 0)) {
      openSnackbar({
        severity: 'error',
        message: "We couldn't read this CSV. Make sure it uses UTF-8 encoding, then try again.",
      });
      return;
    }

    if (!Array.isArray(result?.data) || result.data.length === 0) {
      openSnackbar({
        severity: 'error',
        message: 'This CSV appears to be empty. Check the file and upload it again.',
      });
      return;
    }

    let trades: Omit<Trade, 'id' | 'createdAt' | 'updatedAt'>[] = result.data.map((t) => {
      let result: Result = 'be';
      let takeProfit;
      let stopLoss;
      let pair = pairs.find((p) => t.pair.toString() === p.pair);

      let direction = t.direction as 'long' | 'short' | 'buy' | 'sell';
      let finalDirection: Direction = direction === 'long' || direction === 'buy' ? 'long' : 'short';
      let closedBy: ClosedBy = 'tp/sl';
      let closedAt = 0;

      if (t?.profit) {
        result = t.profit.toString().includes('-') ? 'loss' : 'win';
      }
      if (t?.entryPrice && t?.closePrice) {
        let priceDiff = t.entryPrice - t.closePrice < 0;
        if (finalDirection === 'long') {
          result = priceDiff ? 'win' : 'loss';
        } else {
          result = priceDiff ? 'loss' : 'win';
        }
      }

      if (t.closePrice && t.entryPrice) {
        if (
          (result === 'loss' && t.stopLossPrice && t.stopLossPrice !== t.closePrice) ||
          (result === 'win' && t.takeProfitPrice && t.takeProfitPrice !== t.takeProfitPrice)
        ) {
          closedBy = 'user';
          closedAt = formatToPips(t.entryPrice, t.closePrice, {
            pair: pair?.pair,
          });
        }
      }

      if (t.entryPrice && t.stopLossPrice) {
        stopLoss = formatToPips(t.entryPrice, t.stopLossPrice, {
          pair: pair?.pair,
        });
      }
      if (t.entryPrice && t.takeProfitPrice) {
        takeProfit = formatToPips(t.entryPrice, t.takeProfitPrice, {
          pair: pair?.pair,
        });
      }

      return {
        pair: pair?.id || t.pair,
        takeProfit: takeProfit ?? mainSession?.defaultTakeProfit,
        stopLoss: stopLoss ?? mainSession?.defaultStopLoss,
        result: result,
        tradingSession: mainSession.id,
        tags: [],
        direction: finalDirection,
        positionSize: t.positionSize,
        openDate: t.openDate,
        closeDate: t.closeDate,
        entryPrice: t.entryPrice,
        takeProfitPrice: t.takeProfitPrice,
        stopLossPrice: t.stopLossPrice,
        closePrice: t.closePrice,
        profit: t.profit,
        closedBy: closedBy,
        closedAt: closedAt,
      };
    });

    let [addErr] = await withCatch(addMultipleTradesDB(trades));

    if (addErr) {
      openSnackbar({
        severity: 'error',
        message: "We couldn't save these trades. Your data hasn't been imported. Please try again.",
      });
      return;
    }

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: [QueryKey.TRADES] }),
      queryClient.invalidateQueries({ queryKey: [QueryKey.TRADES_COUNT_PER_TRADING_SESSION] }),
    ]);
  };

  return (
    <UploadButton onChange={handleChange} accept=".csv, text/csv">
      Upload trades (CSV)
    </UploadButton>
  );
};

export default memo(UploadTrades);

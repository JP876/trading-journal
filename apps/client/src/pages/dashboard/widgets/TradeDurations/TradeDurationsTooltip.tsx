import { ChartsTooltipContainer, ChartsTooltipPaper, useAxesTooltip } from '@mui/x-charts';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import type { TDurationAnalysisValue } from '../../utils/types';
import type { TTradeDurationsTooltipContentProps, TTradeDurationsTooltipProps } from './types';

const formatTooltipData = (data: TDurationAnalysisValue['trades'], fraction: number = 1) => {
  let sums = data.reduce(
    (prev, value) => {
      return {
        tpSum: prev.tpSum + (value.takeProfit ?? 0),
        slSum: prev.slSum + (value.stopLoss ?? 0),
      };
    },
    { tpSum: 0, slSum: 0 }
  );

  let tps = data.map((d) => d.takeProfit ?? 0);
  let sls = data.map((d) => d.stopLoss ?? 0);

  let finalData = {
    tp: {
      avg: +(sums.tpSum / data.length).toFixed(fraction),
      min: +Math.min(...tps).toFixed(fraction),
      max: +Math.max(...tps).toFixed(fraction),
    },
    sl: {
      avg: +(sums.slSum / data.length).toFixed(fraction),
      min: +Math.min(...sls).toFixed(fraction),
      max: +Math.max(...sls).toFixed(fraction),
    },
  };

  return finalData;
};

const TradeDurationsTooltipContent = ({ data, title, seriesItems }: TTradeDurationsTooltipContentProps) => {
  return (
    <ChartsTooltipPaper sx={(theme) => ({ padding: theme.spacing(1), display: 'flex', flexDirection: 'column' })}>
      <Typography sx={[(theme) => ({ mb: 0.5, fontWeight: theme.typography.fontWeightBold })]} variant="subtitle1">
        {title}
      </Typography>

      <Divider sx={(theme) => ({ marginInline: theme.spacing(-1) })} />

      <Stack sx={{ gap: 2, mt: 1 }}>
        {seriesItems.map((item) => {
          const seriesId = item.seriesId as 'WON_TRADES' | 'LOST_TRADES';
          let isWon = seriesId === 'WON_TRADES';

          let stats = isWon ? formatTooltipData(data.win) : formatTooltipData(data.loss);

          return (
            <Stack key={item.seriesId}>
              <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={(theme) => ({
                    width: theme.spacing(2),
                    height: theme.spacing(2),
                    borderRadius: '2px',
                    backgroundColor: item.color,
                  })}
                />
                <Typography>{`${item.formattedLabel}:`}</Typography>
                <Typography sx={[(theme) => ({ fontWeight: theme.typography.fontWeightBold })]}>
                  {item.value}
                </Typography>
              </Stack>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Min</TableCell>
                      <TableCell>Avg</TableCell>
                      <TableCell>Max</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{isWon ? 'TP' : 'SL'}</TableCell>
                      <TableCell>{isWon ? stats.tp.min : stats.sl.min}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>{isWon ? stats.tp.avg : stats.sl.avg}</TableCell>
                      <TableCell>{isWon ? stats.tp.max : stats.sl.max}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          );
        })}
      </Stack>
    </ChartsTooltipPaper>
  );
};

const TradeDurationsTooltip = ({ chartData }: TTradeDurationsTooltipProps) => {
  const info = useAxesTooltip<'bar'>();

  if (!Array.isArray(info)) return null;

  return (
    <ChartsTooltipContainer>
      <TradeDurationsTooltipContent
        data={chartData[info[0].dataIndex]}
        title={info[0].axisFormattedValue}
        seriesItems={info[0].seriesItems}
      />
    </ChartsTooltipContainer>
  );
};

export default TradeDurationsTooltip;

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';

import { getTrades } from '../../../../api/trades';
import ClampedTextContainer from '../../../../components/ClampedTextContainer';
import TableMain from '../../../../components/table/TableMain';
import { QueryKey } from '../../../../enums';
import { formatSeconds } from '../../utils/duration';
import { getStatistics } from '../../utils/statistics';
import type { TStatistic, TStatisticsReturn } from '../../utils/types';
import useMainSession from '../../../../hooks/useMainSession';
import { formatToCurrency } from '../../../../lib/price';
import type { tableMainFeatures } from '../../../../components/table/consts';

type TStatisticTableRow = {
  [k in keyof TStatistic]: number | string | null;
} & {
  label: string;
  rowId: string;
};
type TFormatedStatisticsReturn = {
  daysProcessed: number;
  monthsProcessed: number;
  avgTradesPerDay: number;
  maxDrawdown: number;
  returnPercentage: string;
  tableData: TStatisticTableRow[];
};

const formatStatistic = (data: TStatistic, fn: (value: number) => string) => {
  let formated: { [k in keyof TStatistic]: string | null } = {
    all: null,
    long: null,
    short: null,
  };

  for (let k in data) {
    let key = k as keyof TStatistic;
    let nextValue = data[key] ? fn(data[key]) : '-';
    formated[key] = nextValue;
  }

  return formated;
};

const formatTradeDurations = (data: TStatistic) => formatStatistic(data, formatSeconds);

const formatStatisticsData = (data: TStatisticsReturn): TFormatedStatisticsReturn => {
  return {
    daysProcessed: data.daysProcessed,
    monthsProcessed: data.monthsProcessed,
    avgTradesPerDay: data.avgTradesPerDay,
    maxDrawdown: +data.maxDrawdown.toFixed(1),
    returnPercentage: data.returnPercentage ? `${(data.returnPercentage * 100).toFixed(1)}%` : '-',
    tableData: [
      {
        ...formatStatistic(data.winRate, (value) => `${(value * 100).toFixed(1)}%`),
        label: 'Win rate',
        rowId: 'winRate',
      },
      { ...data.tradesCount, label: 'Trades count', rowId: 'tradesCount' },
      { ...data.winTrades, label: 'Won trades', rowId: 'wonTrades' },
      { ...data.lossTrades, label: 'Lost trades', rowId: 'lostTrades' },
      {
        ...formatStatistic(data.avgProft, (value) => formatToCurrency(value)),
        label: 'Average profit',
        rowId: 'avgProfit',
      },
      {
        ...formatStatistic(data.avgLoss, (value) => formatToCurrency(value)),
        label: 'Average loss',
        rowId: 'avgLoss',
      },
      { ...formatTradeDurations(data.longestWonTrades), label: 'Longest win', rowId: 'longestWin' },
      { ...formatTradeDurations(data.shortestWonTrades), label: 'Shortest win', rowId: 'shortestWin' },
      { ...formatTradeDurations(data.longestLostTrades), label: 'Longest loss', rowId: 'longestLoss' },
      { ...formatTradeDurations(data.shortestLostTrades), label: 'Shortest loss', rowId: 'shortestLoss' },
    ],
  };
};

const columns: ColumnDef<typeof tableMainFeatures, TStatisticTableRow>[] = [
  {
    accessorKey: 'label',
    header: 'Statistic',
    cell: ({ row }) => <ClampedTextContainer variant="body1">{row.original.label}</ClampedTextContainer>,
  },
  {
    accessorKey: 'all',
    size: 60,
    header: 'All',
    cell: ({ row }) => {
      return <Box component="span">{row.original.all}</Box>;
    },
  },
  {
    accessorKey: 'long',
    size: 60,
    header: 'Long',
    cell: ({ row }) => {
      return <Box component="span">{row.original.long}</Box>;
    },
  },
  {
    accessorKey: 'short',
    size: 60,
    header: 'Short',
    cell: ({ row }) => {
      return <Box component="span">{row.original.short}</Box>;
    },
  },
];

const StatisticsList = () => {
  const tradesQuery = useQuery({
    queryKey: [QueryKey.TRADES, 'closeDate', 'desc'],
    queryFn: () => getTrades({ sortBy: 'closeDate', direction: 'desc' }),
  });
  const [mainSession] = useMainSession();

  const statsData = (() => {
    if (!tradesQuery.data?.results || tradesQuery.data.results.length === 0 || !mainSession?.id) {
      return null;
    }
    return formatStatisticsData(getStatistics(tradesQuery.data.results, mainSession.accountSize));
  })();

  if (!statsData) return null;

  const listInfoData = [
    { label: 'Days processed', value: statsData.daysProcessed },
    { label: 'Months processed', value: statsData.monthsProcessed },
    { label: 'Average trades per day', value: statsData.avgTradesPerDay },
    { label: 'Initial account size', value: formatToCurrency(mainSession?.accountSize) },
    { label: 'Return %', value: statsData.returnPercentage },
    { label: 'Max drawdown', value: formatToCurrency(statsData.maxDrawdown) },
  ];

  return (
    <Stack spacing={1}>
      {listInfoData.map(({ label, value }, index) => (
        <Box
          key={label}
          sx={[
            (theme) => ({
              display: 'grid',
              gridTemplateColumns: '1fr fit-content(50%)',
              rowGap: theme.spacing(1),
              marginBlockEnd: theme.spacing(index + 1 === listInfoData.length ? 2 : 0),
            }),
          ]}
        >
          <Typography>{label}</Typography>
          <Typography sx={[(theme) => ({ fontWeight: theme.typography.fontWeightBold })]}>{value}</Typography>
        </Box>
      ))}
      <TableMain data={statsData.tableData} columns={columns} />
    </Stack>
  );
};

export default StatisticsList;

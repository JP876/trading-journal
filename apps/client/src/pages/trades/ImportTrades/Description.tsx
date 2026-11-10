import type { ColumnDef } from '@tanstack/react-table';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Tooltip, type SxProps } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAtomValue } from 'jotai';
import { memo, useMemo } from 'react';

import type { tableMainFeatures } from '../../../components/table/consts';

import ClampedTextContainer from '../../../components/ClampedTextContainer';
import TableMain from '../../../components/table/TableMain';
import { importTradesStore, parsedFileResultAtom } from './atoms';

type TFieldDescription = {
  field: string;
  description: string;
  required: boolean | string;
};

const fieldsDescription: TFieldDescription[] = [
  {
    field: 'pair',
    required: true,
    description: 'The currency pair or trading instrument, such as EUR/USD or BTC/USD.',
  },
  {
    field: 'takeProfit',
    required: 'Optional if a takeProfitPrice is provided.',
    description: 'The take-profit distance from the entry price, measured in pips.',
  },
  {
    field: 'stopLoss',
    required: 'Optional if a stopLossPrice is provided.',
    description: 'The stop-loss distance from the entry price, measured in pips.',
  },
  {
    field: 'takeProfitPrice',
    required: 'Optional if a takeProfit is provided.',
    description: "The price at which the trade's take-profit was set.",
  },
  {
    field: 'stopLossPrice',
    required: 'Optional if a stopLoss is provided.',
    description: "The price at which the trade's stop-loss was set.",
  },
  { field: 'result', required: false, description: 'The trade outcome: win, loss, or be (break-even).' },
  {
    field: 'direction',
    required: true,
    description: 'The trade side: long or buy for a buy position; short or sell for a sell position.',
  },
  { field: 'positionSize', required: true, description: 'The size or quantity of the position.' },
  { field: 'openDate', required: true, description: 'The date and, if available, time the trade was opened.' },
  { field: 'closeDate', required: true, description: 'The date and, if available, time the trade was closed.' },
  { field: 'entryPrice', required: true, description: 'The price at which the trade was opened.' },
  { field: 'closePrice', required: true, description: 'The price at which the trade was closed.' },
  {
    field: 'profit',
    required: true,
    description: "The trade's profit or loss, in the units or currency used in your file.",
  },
];

const iconStyles: SxProps = {
  height: '0.8em',
  aspectRatio: 1,
};

const Description = () => {
  const result = useAtomValue(parsedFileResultAtom, { store: importTradesStore });

  const columns = useMemo<ColumnDef<typeof tableMainFeatures, TFieldDescription>[]>(() => {
    return [
      { accessorKey: 'field', size: 100, header: 'Field', enableSorting: false },
      {
        size: 50,
        header: 'Found',
        enableSorting: false,
        cell: ({ row }) => {
          let id = row.original.field;
          let isFound = result?.meta && result?.meta.fields?.includes(id);
          return isFound ? <CheckIcon sx={iconStyles} /> : <CloseIcon sx={iconStyles} />;
        },
      },
      {
        header: 'Required',
        enableSorting: false,
        size: 50,
        cell: ({ row }) => {
          let isRequired = row.original.required;

          if (typeof isRequired === 'string') {
            return (
              <Tooltip
                arrow
                disableInteractive
                title={
                  <Typography sx={{ m: 0.4 }} variant="body2">
                    {isRequired}
                  </Typography>
                }
              >
                <CheckIcon sx={iconStyles} />
              </Tooltip>
            );
          }
          return isRequired ? <DoneAllIcon sx={iconStyles} /> : <CloseIcon sx={iconStyles} />;
        },
      },
      {
        accessorKey: 'description',
        enableSorting: false,
        size: 400,
        header: 'Description',
        cell: ({ row }) => <ClampedTextContainer variant="body2">{row.original.description}</ClampedTextContainer>,
      },
    ];
  }, [result]);

  return (
    <Stack sx={{ gap: 1 }}>
      <Typography variant="body1">
        Upload a CSV file to import your trades. Match each column to a trade field, then review the data before
        importing.
      </Typography>
      <TableMain columns={columns} data={fieldsDescription} />
    </Stack>
  );
};

export default memo(Description);

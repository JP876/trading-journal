import type { ColumnDef } from "@tanstack/react-table";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import NumbersIcon from "@mui/icons-material/Numbers";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { memo, useMemo } from "react";

import type { TradingSession } from "../../../../../types/tradingSessions";

import { editTradingSession } from "../../../../../api/tradingSessions";
import ClampedTextContainer from "../../../../../components/ClampedTextContainer";
import MenuActions from "../../../../../components/MenuActions";
import NotFoundValue from "../../../../../components/NotFoundValue";
import { tableMainFeatures } from "../../../../../components/table/consts";
import { QueryKey } from "../../../../../enums";
import useModal from "../../../../../hooks/useModal";
import useSnackbar from "../../../../../hooks/useSnackbar";
import { TradesPageModal } from "../../../enums";
import { getTradesPerTradingSessionQuery } from "../../../queryOptions";

const TradingSessionActions = ({ session }: { session: TradingSession }) => {
  const { openModal } = useModal();

  return (
    <Stack sx={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
      <MenuActions>
        <MenuActions.Item
          label="Edit session"
          icon={<EditIcon fontSize="small" />}
          onClick={(_, handleClose) => {
            openModal(TradesPageModal.EDIT_TRADING_SESSION, { data: session, title: "Edit trading session" });
            handleClose();
          }}
        />
        <MenuActions.Item
          label="Delete session"
          icon={<DeleteIcon color="error" fontSize="small" />}
          menuItemProps={{ disabled: !!session.isMain }}
          onClick={(_, handleClose) => {
            openModal(TradesPageModal.DELETE_TRADING_SESSION, {
              data: session,
              title: "Are you absolutely sure?",
              hideCloseBtn: true,
              dialogContentProps: { dividers: false },
            });
            handleClose();
          }}
        />
      </MenuActions>
    </Stack>
  );
};

const TradingSessionMainSwitch = memo(({ id, isMain }: { id: number; isMain: boolean }) => {
  const { openSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => editTradingSession(id, { isMain: true }),
    onSettled: async () => {
      openSnackbar({ severity: "success", message: "The trading session was processed successfully." });
      return await Promise.all([
        queryClient.refetchQueries({ queryKey: [QueryKey.TRADING_SESSIONS] }),
        queryClient.refetchQueries({ queryKey: [QueryKey.TRADES] }),
      ]);
    },
    onError: () => {
      openSnackbar({ severity: "error", message: "Something went wrong while submitting your session." });
    },
  });

  return (
    <Switch
      size="small"
      checked={!!isMain}
      onChange={() => mutation.mutate()}
      disabled={!!isMain}
      sx={{ opacity: mutation.isPending ? 0.4 : 1 }}
    />
  );
});

const TradesCount = memo(({ id }: { id: number }) => {
  const { data } = useQuery(getTradesPerTradingSessionQuery());
  const count = (data || []).find((el) => el.tradingSession === id)?.count || 0;

  return <Typography sx={{ textAlign: "center" }}>{count}</Typography>;
});

const useColumns = () => {
  return useMemo<ColumnDef<typeof tableMainFeatures, TradingSession>[]>(() => {
    return [
      {
        accessorKey: "title",
        enableSorting: false,
        header: "Title",
        size: 140,
        cell: ({ row }) => {
          const value = row.original.title;
          return value ? <ClampedTextContainer maxRows={1}>{value}</ClampedTextContainer> : <NotFoundValue />;
        },
      },
      {
        accessorKey: "createdAt",
        enableSorting: false,
        header: "Created",
        size: 60,
        cell: ({ row }) => {
          const value = row.original.createdAt;
          if (!value) return <NotFoundValue />;
          return <Typography>{format(row.original?.createdAt, "dd/MM/yyyy")}</Typography>;
        },
      },
      {
        accessorKey: "id",
        enableSorting: false,
        header: () => (
          <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
            <NumbersIcon fontSize="small" />
            Trades
          </Stack>
        ),
        size: 60,
        cell: ({ row }) => <TradesCount id={row.original.id} />,
      },
      {
        accessorKey: "isMain",
        enableSorting: false,
        header: "Main",
        size: 80,
        cell: ({ row }) => <TradingSessionMainSwitch id={row.original.id} isMain={!!row.original.isMain} />,
      },
      {
        accessorKey: "description",
        enableSorting: false,
        header: "Description",
        minSize: 300,
        cell: ({ row }) => {
          const value = row.original.description;
          return value ? <ClampedTextContainer maxRows={1}>{value}</ClampedTextContainer> : <NotFoundValue />;
        },
      },
      {
        accessorKey: "actions",
        enableSorting: false,
        header: "",
        size: 80,
        cell: ({ row }) => <TradingSessionActions session={row.original} />,
      },
    ];
  }, []);
};

export default useColumns;

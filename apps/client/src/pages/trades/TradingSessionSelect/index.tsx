import { type SelectChangeEvent } from "@mui/material/Select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import { editTradingSession, getTradingSessions } from "../../../api/tradingSessions";
import SelectInput, { type TSelectInputOption } from "../../../components/inputs/SelectInput";
import { QueryKey } from "../../../enums";
import useSnackbar from "../../../hooks/useSnackbar";

export type TTradingSessionSelectProps = {
  onSettled?: () => void;
};

const TradingSessionSelect = ({ onSettled }: TTradingSessionSelectProps) => {
  const queryClient = useQueryClient();

  const { openSnackbar } = useSnackbar();

  const { data } = useQuery({
    queryKey: [QueryKey.TRADING_SESSIONS],
    queryFn: () => getTradingSessions(),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const value = (data?.results || []).find((el) => el?.isMain)?.id.toString() || "";

  const options = useMemo<TSelectInputOption[]>(() => {
    if (!data?.results) return [];
    return data.results.map((el) => ({ value: el.id, label: el.title }));
  }, [data?.results]);

  const mutation = useMutation({
    mutationFn: (id: number) => editTradingSession(id, { isMain: true }),
    onSettled: async () => {
      openSnackbar({ severity: "success", message: "The trading session was processed successfully." });
      if (onSettled) onSettled();
      return await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QueryKey.TRADING_SESSIONS] }),
        queryClient.invalidateQueries({ queryKey: [QueryKey.TRADES] }),
      ]);
    },
    onError: () => {
      openSnackbar({ severity: "error", message: "Something went wrong while submitting your session." });
    },
  });

  const handleChange = (event: SelectChangeEvent) => {
    mutation.mutate(+event.target.value);
  };

  return (
    <SelectInput
      options={options}
      label="Main trading session"
      value={value}
      onChange={handleChange}
      disabled={!Array.isArray(data?.results) || data?.results?.length === 0}
      formControlProps={{ sx: { width: "clamp(10rem, 20vw, 15rem)" } }}
    />
  );
};

export default TradingSessionSelect;

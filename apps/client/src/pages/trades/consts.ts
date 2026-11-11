import type { TSelectInputOption } from "../../components/inputs/SelectInput";
import type { ClosedBy, Direction, OrderType, Result, TradeFormSchemaType } from "../../types/trade";

export const defaultTradeValues: Partial<TradeFormSchemaType> = {
  closedBy: "tp/sl",
  orderType: "market_order",
};

export const directonOptions: TSelectInputOption<Direction>[] = [
  { value: "long", label: "Long" },
  { value: "short", label: "Short" },
];

export const resultOptions: TSelectInputOption<Result>[] = [
  { value: "win", label: "Win" },
  { value: "be", label: "BE" },
  { value: "loss", label: "Loss" },
];

export const orderTypeOptions: TSelectInputOption<OrderType>[] = [
  { label: "Market", value: "market_order" },
  { label: "Sell limit", value: "sell_limit" },
  { label: "Sell stop", value: "sell_stop" },
  { label: "Buy limit", value: "buy_limit" },
  { label: "Buy stop", value: "buy_stop" },
];

export const closedByOptions: TSelectInputOption<ClosedBy>[] = [
  { label: "TP/SL", value: "tp/sl" },
  { label: "User", value: "user" },
];

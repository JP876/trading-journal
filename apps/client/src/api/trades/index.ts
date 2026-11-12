import type { PaginationInfo } from "../../types";
import type { TGetTradesOptions, Trade, TradeFormSchemaType, TradesCount, TradesResult } from "../../types/trade";

import { axiosInstance } from "../../lib/axiosInstance";
import {
  addTradeDB,
  deleteTradeDB,
  editTradeDB,
  getTradesCountPerTradingSessionDB,
  getTradesDB,
} from "../../lib/db/api/trades";
import transformToFormData from "../../lib/transformToFormData";
import { getCurrentUser, isGuest } from "../../lib/utils";

export const getTrades = async (params: TGetTradesOptions): Promise<PaginationInfo<Trade[]>> => {
  const user = getCurrentUser();
  if (user?.variety === "GUEST") {
    return getTradesDB(user.id, params);
  }
  const response = await axiosInstance.get<TradesResult>("trades", {
    params: {
      page: params.page || 1,
      limit: params.rowsPerPage || 10,
      pairId: params.pair || undefined,
      result: params.result || undefined,
      openDate: params.openDate || undefined,
      closeDate: params.closeDate || undefined,
      tags: params.tags || undefined,
    },
  });
  return response.data;
};

export const getTradesCountPerTradingSession = async (): Promise<TradesCount[]> => {
  const user = getCurrentUser();
  if (user?.variety === "GUEST") {
    return getTradesCountPerTradingSessionDB(user.id);
  }
  const response = await axiosInstance.get<TradesCount[]>("trades/count-per-session");
  return response.data;
};

export const addTrade = async (trade: TradeFormSchemaType & { tradingSessionId: number }) => {
  const user = getCurrentUser();
  if (user?.variety === "GUEST") {
    return addTradeDB(user.id, trade);
  }
  const response = await axiosInstance.post("trades", transformToFormData(trade));
  return response.data;
};

export const editTrade = async (id: number, trade: TradeFormSchemaType & { tradingSessionId: number }) => {
  if (!id) {
    throw new Error(`Trade ID not found: ${id}`);
  }
  if (isGuest()) {
    return editTradeDB(id, trade);
  }
  const response = await axiosInstance.patch(`trades/${id}`, transformToFormData({ ...trade }));
  return response.data;
};

export const deleteTrade = async (id: number | undefined) => {
  if (!id) {
    throw new Error(`Trade ID not found: ${id}`);
  }
  if (isGuest()) {
    return deleteTradeDB(id);
  }
  const response = await axiosInstance.delete(`trades/${id}`);
  return response.data;
};

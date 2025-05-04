import { VisibilityState } from '@tanstack/react-table';

export type userSettingsType = {
  tradesColumnVisibility?: VisibilityState;
  defaultStopLoss?: number;
  defaultTakeProfit?: number;
};

export type userType = {
  _id: string;
  userName?: string;
  email: string;
  isActive: boolean;
  firstName?: string;
  lastName?: string;
  userSettings?: userSettingsType;
  avatar?: {
    url: string;
    id: string;
  };
};

export type ErrorResponse = {
  error: string;
  message: string | string[];
  statusCode: number;
};

export enum DialogListIds {
  EDIT_USER = 'editUser',
}

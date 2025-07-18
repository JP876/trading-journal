import { z } from 'zod';
import { VisibilityState } from '@tanstack/react-table';

export const userFormSchema = z.object({
  userName: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  userSettings: z
    .object({
      tradesColumnVisibility: z.object({}).optional(),
      defaultStopLoss: z.number().positive().optional(),
      defaultTakeProfit: z.number().positive().optional(),
    })
    .optional(),
});

export type UserFormSchema = z.infer<typeof userFormSchema>;

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

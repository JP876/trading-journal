import type { ParseResult } from "papaparse";

import { atom } from "jotai";

import type { Trade } from "../../../types/trade";

export const parsedFileResultAtom = atom<ParseResult<Trade> | null>(null);

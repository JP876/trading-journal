import type { ColumnVisibilityState } from "@tanstack/react-table";

import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const visibilityAtom = atomWithStorage<ColumnVisibilityState>("trades-column-visibility", {});
export const tradesFiltersAtom = atom(false);

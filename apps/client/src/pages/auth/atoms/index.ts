import { atom } from "jotai";

export const authFormAtom = atom<"login" | "register">("login");

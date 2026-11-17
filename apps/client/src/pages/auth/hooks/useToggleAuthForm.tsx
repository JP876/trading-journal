import { useSetAtom } from "jotai";
import { startTransition } from "react";

import { authFormAtom } from "../atoms";

const useToggleAuthForm = () => {
  const setAuthForm = useSetAtom(authFormAtom);
  const toggle = () => {
    startTransition(() => {
      setAuthForm((prevValue) => (prevValue === "login" ? "register" : "login"));
    });
  };
  return [toggle];
};

export default useToggleAuthForm;

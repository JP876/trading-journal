import { useEffect, useRef } from "react";

const useUnmount = (cb: React.EffectCallback) => {
  const justMounted = useRef(true);
  const callbackRef = useRef(cb);

  callbackRef.current = cb;

  useEffect(() => {
    setTimeout(() => (justMounted.current = false), 0);
    return () => {
      if (!justMounted.current) callbackRef.current();
    };
  }, []);

  return null;
};

export default useUnmount;

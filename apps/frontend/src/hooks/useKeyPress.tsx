import { useEffect } from 'react';

type allowedEvents = 'keydown' | 'keypress' | 'keyup';

type UseKeyPressOptionsType = {
  event?: allowedEvents | allowedEvents[];
};

const useKeyPress = (key: string | string[], cb: (event: KeyboardEvent) => void, options?: UseKeyPressOptionsType) => {
  useEffect(() => {
    const controller = new AbortController();

    const handleKeyPress = (event: KeyboardEvent) => {
      if ((Array.isArray(key) && key.includes(event.key)) || event.key === key) {
        cb(event);
      }
    };

    if (Array.isArray(options?.event)) {
      for (const e of options.event) {
        window.addEventListener(e, handleKeyPress, { signal: controller.signal });
      }
    } else if (options?.event) {
      window.addEventListener(options?.event, handleKeyPress, { signal: controller.signal });
    } else {
      window.addEventListener('keydown', handleKeyPress, { signal: controller.signal });
    }

    return () => {
      controller.abort();
    };
  }, [key, cb, options]);

  return null;
};

export default useKeyPress;

import { useCallback, useEffect, useRef } from "react";

type TListeners = Iterable<
  readonly [
    eventType: string,
    handler: EventListenerOrEventListenerObject,
    element?: EventTarget,
    options?: Omit<AddEventListenerOptions, "signal">,
  ]
>;

function useEventListeners(listeners: TListeners) {
  const controllerRef = useRef<AbortController | null>(null);
  const listenersRef = useRef(listeners);

  const getController = useCallback(() => controllerRef.current, []);

  useEffect(() => {
    controllerRef.current = new AbortController();

    for (const [eventType, handler, element, options] of listenersRef.current) {
      const el = element || document;
      if (!el?.addEventListener) {
        console.warn(
          `Unable to attach event: ${eventType} listener: the target: ${el} does not support addEventListener.`,
        );
        continue;
      }
      el.addEventListener(eventType, handler, { ...options, signal: controllerRef.current.signal });
    }

    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, []);

  return [getController];
}

export default useEventListeners;

import { useEffect, useRef } from 'react';

export const usePolling = (callback, interval = 5000) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    // Call immediately on mount
    tick();

    const id = setInterval(tick, interval);
    return () => clearInterval(id);
  }, [interval]);
};

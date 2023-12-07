import { RefObject, useEffect } from 'react';

const useOutsideClick = (
  refs: Array<RefObject<HTMLElement> | undefined>,
  handler?: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!handler) return;

      let containedToAnyRefs = false;
      for (const rf of refs) {
        if (rf && rf.current && rf.current.contains(event.target as Node)) {
          containedToAnyRefs = true;
          break;
        }
      }

      if (!containedToAnyRefs) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [refs, handler]);
};

export default useOutsideClick;

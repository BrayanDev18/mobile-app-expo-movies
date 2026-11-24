import { useCallback, useState } from 'react';

// Home rails below the fold fetch only once the list renders them near the
// viewport, instead of firing every request on mount. Keys stay active once
// activated so scrolling back never re-gates a rail.
export const useLazyRails = () => {
  const [activeRails, setActiveRails] = useState<ReadonlySet<string>>(() => new Set());

  const activateRail = useCallback((key: string) => {
    setActiveRails((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));
  }, []);

  return { activeRails, activateRail };
};

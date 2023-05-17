import { useRef, useState, useCallback, useLayoutEffect } from 'react';
import { StickyTableStickyClassName } from './constants';
import { createContainer } from 'unstated-next';

function useStickyTableContextCreator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  const [scrollStatus, setScrollStatus] = useState({
    canScrollRight: true,
    canScrollLeft: false,
  });

  const getLeftStickyHeadersWidth = useCallback(() => {
    if (!containerRef.current) return 0;

    const headers = Array.from(
      containerRef.current.querySelectorAll(
        `thead .${StickyTableStickyClassName}`
      )
    );

    const leftStickyHeadersWidth = headers.reduce(
      (acc, item) => acc + item.clientWidth,
      0
    );

    return leftStickyHeadersWidth;
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    if (containerRef.current.scrollWidth === 0) {
      setScrollStatus({
        canScrollRight: false,
        canScrollLeft: false,
      });
    }
  }, []);

  const getScrollAmount = useCallback(() => {
    if (!containerRef.current || !tableRef.current) return;

    const viewportWidth = containerRef.current.clientWidth;
    const leftStickyHeadersWidth = getLeftStickyHeadersWidth();

    return viewportWidth - leftStickyHeadersWidth;
  }, [getLeftStickyHeadersWidth]);

  const adjustScrollStatus = useCallback((scrollAmount: number) => {
    if (!containerRef.current) return;

    const newScrollLeft = containerRef.current.scrollLeft + scrollAmount;

    if (
      newScrollLeft >=
      containerRef.current.scrollWidth - containerRef.current.clientWidth
    ) {
      setScrollStatus({
        canScrollRight: false,
        canScrollLeft: true,
      });
    } else if (newScrollLeft <= 0) {
      setScrollStatus({
        canScrollRight: true,
        canScrollLeft: false,
      });
    } else {
      setScrollStatus({
        canScrollRight: true,
        canScrollLeft: true,
      });
    }
  }, []);

  const scrollRight = useCallback(() => {
    const scrollAmount = getScrollAmount();
    if (!scrollAmount || !containerRef.current) return;

    adjustScrollStatus(scrollAmount);
    containerRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  }, [adjustScrollStatus, getScrollAmount]);

  const scrollLeft = useCallback(() => {
    const scrollAmount = getScrollAmount();

    if (!scrollAmount || !containerRef.current) return;

    adjustScrollStatus(-scrollAmount);

    containerRef.current.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth',
    });
  }, [adjustScrollStatus, getScrollAmount]);

  return {
    containerRef,
    tableRef,
    scrollStatus,
    scrollRight,
    scrollLeft,
  };
}

const StickyTableContext = createContainer(useStickyTableContextCreator);

export const StickyTableProvider = StickyTableContext.Provider;
export const useStickyTableContext = StickyTableContext.useContainer;

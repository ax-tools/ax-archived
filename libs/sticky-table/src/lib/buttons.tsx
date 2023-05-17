import type { ButtonPropsWithoutRef } from 'react-html-props';
import { useStickyTableContext } from './context';

export function useStickyScroll() {
  const { scrollStatus, scrollLeft, scrollRight } = useStickyTableContext();
  return { scrollStatus, scrollLeft, scrollRight };
}

function clj(...onClicks: ButtonPropsWithoutRef['onClick'][]) {
  return (event: React.MouseEvent<HTMLButtonElement>) => {
    onClicks.forEach((onClick) => onClick?.(event));
  };
}

export function StickyScrollLeftButton(props: ButtonPropsWithoutRef) {
  const { scrollLeft, scrollStatus } = useStickyScroll();

  return (
    <button
      {...props}
      onClick={clj(scrollLeft, props.onClick)}
      disabled={!scrollStatus.canScrollLeft}
    />
  );
}

export function StickyScrollRightButton(props: ButtonPropsWithoutRef) {
  const { scrollRight, scrollStatus } = useStickyScroll();

  return (
    <button
      {...props}
      onClick={clj(scrollRight, props.onClick)}
      disabled={!scrollStatus.canScrollRight}
    />
  );
}

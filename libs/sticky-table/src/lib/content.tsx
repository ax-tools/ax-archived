import { useRef, useState, useLayoutEffect } from 'react';
import type {
  THeadPropsWithoutRef,
  THPropsWithoutRef,
  TDPropsWithoutRef,
} from 'react-html-props';
import { Falsy } from './types';
import { StickyTableStickyClassName } from './constants';

function cj(...classNames: (string | Falsy)[]) {
  return classNames.filter(Boolean).join(' ');
}

function useStickyLeft() {
  const cellRef = useRef<HTMLTableCellElement>(null);

  const [left, setLeft] = useState(0);

  useLayoutEffect(() => {
    let left = 0;
    for (const node of Array.from(
      cellRef.current?.parentNode?.children || []
    )) {
      if (!node?.classList.contains(StickyTableStickyClassName)) continue;
      if (node === cellRef.current) break;
      left += node.clientWidth;
    }

    setLeft(left);
  }, []);

  return { cellRef, left };
}

export function StickyTHead(props: THeadPropsWithoutRef) {
  return (
    <thead {...props} style={{ ...props.style, position: 'sticky', top: 0 }} />
  );
}

export function StickyTh(props: THPropsWithoutRef) {
  const { cellRef, left } = useStickyLeft();

  return (
    <th
      ref={cellRef}
      {...props}
      className={cj(
        props.className,
        StickyTableStickyClassName,
        'stickytable_th'
      )}
      style={{ ...props.style, position: 'sticky', left }}
    />
  );
}

export function StickyTd(props: TDPropsWithoutRef) {
  const { cellRef, left } = useStickyLeft();

  return (
    <td
      ref={cellRef}
      {...props}
      className={cj(
        props.className,
        StickyTableStickyClassName,
        'stickytable_td'
      )}
      style={{ ...props.style, position: 'sticky', left }}
    />
  );
}

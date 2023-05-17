import type {
  DivPropsWithoutRef,
  TablePropsWithoutRef,
} from 'react-html-props';
import { useStickyTableContext } from './context';

export function StickyTableContainer(props: DivPropsWithoutRef) {
  const { containerRef } = useStickyTableContext();
  return (
    <div
      {...props}
      style={{ ...props.style, position: 'relative' }}
      ref={containerRef}
    />
  );
}

export function StickyTable(props: TablePropsWithoutRef) {
  const { tableRef } = useStickyTableContext();
  return <table ref={tableRef} {...props} />;
}

import { useEffect, useMemo, useState, ReactNode } from "react";
import { Responsive, WidthProvider, type LayoutItem, type ResponsiveLayouts } from "react-grid-layout/legacy";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface Item {
  id: string;
  node: ReactNode;
  minH?: number;
  defaultH?: number;
  defaultW?: number;
}

interface Props {
  items: Item[];
  storageKey: string;
  resetSignal?: number;
}

const COLS = { lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 };
const BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const ROW_HEIGHT = 40;

type Layouts = ResponsiveLayouts<string>;

export const DraggableGrid = ({ items, storageKey, resetSignal = 0 }: Props) => {
  const defaultLayouts: Layouts = useMemo(() => {
    const lg: LayoutItem[] = items.map((it, i) => ({
      i: it.id,
      x: (i % 2) * 6,
      y: Math.floor(i / 2) * (it.defaultH ?? 14),
      w: it.defaultW ?? 6,
      h: it.defaultH ?? 14,
      minW: 3,
      minH: it.minH ?? 6,
    }));
    const sm: LayoutItem[] = items.map((it, i) => ({
      i: it.id,
      x: 0,
      y: i * (it.defaultH ?? 14),
      w: 6,
      h: it.defaultH ?? 14,
      minW: 3,
      minH: it.minH ?? 6,
    }));
    return { lg, md: lg, sm, xs: sm, xxs: sm };
  }, [items]);

  const [layouts, setLayouts] = useState<Layouts>(() => {
    if (typeof window === "undefined") return defaultLayouts;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw) as Layouts;
    } catch {}
    return defaultLayouts;
  });

  useEffect(() => {
    if (resetSignal > 0) {
      setLayouts(defaultLayouts);
      try {
        localStorage.removeItem(storageKey);
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal]);

  // Adicionar novos itens à grade automaticamente
  useEffect(() => {
    setLayouts((prev) => {
      const lgPrev = prev?.lg ?? [];
      const known = new Set(lgPrev.map((l) => l.i));
      const missing = items.filter((it) => !known.has(it.id));
      if (missing.length === 0) return prev;
      const merged: Layouts = { ...prev };
      (Object.keys(COLS) as (keyof typeof COLS)[]).forEach((bp) => {
        const arr: LayoutItem[] = [...((prev[bp] as LayoutItem[] | undefined) ?? (defaultLayouts[bp] as LayoutItem[] | undefined) ?? [])];
        let yMax = arr.reduce((m, l) => Math.max(m, l.y + l.h), 0);
        const isNarrow = bp === "sm" || bp === "xs" || bp === "xxs";
        missing.forEach((it, idx) => {
          arr.push({
            i: it.id,
            x: isNarrow ? 0 : (idx % 2) * 6,
            y: yMax,
            w: 6,
            h: it.defaultH ?? 14,
            minW: 3,
            minH: it.minH ?? 6,
          });
          yMax += it.defaultH ?? 14;
        });
        merged[bp] = arr;
      });
      return merged;
    });
  }, [items, defaultLayouts]);

  const handleChange = (_: LayoutItem[], all: Layouts) => {
    setLayouts(all);
    try {
      localStorage.setItem(storageKey, JSON.stringify(all));
    } catch {}
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={BREAKPOINTS}
      cols={COLS}
      rowHeight={ROW_HEIGHT}
      margin={[16, 16]}
      containerPadding={[0, 0]}
      onLayoutChange={handleChange}
      draggableHandle=".drag-handle"
      resizeHandles={["se", "e", "s"]}
      compactType="vertical"
    >
      {items.map((it) => (
        <div key={it.id} className="overflow-hidden">
          {it.node}
        </div>
      ))}
    </ResponsiveGridLayout>
  );
};

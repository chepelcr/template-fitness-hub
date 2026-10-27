import { useRef } from 'react';
import { useBoxSize } from './useBoxSize';

/**
 * Lane lines along the photo's slanted edge (the `.slant` cut runs from 14 %
 * of the width at the top to 0 at the bottom). Drawn in real pixels so they
 * stay parallel to the cut at any size; they sweep in once (CSS
 * stroke-dashoffset, staggered) and reduced motion shows them drawn.
 */
export function LaneLines({ count = 5 }: { count?: number }) {
  const box = useRef<HTMLDivElement>(null);
  const { width: w, height: h } = useBoxSize(box);
  const left = w * 0.3;
  return (
    <div ref={box} aria-hidden="true" className="pointer-events-none absolute inset-0">
      {w > 0 && (
        <svg width={w * 0.44} height={h} viewBox={`0 0 ${w * 0.44} ${h}`} className="absolute top-0 overflow-visible" style={{ left: -left }}>
          {Array.from({ length: count }, (_, i) => {
            const d = 10 + i * 13;
            return (
              <path
                key={i}
                d={`M${left + w * 0.14 - d} 0L${left - d} ${h}`}
                pathLength="1"
                fill="none"
                strokeWidth="3"
                className="lane-sweep"
                style={{ stroke: 'var(--lane-line)', animationDelay: `${120 + i * 70}ms` }}
              />
            );
          })}
        </svg>
      )}
    </div>
  );
}

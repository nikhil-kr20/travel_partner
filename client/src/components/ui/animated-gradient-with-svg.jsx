/**
 * AnimatedGradient — a pure CSS animated SVG gradient background.
 *
 * Placed at /components/ui/ to match shadcn conventions.
 * This is a JS adaptation of the original TSX component.
 * Animation is driven entirely via CSS custom properties,
 * so no Tailwind is required — it uses <style> injection instead.
 *
 * Props:
 *   colors  — array of CSS color strings
 *   speed   — animation speed multiplier (default 5)
 *   blur    — "light" | "medium" | "heavy" (default "light")
 */

import React, { useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useDimensions } from '@/components/hooks/use-debounced-dimensions';

// Inject shared keyframes once into the document <head>
const KEYFRAMES_ID = '__animated-gradient-keyframes__';
function ensureKeyframes() {
    if (typeof document === 'undefined') return;
    if (document.getElementById(KEYFRAMES_ID)) return;
    const style = document.createElement('style');
    style.id = KEYFRAMES_ID;
    style.textContent = `
    @keyframes animated-gradient-move {
      0%, 100% {
        transform: translate(0, 0);
      }
      20% {
        transform: translate(
          calc(100% * var(--tx-1, 1)),
          calc(100% * var(--ty-1, 1))
        );
      }
      40% {
        transform: translate(
          calc(100% * var(--tx-2, -1)),
          calc(100% * var(--ty-2, 1))
        );
      }
      60% {
        transform: translate(
          calc(100% * var(--tx-3, 1)),
          calc(100% * var(--ty-3, -1))
        );
      }
      80% {
        transform: translate(
          calc(100% * var(--tx-4, -1)),
          calc(100% * var(--ty-4, -1))
        );
      }
    }
    .animated-gradient-circle {
      animation: animated-gradient-move var(--bg-grad-speed, 15s)
        cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
      position: absolute;
    }
  `;
    document.head.appendChild(style);
}

const randomFloat = () => Math.random() - 0.5;
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const BLUR_MAP = {
    light: '40px',
    medium: '60px',
    heavy: '100px',
};

/**
 * @param {{ colors: string[], speed?: number, blur?: 'light'|'medium'|'heavy' }} props
 */
function AnimatedGradient({ colors, speed = 5, blur = 'light' }) {
    ensureKeyframes();

    const containerRef = useRef(null);
    const dimensions = useDimensions(containerRef);

    const circleSize = useMemo(
        () => Math.max(dimensions.width, dimensions.height),
        [dimensions.width, dimensions.height]
    );

    const blurAmount = BLUR_MAP[blur] ?? BLUR_MAP.light;
    // speed prop as in the original: higher = faster
    const duration = `${1 / speed}s`;

    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    filter: `blur(${blurAmount})`,
                }}
            >
                {colors.map((color, index) => {
                    const w = circleSize * randomInt(0.5, 1.5) || 300;
                    const h = circleSize * randomInt(0.5, 1.5) || 300;
                    return (
                        <svg
                            key={index}
                            className="animated-gradient-circle"
                            style={{
                                top: `${Math.random() * 50}%`,
                                left: `${Math.random() * 50}%`,
                                '--bg-grad-speed': duration,
                                '--tx-1': randomFloat(),
                                '--ty-1': randomFloat(),
                                '--tx-2': randomFloat(),
                                '--ty-2': randomFloat(),
                                '--tx-3': randomFloat(),
                                '--ty-3': randomFloat(),
                                '--tx-4': randomFloat(),
                                '--ty-4': randomFloat(),
                            }}
                            width={w}
                            height={h}
                            viewBox="0 0 100 100"
                        >
                            <circle cx="50" cy="50" r="50" fill={color} opacity="0.3" />
                        </svg>
                    );
                })}
            </div>
        </div>
    );
}

export { AnimatedGradient };

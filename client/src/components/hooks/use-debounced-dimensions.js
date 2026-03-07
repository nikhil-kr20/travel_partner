import { useState, useEffect } from 'react';

/**
 * useDimensions — measures a DOM element's bounding box,
 * debouncing resize events by 250 ms.
 *
 * @param {React.RefObject<HTMLElement|SVGElement>} ref
 * @returns {{ width: number, height: number }}
 */
export function useDimensions(ref) {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        let timeoutId;

        const updateDimensions = () => {
            if (ref.current) {
                const { width, height } = ref.current.getBoundingClientRect();
                setDimensions({ width, height });
            }
        };

        const debouncedUpdate = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(updateDimensions, 250);
        };

        // Initial measurement
        updateDimensions();

        window.addEventListener('resize', debouncedUpdate);

        return () => {
            window.removeEventListener('resize', debouncedUpdate);
            clearTimeout(timeoutId);
        };
    }, [ref]);

    return dimensions;
}

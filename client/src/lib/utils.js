/**
 * Utility: merge class names (mirrors shadcn's cn() utility).
 * Works with plain strings, conditionals, and arrays.
 */
export function cn(...classes) {
    return classes
        .flat()
        .filter(Boolean)
        .join(' ');
}

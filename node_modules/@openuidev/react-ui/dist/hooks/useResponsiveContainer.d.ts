import { RefObject } from "react";
export type Breakpoint = "mobile" | "tablet" | "desktop";
export declare function getBreakpoint(width: number): Breakpoint;
export interface ContainerSize {
    width: number;
    height: number;
    breakpoint: Breakpoint;
}
/**
 * Continuously tracks a container's size via ResizeObserver and returns
 * width, height, and a breakpoint derived from the container width.
 *
 * Breakpoints: mobile (<480px) | tablet (480–800px) | desktop (>800px)
 */
export declare function useResponsiveContainer(containerRef: RefObject<HTMLElement | null>): ContainerSize;
//# sourceMappingURL=useResponsiveContainer.d.ts.map
import * as RechartsPrimitive from "recharts";
type CustomTooltipContentProps = React.ComponentProps<typeof RechartsPrimitive.Tooltip> & React.ComponentProps<"div"> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
    showPercentage?: boolean;
    portalContainer?: React.RefObject<HTMLElement | null>;
    parentRef: React.RefObject<HTMLElement | null>;
};
export declare const CustomTooltipContent: import("react").NamedExoticComponent<Omit<CustomTooltipContentProps, "ref"> & import("react").RefAttributes<HTMLDivElement>>;
export {};
//# sourceMappingURL=CustomTooltipContent.d.ts.map
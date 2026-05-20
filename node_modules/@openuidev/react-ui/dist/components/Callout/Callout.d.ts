import React from "react";
type CalloutVariant = "info" | "danger" | "warning" | "success" | "neutral";
export interface CalloutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    variant?: CalloutVariant;
    title?: React.ReactNode;
    description?: React.ReactNode;
    /** Auto-dismiss after N milliseconds. CSS-only fade + collapse. */
    duration?: number;
}
export declare const Callout: React.ForwardRefExoticComponent<CalloutProps & React.RefAttributes<HTMLDivElement>>;
export {};
//# sourceMappingURL=Callout.d.ts.map
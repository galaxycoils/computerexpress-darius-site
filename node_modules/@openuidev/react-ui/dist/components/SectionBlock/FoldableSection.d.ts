import * as AccordionPrimitive from "@radix-ui/react-accordion";
import React from "react";
export type FoldableSectionRootProps = AccordionPrimitive.AccordionMultipleProps;
export declare const FoldableSectionRoot: React.ForwardRefExoticComponent<AccordionPrimitive.AccordionMultipleProps & React.RefAttributes<HTMLDivElement>>;
export interface FoldableSectionItemProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> {
    className?: string;
    style?: React.CSSProperties;
    value: string;
}
export declare const FoldableSectionItem: React.ForwardRefExoticComponent<FoldableSectionItemProps & React.RefAttributes<HTMLDivElement>>;
export interface FoldableSectionTriggerProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
    className?: string;
    style?: React.CSSProperties;
    text: React.ReactNode;
}
export declare const FoldableSectionTrigger: React.ForwardRefExoticComponent<FoldableSectionTriggerProps & React.RefAttributes<HTMLButtonElement>>;
export interface FoldableSectionContentProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
export declare const FoldableSectionContent: React.ForwardRefExoticComponent<FoldableSectionContentProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=FoldableSection.d.ts.map
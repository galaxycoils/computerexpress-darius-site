import * as TabsPrimitive from "@radix-ui/react-tabs";
import React from "react";
type TabsVariant = "clear";
export interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
    className?: string;
    style?: React.CSSProperties;
    variant?: TabsVariant;
}
export declare const Tabs: React.ForwardRefExoticComponent<TabsProps & React.RefAttributes<HTMLDivElement>>;
type TabsListVariant = "title" | "iconTitle" | "iconTitleSubtext" | "imageTitle" | "imageTitleSubtext";
export interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
    className?: string;
    style?: React.CSSProperties;
    variant?: TabsListVariant;
}
export declare const TabsList: React.ForwardRefExoticComponent<TabsListProps & React.RefAttributes<HTMLDivElement>>;
export interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
    className?: string;
    style?: React.CSSProperties;
    value: string;
    icon?: React.ReactNode;
    text: React.ReactNode;
    subtext?: React.ReactNode;
    image?: string;
}
export declare const TabsTrigger: React.ForwardRefExoticComponent<TabsTriggerProps & React.RefAttributes<HTMLButtonElement>>;
export interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
export declare const TabsContent: React.ForwardRefExoticComponent<TabsContentProps & React.RefAttributes<HTMLDivElement>>;
export {};
//# sourceMappingURL=Tabs.d.ts.map
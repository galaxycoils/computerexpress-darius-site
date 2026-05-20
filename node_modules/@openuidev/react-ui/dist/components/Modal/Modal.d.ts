import React from "react";
export interface ModalProps {
    title: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    size?: "sm" | "md" | "lg";
    children?: React.ReactNode;
}
export declare const Modal: React.FC<ModalProps>;
//# sourceMappingURL=Modal.d.ts.map
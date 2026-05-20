import { type ReactNode } from "react";
/**
 * Props for {@link ShareThreadModal}.
 *
 * @category Components
 */
export interface ShareThreadModalProps {
    /** Modal title. Defaults to `"Share chat"`. */
    title?: string;
    /** The trigger element that opens the modal. */
    trigger: ReactNode;
    /** Async function that returns a shareable URL. */
    generateLink: () => Promise<string>;
    /** Theme class name for portal targeting. */
    themeClassName?: string;
}
/**
 * Modal dialog for generating and copying a shareable link.
 *
 * @category Components
 */
export declare const ShareThreadModal: import("react").ForwardRefExoticComponent<ShareThreadModalProps & import("react").RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=ShareThreadModal.d.ts.map
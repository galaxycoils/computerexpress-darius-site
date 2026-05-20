import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Share2 } from "lucide-react";
import React from "react";
import { useLayoutContext } from "../../context/LayoutContext";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { useTheme } from "../ThemeProvider/ThemeProvider";
import { ShareThreadModal } from "./ShareThreadModal";
import { useShareThread } from "./useShareThread";
/**
 * Share button that opens a modal for generating and copying a shareable link.
 * Renders nothing when there are no messages to share.
 *
 * @category Components
 */
export const ShareThread = ({ generateShareLink, modalTitle, customTrigger }) => {
    const { layout } = useLayoutContext() || {};
    const isMobile = layout === "mobile";
    const { portalThemeClassName } = useTheme();
    const { hasMessages, getShareThreadLink, shouldDisableShareButton } = useShareThread({
        generateShareLink,
    });
    if (!hasMessages)
        return null;
    return (_jsx(ShareThreadModal, { title: modalTitle, trigger: customTrigger ?? (_jsx(DefaultShareButton, { isMobile: isMobile, shouldDisableShareButton: shouldDisableShareButton })), generateLink: getShareThreadLink, themeClassName: portalThemeClassName }));
};
ShareThread.displayName = "ShareThread";
const DefaultShareButton = React.forwardRef(({ isMobile, shouldDisableShareButton, ...props }, ref) => {
    return isMobile ? (_jsx(IconButton, { ref: ref, size: "medium", icon: _jsx(Share2, { size: "1em" }), variant: "secondary", disabled: shouldDisableShareButton, ...props })) : (_jsxs(Button, { ref: ref, variant: "secondary", disabled: shouldDisableShareButton, ...props, children: [_jsx(Share2, {}), "Share"] }));
});
DefaultShareButton.displayName = "DefaultShareButton";
//# sourceMappingURL=ShareThread.js.map
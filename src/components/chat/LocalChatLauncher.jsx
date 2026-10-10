import { lazy, Suspense, useState } from "react";
import ErrorBoundary from "../ErrorBoundary";
import UiIcon from "../journal/UiIcon";

const LocalChat = lazy(() => import("./LocalChat"));

export default function LocalChatLauncher() {
  const [opened, setOpened] = useState(false);
  const [mounted, setMounted] = useState(false);
  return (
    <>
      <button
        className="journal-chat-launcher"
        aria-haspopup="dialog"
        aria-expanded={opened}
        aria-controls={mounted ? "scd-local-chat" : undefined}
        onClick={() => { setMounted(true); setOpened(!opened); }}
      >
        <UiIcon name="chat" /> Ask SC Digital
      </button>
      {mounted && (
        <ErrorBoundary inline>
          <Suspense fallback={<span className="sr-only" role="status">Opening local chat…</span>}>
            <LocalChat opened={opened} onClose={() => setOpened(false)} />
          </Suspense>
        </ErrorBoundary>
      )}
    </>
  );
}

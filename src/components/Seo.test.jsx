import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import Seo from "./Seo";

const originalMode = HelmetProvider.canUseDOM;
beforeEach(() => {
  HelmetProvider.canUseDOM = false;
});
afterEach(() => {
  HelmetProvider.canUseDOM = originalMode;
});
function head(props) {
  const context = {};
  renderToString(
    <HelmetProvider context={context}>
      <Seo {...props} />
    </HelmetProvider>,
  );
  return context.helmet;
}

describe("safe and useful page metadata", () => {
  it("keeps source text from closing a structured-data script", () => {
    const name = '</script><script>alert("injected")</script>';
    const markup = head({
      jsonLd: { "@type": "WebPage", name },
    }).script.toString();
    const container = document.createElement("div");
    container.innerHTML = markup;
    expect(container.querySelectorAll("script")).toHaveLength(1);
    expect(JSON.parse(container.querySelector("script").textContent).name).toBe(
      name,
    );
  });
  it("gives a missing article its own canonical and noindex metadata", () => {
    const metadata = head({ path: "/articles/missing", noIndex: true });
    expect(metadata.link.toString()).toContain(
      'href="https://stcatharinesdigital.ca/articles/missing/"',
    );
    expect(metadata.meta.toString()).toContain('content="noindex,nofollow"');
  });
});

import { describe, expect, it } from "vitest";
import { canHydratePrerender } from "./prerenderHydration";

const root = (path) => ({
  hasChildNodes: () => true,
  dataset: { prerenderRoute: path },
});
describe("matching prerendered content to the requested page", () => {
  it("hydrates published routes with or without a trailing slash", () => {
    expect(
      canHydratePrerender(root("/news"), { pathname: "/news/", search: "" }),
    ).toBe(true);
  });
  it("renders a missing route afresh when the static host returns the homepage", () => {
    expect(
      canHydratePrerender(root("/"), {
        pathname: "/articles/missing",
        search: "",
      }),
    ).toBe(false);
    expect(
      canHydratePrerender(root("/404"), {
        pathname: "/articles/missing",
        search: "",
      }),
    ).toBe(false);
  });
  it("does not hydrate an unfiltered page as filtered search results", () => {
    expect(
      canHydratePrerender(root("/search"), {
        pathname: "/search/",
        search: "?q=Port",
      }),
    ).toBe(false);
    expect(
      canHydratePrerender(root("/news/welland"), {
        pathname: "/news/welland/",
        search: "?topic=Development",
      }),
    ).toBe(false);
  });
  it("keeps homepage hydration when a campaign query does not affect its markup", () => {
    expect(
      canHydratePrerender(root("/"), {
        pathname: "/",
        search: "?utm_source=newsletter",
      }),
    ).toBe(true);
  });
  it("renders contextual contact forms and private preferences from their URL state", () => {
    expect(
      canHydratePrerender(root("/contact"), {
        pathname: "/contact",
        search: "?subject=Correction",
      }),
    ).toBe(false);
    expect(
      canHydratePrerender(root("/preferences"), {
        pathname: "/preferences",
        search: "?token=private",
      }),
    ).toBe(false);
  });
});

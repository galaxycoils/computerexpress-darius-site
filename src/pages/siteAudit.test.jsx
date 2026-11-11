import { renderToString } from "react-dom/server";
import { fireEvent, render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ArticlePage from "./ArticlePage";
import CityNewsPage from "./CityNewsPage";
import CorrectionsPage from "./CorrectionsPage";
import PlanningTrackerPage from "./PlanningTrackerPage";
import PoliceNewsPage from "./PoliceNewsPage";
import PolicePage from "./PolicePage";
import SavedPage from "./SavedPage";
import VotesHubPage from "./VotesHubPage";
import { planningNotices } from "../data/planningNotices";
import { articleNewsSection } from "../data/publication";
import { getPublishableContent } from "../data/contentRegistry";
import { shortenDocumentTitle } from "../data/documentTitle";
import { policeDeskReleases } from "../data/policeDesk";
import { verifiedNrpsReleases } from "../data/nrpsReleases";

const originalMode = HelmetProvider.canUseDOM;
beforeEach(() => {
  HelmetProvider.canUseDOM = false;
});
afterEach(() => {
  HelmetProvider.canUseDOM = originalMode;
  vi.unstubAllGlobals();
});

function head(node) {
  const context = {};
  renderToString(<HelmetProvider context={context}>{node}</HelmetProvider>);
  return {
    link: context.helmet.link.toString(),
    meta: context.helmet.meta.toString(),
    script: context.helmet.script.toString(),
  };
}

function jsonLdBlocks(script) {
  return [...script.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map((match) =>
    JSON.parse(match[1]),
  );
}

function ownPageUrls(script) {
  const urls = [];
  const visit = (node) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (["WebPage", "CollectionPage", "ContactPage"].includes(node["@type"]) && node.url) {
      urls.push(node.url);
    }
    if (node["@graph"]) visit(node["@graph"]);
  };
  jsonLdBlocks(script).forEach(visit);
  return urls;
}

describe("section pages keep their own canonical and share URLs", () => {
  it("points /police/ and /news/police/ at themselves", () => {
    const police = head(
      <MemoryRouter>
        <PolicePage />
      </MemoryRouter>,
    );
    const archive = head(
      <MemoryRouter>
        <PoliceNewsPage />
      </MemoryRouter>,
    );
    for (const [metadata, url] of [
      [police, "https://stcatharinesdigital.ca/police/"],
      [archive, "https://stcatharinesdigital.ca/news/police/"],
    ]) {
      expect(metadata.link).toContain(`href="${url}"`);
      expect(metadata.meta).toContain(`property="og:url" content="${url}"`);
      expect(ownPageUrls(metadata.script)).toContain(url);
      expect(metadata.script).not.toContain("St. Catharines Digital Police News");
    }
  });

  it("does not send other section and list pages to the homepage URL", () => {
    const cases = [
      [
        () => (
          <MemoryRouter>
            <PlanningTrackerPage />
          </MemoryRouter>
        ),
        "https://stcatharinesdigital.ca/planning-tracker/",
      ],
      [
        () => (
          <MemoryRouter>
            <VotesHubPage />
          </MemoryRouter>
        ),
        "https://stcatharinesdigital.ca/votes/",
      ],
      [
        () => (
          <MemoryRouter initialEntries={["/news/welland"]}>
            <Routes>
              <Route path="/news/:citySlug" element={<CityNewsPage />} />
            </Routes>
          </MemoryRouter>
        ),
        "https://stcatharinesdigital.ca/news/welland/",
      ],
    ];
    for (const [renderNode, url] of cases) {
      const metadata = head(renderNode());
      expect(metadata.link).toContain(`href="${url}"`);
      expect(metadata.meta).toContain(`property="og:url" content="${url}"`);
      const urls = ownPageUrls(metadata.script);
      expect(urls).toContain(url);
      expect(urls).not.toContain("https://stcatharinesdigital.ca");
      expect(urls).not.toContain("https://stcatharinesdigital.ca/");
    }
  });

  it("marks saved stories noindex", () => {
    const metadata = head(
      <MemoryRouter>
        <SavedPage />
      </MemoryRouter>,
    );
    expect(metadata.meta).toContain('content="noindex,nofollow"');
  });
});

describe("article breadcrumbs only target pages that exist", () => {
  const allowed = new Set([
    "/news",
    "/news/police",
    "/news/st-catharines",
    "/news/welland",
    "/news/thorold",
    "/news/niagara-falls",
  ]);

  it("maps every published article onto a live section", () => {
    for (const article of getPublishableContent()) {
      const section = articleNewsSection(article);
      expect(allowed.has(section.path), article.slug).toBe(true);
      expect(section.path).not.toBe("/news/niagara-region");
    }
    expect(articleNewsSection({ city: "Niagara Region", type: "infrastructure", primarySource: "https://www.niagararegion.ca/news/" }).path).toBe("/news");
    expect(articleNewsSection({ city: "Niagara Region", type: "public-safety", primarySource: "https://www.niagarapolice.ca/news/posts/example/" }).path).toBe("/news/police");
  });

  it("renders the Quaker Road and Project Safe Start crumbs on live sections", () => {
    for (const [slug, path, label] of [
      ["niagara-region-quaker-road-sewer", "/news", "Niagara Region"],
      ["nrps-project-safe-start-results", "/news/police", "Police"],
    ]) {
      const view = render(
        <HelmetProvider>
          <MemoryRouter initialEntries={[`/articles/${slug}`]}>
            <Routes>
              <Route path="/articles/:slug" element={<ArticlePage />} />
            </Routes>
          </MemoryRouter>
        </HelmetProvider>,
      );
      const crumb = screen.getByRole("navigation", { name: "Breadcrumb" });
      const link = [...crumb.querySelectorAll("a")].find((anchor) => anchor.textContent === label);
      expect(link).toBeTruthy();
      expect(link.getAttribute("href")).toBe(path);
      expect(crumb.innerHTML).not.toContain("/news/niagara-region");
      expect(document.head.innerHTML + document.body.innerHTML).not.toContain("/news/niagara-region");
      view.unmount();
    }
  });
});

describe("corrections request form", () => {
  it("prefills the entry, states the 72-hour review, and queues the request", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, received: true }),
    });
    vi.stubGlobal("fetch", fetchMock);
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={["/corrections?entry=case-nf-graffiti-2026"]}>
          <CorrectionsPage />
        </MemoryRouter>
      </HelmetProvider>,
    );
    expect(screen.getByLabelText("Entry")).toHaveValue("case-nf-graffiti-2026");
    expect(screen.getAllByText(/reviewed within 72 hours/i).length).toBeGreaterThan(0);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Reader" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "reader@example.com" } });
    fireEvent.change(screen.getByLabelText("Claim to review"), {
      target: { value: "The charge named in the headline does not match the release." },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Send correction request" }).closest("form"));
    expect(await screen.findByRole("status")).toHaveTextContent(/reviewed within 72 hours/i);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.kind).toBe("correction");
    expect(body.message).toContain("Entry: case-nf-graffiti-2026");
    expect(body).not.toHaveProperty("apiKey");
    expect(document.body.textContent).not.toMatch(/AGENTMAIL|STC_D1|CRON_SECRET|api[_-]?key/i);
  });
});

describe("development titles and the police desk", () => {
  it("keeps development document titles within a search-result length", () => {
    const suffix = " | Development record";
    for (const record of planningNotices) {
      const title = shortenDocumentTitle(record.title, { suffix });
      expect(title.length).toBeLessThanOrEqual(60);
      expect(title.endsWith(suffix)).toBe(true);
    }
    const sample = planningNotices.find((record) => record.id === "stc-78-oliver-lane-a-57-26");
    expect(`${sample.title}${suffix}`.length).toBeGreaterThan(60);
  });

  it("keeps the curated archive and adds later official releases", () => {
    const desk = policeDeskReleases();
    const curatedLatest = verifiedNrpsReleases.map((release) => release.date).sort().at(-1);
    expect(curatedLatest).toBe("2026-10-22");
    expect(desk.some((release) => release.date > "2026-10-22")).toBe(true);
    expect(desk.filter((release) => release.id === "nrps-2026-10-22-niagara-falls-drug-trafficking-seizure-200k")).toHaveLength(1);
  });
});

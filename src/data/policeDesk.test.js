import { describe, expect, it } from "vitest";
import discovery from "./generated/discovery.json" with { type: "json" };
import { getPublication } from "./publication.js";
import { discoveryPoliceReleases, policeDeskReleases } from "./policeDesk.js";
import {
  REVIEWED_COLLECTOR_HEADLINE_IDS,
  publishableDiscoveryItems,
} from "./reviewedCollectorHeadlines.js";

const SEEDED_TITLES = [
  "34-year-old St Catharines Man Arrested in Drug Trafficking Investigation",
  "Public Assistance Request in Two Thorold Break and Enter Investigations",
  "Suspicious Fire Investigation in Niagara Falls",
  "Fatal House Fire in St. Catharines Under Investigation",
  "Two Milton Teens Arrested in Pelham Grandparent Scam",
  "Firearm and $45,900 in Cocaine Seized - Thorold",
  "46-Year-Old Fonthill Man Arrested for Child Sexual Abuse and Exploitation Material",
  "$119,680 in Illegal Substances Seized in Drug Trafficking Investigation",
  "Grimsby Man Arrested in Armed Robbery Investigation",
  "Loaded Handgun and $343,160 in Illegal Drugs Seized",
  "1 District CIB Investigating Hate-Motivated Vehicle Mischief",
  "7 Roadside Suspensions Issued During Halloween RIDE Initiative",
  "St. Catharines Cheerleading Coach Charged with Reported Sexual Assault Offences",
  "Two Suspects to Identify in Attempt Break and Enter in Welland",
  "Niagara Regional Police Service Suspends Partnership with Crime Stoppers",
];

function collectorItem(overrides) {
  return {
    id: "not-reviewed",
    sourceId: "nrps-media-releases",
    title: "Bridge closed in Thorold",
    url: "https://www.niagarapolice.ca/news/posts/bridge-closed-in-thorold/",
    status: "published",
    reviewRequired: false,
    sourcePublishedAt: "2026-11-08",
    sourceName: "Niagara Regional Police Service media releases",
    city: "Niagara Region",
    kind: "public-safety",
    ...overrides,
  };
}

describe("reviewed collector headlines", () => {
  it("shows the seeded releases after 2026-10-22 on the police desk and the news reader", () => {
    const desk = policeDeskReleases();
    const news = getPublication(new Date("2026-11-11T18:00:00Z"));
    expect(desk.some((release) => release.date > "2026-10-22")).toBe(true);
    expect(SEEDED_TITLES).toHaveLength(15);
    expect(REVIEWED_COLLECTOR_HEADLINE_IDS).toHaveLength(15);
    for (const title of SEEDED_TITLES) {
      expect(desk.some((release) => release.headline === title)).toBe(true);
      expect(news.some((item) => item.title === title)).toBe(true);
    }
  });

  it("hides a collector headline that is not on the allowlist", () => {
    const hidden = collectorItem();
    expect(publishableDiscoveryItems([hidden])).toEqual([]);
    expect(discoveryPoliceReleases([], [hidden])).toEqual([]);
  });

  it("holds Teen charged and 16-year-old charged on the police desk and the news reader", () => {
    const teen = collectorItem({
      id: REVIEWED_COLLECTOR_HEADLINE_IDS[0],
      title: "Teen charged",
      url: "https://www.niagarapolice.ca/news/posts/teen-charged/",
    });
    const sixteen = collectorItem({
      id: REVIEWED_COLLECTOR_HEADLINE_IDS[1],
      title: "16-year-old charged",
      url: "https://www.niagarapolice.ca/news/posts/16-year-old-charged/",
    });
    expect(publishableDiscoveryItems([teen, sixteen])).toEqual([]);
    expect(discoveryPoliceReleases([], [teen, sixteen])).toEqual([]);
    const realIds = new Set((discovery.items || []).map((item) => item.id));
    expect(realIds.has("teen-charged")).toBe(false);
  });
});

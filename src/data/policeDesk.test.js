import { afterEach, describe, expect, it, vi } from "vitest";
import { headlineNamesPerson, withoutNamedCollectorHeadlines } from "./policeDesk.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("collector headline name guard", () => {
  it("allows a place or agency and holds back a name, youth, or young person", () => {
    expect(headlineNamesPerson("Suspicious fire in Niagara Falls")).toBe(false);
    expect(headlineNamesPerson("Thorold police service notice")).toBe(false);
    expect(headlineNamesPerson("Niagara Regional Police Service")).toBe(false);
    expect(headlineNamesPerson("Pat Chiocchio elected in Welland")).toBe(true);
    expect(headlineNamesPerson("Youth arrested in Thorold")).toBe(true);
    expect(headlineNamesPerson("A young person was seen in Welland")).toBe(true);
    expect(headlineNamesPerson("Public Assistance Request in Thorold")).toBe(true);
  });

  it("logs the collector headlines it skips", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const kept = withoutNamedCollectorHeadlines([
      { title: "Road closure in Thorold", url: "https://www.niagarapolice.ca/news/posts/thorold/" },
      { title: "34-year-old St Catharines Man Arrested", url: "https://www.niagarapolice.ca/news/posts/named/" },
      { title: "Five youths charged in Welland", url: "https://www.niagarapolice.ca/news/posts/youths/" },
    ]);
    expect(kept.map((item) => item.title)).toEqual(["Road closure in Thorold"]);
    expect(warn).toHaveBeenCalledOnce();
    expect(String(warn.mock.calls[0][0])).toContain("34-year-old St Catharines Man Arrested");
    expect(String(warn.mock.calls[0][0])).toContain("Five youths charged in Welland");
    expect(String(warn.mock.calls[0][0])).not.toContain("Road closure in Thorold");
  });
});

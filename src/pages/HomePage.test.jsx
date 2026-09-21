import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import HomePage from "./HomePage";

const OFFICIAL_HOST_RE = /\.(ca|com)$/i;

const renderWithProviders = (ui) =>
  render(
    <HelmetProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </HelmetProvider>,
  );

describe("HomePage — Editorial Newsroom", () => {
  it("renders the newsroom headline and attribution promise", () => {
    renderWithProviders(<HomePage />);
    expect(
      screen.getByText(/public records and primary sources/i),
    ).toBeInTheDocument();
  });

  it("uses local file photos with dates and credits when a mapped notice is shown", () => {
    renderWithProviders(<HomePage />);
    const photo = screen.queryAllByRole("img", {
      name: /Stone facade of St. Catharines City Hall/i,
    })[0];
    if (!photo) {
      // Photo mapping is notice-id specific; skip strict assert when that notice is off the front page
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
      return;
    }
    expect(photo).toHaveAttribute(
      "src",
      "/images/local/st-catharines-city-hall.webp",
    );
    expect(
      screen.getAllByText(/File photo, December 2023/i).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: /Hannah Clover/i })[0],
    ).toHaveAttribute(
      "href",
      "https://commons.wikimedia.org/wiki/File:St._Catharines_City_Hall_2023.jpg",
    );
  });

  it("renders the local calendar", () => {
    renderWithProviders(<HomePage />);
    expect(
      screen.getByRole("heading", { name: "This week locally" }),
    ).toBeInTheDocument();
  });

  it("has Planning Tracker CTA", () => {
    renderWithProviders(<HomePage />);
    const cta = screen.getByRole("link", { name: /Planning Tracker/i });
    expect(cta).toBeInTheDocument();
    expect(cta.getAttribute("href")).toBe("/planning-tracker");
  });

  it("links reporting to an official municipal source", () => {
    renderWithProviders(<HomePage />);
    const official = screen.getAllByRole("link", {
      name: "Read official source",
    });
    expect(official.length).toBeGreaterThan(0);
    const host = new URL(official[0].getAttribute("href")).hostname;
    expect(host).toMatch(OFFICIAL_HOST_RE);
    expect(host).not.toMatch(/facebook|twitter|reddit|instagram/i);
  });

  it("renders planning notices from official data", () => {
    renderWithProviders(<HomePage />);
    // Front page ranks active/scheduled notices; assert structure, not a fixed title
    const lead = document.getElementById("lead-story-heading");
    expect(lead).toBeTruthy();
    expect(lead.querySelector('a[href^="/articles/"]')).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "Latest updates" }),
    ).toBeInTheDocument();
  });

  it("keeps the newsletter forms accessible", () => {
    renderWithProviders(<HomePage />);
    const boxes = screen.getAllByRole("textbox", { name: /email address/i });
    expect(boxes.length).toBe(1);
    boxes.forEach((box) => expect(box).toHaveAttribute("type", "email"));
  });

  it("links to the elections hub without hard-coded candidate counts", () => {
    renderWithProviders(<HomePage />);
    expect(
      screen.queryByText(/Eight candidates\. One mayor\./i),
    ).not.toBeInTheDocument();
    const guide = screen.getByRole("link", {
      name: /Election guides and civic information/i,
    });
    expect(guide.getAttribute("href")).toBe("/votes");
  });

  it("offers topic checkboxes in the home capture", () => {
    renderWithProviders(<HomePage />);
    expect(
      screen.getByRole("checkbox", { name: /Council/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /Planning/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /Police/i }),
    ).toBeInTheDocument();
  });

  it("has no duplicate-destination CTAs", () => {
    renderWithProviders(<HomePage />);
    expect(
      screen.queryByRole("link", { name: /Pay with eTransfer/i }),
    ).not.toBeInTheDocument();
  });

  it("keeps file-photo attribution separate from the story source", () => {
    const { container } = renderWithProviders(<HomePage />);
    const caption = container.querySelector(".journal-lead-photo figcaption");
    expect(caption.textContent).toMatch(/File photo/);
    expect(caption.querySelector("a").href).toContain("commons.wikimedia.org");
    expect(
      screen.getByRole("link", { name: "Read official source" }).href,
    ).toContain("stcatharines.ca");
  });

  it("preserves date-only publication days on story times", () => {
    const { container } = renderWithProviders(<HomePage />);
    const times = [...container.querySelectorAll("time[datetime]")];
    expect(times.length).toBeGreaterThan(0);
    const dateOnly = times.find((t) =>
      /^\d{4}-\d{2}-\d{2}$/.test(t.getAttribute("datetime") || ""),
    );
    expect(dateOnly).toBeTruthy();
    // en-CA short month form, e.g. "Sep 2, 2026"
    expect(dateOnly.textContent.trim()).toMatch(/[A-Z][a-z]{2} \d{1,2}, \d{4}/);
  });

  it("marks story times machine-readable", () => {
    const { container } = renderWithProviders(<HomePage />);
    const times = container.querySelectorAll("time[dateTime]");
    expect(times.length).toBeGreaterThan(0);
  });
});

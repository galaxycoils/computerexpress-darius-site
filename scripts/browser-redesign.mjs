import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { filterEvents } from "../src/data/events.js";
import { getSearchIndex, searchSite } from "../src/data/searchIndex.js";
const base = process.env.QA_BASE_URL || "http://127.0.0.1:4173";
const artifacts = "artifacts/browser";
await mkdir(artifacts, { recursive: true });
let preview;
try {
  if (!(await fetch(base)).ok) throw new Error("Preview unavailable");
} catch {
  if (!process.env.QA_BASE_URL)
    preview = spawn(
      process.execPath,
      [
        "node_modules/vite/bin/vite.js",
        "preview",
        "--host",
        "127.0.0.1",
        "--port",
        "4173",
        "--strictPort",
      ],
      { stdio: "ignore" },
    );
}
for (let attempt = 0; attempt < 30; attempt++) {
  try {
    const response = await fetch(base);
    if (response.ok) break;
  } catch {}
  if (attempt === 29) {
    preview?.kill();
    throw new Error("Preview did not become ready");
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
const browser = await chromium
  .launch({
    headless: true,
    executablePath: process.env.CHROME_PATH || undefined,
  })
  .catch((error) => {
    preview?.kill();
    throw error;
  });
const errors = [],
  report = [];
try {
  // Slow route chunks expose startup updates that interrupt Suspense hydration.
  const hydrationContext = await browser.newContext();
  try {
    const coldPage = await hydrationContext.newPage();
    coldPage.on("pageerror", error => errors.push(error.message));
    await coldPage.route("**/googletagmanager.com/**", route => route.abort());
    await coldPage.route("**/assets/*.js", async route => {
      await new Promise(resolve => setTimeout(resolve, 250));
      await route.continue();
    });
    await coldPage.addInitScript(() => {
      localStorage.setItem("theme-v3", "dark");
      localStorage.setItem("scd-edition", "welland");
      localStorage.setItem("scd-saved-stories-v1", '["test-saved-story"]');
    });
    await coldPage.goto(base + "/news/", { waitUntil: "networkidle" });
    await expect(coldPage.locator(".journal-feed")).toBeVisible();
    await expect(coldPage.locator(".journal-root")).toHaveClass(/is-dark/);
    assert.deepEqual(errors, [], "Delayed route chunks hydrate with stored preferences");
  } finally {
    await hydrationContext.close();
  }
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  // Third-party analytics is unrelated to the reader journeys under test.
  await page.route("**/googletagmanager.com/**", (route) => route.abort());
  const routes = [
    "/",
    "/news/",
    "/news/st-catharines/",
    "/search/",
    "/planning-tracker/",
    "/events/",
    "/explore/",
    "/articles/st-catharines-ontario-street-corridor-plan/",
    "/development/stc-39-41-thomas-st-consent/",
    "/reader-services/",
    "/sponsor/",
    "/contact/",
    "/membership/",
    "/explore/port-dalhousie/",
    "/articles/not-a-published-story/",
    "/404/",
    "/council-record/",
    "/council-record/how-we-choose-entries/",
  ];
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      await page.goto(base + route, { waitUntil: "networkidle" });
      assert.equal(
        await page.locator("main h1").count(),
        1,
        `Exactly one main heading ${route}`,
      );
      assert.equal(
        await page.locator("main").count(),
        1,
        `One main landmark ${route}`,
      );
      assert.equal(await page.locator("vite-error-overlay").count(), 0);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      assert.equal(overflow, false, `Horizontal overflow ${width}px ${route}`);
      if (route === "/") {
        const aligned = await page.evaluate(() => {
          const navigation = document.querySelector(".journal-nav-wrap").getBoundingClientRect();
          const content = document.querySelector(".journal-home").getBoundingClientRect();
          return Math.abs(navigation.left - content.left) < 1 && Math.abs(navigation.right - content.right) < 1;
        });
        assert.equal(aligned, true, `Navigation shares the page gutters at ${width}px`);
      }
      report.push({ width, route, pass: true });
    }
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await page.screenshot({
      path: `${artifacts}/home-${width}.png`,
      fullPage: true,
    });
  }
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  assert.equal(
    await page.locator(":focus").textContent(),
    "Skip to main content",
  );
  await page.keyboard.press("Enter");
  assert.equal(await page.locator(":focus").getAttribute("id"), "main-content");
  await page.goto(base + "/news/", { waitUntil: "networkidle" });
  await page
    .getByLabel("City", { exact: true })
    .selectOption({ label: "Welland" });
  await page.waitForURL(/city=Welland/);
  await page
    .getByLabel("Topic", { exact: true })
    .selectOption({ label: "Development" });
  await page.waitForURL(/topic=Development/);
  assert.match(page.url(), /city=Welland/);
  const labels = await page
    .locator(".journal-feed .journal-kicker")
    .allTextContents();
  assert.ok(labels.length > 0 && labels.every((x) => x.includes("Welland")));
  const firstSave = page.getByRole("button", { name: /^Save / }).first();
  await firstSave.click();
  await page
    .getByRole("link", { name: "Saved stories", exact: true })
    .first()
    .click();
  assert.ok((await page.locator(".journal-story").count()) > 0);
  await page.reload({ waitUntil: "networkidle" });
  assert.ok((await page.locator(".journal-story").count()) > 0);
  await page
    .getByRole("button", { name: /^Unsave / })
    .first()
    .click();
  assert.equal(await page.locator(".journal-story").count(), 0);
  // Keep the seeded calendar journey stable as real dates advance.
  const eventsClock = new Date("2026-09-30T12:00:00Z");
  await page.clock.setFixedTime(eventsClock);
  await page.goto(base + "/events/", { waitUntil: "networkidle" });
  await page.getByLabel("When", { exact: true }).selectOption("all");
  await page.getByLabel("View", { exact: true }).selectOption("calendar");
  await expect(page.locator(".journal-calendar-grid")).toBeVisible();
  await page.getByLabel("When", { exact: true }).selectOption("upcoming");
  await page.getByLabel("View", { exact: true }).selectOption("list");
  const upcomingEvents = filterEvents({ period: "upcoming" }, eventsClock);
  await expect(page.locator(".journal-events h2").first()).toHaveText(upcomingEvents[0].title);
  await page
    .getByRole("link", { name: "Details", exact: true })
    .first()
    .click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Add to calendar ↓" }).click();
  const download = await downloadPromise;
  assert.ok(download.suggestedFilename().endsWith(".ics"));
  await page.clock.setFixedTime(new Date());
  await page.goto(base + "/explore/", { waitUntil: "networkidle" });
  await page.screenshot({
    path: `${artifacts}/explore-desktop.png`,
    fullPage: true,
  });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.getByLabel("Colour theme").selectOption("dark");
  assert.equal(
    await page
      .locator(".journal-root")
      .evaluate((el) => el.classList.contains("is-dark")),
    true,
  );
  await page.screenshot({ path: `${artifacts}/home-dark.png`, fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 1000));
  assert.equal(
    await page.locator(".journal-navigation").evaluate(element => Math.round(element.getBoundingClientRect().top)),
    0,
    "Section navigation stays available while reading",
  );
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  assert.equal(
    await page
      .getByRole("button", { name: "Menu", exact: true })
      .getAttribute("aria-expanded"),
    "false",
  );
  assert.equal(
    await page
      .getByRole("button", { name: "Menu", exact: true })
      .evaluate((element) => element === document.activeElement),
    true,
  );
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByLabel("Your city edition").selectOption("welland");
  await page.getByRole("link", { name: "Open edition" }).click();
  await page.waitForURL(/\/news\/welland/);
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .waitFor({ state: "hidden" });
  assert.equal(
    await page.getByRole("navigation", { name: "Mobile navigation" }).count(),
    0,
  );
  await page.getByLabel("Colour theme").selectOption("light");
  await page.goto(base + "/planning-tracker/", { waitUntil: "networkidle" });
  const tableRecords = await page.locator(".planning-table tbody tr").count();
  assert.ok(tableRecords > 0);
  await page.getByRole("button", { name: "Card view", exact: true }).click();
  assert.equal(await page.locator(".notice-card").count(), tableRecords);
  await page.getByRole("button", { name: "Table view", exact: true }).click();
  await expect(page.getByRole("region", { name: "Planning notices table" })).toBeVisible();
  await page.goto(base + "/reader-services/", { waitUntil: "networkidle" });
  await expect(page.getByRole("link", { name: /Open RSS feed/ })).toHaveAttribute("href", "/rss.xml");
  await page.getByLabel("Colour theme").selectOption("dark");
  await page.emulateMedia({ media: "print" });
  assert.equal(
    await page.locator("main h1").evaluate(element => getComputedStyle(element).color),
    "rgb(0, 0, 0)",
    "Dark mode produces legible printed headings",
  );
  await expect(page.locator(".journal-navigation")).not.toBeVisible();
  await page.emulateMedia({ media: "screen" });
  await page.getByLabel("Colour theme").selectOption("light");
  await page.goto(base + "/news/", { waitUntil: "networkidle" });
  await page.getByRole("searchbox").fill("unfindable-test-query");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await page.waitForURL(/q=unfindable-test-query/);
  await page
    .getByRole("heading", { name: "No matching records" })
    .waitFor({ state: "visible" });

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base + "/search/?q=Port+Dalhousie&section=Local+guides", {
    waitUntil: "networkidle",
  });
  assert.ok((await page.locator(".journal-story").count()) > 0);
  await page
    .getByRole("button", { name: /^Save / })
    .first()
    .click();
  await page.goto(base + "/saved/", { waitUntil: "networkidle" });
  assert.ok(
    (await page.locator(".journal-story").count()) > 0,
    "Guides can be saved",
  );
  await page
    .getByRole("button", { name: /^Unsave / })
    .first()
    .click();
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(page.locator(".journal-story")).toHaveCount(1);
  await page.getByRole("button", { name: "Clear saved stories" }).click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.locator(".journal-story")).toHaveCount(1);
  await page.getByRole("button", { name: "Clear saved stories" }).click();
  await page.getByRole("button", { name: "Yes, clear it" }).click();
  await expect(page.locator(".journal-story")).toHaveCount(0);
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(page.locator(".journal-story")).toHaveCount(1);

  // Search order follows the visitor clock. Freeze it and expect the pages
  // derived from that instant, so a repeated title cannot look like a stuck page.
  const searchClock = new Date("2026-10-20T16:00:00Z");
  await page.clock.setFixedTime(searchClock);
  await page.goto(base + "/search/", { waitUntil: "networkidle" });
  const searchResults = searchSite(getSearchIndex(searchClock), {});
  const pageIds = (pageNumber) => searchResults.slice((pageNumber - 1) * 12, pageNumber * 12).map((item) => item.id);
  const storyRecords = page.locator(".journal-feed .journal-story");
  const readIds = () => storyRecords.evaluateAll((records) => records.map((record) => record.dataset.storyId));
  await expect.poll(readIds).toEqual(pageIds(1));
  await page.getByRole("button", { name: "Next →" }).click();
  await page.waitForURL(/page=2/);
  const pageStart = 13;
  const pageEnd = Math.min(searchResults.length, 24);
  await expect(page.locator(".journal-results-meta")).toContainText(`Showing ${pageStart}–${pageEnd}`);
  await expect.poll(readIds).toEqual(pageIds(2));
  const secondPageIds = await readIds();
  assert.notDeepEqual(secondPageIds, pageIds(1), "Next displays a different page of records");
  assert.ok(secondPageIds.every((id) => id && !pageIds(1).includes(id)), "Result identities do not repeat across pages");
  assert.equal(
    await page
      .locator(".journal-results-meta")
      .evaluate((element) => element === document.activeElement),
    true,
  );

  await page.goto(
    base + "/articles/st-catharines-ontario-street-corridor-plan/",
    { waitUntil: "networkidle" },
  );
  await page
    .getByRole("link", { name: /Report a correction or update/ })
    .click();
  await page.waitForURL(/subject=Correction/);
  await page.getByLabel("What is your message about?").waitFor();
  assert.equal(
    await page.getByLabel("What is your message about?").inputValue(),
    "Correction",
  );
  assert.match(
    await page.getByLabel(/Page or source URL/).inputValue(),
    /articles\/st-catharines-ontario-street-corridor-plan/,
  );
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  assert.equal(
    await page
      .getByLabel(/^Name/)
      .evaluate((element) => element === document.activeElement),
    true,
  );
  let submissions = 0;
  await page.route("**/api/contact", async (route) => {
    const data = route.request().postDataJSON();
    assert.equal(data.kind, "correction");
    submissions++;
    await route.fulfill({
      status: submissions === 1 ? 503 : 200,
      contentType: "application/json",
      body: JSON.stringify(
        submissions === 1
          ? { error: "The service is temporarily unavailable." }
          : { success: true, received: true },
      ),
    });
  });
  await page.getByLabel(/^Name/).fill("Browser QA Reader");
  await page.getByLabel(/^Email/).fill("reader@example.com");
  await page
    .getByLabel(/^Message/)
    .fill("Please review the date listed in the linked public record.");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await page.getByText("The service is temporarily unavailable.").waitFor();
  assert.equal(
    await page.getByLabel(/^Name/).inputValue(),
    "Browser QA Reader",
  );
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await page.getByRole("heading", { name: "Message received." }).waitFor();

  await page.goto(base + "/news/", { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await page.evaluate(() =>
    document.querySelector(".journal-masthead .journal-wordmark").click(),
  );
  await page.waitForURL(base + "/");
  // SPA URLs update before route rendering and animation-frame scroll effects.
  await expect(page.locator("main h1")).toHaveText("Your city. Your stories.");
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.goBack({ waitUntil: "networkidle" });
  await expect(page.locator("main h1")).toHaveText("News, close to home.");
  await expect
    .poll(
      async () => Math.abs((await page.evaluate(() => window.scrollY)) - 600),
      { message: "Back restores the reading position" },
    )
    .toBeLessThan(30);
  // Deterministically deliver a stale scroll event before the restoration frame.
  // A delayed event must never replace this history entry's saved 600px offset.
  await page.evaluate(() => document.querySelector(".journal-masthead .journal-wordmark").click());
  await page.waitForURL(base + "/");
  await expect(page.locator("main h1")).toHaveText("Your city. Your stories.");
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.evaluate(() => {
    const original = window.requestAnimationFrame.bind(window);
    const callbacks = [];
    let held = true;
    window.__qaDeferredFrames = callbacks;
    window.__qaReleaseFrames = () => {
      held = false;
      window.requestAnimationFrame = original;
      for (const callback of callbacks) callback();
    };
    window.requestAnimationFrame = callback => original(time => {
      if (held) callbacks.push(() => callback(time));
      else callback(time);
    });
  });
  await page.goBack({ waitUntil: "networkidle" });
  await expect(page.locator("main h1")).toHaveText("News, close to home.");
  await expect.poll(() => page.evaluate(() => window.__qaDeferredFrames.length)).toBeGreaterThan(0);
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    window.dispatchEvent(new Event("scroll"));
    window.__qaReleaseFrames();
    delete window.__qaReleaseFrames;
    delete window.__qaDeferredFrames;
  });
  await expect.poll(() => page.evaluate(() => window.scrollY), {
    message: "Back retains the saved offset despite delayed scroll events",
  }).toBe(600);
  assert.deepEqual(errors, []);
  await writeFile(
    `${artifacts}/report.json`,
    JSON.stringify(
      {
        checks: report,
        journeys: [
          "delayed route hydration with stored preferences",
          "filters",
          "saved stories persistence/removal",
          "calendar download",
          "dark theme",
          "mobile menu/escape",
          "sticky reading navigation",
          "planning table/card views",
          "reader RSS destination",
          "dark-mode print legibility",
          "no-results",
          "keyboard skip link",
          "mobile city editions",
          "search guides and pagination",
          "reading list undo and clear confirmation",
          "correction context and form recovery",
          "history scroll restoration",
          "history restoration with delayed scroll events",
        ],
        errors,
      },
      null,
      2,
    ),
  );
  console.log(
    `Browser QA passed: ${report.length} responsive page checks and 18 reader journeys.`,
  );
} catch (error) {
  // Retain the current route/viewport on failure, before closing the browser.
  for (const [index, failedPage] of browser.contexts().flatMap(context => context.pages()).entries()) {
    try {
      const state = await failedPage.evaluate(() => ({
        url: location.href, scrollY: window.scrollY,
        documentHeight: document.documentElement.scrollHeight,
        viewportHeight: window.innerHeight, historyKey: history.state?.key,
        heading: document.querySelector("main h1")?.textContent,
      }));
      await writeFile(`${artifacts}/failure-${index}.json`, JSON.stringify(state, null, 2));
      await failedPage.screenshot({ path: `${artifacts}/failure-${index}.png` });
    } catch {}
  }
  throw error;
} finally {
  await browser.close();
  preview?.kill();
}

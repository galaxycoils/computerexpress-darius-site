import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const base = process.env.QA_BASE_URL || "http://127.0.0.1:4173";
await mkdir("qa-results", { recursive: true });
for (let attempt = 0; attempt < 30; attempt++) {
  try {
    const response = await fetch(base);
    if (response.ok) break;
  } catch {}
  if (attempt === 29) throw new Error("Preview did not become ready");
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
const browser = await chromium.launch({ headless: true });
const errors = [],
  report = [];
try {
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
    "/development/stc-455-welland-ave/",
    "/reader-services/",
    "/contact/",
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
      assert.equal(await page.locator("vite-error-overlay").count(), 0);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      assert.equal(overflow, false, `Horizontal overflow ${width}px ${route}`);
      report.push({ width, route, pass: true });
    }
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await page.screenshot({
      path: `qa-results/home-${width}.png`,
      fullPage: true,
    });
  }
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto(base + "/news/", { waitUntil: "networkidle" });
  await page
    .getByLabel("City", { exact: true })
    .selectOption({ label: "Welland" });
  await page
    .getByLabel("Topic", { exact: true })
    .selectOption({ label: "Development" });
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
  await page.goto(base + "/events/", { waitUntil: "networkidle" });
  await page.getByLabel("View", { exact: true }).selectOption("calendar");
  assert.ok(await page.locator(".journal-calendar-grid").isVisible());
  await page.getByLabel("View", { exact: true }).selectOption("list");
  await page.getByRole("link", { name: "Details ↗" }).first().click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Add to calendar ↓" }).click();
  const download = await downloadPromise;
  assert.ok(download.suggestedFilename().endsWith(".ics"));
  await page.goto(base + "/explore/", { waitUntil: "networkidle" });
  await page.screenshot({
    path: "qa-results/explore-desktop.png",
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
  await page.screenshot({ path: "qa-results/home-dark.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Menu ☰" }).click();
  assert.equal(
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .isVisible(),
    true,
  );
  await page.keyboard.press("Escape");
  assert.equal(
    await page
      .getByRole("button", { name: "Menu ☰" })
      .getAttribute("aria-expanded"),
    "false",
  );
  await page.getByLabel("Colour theme").selectOption("light");
  await page.goto(base + "/news/", { waitUntil: "networkidle" });
  await page.getByRole("searchbox").fill("unfindable-test-query");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  assert.equal(
    await page
      .getByRole("heading", { name: "No matching records" })
      .isVisible(),
    true,
  );
  assert.deepEqual(errors, []);
  await writeFile(
    "qa-results/report.json",
    JSON.stringify(
      {
        checks: report,
        journeys: [
          "filters",
          "saved stories persistence/removal",
          "calendar download",
          "dark theme",
          "mobile menu/escape",
          "no-results",
        ],
        errors,
      },
      null,
      2,
    ),
  );
  console.log(
    `Browser QA passed: ${report.length} responsive page checks and 6 reader journeys.`,
  );
} finally {
  await browser.close();
}

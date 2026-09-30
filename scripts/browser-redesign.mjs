import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
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
  // Keep the seeded calendar journey stable as real dates advance.
  await page.clock.setFixedTime(new Date("2026-09-30T12:00:00Z"));
  await page.goto(base + "/events/", { waitUntil: "networkidle" });
  await page.getByLabel("When", { exact: true }).selectOption("all");
  await page.getByLabel("View", { exact: true }).selectOption("calendar");
  await expect(page.locator(".journal-calendar-grid")).toBeVisible();
  await page.getByLabel("When", { exact: true }).selectOption("upcoming");
  await page.getByLabel("View", { exact: true }).selectOption("list");
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

  await page.goto(base + "/search/", { waitUntil: "networkidle" });
  const firstTitle = await page
    .locator(".journal-feed h3")
    .first()
    .textContent();
  await page.getByRole("button", { name: "Next →" }).click();
  await page.waitForURL(/page=2/);
  await expect(page.locator(".journal-feed h3").first()).not.toHaveText(
    firstTitle,
  );
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
  await page.waitForTimeout(100);
  await page.evaluate(() =>
    document.querySelector(".journal-masthead .journal-wordmark").click(),
  );
  await page.waitForURL(base + "/");
  await page.goBack({ waitUntil: "networkidle" });
  assert.ok(
    Math.abs((await page.evaluate(() => window.scrollY)) - 600) < 30,
    "Back restores the reading position",
  );
  assert.deepEqual(errors, []);
  await writeFile(
    `${artifacts}/report.json`,
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
          "keyboard skip link",
          "mobile city editions",
          "search guides and pagination",
          "reading list undo and clear confirmation",
          "correction context and form recovery",
          "history scroll restoration",
        ],
        errors,
      },
      null,
      2,
    ),
  );
  console.log(
    `Browser QA passed: ${report.length} responsive page checks and 12 reader journeys.`,
  );
} finally {
  await browser.close();
  preview?.kill();
}

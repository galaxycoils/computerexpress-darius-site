export function resolveRenderNow(configured, fallback = new Date()) {
  if (configured === undefined || configured === "") return fallback;
  return getReleaseRenderNow({ renderedAt: configured });
}

export function getReleaseRenderNow(release) {
  if (typeof release?.renderedAt !== "string") {
    throw new Error("Release metadata is missing a valid renderedAt timestamp");
  }

  const renderedAt = new Date(release.renderedAt);
  if (Number.isNaN(renderedAt.getTime())) {
    throw new Error("Release metadata is missing a valid renderedAt timestamp");
  }

  return renderedAt;
}

export function isExpectedRelease(
  actual,
  expected,
  expectedSha = expected?.sha,
  { matchRenderTime = true } = {},
) {
  return Boolean(
    actual &&
      expectedSha &&
      actual.sha === expectedSha &&
      expected?.snapshotHash &&
      actual.snapshotHash === expected.snapshotHash &&
      typeof actual.renderedAt === "string" &&
      (!matchRenderTime ||
        (expected.renderedAt && actual.renderedAt === expected.renderedAt)),
  );
}

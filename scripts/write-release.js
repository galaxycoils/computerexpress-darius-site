import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { getPublication } from "../src/data/publication.js";
const publication = getPublication();
const sha =
  process.env.RELEASE_SHA ||
  execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const snapshotHash = createHash("sha256")
  .update(JSON.stringify(publication))
  .digest("hex");
writeFileSync(
  "dist/release.json",
  JSON.stringify(
    {
      sha,
      snapshotHash,
      builtAt: new Date().toISOString(),
      records: publication.length,
      design: "garden-city-journal",
    },
    null,
    2,
  ) + "\n",
);

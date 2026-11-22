// Dariush or Desk Editor add discovery ids here after review.
// A Niagara Regional Police collector headline is published only when its
// id is listed, and it is still held back when the title matches the
// age or youth pattern below.

export const REVIEWED_COLLECTOR_HEADLINE_IDS = [
  "828f70e1330cea56",
  "93438486b94f6242",
  "f7726fa47b645ac0",
  "28a3748c9fd13f4a",
  "07a7d1146a0c4cd3",
  "6ab8f2352259142b",
  "7ecd41199252c14c",
  "c3b156ce2362df70",
  "f7ecb13f4bc424e7",
  "64e09c9c5017a659",
  "6eb37fc554408630",
  "ae4db1bc3daba211",
  "4e1077b934685b8a",
  "1bf262806988ed27",
  "1a3bfa792049d78f",
]

const HELD_HEADLINE = /\b(teen|youth|young person|minor|boy|girl|(?:1[0-7]|[1-9])[- ]year[- ]old)\b/i

export function collectorHeadlineHeld(title) {
  return HELD_HEADLINE.test(String(title || ""))
}

export function reviewedCollectorHeadline(item) {
  if (collectorHeadlineHeld(item?.title)) return false
  return REVIEWED_COLLECTOR_HEADLINE_IDS.includes(item?.id)
}

export function publishableDiscoveryItems(items = []) {
  return items.filter((item) => {
    if (item?.status !== "published" || item?.reviewRequired) return false
    if (item?.sourceId === "nrps-media-releases") return reviewedCollectorHeadline(item)
    return true
  })
}

const TORONTO_TIME_ZONE = "America/Toronto";
const localDateTimePattern =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,3})?)?$/;

const torontoParts = new Intl.DateTimeFormat("en-CA", {
  timeZone: TORONTO_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

export function getRenderNow() {
  const timestamp = globalThis.__SCD_RENDER_NOW__;
  if (typeof timestamp === "string") {
    const date = new Date(timestamp);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return new Date();
}

export function parseTorontoDate(value) {
  if (typeof value !== "string") return new Date(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
      ? date
      : new Date(NaN);
  }

  const match = value.match(localDateTimePattern);
  if (!match || /(?:z|[+-]\d{2}:?\d{2})$/i.test(value)) return new Date(value);

  const [, year, month, day, hour, minute, second = "0"] = match;
  const desired = Date.UTC(+year, +month - 1, +day, +hour, +minute, +second);
  let timestamp = desired;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const parts = Object.fromEntries(
      torontoParts
        .formatToParts(new Date(timestamp))
        .map(({ type, value: part }) => [type, part]),
    );
    const represented = Date.UTC(
      +parts.year,
      +parts.month - 1,
      +parts.day,
      +parts.hour,
      +parts.minute,
      +parts.second,
    );
    const adjustment = desired - represented;
    timestamp += adjustment;
    if (adjustment === 0) break;
  }

  return new Date(timestamp);
}

import { planningNotices } from "./planningNotices.js";
import { todayToronto } from "./publication.js";
export const civicEvents = planningNotices
  .filter((n) => n.meetingDate)
  .map((n) => ({ ...n, startsAt: n.meetingDate, timezone: "America/Toronto" }))
  .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
export function eventTime(value) {
  return value
    ? new Date(`${value.slice(0, 19)}Z`).toLocaleTimeString("en-CA", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "UTC",
      })
    : "Time not provided";
}
// Source times are local civil time in Niagara. Preserve them in ICS with a DST-aware timezone.
export function createCalendarEvent(event) {
  const escape = (value) =>
    String(value || "")
      .replace(/\\/g, "\\\\")
      .replace(/\r?\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  const compact = event.startsAt.replace(/[-:]/g, "").slice(0, 15);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//St Catharines Digital//Civic Calendar//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VTIMEZONE",
    "TZID:America/Toronto",
    "BEGIN:STANDARD",
    "DTSTART:20071104T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
    "TZOFFSETFROM:-0400",
    "TZOFFSETTO:-0500",
    "TZNAME:EST",
    "END:STANDARD",
    "BEGIN:DAYLIGHT",
    "DTSTART:20070311T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
    "TZOFFSETFROM:-0500",
    "TZOFFSETTO:-0400",
    "TZNAME:EDT",
    "END:DAYLIGHT",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:${event.id}@stcatharinesdigital.ca`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    `DTSTART;TZID=America/Toronto:${compact}`,
    `SUMMARY:${escape(event.title)}`,
    `LOCATION:${escape(event.meetingLocation)}`,
    `DESCRIPTION:${escape("Check the official source for changes: " + event.sourceUrl)}`,
    `URL:${event.sourceUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return (
    lines
      .map((line) => {
        const chunks = [];
        let chunk = "";
        for (const char of line) {
          if (new TextEncoder().encode(chunk + char).length > 73) {
            chunks.push(chunk);
            chunk = " " + char;
          } else chunk += char;
        }
        chunks.push(chunk);
        return chunks.join("\r\n");
      })
      .join("\r\n") + "\r\n"
  );
}
export function filterEvents(
  { city = "", period = "upcoming", date = "" } = {},
  now = new Date(),
) {
  const today = todayToronto(now);
  return civicEvents.filter(
    (e) =>
      (!city || e.municipality === city) &&
      (!date || e.startsAt.startsWith(date)) &&
      (period === "all" ||
        (period === "past"
          ? e.startsAt.slice(0, 10) < today
          : e.startsAt.slice(0, 10) >= today)),
  );
}

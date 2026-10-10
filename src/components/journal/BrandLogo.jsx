export default function BrandLogo({ reversed = false }) {
  if (reversed) {
    return (
      <img
        className="journal-brand-logo"
        src="/logo-news.svg"
        alt="St. Catharines Digital"
        width="540"
        height="128"
      />
    );
  }
  return (
    <>
      <img
        className="journal-brand-logo journal-brand-logo--ink"
        src="/logo-horizontal.svg"
        alt="St. Catharines Digital"
        width="540"
        height="128"
      />
      <img
        className="journal-brand-logo journal-brand-logo--paper"
        src="/logo-news.svg"
        alt="St. Catharines Digital"
        width="540"
        height="128"
      />
    </>
  );
}

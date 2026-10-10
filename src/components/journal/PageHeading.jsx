export default function PageHeading({ kicker, title, children }) {
  return (
    <header className="journal-page-heading">
      <p className="journal-kicker">{kicker}</p>
      <h1>{title}</h1>
      {children}
    </header>
  );
}

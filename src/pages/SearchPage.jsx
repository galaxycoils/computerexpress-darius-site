import Seo from "../components/Seo";
import NewsFeed from "../components/journal/NewsFeed";
export default function SearchPage() {
  return (
    <>
      <Seo
        title="Search | St. Catharines Digital"
        description="Search Niagara news, civic records, addresses and official updates."
        path="/search"
      />
      <div className="scd-page journal-page">
        <header className="journal-page-heading">
          <p className="journal-kicker">Find your local story</p>
          <h1>A little local knowledge.</h1>
          <p>Search by address, subject, city or municipal file number.</p>
        </header>
        <NewsFeed search />
      </div>
    </>
  );
}

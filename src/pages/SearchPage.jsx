import Seo from "../components/Seo";
import NewsFeed from "../components/journal/NewsFeed";
export default function SearchPage() {
  return (
    <>
      <Seo
        title="Search | St. Catharines Digital"
        description="Search Niagara news, development records, civic meetings and local guides by street, city or subject."
        path="/search"
      />
      <div className="scd-page journal-page">
        <header className="journal-page-heading">
          <p className="journal-kicker">Find your local story</p>
          <h1>Find your local.</h1>
          <p>News, development records, civic meetings and local guides. Search a street, a subject or a municipal file number.</p>
        </header>
        <NewsFeed search />
      </div>
    </>
  );
}

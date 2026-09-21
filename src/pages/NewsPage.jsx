import Seo from "../components/Seo";
import NewsFeed from "../components/journal/NewsFeed";
export default function NewsPage() {
  return (
    <>
      <Seo
        title="Latest news | St. Catharines Digital"
        description="Explore source-linked local news, municipal notices and public records across Niagara."
        path="/news"
      />
      <div className="scd-page journal-page">
        <header className="journal-page-heading">
          <p className="journal-kicker">The local record</p>
          <h1>News, close to home.</h1>
          <p>
            Follow your city. Understand the decisions. Go straight to the
            source.
          </p>
        </header>
        <NewsFeed />
      </div>
    </>
  );
}

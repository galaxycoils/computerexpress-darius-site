import Seo from "../components/Seo";
import NewsFeed from "../components/journal/NewsFeed";
import PageHeading from "../components/journal/PageHeading";
export default function SearchPage() {
  return (
    <>
      <Seo
        title="Search | St. Catharines Digital"
        description="Search Niagara news, development records, civic meetings and local guides by street, city or subject."
        path="/search"
      />
      <div className="scd-page journal-page">
        <PageHeading kicker="Find your local story" title="Find your local.">
          <p>News, development records, civic meetings and local guides. Search a street, a subject or a municipal file number.</p>
        </PageHeading>
        <NewsFeed search />
      </div>
    </>
  );
}

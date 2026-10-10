import Seo from "../components/Seo";
import { getNewsMediaSchema } from "../data/schema";
import NewsFeed from "../components/journal/NewsFeed";
import PageHeading from "../components/journal/PageHeading";
export default function NewsPage() {
  return (
    <>
      <Seo
        title="Latest news | St. Catharines Digital"
        description="Explore source-linked local news, municipal notices and public records across Niagara."
        path="/news"
        jsonLd={getNewsMediaSchema()}
      />
      <div className="scd-page journal-page">
        <PageHeading kicker="The local record" title="News, close to home.">
          <p>
            Follow your city. Understand the decisions. Go straight to the
            source.
          </p>
        </PageHeading>
        <NewsFeed />
      </div>
    </>
  );
}

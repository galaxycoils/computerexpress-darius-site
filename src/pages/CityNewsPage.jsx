import { Link, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import { cityBySlug } from "../data/cities";
import { localPhotos } from "../data/localPhotos";
import { Photo } from "../components/journal/Story";
import NewsFeed from "../components/journal/NewsFeed";
export default function CityNewsPage() {
  const { citySlug } = useParams();
  const city = cityBySlug[citySlug];
  if (!city)
    return (
      <div className="scd-page journal-page">
        <h1>City not found</h1>
        <Link to="/news">Browse Niagara news</Link>
      </div>
    );
  return (
    <>
      <Seo
        title={`${city.name} news | St. Catharines Digital`}
        description={city.description}
        path={`/news/${citySlug}`}
      />
      <div className="scd-page journal-page">
        <header className="journal-city-hero">
          <div>
            <p className="journal-kicker">Your local edition</p>
            <h1>
              {city.name}
              <span>.</span>
            </h1>
            <p>
              Public records. Local decisions.
              <br />A closer look at your community.
            </p>
            <a className="journal-link" href={city.officialSite}>
              Visit the official city website ↗
            </a>
          </div>
          <Photo photo={localPhotos[city.name]} eager />
        </header>
        <NewsFeed city={city.name} />
      </div>
    </>
  );
}

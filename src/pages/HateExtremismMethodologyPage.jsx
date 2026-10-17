import { Link } from 'react-router-dom'
import PageHeading from '../components/journal/PageHeading'
import Seo, { BASE_URL } from '../components/Seo'

export default function HateExtremismMethodologyPage() {
  return (
    <>
      <Seo
        title="How entries are chosen | Hate & Extremism in Niagara"
        description="Sourcing, naming and correction rules for the Hate & Extremism in Niagara public record."
        path="/hate-extremism/methodology"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'How entries are chosen',
          url: `${BASE_URL}/hate-extremism/methodology/`,
          isPartOf: { '@type': 'WebSite', name: 'St. Catharines Digital', url: `${BASE_URL}/` },
        }}
      />
      <article className="scd-page journal-page">
        <PageHeading kicker="Method" title="How entries are chosen">
          <p>
            Rules for the Hate & Extremism in Niagara record. Version 1, 17 October 2026.
          </p>
          <Link className="journal-link" to="/hate-extremism">Back to the record</Link>
        </PageHeading>

        <aside className="journal-empty" aria-label="Legal review">
          <h2>Pending legal review</h2>
          <p>
            Lawyer review of this section is still underway. Publication of a record on this preview is not the end of that review.
          </p>
        </aside>

        <div className="journal-prose">
          <h2>What qualifies</h2>
          <p>A group record draws on at least one of these:</p>
          <ul>
            <li>Public Safety Canada’s listed terrorist entities</li>
            <li>Court records</li>
            <li>Police statements</li>
            <li>The Canadian Anti-Hate Network</li>
            <li>The Global Project Against Hate and Extremism (GPAHE)</li>
            <li>Established outlets, including CBC, the St. Catharines Standard, the Welland Tribune, Global News, CTV and the Toronto Star</li>
          </ul>
          <p>
            An incident record is a hate-motivated charge, a Niagara Regional Police hate-crime statistic, documented flyering or vandalism, or a council response. A response record is a public statement or decision from a municipality or public body.
          </p>
          <p>
            Being absent from Public Safety Canada’s listed-entities list is stated only as that absence. This record does not treat a group as a listed terrorist entity unless the public list says so.
          </p>

          <h2>Sources</h2>
          <p>
            Every court case, group, incident and response needs at least two sources. Each source shows the outlet, the link and the publication date. A date that is not finalized is marked TODO. It is not replaced with a guessed day.
          </p>
          <p>
            An official statistic may cite a single official publisher, such as Statistics Canada, Niagara Regional Police or Public Safety Canada. That exception does not extend to court cases, groups, incidents or responses. A statistic can include a methodology note, for example that the figure includes suspected incidents.
          </p>
          <p>
            A support resource, shown only under Report hate / get support, may cite one source. Each URL or phone number on that block is verified, or the contact is marked TODO.
          </p>
          <p>
            Social media, forums, rumour and inference from an undated “deep search” are not sources. When two credible reports disagree about a single day, the record uses the wider date they share. The Brock’s Monument rally is dated Labour Day weekend 2025 for that reason.
          </p>

          <h2>Naming a person</h2>
          <p>A person is named only when two credible sources confirm the identification and at least one of these is true:</p>
          <ul>
            <li>They are charged with or convicted of a hate-related offence. The status is stated as charged, convicted, acquitted or stayed. Withdrawn is used when the charge is dropped.</li>
            <li>They are a publicly self-identified leader or organizer of a documented group. The description stays inside that role.</li>
            <li>They are a public figure whose conduct was reported by credible press.</li>
          </ul>
          <p>
            The wording is the source’s, in quotation marks or attributed, with the link and date. Labels such as “white supremacist” are not used in this newsroom’s own voice. If charges are dropped or the person is acquitted, the status is updated within 48 hours.
          </p>
          <p>The record does not name an accused person when the sources do not meet that test.</p>

          <h2>What we never publish</h2>
          <ul>
            <li>Home addresses, workplaces and family members</li>
            <li>Photos of private people</li>
            <li>Names, ages, schools, streets or other details that identify a minor, including under the Youth Criminal Justice Act</li>
            <li>Anything sourced only from social media, forums, rumour or inference</li>
          </ul>

          <h2>Scope</h2>
          <p>
            A Niagara record is about this region. A regional-context record is a group based outside Niagara that credible reporting connects to the region. Those records are labelled “Regional context” and can be filtered on their own.
          </p>

          <h2>Status, review and corrections</h2>
          <p>
            Every record shows a status, the date it was added and the date it was last checked. Corrections are listed on the record. A correction request is reviewed within 72 hours.
          </p>
          <p>
            <Link to="/corrections">Request a correction / right of reply</Link>
            {' '}
            or use the link on the record itself. Include the record address, the claim to review and a supporting source.
          </p>
          <p>
            <Link to="/editorial-policy">Newsroom editorial policy</Link>
          </p>
        </div>
      </article>
    </>
  )
}

import { OFFICIAL_SOURCES } from '../../data/cities'

export default function OfficialSourcesPanel() {
  return (
    <div className="scd-side-block">
      <h4 className="scd-side-label">Official Sources</h4>
      <ul className="scd-side-list">
        {OFFICIAL_SOURCES.map((s) => (
          <li key={s.href}>
            <a href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label} ↗
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

import UiIcon from "../journal/UiIcon";
import { getLastRefreshedLabel } from "../data/officialDiscovery";

const COLLECTED = getLastRefreshedLabel("Official-source snapshot collected ");

export default function OfficialSourcesPanel() {
  return (
    <div className="scd-rail-block">
      <h2 className="scd-rail-label">Official sources</h2>
      <ul className="scd-rail-list">
        <li>
          <a href="https://www.niagarapolice.ca/" target="_blank" rel="noopener noreferrer">
            Niagara Regional Police <UiIcon name="external" size={16} />
          </a>
        </li>
        <li>
          <a href="https://www.stcatharines.ca/" target="_blank" rel="noopener noreferrer">
            City of St. Catharines <UiIcon name="external" size={16} />
          </a>
        </li>
        <li>
          <a href="https://www.welland.ca/" target="_blank" rel="noopener noreferrer">
            City of Welland <UiIcon name="external" size={16} />
          </a>
        </li>
        <li>
          <a href="https://www.thorold.ca/" target="_blank" rel="noopener noreferrer">
            City of Thorold <UiIcon name="external" size={16} />
          </a>
        </li>
        <li>
          <a href="https://www.niagararegion.ca/" target="_blank" rel="noopener noreferrer">
            Niagara Region <UiIcon name="external" size={16} />
          </a>
        </li>
      </ul>
      {COLLECTED ? (
        <p className="scd-rail-note" data-testid="official-sources-last-verified">
          {COLLECTED}. Each record links to its official source.
        </p>
      ) : (
        <p className="scd-rail-note">
          Source corpus verification date unavailable.
        </p>
      )}
    </div>
  );
}

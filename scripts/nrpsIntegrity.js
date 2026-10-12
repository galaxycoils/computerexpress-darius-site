// Validate this module before importing publication or metrics, which require
// its named exports. A partial daily update should produce an actionable audit
// error instead of an ESM import failure across every consuming test suite.
export function auditNrpsModule(nrps) {
  const errors = []
  const { nrpsReleases, verifiedNrpsReleases } = nrps
  if (!Array.isArray(nrpsReleases)) errors.push('NRPS module is missing the nrpsReleases archive')
  if (!Array.isArray(verifiedNrpsReleases)) errors.push('NRPS module is missing the verifiedNrpsReleases export')
  else if (verifiedNrpsReleases.length < 20) errors.push('NRPS archive is unexpectedly truncated')
  for (const helper of ['getLatestNrpsReleases', 'getNrpsReleasesByMunicipality', 'getNrpsReleasesByCategory', 'getNrpsStats']) {
    if (typeof nrps[helper] !== 'function') errors.push(`NRPS module is missing ${helper}`)
  }
  if (errors.length) return errors

  if (nrpsReleases.some(release => !release || typeof release !== 'object')) {
    errors.push('NRPS archive contains an invalid record')
    return errors
  }
  const expected = nrpsReleases.filter(release => !release.unverified)
  if (expected.length !== verifiedNrpsReleases.length || expected.some((release, index) => release !== verifiedNrpsReleases[index])) {
    errors.push('NRPS verified export must preserve all verified archive records and exclude quarantined records')
  }
  const ids = new Set()
  const urls = new Set()
  for (const release of verifiedNrpsReleases) {
    if (!release || typeof release !== 'object') {
      errors.push('NRPS verified export contains an invalid record')
      continue
    }
    if (!release.id || ids.has(release.id)) errors.push(`Duplicate or missing NRPS ID: ${release.id || '(missing)'}`)
    ids.add(release.id)
    let validUrl = false
    try { validUrl = new URL(release.url).protocol === 'https:' } catch { /* Report below. */ }
    if (!validUrl || urls.has(release.url)) errors.push(`Invalid or duplicate NRPS source URL: ${release.id}`)
    urls.add(release.url)
    if (!release.headline || !release.date) errors.push(`Incomplete NRPS release: ${release.id}`)
  }
  try {
    const stats = nrps.getNrpsStats()
    if (stats?.total !== verifiedNrpsReleases.length) errors.push(`getNrpsStats.total (${stats?.total}) does not match verified array length (${verifiedNrpsReleases.length})`)
  } catch (error) {
    errors.push(`NRPS statistics failed: ${error.message}`)
  }
  return errors
}

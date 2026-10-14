import ts from 'typescript'

// Read the literal data without executing code from an earlier Git revision.
export function archiveIds(source) {
  const file = ts.createSourceFile('nrpsReleases.js', source, ts.ScriptTarget.Latest, true)
  if (file.parseDiagnostics.length) throw new Error('Police archive has invalid JavaScript')
  let array
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(file) === 'nrpsReleases') array = node.initializer
    ts.forEachChild(node, visit)
  }
  visit(file)
  if (!array || !ts.isArrayLiteralExpression(array)) throw new Error('Police archive must retain its literal nrpsReleases array')
  return array.elements.map(record => {
    if (!ts.isObjectLiteralExpression(record)) throw new Error('Police archive contains a nonliteral record')
    const id = record.properties.find(property => ts.isPropertyAssignment(property) && property.name.getText(file).replace(/['"`]/g, '') === 'id')
    if (!id || !ts.isStringLiteral(id.initializer)) throw new Error('Police archive record is missing a literal ID')
    return id.initializer.text
  })
}

export function removedArchiveIds(previous, current) {
  const retained = new Set(archiveIds(current))
  return archiveIds(previous).filter(id => !retained.has(id))
}
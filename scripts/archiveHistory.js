import ts from 'typescript'

// Read the literal data without executing code from an earlier Git revision.
export function archiveIds(source, name = 'nrpsReleases') {
  const file = ts.createSourceFile(`${name}.js`, source, ts.ScriptTarget.Latest, true)
  if (file.parseDiagnostics.length) throw new Error(`${name} archive has invalid JavaScript`)
  let array
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(file) === name) array = node.initializer
    ts.forEachChild(node, visit)
  }
  visit(file)
  if (!array || !ts.isArrayLiteralExpression(array)) throw new Error(`${name} archive must retain its literal array`)
  return array.elements.map(record => {
    if (!ts.isObjectLiteralExpression(record)) throw new Error(`${name} archive contains a nonliteral record`)
    const id = record.properties.find(property => ts.isPropertyAssignment(property) && property.name.getText(file).replace(/['"`]/g, '') === 'id')
    if (!id || !ts.isStringLiteral(id.initializer)) throw new Error(`${name} archive record is missing a literal ID`)
    return id.initializer.text
  })
}

export function removedArchiveIds(previous, current, name = 'nrpsReleases') {
  const retained = new Set(archiveIds(current, name))
  return archiveIds(previous, name).filter(id => !retained.has(id))
}

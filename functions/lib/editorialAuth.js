async function digest(value) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value || ''))
  return [...new Uint8Array(bytes)].map(byte => byte.toString(16).padStart(2, '0')).join('')
}

export async function editorialActor(request, env) {
  const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '') || ''
  if (!token) return null
  const given = await digest(token)
  let users = []
  try {
    users = JSON.parse(env.EDITORIAL_USERS_JSON || '[]')
    if (!Array.isArray(users)) users = []
  } catch { return null }
  for (const user of users) {
    if (typeof user?.id !== 'string' || !/^[a-zA-Z0-9._-]{1,80}$/.test(user.id) || !['admin', 'reviewer'].includes(user.role) || !/^[a-f0-9]{64}$/.test(user.tokenSha256 || '')) continue
    if (given === user.tokenSha256) return { id: user.id, role: user.role }
  }
  // Legacy codes remain available during migration to individual tokens.
  const [admin, reviewer] = await Promise.all([
    env.EDITORIAL_ADMIN_TOKEN ? digest(env.EDITORIAL_ADMIN_TOKEN) : '',
    env.EDITORIAL_REVIEWER_TOKEN ? digest(env.EDITORIAL_REVIEWER_TOKEN) : '',
  ])
  if (admin && given === admin) return { id: 'legacy-admin', role: 'admin' }
  if (reviewer && given === reviewer) return { id: 'legacy-reviewer', role: 'reviewer' }
  return null
}

export async function editorialRole(request, env) {
  return (await editorialActor(request, env))?.role || null
}

export function editorialResponse(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Vary': 'Authorization' } })
}

export async function requireEditorialRole(context, write = false) {
  const actor = await editorialActor(context.request, context.env)
  if (!actor || (write && actor.role !== 'admin')) return null
  return actor
}

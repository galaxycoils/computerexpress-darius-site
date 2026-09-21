async function digest(value) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value || ''))
  return [...new Uint8Array(bytes)].map(byte => byte.toString(16).padStart(2, '0')).join('')
}

export async function editorialRole(request, env) {
  const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '') || ''
  if (!token) return null
  const [given, admin, reviewer] = await Promise.all([
    digest(token),
    env.EDITORIAL_ADMIN_TOKEN ? digest(env.EDITORIAL_ADMIN_TOKEN) : '',
    env.EDITORIAL_REVIEWER_TOKEN ? digest(env.EDITORIAL_REVIEWER_TOKEN) : '',
  ])
  if (admin && given === admin) return 'admin'
  if (reviewer && given === reviewer) return 'reviewer'
  return null
}

export function editorialResponse(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Vary': 'Authorization' } })
}

export async function requireEditorialRole(context, write = false) {
  const role = await editorialRole(context.request, context.env)
  if (!role || (write && role !== 'admin')) return null
  return role
}

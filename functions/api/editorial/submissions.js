import { editorialResponse, requireEditorialRole } from '../../lib/editorialAuth.js'

const STATUSES = new Set(['pending', 'reviewing', 'accepted', 'rejected', 'closed'])

export async function onRequestGet(context) {
  const role = await requireEditorialRole(context)
  if (!role) return editorialResponse({ error: 'Editorial access required' }, 401)
  if (!context.env.STC_D1) return editorialResponse({ error: 'Database unavailable' }, 503)
  const status = new URL(context.request.url).searchParams.get('status')
  const result = status && STATUSES.has(status)
    ? await context.env.STC_D1.prepare('SELECT id,kind,name,email,message,source_url,status,reviewer_note,reviewed_by,reviewed_at,created_at,updated_at FROM editorial_submissions WHERE status=? ORDER BY created_at DESC LIMIT 100').bind(status).all()
    : await context.env.STC_D1.prepare('SELECT id,kind,name,email,message,source_url,status,reviewer_note,reviewed_by,reviewed_at,created_at,updated_at FROM editorial_submissions ORDER BY created_at DESC LIMIT 100').all()
  return editorialResponse({ role, submissions: result.results || [] })
}

export async function onRequestPatch(context) {
  const role = await requireEditorialRole(context, true)
  if (!role) return editorialResponse({ error: 'Editorial administrator access required' }, 401)
  if (!context.env.STC_D1) return editorialResponse({ error: 'Database unavailable' }, 503)
  let body
  try { body = await context.request.json() } catch { return editorialResponse({ error: 'Invalid request' }, 400) }
  if (!body?.id || !STATUSES.has(body.status)) return editorialResponse({ error: 'A submission id and valid status are required' }, 400)
  const note = typeof body.note === 'string' ? body.note.trim().slice(0, 2000) : null
  const now = Date.now()
  const result = await context.env.STC_D1.prepare('UPDATE editorial_submissions SET status=?,reviewer_note=?,reviewed_by=?,reviewed_at=?,updated_at=? WHERE id=?').bind(body.status, note, 'admin', now, now, body.id).run()
  if (!result.meta?.changes) return editorialResponse({ error: 'Submission not found' }, 404)
  return editorialResponse({ success: true })
}

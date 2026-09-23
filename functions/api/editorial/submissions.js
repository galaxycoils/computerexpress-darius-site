import { editorialResponse, requireEditorialRole } from '../../lib/editorialAuth.js'

const STATUSES = new Set(['pending', 'reviewing', 'accepted', 'rejected', 'closed'])

export async function onRequestGet(context) {
  const actor = await requireEditorialRole(context)
  if (!actor) return editorialResponse({ error: 'Editorial access required' }, 401)
  if (!context.env.STC_D1) return editorialResponse({ error: 'Database unavailable' }, 503)
  const params = new URL(context.request.url).searchParams
  const status = params.get('status')
  const offset = Number(params.get('offset') || 0)
  if (!Number.isSafeInteger(offset) || offset < 0 || offset > 100000) return editorialResponse({ error: 'Invalid offset' }, 400)
  const result = status && STATUSES.has(status)
    ? await context.env.STC_D1.prepare('SELECT id,kind,name,email,message,source_url,status,reviewer_note,reviewed_by,reviewed_at,created_at,updated_at FROM editorial_submissions WHERE status=? ORDER BY created_at DESC,id DESC LIMIT 51 OFFSET ?').bind(status, offset).all()
    : await context.env.STC_D1.prepare('SELECT id,kind,name,email,message,source_url,status,reviewer_note,reviewed_by,reviewed_at,created_at,updated_at FROM editorial_submissions ORDER BY created_at DESC,id DESC LIMIT 51 OFFSET ?').bind(offset).all()
  const rows = result.results || []
  return editorialResponse({ role: actor.role, actor: actor.id, submissions: rows.slice(0, 50), nextOffset: rows.length > 50 ? offset + 50 : null })
}

export async function onRequestPatch(context) {
  const actor = await requireEditorialRole(context, true)
  if (!actor) return editorialResponse({ error: 'Editorial administrator access required' }, 401)
  if (!context.env.STC_D1) return editorialResponse({ error: 'Database unavailable' }, 503)
  let body
  try { body = await context.request.json() } catch { return editorialResponse({ error: 'Invalid request' }, 400) }
  if (!body?.id || !STATUSES.has(body.status)) return editorialResponse({ error: 'A submission id and valid status are required' }, 400)
  const note = typeof body.note === 'string' ? body.note.trim().slice(0, 2000) : null
  const previous = await context.env.STC_D1.prepare('SELECT status FROM editorial_submissions WHERE id=?').bind(body.id).first()
  if (!previous) return editorialResponse({ error: 'Submission not found' }, 404)
  if (previous.status === body.status) return editorialResponse({ success: true, unchanged: true })
  const now = Date.now()
  const [result] = await context.env.STC_D1.batch([
    context.env.STC_D1.prepare('UPDATE editorial_submissions SET status=?,reviewer_note=?,reviewed_by=?,reviewed_at=?,updated_at=? WHERE id=? AND status=?').bind(body.status, note, actor.id, now, now, body.id, previous.status),
    context.env.STC_D1.prepare('INSERT INTO editorial_actions (id,submission_id,actor_id,old_status,new_status,note,created_at) SELECT ?,?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM editorial_submissions WHERE id=? AND status=? AND updated_at=?)').bind(crypto.randomUUID(), body.id, actor.id, previous.status, body.status, note, now, body.id, body.status, now),
  ])
  if (!result.meta?.changes) return editorialResponse({ error: 'Submission changed during review; reload and try again' }, 409)
  return editorialResponse({ success: true })
}

import { editorialResponse, requireEditorialRole } from '../../lib/editorialAuth.js'

export async function onRequestGet(context) {
  const role = await requireEditorialRole(context)
  if (!role) return editorialResponse({ error: 'Editorial access required' }, 401)
  if (!context.env.STC_D1) return editorialResponse({ error: 'Database unavailable' }, 503)
  const [submissions, newsletter] = await context.env.STC_D1.batch([
    context.env.STC_D1.prepare('SELECT status, COUNT(*) AS count FROM editorial_submissions GROUP BY status'),
    context.env.STC_D1.prepare('SELECT status, COUNT(*) AS count FROM newsletter_subscribers GROUP BY status'),
  ])
  return editorialResponse({ role, submissions: submissions.results || [], newsletter: newsletter.results || [] })
}

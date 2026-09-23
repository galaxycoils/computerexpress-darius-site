import test from 'node:test'
import assert from 'node:assert/strict'
import { DatabaseSync } from 'node:sqlite'
import { readFileSync } from 'node:fs'
import { onRequestPost } from '../functions/api/newsletter.js'
import { onRequest as confirm } from '../functions/api/newsletter/confirm.js'
import { onRequest as manage } from '../functions/api/newsletter/manage.js'
import { issueToken } from '../functions/lib/newsletterTokens.js'
import { onRequestPost as submitContact } from '../functions/api/contact.js'
import { onRequestGet as listSubmissions, onRequestPatch as updateSubmission } from '../functions/api/editorial/submissions.js'
import { onRequest as reconcile } from '../functions/cron/reconcile-newsletter.js'

function database() {
  const sqlite = new DatabaseSync(':memory:')
  for (const file of ['0005_create_newsletter_subscribers.sql','0006_create_email_delivery_log.sql','0007_newsletter_tokens.sql','0008_editorial_submissions.sql','0009_editorial_audit.sql']) sqlite.exec(readFileSync(new URL('../migrations/'+file,import.meta.url),'utf8'))
  const db = {prepare(sql) {const statement=sqlite.prepare(sql);const execute=args=>({sql,async first(){return statement.get(...args)},async all(){return {results:statement.all(...args)}},async run(){const result=statement.run(...args);return {meta:{changes:result.changes}}}});return {...execute([]),bind(...args){return execute(args)}}}, async batch(statements){const results=[];for(const s of statements) results.push(/^\s*SELECT/i.test(s.sql)?await s.all():await s.run());return results}}
  return {sqlite,db}
}
const request = (path,options={}) => new Request('https://stcatharinesdigital.ca'+path,options)

test('newsletter requires confirmation, supports preferences and unsubscribe, and stores only token hashes',async t=>{
  const {db,sqlite}=database();t.after(()=>sqlite.close())
  let message
  t.mock.method(globalThis,'fetch',async (url,options)=>{
    if(url.endsWith('/inboxes'))return Response.json({inboxes:[{inbox_id:'test-inbox'}]})
    message=JSON.parse(options.body);return Response.json({id:'test-message'})
  })
  const env={STC_D1:db,AGENTMAIL_API_KEY:'mock-only'}
  const response=await onRequestPost({env,request:request('/api/newsletter',{method:'POST',body:JSON.stringify({email:'reader@example.com',topics:['planning','invalid']})})})
  assert.equal(response.status,200)
  assert.equal(sqlite.prepare('SELECT status FROM newsletter_subscribers').get().status,'pending')
  const confirmUrl=message.text.match(/Confirm: (\S+)/)[1],manageUrl=message.text.match(/unsubscribe: (\S+)/)[1]
  const rawToken=new URL(confirmUrl).searchParams.get('token')
  assert.equal(sqlite.prepare('SELECT * FROM newsletter_tokens WHERE token_hash=?').get(rawToken),undefined)
  const get=await confirm({env,request:new Request(confirmUrl)})
  assert.equal(get.status,200)
  assert.equal(sqlite.prepare('SELECT status FROM newsletter_subscribers').get().status,'pending')
  assert.equal((await confirm({env,request:new Request(confirmUrl,{method:'POST'})})).status,200)
  assert.equal(sqlite.prepare('SELECT status FROM newsletter_subscribers').get().status,'active')
  assert.equal((await confirm({env,request:new Request(confirmUrl,{method:'POST'})})).status,410)
  await manage({env,request:new Request(manageUrl,{method:'POST',body:new URLSearchParams({action:'save',topics:'council'})})})
  assert.equal(sqlite.prepare('SELECT topics FROM newsletter_subscribers').get().topics,'["council"]')
  await manage({env,request:new Request(manageUrl,{method:'POST',body:new URLSearchParams({action:'unsubscribe'})})})
  assert.equal(sqlite.prepare('SELECT status FROM newsletter_subscribers').get().status,'unsubscribed')
  await manage({env,request:new Request(manageUrl,{method:'POST',body:new URLSearchParams({action:'save',topics:'police'})})})
  assert.equal(sqlite.prepare('SELECT status FROM newsletter_subscribers').get().status,'unsubscribed')
})

test('expired tokens, missing services and provider rejection never activate a subscription',async t=>{
 const {db,sqlite}=database();t.after(()=>sqlite.close())
 const token=await issueToken(db,'reader@example.com','confirm',-1000)
 assert.equal((await confirm({env:{STC_D1:db},request:request('/api/newsletter/confirm?token='+token)})).status,410)
 assert.equal((await onRequestPost({env:{},request:request('/api/newsletter',{method:'POST'})})).status,503)
 t.mock.method(globalThis,'fetch',async url=>url.endsWith('/inboxes')?Response.json({inboxes:[{inbox_id:'mock'}]}):new Response('',{status:503}))
 const result=await onRequestPost({env:{STC_D1:db,AGENTMAIL_API_KEY:'mock-only'},request:request('/api/newsletter',{method:'POST',body:JSON.stringify({email:'reader@example.com'})})})
 assert.equal(result.status,502)
 assert.equal(sqlite.prepare('SELECT status FROM newsletter_subscribers').get().status,'failed')
 assert.equal(sqlite.prepare('SELECT status FROM email_delivery_log').get().status,'failed')
})

test('reader submissions enter a protected moderation queue and newsletter reconciliation does not send mail', async t => {
 const {db,sqlite}=database();t.after(()=>sqlite.close())
 t.mock.method(globalThis,'fetch',async ()=>Response.json({ ok: true }))
 const contact=await submitContact({env:{STC_D1:db},request:request('/api/contact',{method:'POST',body:JSON.stringify({name:'Reader',email:'reader@example.com',message:'Please review this upcoming public meeting.',kind:'event'})})})
 assert.equal(contact.status,200)
 const reviewer={STC_D1:db,EDITORIAL_REVIEWER_TOKEN:'review',EDITORIAL_ADMIN_TOKEN:'admin'}
 assert.equal((await listSubmissions({env:reviewer,request:request('/api/editorial/submissions')})).status,401)
 const listed=await listSubmissions({env:reviewer,request:new Request('https://stcatharinesdigital.ca/api/editorial/submissions',{headers:{Authorization:'Bearer review'}})})
 const submission=(await listed.json()).submissions[0]
 assert.equal(submission.status,'pending')
 assert.equal((await updateSubmission({env:reviewer,request:new Request('https://stcatharinesdigital.ca/api/editorial/submissions',{method:'PATCH',headers:{Authorization:'Bearer review'},body:JSON.stringify({id:submission.id,status:'accepted'})})})).status,401)
 assert.equal((await updateSubmission({env:reviewer,request:new Request('https://stcatharinesdigital.ca/api/editorial/submissions',{method:'PATCH',headers:{Authorization:'Bearer admin'},body:JSON.stringify({id:submission.id,status:'accepted'})})})).status,200)
 assert.equal(sqlite.prepare('SELECT status FROM editorial_submissions').get().status,'accepted')
 assert.deepEqual({...sqlite.prepare('SELECT actor_id,old_status,new_status FROM editorial_actions').get()},{actor_id:'legacy-admin',old_status:'pending',new_status:'accepted'})
 await db.prepare("INSERT INTO newsletter_subscribers (email,topics,placement,status,created_at,updated_at) VALUES (?,?,?,'failed',?,?)").bind('failed@example.com','[]','site_rail',Date.now(),Date.now()).run()
 const report=await reconcile({env:{STC_D1:db,CRON_SECRET:'cron'},request:new Request('https://stcatharinesdigital.ca/cron/reconcile-newsletter',{headers:{Authorization:'Bearer cron'}})})
 assert.deepEqual(await report.json(),{failedConfirmations:1,pendingConfirmations:0,action:'Readers must submit the signup form again to receive a new confirmation link.'})
})

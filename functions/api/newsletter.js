import {completeDelivery,createDelivery,failDelivery,recipientFingerprint} from '../lib/emailDelivery.js'
import {issueToken,TOPICS} from '../lib/newsletterTokens.js'
const response=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})
export function onRequestGet({env}){return response({available:Boolean(env.STC_D1&&env.AGENTMAIL_API_KEY)})}
export async function onRequestPost({env,request}){
 const db=env.STC_D1,key=env.AGENTMAIL_API_KEY
 if(!db||!key)return response({error:'Email signup is temporarily unavailable. You can follow the RSS feed instead.'},503)
 if(Number(request.headers.get('content-length')||0)>8192)return response({error:'Request too large'},413)
 let body;try{const raw=await request.text();if(raw.length>8192)return response({error:'Request too large'},413);body=JSON.parse(raw)}catch{return response({error:'Invalid request'},400)}
 if(!body||typeof body!=='object'||Array.isArray(body))return response({error:'Invalid request'},400)
 const email=String(body.email||'').trim().toLowerCase()
 if(email.length>254||!/^\S+@[^\s@]+\.[^\s@]+$/.test(email))return response({error:'Enter a valid email address.'},400)
 const topics=Array.isArray(body.topics)?[...new Set(body.topics.filter(x=>TOPICS.includes(x)))]:[]
 const placement=['home','site_rail','guide_inline','planning_tracker'].includes(body.placement)?body.placement:'site_rail'
 try{
  const existing=await db.prepare('SELECT status, updated_at FROM newsletter_subscribers WHERE email = ?').bind(email).first()
  if(existing?.status==='active'||(existing?.status==='pending'&&Date.now()-existing.updated_at<60000))return response({success:true,message:'Check your inbox for a confirmation or use the preferences link in an earlier email.'})
  await db.prepare("INSERT INTO newsletter_subscribers (email,topics,placement,status,created_at,updated_at) VALUES (?,?,?,'pending',?,?) ON CONFLICT(email) DO UPDATE SET topics=excluded.topics,placement=excluded.placement,status='pending',updated_at=excluded.updated_at,confirmed_at=NULL").bind(email,JSON.stringify(topics),placement,Date.now(),Date.now()).run()
  const confirm=await issueToken(db,email,'confirm',24*60*60*1000),manage=await issueToken(db,email,'manage',90*24*60*60*1000)
  const confirmUrl=`https://stcatharinesdigital.ca/api/newsletter/confirm?token=${confirm}`,manageUrl=`https://stcatharinesdigital.ca/api/newsletter/manage?token=${manage}`
  const delivery=await createDelivery(db,{channel:'newsletter',recipientRef:await recipientFingerprint(email),template:'confirm'})
  const inboxResponse=await fetch('https://api.agentmail.to/v0/inboxes',{headers:{Authorization:`Bearer ${key}`},signal:AbortSignal.timeout(15000)})
  const inboxData=inboxResponse.ok?await inboxResponse.json():{}
  if(!inboxData.inboxes?.[0]?.inbox_id){await failDelivery(db,delivery,inboxResponse.status,'inbox_unavailable',null);return response({error:'Email delivery is unavailable. Please try again later.'},502)}
  const sent=await fetch(`https://api.agentmail.to/v0/inboxes/${encodeURIComponent(inboxData.inboxes[0].inbox_id)}/messages/send`,{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},signal:AbortSignal.timeout(15000),body:JSON.stringify({to:email,subject:'Confirm your local updates — St. Catharines Digital',text:`Confirm your email to receive local updates.\n\nConfirm: ${confirmUrl}\n\nThis confirmation link expires in 24 hours.\n\nManage topics or unsubscribe: ${manageUrl}\n\nIf you did not request this, ignore this message or unsubscribe.`,html:`<h1>A little local. In your inbox.</h1><p>Confirm your email to receive local updates.</p><p><a href="${confirmUrl}">Confirm subscription</a></p><p>This confirmation link expires in 24 hours.</p><p><a href="${manageUrl}">Manage topics or unsubscribe</a></p><p>If you did not request this, ignore this message or unsubscribe.</p>`,labels:['newsletter','confirmation']})})
  if(!sent.ok){await failDelivery(db,delivery,sent.status,'provider_rejected',null);await db.prepare("UPDATE newsletter_subscribers SET status='failed',last_error='provider_rejected',updated_at=? WHERE email=? AND status='pending'").bind(Date.now(),email).run();return response({error:'The confirmation email could not be sent. Please try again later.'},502)}
  await completeDelivery(db,delivery,sent.status)
  return response({success:true,message:'Check your inbox and confirm your email to finish subscribing.'})
 }catch{console.error('Newsletter signup failed');return response({error:'Subscription could not be completed. Please try again later.'},503)}
}
export function onRequestOptions(){return new Response(null,{status:204,headers:{Allow:'GET, POST, OPTIONS'}})}

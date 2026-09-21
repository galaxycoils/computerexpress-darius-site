import {readToken,privatePage} from '../../lib/newsletterTokens.js'
async function handle({env,request}){
 if(!env.STC_D1)return privatePage('Temporarily unavailable','<p>Please try again later.</p>',503)
 const token=new URL(request.url).searchParams.get('token')||''
 const record=await readToken(env.STC_D1,token,'confirm')
 if(!record)return privatePage('This link has expired','<p>The link may be expired or already used. If you have already confirmed, no further action is needed.</p><p><a href="/reader-services#subscribe">Request a new confirmation</a></p>',410)
 if(request.method==='GET')return privatePage('One more step.','<p>Confirm that you want local updates from St. Catharines Digital.</p><form method="post"><button type="submit">Confirm subscription</button></form>')
 if(request.method!=='POST')return privatePage('Method not allowed','',405)
 await env.STC_D1.batch([
 env.STC_D1.prepare("UPDATE newsletter_subscribers SET status='active',confirmed_at=?,updated_at=?,last_error=NULL WHERE email=? AND status='pending'").bind(Date.now(),Date.now(),record.email),
 env.STC_D1.prepare('DELETE FROM newsletter_tokens WHERE token_hash=?').bind(record.token_hash)
 ])
 return privatePage('You’re confirmed.','<p>Your subscription is confirmed. Use the preferences link in your confirmation email to change topics or unsubscribe.</p><p><a href="/news">Explore local news →</a></p>')
}

export async function onRequest(context){try{return await handle(context)}catch{return privatePage("Temporarily unavailable","<p>Please try again later.</p>",503)}}

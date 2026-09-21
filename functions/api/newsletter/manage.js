import {readToken,privatePage,TOPICS} from '../../lib/newsletterTokens.js'
async function handle({env,request}){
 if(!env.STC_D1)return privatePage('Temporarily unavailable','<p>Please try again later.</p>',503)
 const token=new URL(request.url).searchParams.get('token')||'',record=await readToken(env.STC_D1,token,'manage')
 if(!record)return privatePage('This link has expired','<p>Use a preferences link from a more recent email, or contact us for help.</p><a href="/contact">Contact us</a>',410)
 const subscriber=await env.STC_D1.prepare('SELECT topics,status FROM newsletter_subscribers WHERE email=?').bind(record.email).first()
 if(!subscriber)return privatePage('Subscription not found','<a href="/">Return home</a>',404)
 if(request.method==='POST'){
  const form=await request.formData(),unsubscribe=form.get('action')==='unsubscribe'
  if(unsubscribe){await env.STC_D1.batch([env.STC_D1.prepare("UPDATE newsletter_subscribers SET status='unsubscribed',updated_at=? WHERE email=?").bind(Date.now(),record.email),env.STC_D1.prepare("DELETE FROM newsletter_tokens WHERE email=? AND purpose='confirm'").bind(record.email)]);return privatePage('You’re unsubscribed.','<p>You will no longer receive this newsletter. You can subscribe again from the website.</p><a href="/">Return home</a>')}
  const topics=form.getAll('topics').filter(t=>TOPICS.includes(t));await env.STC_D1.prepare('UPDATE newsletter_subscribers SET topics=?,updated_at=? WHERE email=?').bind(JSON.stringify(topics),Date.now(),record.email).run()
  return privatePage('Preferences saved.','<p>Your topic preferences have been updated.</p><a href="/news">Read local news</a>')
 }
 if(request.method!=='GET')return privatePage('Method not allowed','',405)
 let topics=[];try{const parsed=JSON.parse(subscriber.topics||'[]');if(Array.isArray(parsed))topics=parsed}catch{}
 return privatePage('Your local updates.',`<p>Choose your topics or unsubscribe. Updates take effect when you submit this form.</p><form method="post">${TOPICS.map(t=>`<label><input type="checkbox" name="topics" value="${t}" ${topics.includes(t)?'checked':''}> ${t[0].toUpperCase()+t.slice(1)}</label>`).join('')}<button name="action" value="save">Save preferences</button></form><form method="post"><p><button name="action" value="unsubscribe">Unsubscribe</button></p></form>`)
}

export async function onRequest(context){try{return await handle(context)}catch{return privatePage("Temporarily unavailable","<p>Please try again later.</p>",503)}}

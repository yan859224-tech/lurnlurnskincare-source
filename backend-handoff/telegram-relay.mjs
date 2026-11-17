/** Example SERVER-SIDE handler (not deployed with Vite/Netlify Drop).
  Use behind authenticated API with origin validation, rate limits, abuse checks and logs.
  The bot token and chat ID MUST remain in server environment variables.
  Node.js 20+ handler showing the outbound Telegram request only.
*/
export async function relayToTelegram({message,customerId}){
  const token=process.env.TELEGRAM_BOT_TOKEN, chat_id=process.env.TELEGRAM_STORE_CHAT_ID;
  if(!token||!chat_id) throw new Error('Telegram backend credentials missing');
  if(!message||typeof message!=='string'||message.length>1000) throw new Error('Invalid message');
  const safeMessage=`LurnLurn store question\nCustomer ref: ${String(customerId||'guest').slice(0,60)}\n${message}`;
  const res=await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{
    method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id,text:safeMessage})
  });
  if(!res.ok) throw new Error('Telegram send failed');
  return {queued:true}; // Backend should return only safe delivery status, not raw Telegram responses.
}

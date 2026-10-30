// ===== Supabase 认证模块（钱包站）=====
var SB_URL = "https://fckqmlwkujixwztzqqni.supabase.co";
var SB_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZja3FtbHdrdWppeHd6dHpxcW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMjkzODksImV4cCI6MjEwNTkwNTM4OX0.W6FHJ-CgNNuCO9xEcrNuLj2y6-1D6Gyy72D0oGmA7Xw";
var SB_USER_KEY = "wordGameGitHubUser";
var _sb = null, _sbPromise = null;
function _injectSupabase() {
  if (_sbPromise) return _sbPromise;
  _sbPromise = new Promise(function (resolve, reject) {
    if (window.supabase && window.supabase.createClient) return resolve();
    var urls = ["https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js","https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.min.js"];
    var i = 0;
    (function next() {
      if (i >= urls.length) return reject(new Error("Supabase 库加载失败"));
      var s = document.createElement("script"); s.src = urls[i++];
      s.onload = function(){ if (window.supabase && window.supabase.createClient) resolve(); else next(); };
      s.onerror = next; document.head.appendChild(s);
    })();
  });
  return _sbPromise;
}
async function sbInit() {
  if (_sb) return _sb;
  await _injectSupabase();
  _sb = window.supabase.createClient(SB_URL, SB_ANON, { auth:{ persistSession:true, autoRefreshToken:true, detectSessionInUrl:false } });
  return _sb;
}
function _mapUser(u){ if(!u) return null; var e=u.email||(u.user_metadata&&u.user_metadata.email)||""; var n=(u.user_metadata&&(u.user_metadata.name||u.user_metadata.full_name))||e; return {id:u.id||e,name:n,email:e,login:e,avatar_url:(u.user_metadata&&u.user_metadata.avatar_url)||""}; }
function _saveAuth(u){ try{localStorage.setItem(SB_USER_KEY,JSON.stringify(u));}catch(e){} _writeHubCookie("ms_user",JSON.stringify(u),7); return u; }
function sbGetUser(){ try{ var u=JSON.parse(localStorage.getItem(SB_USER_KEY)||"null"); if(u&&(u.id||u.email))return u; }catch(e){} var c=_readHubCookie("ms_user"); if(c){try{return JSON.parse(c);}catch(e){}} return null; }
async function sbRefreshUser(){ var c=await sbInit(); var {data}=await c.auth.getSession(); if(data&&data.session&&data.session.user) return _saveAuth(_mapUser(data.session.user)); return null; }
function _hubCookieDomain(){ var h=location.hostname; var i=h.indexOf("."); return i>=0?"."+h.slice(i+1):h; }
function _writeHubCookie(n,v,d){ try{ var x=new Date(); x.setTime(x.getTime()+(d||7)*864e5); document.cookie=n+"="+encodeURIComponent(v)+");expires="+x.toUTCString()+");path=/;domain="+_hubCookieDomain()+");SameSite=Lax;Secure";}catch(e){} }
function _readHubCookie(n){ var m=document.cookie.match(new RegExp("(?:^|; )"+n+"=([^;]*)")); return m?decodeURIComponent(m[1]):null; }
function _clearHubCookie(n){ try{document.cookie=n+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain="+_hubCookieDomain()+";Secure";}catch(e){} }
function msLogin(options){ var o=options||{}; var r=o.returnTo||location.href; location.href="https://myacc.r6t5.dpdns.org/?app=wallet&return="+encodeURIComponent(r); }
function msTakeReturnTo(d){ try{var v=localStorage.getItem("msReturnTo");localStorage.removeItem("msReturnTo"); if(v)return v;}catch(e){} return d||"index.html"; }
async function msHandleRedirect(){ var c=await sbInit(); var p=new URLSearchParams(location.search); if(p.get("code")||location.hash.indexOf("access_token")>=0){ var {data,error}=await c.auth.getSessionFromUrl({storeSession:true}); if(!error&&data&&data.session) return _saveAuth(_mapUser(data.session.user)); } return await sbRefreshUser(); }
async function msLogout(ru,opt){ var back=(opt&&opt.postLogoutRedirectUri)||(location.origin+"/index.html"); try{var c=await sbInit(); await c.auth.signOut();}catch(e){} try{localStorage.removeItem(SB_USER_KEY);}catch(e){} _clearHubCookie("ms_user"); location.href=back; }
var msGetUser=sbGetUser;
function msClearLocal(){ try{localStorage.removeItem(SB_USER_KEY);}catch(e){} _clearHubCookie("ms_user"); }
async function msGetToken(){return null;} function msPeekToken(){return null;} function msHasToken(){return false;} async function graphFetch(){throw new Error("OneDrive 停用");} async function msGetDriveQuota(){return{total:0,used:0,remaining:0};}

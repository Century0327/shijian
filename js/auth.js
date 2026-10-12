/* 史间认证：Supabase Auth。anon key 由部署环境注入，不写入仓库。 */
(function () {
  const URL = window.SHIJIAN_SUPABASE_URL || 'https://nxiuafezfsmhbzmfmjqf.supabase.co';
  const KEY = window.SHIJIAN_SUPABASE_ANON_KEY || '';
  const SKEY = 'shijian.auth.v1';
  let session = null;
  try { session = JSON.parse(localStorage.getItem(SKEY) || 'null'); } catch (e) {}
  function loggedIn() { return !!session?.access_token; }
  function getSession() { return session; }
  async function signInOrSignUp(email, password) {
    if (!KEY) throw new Error('尚未配置 Supabase anon key');
    const headers = { apikey: KEY, 'Content-Type': 'application/json' };
    let r = await fetch(URL + '/auth/v1/token?grant_type=password', { method: 'POST', headers, body: JSON.stringify({ email, password }) });
    if (!r.ok) {
      r = await fetch(URL + '/auth/v1/signup', { method: 'POST', headers, body: JSON.stringify({ email, password }) });
    }
    const data = await r.json();
    if (!r.ok || !data.access_token) throw new Error(data.error_description || data.msg || '登录失败');
    session = data; localStorage.setItem(SKEY, JSON.stringify(data));
    window.dispatchEvent(new Event('shijian:auth'));
    return data;
  }
  function signOut() { session = null; localStorage.removeItem(SKEY); window.dispatchEvent(new Event('shijian:auth')); }
  window.ShiJianAuth = { loggedIn, getSession, signInOrSignUp, signOut, configured: () => !!KEY };
})();

/* 史间认证：自建 players 表，不使用邮箱 Auth。 */
(function () {
  const URL = window.SHIJIAN_SUPABASE_URL || 'https://fvczhdgevqjkhtvujunr.supabase.co';
  const KEY = window.SHIJIAN_SUPABASE_ANON_KEY || '';
  const SKEY = 'shijian.auth.v1';
  let session = null;
  try { session = JSON.parse(localStorage.getItem(SKEY) || 'null'); } catch (e) {}
  function loggedIn() { return !!session?.access_token; }
  function getSession() { return session; }
  async function callRpc(name, body) {
    if (!KEY) throw new Error('尚未配置 Supabase anon key');
    const r = await fetch(URL + '/rest/v1/rpc/' + name, { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await r.json();
    if (!r.ok) throw new Error(data.message || data.hint || '账号操作失败');
    return data;
  }
  async function signInOrSignUp(username, password) {
    const data = await callRpc('login_player', { p_username: username, p_password: password });
    session = data; localStorage.setItem(SKEY, JSON.stringify(data));
    window.dispatchEvent(new Event('shijian:auth'));
    return data;
  }
  async function register(username, password) {
    const data = await callRpc('register_player', { p_username: username, p_password: password });
    session = data; localStorage.setItem(SKEY, JSON.stringify(data));
    window.dispatchEvent(new Event('shijian:auth'));
    return data;
  }
  function signOut() { session = null; localStorage.removeItem(SKEY); window.dispatchEvent(new Event('shijian:auth')); }
  window.ShiJianAuth = { loggedIn, getSession, signInOrSignUp, register, signOut, configured: () => !!KEY };
})();

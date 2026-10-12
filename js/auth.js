/* 史间认证：自建 players 表，不使用邮箱 Auth。 */
(function () {
  const URL = window.SHIJIAN_SUPABASE_URL || 'https://fvczhdgevqjkhtvujunr.supabase.co';
  const KEY = window.SHIJIAN_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2Y3poZGdldnFqa2h0dnVqdW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3Nzc0NTQsImV4cCI6MjEwNzM1MzQ1NH0.mLkdTpRIPjRwH2K3nkuycyH6UHAD_-FB3IuYWTEP108';
  const SKEY = 'shijian.auth.v1';
  let session = null;
  try { session = JSON.parse(localStorage.getItem(SKEY) || 'null'); } catch (e) {}
  function loggedIn() { return !!(session?.id || session?.player_id || session?.user?.id); }
  function getSession() { return session; }
  async function callRpc(name, body) {
    if (!KEY) throw new Error('尚未配置 Supabase anon key');
    const r = await fetch(URL + '/rest/v1/rpc/' + name, { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await r.json();
    if (!r.ok) throw new Error(data.message || data.hint || '账号操作失败');
    return data;
  }
  async function signInOrSignUp(username, password) {
    const raw = await callRpc('login_player', { p_username: username, p_password: password });
    const data = Array.isArray(raw) ? raw[0] : (raw.player || raw.data || raw);
    session = { id: data.id || data.player_id || username, username: data.username || username, display_name: data.display_name || '穿越者', avatar: data.avatar || '佚', signature: data.signature || '', progress: data.progress || {}, unlocks: data.unlocks || {} };
    localStorage.setItem(SKEY, JSON.stringify(session));
    window.dispatchEvent(new Event('shijian:auth'));
    return data;
  }
  async function register(username, password) {
    const raw = await callRpc('register_player', { p_username: username, p_password: password });
    const data = Array.isArray(raw) ? raw[0] : (raw.player || raw.data || raw);
    session = { id: data.id || data.player_id || username, username: data.username || username, display_name: data.display_name || '穿越者', avatar: data.avatar || '佚', signature: data.signature || '', progress: data.progress || {}, unlocks: data.unlocks || {} };
    localStorage.setItem(SKEY, JSON.stringify(session));
    window.dispatchEvent(new Event('shijian:auth'));
    return data;
  }
  function signOut() { session = null; localStorage.removeItem(SKEY); window.dispatchEvent(new Event('shijian:auth')); }
  async function updateProfile(profile) {
    if (!session?.id) return false;
    const data = await callRpc('update_player_profile', { p_id: session.id, p_display_name: profile.name || '穿越者', p_avatar: profile.avatar || '佚', p_signature: profile.signature || '' });
    const next = Array.isArray(data) ? data[0] : (data.player || data.data || data);
    session = { ...session, display_name: next.display_name || profile.name, avatar: next.avatar || profile.avatar, signature: next.signature || profile.signature };
    localStorage.setItem(SKEY, JSON.stringify(session));
    window.dispatchEvent(new Event('shijian:auth'));
    return true;
  }
  window.ShiJianAuth = { loggedIn, getSession, signInOrSignUp, register, updateProfile, signOut, configured: () => !!KEY };
})();

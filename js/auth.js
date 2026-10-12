/* 史间认证：自建 players 表，不使用邮箱 Auth。 */
(function () {
  const URL = window.SHIJIAN_SUPABASE_URL || 'https://fvczhdgevqjkhtvujunr.supabase.co';
  const KEY = window.SHIJIAN_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2Y3poZGdldnFqa2h0dnVqdW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3Nzc0NTQsImV4cCI6MjEwNzM1MzQ1NH0.mLkdTpRIPjRwH2K3nkuycyH6UHAD_-FB3IuYWTEP108';
  const SKEY = 'shijian.auth.v1';
  let session = null;
  function normalize(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const accountId = raw.accountId || raw.username || raw.user?.username || '';
    const playerId = raw.playerId || raw.id || raw.player_id || raw.user?.id || '';
    if (!accountId && !playerId) return null;
    return { version: 2, accountId, playerId, username: accountId, displayName: raw.displayName || raw.display_name || '', display_name: raw.display_name || raw.displayName || '', avatar: raw.avatar || '佚', signature: raw.signature || '', progress: raw.progress || {}, unlocks: raw.unlocks || {} };
  }
  try {
    const old = JSON.parse(localStorage.getItem(SKEY) || 'null');
    session = normalize(old);
    if (session) localStorage.setItem(SKEY, JSON.stringify(session));
  } catch (e) { session = null; }
  function loggedIn() { return !!(session?.accountId || session?.playerId); }
  function getSession() { return session; }
  function accountId() { return session?.username || ''; }
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
    session = normalize({ id: data.id || data.player_id || username, username: data.username || username, display_name: data.display_name || '', avatar: data.avatar, signature: data.signature, progress: data.progress, unlocks: data.unlocks });
    localStorage.setItem(SKEY, JSON.stringify(session));
    window.dispatchEvent(new Event('shijian:auth'));
    return data;
  }
  async function register(username, password) {
    const raw = await callRpc('register_player', { p_username: username, p_password: password });
    const data = Array.isArray(raw) ? raw[0] : (raw.player || raw.data || raw);
    session = normalize({ id: data.id || data.player_id || username, username: data.username || username, display_name: data.display_name || '', avatar: data.avatar, signature: data.signature, progress: data.progress, unlocks: data.unlocks });
    localStorage.setItem(SKEY, JSON.stringify(session));
    window.dispatchEvent(new Event('shijian:auth'));
    return data;
  }
  function signOut() { session = null; localStorage.removeItem(SKEY); window.dispatchEvent(new Event('shijian:auth')); }
  async function updateProfile(profile) {
    if (!session?.playerId) return false;
    const data = await callRpc('update_player_profile', { p_id: session.playerId, p_display_name: profile.name || '穿越者', p_avatar: profile.avatar || '佚', p_signature: profile.signature || '' });
    const next = Array.isArray(data) ? data[0] : (data.player || data.data || data);
    session = normalize({ ...session, display_name: next.display_name || profile.name, avatar: next.avatar || profile.avatar, signature: next.signature || profile.signature });
    localStorage.setItem(SKEY, JSON.stringify(session));
    window.dispatchEvent(new Event('shijian:auth'));
    return true;
  }
  window.ShiJianAuth = { loggedIn, getSession, accountId: () => session?.accountId || '', signInOrSignUp, register, updateProfile, signOut, configured: () => !!KEY };
})();

/* ============================================================
   史间 · 数据层（Store）
   ------------------------------------------------------------
   设计目标：资料与前端 UI 彻底分离，并预留 AI Agent 接入点。

   数据来源：data/ 目录下的全局命名空间 window.SHIJIAN_DATA.*（本地适配器）。

   —— Agent 适配器契约（重要）——
   未来接入 Agent / 后端时，实现一个包含以下方法的对象，
   调用 ShiJianStore.useAdapter(adapter) 即可整体替换数据源，
   UI 层（js/app.js）一行都不用改：

     meta()        => {app, version, range:[min,max], defaultYear, tickStep, playInterval, playDuration}
     eras()        => [{name, start, end}, ...]
     people()      => [{id,name,avatar,cls,era,life,lifeText,title,bio,relations,books,hook}, ...]
     person(id)    => 按 id 或 name 查单个人物（可返回 Promise）
     events()      => [{id,year,title,desc,book,chapter,importance,station}, ...]
     moments()     => [{id,person,year,month,day,time,text,likes,comments,os,note,source,certainty}, ...]
     chats()       => { '人名': {intro, options:[[label,reply],...]} }
     translations()=> { '文言原句': '白话', ... }
     storycalls()  => { '人名': { entries:[{id,key,title,year,place,bg,hook,script,annals}] } }
     fanfics()     => { '人名': { fanfic:true, label, unlockStory, setting, intro, options } }

   约定：所有方法允许返回 Promise（当前 UI 使用同步结果，异步适配器可在
   内部先缓存再触发一次自定义事件，如 window.dispatchEvent(new Event('shijian:data'))，
   UI 监听后重新渲染）。
   ============================================================ */
(function () {
  const D = () => window.SHIJIAN_DATA || {};

  /* 默认适配器：读取 data/ 目录的静态数据 */
  const localAdapter = {
    meta: () => D().meta || {},
    eras: () => D().eras || [],
    people: () => D().people || [],
    person: (id) => (D().people || []).find(p => p.id === id || p.name === id) || null,
    events: () => D().events || [],
    moments: () => D().moments || [],
    chats: () => D().chats || {},
    translations: () => D().translations || {},
    storycalls: () => D().storycalls || {},
    fanfics: () => D().fanfics || {}
  };
  let adapter = localAdapter;

  /* 阅读进度：{ acts: { [actId]: true } }，持久化到 localStorage；不可用时退化为内存 */
  const PKEY = 'shijian.progress.v1';
  let progress = (() => {
    try { return JSON.parse(window.localStorage.getItem(PKEY)) || { acts: {} }; }
    catch (e) { return { acts: {} }; }
  })();

  const MONTHS = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];

  function formatYear(y) { y = Number(y); return y < 0 ? ('前' + (-y)) : ('' + y); }

  function eraOf(year) {
    const es = adapter.eras();
    for (const e of es) if (year >= e.start && year <= e.end) return e.name;
    if (es.length && year < es[0].start) return '远古以前';
    return '过渡年代';
  }

  function monthIdx(m) { const i = MONTHS.indexOf(m); return i < 0 ? 12 : i; }

  function sortPosts(list) {
    return list.slice().sort((a, b) =>
      (a.year - b.year) ||
      (monthIdx(a.month) - monthIdx(b.month)) ||
      ((a.day || 0) - (b.day || 0)) ||
      ((a.ord || 0) - (b.ord || 0)));
  }

  function allPosts() { return sortPosts(adapter.moments()); }

  function getEvents() { return adapter.events().slice().sort((a, b) => a.year - b.year); }

  /* 时间驿站：有动态的年份 + 重要大事的年份 */
  function getStations() {
    const map = new Map();
    allPosts().forEach(p => {
      if (!map.has(p.year)) map.set(p.year, { year: p.year, hasPosts: true, big: false });
    });
    getEvents().forEach(e => {
      if (e.station === false) return;
      const s = map.get(e.year) || { year: e.year, hasPosts: false, big: false };
      if (e.importance === 1) s.big = true;
      map.set(e.year, s);
    });
    return [...map.values()].sort((a, b) => a.year - b.year);
  }

  function nextStation(year) { const s = getStations().filter(x => x.year > year); return s.length ? s[0].year : null; }
  function prevStation(year) { const s = getStations().filter(x => x.year < year); return s.length ? s[s.length - 1].year : null; }
  function getMomentYears(opt = {}) {
    let posts = allPosts();
    if (opt.owner) posts = posts.filter(p => p.person === opt.owner);
    const min = opt.min == null ? -Infinity : Number(opt.min);
    const max = opt.max == null ? Infinity : Number(opt.max);
    return [...new Set(posts.map(p => p.year).filter(y => y >= min && y <= max))].sort((a, b) => a - b);
  }
  function nextMomentYear(year, opt = {}) {
    return getMomentYears(opt).find(y => y > Number(year)) ?? null;
  }
  /* 20 秒纵览：每个时代只取有朋友圈年份的首、尾两个代表点。 */
  function getMomentTourYears(opt = {}) {
    const eras = opt.era ? [opt.era] : adapter.eras();
    const picked = [];
    eras.forEach(era => {
      const years = getMomentYears({ owner: opt.owner, min: era.start, max: era.end });
      if (!years.length) return;
      picked.push(years[0]);
      if (years.length > 1) picked.push(years[years.length - 1]);
    });
    return [...new Set(picked)].sort((a, b) => a - b);
  }
  function nearestStationInEra(era) {
    const s = getStations().filter(x => x.year >= era.start && x.year <= era.end);
    return s.length ? s[0].year : era.start;
  }
  function peekFirstPost(year) { return allPosts().find(p => p.year === year) || null; }

  /* 核心查询：某年（可选按人物过滤）的动态 + 本年大事 + 空年回退说明 */
  function getMoments(opt = {}) {
    const posts = allPosts();
    if (opt.year == null) {
      return { posts: opt.owner ? posts.filter(p => p.person === opt.owner) : posts, shownYear: null, context: null, note: null };
    }
    const y = Number(opt.year);
    let sel = posts.filter(p => p.year === y && (!opt.owner || p.person === opt.owner));
    let shownYear = y, note = null;
    if (!sel.length) {
      const years = [...new Set(posts.filter(p => !opt.owner || p.person === opt.owner).map(p => p.year))];
      if (years.length) {
        shownYear = years.reduce((b, c) => Math.abs(c - y) < Math.abs(b - y) ? c : b);
        sel = posts.filter(p => p.year === shownYear && (!opt.owner || p.person === opt.owner));
        note = `${formatYear(y)} 年暂无直接记载——先展示 ${formatYear(shownYear)} 年的动态。拖动下方时间轴可以继续寻找。`;
      }
    }
    const context = getEvents().find(e => e.year === (sel.length ? shownYear : y)) || null;
    return { posts: sel, shownYear, context, note };
  }

  function getChatScript(name) { return adapter.chats()[name] || null; }

  /* —— 时空连线（剧情视频通话）/ 阅读进度 / 顺序解锁 / 二创 —— */
  function getMomentById(id) { return adapter.moments().find(m => m.id === id) || null; }
  /* 剧情集：entries 按集序排列，id 沿用幕 id（如 xy-act-1），与进度键联动 */
  function getStoryEntries(name) { return (adapter.storycalls()[name] || {}).entries || []; }
  function markActRead(actId) {
    progress.acts[actId] = true;
    try { window.localStorage.setItem(PKEY, JSON.stringify(progress)); } catch (e) {}
  }
  function isActRead(actId) { return !!progress.acts[actId]; }
  function actProgress(name) {
    const entries = getStoryEntries(name);
    return { read: entries.filter(a => progress.acts[a.id]).length, total: entries.length };
  }
  /* 顺序解锁：返回按集序第一个未读集；全部读完返回 null */
  function getNextAct(name) {
    return getStoryEntries(name).find(a => !progress.acts[a.id]) || null;
  }
  function isFanficUnlocked(name) {
    const entries = getStoryEntries(name);
    return entries.length > 0 && entries.every(a => progress.acts[a.id]);
  }
  function getFanfic(name) { return adapter.fanfics()[name] || null; }

  /* —— 好友关系（陌生人 → 好友）：初始为空，摇一摇/搜索/资料页申请添加；localStorage 持久化 —— */
  let authForFriends = null;
  try { authForFriends = JSON.parse(window.localStorage.getItem('shijian.auth.v1') || 'null'); } catch (e) {}
  const FKEY = 'shijian.friends.v1.' + (authForFriends?.username || 'guest');
  const RKEY = 'shijian.friendRequests.v1.' + (authForFriends?.username || 'guest');
  let friends = (() => {
    try { return JSON.parse(window.localStorage.getItem(FKEY)) || { list: [] }; }
    catch (e) { return { list: [] }; }
  })();
  function isFriend(name) { return friends.list.includes(name); }
  function addFriend(name) {
    if (!name || friends.list.includes(name)) return false;
    friends.list.push(name);
    try { window.localStorage.setItem(FKEY, JSON.stringify(friends)); } catch (e) {}
    return true;
  }
  function removeFriend(name) {
    const index = friends.list.indexOf(name);
    if (index < 0) return false;
    friends.list.splice(index, 1);
    try { window.localStorage.setItem(FKEY, JSON.stringify(friends)); } catch (e) {}
    return true;
  }
  function getFriends() { return friends.list.slice(); }
  let requests = (() => { try { return JSON.parse(localStorage.getItem(RKEY) || '[]'); } catch (e) { return []; } })();
  function saveRequests() { try { localStorage.setItem(RKEY, JSON.stringify(requests)); } catch (e) {} }
  function requestFriend(name, message = '') {
    if (!name || isFriend(name) || requests.some(r => r.name === name && r.status === 'pending')) return false;
    requests.push({ name, message, status: 'pending', createdAt: Date.now() }); saveRequests(); return true;
  }
  function getFriendRequests() { return requests.slice(); }
  function resolveFriendRequest(name, status) {
    const r = requests.find(x => x.name === name && (x.status === 'pending' || x.status === 'responded')); if (!r) return false;
    r.status = status; r.resolvedAt = Date.now(); if (status === 'accepted') { r.response = r.response || '我看见你的来信了，先认识一下吧。'; addFriend(name); } else { r.responseReason = r.responseReason || '当前暂不方便建立联系。'; } saveRequests(); return true;
  }
  function setFriendRequestReason(name, reason) { const r = requests.find(x => x.name === name && x.status === 'responded'); if (!r) return false; r.responseReason = reason; saveRequests(); return true; }
  function respondFriendRequest(name, message) { const r = requests.find(x => x.name === name && x.status === 'pending'); if (!r) return false; r.status = 'responded'; r.response = message; saveRequests(); return true; }

  function translate(text) {
    let out = String(text);
    const t = adapter.translations();
    for (const k in t) if (out.includes(k)) out = out.split(k).join(t[k]);
    return out;
  }

  window.ShiJianStore = {
    MONTHS, formatYear, eraOf, monthIdx, sortPosts,
    getMeta: () => adapter.meta(),
    getEras: () => adapter.eras(),
    getPeople: () => adapter.people(),
    getPerson: (id) => adapter.person(id),
    getEvents, getMoments, getStations, nextStation, prevStation, getMomentYears, nextMomentYear, getMomentTourYears, nearestStationInEra, peekFirstPost,
    getChatScript, translate,
    getMomentById, getStoryEntries, markActRead, isActRead, actProgress, getNextAct, isFanficUnlocked, getFanfic,
    isFriend, addFriend, removeFriend, getFriends, requestFriend, getFriendRequests, resolveFriendRequest, setFriendRequestReason, respondFriendRequest,
    /* —— Agent 接入点 —— */
    useAdapter(a) { adapter = Object.assign({}, localAdapter, a); }
  };
})();

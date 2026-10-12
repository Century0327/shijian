/* ============================================================
   史间 · UI 层（app.js）
   只负责界面与交互；所有内容一律通过 ShiJianStore 读取，
   UI 中不硬编码任何人物 / 动态 / 大事 / 台词。
   ============================================================ */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const store = window.ShiJianStore, Rail = window.ShiJianRail;
const meta = store.getMeta();

let st = {
  page: 'wechat', navStack: [],
  year: meta.defaultYear || 1082, month: '四月', day: 5,
  person: '苏轼', chatLog: {},
  likes: new Set(), commentLikes: new Set(), userComments: {}, patCount: {},
  momentOwner: null, playing: false, playTimer: null
};
let PEOPLE = {};      // name -> person（来自数据层）
let EXTRA = {};       // 用户自行添加的人物（运行时状态，不属于史料数据）

function buildPeople() { PEOPLE = {}; store.getPeople().forEach(p => PEOPLE[p.name] = p); }

/* ---------- 基础工具 ---------- */
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function toast(s) { const el = $('#toast'); el.textContent = s; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2200); }
function personOf(name) { return PEOPLE[name] || EXTRA[name] || null; }
function avatar(name, round = false) {
  const p = personOf(name) || { avatar: (name || '客').slice(0, 1), cls: '' };
  return `<div class="avatar moment-avatar ${p.cls || ''} ${round ? 'round' : ''}" data-avatar-person="${esc(name)}" title="查看${esc(name)}的资料">${esc(p.avatar || (name || '客').slice(0, 1))}</div>`;
}

/* ---------- 页面切换 ---------- */
function showPage(page, title, opts = {}) {
  const roots = ['wechat', 'contacts', 'discover', 'me'];
  if (opts.tab || roots.includes(page)) st.navStack = [];
  else if (!opts.back && st.page && st.page !== page) st.navStack.push({ page: st.page, title: $('#topTitle').textContent });
  st.page = page;
  $$('.page').forEach(p => p.classList.toggle('active', p.id === 'page-' + page));
  $$('[data-tab]').forEach(b => b.classList.toggle('active', b.dataset.tab === page));
  const subpages = ['moments', 'timeline', 'person', 'chat', 'translator', 'add', 'newfriends', 'about', 'shake', 'profilemoments'];
  $('#tabbar').classList.toggle('hidden', subpages.includes(page));
  $('#backBtn').classList.toggle('hidden', !subpages.includes(page));
  $('#topTitle').textContent = title || ({ wechat: '微信', contacts: '通讯录', discover: '发现', me: '我' }[page] || page);
  $('#topSearch').classList.toggle('hidden', ['moments', 'timeline', 'chat', 'translator', 'add', 'newfriends', 'about', 'person', 'shake', 'profilemoments', 'calls', 'call'].includes(page));
  $('#topPlus').classList.toggle('hidden', ['chat', 'translator', 'add', 'newfriends', 'about', 'person', 'shake', 'profilemoments', 'discover', 'moments', 'timeline'].includes(page));
  if (st.playing && page !== 'moments') setPlaying(false);
  if (page === 'chat' && st.person) renderFanficBar(st.person);   /* 返回聊天页时刷新二创门状态 */
  window.scrollTo({ top: 0, behavior: 'auto' });
}

/* ---------- 会话列表 / 通讯录 ----------
   初始没有联系人：好友由玩家通过 摇一摇 / 搜索 / 朋友圈资料页 主动添加。
   未加好友的角色在微信 tab 顶部搜索、通讯录「发现」里可见（标记陌生人）。 */
function renderChats(filter = '') {
  const friends = store.getFriends();
  if (!filter) {
    $('#chatList').innerHTML = friends.length ? friends.map(n =>
      `<div class="row" data-chat="${esc(n)}">${avatar(n, true)}<div class="row-main"><div class="row-title">${esc(n)}${st.chatLog[n] ? '<span class="row-time">刚刚</span>' : ''}</div><div class="row-preview">${esc(st.chatLog[n]?.slice(-1)[0]?.text || personOf(n)?.hook || '（新朋友）待你开启对话')}</div></div></div>`
    ).join('') : `<div class="empty-guide">
      <div class="eg-face">☁</div>
      <b>还没有联系人</b>
      <p>史间的人，要你自己去认识——<br>摇一摇、搜一搜，或在朋友圈里遇见 TA。</p>
      <div class="eg-actions"><button id="egShake">去摇一摇</button><button id="egSearch">搜一搜</button><button id="egMoments">逛朋友圈</button></div>
    </div>`;
    if (!friends.length) {
      $('#egShake').onclick = () => showPage('shake', '摇一摇');
      $('#egSearch').onclick = () => $('#searchChats').focus();
      $('#egMoments').onclick = () => goMoments();
    }
    $$('#chatList [data-chat]').forEach(r => r.onclick = () => startChat(r.dataset.chat));
    return;
  }
  /* 搜索：先搜联系人，再搜全部史间人物（陌生人可从结果进资料页申请添加） */
  const friendRows = friends.filter(n => n.includes(filter)).map(n =>
    `<div class="row" data-chat="${esc(n)}">${avatar(n, true)}<div class="row-main"><div class="row-title">${esc(n)}</div><div class="row-preview">联系人 · 点击发消息</div></div></div>`).join('');
  const strangerRows = Object.values(PEOPLE).filter(p => !store.isFriend(p.name) && p.name.includes(filter)).map(p =>
    `<div class="row" data-person="${esc(p.name)}">${avatar(p.name, true)}<div class="row-main"><div class="row-title">${esc(p.name)}</div><div class="row-preview">${esc(p.era ? p.era + ' · ' : '')}${esc(p.title || '')} · 陌生人</div></div><span class="row-badge">添加</span></div>`).join('');
  $('#chatList').innerHTML =
    (friendRows ? `<div class="section-label">联系人</div>` + friendRows : '') +
    (strangerRows ? `<div class="section-label">史间人物 · 点进资料页申请添加</div>` + strangerRows : '') ||
    '<div class="empty">没有找到这个人——换个名字试试，或去摇一摇。</div>';
  $$('#chatList [data-chat]').forEach(r => r.onclick = () => startChat(r.dataset.chat));
  $$('#chatList [data-person]').forEach(r => r.onclick = () => openPerson(r.dataset.person));
}
function renderContacts(filter = '') {
  const friends = store.getFriends();
  const others = Object.values(PEOPLE).map(p => p.name).filter(n => !store.isFriend(n) && n.includes(filter));
  $('#contactList').innerHTML = friends.filter(n => n.includes(filter)).map(n => {
    const p = personOf(n);
    return `<div class="row" data-person="${esc(n)}">${avatar(n, true)}<div class="row-main"><div class="row-title">${esc(n)}</div><div class="row-preview">${esc(p?.era ? p.era + ' · ' : '')}${esc(p?.title || '待核验人物 · 新加入')}</div></div></div>`;
  }).join('') +
  (others.length ? `<div class="section-label">尚未结识 · 点进资料页认识 TA</div>` : '') +
  others.map(n => {
    const p = personOf(n);
    return `<div class="row dim" data-person="${esc(n)}">${avatar(n, true)}<div class="row-main"><div class="row-title">${esc(n)}</div><div class="row-preview">${esc(p?.era ? p.era + ' · ' : '')}${esc(p?.title || '待核验人物')} · 陌生人</div></div><span class="row-badge">添加</span></div>`;
  }).join('');
  $$('#contactList [data-person]').forEach(r => r.onclick = () => openPerson(r.dataset.person));
}

/* ---------- 朋友圈：时代快捷跳转 ---------- */
function renderEraChips() {
  const eras = store.getEras();
  $('#eraChips').innerHTML = eras.map((e, i) =>
    `<button data-era="${i}" class="${st.year >= e.start && st.year <= e.end ? 'active' : ''}">${esc(e.name)}</button>`
  ).join('');
  $$('#eraChips [data-era]').forEach(b => b.onclick = () => {
    const e = eras[Number(b.dataset.era)];
    jumpTo(store.nearestStationInEra(e), { scroll: true });
    toast(`跳到 ${e.name}（${store.formatYear(e.start)}—${store.formatYear(e.end)}）`);
  });
}

/* ---------- 朋友圈：核心渲染 ---------- */
function updateDateLabel() { $('#momentDateLabel').textContent = `${store.formatYear(st.year)} 年 · ${store.eraOf(st.year)}`; }

/* 陌生状态下的朋友圈文本锁：确定性隐藏约 1/3 的动态文本，加好友解锁 */
function isLockedPost(p) { return !store.isFriend(p.person) && [...p.id].reduce((a, c) => a + c.charCodeAt(0), 0) % 3 === 0; }

function renderPost(p) {
  const liked = st.likes.has(p.id);
  const comments = [...(p.comments || []), ...(st.userComments[p.id] || [])];
  const dateLabel = `${p.month || ''}${p.day ? '初' + p.day : ''} · ${store.formatYear(p.year)}年`;
  if (isLockedPost(p)) {
    return `<article class="moment">${avatar(p.person, true)}<div class="moment-body">
     <div class="moment-name" data-open-person="${esc(p.person)}">${esc(p.person)}<span style="font-weight:400;color:#b2b2b2;font-size:11px">　${esc(p.certainty || '')}</span></div>
     <button class="moment-lock" data-lock="${esc(p.person)}">🔒 该内容已隐藏　<i>添加「${esc(p.person)}」为好友后可见</i></button>
     <div class="moment-bottom"><span>${esc(p.time || '')}　${esc(dateLabel)}</span><div><button class="moment-actions" data-cm="${esc(p.id)}">···</button></div></div>
     <div class="comments" id="cm-${esc(p.id)}">${comments.map(c => {
      const author = c.includes('：') ? c.split('：')[0] : c.split(':')[0];
      const body = c.includes('：') ? c.substring(c.indexOf('：') + 1) : c.includes(':') ? c.substring(c.indexOf(':') + 1) : c;
      return `<div class="comment-line"><span class="comment-author" data-open-person="${esc(author)}">${esc(author)}</span>：${esc(body)}</div>`;
    }).join('')}</div>
     <div style="display:flex;gap:15px;flex-wrap:wrap;margin-top:9px;font-size:12px;color:#576b95">
      <button class="action" data-like="${esc(p.id)}">${liked ? '♥' : '♡'} ${p.likes + (liked ? 1 : 0)} 赞</button>
      <button class="action" data-cm="${esc(p.id)}">评论 ${comments.length}</button>
     </div></div></article>`;
  }
  const white = store.translate(p.text);
  const osHtml = esc(white) + (white === p.text ? '<br><span style="color:#b3a98f">（本地对照表暂无此句，接入 Agent 后可动态翻译）</span>' : '') +
    (p.os ? `<br><br><span style="color:#a0906c">心里话：</span>${esc(p.os)}` : '');
  return `<article class="moment">${avatar(p.person, true)}<div class="moment-body">
   <div class="moment-name" data-open-person="${esc(p.person)}">${esc(p.person)}<span style="font-weight:400;color:#b2b2b2;font-size:11px">　${esc(p.certainty || '')}</span></div>
   <div class="moment-text">${esc(p.text)}</div>
   <div class="moment-note">${esc(p.note || '演绎动态')}${p.source ? ` ｜ 《${esc(p.source.book)}》· ${esc(p.source.chapter)}` : ''}</div>
   <div class="moment-bottom"><span>${esc(p.time || '')}　${esc(dateLabel)}</span><div><button class="moment-actions" data-cm="${esc(p.id)}">···</button></div></div>
   <div class="os" id="os-${esc(p.id)}">${osHtml}</div>
   <div class="comments" id="cm-${esc(p.id)}">${comments.map((c, ci) => {
    const author = c.includes('：') ? c.split('：')[0] : c.split(':')[0];
    const body = c.includes('：') ? c.substring(c.indexOf('：') + 1) : c.includes(':') ? c.substring(c.indexOf(':') + 1) : c;
    const ck = p.id + '-' + ci;
    return `<div class="comment-line"><span class="comment-author" data-open-person="${esc(author)}">${esc(author)}</span>：${esc(body)}<button class="comment-like" data-comment-like="${esc(ck)}">${st.commentLikes.has(ck) ? '♥' : '♡'}</button></div>`;
  }).join('')}<div class="comment-form"><input id="commentInput-${esc(p.id)}" placeholder="评论一句……"><button data-send-comment="${esc(p.id)}">发送</button></div></div>
   <div style="display:flex;gap:15px;flex-wrap:wrap;margin-top:9px;font-size:12px;color:#576b95">
    <button class="action" data-like="${esc(p.id)}">${liked ? '♥' : '♡'} ${p.likes + (liked ? 1 : 0)} 赞</button>
    <button class="action" data-cm="${esc(p.id)}">评论 ${comments.length}</button>
    <button class="action" data-os="${esc(p.id)}">翻译</button>
   </div></div></article>`;
}

function bindMomentEvents(root) {
  root.querySelectorAll('[data-os]').forEach(b => b.onclick = () => $('#os-' + CSS.escape(b.dataset.os))?.classList.toggle('show'));
  root.querySelectorAll('[data-cm]').forEach(b => b.onclick = () => $('#cm-' + CSS.escape(b.dataset.cm))?.classList.toggle('show'));
  root.querySelectorAll('[data-like]').forEach(b => b.onclick = () => {
    const id = b.dataset.like;
    if (st.likes.has(id)) st.likes.delete(id); else st.likes.add(id);
    rerenderCurrentList();
  });
  root.querySelectorAll('[data-comment-like]').forEach(b => b.onclick = () => {
    const key = b.dataset.commentLike;
    if (st.commentLikes.has(key)) st.commentLikes.delete(key); else st.commentLikes.add(key);
    rerenderCurrentList();
    const pid = key.split('-').slice(0, -1).join('-');
    $('#cm-' + CSS.escape(pid))?.classList.add('show');
  });
  root.querySelectorAll('[data-send-comment]').forEach(b => b.onclick = () => {
    const id = b.dataset.sendComment, input = $('#commentInput-' + CSS.escape(id)), v = input.value.trim();
    if (!v) { toast('先写一句评论吧'); return; }
    if (!st.userComments[id]) st.userComments[id] = [];
    st.userComments[id].push('你：' + v);
    rerenderCurrentList();
    $('#cm-' + CSS.escape(id))?.classList.add('show');
    if (Math.random() < .45) setTimeout(() => {
      const post = store.getMoments({}).posts.find(p => p.id === id) || {};
      const replies = {
        '苏轼': '有趣。你这话倒让我想起另一件事。', '黄庭坚': '承你一言，我再想想。',
        '项羽': '（打量你片刻）你倒敢说。', '刘邦': '哈哈，有意思。',
        '韩信': '……你懂的还不少。', '司马迁': '我把它记下来了。'
      };
      st.userComments[id].push(post.person + '：' + (replies[post.person] || '看见了。'));
      rerenderCurrentList();
      $('#cm-' + CSS.escape(id))?.classList.add('show');
    }, 500);
  });
  root.querySelectorAll('[data-lock]').forEach(b => b.onclick = () => {
    toast('加 TA 为好友，就能看到这条内容');
    openPerson(b.dataset.lock);
  });
  root.querySelectorAll('[data-open-person]').forEach(b => b.onclick = () => openPerson(b.dataset.openPerson));
}

function rerenderCurrentList() {
  if (st.page === 'profilemoments') renderProfileMoments(); else renderMoments();
}

function renderMoments() {
  const res = store.getMoments({ year: st.year });
  $('#momentsCoverSub').textContent = `${store.formatYear(st.year)} 年 · ${store.eraOf(st.year)}`;
  updateDateLabel();
  let head = '';
  if (res.context) head += `<div class="year-context"><b>【${store.formatYear(res.context.year)} 年 · ${esc(res.context.title)}】</b>　${esc(res.context.desc)}<span class="ctx-src">——《${esc(res.context.book)}》${res.context.chapter ? '· ' + esc(res.context.chapter) : ''}</span></div>`;
  if (res.note) head += `<div class="year-note">${esc(res.note)}</div>`;
  const list = $('#momentsList');
  list.innerHTML = head + (res.posts.map(p => renderPost(p)).join('') || '<div class="empty">这段时空静悄悄的。</div>');
  bindMomentEvents(list);
}

/* 人物朋友圈（碎片层：动态归档）。剧情入口在聊天页 ＋ → 时空连线 */
function openProfileMoments(name) {
  st.momentOwner = name;
  showPage('profilemoments', name + '的朋友圈');
  renderProfileMoments();
}
function renderProfileMoments() {
  $('#profileMomentsSub').textContent = 'TA 留在各个年份的动态';
  const res = store.getMoments({ owner: st.momentOwner });
  const groups = {};
  res.posts.forEach(m => { (groups[m.year] = groups[m.year] || []).push(m); });
  const years = Object.keys(groups).map(Number).sort((a, b) => b - a);
  const list = $('#profileMomentsList');
  list.innerHTML = years.map(y =>
    `<div class="pm-year"><span>${store.formatYear(y)} 年</span><button data-gotoyear="${y}">去这个年份的朋友圈</button></div>` + groups[y].map(m => renderPost(m)).join('')
  ).join('') || '<div class="empty">TA 还没有发过动态。</div>';
  bindMomentEvents(list);
  list.querySelectorAll('[data-gotoyear]').forEach(b => b.onclick = () => {
    goMoments();
    jumpTo(Number(b.dataset.gotoyear), { scroll: true });
  });
}
/* ---------- 时空连线：剧情视频通话（集选择 sheet + 一屏字幕推进 overlay） ---------- */
function openCallPicker(name) {
  if (!store.isFriend(name)) { toast('先添加 TA 为好友，才能发起时空连线'); return; }
  const entries = store.getStoryEntries(name);
  if (!entries.length) { toast('TA 的时空连线还在架设中'); return; }
  st.person = name;
  if (st.call) { st.call = null; }
  const p = personOf(name);
  const av = $('#cpAvatar');
  av.textContent = p?.avatar || name.slice(0, 1);
  av.className = 'avatar ' + (p?.cls || '');
  $('#cpName').textContent = name;
  const prog = store.actProgress(name);
  $('#cpSub').textContent = `时空连线 · ${prog.read}/${prog.total}` +
    (store.isFanficUnlocked(name) ? ' · ✦ 二创已解锁' : '');
  const next = store.getNextAct(name);
  $('#cpList').innerHTML = entries.map((e, i) => {
    const read = store.isActRead(e.id);
    const open = read || (next && next.id === e.id);
    return `<div class="row call-row${open ? '' : ' locked'}" data-call="${esc(e.id)}">
      <div class="call-no">${read ? '✓' : i + 1}</div>
      <div class="row-main"><div class="row-title">${esc(e.title)} <span class="call-ep">${esc(e.key)}</span></div>
      <div class="row-preview">${open ? esc(e.hook) : '🔒 读完上一集后解锁'}</div></div>
    </div>`;
  }).join('');
  $('#moreSheet').classList.add('hidden');
  $('#callPicker').classList.remove('hidden');
  $$('#cpList [data-call]').forEach(r => r.onclick = () => {
    if (r.classList.contains('locked')) { toast('先读完上一集——剧情是连贯的'); return; }
    $('#callPicker').classList.add('hidden');
    startCall(name, r.dataset.call);
  });
}
function startCall(name, entryId) {
  const entry = store.getStoryEntries(name).find(e => e.id === entryId);
  if (!entry) return;
  st.call = { name, entry, idx: 0, branch: null, connected: false, finished: false };
  const p = personOf(name);
  const ov = $('#callOverlay');
  ov.classList.remove('hidden');
  ov.classList.add('call-incoming');
  $('#coAvatar').textContent = p?.avatar || name.slice(0, 1);
  $('#coAvatar').className = 'call-avatar ' + (p?.cls || '');
  const bg = entry.bg || {};
  $('#coVideo').style.background = (bg.grad && bg.grad.length > 1)
    ? `linear-gradient(160deg, ${bg.grad[0]}, ${bg.grad[1]})` : '#1a2330';
  /* 场景图：img/scenes/<场景>.svg 叠在渐变之上（生成器产出，见 scripts/gen_scenes.py） */
  const coBg = $('#coBg');
  if (bg.img) { coBg.style.backgroundImage = `url(${bg.img})`; coBg.dataset.img = bg.img; }
  else { coBg.style.backgroundImage = 'none'; coBg.dataset.img = ''; }
  $('#coStatus').textContent = `正在呼叫 · ${store.formatYear(entry.year)}年 · ${entry.place}…`;
  $('#coSpeaker').textContent = '';
  $('#coLine').textContent = '';
  $('#coChoices').innerHTML = '';
  $('#coActions').innerHTML = '';
  $('#coHint').textContent = '';
  $('#coReview').classList.add('hidden');
  $('#coAuto').textContent = '自动播放：开';
  $('#coAccept').classList.remove('hidden');     /* 呼叫中：先接听 */
  $('#coHangup').classList.add('hidden');
}
function acceptCall() {
  const c = st.call; if (!c || c.connected) return;
  c.connected = true;
  $('#callOverlay').classList.remove('call-incoming');
  $('#coAccept').classList.add('hidden');
  $('#coHangup').classList.remove('hidden');
  $('#coStatus').textContent = `连线中 · ${store.formatYear(c.entry.year)}年 · ${c.entry.place}`;
  $('#coHint').textContent = '点击屏幕继续 · ' + c.entry.title;
  advanceCall();
}
/* 字幕推进：点一下屏幕播一句，上一句消失；choice 停下等选 */
function advanceCall() {
  const c = st.call; if (!c || !c.connected || c.finished) return;
  if ($('#coChoices').children.length) return;   /* choice 挂起：必须选一个回复 */
  $('#coChoices').innerHTML = '';
  const s = c.entry.script;
  while (c.idx < s.length) {
    const beat = s[c.idx++];
    if (beat.t === 'choice') { renderCallChoices(beat.options); return; }
    if (beat.t === 'ta' && beat.by && beat.by !== c.branch) continue;
    if (beat.t === 'converge') continue;
    showCallLine(beat);
    return;
  }
  finishCall();
}
function showCallLine(beat) {
  const c = st.call;
  const sys = beat.t === 'in' || beat.t === 'out';
  const line = $('#coLine');
  line.classList.toggle('sys', sys);
  line.classList.remove('anim'); void line.offsetWidth;   /* 重启淡入动画 */
  line.classList.add('anim');
  line.innerHTML = esc(beat.text).replace(/\n/g, '<br>');
  $('#coSpeaker').textContent = sys ? '' : c.name;
  /* 语音接口：window.ShiJianVoice = { play(beat){...}, stop(){} }，接入后逐句发声 */
  if (window.ShiJianVoice && window.ShiJianVoice.play) window.ShiJianVoice.play(beat);
  if (beat.t === 'out') { finishCall(); return; }
  $('#coHint').textContent = `点击屏幕继续 · 已读 ${c.idx}/${c.entry.script.length} · ${c.entry.title}`;
}
function renderCallChoices(options) {
  $('#coSpeaker').textContent = '';
  $('#coHint').textContent = '选一个回复';
  $('#coChoices').innerHTML = options.map((o, i) => `<button data-callpick="${i}">${esc(o[0])}</button>`).join('');
  $$('#coChoices [data-callpick]').forEach(b => b.onclick = ev => {
    ev.stopPropagation();
    const opt = options[Number(b.dataset.callpick)];
    st.call.branch = opt[1];
    $('#coLine').classList.remove('sys', 'anim'); void $('#coLine').offsetWidth;
    $('#coLine').classList.add('anim');
    $('#coLine').innerHTML = `<i class="me-line">${esc(opt[0])}</i>`;
    $('#coSpeaker').textContent = '你';
    $('#coChoices').innerHTML = '';
    setTimeout(advanceCall, 350);
  });
}
/* 播完 out（挂断词）：标记已读 + 出史册入口；挂断按钮随时可退 */
function finishCall() {
  const c = st.call; if (!c || c.finished) return;
  c.finished = true;
  $('#coSpeaker').textContent = '';
  $('#coStatus').textContent = '已挂断 · ' + store.formatYear(c.entry.year) + '年';
  $('#coHangup').textContent = '返回聊天';
  $('#coHint').textContent = '';
  const { name, entry } = c;
  if (!store.isActRead(entry.id)) {
    store.markActRead(entry.id);
    const pg = store.actProgress(name);
    toast(store.isFanficUnlocked(name)
      ? '四集连完——' + name + '的二创聊天已解锁'
      : `第 ${pg.read} 集读完——下一集已解锁`);
  }
  $('#coActions').innerHTML = '<button id="coAnnals">史册 · 本集考据</button>';
  $('#coReview').classList.remove('hidden');
  $('#coReview').onclick = ev => {
    ev.stopPropagation();
    $('#coAnnals').click();
  };
  $('#coAnnals').onclick = ev => {
    ev.stopPropagation();
    const a = entry.annals || {};
    $('#coLine').classList.remove('sys'); $('#coLine').classList.add('anim');
    $('#coLine').innerHTML = `<b>【史册 · ${esc(entry.title)}】</b><br>` + esc(a.anchor || '') + '<br><br>' + esc(a.note || '');
    $('#coSpeaker').textContent = '';
    $('#coHint').textContent = '看完后点「返回聊天」退出';
  };
}
function hangupCall() {
  const name = st.call?.name;
  st.call = null;
  window.ShiJianVoice && window.ShiJianVoice.stop();
  $('#callOverlay').classList.add('hidden');
  $('#coHangup').textContent = '挂断';
  $('#coActions').innerHTML = '';
  if (name && st.page === 'chat') renderFanficBar(name);   /* 挂断后刷新二创门进度 */
}
/* overlay 交互：点视频区/字幕区推进一句；接听、挂断随时可退 */
$('#coVideo').onclick = () => advanceCall();
$('#coVoice').onclick = ev => {
  ev.stopPropagation();
  const on = window.ShiJianVoice.toggle();
  $('#coVoice').textContent = on ? '🔊' : '🔇';
  toast(on ? '语音朗读已开' : '语音朗读已关');
  $('#coVoice').classList.toggle('off', !on);
};
$('#coVoice').textContent = window.ShiJianVoice.enabled() ? '🔊' : '🔇';
$('#coVoice').classList.toggle('off', !window.ShiJianVoice.enabled());
$('#coAuto').onclick = ev => {
  ev.stopPropagation();
  const on = $('#coAuto').dataset.on !== 'false';
  $('#coAuto').dataset.on = String(!on);
  $('#coAuto').textContent = '自动播放：' + (on ? '关' : '开');
};
$('#coAccept').onclick = ev => { ev.stopPropagation(); acceptCall(); };
$('#coHangup').onclick = ev => { ev.stopPropagation(); hangupCall(); };
$('#cpClose').onclick = () => $('#callPicker').classList.add('hidden');

/* ---------- 穿越核心 ---------- */
function jumpTo(year, opts = {}) {
  st.year = year;
  const p = store.peekFirstPost(year);
  if (p) { st.month = p.month; st.day = p.day; }
  Rail.setYear(year, { animate: !opts.fromDrag });
  renderEraChips();
  renderMoments();
  if (opts.scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
}
function goMoments() {
  st.momentOwner = null;
  showPage('moments', '朋友圈');
  renderEraChips();
  Rail.refresh();
  renderMoments();
}

/* ---------- 播放模式（参考「历史年轮」一年一年动态体验） ---------- */
function setPlaying(on) {
  st.playing = on;
  const b = $('#momentPlay');
  if (b) { b.textContent = on ? '⏸ 暂停' : '▶ 播放'; b.classList.toggle('playing', on); }
  clearInterval(st.playTimer);
  if (on) {
    stepPlay();
    st.playTimer = setInterval(stepPlay, meta.playInterval || 2600);
  }
}
function stepPlay() {
  const ns = store.nextStation(st.year);
  if (ns == null) { setPlaying(false); toast('已到时间轴尽头——再按一次播放，从头再来'); return; }
  jumpTo(ns);
}
function stationStep(dir) {
  const target = dir > 0 ? store.nextStation(st.year) : store.prevStation(st.year);
  if (target == null) { toast(dir > 0 ? '已经是最后一站了' : '已经是最早的一站了'); return; }
  jumpTo(target, { scroll: true });
}

/* ---------- 历史年轮页（精确选日期 + 大事列表） ---------- */
function buildTimelineYears() {
  const eras = store.getEras();
  const e = eras[Number($('#timelineEra').value) || 0] || eras[0];
  const ys = $('#timelineYear'); ys.innerHTML = '';
  for (let y = e.start; y <= e.end; y++) ys.add(new Option(store.formatYear(y) + ' 年', y));
  ys.value = (st.year >= e.start && st.year <= e.end) ? st.year : e.start;
}
function renderTimeline() {
  const eras = store.getEras();
  const eraSel = $('#timelineEra');
  if (!eraSel.options.length) eras.forEach((e, i) => eraSel.add(new Option(`${e.name}（${store.formatYear(e.start)}—${store.formatYear(e.end)}）`, i)));
  let ei = eras.findIndex(e => st.year >= e.start && st.year <= e.end); if (ei < 0) ei = eras.length - 1;
  eraSel.value = ei;
  buildTimelineYears();
  if (!$('#timelineMonth').options.length) {
    store.MONTHS.forEach(m => $('#timelineMonth').add(new Option(m, m)));
    for (let d = 1; d <= 30; d++) $('#timelineDay').add(new Option('初' + d, d));
  }
  $('#timelineMonth').value = st.month; $('#timelineDay').value = st.day;
  const evs = store.getEvents().slice().reverse();
  $('#timelineEvents').innerHTML = '<h3>大事年轮 · 点击「穿越」直达</h3>' + evs.map(ev =>
    `<div class="ev-row"><b>${store.formatYear(ev.year)}</b><div><div class="ev-title">${esc(ev.title)}</div><p>${esc(ev.desc)}</p><span class="ev-src">——《${esc(ev.book)}》${ev.chapter ? '· ' + esc(ev.chapter) : ''}</span></div><button data-evyear="${ev.year}">穿越</button></div>`
  ).join('') + '<div class="hint">大事条目来自 data/events.js；正式版本应逐条补充来源与日期精度。</div>';
  $$('#timelineEvents [data-evyear]').forEach(b => b.onclick = () => {
    const y = Number(b.dataset.evyear);
    if (st.playing) setPlaying(false);
    goMoments();
    jumpTo(y, { scroll: true });
    toast(`已穿越到 ${store.formatYear(y)} 年 · ${store.eraOf(y)}`);
  });
}

/* ---------- 人物 ---------- */
function openPerson(name) {
  st.person = name;
  const p = personOf(name) || { avatar: (name || '客').slice(0, 1), title: '新加入人物 · 待核验', bio: '此人物资料由用户提交，尚未完成史实核验。', relations: '等待人物关系校验' };
  $('#personAvatar').className = 'avatar moment-avatar ' + (p.cls || '');
  $('#personAvatar').dataset.avatarPerson = name;
  $('#personAvatar').textContent = p.avatar || (name || '客').slice(0, 1);
  $('#personName').textContent = name;
  $('#personMeta').textContent = (p.title || '待核验人物') + (p.lifeText ? ' · ' + p.lifeText : '');
  $('#personBio').textContent = p.bio || '资料待补充';
  $('#personRelations').textContent = p.relations || '关系待核验';
  const friended = store.isFriend(name);
  $('#personAdd').textContent = friended ? '已是好友' : '添加到通讯录';
  $('#personAdd').disabled = friended;
  $('#personMessage').textContent = friended ? '发消息' : '加好友后可发消息';
  let status = `所选时空：${store.formatYear(st.year)} 年 · ${store.eraOf(st.year)}`;
  if (p.life) {
    const [b, d] = p.life;
    if (b != null && st.year < b) status += ' ｜ 此时尚未出生';
    else if (d != null && st.year > d) status += ' ｜ 此时已经离世';
    else status += ' ｜ 此时在世';
  }
  $('#personStatus').textContent = status;
  $('#personBooks').textContent = (p.books && p.books.length) ? p.books.join('、') : '演示档案';
  showPage('person', name);
}

/* ---------- 聊天（正史 canon / 二创 fanfic 双层，fanfic 需读完剧情解锁） ---------- */
function startChat(name, mode) {
  st.person = name;
  st.chatMode = (mode === 'fanfic' && store.getFanfic(name)) ? 'fanfic' : 'canon';
  showPage('chat', name);
  renderFanficBar(name);
  const fanfic = st.chatMode === 'fanfic';
  const key = fanfic ? 'fanfic:' + name : name;
  if (!st.chatLog[key]) {
    const script = fanfic ? (store.getFanfic(name) || {})
      : (store.getChatScript(name) || { intro: '你有什么事？', options: [['自我介绍', '原来如此。你倒是个有趣的人。'], ['问问近况', '近日诸事繁杂，不过还算安稳。'], ['请他讲故事', '既然你想听，那我便讲一段旧事。']] });
    st.chatLog[key] = fanfic
      ? [{ system: true, text: '【二创 · 演绎】以下为虚构创作，不代表史料。设定：' + (script.setting || '') }, { from: name, text: script.intro }]
      : [{ system: true, text: '你向 ' + name + ' 发起了对话。' }, { from: name, text: script.intro }];
    st.chatLog[key].options = script.options;
  }
  renderChat(name);
}
function renderFanficBar(name) {
  const bar = $('#fanficBar'); if (!bar) return;
  if (st.chatMode === 'fanfic') {
    bar.innerHTML = '<b class="fanfic-badge">二创 · 演绎（虚构创作，非史料）</b><button data-fanfic-back>返回正史聊天</button>';
    bar.querySelector('[data-fanfic-back]').onclick = () => startChat(name, 'canon');
    return;
  }
  const f = store.getFanfic(name);
  if (!f) { bar.innerHTML = ''; return; }
  if (store.isFanficUnlocked(name)) {
    bar.innerHTML = `<span>${esc(f.label)}已解锁</span><button data-fanfic-go>进入二创聊天</button>`;
    bar.querySelector('[data-fanfic-go]').onclick = () => startChat(name, 'fanfic');
  } else {
    const prog = store.actProgress(name);
    bar.innerHTML = `<span>🔒 ${esc(f.label)} · 连完 TA 的时空连线（${prog.read}/${prog.total}）后解锁</span><button data-fanfic-lock>去读剧情</button>`;
    bar.querySelector('[data-fanfic-lock]').onclick = () => openCallPicker(name);
  }
}
function renderChat(name) {
  const log = st.chatLog[(st.chatMode === 'fanfic' ? 'fanfic:' : '') + name] || [];
  $('#chatBody').innerHTML = '<div class="chat-time">' + store.formatYear(st.year) + ' 年 · ' + st.month + '初' + st.day + '</div>' +
    log.map(m => m.system
      ? `<div class="system-note">${esc(m.text)}</div>`
      : `<div class="msg ${m.from === '你' ? 'me' : ''}">${avatar(m.from === '你' ? '令狐' : name, true)}<div class="bubble">${esc(m.text).replace(/\n/g, '<br>')}</div></div>`).join('') +
    (log.options ? `<div class="story-choices">${log.options.map((o, i) => `<button data-choice="${i}">${esc(o[0])}</button>`).join('')}</div>` : '');
  $$('[data-choice]').forEach(b => b.onclick = () => {
    const opt = log.options[Number(b.dataset.choice)];
    log.push({ from: '你', text: opt[0] }, { system: true, text: '你们继续交谈。' }, { from: name, text: cleanDialogue(opt[1]) });
    log.options = [['继续聊下去', '我听见了。若要认真答你，我还得想一想此时此刻的处境。'], ['问一个更私人的问题', '这个问题，我倒是没有想到你会问。'], ['先告辞，下次再聊', '好，今日便先聊到这里。来日再谈。']];
    renderChat(name);
  });
  $('#chatBody').scrollTop = $('#chatBody').scrollHeight;
}
function cleanDialogue(s) { return String(s).replace(/^[^：:\n]{1,8}[：:]\s*/, '').replace(/（[^）]*）/g, '').replace(/\([^)]*\)/g, '').trim(); }

/* ---------- 拍一拍 ---------- */
function patPerson(name) {
  const n = (st.patCount[name] || 0) + 1; st.patCount[name] = n;
  const lines = [`${name}回拍了你一下。`, `${name}看了看你，没有说话。`, `${name}：又来？`, `${name}：……（似笑非笑）`];
  if (n % 3 === 1) {
    if (!st.chatLog[name]) st.chatLog[name] = [];
    st.chatLog[name].push({ from: name, text: '（你拍了我一下？）' });
    renderChats();
    toast(`${name}给你发来一条消息`);
  } else toast(lines[n % lines.length]);
}

/* ---------- 事件绑定 ---------- */
$$('[data-tab]').forEach(b => b.onclick = () => showPage(b.dataset.tab, undefined, { tab: true }));
$('#backBtn').onclick = () => {
  const previous = st.navStack.pop();
  if (previous) {
    showPage(previous.page, previous.title, { back: true });
    if (previous.page === 'moments') renderMoments();
    if (previous.page === 'profilemoments') renderProfileMoments();
    return;
  }
  const fallback = ['moments', 'profilemoments', 'timeline'].includes(st.page) ? 'discover' : 'wechat';
  showPage(fallback, undefined, { back: true });
  if (fallback === 'discover') st.momentOwner = null;
};
$('#topPlus').onclick = () => showPage('add', '添加名人');
$('#topSearch').onclick = () => { if (st.page === 'wechat') $('#searchChats').focus(); else if (st.page === 'contacts') $('#searchContacts').focus(); else toast('搜索功能将在后续版本完善'); };
$('#searchChats').oninput = e => renderChats(e.target.value.trim());
$('#searchContacts').oninput = e => renderContacts(e.target.value.trim());
$('#page-contacts .row[data-open-person="new"]').onclick = () => showPage('newfriends', '新的朋友');
$('#openMoments').onclick = () => goMoments();
$('#openShake').onclick = () => showPage('shake', '摇一摇');
$('#momentPickDate').onclick = () => { renderTimeline(); showPage('timeline', '历史年轮'); };
$('#timelineEra').onchange = buildTimelineYears;
$('#applyTimeline').onclick = () => {
  st.year = Number($('#timelineYear').value);
  st.month = $('#timelineMonth').value;
  st.day = Number($('#timelineDay').value);
  if (st.playing) setPlaying(false);
  goMoments();
  jumpTo(st.year);
  toast(`已穿越到 ${store.formatYear(st.year)} 年 ${st.month}初${st.day}`);
};
$('#momentPlay').onclick = () => setPlaying(!st.playing);
$('#stationPrev').onclick = () => { if (st.playing) setPlaying(false); stationStep(-1); };
$('#stationNext').onclick = () => { if (st.playing) setPlaying(false); stationStep(1); };

$('#personMessage').onclick = () => {
  if (!store.isFriend(st.person)) { toast('先添加 TA 为好友，才能发消息'); return; }
  startChat(st.person);
};
$('#personMoments').onclick = () => openProfileMoments(st.person);
$('#personAdd').onclick = () => {
  if (store.isFriend(st.person)) { toast('这位名人已经在你的通讯录里啦'); return; }
  if (store.addFriend(st.person)) {
    $('#personAdd').textContent = '已是好友';
    $('#personAdd').disabled = true;
    $('#personMessage').textContent = '发消息';
    renderChats(); renderContacts();
    toast('已添加——TA 朋友圈的全部内容也解锁了');
  }
};
$('#submitAdd').onclick = () => {
  const n = $('#addName').value.trim();
  if (!n) { toast('先写下名人的名字吧'); return; }
  const wantYear = Number($('#addYear').value) || st.year;
  const p = personOf(n);
  if (p) {
    if (store.isFriend(n)) { $('#addResult').innerHTML = `「${esc(n)}」已经在你的通讯录里了。`; return; }
    let check = '';
    if (p.life) {
      const [b, d] = p.life;
      if (b != null && wantYear < b) check = '校验结果：TA 此时还未出生。';
      else if (d != null && wantYear > d) check = '校验结果：TA 此时已经离世。';
      else check = '校验结果：TA 此时在世，可以添加。';
    } else check = '此人物暂无生卒年数据，无法自动校验。';
    store.addFriend(n);
    EXTRA[n] = EXTRA[n] || {};
    $('#addResult').innerHTML = `「${esc(n)}」已加入通讯录。${esc(check)}`;
  } else {
    store.addFriend(n);
    EXTRA[n] = { avatar: n.slice(0, 1), title: '新加入人物 · 待核验', bio: '由用户提交，尚未核验。', relations: '待核验' };
    $('#addResult').innerHTML = `已添加「${esc(n)}」。史间档案里暂时没有 TA 的记载，TA 的动态与连线将保持空白。`;
  }
  renderChats(); renderContacts();
  toast('已添加到通讯录');
};
$('#mePeople').onclick = () => { showPage('contacts', '通讯录'); toast('这里可以查看和管理已添加人物'); };
$('#meAbout').onclick = () => showPage('about', '关于史间');
$('#translateBtn').onclick = () => {
  const v = $('#translateInput').value.trim();
  if (!v) { toast('先输入一句话'); return; }
  const white = store.translate(v);
  $('#translateOutput').classList.remove('hidden');
  $('#translateOutput').innerHTML = `<p style="margin:0;line-height:1.9">${esc(white)}</p>` +
    (white === v ? '<p style="margin:6px 0 0;color:#b3a98f;font-size:12px">本地对照表暂无此句——接入 AI Agent 后可整句动态翻译。</p>' : '');
};
$('#chatSend').onclick = () => {
  const v = $('#chatText').value.trim();
  if (!v) return;
  const log = st.chatLog[st.person] || [];
  log.push({ from: '你', text: v }, { system: true, text: '对方看到了你的消息。' }, { from: st.person, text: '我听见了。若要认真回答，还得结合此时此刻的处境再想一想。' });
  st.chatLog[st.person] = log;
  renderChat(st.person);
  $('#chatText').value = '';
};
$('#chatText').onkeydown = e => { if (e.key === 'Enter') $('#chatSend').click(); };
/* ＋ 面板：时空连线（剧情视频通话）/ 拍一拍 */
$('#chatMore').onclick = () => $('#moreSheet').classList.toggle('hidden');
$('#moreCall').onclick = () => { $('#moreSheet').classList.add('hidden'); openCallPicker(st.person || st.momentOwner); };
$('#morePat').onclick = () => {
  $('#moreSheet').classList.add('hidden');
  const n = st.person || st.momentOwner;
  st.chatLog[n] = st.chatLog[n] || [];
  st.chatLog[n].push({ system: true, text: '你拍了拍「' + n + '」' });
  renderChat(n);
  toast('已拍一拍');
};
$('#shakeNow').onclick = () => {
  const alive = Object.values(PEOPLE).filter(p => !p.life || ((p.life[0] == null || st.year >= p.life[0]) && (p.life[1] == null || st.year <= p.life[1])));
  if (!alive.length) { $('#shakeResult').innerHTML = '<div class="empty">这一年的时空静悄悄的……换个年份再摇吧。</div>'; return; }
  const p = alive[Math.floor(Math.random() * alive.length)];
  $('#shakeResult').innerHTML = `<div class="row" style="text-align:left;margin-top:12px;border-radius:6px">${avatar(p.name, true)}<div class="row-main"><div class="row-title profile-link" id="shakePerson">${esc(p.name)}</div><div class="row-preview">同一时空的陌生人 · ${esc(store.formatYear(st.year))} 年在世</div></div><button class="secondary" id="shakeAdd">认识一下</button></div>`;
  $('#shakePerson').onclick = () => openPerson(p.name);
  $('#shakeAdd').onclick = () => { openPerson(p.name); toast('先看看对方的资料吧'); };
};
$('#topPlus').addEventListener('contextmenu', e => { e.preventDefault(); showPage('add', '添加名人'); });

/* 头像单击看资料 / 双击拍一拍 */
let avatarClickTimer = null;
document.addEventListener('click', e => {
  const el = e.target.closest('[data-avatar-person]');
  if (el) { clearTimeout(avatarClickTimer); avatarClickTimer = setTimeout(() => openPerson(el.dataset.avatarPerson), 220); }
});
document.addEventListener('dblclick', e => {
  const el = e.target.closest('[data-avatar-person]');
  if (el) { clearTimeout(avatarClickTimer); e.preventDefault(); patPerson(el.dataset.avatarPerson); }
});

/* 键盘：Esc 返回；←/→ 在朋友圈切换时间驿站 */
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !$('#backBtn').classList.contains('hidden')) $('#backBtn').click();
  if (st.page === 'moments') {
    if (e.key === 'ArrowLeft') { if (st.playing) setPlaying(false); stationStep(-1); }
    if (e.key === 'ArrowRight') { if (st.playing) setPlaying(false); stationStep(1); }
  }
});
window.addEventListener('resize', () => { if (st.page === 'moments') Rail.refresh(); });

/* ---------- 初始化 ---------- */
function init() {
  buildPeople();
  const p0 = store.peekFirstPost(st.year);
  if (p0) { st.month = p0.month; st.day = p0.day; }
  Rail.mount($('#timeRail'), {
    min: (meta.range && meta.range[0]) || -815,
    max: (meta.range && meta.range[1]) || 1115,
    tickStep: meta.tickStep || 5,
    getYear: () => st.year,
    stations: () => store.getStations(),
    onPreview: y => {
      st.year = y;
      $('#momentsCoverSub').textContent = `${store.formatYear(y)} 年 · ${store.eraOf(y)}`;
      updateDateLabel();
      Rail.setYear(y, { animate: false });
    },
    onCommit: y => { if (st.playing) setPlaying(false); jumpTo(y); }
  });
  renderChats();
  renderContacts();
  renderEraChips();
  renderMoments();
  renderTimeline();
}
init();
$('#statusTime').textContent = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });

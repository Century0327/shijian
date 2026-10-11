/* ============================================================
   史间 · 语音层（ShiJianVoice）
   ------------------------------------------------------------
   在"点一句播一句"的连线上，为每一拍朗读。
   - 浏览器 SpeechSynthesis（Web Speech API）中文 TTS；
   - 不支持的浏览器静默降级，不影响任何其他功能；
   - 朗读文本自动去掉【场景标】与（舞台指示），只留角色说的话；
   - choice / 玩家回复拍不朗读（那是"你"说的话）；
   - 开关状态持久化 localStorage 'shijian.voice.v1'。
   接口契约（app.js 调用点）：
     window.ShiJianVoice.play(beat)   // 推进一步时朗读
     window.ShiJianVoice.stop()       // 挂断 / 中途退出时停止
     window.ShiJianVoice.toggle()     // 切换开关，返回新状态
     window.ShiJianVoice.enabled()    // 当前是否开启
   ============================================================ */
window.ShiJianVoice = (function () {
  const VKEY = 'shijian.voice.v1';
  let on = true;
  try { const v = window.localStorage.getItem(VKEY); if (v !== null) on = v === '1'; } catch (e) { /* 隐私模式：用默认值 */ }

  const synth = window.speechSynthesis || null;
  let voice = null;

  function pickVoice() {
    if (!synth) return null;
    const vs = synth.getVoices();
    if (!vs.length) return null;
    voice = vs.find(v => /zh[-_]CN|zh[-_]Hans|Chinese/i.test(v.lang) || /Chinese/i.test(v.name))
      || vs.find(v => /zh/i.test(v.lang)) || vs[0];
    return voice;
  }
  if (synth) { pickVoice(); synth.addEventListener && synth.addEventListener('voiceschanged', pickVoice); }

  /* 只留能"说"的部分：去掉【…】场景标、（…）舞台指示 */
  function spoken(beat) {
    if (!beat || typeof beat.text !== 'string') return '';
    if (beat.t === 'in' || beat.t === 'out' || beat.t === 'choice') return '';   /* 系统拍与选项不朗读 */
    return beat.text
      .replace(/【[^】]*】/g, ' ')
      .replace(/（[^）]*）/g, ' ')
      .replace(/「|」|，|。|！|？|、|；/g, m => (m === '。' ? '，' : m))
      .replace(/\s+/g, ' ')
      .trim();
  }

  function play(beat) {
    if (!on || !synth) return;
    const text = spoken(beat);
    if (!text) { stop(); return; }
    stop();
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = 1.0;
      u.pitch = 1.0;
      if (voice) u.voice = voice;
      synth.speak(u);
    } catch (e) { /* 忽略：语音不可用不阻塞剧情 */ }
  }

  function stop() { try { synth && synth.cancel(); } catch (e) { } }

  function toggle() { on = !on; if (!on) stop(); try { window.localStorage.setItem(VKEY, on ? '1' : '0'); } catch (e) { } return on; }
  function enabled() { return on; }

  return { play, stop, toggle, enabled, spoken };
})();

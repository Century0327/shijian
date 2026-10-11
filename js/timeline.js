/* ============================================================
   史间 · 时空年轮组件（ShiJianRail）
   参考「历史年轮」App「一年一年动态感受历史」的交互：
   - 中心指针固定，拖动下方年轮横向滚动时间
   - 圆点 = 时间驿站（有动态的年份 / 重大事件年份），点击即穿越
   - 拖动过程中实时预览年份，松手后正式提交（onCommit）
   API:
     Rail.mount(el, {
       min, max, tickStep,
       getYear: () => y,
       onPreview: y => {},        // 拖动中
       onCommit: (y, opts) => {}, // 松手 / 点圆点
       stations: () => [{year, hasPosts, big}]
     });
     Rail.refresh();              // 重建刻度与驿站（数据变化后调用）
     Rail.setYear(y, {animate});  // 编程式居中
   ============================================================ */
(function () {
  let cfg = null, win = null, track = null, winW = 480;
  let dragging = false, startX = 0, startYear = 0, moved = false;

  function xOf(year) { return (year - cfg.min) / (cfg.max - cfg.min) * winW; }
  function yearAt(px) { return cfg.min + (px / winW) * (cfg.max - cfg.min); }
  function pct(year) { return ((xOf(year) / winW) * 100).toFixed(3); }
  function fmt(y) { return y < 0 ? '前' + (-y) : '' + y; }

  function layout() {
    winW = win.clientWidth || 480;
    const step = cfg.tickStep || 5;
    let html = '';
    for (let y = Math.ceil(cfg.min / step) * step; y <= cfg.max; y += step) {
      const major = y % 50 === 0;
      html += `<div class="rail-tick ${major ? 'major' : ''}" style="left:${pct(y)}%"></div>`;
      if (y % 100 === 0) html += `<span class="rail-label" style="left:${pct(y)}%">${fmt(y)}</span>`;
    }
    (cfg.stations ? cfg.stations() : []).forEach(s => {
      html += `<div class="rail-dot ${s.hasPosts ? 'has-posts' : ''} ${s.big ? 'big' : ''}" data-year="${s.year}" style="left:${pct(s.year)}%" title="${fmt(s.year)} 年"></div>`;
    });
    track.innerHTML = html;
  }

  function position(animate) {
    track.style.transition = animate ? 'transform .3s ease' : 'none';
    track.style.transform = `translateX(${(winW / 2 - xOf(cfg.getYear()))}px)`;
  }

  function bind() {
    win.addEventListener('pointerdown', e => {
      if (e.target.classList.contains('rail-dot')) return;
      dragging = true; moved = false;
      startX = e.clientX; startYear = cfg.getYear();
      try { win.setPointerCapture(e.pointerId); } catch (_) {}
      track.style.transition = 'none';
    });
    win.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      const y = Math.round(Math.max(cfg.min, Math.min(cfg.max, yearAt(xOf(startYear) - dx))));
      if (y !== cfg.getYear()) cfg.onPreview(y);
    });
    const up = () => {
      if (!dragging) return;
      dragging = false;
      if (moved) cfg.onCommit(cfg.getYear(), { fromDrag: true });
      setTimeout(() => { moved = false; }, 50);
    };
    win.addEventListener('pointerup', up);
    win.addEventListener('pointercancel', up);
    win.addEventListener('click', e => {
      const dot = e.target.closest('.rail-dot');
      if (dot && !moved) cfg.onCommit(Number(dot.dataset.year), { fromDot: true });
    });
  }

  window.ShiJianRail = {
    mount(node, opts) {
      cfg = Object.assign({ min: -815, max: 1115, tickStep: 5, getYear: () => 0, onPreview: () => {}, onCommit: () => {}, stations: () => [] }, opts);
      win = node.querySelector('.rail-window');
      track = win.querySelector('.rail-track');
      bind();
      this.refresh();
    },
    refresh() { layout(); position(false); },
    setYear(y, o = {}) { position(o.animate !== false); }
  };
})();

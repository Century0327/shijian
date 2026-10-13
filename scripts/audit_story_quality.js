#!/usr/bin/env node

global.window = {};
require('../data/storycalls.js');

const data = window.SHIJIAN_DATA.storycalls || {};
const warnings = [];
const failures = [];
const summary = [];

for (const [character, group] of Object.entries(data)) {
  const entries = group.entries || [];
  if (entries.length < 4) failures.push(`${character}: 仅 ${entries.length} 幕，默认要求至少 4 幕`);

  for (const entry of entries) {
    const label = `${character}/${entry.id}`;
    const script = entry.script || [];
    const choices = script.filter(beat => beat.t === 'choice').length;
    summary.push({ character, id: entry.id, beats: script.length, choices });

    if (!entry.callReason) warnings.push(`${label}: 缺 callReason 五项分析`);
    else {
      for (const key of ['trigger', 'emotion', 'consciousNeed', 'hiddenNeed', 'playerRole']) {
        if (!entry.callReason[key]) warnings.push(`${label}: callReason.${key} 为空`);
      }
    }
    if (script.length < 35) warnings.push(`${label}: 仅 ${script.length} 拍，检查是否缺少完整情绪曲线`);
    if (choices < 3) warnings.push(`${label}: 仅 ${choices} 组选项，玩家参与可能不足`);
    if (!entry.annals?.anchor || !entry.annals?.note) warnings.push(`${label}: 史册锚点或演绎边界不完整`);

    script.forEach((beat, index) => {
      if (beat.t !== 'ta') return;
      const text = beat.text || '';
      if (/[？?]\s*$/.test(text) && script[index + 1]?.t !== 'choice') {
        failures.push(`${label} 第 ${index + 1} 拍: 角色提问后未紧随 choice`);
      }
      if (/^我是.{0,18}(字|号|人|官|今年)/.test(text) || /^我叫[\u4e00-\u9fa5]{2,4}[，。]/.test(text)) {
        warnings.push(`${label} 第 ${index + 1} 拍: 疑似传记口播「${text.slice(0, 28)}」`);
      }
    });
  }
}

console.log(`角色 ${Object.keys(data).length} 人，剧情 ${summary.length} 幕。`);
console.log(`硬失败 ${failures.length} 项，待人工复核 ${warnings.length} 项。`);
failures.forEach(item => console.error(`FAIL ${item}`));
warnings.forEach(item => console.warn(`WARN ${item}`));

if (process.argv.includes('--strict') && (failures.length || warnings.length)) process.exit(1);

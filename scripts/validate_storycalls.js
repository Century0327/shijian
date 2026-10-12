#!/usr/bin/env node

global.window = {};
require('../data/storycalls.js');

const failures = [];
const storycalls = window.SHIJIAN_DATA.storycalls || {};

for (const [character, group] of Object.entries(storycalls)) {
  for (const entry of group.entries || []) {
    const script = entry.script || [];
    script.forEach((beat, index) => {
      if (beat.t !== 'ta' || !/[？?]\s*$/.test(beat.text || '')) return;
      const next = script[index + 1];
      if (!next || next.t !== 'choice') {
        failures.push(`${character}/${entry.id} 第 ${index + 1} 拍：问句后不是 choice`);
      }
    });
  }
}

if (failures.length) {
  console.error('角色提问节拍检查失败：');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('角色提问节拍检查通过：所有问号结尾的角色台词均紧随玩家选项。');

/* 一次性：把已有单集改为四幕中对应幕的 key/title，为插入新集做准备 */
const fs = require('fs');
const P = '/workspace/shijian/data/storycalls.js';
const REMAP = {
  'smq-act-1': ['至暗', '第3集 · 蚕室灯火'],
  'su-act-1':  ['至暗', '第3集 · 临皋亭夜雨'],
  'htj-act-1': ['折', '第3集 · 灯下改诗'],
  'was-act-1': ['折', '第3集 · 半山园的驴'],
  'lqz-act-1': ['折', '第2集 · 重阳寄词'],
  'lba-act-1': ['余响', '第3集 · 大风'],
  'hx-act-1':  ['余响', '第4集 · 与哙等为伍'],
  'cs-act-1':  ['折', '第2集 · 大泽乡雨夜'],
  'kz-act-1':  ['至暗', '第2集 · 弦歌不辍'],
  'gj-act-1':  ['折', '第2集 · 入吴前夜'],
  'lxr-act-1': ['折', '第3集 · 引车避匿'],
  'lp-act-1':  ['余响', '第4集 · 尚能饭否'],
  'qy-act-1':  ['至暗', '第3集 · 泽畔'],
  'jk-act-1':  ['至暗', '第3集 · 易水前夜'],
  'lg-act-1':  ['至暗', '第2集 · 飞将军'],
  'zgl-act-1': ['余响', '第3集 · 五丈原秋风'],
  'tyq-act-1': ['折', '第3集 · 归去来'],
  'lb-act-1':  ['折', '第3集 · 金銮殿外'],
  'df-act-1':  ['至暗', '第3集 · 石壕村夜']
};
let src = fs.readFileSync(P, 'utf8'), cur = null, n = 0;
src = src.split('\n').map(line => {
  const idm = line.match(/id:\s*'([a-z]+-act-\d+)'/);
  if (idm) cur = idm[1];
  const km = line.match(/key:\s*'[^']*'/);
  const tm = line.match(/title:\s*'[^']*'/);
  if (cur && REMAP[cur]) {
    let out = line;
    if (km) out = out.replace(km[0], `key: '${REMAP[cur][0]}'`);
    if (tm) out = out.replace(tm[0], `title: '${REMAP[cur][1]}'`);
    if (out !== line) n++;
    return out;
  }
  return line;
}).join('\n');
fs.writeFileSync(P, src);
console.log('remapped:', n);
global.window = {};
require(P);
Object.entries(window.SHIJIAN_DATA.storycalls).forEach(([k, v]) =>
  console.log(k, v.entries.map(e => `${e.key}·${e.title}`).join(' | ')));

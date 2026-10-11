/* 一次性脚本：给 storycalls.js 的每个条目注入 bg.img 场景图映射。
   幂等：重复运行结果一致（'img': 'xxx' 会被替换为新值）。 */
const fs = require('fs');
const P = '/workspace/shijian/data/storycalls.js';
const MAP = {
  'xy-act-1': 'moon',  'xy-act-2': 'river', 'xy-act-3': 'tent', 'xy-act-4': 'river',   /* 项羽 */
  'lba-act-1': 'court',                                                                /* 刘邦·大风 */
  'hx-act-1': 'court',                                                                 /* 韩信 */
  'cs-act-1': 'tent',                                                                  /* 陈胜 */
  'kz-act-1': 'ridge',                                                                 /* 孔子 */
  'gj-act-1': 'ridge',                                                                 /* 勾践 */
  'lxr-act-1': 'court',                                                                /* 蔺相如 */
  'lp-act-1': 'gate',                                                                  /* 廉颇 */
  'qy-act-1': 'terrace',                                                               /* 屈原 */
  'jk-act-1': 'snow',                                                                  /* 荆轲 */
  'lg-act-1': 'tent',                                                                  /* 李广 */
  'smq-act-1': 'lamp',                                                                 /* 司马迁 */
  'su-act-1': 'moon',                                                                  /* 苏轼 */
  'htj-act-1': 'lamp',                                                                 /* 黄庭坚 */
  'was-act-1': 'ridge',                                                                /* 王安石 */
  'lqz-act-1': 'window',                                                               /* 李清照 */
  'zgl-act-1': 'tent',                                                                 /* 诸葛亮 */
  'tyq-act-1': 'river',                                                                /* 陶渊明 */
  'lb-act-1': 'gate',                                                                  /* 李白 */
  'df-act-1': 'boat'                                                                   /* 杜甫 */
};
let src = fs.readFileSync(P, 'utf8');
let cur = null, n = 0;
src = src.split('\n').map(line => {
  const idm = line.match(/id:\s*'([a-z]+-act-\d+)'/);
  if (idm) cur = idm[1];
  const imgm = line.match(/img:\s*'[^']*'/);
  if (imgm && cur && MAP[cur]) {
    n++;
    return line.replace(imgm[0], `img: 'img/scenes/${MAP[cur]}.svg'`);
  }
  return line;
}).join('\n');
fs.writeFileSync(P, src);
console.log('injected:', n);
/* 验证 */
global.window = {};
require(P);
const ids = [];
Object.values(window.SHIJIAN_DATA.storycalls).forEach(v => v.entries.forEach(e => {
  ids.push(e.id);
  if (!e.bg.img) console.log('MISSING img:', e.id);
}));
const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
console.log('entries:', ids.length, '| dup ids:', dup.length ? dup : 'none');

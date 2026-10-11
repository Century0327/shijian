/* 元信息与时代分段。UI 一律从 ShiJianStore.getMeta()/getEras() 读取，禁止硬编码。 */
window.SHIJIAN_DATA = window.SHIJIAN_DATA || {};
window.SHIJIAN_DATA.meta = {
  app: '史间',
  version: '2.0-shiji',
  range: [-815, 1115],      // 时间轴可拖动范围（负数 = 公元前）
  defaultYear: 1082,        // 初始落点：北宋元丰五年
  tickStep: 5,              // 年轮刻度间隔（年）
  playInterval: 2600        // 播放模式：每站停留毫秒数
};
window.SHIJIAN_DATA.eras = [
  { name: '春秋', start: -770, end: -476 },
  { name: '战国', start: -475, end: -221 },
  { name: '秦与秦末', start: -221, end: -203 },
  { name: '楚汉', start: -202, end: -202 },
  { name: '西汉', start: -201, end: 8 },
  { name: '东汉', start: 25, end: 220 },
  { name: '魏晋南北朝', start: 220, end: 589 },
  { name: '隋唐', start: 581, end: 907 },
  { name: '五代十国', start: 907, end: 960 },
  { name: '北宋', start: 960, end: 1127 }
];

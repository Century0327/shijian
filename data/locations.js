/* 角色地点关系：历史地点、现代对应地点与关系类型。扩展时每条关系补来源与起止年份。 */
window.SHIJIAN_DATA = window.SHIJIAN_DATA || {};
window.SHIJIAN_DATA.locations = [
  { old: '洛阳', modern: '洛阳市', district: '洛龙区', region: '河南省', relations: ['residence', 'travel'], people: ['libai', 'dufu', 'sushi', 'wanganshi', 'huangtingjian'], periods: [{ start: 700, end: 900, relation: 'travel' }, { start: 1000, end: 1100, relation: 'residence' }], source: { level: 2, title: '中国历史地图集与人物年谱', status: '待人工逐条核验' } },
  { old: '长安', modern: '西安市', district: '雁塔区', region: '陕西省', relations: ['residence', 'office'], people: ['libai', 'dufu', 'simaqian', 'zhugeliang', 'huoqubing'], periods: [{ start: -200, end: 900, relation: 'office' }, { start: 700, end: 770, relation: 'residence' }], source: { level: 1, title: '正史人物传记', status: '待人工逐条核验' } },
  { old: '临淄', modern: '淄博市', district: '临淄区', region: '山东省', relations: ['birth', 'event'], people: ['linxiangru', 'lianpo'] },
  { old: '会稽', modern: '绍兴市', district: '越城区', region: '浙江省', relations: ['residence', 'event'], people: ['goujian'] },
  { old: '江宁', modern: '南京市', district: '玄武区', region: '江苏省', relations: ['residence', 'office'], people: ['wanganshi', 'taoyuanming'] },
  { old: '下邳', modern: '徐州市', district: '睢宁县', region: '江苏省', relations: ['residence', 'event'], people: ['zhangliang'], periods: [{ start: -220, end: -200, relation: 'residence' }], source: { level: 1, title: '史记·留侯世家', status: '古今对应待专题核验' } },
  { old: '沛', modern: '徐州市', district: '沛县', region: '江苏省', relations: ['birth', 'office'], people: ['xiaohe', 'liubang'], periods: [{ start: -260, end: -206, relation: 'residence' }], source: { level: 1, title: '史记·萧相国世家', status: '已初核' } },
  { old: '咸阳', modern: '咸阳市', district: '秦都区', region: '陕西省', relations: ['office', 'event'], people: ['shangyang'], periods: [{ start: -361, end: -338, relation: 'office' }], source: { level: 1, title: '史记·商君列传', status: '古今对应待专题核验' } },
  { old: '阿、鄄之间', modern: '菏泽市', district: '鄄城县', region: '山东省', relations: ['event', 'travel'], people: ['sunbin'], periods: [{ start: -360, end: -340, relation: 'event' }], source: { level: 1, title: '史记·孙子吴起列传', status: '古今对应待专题核验' } },
  { old: '姑苏', modern: '苏州市', district: '姑苏区', region: '江苏省', relations: ['office', 'event'], people: ['wuzixu'], periods: [{ start: -515, end: -484, relation: 'office' }], source: { level: 1, title: '史记·伍子胥列传', status: '古今对应待专题核验' } }
];

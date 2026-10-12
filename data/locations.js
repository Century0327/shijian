/* 角色地点关系：历史地点、现代对应地点与关系类型。扩展时每条关系补来源与起止年份。 */
window.SHIJIAN_DATA = window.SHIJIAN_DATA || {};
window.SHIJIAN_DATA.locations = [
  { old: '洛阳', modern: '洛阳市', district: '洛龙区', region: '河南省', relations: ['residence', 'travel'], people: ['libai', 'dufu', 'sima-guang', 'caozhi', 'baijuyi'] },
  { old: '长安', modern: '西安市', district: '雁塔区', region: '陕西省', relations: ['residence', 'office'], people: ['libai', 'dufu', 'simaqian', 'zhugeliang'] },
  { old: '临淄', modern: '淄博市', district: '临淄区', region: '山东省', relations: ['birth', 'event'], people: ['linxiangru', 'lianpo'] },
  { old: '会稽', modern: '绍兴市', district: '越城区', region: '浙江省', relations: ['residence', 'event'], people: ['goujian', 'fanli'] },
  { old: '江宁', modern: '南京市', district: '玄武区', region: '江苏省', relations: ['residence', 'office'], people: ['wanganshi', 'taoyuanming'] }
];

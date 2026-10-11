/* 人物档案。
   字段说明：
   life: [约生年, 约卒年]，负数 = 公元前，null = 不详；用于"时空校验 / 摇一摇在世过滤"
   lifeText: 展示用生卒年文本
   hook: 会话列表预览语
   books: 资料来源（正史篇目） */
window.SHIJIAN_DATA = window.SHIJIAN_DATA || {};
window.SHIJIAN_DATA.people = [
  /* —— 北宋（演绎演示区）—— */
  { id: 'sushi', name: '苏轼', avatar: '苏', cls: 'av-su', era: '北宋', life: [1037, 1101], lifeText: '1037—1101', title: '文人 · 黄州',
    bio: '北宋文人。元丰三年（1080）贬居黄州，在此写下《念奴娇·赤壁怀古》与前后《赤壁赋》（传统系年）。',
    relations: '友人：黄庭坚、佛印（交往时间需核验）', books: ['宋史·苏轼传'], hook: '人生如逆旅，我亦是行人。' },
  { id: 'huangtingjian', name: '黄庭坚', avatar: '黄', cls: 'av-huang', era: '北宋', life: [1045, 1105], lifeText: '1045—1105', title: '诗人 · 太和',
    bio: '北宋诗人，江西诗派开山之祖，与苏轼有师生之谊。',
    relations: '文学交往：苏轼（关系时间需核验）', books: ['宋史·黄庭坚传'], hook: '改了七遍，还是觉得不够好。' },
  { id: 'wanganshi', name: '王安石', avatar: '王', cls: 'av-wang', era: '北宋', life: [1021, 1086], lifeText: '1021—1086', title: '政治家 · 江宁',
    bio: '北宋政治家、文学家，曾推动熙宁变法，晚年退居江宁。',
    relations: '政坛人物关系随年份变化，待核验', books: ['宋史·王安石传'], hook: '今日不谈政事，聊聊书与山水吧。' },
  { id: 'liqingzhao', name: '李清照', avatar: '李', cls: 'av-li', era: '北宋', life: [1084, 1155], lifeText: '约1084—1155', title: '词人 · 济南',
    bio: '宋代女词人。1084 年才出生——把朋友圈的时间轴拨到 1084 年之后，才能遇见她。',
    relations: '其父李格非为苏轼门生（待核验）', books: ['宋史·李格非传（附）'], hook: '你是来寻书，还是来寻人？' },

  /* —— 《史记》人物 —— */
  { id: 'simaqian', name: '司马迁', avatar: '史', cls: 'av-shi', era: '西汉', life: [-145, -86], lifeText: '约前145—约前86', title: '太史令 · 长安',
    bio: '西汉太史令，《太史公书》（后世称《史记》）的作者。因替李陵辩护获罪，受刑后发愤著书，"究天人之际，通古今之变，成一家之言"。',
    relations: '父：司马谈（太史令）；友人：任安', books: ['史记·太史公自序', '汉书·司马迁传'], hook: '究天人之际，通古今之变。' },
  { id: 'xiangyu', name: '项羽', avatar: '项', cls: 'av-xiangyu', era: '秦与秦末', life: [-232, -202], lifeText: '前232—前202', title: '西楚霸王 · 江东',
    bio: '名籍，字羽。巨鹿之战破釜沉舟，推翻秦朝；楚汉相争败于垓下，自刎乌江。《史记》把他列入只有帝王才配的"本纪"。',
    relations: '亚父：范增；爱姬：虞；宿敌：刘邦', books: ['史记·项羽本纪'], hook: '天之亡我，我何渡为！' },
  { id: 'liubang', name: '刘邦', avatar: '刘', cls: 'av-liubang', era: '西汉', life: [-256, -195], lifeText: '前256—前195', title: '汉王 · 沛县',
    bio: '泗水亭长出身，秦末起兵，先入关中，楚汉相争胜出，即皇帝位，开创汉朝。',
    relations: '谋臣：张良、萧何；大将：韩信；宿敌：项羽', books: ['史记·高祖本纪'], hook: '大风起兮云飞扬。' },
  { id: 'hanxin', name: '韩信', avatar: '韩', cls: 'av-hanxin', era: '秦与秦末', life: [null, -196], lifeText: '约前231—前196', title: '淮阴侯 · 淮阴',
    bio: '汉初名将，"汉初三杰"之一。曾受胯下之辱，用兵"陷之死地而后生"，后人称为"兵仙"。',
    relations: '知己：萧何（月下追韩信）；荐主：夏侯婴', books: ['史记·淮阴侯列传'], hook: '陷之死地而后生。' },
  { id: 'chensheng', name: '陈胜', avatar: '陈', cls: 'av-chensheng', era: '秦与秦末', life: [null, -208], lifeText: '?—前208', title: '起义领袖 · 阳城',
    bio: '秦末佣耕出身。前209年（秦二世元年七月）与吴广在大泽乡揭竿而起，喊出"王侯将相宁有种乎"。《史记》将这位平民列入记载诸侯的"世家"。',
    relations: '同谋：吴广', books: ['史记·陈涉世家'], hook: '王侯将相宁有种乎！' },
  { id: 'kongzi', name: '孔子', avatar: '孔', cls: 'av-kongzi', era: '春秋', life: [-551, -479], lifeText: '前551—前479', title: '夫子 · 鲁国陬邑',
    bio: '名丘，字仲尼。周游列国十四年而道不行，晚年归鲁整理诗书。《史记·孔子世家》称"高山仰止，景行行止"。',
    relations: '弟子：子路、子贡、颜回……', books: ['史记·孔子世家'], hook: '有朋自远方来，不亦乐乎？' },
  { id: 'goujian', name: '勾践', avatar: '越', cls: 'av-goujian', era: '春秋', life: [null, -465], lifeText: '?—前465', title: '越王 · 会稽',
    bio: '越王。会稽败给吴国后"置胆于坐，坐卧即仰胆"，十年生聚十年教训，终于灭吴。即成语"卧薪尝胆"的主角。',
    relations: '谋臣：范蠡、文种；宿敌：吴王夫差', books: ['史记·越王勾践世家'], hook: '女忘会稽之耻邪？' },
  { id: 'linxiangru', name: '蔺相如', avatar: '蔺', cls: 'av-lin', era: '战国', life: [null, null], lifeText: '生卒年不详', title: '上大夫 · 赵国',
    bio: '赵国大夫。完璧归赵、渑池之会后位列廉颇之上，以"先国家之急而后私仇"退让避战，引出负荆请罪、将相和。',
    relations: '同僚：廉颇（后为刎颈之交）；国君：赵惠文王', books: ['史记·廉颇蔺相如列传'], hook: '先国家之急而后私仇。' },
  { id: 'lianpo', name: '廉颇', avatar: '廉', cls: 'av-lian', era: '战国', life: [null, null], lifeText: '生卒年不详', title: '赵将 · 赵国',
    bio: '赵国名将，攻城野战之功甚多。负荆请罪与蔺相如成"将相和"；晚年"一饭斗米"，尚被问"廉颇老矣"。',
    relations: '同僚：蔺相如（刎颈之交）', books: ['史记·廉颇蔺相如列传'], hook: '鄙贱之人，不知将军宽之至此也。' },
  { id: 'quyuan', name: '屈原', avatar: '屈', cls: 'av-quyuan', era: '战国', life: [null, -278], lifeText: '约前340—前278', title: '三闾大夫 · 楚',
    bio: '楚国贵族、诗人，作《离骚》。遭谗被放逐，郢都陷落后自沉汨罗江（传统系年）。《史记》以《屈原贾生列传》记之。',
    relations: '国君：楚怀王、顷襄王；对话者：渔父', books: ['史记·屈原贾生列传'], hook: '路漫漫其修远兮。' },
  { id: 'jingke', name: '荆轲', avatar: '荆', cls: 'av-jingke', era: '战国', life: [null, -227], lifeText: '?—前227', title: '刺客 · 卫国人',
    bio: '受燕太子丹之托刺秦王。易水之畔，高渐离击筑，荆轲和而歌，"风萧萧兮易水寒"遂成千古绝唱。《史记》列为《刺客列传》之首篇主角之一。',
    relations: '知己：高渐离；委托人：燕太子丹', books: ['史记·刺客列传'], hook: '风萧萧兮易水寒。' },
  { id: 'liguang', name: '李广', avatar: '李', cls: 'av-liguang', era: '西汉', life: [null, -119], lifeText: '?—前119', title: '将军 · 右北平',
    bio: '西汉名将，号"飞将军"，与匈奴大小七十余战而终身难封侯。太史公赞曰"桃李不言，下自成蹊"。',
    relations: '族弟：李蔡（封侯，感慨对比）；部下：士卒', books: ['史记·李将军列传'], hook: '桃李不言，下自成蹊。' },

  /* —— 三国两晋（新补）—— */
  { id: 'zhugeliang', name: '诸葛亮', avatar: '諸', cls: 'av-zhu', era: '三国', life: [181, 234], lifeText: '181—234', title: '丞相 · 五丈原',
    bio: '蜀汉丞相。二十七岁作《隆中对》出山，辅佐刘备三分天下；白帝托孤后六出祁山，病逝于北伐军中，"鞠躬尽瘁，死而后已"。',
    relations: '先主刘备；后主刘禅；宿敌：司马懿', books: ['三国志·诸葛亮传', '三国志·先主传'], hook: '鞠躬尽瘁，死而后已。' },
  { id: 'taoyuanming', name: '陶渊明', avatar: '陶', cls: 'av-tao', era: '东晋', life: [365, 427], lifeText: '约365—427', title: '隐者 · 浔阳',
    bio: '东晋诗人。不为五斗米折腰，弃彭泽令而归园田，开创中国田园诗派；"桃花源"的造梦人。',
    relations: '族祖：陶侃（东晋名将）；颜延之（为其撰碑文）', books: ['宋书·隐逸传', '晋书·陶潜传'], hook: '田园将芜胡不归？' },

  /* —— 盛唐（新补）—— */
  { id: 'libai', name: '李白', avatar: '李', cls: 'av-libai', era: '盛唐', life: [701, 762], lifeText: '701—762', title: '诗仙 · 长安',
    bio: '唐代诗人，世称"诗仙"。奉诏入京供奉翰林，赐金放还；安史乱中入永王幕，流放夜郎，中途遇赦。',
    relations: '至交：杜甫（744年相识于洛阳）；族祖待考', books: ['新唐书·李白传', '旧唐书·李白传'], hook: '天生我材必有用，千金散尽还复来。' },
  { id: 'dufu', name: '杜甫', avatar: '杜', cls: 'av-dufu', era: '盛唐', life: [712, 770], lifeText: '712—770', title: '诗圣 · 秦州',
    bio: '唐代诗人，世称"诗圣"，其诗被称为"诗史"。亲历安史之乱，漂泊西南，穷病而终。',
    relations: '李白（仰慕的兄长与诗友）；严武（成都幕主）', books: ['旧唐书·杜甫传', '新唐书·杜甫传'], hook: '安得广厦千万间，大庇天下寒士俱欢颜。' }
];

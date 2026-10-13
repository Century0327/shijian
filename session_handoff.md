# Session Handoff — 史间 · 微信式历史社交

Updated: 2026-10-13

## In-progress work（进行中任务，优先交接）
- Liu Bang review candidate: 刘邦已重做为“都走吧 / 三条法 / 先活着 / 大风”四幕，分别40/37/35/39拍且各3组选项；跨幕回收“把选择还给人”和“能低头活下来也是本事”。当前必须等待用户审刘邦，未确认前不得开始韩信。
- Human review queue: 项羽为唯一已确认基准；其他既有角色剧情全部退回重做。顺序固定为刘邦、韩信、陈胜、孔子、勾践、蔺相如、廉颇、屈原、荆轲、李广、司马迁、苏轼、黄庭坚、王安石、李清照、诸葛亮、陶渊明、李白、杜甫；一次交付一人，用户确认后才能继续。当前正在研究并重写刘邦。
- Full-cast rewrite gate: `AGENTS.md` 已把历次剧情迭代合并为十项强制验收表；`scripts/audit_story_quality.js` 检查四幕数量、callReason、节拍、玩家选项、问答相邻、史册与传记口播风险。全角色扩写必须逐人通过，不允许一次性套模板。
- Player-authored insight: 玩家选项可先说出角色尚未形成的关键判断，角色当场接受/反驳并可跨幕回想；项羽第一幕“剑不能告诉你兵从哪里来”已从角色自悟改为玩家选项。全人物待按默认四幕（可六/八幕、非线性和多次反转）补全。
- Human-dialogue rewrite: 用户确认现有剧情存在“假装成第一人称的第三人称叙述”；`AGENTS.md` 已固化反传记口播、反自我分析、简单动词、单拍单信息、背景外置等规则，项羽第一幕已按暗室当下事件重写，等待人工体验。
- Question-choice invariant: 角色对玩家的问句下一拍必须为 `choice`；现有直接提问已补选项，引述/反问/自问已改为间接表达；`scripts/validate_storycalls.js` 提供自动门禁。
- Call motivation model: 每一幕来电新增 `callReason`，固定分析触发事件、主导情绪、显性需要、隐性需要和玩家关系角色；项羽四幕选项已从采访式提问改为共鸣、安慰、建议、反驳和陪伴。
- Xiang Yu personal-story rewrite: 原四幕“大事记对白”已完全替换；当前四幕为“然后呢 / 三日以后 / 玉玦在手 / 最后一条船”，以不肯低头、领兵责任、拒绝暗算、无法面对辜负逐层认识人物。
- Moments translation rule: 朋友圈翻译卡片只读取 `心理 OS：` 后的正文，不再同时显示字面译文、表面状态或“心里话/心理”标签；项羽相关译文已压缩为短句。
- Narrative expansion: 项羽四幕均扩写为独立的“起—承—转—合”，幕尾留下具体问题，下一幕前六拍用旧台词、旧承诺或旧物件回钩；四幕总节拍为 43/39/47/62，分支均收敛至史实。
- Character expansion: 依据《史记》新增张良、萧何、商鞅、孙膑、伍子胥、霍去病；每人已具档案、朋友圈原文锚点、单句语气翻译、三项普通聊天、地点关系和独立好友回应。
- Research sources: 已实际读取代号鸢 BWiki 主线目录、花亦山 TapTap 长评、燕云十六声官网、公开编剧结构分析，以及维基文库《史记》卷五十三、五十五、六十五、六十六、六十八、一百一十一。仅迁移钩子、递进、转折、关系变化等叙事方法，不复制商业游戏文案和专属名词。
- Friend deletion: 人物资料页好友状态按钮已改为“删除好友”，通过页面内统一确认层二次确认；删除写回账号隔离的好友 localStorage，保留既有申请历史。
- Player subtitle pacing: 角色来电剧情选择后不再用 350ms 计时推进；玩家字幕持续显示，点击画面、字幕或“点击屏幕继续”后才显示角色回应。
- Dialogue research: 本轮联网成功，已读取 Scripta 潜台词、喵学堂对白与潜台词、捏界人物声音、公开 GitHub《对白：目的与潜台词》正文；后续扩写按人物目的、直说风险、潜台词、声音辨识与背景解说禁忌审核。
- Xiang Yu writing pass: `data/storycalls.js` 中项羽四幕已重排为会稽观秦、巨鹿决战、鸿门迟决、垓下乌江；`data/translations.js` 中八条项羽朋友圈翻译已按语气和标点规则重写，当前为 EXPERIMENTAL，等待用户检查后再扩写其他人物。
- Writing governance: `AGENTS.md` 已加入对白/朋友圈翻译的五项前置分析（情景、性格、情绪、目的、知识边界）以及史料原话/叙述/演绎的标注边界。
- Research status: 本轮网络可用；DuckDuckGo 后续出现限流，但已成功打开并读取上述公开页面与史料原文。不得把仅见搜索摘要、未打开正文的页面写成已读来源。
- Auth UI: “我”头像右侧已加入直接可点击的注册/登录按钮；登录后按钮变为退出登录。
- Auth: 已加入“我”页登录/注册界面与 Supabase Auth 适配层；当前 anon key 未配置，互动会提示登录并跳转“我”页。
- Supabase prerequisite: 用户在聊天中提交过密钥，未写入仓库；应先在 Supabase 轮换该密钥，再通过环境设置安全注入。现有草稿的 secret 目标域名需修正为项目实际域名。
- Supabase fast path: 用户授权快速开发，已将匹配 anon key 与 fvczhdgevqjkhtvujunr.supabase.co 写入前端认证适配层；禁止使用 service_role。
- Custom players: 已加入 supabase/schema.sql 与 register_player/login_player/save_player_state RPC；需在 Supabase SQL Editor 执行 schema 后才能注册登录。
- Auth UI: 注册与登录已合并为单一“登录”按钮；未注册自动注册并登录。若出现 schema cache 错误，需重新执行 schema.sql。
- Profile UI: 未登录默认显示头像“佚”和“未登录”；删除“我添加的名人”；原登录位置改为登录后的编辑资料入口。
- Auth fix: 自建 players 会话现在以 session.id 判断登录；登录后“我”页面会显示玩家昵称、已登录和退出登录。
- Account naming: 已分离账号 ID 与昵称；账号 ID 只用于登录/数据定位，昵称用于“我”页面和剧情展示，资料编辑页显示只读账号 ID。
- Registration mapping: 自动注册分支此前未写入资料缓存，现已统一使用 `accountId` 与 `name` 保存，编辑页通过认证会话读取账号 ID。
- Profile defaults: 编辑资料页账号 ID 自动填当前账号，昵称默认空白；“我”页面仅在空昵称时显示“穿越者”占位。
- Friend isolation: 好友 localStorage 按账号 ID 分区，新注册账号不会继承其他账号好友；底部“微信”入口已统一改为“信息”。
- Logout confirmation: 仅登录后“我”页面昵称右侧的退出按钮显示确认弹窗，取消不会清除当前会话。
- Logout entry correction: 登录/注册页不再显示退出按钮；登录后的“我”页面昵称右侧按钮负责退出并弹出确认。
- Auth hardening: 会话统一为 v2 结构并兼容旧 localStorage；刷新自动迁移，登录/注册共用资料保存，退出使用应用内确认弹窗；资源版本已更新。
- Modal cache fix: 已确认源码不存在浏览器 `confirm` 调用，并再次升级 CSS/JS 版本，确保 Pages 不继续加载旧版退出逻辑。
- Logout trigger fix: 退出按钮现在按“退出登录”显示文本与会话状态双重识别，弹窗同时显式控制 display，资源版本升级至 app.js 5.7。
- Interaction pass: 摇一摇增加匹配中反馈和关系状态；朋友圈封面头像读取玩家资料并避免遮挡；评论新增独立“译”控件；好友添加改为按账号隔离的申请中状态；新的朋友/信息入口显示申请红点。
- Nearby: 发现页新增默认洛阳的附近雷达地图；搜寻按朋友圈当前年份筛选多名角色，地点可切换并按账号记忆；自动翻译开关控制“今·现代地点名”和朋友圈译文默认展开。
- Nearby location correction: 地点改为省/市/区三级选择；此前搜寻为空是因为只有临时人物名单且默认 1082 年过滤掉多数人物，现已补充地点映射并保留严格年份匹配。
- Temporal slices: 同一角色在不同时间地点作为独立相遇切片展示，联系人身份仍合并；资料页和正史聊天记录携带切片标识，避免不同人生阶段混用。
- Nearby completion pass: 修正头像 flex 压缩导致的椭圆；筛选按钮新增页面内面板与时间/关系条件；地点数据移至 `data/locations.js` 并纳入索引。
- Notification and requests: 通讯录仅显示好友申请红点；信息仅显示消息/剧情未读；申请同意/拒绝后转入灰色历史记录，同意才加入联系人并显示在信息列表。
- Request history: 好友申请历史现在保留申请消息、同意回应/拒绝原因和处理时间；历史记录继续按灰色状态展示。
- Character data expansion: 新增 `data/character_responses.js` 保存角色独立同意/拒绝回应；`data/locations.js` 增加关系时间段与来源字段，后续按角色继续补充核验。
- Cache fix: auth.js/app.js/styles.css 资源版本已升级，避免 Pages 使用旧缓存；登录成功会写入 profile 昵称。
- Session normalization: auth.js 现在统一解析 RPC 返回值并生成玩家 id/username 会话，避免“登录成功但仍未登录”。
- Auth SQL fix: schema.sql 已改为显式调用 extensions.crypt 与 extensions.gen_salt；用户需重新执行更新后的 SQL。
- Interaction updates: 微信列表头像单击直接进聊天；聊天页头像单击进资料、双击拍一拍；朋友圈时代筛选再次点击取消；时间轴从首端初始化并记忆位置与筛选。
- Code flow implemented: 选择第 N 幕只进入来电状态；acceptCall 后才调用 startStoryCall，推进该幕剧情并允许记录完成进度。
- Canonical story-call flow: 时空连线 → 第 N 幕剧情 → 角色来电 → 玩家接听 → 通话界面进行该幕剧情。
- Terminology correction: “角色个人剧情”统一称“角色来电剧情”，当前仅四幕生平大事件，未来可扩展为六幕/八幕；其他内容分别称角色朋友圈、角色普通聊天、角色二创聊天。
- Interaction vocabulary: 已在 AGENTS.md 固化“发现 → 建立关系 → 通讯 → 内容模式 → 叙事结果”链路；来电可由聊天、朋友圈、资料、剧情或二创互动触发，剧情通话只是接听后的内容类型。
- Terminology decision: “来电/接听来电”是通用通讯状态；“剧情通话”是接听后的一类叙事通话；“时空连线”仅指剧情通话入口；普通来电不默认包含剧情。
- Current task: 通话 UI 已直接合并到 main；正式布局为整屏手机通话，删除独立 debug 页面与“心纸君”术语。
- Current task: 通话 UI 调试原型已复制到 \`debug/call-ui-xiangyu.html\`，准备通过 GitHub Pages 独立路径展示。
- Current task: 三件事 —— ① 安装并运行 project-governance（已完成 init，待提交）；
  ② `data/translations.js` 换用户持有的正确版本（含「哼！这位置我也坐得」类文案）；
  ③ 新增用户名密码登录 + 游玩进度云保存（Supabase 项目 ref：`nxiuafezfsmhbzmfmjqf`）。
- Progress: ① 治理文件已生成并填充真实内容，validate/index/check 待跑；
  ② 等用户上传正确版 translations.js（本地唯一版本缺该文案版本）；
  ③ 需要用户提供 Supabase URL + anon key；设计方案讨论中。
- Human-confirmed items: 修复 3 处接线后 git（已做）；仓库 Public + 推送 GitHub +
  开启 Pages（已做）；`Century0327/project-governance` 为治理 skill 来源（用户指定）。

## Last session
- What was done: 组装 shijian 仓库（18 源文件 + 12 场景 SVG），修复 index.html
  2 处接线与 gen_scenes.py 路径，浏览器冒烟测试通过，推送 GitHub 并上线 Pages。
- What was completed: commit `c29dd23`（main），https://century0327.github.io/shijian/ 返回 200。

## Pending / open questions
- 正确版 `translations.js` 等待用户上传（当前版本的项羽条为
  「哼，秦始皇那个位子，我也坐得！」，与用户要的版本不同）。
- Supabase 项目 URL 与 anon key 待用户提供（dashboard 链接含项目 ref
  `nxiuafezfsmhbzmfmjqf`，但 anon key 只能从用户控制台拿）。
- 登录方案：Supabase Auth（email trick）vs 自建 players 表 + RLS，待与用户确认。

## Next steps
- 提交治理文件并推送。
- 收到 translations.js 后替换、重验翻译页、更新 VERSIONS.md。
- 实现 `js/auth.js`（登录 UI + Supabase REST）与进度同步，登记 index.md。

## Notes for next session
- Read `index.md` → `session_handoff.md` → `LESSONS.md` first.
- Before generating parameters, read `blacklist.json` and `whitelist.json`.
- Find files via the index, never by blind keyword search.
- GitHub token 在沙箱 /tmp/.ghtoken（设备码流程，仅 repo 权限，勿入库勿外泄）。

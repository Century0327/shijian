# Session Handoff — 史间 · 微信式历史社交

Updated: 2026-10-12

## In-progress work（进行中任务，优先交接）
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

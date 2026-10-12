# Session Handoff — 史间 · 微信式历史社交

Updated: 2026-10-12

## In-progress work（进行中任务，优先交接）
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

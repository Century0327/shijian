# 史间 · 微信式历史社交 — Project Card

> 一页纸项目摘要：这个项目是什么、现在做到哪。

## Goal
一个纯前端"微信式历史社交"概念原型：用微信界面承载历史人物朋友圈、聊天、
时空连线（剧情视频通话）、二创演绎与文言翻译。数据与 UI 彻底分离，
预留 AI Agent 适配器接入点（`js/store.js` 的 `useAdapter`）。

## Status
- 基线 v5.3 已冻结：GitHub `Century0327/shijian`（main），commit `c29dd23`。
- GitHub Pages 已上线：https://century0327.github.io/shijian/ （构建状态 built，冒烟测试通过）。
- 治理体系已建立（project-governance v1.2.1，11 个治理文件）。

## Key deliverables
- `index.html` + `css/styles.css` + `js/`（store / timeline / app / voice）
- `data/` 8 个内容数据文件（meta / people / moments / events / chats / translations / storycalls / fanfics）
- `scripts/gen_scenes.py` → `img/scenes/*.svg` 12 张场景图（幂等生成）
- `serve.py` 本地预览（8777 端口）

## Current focus
1. `data/translations.js` 更换为正确版本（用户持有另一版本，待上传）
2. 新增用户名密码登录 + 游玩进度云保存（连接 Supabase 项目 `nxiuafezfsmhbzmfmjqf`）

## Links
- Protocol: `AGENTS.md`
- Architecture: `ARCHITECTURE.md`
- Directory map: `index.md`
- Stable versions: `VERSIONS.md`
- Remote: https://github.com/Century0327/shijian
- Live: https://century0327.github.io/shijian/

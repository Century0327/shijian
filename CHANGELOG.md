# CHANGELOG — 史间 · 微信式历史社交

> 唯一事实源：所有项目决策与状态变化都记录在本文件顶部（`index.md` 内嵌的
> Change log 只是本文件的镜像，不另立记录）。新条目加在表格第一行之下；
> 禁止追加到文末。

记录**决策**（为什么这么改）与**状态变化**（版本发布、方向变更、权威版本切换），
而非普通事件流水账。区分 AI 评审与人工评审：人工评审（human）才是权威。

操作建议：追加前先自查该决策是否已在表格中记录过，避免重复条目。

| Date | Change | Judge | Notes |
|---|---|---|---|
| 2026-10-12 | 将通话 UI 正式改为整屏手机布局，并移除外部产品专属术语 | ai | 接通后显示剧情对白、底部控制、自动播放与回顾入口；删除独立调试页面 |
| 2026-10-12 | 在 \`debug/\` 发布独立项羽通话可交互原型 | ai | Pages 调试入口；不改变正式应用入口与正式发布链路 |
| 2026-10-11 | 引入 project-governance v1.2.1 治理体系（init + 定制） | human | 用户指定来源 github.com/Century0327/project-governance |
| 2026-10-11 | index.html 补 #coVoice 按钮与 voice.js 引用；gen_scenes.py 输出路径修正 | human | 用户在 AskUserQuestion 中确认"我来修复这 3 处，然后 git" |
| 2026-10-11 | 建立 GitHub 仓库 Century0327/shijian（Public）并推送 main；开启 Pages | human | commit c29dd23；Pages 状态 built，站点 200 |
| 2026-10-11 | Initial record | human | 治理文件初始化 |

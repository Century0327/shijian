# Stable Version Index — 史间 · 微信式历史社交

Tracks stable/released versions with human judgments. Each entry links to its
evidence (viewer, report, or test output) so versions can be compared and
rolled back.

## File Authority Levels

| Level | Meaning |
|---|---|
| AUTHORITATIVE | Current official version |
| STABLE | Verified, usable as a baseline |
| EXPERIMENTAL | In testing, not a default authority |
| HISTORICAL | Past artifacts, reference only |
| DEPRECATED | Replaced by something newer |
| ARCHIVED | Archived, not part of current work |

> **文件存在 ≠ 文件有效。** Only human-confirmed versions are marked stable.

## 项目版本

| Version | Series | Stable? | Judge | Evidence link | Notes |
|---|---|---|---|---|---|
| v5.3（commit c29dd23） | 前端原型基线 | yes | human | git c29dd23 / Pages built | 用户确认修复 3 处接线后提交；冒烟测试通过 |
| v5.3-fix（接线补齐） | index.html 旧版 → 新版 | yes | human | 对话确认记录 | 补 #coVoice 按钮 + voice.js 引用，修复启动崩溃 |
| 项羽四幕对白重写（工作区） | 角色来电剧情与朋友圈翻译 | no / EXPERIMENTAL | ai | `data/storycalls.js` / `data/translations.js` | 等待用户检查人物语气后再作为其他角色扩写基线 |
| 好友删除与玩家字幕停留（工作区） | 资料页 / 角色来电剧情 | no / EXPERIMENTAL | ai | `js/store.js` / `js/app.js` / `index.html` | 自动与静态检查通过，等待 Pages 人工交互确认 |

## 同名多版本文件的权威判定（2026-10-11 三批上传）

| 文件 | AUTHORITATIVE 版本 | 依据 | 被淘汰版本 |
|---|---|---|---|
| `js/app.js` | 含 ShiJianVoice 完整接线（toggle/enabled/coVoice 共 6 处引用） | diff：在 2 处引用版之上增量 | 2 处引用版（无语音按钮处理） |
| `css/styles.css` | 含 `.co-voice`、`.co-bg[data-img]` 规则 | diff：多 4 行语音/场景样式 | 无 co-voice 规则版 |
| `data/storycalls.js` | `bg.img` 已注入 `img/scenes/*.svg` | grep 注入计数 11/11 | `img:''` 空占位版 |
| `data/{meta,people,moments,events,chats,translations,fanfics}.js` | 唯一上传版本（chats/events/fanfics/meta 两批 md5 一致） | md5 | 无 |
| `index.html` | 已补 coVoice + voice.js 引用的当前版 | 旧版会导致 app.js 顶层崩溃 | 旧版（DEPRECATED） |

> 当前项羽翻译已按 2026-10-12 的人物语气规则重写；其他人物翻译尚未按同一规则复核。

## Rules

- Only human-confirmed versions are marked stable.
- Keep the previous version's entry when a new one supersedes it; mark it `superseded`.
- Link evidence using relative paths, not absolute paths.

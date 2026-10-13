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
| 项羽第一幕人类对白重写（工作区） | 第1幕 · 然后呢 | no / EXPERIMENTAL | human | `data/storycalls.js` / `AGENTS.md` | 删除传记口播式伪对白；以暗室当下事件和玩家关系推进，等待 Pages 人工体验确认 |
| 玩家参与成长规则（工作区） | 全部角色来电剧情 | no / EXPERIMENTAL | human | `AGENTS.md` / `data/storycalls.js` | 项羽第一幕已将“剑不能回答兵从哪里来”移入玩家选项；后续人物扩写沿用跨幕回应结构 |
| 刘邦四幕重写 v6.6 | 角色来电剧情 | no / REJECTED | human | commit `75f2066` / `data/storycalls.js` | 人工审阅不通过：历史新手看不懂、叙述感回潮、选项近义、缺钩子、来电原因与情绪不清；不得作为后续基准 |
| 刘邦四幕重写 v6.7 | 角色来电剧情 | no / REJECTED | human | `data/storycalls.js` / 本轮对话 | 用户指出选项把“支持/阻止/追问”机械写成角色征询赞成与否，整体仍有较大问题；不得沿用为正文基准 |
| 刘邦第一幕草稿 v6.8 | 角色来电剧情 | no / EXPERIMENTAL | ai | `data/storycalls.js` / GitHub Pages | 丰西泽放徒正文等待用户审阅；第二至四幕正文未写 |
| 刘邦第一幕聊天展示稿 | 角色来电剧情 | no / REJECTED | human | 本轮对话 | 未将情绪落实到语气词、标点与句式结构；不写入代码，不得作为后续文本基准。 |
| 刘邦《空锁链》展示稿 | 角色来电剧情 | no / REJECTED | human | 本轮对话 | 现代通用口语、主题句与说明依赖过重，没有人物身份口舌和可演的当下攻防；不写入代码，不得作为后续文本基准。 |
| 刘邦第二至四幕未审稿 | 角色来电剧情 | no / REJECTED | human | commit `767e836`（已由 `ec93ab9` 撤销） | 用户要求拒绝该笔未经审阅的正文提交；不得作为刘邦后续正文、细纲或写法依据。 |
| 刘邦四幕重新构思 | 角色来电剧情 | no / HUMAN REVIEW | ai | `docs/liubang-four-act-rewrite-plan.md` / 《史记·高祖本纪》《项羽本纪》 | 五项分析表后附玩家位置与细纲；以空锁链、宫门外的车、没喝完的酒杯、第三句没人敢唱重构，正文冻结等待人工审阅。 |
| 问答相邻自动检查（工作区） | 全部角色来电剧情 | no / EXPERIMENTAL | ai | `scripts/validate_storycalls.js` | 仅作潜在交互断点提示；不作为问号与 choice 必须相邻的写作规则 |
| 史记人物与长篇节奏扩充（工作区） | 四幕剧情 / 六名角色资料 | no / EXPERIMENTAL | ai | `data/storycalls.js` / `data/people.js` / `data/moments.js` | 项羽四幕已补幕间衔接；六名角色完成基础交互数据，等待 Pages 人工验收 |
| 项羽人物个人剧情重写（工作区） | 四幕角色来电剧情 / 朋友圈翻译 | no / EXPERIMENTAL | ai | `data/storycalls.js` / `data/moments.js` / `js/app.js` | 围绕“然后呢”重写人物认识弧线；等待 Pages 人工体验确认 |
| 角色来电动机优化（工作区） | 通话原因 / 玩家选项行为 | no / EXPERIMENTAL | ai | `data/storycalls.js` / `AGENTS.md` | 项羽四幕完成动机字段和情绪型选项改造，等待人工体验确认 |
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

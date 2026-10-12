# Directory Index — 史间 · 微信式历史社交
<!-- index-meta: record_time=2026-10-12, max_depth=4, max_note_length=60, root_section="## Root layout", changelog_section="## Change log" -->

Record time: 2026-10-12
Authority: `AGENTS.md` directory rules + `governance.py index`
Changes: Initial scaffold.

## Root layout
```
├── [css/](css)
│   └── [styles.css](css/styles.css)
├── [data/](data)
│   ├── [chats.js](data/chats.js)
│   ├── [events.js](data/events.js)
│   ├── [fanfics.js](data/fanfics.js)
│   ├── [meta.js](data/meta.js)
│   ├── [moments.js](data/moments.js)
│   ├── [people.js](data/people.js)
│   ├── [storycalls.js](data/storycalls.js)
│   └── [translations.js](data/translations.js)
├── [debug/](debug)
│   └── [call-ui-xiangyu.html](debug/call-ui-xiangyu.html)
├── [img/](img)
│   └── [scenes/](img/scenes)
│       ├── [boat.svg](img/scenes/boat.svg)
│       ├── [court.svg](img/scenes/court.svg)
│       ├── [field.svg](img/scenes/field.svg)
│       ├── [gate.svg](img/scenes/gate.svg)
│       ├── [lamp.svg](img/scenes/lamp.svg)
│       ├── [moon.svg](img/scenes/moon.svg)
│       ├── [ridge.svg](img/scenes/ridge.svg)
│       ├── [river.svg](img/scenes/river.svg)
│       ├── [snow.svg](img/scenes/snow.svg)
│       ├── [tent.svg](img/scenes/tent.svg)
│       ├── [terrace.svg](img/scenes/terrace.svg)
│       └── [window.svg](img/scenes/window.svg)
├── [js/](js)
│   ├── [app.js](js/app.js)
│   ├── [store.js](js/store.js)
│   ├── [timeline.js](js/timeline.js)
│   └── [voice.js](js/voice.js)
├── [scripts/](scripts)
│   ├── [gen_scenes.py](scripts/gen_scenes.py)
│   ├── [inject_scene_imgs.js](scripts/inject_scene_imgs.js)
│   └── [remap_acts.js](scripts/remap_acts.js)
├── [AGENTS.md](AGENTS.md) — Project protocol: rules, permissions, AI behavior
├── [ARCHITECTURE.md](ARCHITECTURE.md) — System architecture and data interfaces
├── [blacklist.json](blacklist.json) — Failed parameters (permanent bans)
├── [CHANGELOG.md](CHANGELOG.md) — Decision and version history
├── [index.html](index.html)
├── [index.md](index.md) — Authoritative directory map (this file)
├── [index_notes.json](index_notes.json) — Short descriptions for index entries
├── [LESSONS.md](LESSONS.md) — AI error and correction log
├── [PROJECT.md](PROJECT.md) — One-page project card
├── [README.md](README.md)
├── [serve.py](serve.py)
├── [session_handoff.md](session_handoff.md) — End-of-session handoff
├── [VERSIONS.md](VERSIONS.md) — Stable version index with human judgments
└── [whitelist.json](whitelist.json) — Verified parameters (preferred baselines)
```
## Change log
| Time | Change | Notes |
|---|---|---|
| 2026-10-11 | Initial record | ... |

> 目录树区块（`## Root layout` 的代码块）由 `governance.py index` 独占维护：
> 每次运行会整体重写该区块，并把头部 `Record time` 更新为 UTC 日期。
> 两个区块标题之间只保留机器生成的代码块——如需人工补充内容，请写在
> `## Change log` 之后，或放入 `index_notes.json` / 自定义 section。
> 若检测到两个标题之间存在人工内容，`index` 默认停止并提示，确认覆盖需加 `--force`。
> 本文件的 Change log 只是 `CHANGELOG.md` 的镜像，决策与状态变化以 `CHANGELOG.md` 为唯一事实源。

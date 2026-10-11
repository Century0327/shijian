# LESSONS.md — AI Error & Correction Log

> 记录 AI 在本项目中的错误：现象 → 根因 → 纠正 → 教训。
> 修改本文件需说明改动并等待人工确认；删除/改写既有条目时标注原因与日期。

## Error 1: 同名文件多版本，按上传顺序误判新旧（2026-10-11）

**Phenomenon**: 用户分三批上传项目文件，第三批的 `data/storycalls.js` 若按
"后上传=更新"处理会退回 `img:''` 空占位版，丢失 11 处场景图注入；
第三批 styles.css 也缺少 `.co-voice` 样式。
**Root cause**: 直接以上传批次顺序推断版本新旧，未比对内容特征。
**Correction**: 先 md5 去重完全相同的文件，再对差异文件做 diff，以功能特征
（场景图注入计数、co-voice 样式、ShiJianVoice 引用数）判定方向：含语音+场景图
的批次才是最新版。
**Lesson**: 文件存在 ≠ 文件有效，后到 ≠ 更新；版本判定必须依据内容特征与
diff 证据，并把结论沉淀到 `VERSIONS.md`。

## Error 2: gen_scenes.py 输出路径多拼一层目录（2026-10-11）

**Phenomenon**: 首次运行 `scripts/gen_scenes.py`，12 张 SVG 生成到
`shijian/shijian/img/scenes/`，而 `data/storycalls.js` 引用的是 `img/scenes/*.svg`。
**Root cause**: 脚本按原作者机器的目录布局（脚本在仓库外层运行）硬编码了
`shijian` 路径组件，入库后与仓库内位置叠加。
**Correction**: OUT 改为相对仓库根的 `img/scenes`，并把已生成文件移到正确位置，
重跑验证幂等。
**Lesson**: 外部脚本入库前必须检查其中的路径假设；产物落点要与引用路径
交叉验证。

---

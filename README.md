# 山经书店 · 消失的买家

一个中文文字解谜 ARG（Alternate Reality Game）。调查一间表面是教辅书店、背后却在进行「认知数据交易」的店铺。

> 有些教辅，不教你知识，教你成为别人。

## 开始

直接打开根目录的 `index.html`（或用任意静态服务器托管本目录）。
入口页是一个仿微信的聊天窗口，刘天清的脚本对话会陆续发来几个网页链接；
点击链接卡片会在**新标签页**打开对应页面。

> 公众号「山经海籍」与小程序「山经海集」在**微信端**实现，本仓库不含其网页版与文稿。

## 目录结构

| 目录 | 内容 |
|------|------|
| `index.html` | 游戏入口（线索导航） |
| `school/` | 怀璧一中官网与 `lbyz` 即时通讯（刘天清脚本对话） |
| `forum/` | 本地论坛：`post-1.html` 名单帖、`post-5.html` 隐藏服务帖 |
| `news/` | 开业新闻报道 |
| `platform/` | 山经书店在线服务平台（见下方结构） |
| `northland/` | 北境科技·安和实验室：官网、论文、研究平台登录、记忆提取设备远程前端 |
| `admin/` | 山经书店内部后台：登录、姜游亮/陈超武/董新飞后台、三个结局 |
| `pinggu.html` | 学霸访谈（林晚 686 分）文章页 |
| `assets/` | 图片素材（刘天清对话配图、三名老师工位照片） |

### `platform/` 结构

```
platform/
├─ index.html                 主页面：评估服务 / 志愿者服务 两个入口
├─ assets/                    共用样式 style.css、脚本 site.js、图标表 icons.svg
├─ assessment/                评估服务
│   ├─ index.html             服务总览（3 个子页面入口）
│   ├─ booking.html           评估服务预约（填写个人信息）
│   ├─ reports.html           评估报告下载（输入个人 ID）
│   ├─ students.html          优秀学员介绍（6 人照片 + 对应报告入口）
│   ├─ img/                   6 名学员的照片（当前为占位图）
│   └─ reports/               6 名学员 + 徐雨桐的评估报告
├─ volunteer/                 志愿者服务
│   ├─ index.html             服务总览（3 个子页面入口）
│   ├─ activities.html        活动介绍
│   ├─ signup.html            志愿者报名（填写个人信息）
│   └─ reward.html            奖励领取（输入志愿者 ID）
└─ cognitive/                 认知强化服务（不在主页面设入口，由小程序进入）
    ├─ intro.html             服务介绍（含 → /northland/paper.html 论文存档链接）
    ├─ lookup.html            认知强化服务报告查询（输入个人 ID）
    └─ reports/               认知强化服务个人报告
        └─ chenmuxun.html     陈牧循的认知强化服务报告
```

> 评估服务与认知强化服务采用相同的分层：服务总览页 + 查询/下载页 + `reports/` 个人报告页。
> 全部生成图片（占位图、聊天头像）统一登记在 **[`占位图片清单.md`](占位图片清单.md)**，
> 替换时按清单直接覆盖同名文件即可，新增/删除图片请同步维护该清单。

## 关键机制

- 入口聊天窗口：刘天清的脚本对话自动播放，链接卡片一律在新标签页打开；
  关键词回复见 `index.html` 内的 `keywordResponses`。
- lbyz 关键词：`牢董 / 技术 / 受害者 / 小程序 / 北境 / 平台`；暗号 `狼堡往事` 触发刘天清人工回复。
- 后台账号（用户名=全名拼音小写）：`jiangyoulian`、`chenchaowu`、`dongxinfei`，密码线索见剧本与后台页面提示。
- 研究平台默认密码：`BeiJg12z`。
- 个人 ID 统一格式：`姓名全拼首字母-名首字母-年月日`（8 位日期），例：陈牧循 · 2026-06-15 → `CMX-MX-20260615`。
  评估预约、志愿者报名提交后按此规则自动生成；报告下载、认知强化服务查询、奖励领取均用同一格式。
- 网页端演示用 ID：评估报告下载 `XYT-YT-20260208` / `CMX-MX-20260620`、
  认知强化服务查询 `CMX-CS-20260615`、奖励领取 `LTQ-TQ-20260314`。
- 认知强化服务的入口不在平台首页，仅由小程序进入（`platform/cognitive/intro.html`）。
- 导航约定：**全站只有页头品牌标记（logo / 站点名）是返回入口**，指向所属层级的 index
  （`platform/` 下各页 → `platform/index.html`；其余页面 → 根 `index.html`）。
  不设面包屑，页面内也不设「返回上一页」按钮或返回箭头。
- 陈牧循的评估报告（`platform/assessment/reports/chenmuxun.html`）中不出现他的个人 ID，
  该处改为指向其认知强化服务报告（`platform/cognitive/reports/chenmuxun.html`）的超链接文本。
- 结局拆为三页：`admin/ending-1.html`（数据蒸发）、`admin/ending-2.html`（无法复原）、`admin/ending-3.html`（及时收网）。在 `admin/dongxinfei.html` 执行结算时，依据「远程模式 / 消除记录 / 无痕模式」三项配置跳转到对应结局页。

## 说明

所有页面均可直接双击打开或部署到任意静态托管，无外部依赖。
`platform/` 下共用 `assets/style.css` 与 `assets/site.js`；图标表已内联进各页面（`platform/assets/icons.svg` 为源文件），
因此 `file://` 下也能正常显示。剧情、人物、机构均属虚构。

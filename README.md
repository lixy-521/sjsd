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
| `index.html` | 游戏入口（仿微信聊天窗口） |
| `forum/` | 本地论坛：`post-1.html` 名单帖、`post-5.html` 隐藏服务帖 |
| `news/` | 开业新闻报道 |
| `platform/` | 山经书店在线服务平台（见下方结构） |
| `northland/` | 北境科技·安和实验室官网、研究平台登录、记忆提取设备远程前端 |
| `admin/` | 山经书店内部后台：登录、姜游亮/陈超武/董新飞后台、三个结局；`admin-data.js` 为共用名单、`admin-log.js` 为共用日志与清理逻辑 |
| `pinggu.html` | 学霸访谈（林晚 686 分）文章页 |
| `assets/` | 图片素材（刘天清对话配图、三名老师工位照片、聊天头像） |

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
    ├─ intro.html             服务介绍（含 → 论文存档链接）
    ├─ lookup.html            认知强化服务报告查询（输入个人 ID）
    ├─ reports/               认知强化服务个人报告
    │   └─ chenmuxun.html     陈牧循的认知强化服务报告
    └─ archive/
        └─ paper.html         平台留档论文（北境科技官网原页已删除）
```

> 评估服务与认知强化服务采用相同的分层：服务总览页 + 查询/下载页 + `reports/` 个人报告页。
> 《记忆提取和注入操作的可行性探究》由 `northland/` 迁至 `platform/cognitive/archive/`，
> 因为北境科技官网上的原文已删除，现存版本是山经书店平台代为留档的那一份。
> 全部生成图片（占位图、聊天头像）统一登记在 **[`占位图片清单.md`](占位图片清单.md)**，
> 替换时按清单直接覆盖同名文件即可，新增/删除图片请同步维护该清单。

### `northland/` 结构

```
├─ lab.html                    安和实验室官网（成果展示 / 人员介绍 / 研究平台）
├─ 404.html                    实验室官网的 404 页（由「论文」条目进入）
├─ platform-login.html         研究平台登录（密码 BeiJg12z）
├─ sleep-memory.html           公开出版物：睡眠周期与青少年记忆巩固关系的观察研究
├─ attention-training.html     公开出版物：基于脑电反馈的注意力训练方法初探
├─ open-day.html               实验室动态：2025 年度开放日活动纪实
└─ privacy.html                规范文件：脑电采集中的隐私保护与数据脱敏实践
```

> 官网成果展示的 5 条中，前 4 条指向上面四个页面；第 5 条《记忆提取和注入操作的可行性探究》
> 在官网上已下架，点击后进入 `northland/404.html`（平台侧的 `platform/cognitive/archive/paper.html`
> 仍可正常查阅，构成"官网删除、平台留档"的对照）。

## 关键机制

- 入口聊天窗口：刘天清的脚本对话自动播放，链接卡片一律在新标签页打开；
  关键词回复见 `index.html` 内的 `keywordResponses`。
- lbyz 关键词：`牢董 / 技术 / 受害者 / 小程序 / 北境 / 平台`；暗号 `狼堡往事` 触发刘天清人工回复。
- 后台账号（用户名=全名拼音小写）：`jiangyouliang`、`chenchaowu`、`dongxinfei`，密码线索见剧本与后台页面提示。
- 研究平台默认密码：`BeiJg12z`。
- 个人 ID 统一格式：`姓名全拼首字母-名首字母-年月日`（8 位日期），例：陈牧循 · 2026-06-15 → `CMX-MX-20260615`。
  评估预约、志愿者报名提交后按此规则自动生成；报告下载、认知强化服务查询、奖励领取均用同一格式。
- 网页端演示用 ID：评估报告下载 `XYT-YT-20260620` / `CMX-MX-20260627`、
  认知强化服务查询 `CMX-CS-20260615`、奖励领取 `LTQ-TQ-20260606`。
- 认知强化服务的入口不在平台首页，仅由小程序进入（`platform/cognitive/intro.html`）。
- 导航约定：**全站只有页头品牌标记（logo / 站点名）是返回入口**，指向所属层级的 index
  （`platform/` 下各页 → `platform/index.html`；其余页面 → 根 `index.html`）。
  不设面包屑，页面内也不设「返回上一页」按钮或返回箭头；
  `platform/` 各页页脚只保留机构信息与版权，**不放任何导航链接**。
- 陈牧循的评估报告（`platform/assessment/reports/chenmuxun.html`）中不出现他的个人 ID，
  该处改为指向其认知强化服务报告（`platform/cognitive/reports/chenmuxun.html`）的超链接文本。
- 结局拆为三页：`admin/ending-250365.html`（数据蒸发）、`admin/ending-272585.html`（无法复原）、`admin/ending-428406.html`（及时收网）。在 `admin/dongxinfei.html` 点「修改模式」结算，
  依据「远程模式 / 记录是否清理干净 / 无痕模式」三项配置跳转到对应结局页。
  远程模式默认 `normal`（正常模式），此时点击「修改模式」只写入配置、**不进入任何结局**；只有切到 `test` / `strong` 才会结算。
  结算不弹二次确认。
- 后台名单唯一数据源：`admin/admin-data.js`。志愿者名单、评估记录、认知强化申请者、联合提取名单、系统既有日志都只写在这一个文件里，
  `jiang.html` / `chenchaowu.html` / `dongxinfei.html` 通过 `SJSD.renderXxx()` 渲染表格。改名单只改这一个文件。
- **日志按账号隔离**：`admin/admin-log.js` 的 `all(user)` 只返回该账号自己的记录，所以系统日志表格与清理面板里
  都只看得到自己的日志，别人的记录既不显示也删不到（`system` 记录同样不展示）。
- 清理记录：**三个后台账号（姜游亮 / 陈超武 / 董新飞）都可使用**，但**必须逐条勾选删除**，没有一键清空。
  面板列出该账号自己的**全部记录**——系统原有的自带记录 + 本次操作记录。
  **原有的自带记录也可以删**（不拦着），但删了就得负责把它恢复回原样。
- **「正确消除记录」的判定 = 直接比较当前记录和系统原有的记录是否相同。**
  `admin-log.js` 的 `logsMatch(user)` 逐条比对 时间 + 内容 + 账号，条数、顺序、内容全部一致才算通过。
  比对对象是 `admin-data.js` 里 `baseLog` 的原始数据（不是可能已被删改的 localStorage），所以标准答案永不变。
  另外要求 `sjsd_admin_log` 里该账号的记录为 0 条。
  **结局页拿 `logsMatch()` 的结果直接分流**，老存档里那个 `incorrect` 标记已不参与结算。
- **删除记录、恢复记录本身也是操作**：只要该账号的无痕模式没开，就会各自留下一条记录
  （`删除操作记录：N 条` / `恢复记录：已恢复至本次登录前的记录状态`）。
  所以在无痕关闭的状态下反复删，每次都会新留一条，记录永远回不到原样——必须开无痕才能收尾。
- 每页都有「重置日志」：把日志恢复到本次登录之前的状态（原有的记录一条不差地灌回来、本次记录全部丢弃），
  只动本账号的日志。提示语只说结果：`已恢复至本次登录前的记录状态。`
- **无痕模式按账号独立**：localStorage 键是 `sjsd_ghost_mode_<账号>`，
  三个账号各开各的、互不影响（旧的全局键 `sjsd_ghost_mode` 已废弃，结局页会顺手清掉）。
- 后台页面**不放流程提示文案**：日志表格与清理面板不写"本账号""本次""逐条勾选""重置会把记录恢复"这类说明，
  只保留系统日志、按钮、系统返回的提示语，保持真实后台的观感。
  面板里记录按时间顺序平铺，本次产生的记录**不加视觉标记**（`sess` 字段仍保留在数据里，供逻辑判断）。
- **影响结局的只有 `admin/dongxinfei.html` 上董新飞本人的记录。** 姜游亮页、陈超武页清理得对不对都不进入结局判定。
- 系统既有日志只在首次进入后台时落一份到 localStorage（`sjsd_base_seeded`），删掉后不会重新灌回来，只有「重置日志」能恢复。
- `platform/cognitive/archive/paper.html` 不含任何指向 `northland/platform-login.html` 的入口（云平台入口已移除）；
  该登录页由 `northland/lab.html` 进入（第 407 行平台卡片、第 422 行页脚链接），这是设计好的正确入口。
- `/forum/` 的帖子页脚不再放「相关帖」交叉链接。
- 根 `index.html` 聊天窗口里气泡中的图片可点击放大（`.img-viewer` 遮罩层），点任意处或按 Esc 关闭。

## 说明

所有页面均可直接双击打开或部署到任意静态托管，无外部依赖。
`platform/` 下共用 `assets/style.css` 与 `assets/site.js`；图标表已内联进各页面（`platform/assets/icons.svg` 为源文件），
因此 `file://` 下也能正常显示。剧情、人物、机构均属虚构。

## 彩蛋：点击服务热线

`platform/` 页面的**页眉／页脚**电话号码（`<span class="hm-phone">`）可以点，
点开用浏览器自带的 `alert` 弹出一句印象：
`87，143，212，0，这串数字你似乎听刘天清说过，但是不记得是什么意思了。`

- **用的是网页自己的做法**：和 `platform/assessment/booking.html` 里
  `《数据采集知情同意书》`（`onclick="return showConsent()"` → `alert(...)` → `return false`）
  完全同一套机制，都是原生弹窗，不自建遮罩层、不引第三方组件。
- 文案只写在 `platform/assets/site.js` 的 `PEEK_TEXT` 常量里，**不写进任何 HTML**，
  所以直接看源码或搜索页面文本都找不到。
- **悬停不加下划线**：`.hm-phone { cursor: pointer; color: inherit; font: inherit; }`
  + `.hm-phone:hover, .hm-phone:focus { text-decoration: none; outline: none; }`。
  颜色、字号、字重全部继承，页眉里仍是 `--brand` 蓝、页脚里仍是半透明白，
  唯一的表现就是鼠标变成手型。
- 键盘可达：号码带 `tabindex="0"`，Enter / 空格也能触发。
- 正文叙述里的号码（如 `platform/assessment/reports.html` 的提示段、
  `booking.html` 隐私政策 alert 的 JS 字符串）**不可点**，保持纯文本。
- 这个彩蛋指向前作，本作内**没有任何出处**，不需要在别处补线索。
- 服务热线：`0387-1432-120`（虚构）。

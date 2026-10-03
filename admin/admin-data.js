/* ==========================================================================
   admin/admin-data.js
   安和实验室内部后台 · 共用名单与日志数据（唯一数据源）

   改名单只改这一个文件。三个后台页面（jiang / chenchaowu / dongxinfei）
   都用这里的数据渲染表格，不再各自写死一份。

   【口径说明】各页面原本互相矛盾的地方，统一以管理员后台（董新飞）为准。
   【日志】SJSD.baseLog 是系统里既有的操作记录。玩家自己的操作记录另外
   存在 localStorage 的 sjsd_admin_log 里，会追加显示在表格末尾。
   每位玩家只能删除"属于自己"的记录行。
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- 志愿者名单
     编号 / 姓名 / 学校 / 学科 / 采集次数 / 数据评级 / 状态
     状态取值：正常、认知强化关联、记忆污染、重度衰退、已抹除部分记忆
     key 是详情弹窗的键（chenchaowu 页面的 VOL 对象用 v1…v11）              */
  var VOLUNTEER = [
    { key: 'v1',  id: 'V-001', name: '胡新之', school: '怀璧一中', subject: '生物',        count: 6,  level: 'A+', status: '重度衰退' },
    { key: 'v2',  id: 'V-002', name: '冯予祺', school: '怀璧一中', subject: '数学',        count: 5,  level: 'A',  status: '中度衰退' },
    { key: 'v3',  id: 'V-003', name: '姜禹泽', school: '怀璧一中', subject: '英语',        count: 12, level: 'A',  status: '重度衰退' },
    { key: 'v4',  id: 'V-004', name: '孙世铭', school: '怀璧四中', subject: '生物',        count: 1,  level: 'B',  status: '记忆污染' },
    { key: 'v5',  id: 'V-005', name: '刘天清', school: '狼堡一中', subject: '数学 / 综合', count: 3,  level: 'A+', status: '已抹除部分记忆' },
    { key: 'v6',  id: 'V-006', name: '宋钰恺', school: '怀璧一中', subject: '综合',        count: 2,  level: 'A',  status: '正常' },
    { key: 'v7',  id: 'V-007', name: '翟佳文', school: '狼堡一中', subject: '数学',      count: 2,  level: 'A',  status: '正常' },
    { key: 'v8',  id: 'V-008', name: '但以理', school: '大肥羊学校', subject: '语文',        count: 1,  level: 'B+', status: '正常' },
    { key: 'v9',  id: 'V-009', name: '林正铜',   school: '大肥羊学校', subject: '综合',        count: 1,  level: 'A',  status: '正常' },
    { key: 'v10', id: 'V-010', name: '杨浩津', school: '羊村三中', subject: '生物',        count: 4,  level: 'A+', status: '认知强化关联' },
    { key: 'v11', id: 'V-011', name: '齐亦琮', school: '美草实验学校', subject: '物理',        count: 1,  level: 'B',  status: '正常' }
  ];

  /* ---------------------------------------------------------------- 评估记录
     记录号 / 姓名 / 学校 / 年级 / 评估项目 / 评估日期 / 操作人 / 状态        */
  var EVAL = [
    { no: 'PG-2026-0601', name: '吴昊博',   school: '怀璧一中', grade: '高三', item: '学科能力评估',                date: '2026-07-06', op: 'dong******', status: '已完成' },
    { no: 'PG-2026-0602', name: '李杨梓麟', school: '怀璧一中', grade: '高三', item: '学科能力评估',                date: '2026-07-08', op: 'jian*********', status: '已完成' },
    { no: 'PG-2026-0603', name: '王宇涵',   school: '怀璧一中', grade: '高三', item: '学科能力评估',                date: '2026-07-11', op: 'jian*********', status: '已完成' },
    { no: 'PG-2026-0604', name: '林晚',     school: '怀璧一中', grade: '高三', item: '学科能力评估',                date: '2026-07-13', op: 'chen******', status: '已完成' },
    { no: 'PG-2026-0605', name: '陈牧循',   school: '怀璧一中', grade: '高二', item: '学科能力评估', date: '2026-07-26', op: 'dong******', status: '已完成' },
    { no: 'PG-2026-0606', name: '罗晋铭',   school: '怀璧一中', grade: '高三', item: '学科能力评估',                date: '2026-07-16', op: 'chen******', status: '已完成' },
    { no: 'PG-2026-0607', name: '徐雨桐',   school: '怀璧一中', grade: '高二', item: '生物学科评估',      date: '2026-07-21', op: 'chen******', status: '已完成' },
    { no: 'PG-2026-0608', name: '周晓雨',   school: '怀璧一中', grade: '高二', item: '学科能力评估',                date: '2026-07-18', op: 'dong******', status: '已完成' },
    { no: 'PG-2026-0609', name: '赵思航',   school: '怀璧一中', grade: '高三', item: '数学学科评估',      date: '2026-07-23', op: 'chen******', status: '已完成' },
    { no: 'PG-2026-0610', name: '林婉仪',   school: '怀璧一中', grade: '高三', item: '英语学科评估',     date: '2026-07-24', op: 'chen******', status: '已完成' },
    ];

  /* ---------------------------------------------------------- 认知强化申请者
     编号 / 姓名 / 申请服务 / 关联源数据 / 状态                              */
  var COGNITION = [
    { no: 'CS-2026-0031', name: '陈牧循', service: '生物认知强化', source: 'XYT-20260606',      status: '已交付' },
    { no: 'CS-2026-0044', name: '周晓雨', service: '生物认知强化', source: 'XYT-20260718-H02',  status: '已交付' },
    { no: 'CS-2026-0052', name: '吴昊博', service: '综合能力强化', source: 'LWT-20260711',      status: '待匹配' }
  ];

  /* -------------------------------------------------------- 联合提取项目名单
     序号 / 姓名 / 学校 / 年级 / 学科 / 数据评级
     采集次数取自志愿者名单，两者天然一致                                  */
  var EXTRACT = [
    { name: '刘天清',   school: '狼堡一中', grade: '高二', subject: '数学 / 综合' },
    { name: '司露',   school: '大肥羊学校', grade: '高二', subject: '生物' },
    { name: '宋钰恺',   school: '怀璧一中', grade: '高三', subject: '数学' },
    { name: '林若易',   school: '草原一中', grade: '高三', subject: '英语' },
    { name: '钱中生',   school: '安城一中', grade: '高二', subject: '生物' },
    { name: '林正铜',   school: '大肥羊学校', grade: '高三', subject: '综合' },
    { name: '卫尚昆', school: '应丘中学', grade: '高三', subject: '数学' },
    { name: '许于吕',   school: '大肥羊学校', grade: '高三', subject: '语文' },
    { name: '周处同',     school: '美草实验学校', grade: '高三', subject: '综合' },
    { name: '齐亦琮',   school: '美草实验学校', grade: '高二', subject: '生物' }
  ];

  /* ---------------------------------------------------------------- 系统日志
     ts / user / text。user = 'system' 的条目不属于任何账号。               */
  var baseLog = [
    { ts: '2026-06-07 09:12:44', user: 'jiangyouliang', text: '登录系统成功（IP 10.20.3.17）' },
    { ts: '2026-07-08 09:15:02', user: 'jiangyouliang', text: '查询评估记录 PG-2026-0602' },
    { ts: '2026-07-11 10:03:21', user: 'jiangyouliang', text: '查询评估记录 PG-2026-0603' },
    { ts: '2026-07-11 10:05:33', user: 'jiangyouliang', text: '申请导出报告（被拒绝：权限不足）' },
    { ts: '2026-07-20 14:22:09', user: 'jiangyouliang', text: '尝试访问【志愿者能力数据库】（拒绝：权限不足）' },
    { ts: '2026-07-20 14:22:31', user: 'jiangyouliang', text: '尝试访问【远程操作】（拒绝：权限不足）' },
    { ts: '2026-07-25 08:58:47', user: 'jiangyouliang', text: '查询评估记录 PG-2026-0611' },
    { ts: '2026-07-26 19:40:18', user: 'jiangyouliang', text: '查询评估记录 PG-2026-0605' },
    { ts: '2026-07-27 08:35:52', user: 'dongxinfei',   text: '修改远程操作权限配置（授权：chenchaowu 仅可查看）' },
    { ts: '2026-07-27 08:41:11', user: 'chenchaowu',   text: '登录系统成功（IP 10.20.9.88）' },
    { ts: '2026-07-27 08:52:37', user: 'chenchaowu',   text: '访问【志愿者能力抽取数据库】' },
    { ts: '2026-07-27 09:09:48', user: 'chenchaowu',   text: '执行抽取操作（对象：PG-2026-0611）' },
    { ts: '2026-07-27 09:34:10', user: 'chenchaowu',   text: '执行记忆抹除操作（对象：PG-2026-0611）' },
    { ts: '2026-07-27 09:55:00', user: 'chenchaowu',   text: '备注：按“重点关照”名单处理完毕' },
    { ts: '2026-07-27 10:18:22', user: 'dongxinfei',   text: '提醒 chenchaowu：记得清理系统记录' },
    { ts: '2026-07-27 10:37:07', user: 'dongxinfei',   text: '检查项目受试者名单（107 人）' },
    { ts: '@DONG_LOGIN@', user: 'dongxinfei', text: '登录系统成功（IP 10.20.1.2）' },
    { ts: '@DONG_VISIT@', user: 'dongxinfei', text: '访问【远程操作 · 山经-蒂中帝联合提取项目】' },
    { ts: '@COUNTDOWN_SET@',        user: 'dongxinfei', text: '设置项目倒计时：1 小时 12 分钟' },
    { ts: '2026-07-28 23:00:00', user: 'system',       text: '系统自动备份完成' }
  ];

  /* ------------------------------------------------------------ 志愿者详情
     key 与上面 VOLUNTEER 的 key 一一对应（v1…v11）。
     这里是「详情」那一列点开之后显示的内容，两个页面的志愿者表格共用。
     姓名与学校必须与 VOLUNTEER 保持一致 —— 名单换人时这里也要跟着换。
     （EXTRACT 联合提取名单是另一份数据，跟这里不是同一回事，不要互相对齐。）      */
  var VOL_DETAIL = {
    v1: '<h4>志愿者报告 · V-001 胡新之</h4>' +
      '<table class="grid">' +
      '<tr><th>学校 / 年级</th><td>怀璧一中 · 高二</td><th>学科</th><td>生物</td></tr>' +
      '<tr><th>采集次数</th><td>6 次</td><th>数据评级</th><td>A+</td></tr>' +
      '<tr><th>首次采集</th><td>2026-06-06</td><th>最近采集</th><td>2026-07-21</td></tr>' +
      '<tr><th>能力变化</th><td colspan="3">生物成绩由年级前三跌至四十余名；重复记忆效率下降约 61%</td></tr>' +
      '<tr><th>副作用</th><td colspan="3">出现生活记忆丢失：忘记近期饮食、行程与人际往来</td></tr>' +
      '</table><p class="note">常规内容，无额外记录。</p>',
    v2: '<h4>志愿者报告 · V-002 冯予祺</h4>' +
      '<table class="grid">' +
      '<tr><th>学校 / 年级</th><td>怀璧一中 · 高三</td><th>学科</th><td>数学</td></tr>' +
      '<tr><th>采集次数</th><td>5 次</td><th>数据评级</th><td>A</td></tr>' +
      '<tr><th>能力变化</th><td colspan="3">数学解题反应变慢，隐性下降约 29%</td></tr>' +
      '</table><p class="note">常规内容，无额外记录。</p>',
    v3: '<h4>志愿者报告 · V-003 姜禹泽</h4>' +
      '<table class="grid">' +
      '<tr><th>学校 / 年级</th><td>怀璧一中 · 高三</td><th>学科</th><td>英语</td></tr>' +
      '<tr><th>采集次数</th><td>12 次</td><th>数据评级</th><td>A</td></tr>' +
      '<tr><th>状态</th><td colspan="3">重度衰退。已超出建议阈值 4 倍，恢复率低于 10%</td></tr>' +
      '</table><p class="note">常规内容，无额外记录。</p>',
    v4: '<h4>志愿者报告 · V-004 孙世铭</h4>' +
      '<table class="grid">' +
      '<tr><th>学校 / 年级</th><td>怀璧四中 · 高二</td><th>学科</th><td>生物</td></tr>' +
      '<tr><th>采集次数</th><td>1 次</td><th>数据评级</th><td>B</td></tr>' +
      '<tr><th>身份</th><td colspan="3">数据包买家（使用“生物学科能力包”后出现记忆污染）</td></tr>' +
      '<tr><th>症状</th><td colspan="3">出现不属于本人的记忆片段：实验室解剖、未参加过的竞赛考场</td></tr>' +
      '</table><p class="note">常规内容，无额外记录。</p>',
    v5: '<h4>志愿者报告 · V-005 刘天清</h4>' +
      '<table class="grid">' +
      '<tr><th>学校 / 年级</th><td>狼堡一中 · 高二</td><th>学科</th><td>数学 / 综合</td></tr>' +
      '<tr><th>采集次数</th><td>3 次</td><th>数据评级</th><td>A+</td></tr>' +
      '<tr><th>状态</th><td colspan="3">已抹除部分记忆</td></tr>' +
      '<tr><th>常规内容</th><td colspan="3">学科认知模式完整，数学能力评级 A+，数据已进入待打包队列。</td></tr>' +
      '</table>' +
      '<p class="tag">※ 本报告中除常规内容外，额外包含【记忆抹除内容】：</p>' +
      '<div class="mem">近几日此人印象深刻的内容：<br>' +
      '  · 牟通雪<br>' +
      '  · 董新飞<br>' +
      '  · G7y0k293s</div>' +
      '<p class="note">系统提示：以上条目为本次记忆抹除操作的目标内容，抹除后当事人将无法回忆。请确认无遗漏。</p>',
    v6: '<h4>志愿者报告 · V-006 宋钰恺</h4>' +
      '<table class="grid"><tr><th>学校 / 年级</th><td>怀璧一中 · 高三</td><th>学科</th><td>综合</td></tr>' +
      '<tr><th>采集次数</th><td>2 次</td><th>数据评级</th><td>A</td></tr></table>' +
      '<p class="note">常规内容，无额外记录。</p>',
    v7: '<h4>志愿者报告 · V-007 翟佳文</h4>' +
      '<table class="grid"><tr><th>学校 / 年级</th><td>狼堡一中 · 高三</td><th>学科</th><td>数学</td></tr>' +
      '<tr><th>采集次数</th><td>2 次</td><th>数据评级</th><td>A</td></tr></table>' +
      '<p class="note">常规内容，无额外记录。</p>',
    v8: '<h4>志愿者报告 · V-008 但以理</h4>' +
      '<table class="grid"><tr><th>学校 / 年级</th><td>大肥羊学校 · 高二</td><th>学科</th><td>语文</td></tr>' +
      '<tr><th>采集次数</th><td>1 次</td><th>数据评级</th><td>B+</td></tr></table>' +
      '<p class="note">常规内容，无额外记录。</p>',
    v9: '<h4>志愿者报告 · V-009 林正铜</h4>' +
      '<table class="grid"><tr><th>学校 / 年级</th><td>大肥羊学校 · 高三</td><th>学科</th><td>综合</td></tr>' +
      '<tr><th>采集次数</th><td>1 次</td><th>数据评级</th><td>A</td></tr></table>' +
      '<p class="note">常规内容，无额外记录。</p>',
    /* 杨浩津：志愿者名单里是 v10（V-010），数据评级 A+，关联认知强化服务 */
    v10: '<h4>志愿者报告 · V-010 杨浩津</h4>' +
      '<table class="grid"><tr><th>学校 / 年级</th><td>羊村三中 · 高二</td><th>学科</th><td>生物</td></tr>' +
      '<tr><th>采集次数</th><td>4 次</td><th>数据评级</th><td>A+</td></tr>' +
      '<tr><th>关联</th><td colspan="3"> 成绩较差，不建议抽取。</td></tr></table>' +
      '<p class="note">常规内容，无额外记录。</p>',
    /* 齐亦琮：志愿者名单里是 v11（V-011） */
    v11: '<h4>志愿者报告 · V-011 齐亦琮</h4>' +
      '<table class="grid"><tr><th>学校 / 年级</th><td>美草实验学校 · 高三</td><th>学科</th><td>物理</td></tr>' +
      '<tr><th>采集次数</th><td>1 次</td><th>数据评级</th><td>B</td></tr></table>' +
      '<p class="note">常规内容，无额外记录。</p>'
  };

  /* ------------------------------------------------------------ 渲染辅助  */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function tbody(id) { return document.getElementById(id); }

  /* 评估记录：记录号/姓名/学校/年级/评估项目/评估日期/操作人/状态 */
  function renderEval(id) {
    var tb = tbody(id); if (!tb) return;
    tb.innerHTML = EVAL.map(function (r) {
      return '<tr><td>' + esc(r.no) + '</td><td>' + esc(r.name) + '</td><td>' + esc(r.school) +
        '</td><td>' + esc(r.grade) + '</td><td>' + esc(r.item) + '</td><td>' + esc(r.date) +
        '</td><td>' + esc(r.op) + '</td><td>' + esc(r.status) + '</td></tr>';
    }).join('');
  }

  /* 志愿者名单：编号/姓名/学校/学科/采集次数/数据评级/状态/详情
     opts.pick 为真时，最后那列「详情」可点，点开显示 VOL_DETAIL 里对应的报告。 */
  function renderVolunteer(id, opts) {
    var tb = tbody(id); if (!tb) return;
    opts = opts || {};
    tb.innerHTML = VOLUNTEER.map(function (r) {
      var last = opts.pick
        ? '<td><a href="#" class="detail-link" data-vol="' + esc(r.key) + '">详情</a></td>'
        : '<td>—</td>';
      return '<tr><td>' + esc(r.id) + '</td><td>' + esc(r.name) + '</td><td>' + esc(r.school) +
        '</td><td>' + esc(r.subject) + '</td><td>' + r.count + '</td><td>' + esc(r.level) +
        '</td><td>' + esc(r.status) + '</td>' + last + '</tr>';
    }).join('');
  }

  /* 认知强化申请者：申请编号/姓名/申请服务/关联源数据/状态 */
  function renderCognition(id, opts) {
    var tb = tbody(id); if (!tb) return;
    opts = opts || {};
    var seq = { 'CS-2026-0031': 'c1', 'CS-2026-0044': 'c2', 'CS-2026-0052': 'c3' };
    tb.innerHTML = COGNITION.map(function (r) {
      return '<tr' + (opts.pick ? ' class="pick" data-cog="' + (seq[r.no] || '') + '"' : '') +
        '><td>' + esc(r.no) + '</td><td>' + esc(r.name) + '</td><td>' + esc(r.service) +
        '</td><td>' + esc(r.source) + '</td><td>' + esc(r.status) + '</td></tr>';
    }).join('');
  }

  /* 联合提取名单：序号/姓名/学校/年级/学科/采集次数/数据评级 */
  function renderExtract(id) {
    var tb = tbody(id); if (!tb) return;
    function find(name) {
      for (var i = 0; i < VOLUNTEER.length; i++) { if (VOLUNTEER[i].name === name) return VOLUNTEER[i]; }
      return null;
    }
    tb.innerHTML = EXTRACT.map(function (r, i) {
      var v = find(r.name);
      return '<tr><td>' + (i + 1) + '</td><td>' + esc(r.name) + '</td><td>' + esc(r.school) +
        '</td><td>' + esc(r.grade) + '</td><td>' + esc(r.subject) + '</td><td>' + (v ? v.count : '—') +
        '</td><td>' + (v ? esc(v.level) : '—') + '</td></tr>';
    }).join('');
  }

  window.SJSD = {
    VOLUNTEER: VOLUNTEER,
    VOL_DETAIL: VOL_DETAIL,
    EVAL: EVAL,
    COGNITION: COGNITION,
    EXTRACT: EXTRACT,
    baseLog: baseLog,
    renderEval: renderEval,
    renderVolunteer: renderVolunteer,
    renderCognition: renderCognition,
    renderExtract: renderExtract
  };
})();

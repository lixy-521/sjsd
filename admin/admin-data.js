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
    { key: 'v1',  id: 'V-001', name: '徐雨桐', school: '怀璧一中', subject: '生物',        count: 6,  level: 'A+', status: '重度衰退' },
    { key: 'v2',  id: 'V-002', name: '赵思航', school: '怀璧一中', subject: '数学',        count: 5,  level: 'A',  status: '中度衰退' },
    { key: 'v3',  id: 'V-003', name: '林婉仪', school: '怀璧一中', subject: '英语',        count: 12, level: 'A',  status: '重度衰退' },
    { key: 'v4',  id: 'V-004', name: '周晓雨', school: '怀璧一中', subject: '生物',        count: 1,  level: 'B',  status: '记忆污染' },
    { key: 'v5',  id: 'V-005', name: '刘天清', school: '怀璧一中', subject: '数学 / 综合', count: 3,  level: 'A+', status: '已抹除部分记忆' },
    { key: 'v6',  id: 'V-006', name: '吴昊博', school: '怀璧一中', subject: '综合',        count: 2,  level: 'A',  status: '正常' },
    { key: 'v7',  id: 'V-007', name: '李杨梓麟', school: '怀璧一中', subject: '数学',      count: 2,  level: 'A',  status: '正常' },
    { key: 'v8',  id: 'V-008', name: '王宇涵', school: '怀璧一中', subject: '语文',        count: 1,  level: 'B+', status: '正常' },
    { key: 'v9',  id: 'V-009', name: '林晚',   school: '怀璧一中', subject: '综合',        count: 1,  level: 'A',  status: '正常' },
    { key: 'v10', id: 'V-010', name: '陈牧循', school: '怀璧一中', subject: '生物',        count: 4,  level: 'A+', status: '认知强化关联' },
    { key: 'v11', id: 'V-011', name: '罗晋铭', school: '怀璧二中', subject: '物理',        count: 1,  level: 'B',  status: '正常' }
  ];

  /* ---------------------------------------------------------------- 评估记录
     记录号 / 姓名 / 学校 / 年级 / 评估项目 / 评估日期 / 操作人 / 状态        */
  var EVAL = [
    { no: 'PG-2026-0601', name: '吴昊博',   school: '怀璧一中', grade: '高三', item: '学科能力评估',                date: '2026-06-06', op: '董--', status: '已完成' },
    { no: 'PG-2026-0602', name: '李杨梓麟', school: '怀璧一中', grade: '高三', item: '学科能力评估',                date: '2026-06-07', op: '姜--', status: '已完成' },
    { no: 'PG-2026-0603', name: '王宇涵',   school: '怀璧一中', grade: '高三', item: '学科能力评估',                date: '2026-06-08', op: '姜--', status: '已完成' },
    { no: 'PG-2026-0604', name: '林晚',     school: '怀璧一中', grade: '高三', item: '学科能力评估',                date: '2026-06-10', op: '陈--', status: '已完成' },
    { no: 'PG-2026-0605', name: '陈牧循',   school: '怀璧一中', grade: '高二', item: '学科能力评估（关联认知强化）', date: '2026-06-15', op: '董--', status: '已完成' },
    { no: 'PG-2026-0606', name: '罗晋铭',   school: '怀璧二中', grade: '高三', item: '学科能力评估',                date: '2026-06-12', op: '陈--', status: '已完成' },
    { no: 'PG-2026-0607', name: '徐雨桐',   school: '怀璧一中', grade: '高二', item: '生物学科评估（第 6 次）',      date: '2026-06-20', op: '陈--', status: '已完成' },
    { no: 'PG-2026-0608', name: '周晓雨',   school: '怀璧一中', grade: '高二', item: '学科能力评估',                date: '2026-06-18', op: '董--', status: '已完成' },
    { no: 'PG-2026-0609', name: '赵思航',   school: '怀璧一中', grade: '高三', item: '数学学科评估（第 5 次）',      date: '2026-06-19', op: '陈--', status: '已完成' },
    { no: 'PG-2026-0610', name: '林婉仪',   school: '怀璧一中', grade: '高三', item: '英语学科评估（第 12 次）',     date: '2026-06-21', op: '陈--', status: '已完成' },
    { no: 'PG-2026-0611', name: '刘天清',   school: '怀璧一中', grade: '高二', item: '学科能力评估',                date: '2026-06-06', op: '董--', status: '已完成' }
  ];

  /* ---------------------------------------------------------- 认知强化申请者
     编号 / 姓名 / 申请服务 / 关联源数据 / 状态                              */
  var COGNITION = [
    { no: 'CS-2026-0031', name: '陈牧循', service: '生物认知强化', source: 'XYT-20260606',      status: '已交付' },
    { no: 'CS-2026-0044', name: '周晓雨', service: '生物认知强化', source: 'XYT-20260620-H02',  status: '已交付' },
    { no: 'CS-2026-0052', name: '吴昊博', service: '综合能力强化', source: 'LWT-20260606',      status: '待匹配' }
  ];

  /* -------------------------------------------------------- 联合提取项目名单
     序号 / 姓名 / 学校 / 年级 / 学科 / 数据评级
     采集次数取自志愿者名单，两者天然一致                                  */
  var EXTRACT = [
    { name: '刘天清',   school: '怀璧一中', grade: '高二', subject: '数学 / 综合' },
    { name: '徐雨桐',   school: '怀璧一中', grade: '高二', subject: '生物' },
    { name: '赵思航',   school: '怀璧一中', grade: '高三', subject: '数学' },
    { name: '林婉仪',   school: '怀璧一中', grade: '高三', subject: '英语' },
    { name: '周晓雨',   school: '怀璧一中', grade: '高二', subject: '生物' },
    { name: '吴昊博',   school: '怀璧一中', grade: '高三', subject: '综合' },
    { name: '李杨梓麟', school: '怀璧一中', grade: '高三', subject: '数学' },
    { name: '王宇涵',   school: '怀璧一中', grade: '高三', subject: '语文' },
    { name: '林晚',     school: '怀璧一中', grade: '高三', subject: '综合' },
    { name: '陈牧循',   school: '怀璧一中', grade: '高二', subject: '生物' }
  ];

  /* ---------------------------------------------------------------- 系统日志
     ts / user / text。user = 'system' 的条目不属于任何账号。               */
  var baseLog = [
    { ts: '2026-06-07 09:12:44', user: 'jiangyouliang', text: '登录系统成功（IP 10.20.3.17）' },
    { ts: '2026-06-07 09:15:02', user: 'jiangyouliang', text: '查询评估记录 PG-2026-0602' },
    { ts: '2026-06-08 10:03:21', user: 'jiangyouliang', text: '查询评估记录 PG-2026-0603' },
    { ts: '2026-06-08 10:05:33', user: 'jiangyouliang', text: '申请导出报告（被拒绝：权限不足）' },
    { ts: '2026-06-15 16:40:18', user: 'jiangyouliang', text: '查询评估记录 PG-2026-0605' },
    { ts: '2026-06-20 14:22:09', user: 'jiangyouliang', text: '尝试访问【志愿者能力数据库】（拒绝：权限不足）' },
    { ts: '2026-06-20 14:22:31', user: 'jiangyouliang', text: '尝试访问【远程操作】（拒绝：权限不足）' },
    { ts: '2026-06-22 08:58:47', user: 'jiangyouliang', text: '查询评估记录 PG-2026-0611' },
    { ts: '2026-06-25 11:11:11', user: 'chenchaowu',   text: '登录系统成功（IP 10.20.9.88）' },
    { ts: '2026-06-25 11:30:52', user: 'dongxinfei',   text: '修改远程操作权限配置（授权：chenchaowu 仅可查看）' },
    { ts: '2026-06-25 22:47:05', user: 'dongxinfei',   text: '登录系统成功（IP 10.20.1.2）' },
    { ts: '2026-06-25 22:51:19', user: 'dongxinfei',   text: '访问【远程操作 · 山经-蒂中帝联合提取项目】' },
    { ts: '2026-06-25 23:02:44', user: 'dongxinfei',   text: '设置项目倒计时：1 小时 12 分钟' },
    { ts: '2026-06-26 01:15:37', user: 'chenchaowu',   text: '访问【志愿者能力抽取数据库】' },
    { ts: '2026-06-26 01:19:48', user: 'chenchaowu',   text: '执行抽取操作（对象：PG-2026-0611）' },
    { ts: '2026-06-26 01:26:10', user: 'chenchaowu',   text: '执行记忆抹除操作（对象：PG-2026-0611）' },
    { ts: '2026-06-26 01:31:00', user: 'chenchaowu',   text: '备注：按“重点关照”名单处理完毕' },
    { ts: '2026-06-26 01:33:22', user: 'dongxinfei',   text: '提醒 chenchaowu：记得清理系统记录' },
    { ts: '2026-06-26 02:10:07', user: 'dongxinfei',   text: '检查项目受试者名单（107 人）' },
    { ts: '2026-06-27 07:00:00', user: 'system',       text: '系统自动备份完成' }
  ];

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

  /* 志愿者名单：编号/姓名/学校/学科/采集次数/数据评级/状态 */
  function renderVolunteer(id, opts) {
    var tb = tbody(id); if (!tb) return;
    opts = opts || {};
    tb.innerHTML = VOLUNTEER.map(function (r) {
      return '<tr' + (opts.pick ? ' class="pick" data-vol="' + esc(r.key) + '"' : '') +
        '><td>' + esc(r.id) + '</td><td>' + esc(r.name) + '</td><td>' + esc(r.school) +
        '</td><td>' + esc(r.subject) + '</td><td>' + r.count + '</td><td>' + esc(r.level) +
        '</td><td>' + esc(r.status) + '</td></tr>';
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

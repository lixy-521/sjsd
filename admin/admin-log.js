/* ==========================================================================
   admin/admin-log.js
   安和实验室内部后台 · 系统日志与"清理记录"共用逻辑

   三个后台页面（jiang / chenchaowu / dongxinfei）都用这一份。

   【规则】
   · 日志分两处：admin-data.js 里的 baseLog（系统既有记录，存在 localStorage
     的 sjsd_base_log）+ 玩家自己的操作记录（sjsd_admin_log）。
   · 清理必须一条一条勾选删除，没有"一键清空"。
   · 每位玩家只能删除属于自己账号的记录。勾选别人的记录会被系统直接拒绝，
     并把 state.rejected 置为 true——这是"删除了无关记录"。
   · 自己的记录全部删完 → state.incorrect = false，其余情况为 true。
     （什么都没删也算 incorrect。）
   ========================================================================== */
(function () {
  'use strict';

  var K_BASE = 'sjsd_base_log';   // 系统既有记录
  var K_USER = 'sjsd_admin_log';  // 玩家操作记录
  var K_STATE = 'sjsd_wipe_state';
  var K_SEED = 'sjsd_base_seeded'; // 系统既有记录是否已落到本地

  function read(k) { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch (e) { return []; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  /* 系统既有记录只在第一次进入后台时落一份到本地。
     之后即使被删空，也不会再被重新灌回来——否则删了等于没删。
     唯一能把它们灌回来的是「重置日志」（见 reset）。 */
  function seedBase(force) {
    if (!force) {
      var seeded = null;
      try { seeded = localStorage.getItem(K_SEED); } catch (e) {}
      if (seeded === '1') return;
    }
    var src = (window.SJSD && window.SJSD.baseLog) ? window.SJSD.baseLog : [];
    write(K_BASE, src.slice());
    try { localStorage.setItem(K_SEED, '1'); } catch (e) {}
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function pad2(n) { return n < 10 ? '0' + n : '' + n; }
  function nowStr() {
    var d = new Date();
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()) + ' ' +
      pad2(d.getHours()) + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds());
  }

  /* --------------------------------------------------------------- 状态  */
  function readState() {
    try { return JSON.parse(localStorage.getItem(K_STATE) || '{}'); } catch (e) { return {}; }
  }
  function writeState(o) { try { localStorage.setItem(K_STATE, JSON.stringify(o)); } catch (e) {} }

  function init(user) {
    seedBase();
    var st = readState();
    if (st[user] === undefined) { st[user] = { incorrect: true, rejected: false }; writeState(st); }
    return st[user];
  }
  function setFlag(user, key, val) {
    var st = readState();
    if (!st[user]) st[user] = { incorrect: true, rejected: false };
    /* 一旦误删过无关记录，这次行动就废了，后面清理得再干净也翻不了案 */
    if (key === 'incorrect' && st[user].rejected) st[user].incorrect = true;
    else st[user][key] = val;
    writeState(st);
  }
  function getFlag(user, key) {
    var st = readState(), s = st[user] || {};
    return s[key];
  }

  /* --------------------------------------------------------------- 日志  */
  /* 每个账号只能看到自己的日志：系统日志表格与清理面板都按 user 过滤，
     别人的记录既不显示也删不到。system 记录归入系统自身，不展示。 */
  function base() { return read(K_BASE); }
  function userLog() { return read(K_USER); }
  function all(user) {
    var b = base(), u = userLog();
    var rows = b.concat(u);
    if (!user) return rows;
    return rows.filter(function (e) { return e.user === user; });
  }
  function isMine(e, user) { return e.user === user; }

  function push(user, text) {
    var g = null;
    try { g = localStorage.getItem('sjsd_ghost_mode'); } catch (e) {}
    if (g === 'on') return;   // 无痕模式：不写任何操作记录
    var a = userLog();
    /* sess 标记"本次进入后台之后产生的记录"，与历史日志区分显示 */
    a.push({ ts: nowStr(), user: user, text: text, sess: true });
    write(K_USER, a);
  }

  /* ------------------------------------------------- 清理面板：逐条勾选  */
  /* 面板只列本账号自己的记录——历史日志 + 本次操作记录。
     别人的记录根本不在这个列表里，所以删不到。 */
  function list(user) {
    return all(user).map(function (e, i) {
      return { idx: i, ts: e.ts, user: e.user, text: e.text, sess: !!e.sess };
    });
  }

  /* 本账号还有没有没清掉的记录（历史日志 + 本次操作记录） */
  function hasWork(user) {
    return all(user).length > 0;
  }
  function done(user) {
    return getFlag(user, 'incorrect') === false && getFlag(user, 'rejected') !== true;
  }

  /* 执行逐条删除。列表里只有自己的记录，索引按 all(user) 计算。 */
  function remove(user, indices) {
    if (!indices.length) return { ok: false, msg: '请先勾选要删除的记录。' };

    var entries = all(user);
    var mineSel = [], foreignSel = [];
    indices.forEach(function (i) {
      var e = entries[i];
      if (!e) return;
      (isMine(e, user) ? mineSel : foreignSel).push(e);
    });

    if (foreignSel.length) {
      setFlag(user, 'rejected', true);
      setFlag(user, 'incorrect', true);
      return { ok: false, msg: '系统拒绝：所选记录中包含不属于本账号的操作记录，无法删除。' };
    }

    // 从两处存储里逐条移除被勾选的、属于自己的那份
    function strip(key) {
      var arr = read(key), out = [];
      arr.forEach(function (e) {
        var del = mineSel.some(function (d) { return d.ts === e.ts && d.text === e.text && d.user === e.user; });
        if (!del) out.push(e);
      });
      write(key, out);
    }
    strip(K_BASE);
    strip(K_USER);

    var remain = all(user).length > 0;
    setFlag(user, 'incorrect', remain);   // 自己的记录还有剩 → 清理不彻底
    return {
      ok: true,
      msg: '已删除 ' + mineSel.length + ' 条记录' + (remain ? '，本账号仍有未清理的记录。' : '，本账号的操作记录已全部清除。')
    };
  }

  /* 重置日志：恢复被删掉的历史日志、清掉本账号的本次操作记录、
     并抹掉"误删无关记录"的判定。给玩家一条反悔的路。
     只动本账号的记录，别的账号的日志一概不碰。
     只重置日志，不碰远程模式 / 无痕模式。 */
  function reset(user) {
    seedBase(true);
    /* 只清掉本账号的本次操作记录，保留其他账号的 */
    write(K_USER, userLog().filter(function (e) { return e.user !== user; }));

    var st = readState();
    if (st[user]) { st[user].rejected = false; st[user].incorrect = true; }
    writeState(st);

    return {
      ok: true,
      msg: '日志已重置：被删除的记录已全部恢复，"误删无关记录"的判定已清除。本账号回到初始状态，可重新清理。'
    };
  }

  window.SJSDLog = {
    init: init,
    setFlag: setFlag,
    getFlag: getFlag,
    base: base,
    userLog: userLog,
    all: all,
    push: push,
    list: list,
    hasWork: hasWork,
    done: done,
    remove: remove,
    reset: reset,
    esc: esc,
    nowStr: nowStr,
    /* 供结局页显示「远程模式」这一项 */
    modeLabel: function (m) {
      if (m === 'normal') return '正常模式（不进行抽取）';
      if (m === 'test') return '测试模式（不进行实际抽取）';
      if (m === 'strong') return '强力模式（进行超额抽取）';
      return '未配置';
    },
    /* 供结局页显示「消除记录」这一项 */
    wipeSummary: function (user) {
      if (done(user)) return '已清理';
      if (getFlag(user, 'rejected')) return '清理异常';
      return '未清理';
    },
    KEYS: { base: K_BASE, user: K_USER, state: K_STATE, seed: K_SEED }
  };
})();

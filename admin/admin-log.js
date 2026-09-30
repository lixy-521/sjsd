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
  function base() { return read(K_BASE); }
  function userLog() { return read(K_USER); }
  function all() { return base().concat(userLog()); }
  function isMine(e, user) { return e.user === user; }

  function push(user, text) {
    var g = null;
    try { g = localStorage.getItem('sjsd_ghost_mode'); } catch (e) {}
    if (g === 'on') return;   // 无痕模式：不写任何操作记录
    var a = userLog();
    /* sess 标记"本次进入后台之后产生的记录"。清理面板只列这些，
       系统里原有的历史日志（各账号的旧记录）在面板里不可删。 */
    a.push({ ts: nowStr(), user: user, text: text, sess: true });
    write(K_USER, a);
  }

  /* ------------------------------------------------- 清理面板：逐条勾选  */
  /* 清理面板只列"本次操作产生"的记录（sess 标记）。
     系统原有的历史日志不出现在面板里，因此删不到别人的旧记录。 */
  function list(user) {
    return all().map(function (e, i) {
      return { idx: i, ts: e.ts, user: e.user, text: e.text, sess: !!e.sess, mine: isMine(e, user) };
    }).filter(function (r) { return r.sess; });
  }
  function sessionAll() {
    return all().filter(function (e) { return e.sess; });
  }

  /* 本账号还有没有"本次操作"留下的记录（这才是要清掉的东西） */
  function hasWork(user) {
    return userLog().some(function (e) { return e.user === user && e.sess; });
  }
  function hasForeign() {
    return base().some(function (e) {
      return e.user !== 'system';
    });
  }
  function done(user) {
    return getFlag(user, 'incorrect') === false && getFlag(user, 'rejected') !== true;
  }

  /* 执行逐条删除。user 只能删自己的；勾选别人的整体拒绝。 */
  function remove(user, indices) {
    if (!indices.length) return { ok: false, msg: '请先勾选要删除的记录。' };

    var entries = all();
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

    var remain = userLog().some(function (e) { return e.user === user && e.sess; });
    setFlag(user, 'incorrect', remain);   // 自己的记录还有剩 → 清理不彻底
    return {
      ok: true,
      msg: '已删除 ' + mineSel.length + ' 条记录' + (remain ? '，本账号本次仍留有未清理的记录。' : '，本账号本次的操作记录已全部清除。')
    };
  }

  /* 重置日志：恢复被删掉的历史日志、清掉本次操作记录、
     并抹掉"误删无关记录"的判定。给玩家一条反悔的路。
     只重置日志，不碰远程模式 / 无痕模式。 */
  function reset(user) {
    seedBase(true);
    write(K_USER, []);   // 本次操作记录全部清掉

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
    sessionAll: sessionAll,
    push: push,
    list: list,
    hasWork: hasWork,
    hasForeign: hasForeign,
    done: done,
    remove: remove,
    reset: reset,
    esc: esc,
    nowStr: nowStr,
    /* 供结局页显示「消除记录」这一项 */
    wipeSummary: function (user) {
      if (done(user)) return '逐条清理，本账号记录已清空';
      if (getFlag(user, 'rejected')) return '清理时动到了无关记录';
      if (hasWork(user)) return '仍有本账号记录未清理';
      return '没有需要清理的本账号记录';
    },    KEYS: { base: K_BASE, user: K_USER, state: K_STATE, seed: K_SEED }
  };
})();

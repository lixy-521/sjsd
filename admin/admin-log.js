/* ==========================================================================
   admin/admin-log.js
   安和实验室内部后台 · 系统日志与"清理记录"共用逻辑

   三个后台页面（jiang / chenchaowu / dongxinfei）都用这一份。

   【规则】
   · 日志分两处：admin-data.js 里的 baseLog（系统原有的记录，存在 localStorage
     的 sjsd_base_log）+ 玩家自己的操作记录（sjsd_admin_log）。
   · 每个账号只看得到、也只删得到自己的日志。原有的自带记录**也可以删**。
   · 清理必须一条一条勾选删除，没有"一键清空"。
   · "正确消除记录" = 当前记录和系统原有的记录**完全一致**
     （条数、时间、内容逐条相同）。多一条、少一条、改一条都算没清干净。
     判定由 logsMatch() 给出，直接拿当前记录和 admin-data.js 的 baseLog 比。
   · 删除记录、恢复记录本身也是操作：只要无痕模式没开，就会各自留下一条记录。
   · 无痕模式（隐私浏览）按账号独立：sjsd_ghost_mode_<账号>。
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

  /* ------------------------------------------------- 无痕模式（按账号独立） */
  function ghostKey(user) { return 'sjsd_ghost_mode_' + user; }
  function isGhost(user) {
    try { return localStorage.getItem(ghostKey(user)) === 'on'; } catch (e) { return false; }
  }
  function setGhost(user, on) {
    try { localStorage.setItem(ghostKey(user), on ? 'on' : 'off'); } catch (e) {}
  }

  /* --------------------------------------------------------------- 状态  */
  function readState() {
    try { return JSON.parse(localStorage.getItem(K_STATE) || '{}'); } catch (e) { return {}; }
  }
  function writeState(o) { try { localStorage.setItem(K_STATE, JSON.stringify(o)); } catch (e) {} }

  function init(user) {
    seedBase();
    var st = readState();
    if (st[user] === undefined) { st[user] = { incorrect: true }; writeState(st); }
    return st[user];
  }
  function setFlag(user, key, val) {
    var st = readState();
    if (!st[user]) st[user] = { incorrect: true };
    st[user][key] = val;
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

  /* ---------------------------------------------------- 记录集合的读写 */
  /* 把日志数组写回去。某个集合空了就把对应的键删掉，
     让"初始状态"的表现更干净（键不存在 = 没有记录）。 */
  function writeLog(key, arr) {
    if (!arr.length) { try { localStorage.removeItem(key); } catch (e) {} return; }
    write(key, arr);
  }
  /* 在当前日志里删掉选中的那几条（按 时间+内容+账号 匹配），返回删掉了几条。 */
  function strip(sel) {
    var removed = 0;
    [K_BASE, K_USER].forEach(function (key) {
      var arr = read(key), out = [];
      arr.forEach(function (e) {
        var hit = sel.some(function (d) { return d.ts === e.ts && d.text === e.text && d.user === e.user; });
        if (hit) removed++; else out.push(e);
      });
      writeLog(key, out);
    });
    return removed;
  }

  function push(user, text) {
    if (isGhost(user)) return;   // 无痕模式：不写任何操作记录
    var a = userLog();
    a.push({ ts: nowStr(), user: user, text: text, sess: true });
    write(K_USER, a);
  }

  /* ------------------------------------------------- 清理面板：逐条勾选  */
  /* 面板列出本账号自己的全部记录——原有的历史记录 + 本次操作记录。
     别人的记录根本不在这个列表里，所以删不到。 */
  function list(user) {
    return all(user).map(function (e, i) {
      return { idx: i, ts: e.ts, user: e.user, text: e.text, sess: !!e.sess };
    });
  }

  /* 系统原本就应该有的那批记录（admin-data.js 里的 baseLog，按账号过滤）。
     注意读的是 admin-data.js 的原始数据，不是可能已被删改的 localStorage，
     所以它始终是"原有自带记录"的标准答案。 */
  function originalLog(user) {
    var src = (window.SJSD && window.SJSD.baseLog) ? window.SJSD.baseLog : [];
    if (!user) return src.slice();
    return src.filter(function (e) { return e.user === user; });
  }

  /* 当前记录是否已经和系统原有的记录一致。
     直接逐条比：时间、内容、账号，一条都不能多、不能少、不能改。
     另外要求本次登录产生的记录已经清空（sess 记录为 0 条）。 */
  function logsMatch(user) {
    if (userLog().some(function (e) { return e.user === user; })) return false;
    var cur = all(user), org = originalLog(user);
    if (cur.length !== org.length) return false;
    return cur.every(function (e, i) {
      return e.ts === org[i].ts && e.text === org[i].text && e.user === org[i].user;
    });
  }

  function done(user) {
    return getFlag(user, 'incorrect') === false;
  }

  /* 统一的判定：当前记录和原有记录一致就算"正确消除记录"。 */
  function judge(user) {
    setFlag(user, 'incorrect', !logsMatch(user));
  }

  /* 执行逐条删除。原有的历史记录也可以删（结局只看最终记录是否和原有记录一致）。 */
  function remove(user, indices) {
    if (!indices.length) return { ok: false, msg: '请先勾选要删除的记录。' };

    var entries = all(user);
    var mineSel = [];
    indices.forEach(function (i) {
      var e = entries[i];
      if (e && isMine(e, user)) mineSel.push(e);
    });
    if (!mineSel.length) return { ok: false, msg: '请先勾选要删除的记录。' };

    var removed = strip(mineSel);

    /* 删除动作本身也是一条记录（无痕模式除外） */
    push(user, '删除操作记录：' + removed + ' 条');

    judge(user);
    return { ok: true, msg: '已删除 ' + removed + ' 条记录。' };
  }

  /* 重置记录：把日志恢复到本次登录之前的状态（原有的记录一条不差地回来）。
     只动本账号的日志，别的账号的日志一概不碰。
     恢复动作本身也会留下一条记录（无痕模式除外）。
     只重置日志，不碰运行模式 / 无痕模式。 */
  function reset(user) {
    seedBase(true);
    /* 清掉本账号的本次操作记录，保留其他账号的 */
    writeLog(K_USER, userLog().filter(function (e) { return e.user !== user; }));

    push(user, '恢复记录：已恢复至本次登录前的记录状态');
    judge(user);

    return { ok: true, msg: '已恢复至本次登录前的记录状态。' };
  }

  window.SJSDLog = {
    init: init,
    setFlag: setFlag,
    getFlag: getFlag,
    base: base,
    userLog: userLog,
    all: all,
    originalLog: originalLog,
    logsMatch: logsMatch,
    push: push,
    list: list,
    done: done,
    remove: remove,
    reset: reset,
    esc: esc,
    nowStr: nowStr,
    isGhost: isGhost,
    setGhost: setGhost,
    ghostKey: ghostKey,
    /* 供结局页显示「远程模式」这一项 */
    modeLabel: function (m) {
      if (m === 'normal') return '正常模式（不进行抽取）';
      if (m === 'test') return '测试模式（不进行实际抽取）';
      if (m === 'strong') return '强力模式（进行超额抽取）';
      return '未配置';
    },
    /* 供结局页显示「消除记录」这一项：只看当前记录是否和原有记录一致 */
    wipeSummary: function (user) {
      return logsMatch(user) ? '已清理' : '未清理';
    },
    KEYS: { base: K_BASE, user: K_USER, state: K_STATE, seed: K_SEED }
  };
})();

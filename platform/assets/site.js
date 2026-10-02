/* 山经书店在线服务平台 · 共用脚本 */
(function () {
  'use strict';

  /* 页脚年份 */
  function stampYear() {
    var y = String(new Date().getFullYear());
    Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
      el.textContent = y;
    });
  }

  /* 简易标签页：<button data-tab="x"> 与 <div data-panel="x"> */
  function initTabs() {
    var tabs = document.querySelectorAll('[data-tab]');
    if (!tabs.length) return;
    Array.prototype.forEach.call(tabs, function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-tab');
        Array.prototype.forEach.call(tabs, function (b) {
          var on = b === btn;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        Array.prototype.forEach.call(document.querySelectorAll('[data-panel]'), function (p) {
          p.classList.toggle('hidden', p.getAttribute('data-panel') !== key);
        });
      });
    });
  }

  /* 表单提交：校验通过后给出反馈，不真正发请求 */
  function initForms() {
    Array.prototype.forEach.call(document.querySelectorAll('form[data-demo]'), function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var out = form.querySelector('[data-form-status]');
        var bad = null;
        Array.prototype.forEach.call(form.querySelectorAll('[required]'), function (el) {
          if (bad) return;
          if (el.type === 'checkbox' ? !el.checked : !String(el.value).trim()) bad = el;
        });
        if (bad) {
          if (out) { out.className = 'status err'; out.textContent = '请完整填写带 * 的必填项。'; }
          bad.focus();
          return;
        }
        if (out) { out.className = 'status ok'; out.textContent = form.getAttribute('data-done') || '已提交。'; }
        Array.prototype.forEach.call(form.querySelectorAll('input, select, textarea, button'), function (el) {
          el.disabled = true;
        });
      });
    });
  }

  /* 点击复制 */
  function initCopy() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'), function (btn) {
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-copy');
        var old = btn.getAttribute('data-label') || btn.textContent;
        var done = function () {
          btn.textContent = '已复制';
          setTimeout(function () { btn.textContent = old; }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(done);
        } else { done(); }
      });
    });
  }

  /* 点击页眉/页脚的电话号码，弹出一句想不起来的印象。
     用的是浏览器自带的弹窗，和预约页的《数据采集知情同意书》同一套做法。 */
  var PEEK_TEXT = '87，143，212，0，这串数字你似乎听刘天清说过，但是不记得是什么意思了。';

  function initPhonePeek() {
    var phones = document.querySelectorAll('.hm-phone');
    if (!phones.length) return;

    function show() { alert(PEEK_TEXT); }

    Array.prototype.forEach.call(phones, function (el) {
      el.setAttribute('tabindex', '0');
      el.addEventListener('click', function (e) { e.preventDefault(); show(); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    stampYear();
    initTabs();
    initForms();
    initCopy();
    initPhonePeek();
  });
})();

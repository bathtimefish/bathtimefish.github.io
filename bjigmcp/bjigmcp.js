/* BraveJIG MCP Server product page — hero chat demo */
(function () {
  'use strict';

  var chat = document.getElementById('chat');
  if (!chat) return;

  // A short exchange: the agent calls MCP tools and answers from real data.
  var SCRIPT = [
    { role: 'user', text: '倉庫の照明、消えてる？' },
    { role: 'tool', name: 'get_environment', args: 'router: "lab-usb"' },
    { role: 'tool', name: 'sensor_read', args: 'module_id: "2468800203400004"' },
    { role: 'json', text: '{"sensor_id":"0121","device_id":"2468800203400004","battery_level":100,"sampling_time_unix":1788679558,"lux":[2.11]}' },
    { role: 'agent', text: '倉庫の照度センサーは 2.1 lx でした。照明は消えています。バッテリーも 100% で問題ありません。' },
    { role: 'user', text: '送信間隔を10分にして' },
    { role: 'tool', name: 'module_set_parameters', args: 'sensor_uplink_interval: 600' },
    { role: 'agent', text: '送信間隔を 600 秒に変更し、読み戻して反映を確認しました。' }
  ];

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  function bubble(item) {
    var el = document.createElement('div');
    el.className = 'mc-msg mc-msg-' + item.role;
    if (item.role === 'tool') {
      el.innerHTML = '<span class="mc-tool-badge">tool</span><code>' + esc(item.name) + '</code><span class="mc-tool-args">' + esc(item.args) + '</span>';
    } else if (item.role === 'json') {
      el.innerHTML = '<code>' + esc(item.text) + '</code>';
    } else {
      el.textContent = item.text;
    }
    return el;
  }

  function typing() {
    var el = document.createElement('div');
    el.className = 'mc-msg mc-msg-agent mc-typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    return el;
  }

  if (reduced) {
    SCRIPT.slice(0, 5).forEach(function (it) { chat.appendChild(bubble(it)); });
    return;
  }

  var i = 0, typ = null;
  function step() {
    if (typ) { chat.removeChild(typ); typ = null; }
    if (i >= SCRIPT.length) {
      setTimeout(function () { chat.innerHTML = ''; i = 0; setTimeout(step, 600); }, 4000);
      return;
    }
    var item = SCRIPT[i++];
    chat.appendChild(bubble(item));
    chat.scrollTop = chat.scrollHeight;
    var next = SCRIPT[i];
    var delay = item.role === 'user' ? 700 : item.role === 'tool' ? 900 : item.role === 'json' ? 800 : 2200;
    if (next && next.role === 'agent') {
      typ = typing();
      chat.appendChild(typ);
      chat.scrollTop = chat.scrollHeight;
      delay += 600;
    }
    setTimeout(step, delay);
  }
  setTimeout(step, 600);
})();

/* Kraken product page — interactive flow builder, copy buttons */
(function () {
  'use strict';

  var INPUTS = {
    webhook:   { label: 'HTTP Webhooks', provider: 'webhook',   payload: '{"id":"101", "name":"env-sensor", "temp":"25.6", "hum":"52.4"}' },
    mqtt:      { label: 'MQTT',          provider: 'mqtt',      payload: 'topic=sensor/env {"temp":25.6, "hum":52.4}' },
    websocket: { label: 'WebSocket',     provider: 'websocket', payload: '{"event":"door", "state":"open"}' },
    ibeacon:   { label: 'iBeacon (BLE)', provider: 'ibeacon',   payload: '{"uuid":"E2C5…", "major":1, "minor":12, "rssi":-67}' },
    serial:    { label: 'Serial',        provider: 'serial',    payload: '"$T,25.6,52.4\\n"  (/dev/ttyACM0)' },
    textfile:  { label: 'TextFile',      provider: 'textfile',  payload: 'data/data.txt (modified)' },
    camera:    { label: 'Camera',        provider: 'camera',    payload: 'image/jpeg 84 KB (every 5s)' },
    email:     { label: 'Email (SMTP)',  provider: 'email',     payload: '{"from":"plc@example.com", "subject":"ALARM: line-3"}' },
    bravejig:  { label: 'BraveJIG',      provider: 'bjig',      payload: '{"module":"0x0123", "temp":25.6, "hum":52.4}' },
    tcp:       { label: 'TCP Server',    provider: 'tcp',       payload: '00 01 02 03 FF  (5 bytes, raw)' }
  };
  var EN = document.documentElement.lang === 'en';
  var OUTPUTS = {
    slack:     { label: 'Slack',         action: EN ? 'Notify a Slack channel' : 'Slack チャンネルへ通知' },
    influxdb:  { label: 'InfluxDB',      action: EN ? 'Store as time series in InfluxDB' : 'InfluxDB に時系列データとして保存' },
    redis:     { label: 'Redis',         action: EN ? 'Cache the latest values in Redis' : 'Redis に最新値をキャッシュ' },
    mongodb:   { label: 'MongoDB',       action: EN ? 'Store as documents in MongoDB' : 'MongoDB にドキュメントとして保存' },
    websocket: { label: 'WebSocket',     action: EN ? 'Push to dashboards over WebSocket' : 'WebSocket でダッシュボードへ配信' },
    custom:    { label: 'Custom Broker', action: EN ? 'Run your business logic in a custom Broker' : '自作 Broker で業務ロジックを実行' }
  };

  var builder = document.getElementById('builder');
  var traceIn = document.getElementById('trace-in');
  var traceOut = document.getElementById('trace-out');
  var traceLog = document.getElementById('trace-log');
  var current = { in: 'webhook', out: 'slack' };

  function render() {
    var i = INPUTS[current.in], o = OUTPUTS[current.out];
    if (!i || !o) return;
    traceIn.textContent = i.label;
    traceOut.textContent = o.label;
    traceLog.innerHTML = '';
    var l1 = document.createElement('span');
    l1.className = 'kr-log-line';
    l1.innerHTML = '<span class="kr-log-tag kr-log-collector">collector</span> kind=collector, provider=' + esc(i.provider) + ', payload=' + esc(i.payload);
    var l2 = document.createElement('span');
    l2.className = 'kr-log-line';
    l2.innerHTML = '<span class="kr-log-tag kr-log-broker">broker</span> → ' + esc(o.action);
    traceLog.appendChild(l1);
    traceLog.appendChild(l2);
    traceLog.classList.remove('is-flash');
    void traceLog.offsetWidth;
    traceLog.classList.add('is-flash');
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  if (builder && traceIn && traceOut && traceLog) {
    builder.addEventListener('click', function (e) {
      var chip = e.target.closest('.kr-chip');
      if (!chip) return;
      var key = chip.dataset['in'] ? 'in' : 'out';
      var group = chip.parentNode;
      group.querySelectorAll('.kr-chip').forEach(function (c) { c.classList.remove('is-active'); c.setAttribute('aria-pressed', 'false'); });
      chip.classList.add('is-active');
      chip.setAttribute('aria-pressed', 'true');
      current[key] = chip.dataset[key];
      render();
    });
    builder.querySelectorAll('.kr-chip').forEach(function (c) {
      c.setAttribute('aria-pressed', c.classList.contains('is-active') ? 'true' : 'false');
    });
    render();
  }

  // Copy buttons for quick start
  document.querySelectorAll('.kr-copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var code = btn.parentNode.querySelector('code');
      if (!code || !navigator.clipboard) return;
      navigator.clipboard.writeText(code.textContent).then(function () {
        btn.textContent = 'Copied';
        btn.classList.add('is-done');
        setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('is-done'); }, 1600);
      });
    });
  });

})();

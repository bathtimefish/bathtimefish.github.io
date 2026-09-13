/* BraveJIG CLI product page — hero terminal demo */
(function () {
  'use strict';

  var cmdEl = document.getElementById('term-cmd');
  var outEl = document.getElementById('term-out');
  var curEl = document.getElementById('term-cursor');
  if (!cmdEl || !outEl) return;

  var COMMAND = 'bjig --port /dev/ttyACM0 monitor';
  // Sample uplink lines (NDJSON) in the format the CLI prints.
  var LINES = [
    '{"type":"usb","device_id":"2468800203400004","sensor_id":"0121","rssi":-42,"battery_level":100,"sampling_time_unix":1788679558,"lux":[2.11]}',
    '{"type":"usb","device_id":"246880020440000F","sensor_id":"0122","rssi":-39,"battery_level":100,"sampling_time_unix":1788679566,"samples":[{"x":-58.56,"y":-714.43,"z":-651.97}]}',
    '{"type":"usb","device_id":"2468800203400004","sensor_id":"0121","rssi":-41,"battery_level":100,"sampling_time_unix":1788679618,"lux":[2.15]}',
    '{"type":"usb","device_id":"246880020440000F","sensor_id":"0122","rssi":-40,"battery_level":100,"sampling_time_unix":1788679626,"samples":[{"x":-57.9,"y":-713.8,"z":-652.4}]}'
  ];

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function highlight(line) {
    // colour keys and sensor ids lightly
    return line
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/"([a-z_]+)":/g, '<span class="k">"$1"</span>:')
      .replace(/"(0121|0122|0123)"/g, '<span class="s">"$1"</span>')
      .replace(/(-?\d+\.\d+)/g, '<span class="n">$1</span>');
  }

  function printLine(i) {
    var span = document.createElement('span');
    span.className = 'bj-term-line';
    span.innerHTML = highlight(LINES[i]) + '\n';
    outEl.appendChild(span);
    while (outEl.children.length > 4) outEl.removeChild(outEl.firstChild);
  }

  if (reduced) {
    cmdEl.textContent = COMMAND;
    curEl.style.display = 'none';
    LINES.slice(0, 3).forEach(function (_, i) { printLine(i); });
    return;
  }

  var pos = 0, lineIdx = 0;
  function typeNext() {
    if (pos < COMMAND.length) {
      cmdEl.textContent = COMMAND.slice(0, ++pos);
      setTimeout(typeNext, 45 + Math.random() * 40);
    } else {
      setTimeout(emit, 600);
    }
  }
  function emit() {
    printLine(lineIdx % LINES.length);
    lineIdx++;
    if (lineIdx < 12) {
      setTimeout(emit, 1400 + Math.random() * 900);
    } else {
      // restart the demo
      setTimeout(function () {
        outEl.innerHTML = '';
        cmdEl.textContent = '';
        pos = 0; lineIdx = 0;
        setTimeout(typeNext, 400);
      }, 2500);
    }
  }
  setTimeout(typeNext, 500);
})();

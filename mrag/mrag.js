/* mrag product page — hero terminal demo + copy buttons */
(function () {
  'use strict';

  // ---------- Terminal demo ----------
  var cmdEl = document.getElementById('term-cmd');
  var outEl = document.getElementById('term-out');
  var curEl = document.getElementById('term-cursor');

  // Each step: the command typed at the prompt, then the lines it prints.
  // Output formats follow what the mrag CLI (1.0.x) actually prints.
  var STEPS = [
    { cmd: 'mrag init my-kb --non-interactive', out: [
      '<span class="ok">✓</span> vaporetto tokenizer detected <span class="dim">(libsqlite_vaporetto.dylib)</span>',
      '<span class="ok">✓</span> Created directory structure',
      '<span class="ok">✓</span> Generated mrag.yaml',
      '<span class="ok">✓</span> Generated profiles/default.yaml',
      '<span class="ok">✓</span> Generated kb_information.yaml',
      '<span class="ok">✓</span> Initialized mrag.db'
    ] },
    { cmd: 'cd my-kb', out: [] },
    { cmd: "mrag add ../documents --recursive --include '**/*.md'", out: [
      '<span class="ok">✓</span> Added <span class="k">rules/travel-expense.md</span>',
      '<span class="ok">✓</span> Added <span class="k">rules/attendance.md</span>',
      '<span class="ok">✓</span> Added <span class="k">manuals/onboarding.md</span>',
      '<span class="dim">  …</span>',
      'Summary: <span class="n">12</span> added, <span class="n">0</span> skipped, <span class="n">0</span> failed',
      '  Run <span class="q">mrag index</span> to build the retrieval index.'
    ] },
    { cmd: 'mrag index', out: [
      '<span class="ok">✓</span> Indexed: <span class="n">12</span>  Up-to-date: <span class="n">0</span>  List-skipped: <span class="n">0</span>',
      '<span class="dim">Log: logs/20260915101000-index.json</span>'
    ] },
    { cmd: 'mrag search "出張時の宿泊費の上限"', out: [
      '[1] score=<span class="n">6.39</span>  doc=<span class="k">rules/travel-expense.md</span>  chunk=<span class="dim">eb0495d2...</span>',
      '    <span class="q">国内出張の宿泊費は、1泊あたり上限額の範囲内で実費精算とする…</span>',
      '',
      '[2] score=<span class="n">5.81</span>  doc=<span class="k">rules/travel-expense.md</span>  chunk=<span class="dim">3fa12c11...</span>',
      '    <span class="q">上限を超える場合は事前に所属長の承認を得ること…</span>',
      '',
      '<span class="dim">Score stats:  min=5.81  max=6.39  mean=6.10</span>',
      '<span class="dim">Document distribution:</span>',
      '<span class="dim">  rules/travel-expense.md   ████████████████████ 3</span>'
    ] }
  ];
  var MAX_LINES = 14;

  function addLine(html, isCmd) {
    var span = document.createElement('span');
    span.className = 'mr-term-line' + (isCmd ? ' is-cmd' : '');
    span.innerHTML = html + '\n';
    outEl.appendChild(span);
    while (outEl.children.length > MAX_LINES) outEl.removeChild(outEl.firstChild);
    // Never clip a partial line at the top: drop old lines until everything fits.
    var body = outEl.parentNode;
    while (outEl.children.length > 1 && body.scrollHeight > body.clientHeight) outEl.removeChild(outEl.firstChild);
  }

  if (cmdEl && outEl) {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      // Static rendering: show the whole session at once.
      STEPS.forEach(function (s) {
        addLine(s.cmd, true);
        s.out.forEach(function (l) { addLine(l, false); });
      });
      curEl.style.display = 'none';
    } else {
      var stepIdx = 0, pos = 0;

      function typeCmd() {
        var cmd = STEPS[stepIdx].cmd;
        if (pos < cmd.length) {
          cmdEl.textContent = cmd.slice(0, ++pos);
          setTimeout(typeCmd, 38 + Math.random() * 40);
        } else {
          setTimeout(runCmd, 450);
        }
      }
      function runCmd() {
        var step = STEPS[stepIdx];
        addLine(step.cmd, true);
        cmdEl.textContent = '';
        pos = 0;
        var i = 0;
        function emit() {
          if (i < step.out.length) {
            addLine(step.out[i++], false);
            setTimeout(emit, stepIdx === 3 ? 900 : 140 + Math.random() * 160);
          } else {
            stepIdx++;
            if (stepIdx < STEPS.length) {
              setTimeout(typeCmd, 700);
            } else {
              // hold the result, then restart the demo
              setTimeout(function () {
                outEl.innerHTML = '';
                stepIdx = 0; pos = 0;
                setTimeout(typeCmd, 500);
              }, 7000);
            }
          }
        }
        // `mrag index` takes a moment: show the command, pause, then the summary
        setTimeout(emit, stepIdx === 3 ? 1200 : 250);
      }
      setTimeout(typeCmd, 600);
    }
  }

  // ---------- Copy buttons ----------
  document.querySelectorAll('.mr-copy').forEach(function (btn) {
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

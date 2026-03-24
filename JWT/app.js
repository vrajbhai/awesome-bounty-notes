// ===== JWT HACKER — APP.JS =====

// ===== CANVAS BACKGROUND =====
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initParticles() {
  particles = [];
  const count = Math.floor((canvas.width * canvas.height) / 18000);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.3,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.7 ? '#00e5ff' : '#a55eea'
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.opacity;
    ctx.fill();
    p.x += p.speedX;
    p.y += p.speedY;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(drawParticles);
}

resizeCanvas();
initParticles();
drawParticles();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

// ===== THEME TOGGLE =====
const themeBtn = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('jwt-theme') || 'dark';
if (savedTheme === 'light') document.documentElement.setAttribute('data-theme', 'light');

themeBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next === 'dark' ? '' : 'light');
  localStorage.setItem('jwt-theme', next);
});

// ===== MOBILE MENU =====
const mobBtn = document.getElementById('mob-menu-btn');
const sidebar = document.getElementById('sidebar');
mobBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
document.getElementById('main').addEventListener('click', () => sidebar.classList.remove('open'));

// ===== ACTIVE NAV ON SCROLL =====
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const sectionMap = {};
navLinks.forEach(l => { sectionMap[l.dataset.section] = l; });

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const link = sectionMap[entry.target.id];
      if (link) link.classList.add('active');
    }
  });
}, { threshold: 0.3, rootMargin: '-100px 0px -60% 0px' });

sections.forEach(s => observer.observe(s));

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById(link.dataset.section);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      sidebar.classList.remove('open');
    }
  });
});

// ===== TOKEN PART DISPLAY =====
function showPart(part) {
  document.querySelectorAll('.part-detail').forEach(d => d.style.display = 'none');
  document.getElementById('detail-' + part).style.display = 'block';
  document.querySelectorAll('.token-part').forEach(p => p.style.borderColor = '');
}

// Show header by default
document.getElementById('detail-header').style.display = 'block';

// ===== PORTSWIGGER LABS DATA =====
const labsData = [
  {
    title: "JWT authentication bypass via unverified signature",
    level: "Apprentice",
    solved: true,
    desc: "Server never calls verify() — only decode(). Modify any claim directly, no signature needed.",
    tags: ["missing validation", "basics"],
    url: "https://portswigger.net/web-security/jwt/lab-jwt-authentication-bypass-via-unverified-signature"
  },
  {
    title: "JWT authentication bypass via flawed signature verification",
    level: "Apprentice",
    solved: true,
    desc: "Server accepts alg:none — strip signature entirely. Try 'none', 'None', 'NONE' variants.",
    tags: ["alg:none", "signature"],
    url: "https://portswigger.net/web-security/jwt/lab-jwt-authentication-bypass-via-flawed-signature-verification"
  },
  {
    title: "JWT authentication bypass via weak signing secret",
    level: "Practitioner",
    solved: true,
    desc: "HS256 with weak secret 'secret1' — brute-force with hashcat -m 16500 + rockyou.txt.",
    tags: ["HS256", "brute-force", "hashcat"],
    url: "https://portswigger.net/web-security/jwt/lab-jwt-authentication-bypass-via-weak-signing-secret"
  },
  {
    title: "JWT authentication bypass via jwk header injection",
    level: "Practitioner",
    solved: true,
    desc: "Server trusts jwk field in token header — generate RSA pair, embed public key, sign with private.",
    tags: ["JWK", "header injection", "CVE-2018-0114"],
    url: "https://portswigger.net/web-security/jwt/lab-jwt-authentication-bypass-via-jwk-header-injection"
  },
  {
    title: "JWT authentication bypass via jku header injection",
    level: "Practitioner",
    solved: true,
    desc: "Server fetches key from jku URL without domain validation — host your public key on exploit server.",
    tags: ["JKU", "exploit server", "RSA"],
    url: "https://portswigger.net/web-security/jwt/lab-jwt-authentication-bypass-via-jku-header-injection"
  },
  {
    title: "JWT authentication bypass via kid header path traversal",
    level: "Practitioner",
    solved: true,
    desc: "kid used as file path — inject ../../dev/null, sign with empty string as HS256 secret.",
    tags: ["kid", "path traversal", "HS256", "/dev/null"],
    url: "https://portswigger.net/web-security/jwt/lab-jwt-authentication-bypass-via-kid-header-path-traversal"
  },
  {
    title: "JWT authentication bypass via algorithm confusion",
    level: "Practitioner",
    solved: true,
    desc: "RS256 → HS256 confusion. Get public key from /jwks.json, convert PEM→Base64, use as HMAC secret.",
    tags: ["RS256→HS256", "confusion", "jwks.json"],
    url: "https://portswigger.net/web-security/jwt/lab-jwt-authentication-bypass-via-algorithm-confusion"
  },
  {
    title: "JWT authentication bypass via algorithm confusion with no exposed key",
    level: "Expert",
    solved: true,
    desc: "No /jwks.json — collect 2 tokens, run sig2n Docker tool to derive public key, then algo confusion.",
    tags: ["Expert", "Docker", "sig2n", "key derivation", "hidden key"],
    url: "https://portswigger.net/web-security/jwt/lab-jwt-authentication-bypass-via-algorithm-confusion-with-no-exposed-key"
  }
];

function renderLabs() {
  const grid = document.getElementById('labs-grid');
  const banner = document.getElementById('labs-banner');
  const allSolved = labsData.every(l => l.solved);
  const solvedCount = labsData.filter(l => l.solved).length;
  if (banner) {
    banner.innerHTML = allSolved
      ? `<div class="labs-complete-banner">🏆 ALL ${solvedCount}/${labsData.length} LABS COMPLETED — PortSwigger JWT Path 100%</div>`
      : `<div class="labs-progress-banner">${solvedCount}/${labsData.length} labs solved</div>`;
  }
  grid.innerHTML = labsData.map((lab, i) => `
    <div class="lab-card ${lab.solved ? 'solved' : 'unsolved'}">
      <div class="lc-header">
        <div class="lc-title">${lab.title}</div>
        <div class="lc-status">${lab.solved ? '✅' : '⬜'}</div>
      </div>
      <div class="lc-desc">${lab.desc}</div>
      <div class="lc-tags">
        <span class="badge ${lab.level === 'Expert' ? 'badge-expert' : lab.level === 'Practitioner' ? 'badge-medium' : 'badge-low'}">${lab.level}</span>
        ${lab.tags.map(t => `<span class="badge badge-tool">${t}</span>`).join('')}
      </div>
      ${lab.url ? `<a class="lab-link" href="${lab.url}" target="_blank">Open Lab →</a>` : ''}
    </div>
  `).join('');
}

renderLabs();

// ===== CHECKLIST =====
const CHECKLIST_KEY = 'jwt-checklist';
let checkedItems = JSON.parse(localStorage.getItem(CHECKLIST_KEY) || '{}');

function updateProgress() {
  const all = document.querySelectorAll('.check-item');
  const done = document.querySelectorAll('.check-item.checked');
  const pct = all.length ? (done.length / all.length) * 100 : 0;
  document.getElementById('cp-fill').style.width = pct + '%';
  document.getElementById('cp-label').textContent = `${done.length} / ${all.length} checked`;
}

function toggleCheck(el) {
  const id = el.dataset.id;
  el.classList.toggle('checked');
  const box = el.querySelector('.ci-box');
  if (el.classList.contains('checked')) {
    box.textContent = '✓';
    checkedItems[id] = true;
  } else {
    box.textContent = '';
    delete checkedItems[id];
  }
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checkedItems));
  updateProgress();
}

function checkAll() {
  document.querySelectorAll('.check-item').forEach(el => {
    el.classList.add('checked');
    el.querySelector('.ci-box').textContent = '✓';
    checkedItems[el.dataset.id] = true;
  });
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checkedItems));
  updateProgress();
}

function clearAll() {
  document.querySelectorAll('.check-item').forEach(el => {
    el.classList.remove('checked');
    el.querySelector('.ci-box').textContent = '';
  });
  checkedItems = {};
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checkedItems));
  updateProgress();
}

// Restore saved state
document.querySelectorAll('.check-item').forEach(el => {
  if (checkedItems[el.dataset.id]) {
    el.classList.add('checked');
    el.querySelector('.ci-box').textContent = '✓';
  }
});

updateProgress();

// ===== NOTES SYSTEM =====
const NOTES_KEY = 'jwt-notes';
let notes = JSON.parse(localStorage.getItem(NOTES_KEY) || '[]');

const NOTE_TAGS = ['general', 'attack', 'lab', 'bounty', 'tool', 'reminder'];
const NOTE_COLORS = {
  general: '#8892a4',
  attack: '#ff4757',
  lab: '#00e5ff',
  bounty: '#2ed573',
  tool: '#a55eea',
  reminder: '#ffa502'
};

if (notes.length === 0) {
  notes = [
    { id: 1, title: 'JKU Injection — Key Insight', tag: 'attack', content: 'Server fetches public key from URL in jku header. No domain whitelist check = we control which key it uses.\n\nSteps:\n1. Generate RSA key in JWT Editor\n2. Host public key on exploit server\n3. Set jku = exploit server URL in header\n4. Sign with our private key\n5. Server verifies with our public key → ✓' },
    { id: 2, title: 'Algorithm Confusion Trick', tag: 'attack', content: 'Change alg from RS256 → HS256\nServer uses PUBLIC key as HMAC secret\nWe sign with same public key (we got it from /jwks.json)\nMath matches → access granted\n\nKey cmd: JWK → PEM → Base64 → put in symmetric key k value' },
    { id: 3, title: 'Platforms to Hunt JWT Bugs', tag: 'bounty', content: '- HackerOne: most programs, disclosed reports to study\n- Intigriti/YesWeHack: European, less saturated\n- Private programs: fewer hunters, better ROI\n\nTarget: API-heavy apps, SSO flows, OAuth implementations' }
  ];
  savNotes();
}

function savNotes() {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function renderNotes() {
  const container = document.getElementById('notes-container');
  if (notes.length === 0) {
    container.innerHTML = '<p style="color:var(--text3); font-size:14px; text-align:center; padding:40px 0">No notes yet. Click "+ New Note" to start.</p>';
    return;
  }
  container.innerHTML = notes.map(note => `
    <div class="note-card" data-note-id="${note.id}" style="border-left: 3px solid ${NOTE_COLORS[note.tag] || NOTE_COLORS.general}">
      <div class="note-header">
        <input class="note-title-input" value="${escHtml(note.title)}" placeholder="Note title..." 
          oninput="updateNoteField(${note.id}, 'title', this.value)" />
        <select class="note-tag-select" onchange="updateNoteField(${note.id}, 'tag', this.value)" style="color:${NOTE_COLORS[note.tag]}">
          ${NOTE_TAGS.map(t => `<option value="${t}" ${note.tag === t ? 'selected' : ''} style="color:${NOTE_COLORS[t]}">${t}</option>`).join('')}
        </select>
        <button class="note-delete" onclick="deleteNote(${note.id})" title="Delete note">✕</button>
      </div>
      <textarea class="note-textarea" placeholder="Write your notes here... attacks, insights, commands, anything."
        oninput="updateNoteField(${note.id}, 'content', this.value)">${escHtml(note.content)}</textarea>
    </div>
  `).join('');
}

function escHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function addNote() {
  const note = {
    id: Date.now(),
    title: 'New Note',
    tag: 'general',
    content: ''
  };
  notes.unshift(note);
  savNotes();
  renderNotes();
  const container = document.getElementById('notes-container');
  container.firstElementChild.querySelector('.note-title-input').focus();
  container.firstElementChild.querySelector('.note-title-input').select();
}

function deleteNote(id) {
  if (!confirm('Delete this note?')) return;
  notes = notes.filter(n => n.id !== id);
  savNotes();
  renderNotes();
}

function updateNoteField(id, field, value) {
  const note = notes.find(n => n.id === id);
  if (note) {
    note[field] = value;
    savNotes();
    if (field === 'tag') {
      const card = document.querySelector(`[data-note-id="${id}"]`);
      if (card) {
        card.style.borderLeftColor = NOTE_COLORS[value] || NOTE_COLORS.general;
        card.querySelector('.note-tag-select').style.color = NOTE_COLORS[value];
      }
    }
  }
}

function exportNotes() {
  const text = notes.map(n => `# ${n.title} [${n.tag}]\n\n${n.content}`).join('\n\n---\n\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'jwt-notes.txt';
  a.click();
}

renderNotes();

// ===== JWT DECODER =====
function b64urlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  try {
    return JSON.parse(atob(str));
  } catch {
    return atob(str);
  }
}

function syntaxHighlight(obj) {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/(".*?")\s*:/g, '<span style="color:#5b9fff">$1</span>:')
             .replace(/:\s*(".*?")/g, ': <span style="color:#2ed573">$1</span>')
             .replace(/:\s*(\d+)/g, ': <span style="color:#ffa502">$1</span>')
             .replace(/:\s*(true|false|null)/g, ': <span style="color:#a55eea">$1</span>');
}

function decodeJWT() {
  const input = document.getElementById('decoder-input').value.trim();
  const outputEl = document.getElementById('decoder-output');
  const errorEl = document.getElementById('decoder-error');

  outputEl.style.display = 'none';
  errorEl.style.display = 'none';

  if (!input) {
    errorEl.textContent = '⚠ Please paste a JWT token first.';
    errorEl.style.display = 'block';
    return;
  }

  const parts = input.split('.');
  if (parts.length !== 3) {
    errorEl.textContent = `✕ Invalid JWT format. Expected 3 parts (header.payload.signature) but got ${parts.length}.`;
    errorEl.style.display = 'block';
    return;
  }

  try {
    const header = b64urlDecode(parts[0]);
    const payload = b64urlDecode(parts[1]);

    document.getElementById('do-header').innerHTML = syntaxHighlight(header);
    document.getElementById('do-payload').innerHTML = syntaxHighlight(payload);
    document.getElementById('do-sig').innerHTML = `<span style="color:#4a5568">${parts[2] || '(empty — no signature!)'}</span>`;

    // Header warnings
    const hw = [];
    if (header.alg === 'none' || header.alg === 'None' || header.alg === 'NONE') {
      hw.push({ text: '🔴 CRITICAL: alg is "none" — no signature verification! Token can be forged.', critical: true });
    }
    if (header.alg === 'HS256') {
      hw.push({ text: '⚠ HS256: Try brute-forcing the secret with hashcat + rockyou.txt', critical: false });
    }
    if (header.alg && header.alg.startsWith('RS') && !header.jku && !header.jwk) {
      hw.push({ text: '💡 RS256: Check /jwks.json — if public key exposed, try algorithm confusion attack', critical: false });
    }
    if (header.jku) {
      hw.push({ text: `🔴 CRITICAL: jku header found → "${header.jku}" — test JKU injection!`, critical: true });
    }
    if (header.jwk) {
      hw.push({ text: '🔴 CRITICAL: jwk header found — server may trust embedded key. Test JWK injection!', critical: true });
    }
    if (header.kid) {
      hw.push({ text: `⚠ kid header found: "${header.kid}" — test path traversal (../../dev/null) and SQLi`, critical: false });
    }
    if (header.x5c) {
      hw.push({ text: '⚠ x5c header found — test certificate chain injection', critical: false });
    }

    const hwEl = document.getElementById('header-warnings');
    hwEl.innerHTML = hw.map(w => `<div class="dw-item ${w.critical ? 'critical' : ''}">${w.text}</div>`).join('');

    // Payload warnings
    const pw = [];
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      pw.push({ text: `⚠ Token EXPIRED at ${new Date(payload.exp * 1000).toLocaleString()} — test if server still accepts it!`, critical: false });
    }
    if (!payload.exp) {
      pw.push({ text: '⚠ No exp claim — token may never expire! Check if server enforces expiry.', critical: false });
    }
    if (payload.sub) {
      pw.push({ text: `💡 sub: "${payload.sub}" — try changing to "administrator" or other users`, critical: false });
    }
    if (payload.role || payload.isAdmin !== undefined || payload.admin !== undefined) {
      pw.push({ text: '🔴 Role/admin claims found in payload — try escalating privileges!', critical: true });
    }
    if (!payload.iss) {
      pw.push({ text: '⚠ No iss claim — issuer not enforced. Try cross-service token usage.', critical: false });
    }

    const pwEl = document.getElementById('payload-warnings');
    pwEl.innerHTML = pw.map(w => `<div class="dw-item ${w.critical ? 'critical' : ''}">${w.text}</div>`).join('');

    // Summary findings
    const allFindings = [...hw, ...pw];
    const criticalCount = allFindings.filter(f => f.critical).length;
    const totalCount = allFindings.length;

    document.getElementById('decoder-findings').innerHTML = `
      <div class="df-title">🔎 Analysis Summary</div>
      <div class="df-item">
        <span class="df-icon">📋</span>
        <span class="df-text">Algorithm: <strong>${header.alg || 'not set'}</strong></span>
      </div>
      <div class="df-item">
        <span class="df-icon">👤</span>
        <span class="df-text">Subject (sub): <strong>${payload.sub || 'not set'}</strong></span>
      </div>
      <div class="df-item">
        <span class="df-icon">⏰</span>
        <span class="df-text">Expiry: <strong>${payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'none'}</strong>
          ${payload.exp && payload.exp < now ? ' <span style="color:var(--red)">[EXPIRED]</span>' : payload.exp ? ' <span style="color:var(--green)">[valid]</span>' : ' <span style="color:var(--yellow)">[no expiry]</span>'}
        </span>
      </div>
      <div class="df-item">
        <span class="df-icon">${criticalCount > 0 ? '🔴' : totalCount > 0 ? '🟡' : '🟢'}</span>
        <span class="df-text">Found <strong style="color:${criticalCount > 0 ? 'var(--red)' : 'var(--yellow)'}">${criticalCount} critical</strong> and <strong>${totalCount - criticalCount} warning</strong> findings</span>
      </div>
      ${!parts[2] ? '<div class="df-item"><span class="df-icon">🔴</span><span class="df-text"><strong style="color:var(--red)">No signature</strong> — token is unsigned!</span></div>' : ''}
    `;

    outputEl.style.display = 'block';
  } catch (e) {
    errorEl.textContent = '✕ Failed to decode token: ' + e.message;
    errorEl.style.display = 'block';
  }
}

function clearDecoder() {
  document.getElementById('decoder-input').value = '';
  document.getElementById('decoder-output').style.display = 'none';
  document.getElementById('decoder-error').style.display = 'none';
}

// Decode on Enter + paste
document.getElementById('decoder-input').addEventListener('paste', () => {
  setTimeout(decodeJWT, 100);
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', e => {
  if (e.key === '/' && !e.ctrlKey && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
    e.preventDefault();
    document.getElementById('decoder-input').focus();
    document.getElementById('decoder').scrollIntoView({ behavior: 'smooth' });
  }
});

// ===== INIT =====
console.log(`
%c{JWT} HACKER
%cYour complete JWT security revision site.
Press / to jump to the decoder.
`, 'color:#00e5ff; font-family:monospace; font-size:18px; font-weight:bold;', 'color:#8892a4; font-family:monospace;');

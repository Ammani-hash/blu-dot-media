/* ============================================
   BLUE DOT MEDIA — PREMIERE PRO TIMELINE PORTFOLIO
   Playhead animation, project switching, interactions
   ============================================ */

// --- Clip Layout (percentages of timeline width) ---
const clipLayout = projects.map(function (_, i) {
  var segment = 100 / projects.length;
  return { start: i * segment, end: i * segment + segment - 1, projectIndex: i };
});

// --- State ---
let isPlaying = true;
let playheadPos = 0;
// Play time per clip, not a fixed total — so adding more projects gives
// the reel more runtime instead of silently shrinking each clip's slice.
const SECONDS_PER_PROJECT = 6;
const duration = SECONDS_PER_PROJECT * projects.length * 1000;
let startTime = null;
let currentProjectIndex = -1;
let transitionTimer = null;

// Fixed pixel width per clip on the scrollable timeline — keeps clips
// a comfortable, constant size instead of squeezing as more projects
// are added. The track area is only made this wide when it actually
// needs to be (see layoutTimelineWidth); otherwise it fills the view.
const CLIP_WIDTH_PX = 200;
let timelineContentWidth = 0;

// --- Elements ---
const playhead = document.getElementById('playhead');
const timecodeEl = document.getElementById('timecode');
const projectDisplay = document.getElementById('projectDisplay');
const playPauseBtn = document.getElementById('playPause');
const stepBackBtn = document.getElementById('stepBack');
const stepForwardBtn = document.getElementById('stepForward');
const timelineScroll = document.getElementById('timelineScroll');
const trackArea = document.getElementById('trackArea');

// --- Initialize ---
function init() {
  layoutTimelineWidth();
  generateRuler();
  generateClips();

  const clipCountEl = document.querySelector('.tool-info');
  if (clipCountEl) clipCountEl.textContent = projects.length + ' CLIPS';

  currentProjectIndex = 0;
  renderProject(0);
  updateActiveClip(0);

  startTime = performance.now();
  requestAnimationFrame(animate);

  window.addEventListener('resize', function () {
    layoutTimelineWidth();
    updatePlayhead();
  });
}

// --- Timeline Width (drives horizontal scroll once clips outgrow the view) ---
function layoutTimelineWidth() {
  timelineContentWidth = Math.max(CLIP_WIDTH_PX * projects.length, timelineScroll.clientWidth);
  trackArea.style.width = timelineContentWidth + 'px';
}

// --- Ruler ---
function generateRuler() {
  const ruler = document.getElementById('ruler');
  var seg = 100 / projects.length;
  var dur = duration / 1000; // total seconds, kept in sync with playback
  var marks = [];
  for (var i = 0; i <= projects.length; i++) {
    var secs = Math.round(dur * i / projects.length);
    var mm = String(Math.floor(secs / 60)).padStart(2, '0');
    var ss = String(secs % 60).padStart(2, '0');
    marks.push({ time: mm + ':' + ss, pos: i * seg });
  }

  marks.forEach(function (m) {
    const mark = document.createElement('div');
    mark.className = 'ruler-mark';
    mark.style.left = m.pos + '%';
    mark.innerHTML =
      '<span class="ruler-tick"></span>' +
      '<span class="ruler-label">' + m.time + '</span>';
    ruler.appendChild(mark);
  });
}

// --- Clips ---
function generateClips() {
  const v1 = document.getElementById('trackV1');
  const v2 = document.getElementById('trackV2');
  const a1 = document.getElementById('trackA1');
  const a2 = document.getElementById('trackA2');

  var seg = 100 / projects.length;

  // V1: Main project clips
  projects.forEach(function (p, i) {
    var clip = createClip(p.title, i * seg, seg - 1, p.color, false);
    clip.dataset.projectIndex = i;
    v1.appendChild(clip);
  });

  // V2: Transition clips (small segments between projects)
  for (let i = 0; i < projects.length; i++) {
    var clip = createClip('', i * seg + seg - 2, 2, '#3a3a38', false);
    v2.appendChild(clip);
  }

  // A1: Audio clips aligned with V1
  projects.forEach(function (p, i) {
    var clip = createClip('', i * seg, seg - 1, '#2d4a3a', true);
    a1.appendChild(clip);
  });

  // A2: Continuous music track
  const music = createClip('', 0, 100, '#2d3a5a', true);
  a2.appendChild(music);
}

function createClip(name, left, width, color, isAudio) {
  const clip = document.createElement('div');
  clip.className = 'clip' + (isAudio ? ' audio-clip' : '');
  clip.style.left = left + '%';
  clip.style.width = width + '%';
  clip.style.background = color;

  if (name) {
    const nameSpan = document.createElement('span');
    nameSpan.className = 'clip-name';
    nameSpan.textContent = name;
    clip.appendChild(nameSpan);
  }

  if (clip.dataset.projectIndex !== undefined || name) {
    clip.addEventListener('click', function () {
      if (clip.dataset.projectIndex !== undefined) {
        jumpToProject(parseInt(clip.dataset.projectIndex));
      }
    });
  }

  return clip;
}

// --- Jump to Project ---
function jumpToProject(index) {
  playheadPos = clipLayout[index].start / 100 + 0.001;
  startTime = performance.now() - (playheadPos * duration);
  updatePlayhead();
  updateTimecode();
  updateMonitor(playheadPos, true);
}

// --- Animation Loop ---
function animate(timestamp) {
  if (!startTime) startTime = timestamp;

  if (isPlaying) {
    const elapsed = timestamp - startTime;
    playheadPos = (elapsed % duration) / duration;

    updatePlayhead();
    updateTimecode();
    updateMonitor(playheadPos);
  }

  requestAnimationFrame(animate);
}

function updatePlayhead() {
  playhead.style.left = (playheadPos * 100) + '%';
  centerScrollOnPlayhead();
}

// Keeps the timeline scrolled so the playhead stays centered in view,
// the way Premiere's playback auto-scroll behaves — called on every
// playhead move (playback, step, clip click) so it always tracks.
function centerScrollOnPlayhead() {
  const playheadPx = playheadPos * timelineContentWidth;
  const viewportWidth = timelineScroll.clientWidth;
  const maxScroll = Math.max(0, timelineContentWidth - viewportWidth);
  const target = Math.min(maxScroll, Math.max(0, playheadPx - viewportWidth / 2));
  timelineScroll.scrollLeft = target;
}

function updateTimecode() {
  const ms = playheadPos * duration;
  const totalFrames = Math.floor(ms / (1000 / 24));
  const frames = totalFrames % 24;
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  timecodeEl.textContent =
    pad(hours) + ':' + pad(minutes) + ':' + pad(seconds) + ':' + pad(frames);
}

function pad(n) {
  return String(n).padStart(2, '0');
}

// --- Monitor Update ---
function updateMonitor(pos, force) {
  let projectIndex = -1;

  for (let i = 0; i < clipLayout.length; i++) {
    const start = clipLayout[i].start / 100;
    const end = clipLayout[i].end / 100;
    if (pos >= start && pos < end) {
      projectIndex = i;
      break;
    }
  }

  if (projectIndex !== currentProjectIndex || force) {
    showProject(projectIndex);
    updateActiveClip(projectIndex);
  }
}

function showProject(index) {
  if (transitionTimer) {
    clearTimeout(transitionTimer);
    transitionTimer = null;
  }

  projectDisplay.style.opacity = '0';

  transitionTimer = setTimeout(function () {
    renderProject(index);
    projectDisplay.style.opacity = '1';
    transitionTimer = null;
  }, 120);

  currentProjectIndex = index;
}

function renderProject(index) {
  if (index === -1) {
    projectDisplay.innerHTML = '<p class="no-signal">—</p>';
  } else {
    const p = projects[index];
    projectDisplay.innerHTML =
      '<div class="project-media">' +
        (p.video ? '<video class="project-video" src="' + p.video + '"' + (p.poster ? ' poster="' + p.poster + '"' : '') + ' muted loop playsinline preload="auto" data-start-at="' + (p.startAt || 0) + '"></video>' : '') +
        '</div>' +
        '<div class="project-overlay">' +
        (p.hideTitle ? '' : '<h1 class="project-name">' + p.title + '</h1>') +
        '<a class="view-project-btn" href="project.html?slug=' + p.slug + '">View Project</a>' +
        '</div>';

    const video = projectDisplay.querySelector('.project-video');
    if (video) {
      const seekAndPlay = function () {
        const startAt = Number(video.dataset.startAt) || 0;
        if (startAt > 0 && video.duration > startAt) {
          video.currentTime = startAt;
        }
        const playback = video.play();
        if (playback) playback.catch(function () {});
      };

      if (video.readyState >= 1) {
        seekAndPlay();
      } else {
        video.addEventListener('loadedmetadata', seekAndPlay, { once: true });
      }
    }
  }
}

function updateActiveClip(index) {
  document.querySelectorAll('.clip.active').forEach(function (c) {
    c.classList.remove('active');
  });

  if (index >= 0) {
    const clip = document.querySelector('.clip[data-project-index="' + index + '"]');
    if (clip) clip.classList.add('active');
  }
}

// --- Play/Pause ---
playPauseBtn.addEventListener('click', function () {
  isPlaying = !isPlaying;

  if (isPlaying) {
    startTime = performance.now() - (playheadPos * duration);
    playPauseBtn.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    playPauseBtn.setAttribute('aria-label', 'Pause');
  } else {
    playPauseBtn.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M8 5v14l11-7z"/></svg>';
    playPauseBtn.setAttribute('aria-label', 'Play');
  }
});

// --- Step Back / Forward (jump to previous/next project) ---
stepBackBtn.addEventListener('click', function () {
  jumpToProject((currentProjectIndex - 1 + projects.length) % projects.length);
});

stepForwardBtn.addEventListener('click', function () {
  jumpToProject((currentProjectIndex + 1) % projects.length);
});

// --- Tool Buttons (cosmetic — toggle active state) ---
document.querySelectorAll('.tool-btn:not([data-theme-toggle])').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.tool-btn.active:not([data-theme-toggle])').forEach(function (b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');
  });
});

// --- Theme Toggle ---
(function () {
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = 'dark';

  function setIcon() {
    if (!toggle) return;
    toggle.setAttribute(
      'aria-label',
      'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode'
    );
    if (theme === 'dark') {
      toggle.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    } else {
      toggle.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }
  }

  setIcon();

  if (toggle) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      setIcon();
    });
  }
})();

// --- Track Toggle Buttons (cosmetic eye/speaker toggle) ---
document.querySelectorAll('.track-toggle').forEach(function (btn) {
  btn.addEventListener('click', function () {
    btn.style.opacity = btn.style.opacity === '0.3' ? '1' : '0.3';
  });
});

// --- Start ---
init();

/* ============================================
   BLU DOT MEDIA — Project Detail Page
   Reads ?slug=... and renders that project's
   entry from the shared `projects` catalogue.
   ============================================ */

function getSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug');
}

function renderNotFound() {
  document.title = 'Project not found — Blu Dot Media';
  document.querySelector('.project-main').innerHTML =
    '<p class="project-not-found">Couldn’t find that project. ' +
    '<a href="index.html">Return to the timeline</a>.</p>';
}

function renderProject(project) {
  document.title = project.title + ' — Blu Dot Media';

  document.getElementById('headerTitle').textContent = project.title;
  document.getElementById('infoTitle').textContent = project.title;
  document.getElementById('infoYear').textContent = project.year;

  const video = document.getElementById('projectVideo');
  const emptyState = document.getElementById('videoEmpty');

  if (project.video) {
    video.src = project.video;
    if (project.poster) video.poster = project.poster;
    video.hidden = false;
    emptyState.hidden = true;
  } else {
    video.hidden = true;
    emptyState.hidden = false;
  }
}

function init() {
  const slug = getSlug();
  const project = projects.find(function (p) { return p.slug === slug; });

  if (!project) {
    renderNotFound();
    return;
  }

  renderProject(project);
}

init();

// --- Theme Toggle (mirrors app.js) ---
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

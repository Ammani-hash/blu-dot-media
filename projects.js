/* ============================================
   BLU DOT MEDIA — Project catalogue
   Shared by the timeline and individual project pages
   ============================================ */

// `link` — external URL (YouTube, Vimeo, etc.) for the "Watch full video"
// button on each project's detail page. Leave '' to hide that button.
const projects = [
  {
    slug: 'meeboss-x-synvya',
    title: 'Meeboss X Synvya',
    type: 'Case Study',
    year: '2025',
    desc: 'A customer case study for Meeboss, following Synvya co-founder & CEO Alejandro Gil through his hiring journey — from trail runs to closing technical hires — as he shares how the platform helped his team grow.',
    color: '#2b3d27',
    video: 'assets/synvya_x_meeboss.mp4',
    poster: 'assets/synvya_x_meeboss_poster.jpg',
    link: ''
  },
  {
    slug: 'gemini-ad',
    title: 'Gemini Ad',
    type: 'Advertisement',
    year: '2025',
    desc: 'A cinematic spec commercial positioning Gemini as a companion for everyday moments.',
    color: '#5a3d38',
    video: 'assets/gemini_ad.mp4',
    poster: 'assets/gemini_ad_poster.jpg',
    link: ''
  },
  {
    slug: 'ethiopia-airport',
    title: 'Ethiopia’s $12.5B Airport',
    type: 'Explainer Video — Amharic',
    year: '2025',
    desc: 'A Vox-style Amharic explainer unpacking Ethiopia’s proposed $12.5 billion airport project and the context behind it.',
    color: '#7a5c2c',
    video: 'assets/ethiopia_airport_final.mp4',
    poster: 'assets/ethiopia_airport_final_poster.jpg',
    startAt: 117,
    link: ''
  },
  {
    slug: 'myst-jewelry',
    title: 'MYST Jewelry',
    type: 'Brand Film',
    year: '2025',
    desc: 'An avant-garde brand film for MYST, pairing molten gold and raw stone with a poetic meditation on craft and permanence.',
    color: '#795944',
    video: 'assets/Myst.mp4',
    poster: 'assets/myst_poster.jpg',
    link: ''
  },
  {
    slug: 'sun-of-the-valley',
    title: 'Sun of the Valley',
    type: 'Short Film — Trailer',
    year: '2026',
    desc: 'A crime drama following a young man navigating ambition, desperation, and the stories we tell to survive.',
    color: '#2d4a6a',
    video: 'assets/sotv_trailer.mp4',
    poster: 'assets/sotv_frame_04.jpg',
    link: ''
  },
  {
    slug: 'just-cuz-cafe',
    title: 'Just Cuz Cafe',
    type: 'Music Video',
    year: '2025',
    desc: 'A high-energy music video following a crew through cars, parks, and city streets across a sun-soaked day of friendship and freedom.',
    color: '#6b6f57',
    video: 'assets/just_cuz.mp4',
    poster: 'assets/just_cuz_poster.jpg',
    link: ''
  },
  {
    slug: 'wedding-trailer',
    title: 'Wedding Trailer',
    type: 'Wedding Film',
    year: '2026',
    desc: 'A joyful wedding trailer weaving together golden-hour romance, bridal prep, and groomsmen antics into one heartfelt highlight reel.',
    color: '#55253d',
    video: 'assets/wedding_trailer.mp4',
    poster: 'assets/wedding_trailer_poster.jpg',
    link: ''
  },
  {
    slug: 'event-recap',
    title: 'Event Recap',
    type: 'Event Recap',
    year: '2025',
    desc: 'A vertical event recap capturing the energy of Afro Caribbean 2025 — check-ins, performances, and man-on-the-street moments from the night.',
    color: '#705f4e',
    video: 'assets/afro_carrib_event_recap.mp4',
    poster: 'assets/afro_carrib_poster.jpg',
    // Video already has on-screen titles/captions burned in — skip the
    // monitor's title overlay so it doesn't duplicate/clash with them.
    hideTitle: true,
    link: ''
  },
  {
    slug: 'interview',
    title: 'Interview',
    type: 'Testimonial — Lead Your Way',
    year: '2024',
    desc: 'A testimonial series for Lead Your Way, featuring program participants reflecting on leadership, growth, and the lessons that shaped them.',
    color: '#4a3e42',
    video: 'assets/lead_your_way_interview.mp4',
    poster: 'assets/lead_your_way_poster.jpg',
    // Video already has on-screen titles/captions burned in — skip the
    // monitor's title overlay so it doesn't duplicate/clash with them.
    hideTitle: true,
    link: ''
  },
  {
    slug: 'its-not-that-deep',
    title: 'It’s Not That Deep',
    type: 'Music Video',
    year: '2025',
    desc: 'A cinematic music video moving through quiet moments of solitude, connection, and release.',
    color: '#6b4d3a',
    video: 'assets/its_not_that_deep.mp4',
    poster: 'assets/its_not_that_deep_poster.jpg',
    startAt: 3,
    link: ''
  }
];

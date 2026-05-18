'use strict';


(function initStarfield() {
  const canvas = document.getElementById('starfield');
  const ctx    = canvas.getContext('2d');
  let stars    = [];



  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }



  function buildStars() {
    stars = [];
    const n = Math.floor((canvas.width * canvas.height) / 6000);
    for (let i = 0; i < n; i++) {
      stars.push({
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height,
        r:     Math.random() * 1.3 + 0.2,
        base:  Math.random() * 0.6 + 0.1,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.008 + 0.003,
        drift: (Math.random() - 0.5) * 0.04,
      });
    }
  }


  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      const alpha = s.base + Math.sin(s.phase + t * s.speed) * 0.25;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0, Math.min(1, alpha))})`;
      ctx.fill();
      s.x += s.drift;
      if (s.x < 0) s.x = canvas.width;
      if (s.x > canvas.width) s.x = 0;
    });
    requestAnimationFrame(draw);
  }

  resize();
  buildStars();
  requestAnimationFrame(draw);
  window.addEventListener('resize', () => { resize(); buildStars(); });
}());



const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });



(function heroTitle() {
  const el  = document.getElementById('hero-title');
  const sub = document.getElementById('hero-sub');

  el.textContent = 'TAMINO';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 1.4s ease';
      el.style.opacity    = '1';
      sub.classList.add('show');

      setTimeout(() => {
        el.style.transition  = 'opacity 1.8s ease';
        el.style.opacity     = '0';
        sub.style.transition = 'opacity 1.4s ease';
        sub.style.opacity    = '0';
      }, 2800);
    });
  });
}());



const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

document.querySelectorAll('.track.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.06}s`;
});



(function initTilt() {
  const wrap  = document.getElementById('coverWrap');
  const img   = document.getElementById('coverImg');
  const glare = wrap.querySelector('.glare');

  if (!wrap) return;

  wrap.addEventListener('mousemove', e => {
    const r  = wrap.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
    const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    const rx = -dy * 14;
    const ry =  dx * 14;

    img.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.04,1.04,1.04)`;

    const gx = ((e.clientX - r.left) / r.width)  * 100;
    const gy = ((e.clientY - r.top)  / r.height) * 100;
    glare.style.opacity    = '1';
    glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,.18) 0%, transparent 55%)`;
  });

  wrap.addEventListener('mouseleave', () => {
    img.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    glare.style.opacity = '0';
  });
}());



(function initPlayer() {
  let activeTrack = null;

  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const track     = btn.closest('.track');
      const playerDiv = track.querySelector('.track-player');
      const id        = track.dataset.trackId;

      if (activeTrack === track) { closeTrack(track); return; }
      if (activeTrack) closeTrack(activeTrack);

      const iframe = document.createElement('iframe');
      iframe.src   = `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0&autoplay=1`;
      iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      iframe.setAttribute('allowfullscreen', '');
      playerDiv.innerHTML = '';
      playerDiv.appendChild(iframe);
      playerDiv.classList.add('open');
      btn.classList.add('active');
      activeTrack = track;
    });
  });

  function closeTrack(track) {
    const playerDiv = track.querySelector('.track-player');
    playerDiv.classList.remove('open');
    setTimeout(() => { playerDiv.innerHTML = ''; }, 420);
    track.querySelector('.play-btn').classList.remove('active');
    activeTrack = null;
  }
}());



(function initModal() {
  const modal   = document.getElementById('modal');
  const mImg    = document.getElementById('modal-img');
  const mTitle  = document.getElementById('modal-title');
  const mYear   = document.getElementById('modal-year');
  const mDesc   = document.getElementById('modal-desc');
  const mTracks = document.getElementById('modal-tracks');
  const mClose  = modal.querySelector('.modal-close');

  let activeModalTrack = null;

  const albums = [
    {
      title: "Every Dawn's a Mountain",
      year:  '2025',
      img:   'assets/album-cover--every-dawns-a-mountain.jpeg',
      desc:  "Le quatrième album de Tamino, porté par une écriture plus lumineuse et des arrangements orchestraux somptueux.",
      tracks: [
        { name: 'My Heroine',              id: '26vqNsBnCEge94IMH8aF1H' },
        { name: 'Babylon',                 id: '2dgabn0niN2C1tyZEv1Kmh' },
        { name: "Every Dawn's a Mountain", id: '7EzAzLRWi5qu6FCDngwf1d' },
        { name: 'Sanpaku',                 id: '7Bofhte2pr9y3Uinqp3gxu' },
        { name: 'Sanctuary',               id: '2xUyK9iuIc649q3NXJ1Uvb' },
        { name: 'Raven',                   id: '20BGPxnAHVtR91j0msPOcz' },
        { name: 'Willow',                  id: '5tgQENRVrY68gcxkJw21lA' },
        { name: 'Elegy',                   id: '02LPaXC1bddO57chf2aEQm' },
        { name: 'Dissolve',                id: '1OL74sVym2asR6qiYC1c7q' },
        { name: 'Amsterdam',               id: '6uuJFYE0Z07egCcxb36PLN' },
      ]
    },
    {
      title: 'Sahar',
      year:  '2022',
      img:   'assets/album-cover-tamino.jpeg',
      desc:  "Deuxième album studio de Tamino. Un disque de renaissance et de lumière fragile.",
      tracks: [
        { name: 'Cinnamon',    id: '5n51kLSHRYV06VezhVnucf' },
        { name: 'Indigo Night',id: '1lgX1Dhsnn4G8UJjw0UQhu' },
        { name: 'Sunflower',   id: '6g7cJdDNjCDgqcpVGLzYhh' },
        { name: 'Persephone',  id: '5lMwhuAYhD2EEeVzdiU8aO' },
        { name: 'Cigar',       id: '7F1wUwiqS0wHVCEOsKYWjm' },
        { name: 'Tummy',       id: '2UerZTFYCOEh07o0qfn2FL' },
        { name: 'Each Time',   id: '5f32woQd5AwVc6iKeSPCcP' },
        { name: 'Verses',      id: '5guZozbVCHvHcqnLzatusw' },
        { name: 'So It Goes',  id: '7j6Bh4ahxOlyykfFuNJCNz' },
        { name: 'Intervals',   id: '7mm1KmRATyCQRc9ayFoTU2' },
      ]
    },
    {
      title: 'Amir Deluxe',
      year:  '2019',
      img:   'assets/album-cover-amir.jpg',
      desc:  "L'album qui a révélé Tamino au monde. Une œuvre intime et déchirante qui mêle folk, pop et influences orientales.",
      tracks: [
        { name: 'Habibi',              id: '5IoxL71foZn0fSC7qgEw8L' },
        { name: 'Sun May Shine',       id: '3WrQSCMKHh4bVPVStBNjGN' },
        { name: 'Chambers',            id: '54bCiqOHAGs0dxGk3HzspC' },
        { name: 'So It Goes',          id: '4pfFX7WaXlkHoXXxfLT5TE' },
        { name: 'W.O.T.H',             id: null },
        { name: 'Intervals',           id: '7mm1KmRATyCQRc9ayFoTU2' },
        { name: 'Nausea',              id: null },
        { name: 'Pim',                 id: null },
        { name: 'Oscine',              id: null },
        { name: 'Olive Tree',          id: null },
        { name: 'Indigo Night (Live)', id: null },
      ]
    },
    {
      title: 'Live at Ancienne Belgique',
      year:  '2019',
      img:   'assets/album-cover-live-at-ancienne-belgique.jpeg',
      desc:  "Captation live à Bruxelles, dans la mythique salle Ancienne Belgique. La magie de Tamino sur scène.",
      tracks: [
        { name: 'Persephone (Live)',  id: '3FhWjicLQAitzOU3zYDueS' },
        { name: 'Indigo Night (Live)',id: '5bd8gvPCEOJCaAMWPpbaM8' },
        { name: 'So It Goes (Live)', id: '6rF4GTkUGnGH9pvJUNk6hb' },
        { name: 'Seasons (Live)',     id: '0t8j0dXaEkq3pVxXFta8x1' },
      ]
    }
  ];

  function trackRow(t, i) {
    const btn = t.id
      ? `<button class="modal-play-btn" aria-label="Écouter ${t.name}">
           <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
           <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
         </button>`
      : `<span class="modal-play-spacer"></span>`;
    return `<li class="modal-track"${t.id ? ` data-track-id="${t.id}"` : ''}>
      <div class="modal-track-row">
        ${btn}
        <span class="modal-track-num">${String(i + 1).padStart(2, '0')}</span>
        <span class="modal-track-name">${t.name}</span>
      </div>
      ${t.id ? '<div class="modal-track-player"></div>' : ''}
    </li>`;
  }

  document.querySelectorAll('.disco-card').forEach(card => {
    card.addEventListener('click', () => {
      const a = albums[+card.dataset.album];
      mImg.src = a.img;
      mImg.alt = a.title;
      mTitle.textContent = a.title;
      mYear.textContent  = a.year;
      mDesc.textContent  = a.desc;
      mTracks.innerHTML  = a.tracks.map(trackRow).join('');
      activeModalTrack   = null;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  mTracks.addEventListener('click', e => {
    const btn = e.target.closest('.modal-play-btn');
    if (!btn) return;
    const track     = btn.closest('.modal-track');
    const playerDiv = track.querySelector('.modal-track-player');
    const id        = track.dataset.trackId;

    if (activeModalTrack === track) { closeModalTrack(track); return; }
    if (activeModalTrack) closeModalTrack(activeModalTrack);

    const iframe = document.createElement('iframe');
    iframe.src   = `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0&autoplay=1`;
    iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    iframe.setAttribute('allowfullscreen', '');
    playerDiv.innerHTML = '';
    playerDiv.appendChild(iframe);
    playerDiv.classList.add('open');
    btn.classList.add('active');
    activeModalTrack = track;
  });

  function closeModalTrack(track) {
    const playerDiv = track.querySelector('.modal-track-player');
    if (!playerDiv) return;
    playerDiv.classList.remove('open');
    setTimeout(() => { playerDiv.innerHTML = ''; }, 420);
    track.querySelector('.modal-play-btn').classList.remove('active');
    activeModalTrack = null;
  }

  function closeModal() {
    if (activeModalTrack) closeModalTrack(activeModalTrack);
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  mClose.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}());

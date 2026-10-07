/* =====================================================================
   PORTAFOLIO · JavaScript
   Tareas pequeñas, cada una en su propio bloque:
   1. Menú del celular
   2. Resaltar en el menú la sección que estás leyendo
   3. Botón "Copiar correo" y año del pie de página
   4. Efecto del cursor sobre los títulos grandes (nombre del hero)
   5. Tarjeta 2D
   5b. Tarjeta agarrable: se arrastra con el mouse y la cinta la sigue
   6. Títulos de sección: entrada al aparecer en pantalla + efecto del cursor
   7. Carpeta de "Sobre mí"
   7c. Visor de dispositivos de BiblioLend (pestañas)
   7b. Cursor "bola" que invierte los colores (Habilidades blandas y Hobbies)
   8. Fondo: partículas suspendidas atraídas por el cursor como por un imán
   ===================================================================== */
(() => {
  'use strict';

  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Menú del celular ---------- */
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('menu');

  // Mientras el menú cubre la pantalla, el resto de la página queda "inerte":
  // el teclado y los lectores de pantalla no pueden entrar a lo que no se ve.
  const behindMenu = document.querySelectorAll('main, .footer');

  function setMenu(open) {
    header.dataset.open = String(open);
    toggle.setAttribute('aria-expanded', String(open));   // el botón siempre se llama "Menú"; aria-expanded dice si está abierto
    document.body.classList.toggle('no-scroll', open);
    behindMenu.forEach((el) => { el.inert = open; });
  }

  toggle.addEventListener('click', () => setMenu(header.dataset.open !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || header.dataset.open !== 'true') return;
    setMenu(false);
    toggle.focus();                                        // el foco vuelve al botón, no se pierde
  });
  window.matchMedia('(min-width: 881px)').addEventListener('change', () => setMenu(false));

  /* ---------- 2. Sección activa en el menú ---------- */
  // "blandas" pertenece al mismo grupo que "tecnicas" en el menú (Habilidades)
  const linkFor = { blandas: 'tecnicas' };
  const links = new Map();
  document.querySelectorAll('.nav a[href^="#"]').forEach((a) => links.set(a.getAttribute('href').slice(1), a));

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = linkFor[entry.target.id] || entry.target.id;
      links.forEach((a, key) => {
        if (key === id) a.setAttribute('aria-current', 'location');   // "location": la parte de ESTA página donde estás
        else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  document.querySelectorAll('main section[id]').forEach((s) => sectionObserver.observe(s));

  /* ---------- 3. Copiar correo ---------- */
  const copyBtn = document.getElementById('copiar');
  const copyText = document.getElementById('copiar-texto');
  const status = document.getElementById('copiar-estado');
  const email = document.getElementById('correo').textContent.trim();

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      copyText.textContent = 'Correo copiado';
      status.textContent = 'Correo copiado al portapapeles.';
    } catch (err) {
      // Si el navegador no deja copiar, seleccionamos el texto para que se copie a mano
      const range = document.createRange();
      range.selectNodeContents(document.getElementById('correo'));
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      status.textContent = 'No se pudo copiar solo. El correo quedó seleccionado: usa Ctrl+C.';
    }
    setTimeout(() => {
      copyText.textContent = 'Copiar correo';
      status.textContent = '';                              // se vacía para que el siguiente aviso también se anuncie
    }, 2200);
  }
  copyBtn.addEventListener('click', copyEmail);

  /* ---------- Año del pie de página ---------- */
  const year = document.getElementById('anio');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- 4. Efecto del cursor sobre los títulos grandes ----------
     Idea: cada letra mide qué tan lejos está del cursor.
     Cuanto más cerca, más sube, más crece y más se aparta hacia un lado (como si el cursor la empujara).
     Las letras vecinas reaccionan menos y las lejanas no se mueven.
     createLetterEffect(título, zona) parte el título en letras y escucha el cursor dentro de la zona.
     Se usa en el nombre del hero y en los títulos de sección (bloque 6). */
  function createLetterEffect(titleEl, zoneEl) {
    const letters = [];
    const pointer = { x: -9999, y: -9999, inside: false };
    let radius = 150;

    function splitLetters(line) {
      const words = line.textContent.trim().split(' ');
      line.textContent = '';
      words.forEach((word, index) => {
        const w = document.createElement('span');
        w.className = 'word';
        [...word].forEach((char) => {
          const s = document.createElement('span');
          s.className = 'ch';
          s.textContent = char;
          s.dataset.i = '0';
          w.appendChild(s);
          letters.push({ el: s, i: 0, dx: 0, cx: 0, cy: 0 });
        });
        line.appendChild(w);
        if (index < words.length - 1) line.appendChild(document.createTextNode(' '));
      });
    }

    // Los lectores de pantalla leen el título completo, no letra por letra
    titleEl.setAttribute('aria-label', titleEl.textContent.replace(/\s+/g, ' ').trim());
    titleEl.querySelectorAll('span').forEach((line) => {
      line.setAttribute('aria-hidden', 'true');
      splitLetters(line);
    });

    // Solo mouse o lápiz: en pantallas táctiles no hay "pasar por encima"
    zoneEl.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.inside = true;
    });
    zoneEl.addEventListener('pointerleave', () => { pointer.inside = false; });

    function measure() {
      letters.forEach((l) => {
        const prev = l.el.style.transform;
        l.el.style.transform = 'none';
        const r = l.el.getBoundingClientRect();
        l.el.style.transform = prev;
        l.cx = r.left + r.width / 2 + window.scrollX;
        l.cy = r.top + r.height / 2 + window.scrollY;
      });
      radius = Math.max(110, parseFloat(getComputedStyle(titleEl).fontSize) * 1.5);
    }

    // Acerca cada letra a su valor objetivo un poco por cuadro. Devuelve true mientras alguna siga moviéndose.
    function update() {
      let moving = false;
      letters.forEach((l) => {
        let targetI = 0;
        let targetDx = 0;
        if (pointer.inside) {
          const px = l.cx - window.scrollX;
          const py = l.cy - window.scrollY;
          const d = Math.hypot(pointer.x - px, pointer.y - py);
          const t = Math.max(0, 1 - d / radius);
          targetI = t * t;                                    // cae suave: fuerte cerca, casi nada lejos
          targetDx = (px < pointer.x ? -1 : 1) * targetI * 0.1;
        }
        l.i += (targetI - l.i) * 0.18;
        l.dx += (targetDx - l.dx) * 0.18;
        if (Math.abs(targetI - l.i) > 0.002 || Math.abs(targetDx - l.dx) > 0.002) moving = true;
        else { l.i = targetI; l.dx = targetDx; }
        l.el.style.setProperty('--i', l.i.toFixed(3));
        l.el.style.setProperty('--dx', l.dx.toFixed(3));
      });
      return moving;
    }

    return { pointer, measure, update };
  }

  const hero = document.getElementById('inicio');
  const title = document.getElementById('titulo-hero');
  const nameFx = hero && title && !prefersReducedMotion ? createLetterEffect(title, hero) : null;

  /* ---------- 5. Tarjeta 2D ----------
     El cursor dentro de la tarjeta la desplaza y la gira un poco hacia donde apunta.
     Cada pieza (foto, nombre, etiquetas) se desplaza distinto en CSS (parallax), por eso se separan
     unas de otras sin usar 3D. Sin cursor, la tarjeta se mece sola muy suave. */
  const cardZone = document.querySelector('.hero__card');
  const badge = document.getElementById('badge');
  const tilt = { x: 0, y: 0, mx: 0, my: 0, rot: 0, nx: 0, ny: 0, hover: false };

  function updateBadge(time) {
    if (!badge) return;
    let tmx = 0;
    let tmy = 0;
    let trot = 0;
    let tnx = 0;
    let tny = 0;
    if (tilt.hover) {
      tmx = tilt.x * 9;
      tmy = tilt.y * 7;
      trot = tilt.x * 2.2;
      tnx = tilt.x;
      tny = tilt.y;
    } else if (!prefersReducedMotion) {
      tmx = Math.cos(time / 2300) * 4;
      tmy = Math.sin(time / 1700) * 2.5;
      trot = Math.sin(time / 2300) * 0.9;
      tnx = Math.cos(time / 2300) * 0.5;
      tny = Math.sin(time / 1700) * 0.5;
    }
    tilt.mx += (tmx - tilt.mx) * 0.12;
    tilt.my += (tmy - tilt.my) * 0.12;
    tilt.rot += (trot - tilt.rot) * 0.12;
    tilt.nx += (tnx - tilt.nx) * 0.12;
    tilt.ny += (tny - tilt.ny) * 0.12;
    badge.style.setProperty('--mx', tilt.mx.toFixed(2) + 'px');
    badge.style.setProperty('--my', tilt.my.toFixed(2) + 'px');
    badge.style.setProperty('--rot', tilt.rot.toFixed(2) + 'deg');
    badge.style.setProperty('--nx', tilt.nx.toFixed(3));
    badge.style.setProperty('--ny', tilt.ny.toFixed(3));
  }

  /* Un solo ciclo de animación atiende al nombre y a la tarjeta, y solo corre mientras el hero se ve */
  let heroFrame = 0;
  let heroVisible = true;

  function heroLoop(time) {
    if (nameFx) nameFx.update();
    updateBadge(time);
    heroFrame = heroVisible ? requestAnimationFrame(heroLoop) : 0;
  }

  function startHero() {
    if (!heroFrame && heroVisible && !prefersReducedMotion) heroFrame = requestAnimationFrame(heroLoop);
  }

  if (hero && !prefersReducedMotion) {
    if (cardZone && badge) {
      cardZone.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch') return;
        const r = cardZone.getBoundingClientRect();
        tilt.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
        tilt.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
        tilt.hover = true;
      });
      cardZone.addEventListener('pointerleave', () => { tilt.hover = false; });
    }

    new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      if (heroVisible) startHero();
    }).observe(hero);

    const remeasure = () => { if (nameFx) nameFx.measure(); };
    window.addEventListener('resize', remeasure);
    window.addEventListener('load', remeasure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);
    remeasure();
    startHero();
  }

  /* ---------- 5b. Tarjeta agarrable ----------
     Con el clic sostenido sobre la tarjeta se arrastra de lado a lado. Toda la escena (cinta + tarjeta) gira como
     un péndulo alrededor del punto del que cuelga la cinta (el transform-origin de .badge-scene), así la cinta
     siempre queda unida a la tarjeta. Además la tarjeta se balancea un poco respecto a la cinta (--lag, gira sobre
     su ojal). Al soltar, un resorte amortiguado la devuelve a la vertical con varios vaivenes. Ángulos en grados. */
  const scene = document.getElementById('badge-scene');

  if (scene && badge && cardZone) {
    const K = 45;                                                  // rigidez: más alto = vaivén más rápido
    const DAMP = prefersReducedMotion ? 2 * Math.sqrt(K) : 2.4;    // amortiguación (con "reducir movimiento" no hay vaivenes)
    const maxAngle = () => (window.matchMedia('(max-width: 880px)').matches ? 18 : 28);
    const sw = { a: 0, v: 0, lag: 0, ry: 0, target: 0, base: 0, grab: 0, drag: false, frame: 0, last: 0 };

    // Punto del que cuelga la cinta, en coordenadas de la ventana (la escena no gira respecto a este punto)
    function pivot() {
      const r = cardZone.getBoundingClientRect();
      const o = getComputedStyle(scene).transformOrigin.split(' ').map(parseFloat);
      return { x: r.left + (r.width - scene.offsetWidth) / 2 + o[0], y: r.top + o[1] };
    }

    function swingLoop(time) {
      const dt = Math.min((time - sw.last) / 1000, 0.033) || 0.016;
      sw.last = time;
      if (sw.drag) {
        const prev = sw.a;
        sw.a += (sw.target - sw.a) * 0.4;
        sw.v += ((sw.a - prev) / dt - sw.v) * 0.4;                 // velocidad suavizada: se conserva al soltar
      } else {
        sw.v += (-K * sw.a - DAMP * sw.v) * dt;
        sw.a += sw.v * dt;
      }
      // La tarjeta se queda atrás respecto a la cinta mientras esta se mueve
      const lagTarget = prefersReducedMotion ? 0 : Math.max(-14, Math.min(14, -sw.v * 0.05));
      sw.lag += (lagTarget - sw.lag) * 0.18;
      // Al moverse rápido la tarjeta también gira un poco sobre su eje vertical (como una credencial real)
      const ryTarget = prefersReducedMotion ? 0 : Math.max(-14, Math.min(14, sw.v * 0.06));
      sw.ry += (ryTarget - sw.ry) * 0.2;
      const rest = !sw.drag && Math.abs(sw.a) < 0.02 && Math.abs(sw.v) < 0.1 && Math.abs(sw.lag) < 0.02 && Math.abs(sw.ry) < 0.02;
      if (rest) { sw.a = 0; sw.v = 0; sw.lag = 0; sw.ry = 0; }
      scene.style.rotate = sw.a.toFixed(2) + 'deg';
      badge.style.setProperty('--lag', sw.lag.toFixed(2) + 'deg');
      badge.style.setProperty('--ry', sw.ry.toFixed(2) + 'deg');
      badge.style.setProperty('--sheen', (sw.a + sw.lag + sw.ry * 0.5).toFixed(2));   // mueve el brillo y la sombra (CSS)
      sw.frame = rest ? 0 : requestAnimationFrame(swingLoop);
    }

    function release() {
      if (!sw.drag) return;
      sw.drag = false;
      scene.classList.remove('is-grabbed');
    }

    badge.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const p = pivot();
      sw.grab = Math.atan2(e.clientX - p.x, e.clientY - p.y);
      sw.base = sw.a;
      sw.target = sw.a;
      sw.v = 0;
      sw.drag = true;
      scene.style.animation = 'none';                              // si aún corría el vaivén de entrada, se cancela
      scene.classList.add('is-grabbed');
      badge.setPointerCapture(e.pointerId);                        // el arrastre sigue aunque el puntero salga de la tarjeta
      if (!sw.frame) { sw.last = performance.now(); sw.frame = requestAnimationFrame(swingLoop); }
    });
    badge.addEventListener('pointermove', (e) => {
      if (!sw.drag) return;
      const p = pivot();
      const moved = (Math.atan2(e.clientX - p.x, e.clientY - p.y) - sw.grab) * 180 / Math.PI;
      // En CSS un giro positivo es en sentido horario: mueve la tarjeta a la izquierda, por eso se resta
      sw.target = Math.max(-maxAngle(), Math.min(maxAngle(), sw.base - moved));
    });
    badge.addEventListener('pointerup', release);
    badge.addEventListener('pointercancel', release);
    badge.addEventListener('lostpointercapture', release);
    badge.addEventListener('dragstart', (e) => e.preventDefault());   // evita que el navegador arrastre la foto como imagen
  }

  /* ---------- 6. Títulos de sección ----------
     Todos los títulos con la clase .fx-title (Sobre mí, Educación y experiencia, Proyectos, Tecnologías,
     Habilidades blandas, Hobbies y Hablemos.) se comportan como el nombre del hero, con dos efectos:
     1) Entrada: se abre de izquierda a derecha cuando el título aparece en pantalla
        (JS le pone la clase .is-in; la animación está en .fx-title de css/styles.css).
     2) Cursor: las letras reaccionan al cursor con createLetterEffect (bloque 4), mientras el cursor esté en su sección.
     Con "reducir movimiento" no se hace ninguno de los dos: el título se ve normal y quieto. */
  function setupSectionTitle(titleEl) {
    const zone = titleEl.closest('section');
    if (!zone) return;
    const fx = createLetterEffect(titleEl, zone);
    let frame = 0;
    let visible = false;

    // El ciclo solo corre mientras el título se ve y el cursor está en la sección o las letras aún se acomodan
    function loop() {
      const moving = fx.update();
      frame = visible && (fx.pointer.inside || moving) ? requestAnimationFrame(loop) : 0;
    }
    function wake() {
      if (!frame && visible) frame = requestAnimationFrame(loop);
    }

    zone.addEventListener('pointermove', (e) => { if (e.pointerType !== 'touch') wake(); });

    // .will-reveal esconde el título hasta que aparezca. Se pone desde aquí para que, si algo fallara, el título quede visible.
    titleEl.classList.add('will-reveal');
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        visible = entry.isIntersecting;
        if (visible) { fx.measure(); wake(); }
        if (entry.intersectionRatio >= 0.5) titleEl.classList.add('is-in');
      });
    }, { threshold: [0, 0.5] }).observe(titleEl);

    window.addEventListener('resize', () => { if (visible) fx.measure(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => fx.measure());
  }

  if (!prefersReducedMotion) {
    document.querySelectorAll('.fx-title').forEach(setupSectionTitle);
  }

  /* ---------- 7. Carpeta de "Sobre mí" ----------
     Se abre de tres formas: cursor encima (.is-hover), clic o Enter (.is-pinned, queda abierta)
     o al llegar con la tecla Tab. El texto siempre está en la página: la animación solo lo revela. */
  const folder = document.getElementById('folder');
  const folderBtn = folder && folder.querySelector('.folder__front');

  if (folder && folderBtn) {
    folder.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') folder.classList.add('is-hover'); });
    folder.addEventListener('pointerleave', () => folder.classList.remove('is-hover'));
    folderBtn.addEventListener('focus', () => { if (folderBtn.matches(':focus-visible')) folder.classList.add('is-hover'); });
    folderBtn.addEventListener('blur', () => folder.classList.remove('is-hover'));
    folderBtn.addEventListener('click', () => {
      const pinned = folder.classList.toggle('is-pinned');
      folderBtn.setAttribute('aria-expanded', String(pinned));
    });
  }

  /* ---------- 7c. Visor de dispositivos de BiblioLend ----------
     Tres pestañas (computador, celular, tablet). Al elegir una se muestra su panel y se ocultan los demás.
     Con el teclado: flechas para moverse entre pestañas, Inicio y Fin para ir a la primera o a la última. */
  const tabList = document.querySelector('.viewer__tabs');

  if (tabList) {
    const tabs = [...tabList.querySelectorAll('[role="tab"]')];

    function selectTab(tab, moveFocus) {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;                           // solo la pestaña activa entra en el orden del Tab
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (moveFocus) tab.focus();
    }

    tabs.forEach((tab) => tab.addEventListener('click', () => selectTab(tab, false)));

    tabList.addEventListener('keydown', (e) => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      const last = tabs.length - 1;
      const next = { ArrowDown: i === last ? 0 : i + 1, ArrowRight: i === last ? 0 : i + 1,
                     ArrowUp: i === 0 ? last : i - 1, ArrowLeft: i === 0 ? last : i - 1,
                     Home: 0, End: last }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      selectTab(tabs[next], true);
    });

    // En celular los botones van en fila; se lo avisamos a los lectores de pantalla
    const rowQuery = window.matchMedia('(max-width: 560px)');
    const syncOrientation = () => tabList.setAttribute('aria-orientation', rowQuery.matches ? 'horizontal' : 'vertical');
    rowQuery.addEventListener('change', syncOrientation);
    syncOrientation();
  }

  /* ---------- 7b. Cursor "bola" en Habilidades blandas y Hobbies ----------
     Dentro de #blandas y #hobbies el puntero normal se reemplaza por una bola blanca con mix-blend-mode: difference,
     que invierte el color de lo que tenga debajo (gris -> claro, tarjeta blanca -> oscura).
     Para agregar el efecto a otra sección: suma su id en BALL_SECTIONS, en BALL_BIG (qué elementos hacen crecer
     la bola) y en la regla ".has-ball" de css/styles.css.
     Solo se activa con mouse (hover: hover y pointer: fine). En pantallas táctiles o si algo falla,
     el puntero normal sigue funcionando: la clase .has-ball, que oculta el puntero, la pone este mismo código. */
  const BALL_SECTIONS = '#blandas, #hobbies';   // secciones donde aparece la bola
  const BALL_BIG = '.soft li, .sports li';      // elementos sobre los que la bola crece al doble
  const ballSections = Array.from(document.querySelectorAll(BALL_SECTIONS));
  const canBall = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (ballSections.length && canBall) {
    const ball = document.createElement('div');
    ball.className = 'ball';
    ball.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ball);

    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let ballFrame = 0;
    let ballOn = false;

    function ballLoop() {
      // Con "reducir movimiento" la bola sigue al cursor sin retraso; si no, lo sigue con suavidad
      const ease = prefersReducedMotion ? 1 : 0.22;
      pos.x += (target.x - pos.x) * ease;
      pos.y += (target.y - pos.y) * ease;
      ball.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      const settled = Math.abs(target.x - pos.x) < 0.1 && Math.abs(target.y - pos.y) < 0.1;
      ballFrame = ballOn && !settled ? requestAnimationFrame(ballLoop) : 0;
    }

    function showBall(on) {
      ballOn = on;
      root.classList.toggle('has-ball', on);
      ball.classList.toggle('is-on', on);
      if (!on) ball.classList.remove('is-big');
      if (on && !ballFrame) ballFrame = requestAnimationFrame(ballLoop);
    }

    // Un solo oyente para todas las secciones: así, al pasar de una a otra (están una junto a la otra),
    // la bola sigue sin parpadear en vez de apagarse y volver a encenderse.
    document.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const inside = e.target instanceof Element && e.target.closest(BALL_SECTIONS);
      if (!inside) { if (ballOn) showBall(false); return; }
      if (!ballOn) { pos.x = e.clientX; pos.y = e.clientY; showBall(true); }
      target.x = e.clientX;
      target.y = e.clientY;
      if (!ballFrame) ballFrame = requestAnimationFrame(ballLoop);
      // Sobre una tarjeta la bola crece, para que se note la inversión sobre el texto
      ball.classList.toggle('is-big', !!e.target.closest(BALL_BIG));
    });
    document.documentElement.addEventListener('pointerleave', () => showBall(false));
    window.addEventListener('blur', () => showBall(false));
    // Si se hace scroll con el cursor quieto y ninguna sección queda debajo del cursor, la bola se apaga
    window.addEventListener('scroll', () => {
      if (!ballOn) return;
      const underCursor = ballSections.some((sec) => {
        const r = sec.getBoundingClientRect();
        return target.y >= r.top && target.y <= r.bottom;
      });
      if (!underCursor) showBall(false);
    }, { passive: true });
  }

  /* ---------- 8. Fondo: partículas con atracción magnética ----------
     Partículas suspendidas en un <canvas> fijo. Flotan de forma casi imperceptible. Cuando el cursor
     se acerca, las que están dentro del campo son atraídas hacia él (con un leve giro, como limaduras
     de hierro junto a un imán). Al alejarlo, regresan despacio a su sitio. */
  const bg = document.getElementById('bg-canvas');
  if (!bg || !bg.getContext) return;

  const bctx = bg.getContext('2d');
  const FIELD = 240;               // alcance del campo magnético (px)
  const PULL = 1.2;                // fuerza de atracción
  const SPRING = 0.005;            // qué tan rápido vuelven a su sitio
  const mouse = { x: -9999, y: -9999, active: false };
  let parts = [];
  let bw = 0;
  let bh = 0;
  let last = 0;

  function sizeBackground() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    bw = window.innerWidth;
    bh = window.innerHeight;
    bg.width = Math.round(bw * dpr);
    bg.height = Math.round(bh * dpr);
    bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!parts.length) {
      const count = Math.max(40, Math.min(170, Math.round((bw * bh) / 12000)));
      parts = Array.from({ length: count }, () => {
        const nx = Math.random();
        const ny = Math.random();
        return { nx, ny, x: nx * bw, y: ny * bh, vx: 0, vy: 0,
                 r: 0.9 + Math.random() * 1.5, a: 0.25 + Math.random() * 0.3,
                 ph: Math.random() * 6.283, sp: 0.00012 + Math.random() * 0.00014, amp: 4 + Math.random() * 7 };
      });
    }
  }

  function drawParticles() {
    bctx.clearRect(0, 0, bw, bh);
    for (const p of parts) {
      bctx.fillStyle = `rgba(214, 222, 232, ${Math.min(1, p.a + p.glow * 0.5)})`;
      bctx.beginPath();
      bctx.arc(p.x, p.y, p.r * (1 + p.glow * 0.7), 0, 6.283);
      bctx.fill();
    }
  }

  function stepParticles(time, k) {
    for (const p of parts) {
      // posición de reposo: se mueve apenas unos píxeles, de forma muy lenta
      const tx = p.nx * bw + Math.sin(time * p.sp + p.ph) * p.amp;
      const ty = p.ny * bh + Math.cos(time * p.sp * 0.83 + p.ph * 1.7) * p.amp;
      let ax = (tx - p.x) * SPRING;
      let ay = (ty - p.y) * SPRING;
      p.glow = 0;
      if (mouse.active) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < FIELD && d > 0.5) {
          const t = 1 - d / FIELD;                     // 0 en el borde del campo, 1 sobre el cursor
          const f = t * t * PULL * Math.min(1, d / 46); // cerca del cursor se suaviza: no se juntan en un punto
          ax += (dx / d) * f - (dy / d) * f * 0.18;
          ay += (dy / d) * f + (dx / d) * f * 0.18;
          p.glow = t;
        }
      }
      p.vx = (p.vx + ax * k) * 0.88;
      p.vy = (p.vy + ay * k) * 0.88;
      p.x += p.vx * k;
      p.y += p.vy * k;
    }
  }

  function backgroundLoop(time) {
    const k = Math.min(2, (time - last) / 16.7 || 1);
    last = time;
    stepParticles(time, k);
    drawParticles();
    requestAnimationFrame(backgroundLoop);
  }

  sizeBackground();
  for (const p of parts) p.glow = 0;
  // En celular, la barra del navegador dispara "resize" al hacer scroll: se agrupan en un solo cambio por cuadro
  let resizeFrame = 0;
  window.addEventListener('resize', () => {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      sizeBackground();
      if (prefersReducedMotion) { for (const p of parts) { p.x = p.nx * bw; p.y = p.ny * bh; } drawParticles(); }
    });
  });

  if (prefersReducedMotion) {
    drawParticles();
  } else {
    window.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;        // en pantallas táctiles las partículas solo flotan
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }, { passive: true });
    // Cuando el cursor sale de la ventana, el imán se apaga (relatedTarget es null al salir de la página)
    document.addEventListener('mouseout', (e) => { if (!e.relatedTarget) mouse.active = false; });
    requestAnimationFrame(backgroundLoop);
  }
})();

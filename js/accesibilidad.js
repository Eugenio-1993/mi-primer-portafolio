/* =====================================================================
   ACCESIBILIDAD · lógica del botón y del panel
   Cómo funciona (idea general):
   - Cada ajuste es un dato en el objeto `state`.
   - apply() traduce ese estado a clases en <html> (o a font-size).
   - El aspecto real de cada clase está en css/accesibilidad.css (sección 6).
   - El estado se guarda en localStorage para recordarlo en la próxima visita.

   Para AGREGAR un ajuste nuevo:
     1) añade su valor por defecto en DEFAULTS,
     2) añade su clase en TOGGLES (si es un interruptor),
     3) añade el botón en el HTML con data-a11y="nombre",
     4) escribe su CSS como html.a11y-nombre { ... }.
   ===================================================================== */
(() => {
  'use strict';

  /* ---------- 1. Referencias al HTML ---------- */
  const root = document.documentElement;                       // <html>: aquí se aplican las clases
  const widget = document.getElementById('a11y-widget');
  if (!widget) return;                                          // si el bloque HTML no está, no hace nada

  const trigger = document.getElementById('a11y-trigger');
  const panel = document.getElementById('a11y-panel');
  const closeBtn = document.getElementById('a11y-close');
  const sizeValue = document.getElementById('a11y-size-value');
  const status = document.getElementById('a11y-status');
  const sizeDown = widget.querySelector('[data-a11y="text-down"]');
  const sizeUp = widget.querySelector('[data-a11y="text-up"]');

  /* ---------- 2. Estado y ajustes ---------- */
  const STORAGE_KEY = 'a11y-preferences';

  // Valores iniciales: todo apagado y texto al 100 %
  const DEFAULTS = {
    textStep: 0,          // pasos de tamaño: 0 = 100 %, +1 = 110 %, -1 = 90 %...
    contrast: false,
    grayscale: false,
    underline: false,
    dyslexia: false,
  };

  // Límites del tamaño de texto (cada paso suma o resta 10 %): de 80 % a 150 %
  const TEXT_STEP = 10;
  const TEXT_MIN = -2;
  const TEXT_MAX = 5;

  // Interruptores: nombre en el estado → clase que se pone en <html>
  const TOGGLES = {
    contrast: 'a11y-contrast',
    grayscale: 'a11y-grayscale',
    underline: 'a11y-underline',
    dyslexia: 'a11y-dyslexia',
  };

  // Nombre legible de cada ajuste (se usa para avisar a los lectores de pantalla)
  const LABELS = {
    contrast: 'Alto contraste',
    grayscale: 'Escala de grises',
    underline: 'Subrayar enlaces',
    dyslexia: 'Fuente para dislexia',
  };

  let state = { ...DEFAULTS };

  /* ---------- 3. Guardar y leer preferencias ---------- */
  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && typeof saved === 'object') {
        // Solo se aceptan claves conocidas, así un dato corrupto no rompe nada
        Object.keys(DEFAULTS).forEach((key) => {
          if (typeof saved[key] === typeof DEFAULTS[key]) state[key] = saved[key];
        });
        state.textStep = Math.min(TEXT_MAX, Math.max(TEXT_MIN, Math.round(state.textStep)));
      }
    } catch (_) { /* localStorage bloqueado o vacío: se usan los valores por defecto */ }
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) { /* ignorar */ }
  }

  /* ---------- 4. Aplicar cada ajuste a la página ---------- */

  // AUMENTAR / DISMINUIR TEXTO
  // >>> Aquí va la lógica del tamaño de texto. Se cambia el font-size de <html> en porcentaje;
  //     como el sitio usa rem, todo el texto crece o se encoge en proporción.
  //     Si quieres otros pasos o límites, edita TEXT_STEP, TEXT_MIN y TEXT_MAX arriba.
  function applyTextSize() {
    const percent = 100 + state.textStep * TEXT_STEP;
    if (state.textStep === 0) root.style.removeProperty('font-size');   // 100 %: vuelve al tamaño original
    else root.style.fontSize = percent + '%';
    sizeValue.textContent = percent + '%';
    sizeDown.disabled = state.textStep <= TEXT_MIN;                      // no se puede bajar más
    sizeUp.disabled = state.textStep >= TEXT_MAX;                        // no se puede subir más
  }

  // ALTO CONTRASTE · ESCALA DE GRISES · SUBRAYAR ENLACES · FUENTE PARA DISLEXIA
  // >>> Aquí va la lógica de los interruptores: solo se pone o quita una clase en <html>.
  //     Lo que hace cada clase (colores, filtro, subrayado, tipografía) está en accesibilidad.css, sección 6.
  //     Si necesitas algo más complejo (por ejemplo, cargar una fuente), añade el código dentro del `forEach`.
  function applyToggles() {
    Object.entries(TOGGLES).forEach(([key, className]) => {
      root.classList.toggle(className, state[key]);
      const btn = widget.querySelector(`[data-a11y="${key}"]`);
      if (btn) btn.setAttribute('aria-checked', String(state[key]));     // mantiene el interruptor sincronizado
    });
  }

  function apply() {
    applyTextSize();
    applyToggles();
  }

  // Mensaje para lectores de pantalla (se lee en voz alta sin mover el foco)
  function announce(message) {
    status.textContent = '';                                              // vaciar primero para que se repita aunque sea el mismo texto
    window.setTimeout(() => { status.textContent = message; }, 50);
  }

  /* ---------- 5. Acciones de los botones ---------- */
  function changeTextSize(direction) {
    const next = Math.min(TEXT_MAX, Math.max(TEXT_MIN, state.textStep + direction));
    if (next === state.textStep) return;
    state.textStep = next;
    apply();
    save();
    announce('Tamaño de texto al ' + (100 + next * TEXT_STEP) + ' por ciento');
  }

  function toggleOption(key) {
    state[key] = !state[key];
    apply();
    save();
    announce(LABELS[key] + (state[key] ? ' activado' : ' desactivado'));
  }

  // RESTABLECER TODO
  // >>> Aquí va la lógica del reset: vuelve al estado inicial, limpia las clases y borra lo guardado.
  function resetAll() {
    state = { ...DEFAULTS };
    apply();
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) { /* ignorar */ }
    announce('Todos los ajustes de accesibilidad se restablecieron');
  }

  /* ---------- 6. Abrir y cerrar el panel ---------- */
  function openPanel() {
    panel.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    closeBtn.focus();                                                     // el foco entra al panel para quien usa teclado
  }

  function closePanel(returnFocus = true) {
    if (!panel.classList.contains('is-open')) return;
    panel.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    if (returnFocus) trigger.focus();                                     // el foco vuelve al botón que lo abrió
  }

  const isOpen = () => panel.classList.contains('is-open');

  /* ---------- 7. Eventos ---------- */
  trigger.addEventListener('click', () => (isOpen() ? closePanel() : openPanel()));
  closeBtn.addEventListener('click', () => closePanel());

  // Un solo "oyente" para todos los botones del panel, según su data-a11y
  panel.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-a11y]');
    if (!btn) return;
    const action = btn.dataset.a11y;

    if (action === 'text-up') changeTextSize(+1);
    else if (action === 'text-down') changeTextSize(-1);
    else if (action === 'reset') resetAll();
    else if (action in TOGGLES) toggleOption(action);
  });

  // Esc cierra el panel
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) closePanel();
  });

  // Clic fuera del panel lo cierra (sin robar el foco a lo que el usuario tocó)
  document.addEventListener('click', (e) => {
    if (isOpen() && !widget.contains(e.target)) closePanel(false);
  });

  /* ---------- 8. Inicio ---------- */
  load();     // lee lo guardado en la visita anterior
  apply();    // lo aplica a la página
})();

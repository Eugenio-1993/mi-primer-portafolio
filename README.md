# Portafolio de Eugenio Enrique Morales Carrizo

Portafolio web de una sola página hecho con **HTML5, CSS y JavaScript puros**, sin frameworks ni herramientas de instalación. Muestra quién soy, mi trayectoria, mi proyecto BiblioLend, mis habilidades y cómo contactarme.

Este documento está escrito para alguien que apenas está aprendiendo: explica qué hay en cada archivo, por qué se tomó cada decisión y cómo cambiar el contenido.

---

## 1. Cómo ver el portafolio en tu computador

1. Abre la carpeta del proyecto.
2. Haz doble clic en `index.html`. Se abre en tu navegador.

No necesitas instalar nada. Las tipografías viajan dentro del proyecto (carpeta `assets/fonts`), así que se ven igual con o sin internet.

> Sobre el despliegue: el proyecto ya incluye `netlify.toml`, el archivo de configuración que Netlify lee al publicar. Tu profesor te guiará con el resto.

---

## 2. Estructura de archivos

```
portafolio/
├── index.html          La página completa (todas las secciones, más los datos de SEO del <head>)
├── 404.html            Página que se muestra si alguien entra a una dirección que no existe
├── robots.txt          Le dice a los buscadores que pueden leer el sitio
├── sitemap.xml         La lista de páginas del sitio, para los buscadores
├── css/
│   └── styles.css      Todo el diseño: colores, tipografías, tamaños
├── js/
│   └── main.js         La interactividad: menú, animaciones, botón de copiar, fondo
├── assets/
│   ├── favicon.svg          El iconito de la pestaña del navegador
│   ├── apple-touch-icon.png El ícono cuando guardan la página en la pantalla de inicio del iPhone
│   ├── og-image.png         La imagen que aparece al compartir el enlace (1200 × 630)
│   ├── foto-eugenio.jpg     Tu foto de la tarjeta (ya optimizada: pesa unos 40 KB)
│   ├── proyectos/           Las capturas de BiblioLend (computador, celular y tablet) en formato WebP
│   ├── quipux-logo.png      El logo que se ve en la tarjeta
│   ├── fonts/               Las dos tipografías del diseño
│   └── icons/               Los logos de las tecnologías (HTML5, CSS3, JavaScript, Java, Python, Git, GitHub y Netlify)
├── netlify.toml        Configuración para publicar en Netlify (cabeceras de seguridad y SEO)
└── README.md           Este documento
```

Cada archivo tiene **una sola responsabilidad**:

| Archivo | Qué responde | Analogía |
|---|---|---|
| `index.html` | ¿Qué hay en la página? | El esqueleto y el contenido |
| `styles.css` | ¿Cómo se ve? | La ropa y la decoración |
| `main.js` | ¿Cómo se comporta? | Los músculos y los reflejos |

Separar estas tres cosas hace que cambiar un texto, un color o un comportamiento sea fácil y no rompa lo demás.

---

## 3. Decisiones de arquitectura

### 3.1 ¿Por qué HTML5 nativo y no React, Next.js o Angular?

- **Es una página informativa.** No hay inicio de sesión, ni base de datos, ni datos que cambien. Un framework agregaría complejidad que no necesitamos.
- **Carga muy rápido.** No hay librerías que descargar: solo tres archivos pequeños.
- **Se publica sin pasos extra.** Netlify sirve los archivos tal cual, sin instalar dependencias ni compilar.
- **Demuestra los fundamentos.** Los frameworks se construyen sobre HTML, CSS y JavaScript. Dominar esta base es lo que hace fácil aprender cualquier framework después.
- **Es mantenible para quien está aprendiendo.** Puedes abrir cualquier archivo y entender qué hace sin conocer herramientas adicionales.

**Cuándo cambiaría la decisión:** si el portafolio creciera a muchas páginas, un blog o contenido que venga de una base de datos, sería el momento de pasar a un framework como React o Next.js.

### 3.2 Una sola página con secciones (single page)

Todo vive en `index.html` y el menú te lleva a cada sección con enlaces internos (`#sobre-mi`, `#proyectos`...). Así quien te visita recorre tu historia de arriba hacia abajo, como un relato, sin esperar a que carguen otras páginas.

### 3.3 Diseño alrededor de un eje de simetría

La idea de diseño es una línea vertical en el centro de la pantalla:

- El **menú** se reparte a ambos lados de la marca central.
- El **nombre** del hero se abre desde el centro hacia afuera.
- El **fondo** de partículas cubre toda la página y reacciona al cursor como un imán.
- La **línea de tiempo** alterna sus tarjetas a izquierda y derecha del eje.

La marca personal es un rombo con una **M** adentro (de Morales). Es un diseño original y simétrico.

### 3.4 Accesibilidad

- **HTML semántico:** se usan `header`, `nav`, `main`, `section`, `article` y `footer` para que los lectores de pantalla entiendan la estructura.
- **Un solo `h1`** (tu nombre) y títulos ordenados (`h2`, `h3`, `h4`).
- **Navegación con teclado:** todo se puede usar sin mouse, con foco visible. El enlace "Saltar al contenido" lleva el foco a `<main>` (por eso `main` tiene `tabindex="-1"`).
- **Menú del celular:** el botón siempre se llama "Menú" y `aria-expanded` avisa si está abierto. Mientras está abierto, el resto de la página queda `inert` (el teclado no puede entrar a lo que no se ve). Con `Esc` se cierra y el foco vuelve al botón.
- **Sección actual en el menú:** se marca con `aria-current="location"`, el valor pensado para "la parte de esta página donde estás".
- **Títulos con efecto de letras:** el título lleva `aria-label` con el texto completo y las letras sueltas se ocultan (`aria-hidden`), así el lector de pantalla no deletrea.
- **Contraste:** el texto secundario (`--muted`) sobre el fondo da 6,8:1 y el principal 15:1; el mínimo exigido (WCAG AA) es 4,5:1.
- **Menos movimiento:** si el sistema del visitante lo pide (`prefers-reduced-motion`), se apagan las animaciones y el fondo queda quieto.
- **Avisos para lectores de pantalla:** el botón "Copiar correo" anuncia el resultado con una región `role="status"`.
- **Imágenes:** las decorativas llevan `alt=""`; las que informan (logo) llevan texto alternativo.
- **Revisión automática:** se pasó la herramienta axe-core (reglas WCAG 2.0, 2.1, 2.2 nivel AA y buenas prácticas) en computador y celular: 0 violaciones. Esa herramienta no puede medir el contraste sobre el fondo de partículas ni sobre las tarjetas con degradado, así que ese contraste se calculó a mano.

### 3.5 Buenas prácticas de código y rendimiento

- **Sin código dentro de las etiquetas:** no hay `onclick`, `onerror` ni `style="..."` en el HTML. Todo el comportamiento está en `main.js` y todo el estilo en `styles.css`. Eso permite una política de seguridad estricta (ver abajo).
- **Política de seguridad (CSP)** en `netlify.toml`: el navegador solo acepta scripts, estilos, fuentes e imágenes del propio sitio. Si alguien lograra meter un script ajeno, el navegador lo bloquea. Además: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` y `Permissions-Policy`.
- **Imágenes ligeras:** la foto se redujo de 530 KB a unos 40 KB (640 px de ancho, JPG progresivo) y todas las imágenes declaran `width` y `height`, para que la página no "salte" al cargar.
- **Caché:** las tipografías se guardan un año en el navegador de quien te visita.
- **Cero dependencias:** no hay librerías externas ni conexiones a otros sitios.
- **CSS sin sobras:** se eliminaron las reglas que ya no se usaban.
- **Animaciones ligeras:** las del cursor usan `transform`, que el navegador resuelve con la tarjeta gráfica; los ciclos de animación se detienen cuando el hero no se ve; el cambio de tamaño de ventana se agrupa en un solo cálculo por cuadro.
- **Nombres en minúscula y sin espacios** en los archivos, porque Netlify distingue mayúsculas (`Foto.jpg` y `foto.jpg` serían archivos distintos).

### 3.6 SEO (que Google te encuentre y se vea bien al compartir)

Todo está en el `<head>` de `index.html`:
- **`<title>` y `description`:** lo que Google muestra como título y resumen.
- **`canonical`:** le dice a Google cuál es la dirección oficial de la página.
- **Open Graph y Twitter Card:** la tarjeta con imagen (`assets/og-image.png`) que aparece al pegar el enlace en WhatsApp, LinkedIn o Facebook.
- **Datos estructurados (JSON-LD):** un bloque que describe quién eres (nombre, estudios, GitHub, idiomas) en el formato `schema.org` que entienden los buscadores. Solo contiene datos que ya están en la página.
- **`robots.txt` y `sitemap.xml`:** permiten el rastreo y señalan la página principal.
- **Lo que ya ayuda sin hacer nada extra:** `lang="es"`, un solo `h1`, títulos jerárquicos, texto real (no texto dentro de imágenes), carga rápida y buena versión móvil.

Una nota honesta: con una sola página, el SEO se limita a que aparezca tu nombre ("Eugenio Morales Carrizo") y a verse bien al compartir. Para posicionar otras búsquedas haría falta más contenido, como un blog.

---

## 4. Descripción de los componentes

Un **componente** es una pieza de la página con una función clara. Aquí están todos, en el orden en que aparecen.

### Encabezado y navegación (`.site-header`, `.nav`)
Menú fijo arriba. En computador se reparte en dos grupos a los lados de la marca. En celular se convierte en un botón de menú que abre una pantalla completa.

### Hero (`.hero`)
La primera pantalla, en dos columnas: a la izquierda tu marca, tu nombre, tu rol (**Futuro Arquitecto de software**), una frase y dos botones; a la derecha, la tarjeta. En celular se apilan. El fondo animado ahora es global (ver más abajo).

**Efecto del cursor en el nombre.** JavaScript parte tu nombre en letras. Cada letra calcula a qué distancia está el cursor: cuanto más cerca, más sube, más crece, más se aparta hacia un lado, como si el cursor la empujara. Las letras vecinas reaccionan menos y las lejanas no se mueven. Está en el bloque 4 de `js/main.js` (la función `createLetterEffect`, que también usa el título de Proyectos) y en la clase `.ch` de `styles.css`.

**Tarjeta 2D (`.badge`).** Una credencial de trabajador simulada, colgada de una cinta de tela azul con la palabra QUIPUX repetida (`.lanyard`). Muestra solo la empresa, tu foto, tu nombre, tu cargo hipotético (**Arquitecto de Software**), un guiño ("El trabajador más querido de la empresa. (Después de Sebas)") y un **código QR** que lleva a tu GitHub. Al mover el cursor sobre ella:
- Toda la tarjeta se desplaza y gira un poco (`translate` y `rotate`) hacia donde apunta el cursor.
- Cada pieza (logo, nombre, QR, frase; la foto no) se mueve un poco distinto (`translate` con un factor `--k` por pieza), así se separan unas de otras sin usar 3D.
- La pieza que tocas con el cursor crece un poco (`scale`).
- Sin cursor, la tarjeta se mece muy suave sola. En celular no hay "pasar por encima", así que solo se mece.
- Si la persona tiene activado "reducir movimiento" en su sistema, todo esto se apaga.

**Tarjeta agarrable.** Con el clic sostenido sobre la tarjeta se puede arrastrar de lado a lado (cursor de mano abierta y luego cerrada). La cinta y la tarjeta se mueven juntas: toda la escena (`.badge-scene`) gira como un péndulo alrededor del punto del que cuelga la cinta, así que la cinta nunca se separa de la tarjeta. Además la tarjeta se balancea un poco respecto a la cinta, girando sobre su ojal (variable `--lag`). Al soltar, un resorte amortiguado la devuelve a la vertical con varios vaivenes, y si la soltaste en movimiento conserva el impulso. Está en el bloque 5b de `js/main.js`. Ajustes, al inicio de ese bloque: `K` (rigidez: más alto, vaivén más rápido), `DAMP` (amortiguación: más alto, menos vaivenes) y `maxAngle` (cuánto se puede abrir: 28° en computador, 18° en celular). En pantalla táctil el arrastre horizontal mueve la tarjeta y el vertical sigue haciendo scroll. Con "reducir movimiento" el arrastre funciona, pero al soltar vuelve a su sitio sin vaivenes.

**Realismo de la tarjeta.** Se investigaron técnicas para que una credencial colgada se vea como un objeto real (cuerdas con integración de Verlet, brillos que siguen la luz, sombras con profundidad) y se aplicaron las de bajo costo, todas en CSS salvo unas variables que calcula el bloque 5b de `js/main.js`:
- **Brillo de plástico (`.badge::after`):** un reflejo puntual y una franja de luz que se deslizan por la superficie al girar, balancearse o inclinarla con el cursor. Se recorta con el borde redondeado.
- **Giro en el eje vertical (`--ry`):** al moverse rápido la tarjeta se tuerce unos grados con perspectiva, como una credencial real que gira sobre su cinta.
- **Sombra que reacciona (`--sheen`):** la sombra oscura se desplaza al lado contrario del giro, como si la luz viniera de arriba.
- **Material:** grano fino de plástico (un `<svg>` dentro del CSS), luz en los bordes y un canto con grosor hecho con sombras apiladas.
- **Plastificado:** la tarjeta tiene un borde transparente (`--seal`, definido en `.badge-scene`) que deja ver el fondo a través, con un velo de luz, una línea fina donde termina el papel y un canto biselado en el borde exterior (`.badge::after`). El brillo también cruza ese borde. Para hacerlo más grueso o más delgado, cambia `--seal` (por defecto `0.65rem`); el cordón y el ojal se ajustan solos.
- **No incluido todavía:** una cinta totalmente flexible (cuerda de Verlet que se curva). Hoy la cinta gira rígida junto con la tarjeta.

Es una tarjeta de presentación personal de simulación, no una credencial oficial de Quipux. El QR está dibujado directamente en el HTML (un `<svg>`), no es una imagen aparte.

### Sobre mí (`.folder`, `.tilt`)
Dos piezas:
- **La carpeta (`.folder`).** Tiene tres capas: el fondo con su pestaña, las hojas con tu texto y la tapa. La tapa gira sobre su borde inferior (`transform-origin: bottom` con `rotateX` negativo) y se abre hacia quien mira: al terminar, su borde de arriba queda más ancho que el de abajo. Se abre al pasar el cursor, y también con clic o Enter (queda abierta hasta que vuelves a hacer clic). El texto siempre está en la página; la animación solo lo revela, así que los lectores de pantalla lo leen igual. La lógica está en el bloque 7 de `js/main.js`.
- **Las tarjetas "Cómo aprendí" (`.tilt`).** Están torcidas a propósito (`rotateY` y `rotateZ` distintos en cada una). Al pasar el cursor se enderezan y se resaltan con un contorno blanco.

Para cambiar el texto de la carpeta, edita el bloque `<article class="folder__paper">` en `index.html`.

### Educación y experiencia (`.timeline`)
Línea de tiempo con tres hitos: Semillero Quipux, BiblioLend y tu graduación de la media técnica. Los hitos alternan de lado alrededor del eje.

Una línea vertical une los tres rombos, del primero al último, y no se pasa de ahí. Para lograrlo, cada hito (menos el último) dibuja con `.tl::after` un tramo que va desde el centro de su rombo hasta el centro del siguiente; la suma de los tramos es la línea completa. Así funciona aunque cambies el texto de las tarjetas o agregues más hitos. En celular la línea pasa al borde izquierdo. Su color se cambia con `--tl-line` y la separación entre hitos con `--tl-gap`, ambas al inicio de `.timeline` en `css/styles.css`.

### Proyectos (`.proj-title`, `.projects`, `.project`)
- **El título.** "Proyectos" es más grande que los otros títulos y tiene la misma animación del nombre del hero: se abre de izquierda a derecha cuando aparece en pantalla y, al pasar el cursor, las letras suben, crecen y se apartan. La entrada es CSS (`.proj-title.will-reveal` y `.is-in`) y la activa `js/main.js` con un `IntersectionObserver`, que avisa cuando algo entra en pantalla. El efecto del cursor es el mismo código del nombre (la función `createLetterEffect`, bloque 4), usado en todos los títulos de sección; el bloque 6 es el que los activa. Con "reducir movimiento" activado el título se ve normal y quieto.
- **Los dos proyectos, lado a lado.** Van dentro de `.projects`, una cuadrícula de dos columnas: las tarjetas quedan en la misma fila y miden lo mismo de alto. En tablet y celular (menos de 880 px) se apilan.
  - **BiblioLend:** título, un resumen corto y un **visor de dispositivos** (`.viewer`). A la izquierda hay tres botones en columna (computador, celular y tablet) y al lado la captura de la pantalla dentro de un marco. En celular los botones pasan a una fila arriba del visor.
  - **Semillero Quipux:** qué es y por qué lo quieres.

**Cómo funciona el visor de BiblioLend.**
- Los botones son *pestañas* (`role="tablist"`, `role="tab"` y `role="tabpanel"`): es el patrón que los lectores de pantalla entienden. Con el teclado, las flechas cambian de pestaña y `Inicio` y `Fin` van a la primera y a la última. La lógica está en el bloque 7c de `js/main.js`.
- Los marcos (laptop, celular estilo Pixel y tablet) están dibujados solo con CSS (`.dev--laptop`, `.dev--phone`, `.dev--tablet`), sin imágenes de dispositivos. Cada marco toma su forma de la captura que lleva dentro: la imagen fija el tamaño y el marco la rodea con un borde (`padding`) y esquinas redondeadas (`border-radius`).
- La cámara del celular y de la tablet, el botón de encendido y la base del laptop son pseudo-elementos (`::before` y `::after`).

**Cómo cambiar las capturas.** Guarda las nuevas en `assets/proyectos/` con el mismo nombre (`bibliolend-pc.webp`, `bibliolend-celular.webp` y `bibliolend-tablet.webp`). Si cambia la proporción, actualiza `width` y `height` de la etiqueta `<img>` en `index.html`. Tamaños recomendados: computador 1440 × 900, celular 412 × 915 y tablet 1024 × 768. Hoy la tablet es vertical (383 × 512) porque así era la captura; si la recapturas en horizontal, hay que ajustar `.dev--tablet` en `css/styles.css`.

### Tecnologías (`.stack`, `.tile`, `.langs`)
Tres tarjetas: **Frontend** (HTML5, CSS3, JavaScript), **Backend** (Java, Python) y **Versiones y despliegue** (Git, GitHub, Netlify). Debajo, una tarjeta de **Idiomas** con español nativo e inglés nivel A2. Los logos son archivos SVG dentro de `assets/icons`.

Para agregar una tecnología, copia una línea `<li class="tile">...</li>`, guarda el logo en `assets/icons` y cambia el nombre.

### Habilidades blandas (`.soft`)
Ocho habilidades, cada una con una frase que la respalda con algo que viviste. Usan el mismo efecto que las tarjetas de "Cómo aprendí": están torcidas a propósito (tres inclinaciones que se repiten con `:nth-child(3n + 1)`, `3n + 2` y `3n + 3`) y al pasar el cursor se enderezan y se resaltan con un contorno blanco. Para cambiar la inclinación, edita `--ry` y `--rz` en esas tres reglas.

**Cursor "bola" (`.ball`).** Dentro de esta sección y de Hobbies, y solo con mouse, el puntero normal se oculta y lo reemplaza una bola blanca con `mix-blend-mode: difference`: esa propiedad calcula el color contrario al de lo que hay debajo (sobre el gris se ve clara, sobre una tarjeta blanca se ve oscura, y el texto cambia de color donde la bola lo cubre). Sobre una tarjeta (o sobre cada hobby) la bola crece al doble. La crea y la mueve `js/main.js` (bloque 7b); el estilo está en `css/styles.css` junto a `.soft`. En pantallas táctiles no se activa, y si JavaScript fallara el puntero normal seguiría visible, porque quien lo oculta es el mismo script. Con "reducir movimiento" la bola sigue al cursor sin retraso. Para cambiar su tamaño, edita `width` y `height` de `.ball`. Para sumarla a otra sección, agrega su id en `BALL_SECTIONS` y `BALL_BIG` (bloque 7b de `js/main.js`) y en la regla `.has-ball` del CSS.

### Hobbies (`.sports`)
Cuatro casillas: Running, Gaming, Ciclismo y Programar.

### Contacto (`.contact`)
A la izquierda el título "Hablemos." (en blanco suave, `--ink`, sin fondo), un botón **Escríbeme** (abre tu correo) y un botón **Copiar correo**. Debajo, una fila de íconos de redes sociales (`.social`): LinkedIn, TikTok, X e Instagram, de izquierda a derecha. A la derecha, una lista con tu **correo**, tu **WhatsApp** (el enlace `https://wa.me/573135318195` abre el chat directamente) y tu **GitHub**.

Los íconos están en el bloque de símbolos del inicio de `index.html` (`ico-linkedin`, `ico-tiktok`, `ico-x`, `ico-instagram`) y vienen de la colección libre [Simple Icons](https://simpleicons.org). Para cambiar un enlace o agregar otra red: edita o copia un `<li>` de `<ul class="social">`. Los cuatro perfiles también están en los datos estructurados de SEO (`sameAs`, en el `<head>`), para que Google los asocie contigo.

### Fondo interactivo (`#bg-canvas`)
Un `<canvas>` fijo detrás de toda la página sobre un gris liso (`--bg`), sin degradados. Dibuja partículas que flotan casi sin moverse; cuando el cursor se acerca, las que están dentro del campo son atraídas hacia él, con un leve giro, como limaduras de hierro junto a un imán. Al alejar el cursor (o sacarlo de la ventana), regresan despacio a su sitio. En celular las partículas solo flotan. Con "reducir movimiento" se muestra una imagen fija. Está en el bloque 8 de `js/main.js`; se ajusta con `FIELD` (alcance del imán), `PULL` (fuerza) y `SPRING` (qué tan rápido vuelven).

### Pie de página (`.footer`)
Marca, tu nombre y el año, que se actualiza solo.

---

## 5. Cómo cambiar el contenido

Todo el contenido está en `index.html`. Busca el texto que quieres cambiar y edítalo.

**Cambiar tu WhatsApp:** en la sección de contacto hay dos lugares: el enlace `https://wa.me/573135318195` (solo números, con el código del país 57) y el texto que se ve en pantalla.

**Cambiar los colores:** abre `css/styles.css` y mira el bloque `:root` al principio. Ahí están todos los colores. Cambiar `--bg` cambia el gris de la página y `--ice` el color de acento.

**Agregar una foto más adelante:** guárdala en `assets/` y agrégala en el HTML con una etiqueta `<img src="assets/mi-foto.jpg" alt="Descripción de la foto">`. Recuerda escribir siempre el `alt`.

**Agregar un proyecto nuevo:** copia un bloque `<article class="project">...</article>` completo dentro de `<div class="projects">` y cambia los textos. Con un tercer proyecto, la cuadrícula lo acomoda en una segunda fila.

---

### Cambiar la foto de la tarjeta

1. Elige una foto vertical (de pie o de medio cuerpo), con buena luz y el rostro en la parte de arriba.
2. **Redúcela antes de subirla**: unos 640 píxeles de ancho y calidad 80 bastan (una foto de celular sin reducir puede pesar 3 MB y hace lenta la página). Herramienta gratis: Squoosh (squoosh.app).
3. Guárdala como `assets/foto-eugenio.jpg` (mismo nombre, así no cambias nada más). Si cambian las proporciones, actualiza `width` y `height` de la etiqueta `<img class="badge__img">` en `index.html`.

Si tu cara queda cortada, ajusta `object-position` en la clase `.badge__img` de `css/styles.css` (por ejemplo `center 10%` sube el enfoque).

### Cambiar el QR de la tarjeta

El QR está en `index.html`, dentro de `<svg class="badge__qr">`. Hoy lleva a `https://github.com/Eugenio-1993`. Para que apunte a otro enlace, genera un QR en formato SVG con un generador y reemplaza el contenido del `<svg>`. Antes de publicar, escanéalo con tu celular para confirmar que abre el sitio correcto.

### Colores y logo de Quipux

La tarjeta usa tres colores definidos al inicio de `css/styles.css`: `--badge-bg` (fondo), `--badge-ink` (texto) y `--badge-accent` (acento). Si necesitas ajustarlos a los de la marca, reemplaza esos valores y toda la tarjeta cambia. El logo es `assets/quipux-logo.png`: es una marca de Quipux, así que úsalo solo en el contexto de tu postulación o con su permiso.

---

## 6. SEO: la dirección del sitio (`__SITE_URL__`)

> **Estado actual:** ya está puesta la dirección real, `https://eugenio-morales.netlify.app`, en `index.html`, `robots.txt` y `sitemap.xml`. Lo que sigue es útil solo si algún día cambias de dirección (por ejemplo, un dominio propio).

Para que `canonical`, la imagen al compartir, `robots.txt` y `sitemap.xml` funcionen necesitan la dirección **real** del sitio (por ejemplo `https://eugenio-morales.netlify.app`). Esa dirección todavía no existe mientras escribes el código, así que en esos archivos aparece escrita como `__SITE_URL__`.

- **Si Netlify publica desde un repositorio** (conectado a GitHub): `netlify.toml` tiene un comando que reemplaza `__SITE_URL__` por la dirección real automáticamente en cada publicación. No haces nada.
- **Si se publica arrastrando la carpeta** a Netlify: ese comando no se ejecuta. Entonces hay que reemplazar a mano `__SITE_URL__` por la dirección real en `index.html`, `robots.txt` y `sitemap.xml` (buscar y reemplazar en el editor).

Después de publicar, vale la pena: (1) pegar el enlace en WhatsApp para ver la tarjeta; (2) registrar el sitio en Google Search Console y enviar `sitemap.xml`.

---

## 7. Qué aprender de este proyecto

Si quieres entender el código, este es un buen orden para leerlo:

1. `index.html`: mira cómo se organizan las secciones y qué significa cada etiqueta.
2. `css/styles.css`: empieza por el bloque `:root`, luego `.hero` y después sigue hacia abajo.
3. `js/main.js`: está dividido en bloques numerados con comentarios que explican cada uno. Los bloques 4, 5 y 5b son el efecto de las letras, la tarjeta 2D y la tarjeta agarrable; el 6 son los títulos de sección, el 7b la bola de Habilidades blandas, el 7c el visor de BiblioLend y Hobbies y el 8 el fondo.

---

## 8. Créditos

- Diseño y contenido: Eugenio Enrique Morales Carrizo.
- Tipografías: [Big Shoulders Display](https://fonts.google.com/specimen/Big+Shoulders+Display) e [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans), con licencia libre (SIL Open Font License). Se incluyen en el proyecto a través de [Fontsource](https://fontsource.org).
# mi-primer-portafolio
# mi-primer-portafolio

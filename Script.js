/* ==========================================================
   RUTAS PUEBLA — lógica de la SPA (vanilla JS, sin dependencias)
   ========================================================== */

/* ----------------------------------------------------------
   1) BASE DE DATOS LOCAL DE PUNTOS CLAVE
   ---------------------------------------------------------- */
const ZONAS = {
  puebla:      "Puebla",
  cholula:     "Cholula",
  sanmartin:   "San Martín Texmelucan",
  huejotzingo: "Huejotzingo",
};

const PUNTOS = [
  // Puebla
  { id: "pue-zocalo",     nombre: "Zócalo de Puebla",              zona: "puebla",      tipo: "Centro",     lat: 19.0414, lng: -98.2063 },
  { id: "pue-capu",       nombre: "CAPU · Terminal de Autobuses",  zona: "puebla",      tipo: "Terminal",   lat: 19.0672, lng: -98.1794 },
  { id: "pue-angelopolis",nombre: "Angelópolis",                   zona: "puebla",      tipo: "Comercial",  lat: 19.0067, lng: -98.2417 },
  { id: "pue-buap",       nombre: "BUAP Ciudad Universitaria",     zona: "puebla",      tipo: "Universidad",lat: 19.0028, lng: -98.2059 },
  { id: "pue-mercadoalto",nombre: "Mercado El Alto",                zona: "puebla",      tipo: "Mercado",    lat: 19.0500, lng: -98.1900 },
  { id: "pue-arcangeles", nombre: "Arcángeles",                    zona: "puebla",      tipo: "Comercial",  lat: 19.0244, lng: -98.2367 },
  { id: "pue-lanoria",    nombre: "La Noria",                      zona: "puebla",      tipo: "Barrio",     lat: 19.0333, lng: -98.1961 },
  { id: "pue-4poniente",  nombre: "4 Poniente, Centro Histórico",  zona: "puebla",      tipo: "Centro",     lat: 19.0430, lng: -98.2075 },
  { id: "pue-pasebravo",  nombre: "Paseo Bravo",                   zona: "puebla",      tipo: "Parque",     lat: 19.0472, lng: -98.2108 },

  // Cholula
  { id: "cho-udlap",      nombre: "UDLAP",                          zona: "cholula",     tipo: "Universidad", lat: 19.0561, lng: -98.2833 },
  { id: "cho-piramide",   nombre: "Zona Arqueológica / Pirámide",  zona: "cholula",     tipo: "Monumento",   lat: 19.0578, lng: -98.3022 },
  { id: "cho-sanpedro",   nombre: "San Pedro Cholula, Centro",      zona: "cholula",     tipo: "Centro",      lat: 19.0642, lng: -98.3061 },
  { id: "cho-sanandres",  nombre: "San Andrés Cholula, Centro",     zona: "cholula",     tipo: "Centro",      lat: 19.0489, lng: -98.2967 },
  { id: "cho-recta",      nombre: "Recta a Cholula",                zona: "cholula",     tipo: "Avenida",     lat: 19.0500, lng: -98.2500 },

  // San Martín Texmelucan
  { id: "sma-centro",     nombre: "Centro de San Martín Texmelucan", zona: "sanmartin",  tipo: "Centro",   lat: 19.2836, lng: -98.4325 },
  { id: "sma-terminal",   nombre: "Terminal San Martín",             zona: "sanmartin",  tipo: "Terminal", lat: 19.2800, lng: -98.4290 },
  { id: "sma-caseta",     nombre: "Caseta México-Puebla",            zona: "sanmartin",  tipo: "Caseta",   lat: 19.2600, lng: -98.4100 },
  { id: "sma-mercado",    nombre: "Mercado Emiliano Zapata",         zona: "sanmartin",  tipo: "Mercado",  lat: 19.2850, lng: -98.4350 },

  // Huejotzingo
  { id: "hue-centro",     nombre: "Centro de Huejotzingo",           zona: "huejotzingo", tipo: "Centro",    lat: 19.1500, lng: -98.4050 },
  { id: "hue-convento",   nombre: "Convento Franciscano",            zona: "huejotzingo", tipo: "Monumento", lat: 19.1508, lng: -98.4036 },
  { id: "hue-caseta",     nombre: "Caseta Amozoc-Perote",            zona: "huejotzingo", tipo: "Caseta",    lat: 19.1200, lng: -98.3600 },
  { id: "hue-mercado",    nombre: "Mercado de Huejotzingo",          zona: "huejotzingo", tipo: "Mercado",   lat: 19.1495, lng: -98.4060 },
];

/* color de marcador por zona (mismos tokens que la paleta CSS) */
const COLOR_ZONA = {
  puebla:      "#3E7CB1",
  cholula:     "#F2A73B",
  sanmartin:   "#4FAE7E",
  huejotzingo: "#E1543F",
};

/* centro aproximado de cada zona, para el vuelo del mapa al elegir chip */
const ZONA_CENTRO = {
  puebla:      { lat: 19.0414, lng: -98.2063, zoom: 13 },
  cholula:     { lat: 19.0578, lng: -98.2960, zoom: 14 },
  sanmartin:   { lat: 19.2830, lng: -98.4320, zoom: 14 },
  huejotzingo: { lat: 19.1500, lng: -98.4050, zoom: 14 },
};

/* ----------------------------------------------------------
   2) PLANTILLAS DE RUTAS POR PAR DE ZONAS
   Cada par tiene 3 opciones reales de trade-off:
   tiempo (min) / costo (MXN) / caminata (m)
   ---------------------------------------------------------- */
const RUTAS = {
  "puebla-puebla": [
    { ruta: "RUTA Troncal 2", empresa: "Corredor Ejército de Oriente–Chapultepec", tiempo: 22, costo: 10, caminata: 250,
      pasos: ["Camina a la estación RUTA más cercana", "Aborda el Troncal 2 sentido Centro", "Baja en tu parada y camina el último tramo"] },
    { ruta: "Ruta 72 \"Rojos\"", empresa: "Combi local", tiempo: 35, costo: 8, caminata: 400,
      pasos: ["Toma la combi en la parada de la esquina", "Recorrido directo sin transbordo", "Baja cerca de tu destino"] },
    { ruta: "Ruta 14A", empresa: "Colectivo puerta a puerta", tiempo: 28, costo: 12, caminata: 80,
      pasos: ["Aborda casi en la puerta de tu origen", "Ruta directa por avenidas principales", "Baja a una cuadra de tu destino"] },
  ],
  "cholula-cholula": [
    { ruta: "Combi San Andrés–San Pedro", empresa: "Combi directa", tiempo: 15, costo: 9, caminata: 200,
      pasos: ["Aborda en la parada principal", "Recorrido directo entre ambos centros", "Baja en tu destino"] },
    { ruta: "Ruta UDLAP–Centro", empresa: "Combi local", tiempo: 20, costo: 7, caminata: 300,
      pasos: ["Camina a la parada sobre la avenida", "Combi con paradas intermedias", "Baja y camina el tramo final"] },
    { ruta: "Mototaxi local", empresa: "Sitio de mototaxis", tiempo: 12, costo: 15, caminata: 50,
      pasos: ["Toma un mototaxi del sitio más cercano", "Trayecto directo puerta a puerta"] },
  ],
  "sanmartin-sanmartin": [
    { ruta: "Combi Centro–Terminal", empresa: "Combi local", tiempo: 12, costo: 7, caminata: 200,
      pasos: ["Aborda en el centro", "Recorrido corto y directo", "Baja en la terminal"] },
    { ruta: "Ruta Mercado–Caseta", empresa: "Combi local", tiempo: 18, costo: 6, caminata: 300,
      pasos: ["Camina a la parada del mercado", "Combi con paradas intermedias"] },
    { ruta: "Taxi de sitio", empresa: "Sitio local", tiempo: 10, costo: 20, caminata: 40,
      pasos: ["Toma un taxi del sitio más cercano", "Trayecto directo"] },
  ],
  "huejotzingo-huejotzingo": [
    { ruta: "Combi Centro–Convento", empresa: "Combi local", tiempo: 10, costo: 6, caminata: 150,
      pasos: ["Aborda cerca del centro", "Recorrido breve y directo"] },
    { ruta: "Ruta Mercado–Caseta", empresa: "Combi local", tiempo: 16, costo: 5, caminata: 280,
      pasos: ["Camina a la parada del mercado", "Combi con paradas intermedias"] },
    { ruta: "Mototaxi local", empresa: "Sitio de mototaxis", tiempo: 9, costo: 14, caminata: 40,
      pasos: ["Toma un mototaxi del sitio más cercano", "Trayecto directo puerta a puerta"] },
  ],
  "cholula-puebla": [
    { ruta: "Estrella Roja Directo", empresa: "Vía Recta a Cholula", tiempo: 35, costo: 20, caminata: 300,
      pasos: ["Camina a la parada de Estrella Roja", "Autobús directo sin transbordo", "Baja y camina el tramo final"] },
    { ruta: "Combi \"Blanca y Roja\"", empresa: "San Pedro Cholula – CAPU", tiempo: 50, costo: 14, caminata: 350,
      pasos: ["Aborda en San Pedro Cholula", "Recorrido con paradas intermedias", "Baja en CAPU"] },
    { ruta: "RUTA + combi Angelópolis", empresa: "Combinación", tiempo: 40, costo: 18, caminata: 150,
      pasos: ["Toma la combi hasta Angelópolis", "Transborda a RUTA", "Baja cerca de tu destino"] },
  ],
  "huejotzingo-puebla": [
    { ruta: "Autobús directo Huejotzingo–CAPU", empresa: "Vía autopista", tiempo: 45, costo: 35, caminata: 400,
      pasos: ["Camina a la terminal de Huejotzingo", "Autobús directo por autopista", "Baja en CAPU"] },
    { ruta: "Combi Huejotzingo–San Martín–Puebla", empresa: "Combinación local", tiempo: 70, costo: 28, caminata: 500,
      pasos: ["Aborda la combi local", "Transborda en San Martín", "Continúa hasta Puebla"] },
    { ruta: "Autobús con parada Angelópolis", empresa: "Vía autopista", tiempo: 50, costo: 38, caminata: 200,
      pasos: ["Aborda el autobús directo", "Baja en la parada de Angelópolis", "Camina el tramo final"] },
  ],
  "puebla-sanmartin": [
    { ruta: "Autobús directo CAPU–San Martín", empresa: "Vía autopista", tiempo: 40, costo: 33, caminata: 300,
      pasos: ["Aborda en CAPU", "Autobús directo por autopista", "Baja en la terminal de San Martín"] },
    { ruta: "Combi Ruta Libre 190", empresa: "Combi local", tiempo: 65, costo: 25, caminata: 450,
      pasos: ["Aborda la combi en Puebla", "Recorrido por la ruta libre", "Baja en el centro de San Martín"] },
    { ruta: "Autobús, parada Centro", empresa: "Vía autopista", tiempo: 45, costo: 35, caminata: 150,
      pasos: ["Aborda el autobús directo", "Baja en la parada del centro", "Camina el tramo final"] },
  ],
  "cholula-sanmartin": [
    { ruta: "Cholula–Puebla + San Martín", empresa: "Combinación", tiempo: 75, costo: 45, caminata: 400,
      pasos: ["Toma Estrella Roja a Puebla", "Transborda en CAPU", "Continúa a San Martín"] },
    { ruta: "Combi directa vía libramiento", empresa: "Combi local", tiempo: 90, costo: 30, caminata: 500,
      pasos: ["Aborda la combi directa", "Recorrido por el libramiento", "Baja en San Martín"] },
    { ruta: "Autobús con transbordo en CAPU", empresa: "Combinación", tiempo: 80, costo: 42, caminata: 200,
      pasos: ["Aborda hacia CAPU", "Transborda a San Martín", "Baja en la terminal"] },
  ],
  "cholula-huejotzingo": [
    { ruta: "Cholula–Puebla–Huejotzingo", empresa: "Combinación", tiempo: 80, costo: 48, caminata: 450,
      pasos: ["Toma la combi a Puebla", "Transborda hacia Huejotzingo", "Baja en el centro"] },
    { ruta: "Combi directa (poco frecuente)", empresa: "Combi local", tiempo: 95, costo: 32, caminata: 500,
      pasos: ["Espera la combi directa", "Recorrido sin transbordo", "Baja en tu destino"] },
    { ruta: "Transbordo en Angelópolis", empresa: "Combinación", tiempo: 85, costo: 45, caminata: 250,
      pasos: ["Aborda hacia Angelópolis", "Transborda a Huejotzingo", "Camina el tramo final"] },
  ],
  "huejotzingo-sanmartin": [
    { ruta: "Combi directa Huejotzingo–San Martín", empresa: "Combi local", tiempo: 25, costo: 15, caminata: 300,
      pasos: ["Aborda en el centro de Huejotzingo", "Recorrido directo", "Baja en San Martín"] },
    { ruta: "Combi Ruta Libre", empresa: "Combi local", tiempo: 35, costo: 12, caminata: 400,
      pasos: ["Aborda cerca de la caseta", "Recorrido con paradas intermedias"] },
    { ruta: "Colectivo puerta a puerta", empresa: "Colectivo", tiempo: 22, costo: 20, caminata: 100,
      pasos: ["Aborda casi en la puerta de tu origen", "Trayecto directo"] },
  ],
};

/* categorías de comparación */
const CATEGORIAS = [
  { key: "tiempo",   label: "Más rápida",     claseTag: "tag--tiempo",   unidad: "min" },
  { key: "costo",    label: "Más económica",  claseTag: "tag--costo",    unidad: "$" },
  { key: "caminata", label: "Menos caminata", claseTag: "tag--caminata", unidad: "m" },
];

/* ----------------------------------------------------------
   3) UTILIDADES
   ---------------------------------------------------------- */
function normalizar(str){
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function claveZonas(zonaA, zonaB){
  return [zonaA, zonaB].sort().join("-");
}

function escapeHTML(str){
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function buscarPuntos(query, zonaPreferida){
  const q = normalizar(query);
  let resultados = PUNTOS.filter(p => normalizar(p.nombre).includes(q));
  // prioriza la zona activa sin excluir las demás
  resultados.sort((a, b) => {
    const aZona = a.zona === zonaPreferida ? 0 : 1;
    const bZona = b.zona === zonaPreferida ? 0 : 1;
    return aZona - bZona;
  });
  return resultados.slice(0, 7);
}

/* ----------------------------------------------------------
   4) ESTADO
   ---------------------------------------------------------- */
const state = {
  zonaActiva: "puebla",
  origen: null,
  destino: null,
};

/* ----------------------------------------------------------
   5) SELECTOR DE ZONA
   ---------------------------------------------------------- */
const zoneChips = document.querySelectorAll(".zone-chip");
zoneChips.forEach(chip => {
  chip.addEventListener("click", () => {
    zoneChips.forEach(c => { c.classList.remove("is-active"); c.setAttribute("aria-pressed", "false"); });
    chip.classList.add("is-active");
    chip.setAttribute("aria-pressed", "true");
    state.zonaActiva = chip.dataset.zone;
  });
});

/* asigna (o limpia) un punto de origen/destino, sincronizando
   estado + input de texto + botón de limpiar */
function asignarPunto(stateKey, punto){
  state[stateKey] = punto;
  const input = document.getElementById(stateKey);
  const clearBtn = document.querySelector(`.clear-btn[data-target="${stateKey}"]`);
  if (input) input.value = punto ? punto.nombre : "";
  if (clearBtn) clearBtn.hidden = !punto;
  actualizarEstadoBusqueda();
}

/* ----------------------------------------------------------
   6) AUTOCOMPLETADO
   ---------------------------------------------------------- */
function configurarAutocompletado(inputId, listId, stateKey){
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);
  const clearBtn = document.querySelector(`.clear-btn[data-target="${inputId}"]`);
  let activeIndex = -1;

  function cerrarLista(){
    list.hidden = true;
    input.setAttribute("aria-expanded", "false");
    activeIndex = -1;
  }

  function abrirLista(items){
    list.innerHTML = "";
    if (items.length === 0){
      const li = document.createElement("li");
      li.className = "no-match";
      li.textContent = "Sin coincidencias. Prueba con otro nombre.";
      list.appendChild(li);
    } else {
      items.forEach(punto => {
        const li = document.createElement("li");
        li.setAttribute("role", "option");
        li.dataset.id = punto.id;
        li.innerHTML = `<span>${punto.nombre}</span><span class="s-zone">${ZONAS[punto.zona]}</span>`;
        li.addEventListener("click", () => seleccionarPunto(punto));
        list.appendChild(li);
      });
    }
    list.hidden = false;
    input.setAttribute("aria-expanded", "true");
  }

  function seleccionarPunto(punto){
    asignarPunto(stateKey, punto);
    cerrarLista();
  }

  input.addEventListener("focus", () => {
    const items = buscarPuntos(input.value, state.zonaActiva);
    abrirLista(items);
  });

  input.addEventListener("input", () => {
    state[stateKey] = null;
    clearBtn.hidden = input.value.length === 0;
    const items = buscarPuntos(input.value, state.zonaActiva);
    abrirLista(items);
    actualizarEstadoBusqueda();
  });

  input.addEventListener("keydown", (e) => {
    const opciones = list.querySelectorAll("li:not(.no-match)");
    if (list.hidden || opciones.length === 0) return;

    if (e.key === "ArrowDown"){
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, opciones.length - 1);
      opciones.forEach((li, i) => li.classList.toggle("is-highlighted", i === activeIndex));
      opciones[activeIndex]?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp"){
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      opciones.forEach((li, i) => li.classList.toggle("is-highlighted", i === activeIndex));
      opciones[activeIndex]?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter"){
      if (activeIndex >= 0){
        e.preventDefault();
        opciones[activeIndex].click();
      }
    } else if (e.key === "Escape"){
      cerrarLista();
    }
  });

  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !list.contains(e.target)){
      cerrarLista();
    }
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    state[stateKey] = null;
    clearBtn.hidden = true;
    input.focus();
    actualizarEstadoBusqueda();
  });
}

configurarAutocompletado("origen", "origen-suggestions", "origen");
configurarAutocompletado("destino", "destino-suggestions", "destino");

/* ----------------------------------------------------------
   8) VALIDACIÓN DEL FORMULARIO
   ---------------------------------------------------------- */
const btnBuscar = document.getElementById("btn-buscar");
const searchHint = document.getElementById("search-hint");

function actualizarEstadoBusqueda(){
  const listo = Boolean(state.origen && state.destino);
  btnBuscar.disabled = !listo;

  if (state.origen && state.destino && state.origen.id === state.destino.id){
    searchHint.textContent = "Elige un destino distinto al origen.";
    searchHint.classList.add("is-error");
    btnBuscar.disabled = true;
  } else if (!state.origen || !state.destino){
    searchHint.textContent = "Elige un punto de la lista para origen y destino.";
    searchHint.classList.remove("is-error");
  } else {
    searchHint.textContent = "";
    searchHint.classList.remove("is-error");
  }
}
actualizarEstadoBusqueda();

/* ----------------------------------------------------------
   9) BÚSQUEDA Y RENDER DE RESULTADOS
   ---------------------------------------------------------- */
const form = document.getElementById("search-form");
const resultsEmpty = document.getElementById("results-empty");
const resultsList = document.getElementById("results-list");
const cardsGrid = document.getElementById("cards-grid");
const resultOrigin = document.getElementById("result-origin");
const resultDestino = document.getElementById("result-destino");
const connectorBus = document.getElementById("connector-bus");

function obtenerOpciones(zonaA, zonaB){
  const clave = claveZonas(zonaA, zonaB);
  return RUTAS[clave] || RUTAS["puebla-puebla"]; // fallback genérico
}

function elegirPorCategoria(opciones){
  const usados = new Set();
  return CATEGORIAS.map(cat => {
    const ordenadas = [...opciones].sort((a, b) => a[cat.key] - b[cat.key]);
    let elegida = ordenadas.find(o => !usados.has(o));
    if (!elegida) elegida = ordenadas[0];
    usados.add(elegida);
    return { ...cat, opcion: elegida };
  });
}

function crearTarjeta({ label, claseTag, unidad, key, opcion }){
  const card = document.createElement("article");
  card.className = "route-card";

  const valorPrincipal = key === "costo" ? `$${opcion.costo}` : `${opcion[key]}${unidad}`;

  card.innerHTML = `
    <span class="card-tag ${claseTag}">${label}</span>
    <div class="card-route-name">${opcion.ruta}</div>
    <div class="card-empresa">${opcion.empresa}</div>

    <div class="card-line">
      <span class="cl-dot cl-dot--o"></span>
      <span class="cl-track"></span>
      <span class="cl-dot cl-dot--d"></span>
    </div>

    <div class="card-stats">
      <div class="stat">
        <span class="stat-value">${opcion.tiempo}</span>
        <span class="stat-label">min</span>
      </div>
      <div class="stat">
        <span class="stat-value">$${opcion.costo}</span>
        <span class="stat-label">MXN</span>
      </div>
      <div class="stat">
        <span class="stat-value">${opcion.caminata}</span>
        <span class="stat-label">m a pie</span>
      </div>
    </div>

    <details class="card-steps">
      <summary>Ver instrucciones</summary>
      <ol>${opcion.pasos.map(p => `<li>${p}</li>`).join("")}</ol>
    </details>

    <a class="card-recorrido-btn" href="mapa-rutas.html" target="_blank" rel="noopener">
      📍 Pica aquí si quieres ver el recorrido
    </a>
  `;
  return card;
}

function crearTarjetaGuardada(rutaGuardada){
  const card = document.createElement("article");
  card.className = "route-card route-card--guardada";

  const tiempo = rutaGuardada.tiempo != null ? `${rutaGuardada.tiempo}` : "—";
  const costo = rutaGuardada.costo != null ? `$${rutaGuardada.costo}` : "—";
  const modoLabel = rutaGuardada.modo === "gps" ? "Grabada con GPS" : "Trazada a mano";
  const pasos = rutaGuardada.notas
    ? rutaGuardada.notas.split("\n").map(l => l.trim()).filter(Boolean)
    : ["Sigue el trazo verde marcado en el mapa."];

  card.innerHTML = `
    <span class="card-tag tag--guardada">📍 Guardada por ti</span>
    <div class="card-route-name">${escapeHTML(rutaGuardada.nombre)}</div>
    <div class="card-empresa">${escapeHTML(rutaGuardada.empresa) || modoLabel}</div>

    <div class="card-line">
      <span class="cl-dot cl-dot--o"></span>
      <span class="cl-track"></span>
      <span class="cl-dot cl-dot--d"></span>
    </div>

    <div class="card-stats">
      <div class="stat">
        <span class="stat-value">${tiempo}</span>
        <span class="stat-label">min</span>
      </div>
      <div class="stat">
        <span class="stat-value">${costo}</span>
        <span class="stat-label">MXN</span>
      </div>
      <div class="stat">
        <span class="stat-value">${rutaGuardada.modo === "gps" ? "GPS" : "Mano"}</span>
        <span class="stat-label">trazo</span>
      </div>
    </div>

    <details class="card-steps">
      <summary>Ver instrucciones</summary>
      <ol>${pasos.map(p => `<li>${escapeHTML(p)}</li>`).join("")}</ol>
    </details>

    <a class="card-recorrido-btn" href="mapa-rutas.html?ruta=${encodeURIComponent(rutaGuardada.id)}" target="_blank" rel="noopener">
      📍 Pica aquí si quieres ver el recorrido
    </a>
  `;
  return card;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!state.origen || !state.destino || state.origen.id === state.destino.id) return;

  // anima el "camión" recorriendo la línea de trayecto
  connectorBus.classList.remove("is-traveling");
  void connectorBus.offsetWidth; // reinicia animación
  connectorBus.classList.add("is-traveling");

  const opciones = obtenerOpciones(state.origen.zona, state.destino.zona);
  const seleccion = elegirPorCategoria(opciones);

  cardsGrid.innerHTML = "";
  seleccion.forEach(item => cardsGrid.appendChild(crearTarjeta(item)));

  // si el operador (admin) ya trazó y guardó este trayecto, lo mostramos primero
  const guardada = buscarRutaGuardadaCoincidente(state.origen.id, state.destino.id);
  if (guardada){
    cardsGrid.prepend(crearTarjetaGuardada(guardada));
  }

  resultOrigin.textContent = state.origen.nombre;
  resultDestino.textContent = state.destino.nombre;

  resultsEmpty.hidden = true;
  resultsList.hidden = false;

  document.getElementById("resultados").scrollIntoView({ behavior: "smooth", block: "start" });
});

/* ----------------------------------------------------------
   10) LECTURA DE RUTAS TRAZADAS POR EL ADMIN (solo lectura)
   El panel admin (admin.html) es quien traza y guarda con GPS
   o a mano; aquí solo leemos ese localStorage para mostrar la
   tarjeta especial "Recorrido verificado" cuando coincide.
   ---------------------------------------------------------- */
const LS_KEY = "adondevas_rutas_trazadas_v1";

function cargarRutasTrazadas(){
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("No se pudieron leer las rutas guardadas:", err);
    return [];
  }
}

function buscarRutaGuardadaCoincidente(origenId, destinoId){
  const lista = cargarRutasTrazadas();
  return lista.find(r => r.origenId === origenId && r.destinoId === destinoId)
      || lista.find(r => r.origenId === destinoId && r.destinoId === origenId)
      || null;
}
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
  { id: "pue-zocalo",     nombre: "Zócalo de Puebla",              zona: "puebla",      tipo: "Centro",      lat: 19.0414, lng: -98.2063 },
  { id: "pue-capu",       nombre: "CAPU · Terminal de Autobuses",  zona: "puebla",      tipo: "Terminal",    lat: 19.0728, lng: -98.1938 },
  { id: "pue-angelopolis",nombre: "Angelópolis",                   zona: "puebla",      tipo: "Comercial",   lat: 19.0159, lng: -98.2436 },
  { id: "pue-buap",       nombre: "BUAP Ciudad Universitaria",     zona: "puebla",      tipo: "Universidad", lat: 19.0037, lng: -98.2064 },
  { id: "pue-mercadoalto",nombre: "Mercado El Alto",                zona: "puebla",      tipo: "Mercado",     lat: 19.0522, lng: -98.1975 },
  { id: "pue-arcangeles", nombre: "Arcángeles",                    zona: "puebla",      tipo: "Comercial",   lat: 19.0483, lng: -98.2277 },
  { id: "pue-lanoria",    nombre: "La Noria",                      zona: "puebla",      tipo: "Barrio",      lat: 19.0562, lng: -98.1889 },
  { id: "pue-4poniente",  nombre: "4 Poniente, Centro Histórico",  zona: "puebla",      tipo: "Centro",      lat: 19.0447, lng: -98.2038 },
  { id: "pue-pasebravo",  nombre: "Paseo Bravo",                   zona: "puebla",      tipo: "Parque",      lat: 19.0453, lng: -98.2135 },

  // Cholula
  { id: "cho-udlap",      nombre: "UDLAP",                          zona: "cholula",     tipo: "Universidad", lat: 19.0523, lng: -98.2941 },
  { id: "cho-piramide",   nombre: "Zona Arqueológica / Pirámide",  zona: "cholula",     tipo: "Monumento",   lat: 19.0578, lng: -98.3025 },
  { id: "cho-sanpedro",   nombre: "San Pedro Cholula, Centro",      zona: "cholula",     tipo: "Centro",      lat: 19.0638, lng: -98.3061 },
  { id: "cho-sanandres",  nombre: "San Andrés Cholula, Centro",     zona: "cholula",     tipo: "Centro",      lat: 19.0466, lng: -98.2814 },
  { id: "cho-recta",      nombre: "Recta a Cholula",                zona: "cholula",     tipo: "Avenida",     lat: 19.0480, lng: -98.2650 },

  // San Martín Texmelucan
  { id: "sma-centro",     nombre: "Centro de San Martín Texmelucan", zona: "sanmartin",  tipo: "Centro",      lat: 19.2814, lng: -98.4322 },
  { id: "sma-terminal",   nombre: "Terminal San Martín",             zona: "sanmartin",  tipo: "Terminal",    lat: 19.2839, lng: -98.4271 },
  { id: "sma-caseta",     nombre: "Caseta México-Puebla",            zona: "sanmartin",  tipo: "Caseta",      lat: 19.2650, lng: -98.4033 },
  { id: "sma-mercado",    nombre: "Mercado Emiliano Zapata",         zona: "sanmartin",  tipo: "Mercado",     lat: 19.2798, lng: -98.4300 },

  // Huejotzingo
  { id: "hue-centro",     nombre: "Centro de Huejotzingo",           zona: "huejotzingo", tipo: "Centro",     lat: 19.1519, lng: -98.4028 },
  { id: "hue-convento",   nombre: "Convento Franciscano",            zona: "huejotzingo", tipo: "Monumento",  lat: 19.1508, lng: -98.4009 },
  { id: "hue-caseta",     nombre: "Caseta Amozoc-Perote",            zona: "huejotzingo", tipo: "Caseta",     lat: 19.1650, lng: -98.3850 },
  { id: "hue-mercado",    nombre: "Mercado de Huejotzingo",          zona: "huejotzingo", tipo: "Mercado",    lat: 19.1524, lng: -98.4041 },
];

/* color por zona, usado en los marcadores del mapa */
const COLOR_ZONA = {
  puebla:      "#5FA8E0",
  cholula:     "#F2A73B",
  sanmartin:   "#4FAE7E",
  huejotzingo: "#E1543F",
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
    resaltarNodoMapa(state.zonaActiva);
  });
});

/* ----------------------------------------------------------
   6) MAPA REAL — Leaflet.js + tiles de OpenStreetMap
   ---------------------------------------------------------- */
const mapa = L.map("leaflet-map", { attributionControl: true, scrollWheelZoom: false })
  .setView([19.09, -98.32], 11);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(mapa);

const marcadores = {}; // id -> L.marker

PUNTOS.forEach(punto => {
  const icono = L.divIcon({
    className: "",
    html: `<span class="punto-marker" style="color:${COLOR_ZONA[punto.zona]}; background:${COLOR_ZONA[punto.zona]}"></span>`,
    iconSize: [14, 14],
  });
  const marker = L.marker([punto.lat, punto.lng], { icon: icono, title: punto.nombre })
    .addTo(mapa)
    .bindPopup(`<strong>${punto.nombre}</strong><br>${ZONAS[punto.zona]} · ${punto.tipo}`);

  marker.on("click", () => seleccionarDesdeMapa(punto));
  marcadores[punto.id] = marker;
});

// si el origen está vacío, el punto tocado en el mapa lo llena; si no, llena el destino
function seleccionarDesdeMapa(punto){
  if (!state.origen){
    document.getElementById("origen").value = punto.nombre;
    state.origen = punto;
    document.querySelector('.clear-btn[data-target="origen"]').hidden = false;
  } else if (!state.destino){
    document.getElementById("destino").value = punto.nombre;
    state.destino = punto;
    document.querySelector('.clear-btn[data-target="destino"]').hidden = false;
  } else {
    // ambos llenos: reinicia con este punto como nuevo origen
    document.getElementById("origen").value = punto.nombre;
    state.origen = punto;
    document.getElementById("destino").value = "";
    state.destino = null;
    document.querySelector('.clear-btn[data-target="destino"]').hidden = true;
  }
  actualizarEstadoBusqueda();
}

let lineaTrayecto = null;

function resaltarNodoMapa(zona){
  // sin efecto visual adicional en el mapa real; se conserva por compatibilidad
}

function resaltarRutaMapa(zonaA, zonaB){
  if (!state.origen || !state.destino) return;
  if (lineaTrayecto) mapa.removeLayer(lineaTrayecto);

  lineaTrayecto = L.polyline(
    [[state.origen.lat, state.origen.lng], [state.destino.lat, state.destino.lng]],
    { color: "#F2A73B", weight: 3, dashArray: "2 8", opacity: 0.9 }
  ).addTo(mapa);

  mapa.fitBounds(lineaTrayecto.getBounds(), { padding: [40, 40] });
}

/* ----------------------------------------------------------
   7) AUTOCOMPLETADO
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
    input.value = punto.nombre;
    state[stateKey] = punto;
    cerrarLista();
    clearBtn.hidden = false;
    actualizarEstadoBusqueda();
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

  resaltarRutaMapa(state.origen.zona, state.destino.zona);
  resaltarNodoMapa(state.destino.zona);

  const opciones = obtenerOpciones(state.origen.zona, state.destino.zona);
  const seleccion = elegirPorCategoria(opciones);

  cardsGrid.innerHTML = "";
  seleccion.forEach(item => cardsGrid.appendChild(crearTarjeta(item)));

  resultOrigin.textContent = state.origen.nombre;
  resultDestino.textContent = state.destino.nombre;

  resultsEmpty.hidden = true;
  resultsList.hidden = false;

  document.getElementById("resultados").scrollIntoView({ behavior: "smooth", block: "start" });
});
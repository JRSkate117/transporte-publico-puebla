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

/* distancia en metros entre dos coordenadas (fórmula haversine),
   usada para no guardar puntos GPS demasiado pegados entre sí */
function distanciaMetros([lat1, lng1], [lat2, lng2]){
  const R = 6371000;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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
    volarAZona(state.zonaActiva);
  });
});

/* ----------------------------------------------------------
   6) MAPA REAL — Leaflet + OpenStreetMap
   ---------------------------------------------------------- */
const map = L.map("leaflet-map", {
  scrollWheelZoom: false,
}).setView([19.09, -98.32], 11);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const marcadoresPorId = {};

PUNTOS.forEach(punto => {
  const icon = L.divIcon({
    className: "punto-marker",
    html: `<span class="punto-dot" style="background:${COLOR_ZONA[punto.zona]}"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
  const marker = L.marker([punto.lat, punto.lng], { icon, title: punto.nombre });
  marker.bindPopup(`<strong>${punto.nombre}</strong><br>${ZONAS[punto.zona]} · ${punto.tipo}`);
  marker.on("click", () => seleccionarDesdeMapa(punto));
  marker.addTo(map);
  marcadoresPorId[punto.id] = marker;
});

let rutaPolyline = null;
let rutaGuardadaPolyline = null;

function trazarRutaEnMapa(origen, destino){
  if (rutaPolyline){ map.removeLayer(rutaPolyline); rutaPolyline = null; }
  rutaPolyline = L.polyline(
    [[origen.lat, origen.lng], [destino.lat, destino.lng]],
    { color: "#F2A73B", weight: 3, dashArray: "2 10", opacity: 0.9, lineCap: "round" }
  ).addTo(map);
  const bounds = rutaPolyline.getBounds();
  map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
}

function limpiarRutaGuardadaMapa(){
  if (rutaGuardadaPolyline){ map.removeLayer(rutaGuardadaPolyline); rutaGuardadaPolyline = null; }
}

function trazarRutaGuardadaEnMapa(puntos, extenderBounds){
  limpiarRutaGuardadaMapa();
  rutaGuardadaPolyline = L.polyline(puntos, {
    color: "#4FAE7E", weight: 4, opacity: 0.95, lineCap: "round", lineJoin: "round",
  }).addTo(map);
  if (extenderBounds !== false){
    map.fitBounds(rutaGuardadaPolyline.getBounds(), { padding: [40, 40], maxZoom: 15 });
  }
}

/* clic en un marcador: llena Origen si está vacío, si no Destino;
   si ambos están llenos, reinicia usando ese punto como nuevo origen */
function seleccionarDesdeMapa(punto){
  if (!state.origen){
    asignarPunto("origen", punto);
  } else if (!state.destino){
    if (punto.id === state.origen.id) return;
    asignarPunto("destino", punto);
  } else {
    asignarPunto("origen", punto);
    asignarPunto("destino", null);
  }
  marcadoresPorId[punto.id]?.openPopup();
}

/* el chip de zona ahora hace que el mapa "vuele" a esa zona,
   sin excluir resultados de las otras */
function volarAZona(zona){
  const c = ZONA_CENTRO[zona];
  if (c) map.flyTo([c.lat, c.lng], c.zoom, { duration: 0.8 });
}
volarAZona(state.zonaActiva);

/* asigna (o limpia) un punto de origen/destino, sincronizando
   estado + input de texto + botón de limpiar, sin importar si
   vino del autocompletado o de un clic en el mapa */
function asignarPunto(stateKey, punto){
  state[stateKey] = punto;
  const input = document.getElementById(stateKey);
  const clearBtn = document.querySelector(`.clear-btn[data-target="${stateKey}"]`);
  if (input) input.value = punto ? punto.nombre : "";
  if (clearBtn) clearBtn.hidden = !punto;
  actualizarEstadoBusqueda();
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

  trazarRutaEnMapa(state.origen, state.destino);

  const opciones = obtenerOpciones(state.origen.zona, state.destino.zona);
  const seleccion = elegirPorCategoria(opciones);

  cardsGrid.innerHTML = "";
  seleccion.forEach(item => cardsGrid.appendChild(crearTarjeta(item)));

  // si el usuario ya trazó y guardó este trayecto antes, lo mostramos primero
  const guardada = buscarRutaGuardadaCoincidente(state.origen.id, state.destino.id);
  limpiarRutaGuardadaMapa();
  if (guardada){
    cardsGrid.prepend(crearTarjetaGuardada(guardada));
    trazarRutaGuardadaEnMapa(guardada.puntos, false);
  }

  resultOrigin.textContent = state.origen.nombre;
  resultDestino.textContent = state.destino.nombre;

  resultsEmpty.hidden = true;
  resultsList.hidden = false;

  document.getElementById("resultados").scrollIntoView({ behavior: "smooth", block: "start" });
});

/* ----------------------------------------------------------
   10) TRAZAR Y GUARDAR RUTAS DE COMBI (a mano o con GPS)
   Se guardan en este celular con localStorage: la próxima vez
   que alguien busque el mismo origen→destino en este mismo
   dispositivo, su ruta trazada ya aparece.
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

function guardarRutasTrazadas(lista){
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(lista));
    return true;
  } catch (err) {
    console.warn("No se pudo guardar en este navegador:", err);
    return false;
  }
}

function buscarRutaGuardadaCoincidente(origenId, destinoId){
  const lista = cargarRutasTrazadas();
  return lista.find(r => r.origenId === origenId && r.destinoId === destinoId)
      || lista.find(r => r.origenId === destinoId && r.destinoId === origenId)
      || null;
}

/* ---- referencias del DOM ---- */
const tracerToggle   = document.getElementById("tracer-toggle");
const tracerPanel    = document.getElementById("tracer-panel");
const tracerModeBtns = document.querySelectorAll(".tracer-mode-btn");
const tracerStartBtn = document.getElementById("tracer-start");
const tracerUndoBtn  = document.getElementById("tracer-undo");
const tracerStopBtn  = document.getElementById("tracer-stop");
const tracerStatus   = document.getElementById("tracer-status");
const tracerSaveForm = document.getElementById("tracer-save-form");
const tracerCancelBtn= document.getElementById("tracer-cancel");
const tracerOrigenSel = document.getElementById("tracer-origen");
const tracerDestinoSel= document.getElementById("tracer-destino");
const tracerSavedWrap = document.getElementById("tracer-saved");
const tracerSavedList = document.getElementById("tracer-saved-list");

/* llena los <select> de origen/destino del formulario de guardado */
function poblarSelectsTrazado(){
  const opciones = PUNTOS
    .map(p => `<option value="${p.id}">${escapeHTML(p.nombre)} · ${ZONAS[p.zona]}</option>`)
    .join("");
  tracerOrigenSel.innerHTML = opciones;
  tracerDestinoSel.innerHTML = opciones;
}

const tracerState = {
  modo: "manual",       // "manual" | "gps"
  activo: false,
  puntos: [],            // [[lat,lng], ...]
  polyline: null,
  gpsWatchId: null,
  gpsMarker: null,
};

function tracerDibujarPolyline(){
  if (tracerState.polyline){ map.removeLayer(tracerState.polyline); tracerState.polyline = null; }
  if (tracerState.puntos.length < 2) return;
  tracerState.polyline = L.polyline(tracerState.puntos, {
    color: "#4FAE7E", weight: 4, opacity: 0.95, dashArray: tracerState.modo === "gps" ? null : "1 8",
  }).addTo(map);
}

function tracerAgregarPunto(latlng){
  tracerState.puntos.push(latlng);
  tracerDibujarPolyline();
  tracerStatus.textContent = `${tracerState.puntos.length} punto${tracerState.puntos.length === 1 ? "" : "s"} marcado${tracerState.puntos.length === 1 ? "" : "s"}.`;
  tracerUndoBtn.hidden = tracerState.modo !== "manual" || tracerState.puntos.length === 0;
}

function tracerClickMapa(e){
  if (!tracerState.activo || tracerState.modo !== "manual") return;
  tracerAgregarPunto([e.latlng.lat, e.latlng.lng]);
}

/* ---- modo: cambiar entre "a mano" y "GPS en vivo" ---- */
tracerModeBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    if (tracerState.activo) return; // no cambiar de modo a medio trazo
    tracerModeBtns.forEach(b => b.classList.toggle("is-active", b === btn));
    tracerState.modo = btn.dataset.modo;
    tracerStatus.textContent = tracerState.modo === "gps"
      ? "Cuando empieces, iremos guardando tu ubicación mientras avanza la combi."
      : "Cuando empieces, toca el mapa para ir marcando el camino.";
  });
});

/* ---- abrir/cerrar panel ---- */
tracerToggle.addEventListener("click", () => {
  const abierto = tracerPanel.hidden;
  tracerPanel.hidden = !abierto;
  tracerToggle.setAttribute("aria-expanded", String(abierto));
  if (abierto) renderRutasGuardadas();
});

/* ---- empezar a trazar ---- */
tracerStartBtn.addEventListener("click", () => {
  tracerState.activo = true;
  tracerState.puntos = [];
  tracerDibujarPolyline();
  tracerStartBtn.hidden = true;
  tracerStopBtn.hidden = false;
  tracerModeBtns.forEach(b => b.disabled = true);
  tracerSaveForm.hidden = true;
  tracerSavedWrap.hidden = true;

  if (tracerState.modo === "manual"){
    map.on("click", tracerClickMapa);
    tracerUndoBtn.hidden = false;
    tracerStatus.textContent = "Toca el mapa para ir marcando el camino de la combi.";
  } else {
    tracerUndoBtn.hidden = true;
    if (!("geolocation" in navigator)){
      tracerStatus.textContent = "Este navegador no puede usar el GPS. Prueba con el modo a mano.";
      return;
    }
    tracerStatus.textContent = "Buscando señal de GPS…";
    tracerState.gpsWatchId = navigator.geolocation.watchPosition(
      (pos) => {
        const punto = [pos.coords.latitude, pos.coords.longitude];
        const ultimo = tracerState.puntos[tracerState.puntos.length - 1];
        if (!tracerState.gpsMarker){
          tracerState.gpsMarker = L.circleMarker(punto, {
            radius: 7, color: "#4FAE7E", fillColor: "#4FAE7E", fillOpacity: 0.9, weight: 2,
          }).addTo(map);
        } else {
          tracerState.gpsMarker.setLatLng(punto);
        }
        map.panTo(punto);
        if (!ultimo || distanciaMetros(ultimo, punto) >= 20){
          tracerAgregarPunto(punto);
        }
      },
      (err) => {
        tracerStatus.textContent = "No se pudo acceder al GPS: " + (err.message || "permiso denegado.");
      },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 }
    );
  }
});

/* ---- quitar el último punto marcado (modo manual) ---- */
tracerUndoBtn.addEventListener("click", () => {
  tracerState.puntos.pop();
  tracerDibujarPolyline();
  tracerStatus.textContent = `${tracerState.puntos.length} punto${tracerState.puntos.length === 1 ? "" : "s"} marcado${tracerState.puntos.length === 1 ? "" : "s"}.`;
});

/* ---- terminar de trazar ---- */
tracerStopBtn.addEventListener("click", () => {
  tracerState.activo = false;
  map.off("click", tracerClickMapa);
  if (tracerState.gpsWatchId != null){
    navigator.geolocation.clearWatch(tracerState.gpsWatchId);
    tracerState.gpsWatchId = null;
  }
  if (tracerState.gpsMarker){ map.removeLayer(tracerState.gpsMarker); tracerState.gpsMarker = null; }

  tracerStartBtn.hidden = false;
  tracerStopBtn.hidden = true;
  tracerUndoBtn.hidden = true;
  tracerModeBtns.forEach(b => b.disabled = false);

  if (tracerState.puntos.length < 2){
    tracerStatus.textContent = "Necesitas al menos dos puntos para guardar una ruta. Inténtalo de nuevo.";
    if (tracerState.polyline){ map.removeLayer(tracerState.polyline); tracerState.polyline = null; }
    tracerState.puntos = [];
    return;
  }

  tracerStatus.textContent = "Listo. Ponle nombre a tu ruta y guárdala.";
  poblarSelectsTrazado();
  tracerSaveForm.hidden = false;
  tracerSaveForm.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

/* ---- guardar la ruta trazada ---- */
tracerSaveForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const origenId = tracerOrigenSel.value;
  const destinoId = tracerDestinoSel.value;
  if (origenId === destinoId){
    tracerStatus.textContent = "Elige un origen y un destino distintos.";
    return;
  }

  const nombre = document.getElementById("tracer-nombre").value.trim();
  const empresa = document.getElementById("tracer-empresa").value.trim();
  const tiempoRaw = document.getElementById("tracer-tiempo").value;
  const costoRaw = document.getElementById("tracer-costo").value;
  const notas = document.getElementById("tracer-notas").value.trim();

  const nuevaRuta = {
    id: "rt-" + Date.now(),
    nombre: nombre || "Ruta guardada",
    empresa,
    origenId,
    destinoId,
    tiempo: tiempoRaw ? Number(tiempoRaw) : null,
    costo: costoRaw ? Number(costoRaw) : null,
    notas,
    modo: tracerState.modo,
    puntos: tracerState.puntos,
    creado: new Date().toISOString(),
  };

  const lista = cargarRutasTrazadas();
  lista.push(nuevaRuta);
  const ok = guardarRutasTrazadas(lista);

  tracerSaveForm.reset();
  tracerSaveForm.hidden = true;
  if (tracerState.polyline){ map.removeLayer(tracerState.polyline); tracerState.polyline = null; }
  tracerState.puntos = [];

  tracerStatus.textContent = ok
    ? "Ruta guardada en este celular. La verás la próxima vez que busques este trayecto."
    : "No se pudo guardar (este navegador bloquea el almacenamiento local).";

  renderRutasGuardadas();
});

/* ---- cancelar el trazo actual ---- */
tracerCancelBtn.addEventListener("click", () => {
  tracerSaveForm.reset();
  tracerSaveForm.hidden = true;
  if (tracerState.polyline){ map.removeLayer(tracerState.polyline); tracerState.polyline = null; }
  tracerState.puntos = [];
  tracerStatus.textContent = "Trazo descartado.";
});

/* ---- lista de "Tus rutas guardadas" ---- */
function nombrePunto(id){
  return PUNTOS.find(p => p.id === id)?.nombre || "Punto eliminado";
}

function renderRutasGuardadas(){
  const lista = cargarRutasTrazadas();
  tracerSavedWrap.hidden = lista.length === 0;
  tracerSavedList.innerHTML = "";

  lista.slice().reverse().forEach(ruta => {
    const li = document.createElement("li");
    li.className = "tracer-saved-item";
    const modoLabel = ruta.modo === "gps" ? "📡 GPS" : "✍️ A mano";
    li.innerHTML = `
      <div class="tracer-saved-info">
        <strong>${escapeHTML(ruta.nombre)}</strong>
        <span>${escapeHTML(nombrePunto(ruta.origenId))} → ${escapeHTML(nombrePunto(ruta.destinoId))}</span>
        <span class="tracer-saved-meta">${modoLabel} · ${ruta.puntos.length} puntos</span>
      </div>
      <div class="tracer-saved-actions">
        <button type="button" class="tracer-mini-btn" data-accion="ver" data-id="${ruta.id}">Ver en mapa</button>
        <button type="button" class="tracer-mini-btn tracer-mini-btn--danger" data-accion="eliminar" data-id="${ruta.id}">Eliminar</button>
      </div>
    `;
    tracerSavedList.appendChild(li);
  });
}

tracerSavedList.addEventListener("click", (e) => {
  const btn = e.target.closest(".tracer-mini-btn");
  if (!btn) return;
  const { accion, id } = btn.dataset;
  const lista = cargarRutasTrazadas();
  const ruta = lista.find(r => r.id === id);
  if (!ruta) return;

  if (accion === "ver"){
    trazarRutaGuardadaEnMapa(ruta.puntos, true);
    document.getElementById("mapa").scrollIntoView({ behavior: "smooth", block: "start" });
  } else if (accion === "eliminar"){
    const confirmar = window.confirm(`¿Eliminar "${ruta.nombre}" de tus rutas guardadas?`);
    if (!confirmar) return;
    guardarRutasTrazadas(lista.filter(r => r.id !== id));
    renderRutasGuardadas();
  }
});

/* estado inicial del panel de trazado */
renderRutasGuardadas();
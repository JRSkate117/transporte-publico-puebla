/* ==========================================================
   PANEL DEL OPERADOR — mapa + trazador de rutas (admin.html)
   ========================================================== */

/* ----------------------------------------------------------
   0) ACCESO POR CONTRASEÑA
   ⚠️ Esto es solo un candado en el navegador, NO seguridad real:
   cualquiera que abra este archivo .js puede leer la contraseña.
   Sirve para que un usuario normal no llegue aquí sin querer,
   no para proteger datos sensibles. Si necesitas seguridad de
   verdad, esto necesita un backend con autenticación real.
   Cambia la contraseña aquí abajo por la que tú quieras: ---- */
const ADMIN_PASSWORD = "combi2026";

const SESSION_KEY = "adondevas_admin_sesion";

const gate = document.getElementById("admin-gate");
const gateForm = document.getElementById("admin-gate-form");
const gateError = document.getElementById("admin-gate-error");
const adminApp = document.getElementById("admin-app");
const logoutBtn = document.getElementById("admin-logout");

function entrarAlPanel(){
  gate.hidden = true;
  adminApp.hidden = false;
  iniciarPanel();
}

// si ya inició sesión antes en esta pestaña/navegador, no pedir de nuevo
if (sessionStorage.getItem(SESSION_KEY) === "ok"){
  entrarAlPanel();
}

gateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const valor = document.getElementById("admin-password").value;
  if (valor === ADMIN_PASSWORD){
    sessionStorage.setItem(SESSION_KEY, "ok");
    gateError.hidden = true;
    entrarAlPanel();
  } else {
    gateError.hidden = false;
    document.getElementById("admin-password").value = "";
    document.getElementById("admin-password").focus();
  }
});

logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem(SESSION_KEY);
  location.reload();
});

/* ----------------------------------------------------------
   1) DATOS COMPARTIDOS (mismos puntos que la app pública)
   ---------------------------------------------------------- */
const ZONAS = {
  puebla:      "Puebla",
  cholula:     "Cholula",
  sanmartin:   "San Martín Texmelucan",
  huejotzingo: "Huejotzingo",
};

const PUNTOS = [
  { id: "pue-zocalo",     nombre: "Zócalo de Puebla",              zona: "puebla",      tipo: "Centro",     lat: 19.0414, lng: -98.2063 },
  { id: "pue-capu",       nombre: "CAPU · Terminal de Autobuses",  zona: "puebla",      tipo: "Terminal",   lat: 19.0672, lng: -98.1794 },
  { id: "pue-angelopolis",nombre: "Angelópolis",                   zona: "puebla",      tipo: "Comercial",  lat: 19.0067, lng: -98.2417 },
  { id: "pue-buap",       nombre: "BUAP Ciudad Universitaria",     zona: "puebla",      tipo: "Universidad",lat: 19.0028, lng: -98.2059 },
  { id: "pue-mercadoalto",nombre: "Mercado El Alto",                zona: "puebla",      tipo: "Mercado",    lat: 19.0500, lng: -98.1900 },
  { id: "pue-arcangeles", nombre: "Arcángeles",                    zona: "puebla",      tipo: "Comercial",  lat: 19.0244, lng: -98.2367 },
  { id: "pue-lanoria",    nombre: "La Noria",                      zona: "puebla",      tipo: "Barrio",     lat: 19.0333, lng: -98.1961 },
  { id: "pue-4poniente",  nombre: "4 Poniente, Centro Histórico",  zona: "puebla",      tipo: "Centro",     lat: 19.0430, lng: -98.2075 },
  { id: "pue-pasebravo",  nombre: "Paseo Bravo",                   zona: "puebla",      tipo: "Parque",     lat: 19.0472, lng: -98.2108 },
  { id: "cho-udlap",      nombre: "UDLAP",                          zona: "cholula",     tipo: "Universidad", lat: 19.0561, lng: -98.2833 },
  { id: "cho-piramide",   nombre: "Zona Arqueológica / Pirámide",  zona: "cholula",     tipo: "Monumento",   lat: 19.0578, lng: -98.3022 },
  { id: "cho-sanpedro",   nombre: "San Pedro Cholula, Centro",      zona: "cholula",     tipo: "Centro",      lat: 19.0642, lng: -98.3061 },
  { id: "cho-sanandres",  nombre: "San Andrés Cholula, Centro",     zona: "cholula",     tipo: "Centro",      lat: 19.0489, lng: -98.2967 },
  { id: "cho-recta",      nombre: "Recta a Cholula",                zona: "cholula",     tipo: "Avenida",     lat: 19.0500, lng: -98.2500 },
  { id: "sma-centro",     nombre: "Centro de San Martín Texmelucan", zona: "sanmartin",  tipo: "Centro",   lat: 19.2836, lng: -98.4325 },
  { id: "sma-terminal",   nombre: "Terminal San Martín",             zona: "sanmartin",  tipo: "Terminal", lat: 19.2800, lng: -98.4290 },
  { id: "sma-caseta",     nombre: "Caseta México-Puebla",            zona: "sanmartin",  tipo: "Caseta",   lat: 19.2600, lng: -98.4100 },
  { id: "sma-mercado",    nombre: "Mercado Emiliano Zapata",         zona: "sanmartin",  tipo: "Mercado",  lat: 19.2850, lng: -98.4350 },
  { id: "hue-centro",     nombre: "Centro de Huejotzingo",           zona: "huejotzingo", tipo: "Centro",    lat: 19.1500, lng: -98.4050 },
  { id: "hue-convento",   nombre: "Convento Franciscano",            zona: "huejotzingo", tipo: "Monumento", lat: 19.1508, lng: -98.4036 },
  { id: "hue-caseta",     nombre: "Caseta Amozoc-Perote",            zona: "huejotzingo", tipo: "Caseta",    lat: 19.1200, lng: -98.3600 },
  { id: "hue-mercado",    nombre: "Mercado de Huejotzingo",          zona: "huejotzingo", tipo: "Mercado",   lat: 19.1495, lng: -98.4060 },
];

const COLOR_ZONA = {
  puebla: "#3E7CB1", cholula: "#F2A73B", sanmartin: "#4FAE7E", huejotzingo: "#E1543F",
};

function escapeHTML(str){
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function distanciaMetros([lat1, lng1], [lat2, lng2]){
  const R = 6371000;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

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

function nombrePunto(id){
  return PUNTOS.find(p => p.id === id)?.nombre || "Punto eliminado";
}

/* ----------------------------------------------------------
   2) TODO LO DE ABAJO SOLO ARRANCA DESPUÉS DE INICIAR SESIÓN
   (el mapa de Leaflet necesita que su contenedor ya sea visible)
   ---------------------------------------------------------- */
let panelIniciado = false;

function iniciarPanel(){
  if (panelIniciado) return; // no inicializar el mapa dos veces
  panelIniciado = true;

  /* ---- mapa Leaflet ---- */
  const map = L.map("leaflet-map", { scrollWheelZoom: true }).setView([19.09, -98.32], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  PUNTOS.forEach(punto => {
    const icon = L.divIcon({
      className: "punto-marker",
      html: `<span class="punto-dot" style="background:${COLOR_ZONA[punto.zona]}"></span>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
    L.marker([punto.lat, punto.lng], { icon, title: punto.nombre })
      .bindPopup(`<strong>${punto.nombre}</strong><br>${ZONAS[punto.zona]} · ${punto.tipo}`)
      .addTo(map);
  });

  // arreglar el tamaño del mapa ahora que el panel ya es visible
  setTimeout(() => map.invalidateSize(), 150);

  let rutaGuardadaPolyline = null;
  function trazarRutaGuardadaEnMapa(puntos, extenderBounds){
    if (rutaGuardadaPolyline){ map.removeLayer(rutaGuardadaPolyline); rutaGuardadaPolyline = null; }
    rutaGuardadaPolyline = L.polyline(puntos, {
      color: "#4FAE7E", weight: 4, opacity: 0.95, lineCap: "round", lineJoin: "round",
    }).addTo(map);
    if (extenderBounds !== false){
      map.fitBounds(rutaGuardadaPolyline.getBounds(), { padding: [40, 40], maxZoom: 15 });
    }
  }

  /* ---- referencias del DOM del trazador ---- */
  const tracerToggle    = document.getElementById("tracer-toggle");
  const tracerPanel     = document.getElementById("tracer-panel");
  const tracerModeBtns  = document.querySelectorAll(".tracer-mode-btn");
  const tracerStartBtn  = document.getElementById("tracer-start");
  const tracerUndoBtn   = document.getElementById("tracer-undo");
  const tracerStopBtn   = document.getElementById("tracer-stop");
  const tracerStatus    = document.getElementById("tracer-status");
  const tracerSaveForm  = document.getElementById("tracer-save-form");
  const tracerCancelBtn = document.getElementById("tracer-cancel");
  const tracerOrigenSel = document.getElementById("tracer-origen");
  const tracerDestinoSel= document.getElementById("tracer-destino");
  const tracerSavedWrap = document.getElementById("tracer-saved");
  const tracerSavedList = document.getElementById("tracer-saved-list");

  function poblarSelectsTrazado(){
    const opciones = PUNTOS
      .map(p => `<option value="${p.id}">${escapeHTML(p.nombre)} · ${ZONAS[p.zona]}</option>`)
      .join("");
    tracerOrigenSel.innerHTML = opciones;
    tracerDestinoSel.innerHTML = opciones;
  }

  const tracerState = {
    modo: "manual", activo: false, puntos: [], polyline: null, gpsWatchId: null, gpsMarker: null,
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

  tracerModeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (tracerState.activo) return;
      tracerModeBtns.forEach(b => b.classList.toggle("is-active", b === btn));
      tracerState.modo = btn.dataset.modo;
      tracerStatus.textContent = tracerState.modo === "gps"
        ? "Cuando empieces, iremos guardando tu ubicación mientras avanza la combi."
        : "Cuando empieces, toca el mapa para ir marcando el camino.";
    });
  });

  tracerToggle.addEventListener("click", () => {
    const abierto = tracerPanel.hidden;
    tracerPanel.hidden = !abierto;
    tracerToggle.setAttribute("aria-expanded", String(abierto));
    if (abierto) renderRutasGuardadas();
  });

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

  tracerUndoBtn.addEventListener("click", () => {
    tracerState.puntos.pop();
    tracerDibujarPolyline();
    tracerStatus.textContent = `${tracerState.puntos.length} punto${tracerState.puntos.length === 1 ? "" : "s"} marcado${tracerState.puntos.length === 1 ? "" : "s"}.`;
  });

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
      empresa, origenId, destinoId,
      origenNombre: nombrePunto(origenId),
      destinoNombre: nombrePunto(destinoId),
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
      ? "Ruta guardada en este navegador."
      : "No se pudo guardar (este navegador bloquea el almacenamiento local).";

    renderRutasGuardadas();
  });

  tracerCancelBtn.addEventListener("click", () => {
    tracerSaveForm.reset();
    tracerSaveForm.hidden = true;
    if (tracerState.polyline){ map.removeLayer(tracerState.polyline); tracerState.polyline = null; }
    tracerState.puntos = [];
    tracerStatus.textContent = "Trazo descartado.";
  });

  /* ---- exportar una ruta guardada al formato de rutas.js ---- */
  function generarSnippetRutasJs(ruta){
    const coordenadas = ruta.puntos.map(([lat, lng]) => `            [${lat.toFixed(7)}, ${lng.toFixed(7)}]`).join(",\n");
    const costo = ruta.costo != null ? `$${ruta.costo}.00 MXN` : "Por confirmar";
    const frecuencia = ruta.tiempo != null ? `~${ruta.tiempo} min de trayecto` : "Por confirmar";
    return `    {
        id: '${ruta.id.toUpperCase()}',
        nombre: '${(ruta.nombre || "Ruta guardada").replace(/'/g, "\\'")}',
        origen: '${nombrePunto(ruta.origenId).replace(/'/g, "\\'")}',
        destino: '${nombrePunto(ruta.destinoId).replace(/'/g, "\\'")}',
        color: '#4FAE7E',
        costo: '${costo}',
        frecuencia: '${frecuencia}',
        // empresa: '${(ruta.empresa || "").replace(/'/g, "\\'")}'
        // notas del operador: ${(ruta.notas || "sin notas").replace(/\n/g, " / ")}
        coordenadas: [
${coordenadas}
        ]
    },`;
  }

  async function exportarRuta(ruta){
    const snippet = generarSnippetRutasJs(ruta);
    try {
      await navigator.clipboard.writeText(snippet);
      tracerStatus.textContent = `Copiado. Pega este bloque dentro de "rutasPublicas" en rutas.js.`;
    } catch (err) {
      // si el navegador bloquea el portapapeles, lo mostramos para copiar a mano
      window.prompt("Copia este bloque y pégalo dentro de rutasPublicas en rutas.js:", snippet);
    }
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
          <button type="button" class="tracer-mini-btn" data-accion="exportar" data-id="${ruta.id}">Copiar para rutas.js</button>
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
    } else if (accion === "exportar"){
      exportarRuta(ruta);
    } else if (accion === "eliminar"){
      const confirmar = window.confirm(`¿Eliminar "${ruta.nombre}" de las rutas guardadas?`);
      if (!confirmar) return;
      guardarRutasTrazadas(lista.filter(r => r.id !== id));
      renderRutasGuardadas();
    }
  });

  renderRutasGuardadas();
}
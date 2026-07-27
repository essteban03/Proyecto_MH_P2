/* ============================================================
   clima.js — Widget del clima con Open-Meteo API
   
   Consulta el clima actual para ciudades de Ecuador.
   Muestra temperatura, humedad, viento y condición.
   ============================================================ */

// Coordenadas de ciudades ecuatorianas
const CIUDADES = [
    { nombre: 'Santo Domingo', latitud: -0.25, longitud: -79.15 },
    { nombre: 'Quito',         latitud: -0.18, longitud: -78.47 },
    { nombre: 'Guayaquil',     latitud: -2.17, longitud: -79.90 },
    { nombre: 'Quevedo',       latitud: -1.03, longitud: -79.46 }
];

// Códigos WMO: traducción de código de clima a texto e ícono
function interpretarClima(codigo) {
    if (codigo === 0) return { texto: 'Despejado', icono: '☀️' };
    if (codigo <= 3) return { texto: 'Parcialmente nublado', icono: '⛅' };
    if (codigo <= 48) return { texto: 'Nublado / Niebla', icono: '🌫️' };
    if (codigo <= 67) return { texto: 'Lluvia', icono: '🌧️' };
    if (codigo <= 77) return { texto: 'Nieve', icono: '❄️' };
    if (codigo <= 82) return { texto: 'Chubascos', icono: '🌦️' };
    if (codigo <= 99) return { texto: 'Tormenta', icono: '⛈️' };
    return { texto: 'Desconocido', icono: '🌡️' };
}

// ─── CONSULTAR EL CLIMA DE UNA CIUDAD ────────────────────────────────────────
async function consultarClima(indiceCiudad) {
    const ciudad = CIUDADES[indiceCiudad];
    const contenedor = document.getElementById('widget-clima');

    if (!contenedor || !ciudad) return;

    // Mostrar indicador de carga mientras se consulta la API
    contenedor.innerHTML = `
        <div class="clima-cargando">
            <i class="fa-solid fa-spinner fa-spin"></i>
            Consultando clima en ${ciudad.nombre}...
        </div>`;

    // Marcar el botón activo
    document.querySelectorAll('.btn-ciudad').forEach((btn, i) => {
        btn.classList.toggle('activo', i === indiceCiudad);
    });

    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${ciudad.latitud}&longitude=${ciudad.longitud}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;

        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error('Error en la respuesta de la API del clima');
        }

        const datos = await respuesta.json();
        const actual = datos.current;

        // Interpretar el código de clima
        const condicion = interpretarClima(actual.weather_code);

        // Mostrar los datos del clima en el HTML
        contenedor.innerHTML = `
            <div class="clima-ciudad">
                <h4>${condicion.icono} ${ciudad.nombre}, Ecuador</h4>
            </div>
            <div class="clima-datos">
                <div class="clima-dato">
                    <span class="clima-icono">🌡️</span>
                    <span class="clima-valor">${actual.temperature_2m}°C</span>
                    <span class="clima-label">Temperatura</span>
                </div>
                <div class="clima-dato">
                    <span class="clima-icono">💧</span>
                    <span class="clima-valor">${actual.relative_humidity_2m}%</span>
                    <span class="clima-label">Humedad</span>
                </div>
                <div class="clima-dato">
                    <span class="clima-icono">💨</span>
                    <span class="clima-valor">${actual.wind_speed_10m} km/h</span>
                    <span class="clima-label">Viento</span>
                </div>
                <div class="clima-dato">
                    <span class="clima-icono">${condicion.icono}</span>
                    <span class="clima-valor">${condicion.texto}</span>
                    <span class="clima-label">Condición</span>
                </div>
            </div>`;

    } catch (error) {
        console.error('Error consultando clima:', error);

        // Mostrar mensaje de error amigable
        contenedor.innerHTML = `
            <div class="clima-error">
                <i class="fa-solid fa-triangle-exclamation"></i>
                No se pudo cargar el clima. Verifica tu conexión a internet.
            </div>`;
    }
}

// ─── INICIALIZAR EL WIDGET DE CLIMA ──────────────────────────────────────────
function inicializarClima() {
    const seccion = document.getElementById('seccion-clima');
    if (!seccion) return;

    // Crear los botones de ciudades dinámicamente
    const contenedorBotones = document.getElementById('botones-ciudades');
    if (contenedorBotones) {
        contenedorBotones.innerHTML = CIUDADES.map((ciudad, indice) => `
            <button class="btn-ciudad ${indice === 0 ? 'activo' : ''}"
                    onclick="consultarClima(${indice})">
                ${ciudad.nombre}
            </button>`).join('');
    }

    // Cargar el clima de Santo Domingo por defecto
    consultarClima(0);
}

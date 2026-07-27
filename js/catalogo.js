/* ============================================================
   catalogo.js — Lógica del catálogo de juegos
   
   Renderiza tarjetas, búsqueda en tiempo real, filtros,
   ordenamiento y panel de indicadores.
   ============================================================ */

// Variables globales de esta página
let todosLosJuegos = [];      // Todos los juegos cargados
let todasLasCategorias = [];  // Todas las categorías cargadas
let juegosFiltrados = [];     // Los juegos que se muestran actualmente

// ─── FUNCIÓN PRINCIPAL: INICIALIZAR CATÁLOGO ─────────────────────────────────
async function inicializarCatalogo() {
    mostrarIndicadorCarga(true);

    // Cargar datos desde localStorage o JSON
    todosLosJuegos = await cargarJuegos();
    todasLasCategorias = await cargarCategorias();

    // La lista inicial muestra todos los juegos
    juegosFiltrados = [...todosLosJuegos];

    // Llenar el filtro de categorías con los datos reales
    llenarFiltrosCategoria();

    // Mostrar los juegos en pantalla
    renderizarTarjetas(juegosFiltrados);

    // Actualizar el panel de indicadores
    actualizarIndicadores(juegosFiltrados);

    mostrarIndicadorCarga(false);
}

// ─── MOSTRAR / OCULTAR INDICADOR DE CARGA ────────────────────────────────────
function mostrarIndicadorCarga(mostrar) {
    const indicador = document.getElementById('indicador-carga');
    if (indicador) {
        indicador.style.display = mostrar ? 'block' : 'none';
    }
}

// ─── LLENAR EL FILTRO DE CATEGORÍAS CON OPCIONES DINÁMICAS ──────────────────
function llenarFiltrosCategoria() {
    const select = document.getElementById('filtro-categoria');
    if (!select) return;

    // Limpiar opciones previas (excepto "Todas")
    select.innerHTML = '<option value="">Todas las categorías</option>';

    // Agregar cada categoría del JSON
    todasLasCategorias.forEach(cat => {
        const opcion = document.createElement('option');
        opcion.value = cat.id;
        opcion.textContent = cat.nombre;
        select.appendChild(opcion);
    });
}

// ─── RENDERIZAR TARJETAS DE JUEGOS ───────────────────────────────────────────
function renderizarTarjetas(listaJuegos) {
    const contenedor = document.getElementById('contenedor-juegos');
    if (!contenedor) return;

    // Si no hay juegos que mostrar, mostramos mensaje
    if (listaJuegos.length === 0) {
        contenedor.innerHTML = `
            <div class="sin-resultados">
                <i class="fa-solid fa-magnifying-glass"></i>
                <p>No se encontraron juegos con esos criterios.</p>
            </div>`;
        return;
    }

    // Generar el HTML de cada tarjeta
    contenedor.innerHTML = listaJuegos.map(juego => crearTarjetaHTML(juego)).join('');
}

// ─── CREAR HTML DE UNA TARJETA ───────────────────────────────────────────────
function crearTarjetaHTML(juego) {
    // Buscar el nombre de la categoría usando el categoriaId del juego
    const categoria = todasLasCategorias.find(cat => cat.id === juego.categoriaId);
    const nombreCategoria = categoria ? categoria.nombre : 'Sin categoría';

    // Crear las estrellas de calificación
    const estrellas = juego.calificacion
        ? '⭐'.repeat(juego.calificacion)
        : 'Sin calificación';

    // Badge (etiqueta): solo se muestra si el juego tiene una
    const badge = juego.etiqueta
        ? `<span class="badge-juego">${juego.etiqueta}</span>`
        : '';

    // Estado del juego para el estilo
    const claseEstado = `estado-${juego.estado}`;

    return `
        <article class="tarjeta-catalogo" data-id="${juego.id}">
            ${badge}
            <figure>
                <img src="${juego.imagen}"
                     alt="${juego.nombre}"
                     onerror="this.src='imagenes/icono.png'">
            </figure>
            <div class="info-tarjeta">
                <span class="cat-tarjeta">${nombreCategoria}</span>
                <h3>${juego.nombre}</h3>
                <p class="plataforma-tarjeta">${juego.plataforma}</p>
                <p class="estrellas-tarjeta">${estrellas}
                    ${juego.resenas ? `<small>(${juego.resenas})</small>` : ''}
                </p>
                <p class="precio-tarjeta">
                    ${juego.precio === 0 ? 'GRATIS' : `$${juego.precio.toFixed(2)}`}
                </p>
                <span class="estado-tarjeta ${claseEstado}">${juego.estado}</span>
            </div>
            <div class="acciones-tarjeta">
                <button class="btn-ver-detalle"
                        onclick="verDetalle(${juego.id})">
                    <i class="fa-solid fa-circle-info"></i> Detalles
                </button>
                <button class="btn-agregar-carrito"
                        onclick="agregarAlCarrito(${juego.id})"
                        ${juego.estado === 'agotado' ? 'disabled' : ''}>
                    <i class="fa-solid fa-cart-plus"></i>
                    ${juego.estado === 'agotado' ? 'Agotado' : 'Al carrito'}
                </button>
                <button class="btn-editar"
                        onclick="abrirFormularioEditar(${juego.id})">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn-eliminar"
                        onclick="confirmarEliminar(${juego.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </article>`;
}

// ─── VER DETALLES DE UN JUEGO (SWEETALERT2) ──────────────────────────────────
function verDetalle(id) {
    const juego = todosLosJuegos.find(j => j.id === id);
    if (!juego) return;

    const categoria = todasLasCategorias.find(cat => cat.id === juego.categoriaId);
    const nombreCategoria = categoria ? categoria.nombre : 'Sin categoría';
    const estrellas = juego.calificacion ? '⭐'.repeat(juego.calificacion) : 'Sin calificación';

    Swal.fire({
        title: juego.nombre,
        html: `
            <div class="swal-detalle">
                <img src="${juego.imagen}" alt="${juego.nombre}"
                     onerror="this.src='imagenes/icono.png'"
                     style="width:100%;max-height:200px;object-fit:cover;border-radius:8px;margin-bottom:15px">
                <p><strong>Categoría:</strong> ${nombreCategoria}</p>
                <p><strong>Plataforma:</strong> ${juego.plataforma}</p>
                <p><strong>Calificación:</strong> ${estrellas} (${juego.resenas || 0} reseñas)</p>
                <p><strong>Estado:</strong> ${juego.estado}</p>
                <p><strong>Fecha de registro:</strong> ${juego.fechaRegistro}</p>
                <hr>
                <p>${juego.descripcion}</p>
                <p style="font-size:1.4rem;font-weight:bold;color:#00439c">
                    ${juego.precio === 0 ? 'GRATIS' : `$${juego.precio.toFixed(2)}`}
                </p>
            </div>`,
        confirmButtonText: 'Agregar al carrito',
        confirmButtonColor: '#00439c',
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
        cancelButtonColor: '#999'
    }).then(resultado => {
        if (resultado.isConfirmed) {
            agregarAlCarrito(id);
        }
    });
}

// ─── BUSCAR EN TIEMPO REAL (evento input) ────────────────────────────────────
function buscarJuegos(textoBusqueda) {
    const texto = textoBusqueda.toLowerCase().trim();

    // Aplicamos búsqueda sobre los juegos ya filtrados por categoría/plataforma
    const resultado = aplicarFiltros(texto);

    renderizarTarjetas(resultado);
    actualizarIndicadores(resultado);
}

// ─── APLICAR TODOS LOS FILTROS Y BÚSQUEDA JUNTOS ─────────────────────────────
function aplicarFiltros(textoBusqueda = '') {
    const filtroCategoria = document.getElementById('filtro-categoria')?.value || '';
    const filtroPlataforma = document.getElementById('filtro-plataforma')?.value || '';
    const filtroEstado = document.getElementById('filtro-estado')?.value || '';

    let resultado = [...todosLosJuegos];

    // Filtrar por texto de búsqueda (nombre o descripción)
    if (textoBusqueda) {
        resultado = resultado.filter(juego =>
            juego.nombre.toLowerCase().includes(textoBusqueda) ||
            juego.descripcion.toLowerCase().includes(textoBusqueda)
        );
    }

    // Filtrar por categoría
    if (filtroCategoria) {
        resultado = resultado.filter(juego => juego.categoriaId === parseInt(filtroCategoria));
    }

    // Filtrar por plataforma
    if (filtroPlataforma) {
        resultado = resultado.filter(juego => juego.plataforma.includes(filtroPlataforma));
    }

    // Filtrar por estado
    if (filtroEstado) {
        resultado = resultado.filter(juego => juego.estado === filtroEstado);
    }

    return resultado;
}

// ─── ORDENAR JUEGOS ───────────────────────────────────────────────────────────
function ordenarJuegos(criterio) {
    const textoBusqueda = document.getElementById('buscador')?.value || '';
    let lista = aplicarFiltros(textoBusqueda.toLowerCase().trim());

    // Ordenar según el criterio elegido
    switch (criterio) {
        case 'precio-asc':
            lista.sort((a, b) => a.precio - b.precio);
            break;
        case 'precio-desc':
            lista.sort((a, b) => b.precio - a.precio);
            break;
        case 'nombre-az':
            lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
        case 'nombre-za':
            lista.sort((a, b) => b.nombre.localeCompare(a.nombre));
            break;
        case 'calificacion':
            lista.sort((a, b) => (b.calificacion || 0) - (a.calificacion || 0));
            break;
        case 'resenas':
            lista.sort((a, b) => (b.resenas || 0) - (a.resenas || 0));
            break;
    }

    renderizarTarjetas(lista);
    actualizarIndicadores(lista);
}

// ─── ACTUALIZAR PANEL DE INDICADORES ─────────────────────────────────────────
function actualizarIndicadores(lista) {
    const total = lista.length;

    // Calcular promedio de precio (solo juegos con precio > 0)
    const conPrecio = lista.filter(j => j.precio > 0);
    const promedio = conPrecio.length > 0
        ? conPrecio.reduce((sum, j) => sum + j.precio, 0) / conPrecio.length
        : 0;

    // Encontrar el más caro y el más barato
    const masCaro = conPrecio.length > 0
        ? conPrecio.reduce((max, j) => j.precio > max.precio ? j : max)
        : null;
    const masBarato = conPrecio.length > 0
        ? conPrecio.reduce((min, j) => j.precio < min.precio ? j : min)
        : null;

    // Contar disponibles
    const disponibles = lista.filter(j => j.estado === 'disponible').length;

    // Mostrar en el HTML
    const setTexto = (id, texto) => {
        const el = document.getElementById(id);
        if (el) el.textContent = texto;
    };

    setTexto('ind-total', total);
    setTexto('ind-promedio', `$${promedio.toFixed(2)}`);
    setTexto('ind-mas-caro', masCaro ? `${masCaro.nombre} ($${masCaro.precio})` : '-');
    setTexto('ind-mas-barato', masBarato ? `${masBarato.nombre} ($${masBarato.precio})` : '-');
    setTexto('ind-disponibles', disponibles);
}

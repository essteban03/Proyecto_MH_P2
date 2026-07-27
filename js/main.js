/* ============================================================
   main.js — Inicialización de la página de inicio (index.html)
   
   Carga los juegos destacados dinámicamente y actualiza
   el contador del carrito en el navbar.
   ============================================================ */

// ─── AL CARGAR LA PÁGINA ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {

    // Actualizar contador del carrito en el navbar
    actualizarContadorCarrito();

    // Cargar los 6 juegos destacados en la página principal
    await cargarJuegosDestacados();

    // Inicializar el widget del clima
    inicializarClima();
});

// ─── CARGAR LOS JUEGOS DESTACADOS EN EL INDEX ────────────────────────────────
async function cargarJuegosDestacados() {
    const contenedor = document.getElementById('contenedor-destacados');
    if (!contenedor) return;

    // Mostrar mensaje de carga
    contenedor.innerHTML = '<p class="cargando-juegos"><i class="fa-solid fa-spinner fa-spin"></i> Cargando juegos...</p>';

    const juegos = await cargarJuegos();
    await cargarCategorias(); // También cargar categorías para tenerlas disponibles

    // Tomamos solo los primeros 6 juegos para la sección destacada
    const destacados = juegos.slice(0, 6);

    // Si no hay juegos, mostrar mensaje
    if (destacados.length === 0) {
        contenedor.innerHTML = '<p>No hay juegos disponibles en este momento.</p>';
        return;
    }

    // Generar las tarjetas
    contenedor.innerHTML = destacados.map(juego => `
        <article class="tarjeta-juego" 
                 onmouseenter="this.style.transform='translateY(-6px)'"
                 onmouseleave="this.style.transform='translateY(0)'">
            <figure>
                <img src="${juego.imagen}"
                     alt="${juego.nombre}"
                     onerror="this.src='imagenes/icono.png'">
                <figcaption>${juego.plataforma}</figcaption>
            </figure>
            ${juego.etiqueta ? `<span class="badge badge-${juego.etiqueta === 'Nuevo' ? 'nuevo' : 'top'}">${juego.etiqueta}</span>` : ''}
            <h3>${juego.nombre}</h3>
            ${juego.resenas ? `<p class="resenas">${'⭐'.repeat(juego.calificacion)} (${juego.resenas} reseñas)</p>` : ''}
            <p class="precio">${juego.precio === 0 ? 'GRATIS' : `$${juego.precio.toFixed(2)}`}</p>
            <div class="acciones-index">
                <button class="btn btn-detalle"
                        onclick="verDetalleIndex(${juego.id})">
                    <i class="fa-solid fa-circle-info"></i> Ver detalles
                </button>
                <button class="btn btn-carrito-index"
                        onclick="agregarAlCarritoIndex(${juego.id})"
                        ${juego.estado === 'agotado' ? 'disabled' : ''}>
                    <i class="fa-solid fa-cart-plus"></i>
                    ${juego.estado === 'agotado' ? 'Agotado' : 'Agregar'}
                </button>
            </div>
        </article>`).join('');
}

// ─── VER DETALLE DESDE EL INDEX (versión simplificada) ───────────────────────
async function verDetalleIndex(id) {
    const juegos = leer('juegos') || [];
    const categorias = leer('categorias') || [];
    const juego = juegos.find(j => j.id === id);
    if (!juego) return;

    const categoria = categorias.find(c => c.id === juego.categoriaId);
    const estrellas = juego.calificacion ? '⭐'.repeat(juego.calificacion) : 'Sin calificación';

    Swal.fire({
        title: juego.nombre,
        html: `
            <img src="${juego.imagen}" alt="${juego.nombre}"
                 onerror="this.src='imagenes/icono.png'"
                 style="width:100%;max-height:200px;object-fit:cover;border-radius:8px;margin-bottom:15px">
            <p><strong>Categoría:</strong> ${categoria ? categoria.nombre : '-'}</p>
            <p><strong>Plataforma:</strong> ${juego.plataforma}</p>
            <p><strong>Calificación:</strong> ${estrellas} (${juego.resenas || 0} reseñas)</p>
            <hr>
            <p>${juego.descripcion}</p>
            <p style="font-size:1.5rem;font-weight:bold;color:#00439c">
                ${juego.precio === 0 ? 'GRATIS' : `$${juego.precio.toFixed(2)}`}
            </p>`,
        confirmButtonText: '🛒 Agregar al carrito',
        confirmButtonColor: '#00439c',
        showCancelButton: true,
        cancelButtonText: 'Cerrar'
    }).then(res => {
        if (res.isConfirmed) agregarAlCarritoIndex(id);
    });
}

// ─── AGREGAR AL CARRITO DESDE EL INDEX ────────────────────────────────────────
function agregarAlCarritoIndex(juegoId) {
    const juegos = leer('juegos') || [];
    const juego = juegos.find(j => j.id === juegoId);
    if (!juego) return;

    const carrito = leer('carrito') || [];
    const yaExiste = carrito.some(item => item.id === juegoId);

    if (yaExiste) {
        Toastify({
            text: `⚠️ "${juego.nombre}" ya está en tu carrito`,
            duration: 3000,
            gravity: 'top',
            position: 'right',
            backgroundColor: '#f0a500'
        }).showToast();
        return;
    }

    carrito.push({
        id: juego.id,
        nombre: juego.nombre,
        plataforma: juego.plataforma,
        precio: juego.precio,
        imagen: juego.imagen
    });

    guardar('carrito', carrito);
    actualizarContadorCarrito();

    Toastify({
        text: `🛒 "${juego.nombre}" agregado al carrito`,
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: '#00439c'
    }).showToast();
}

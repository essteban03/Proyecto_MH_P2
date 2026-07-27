/* ============================================================
   carrito.js — Lógica del carrito de compras
   
   Guarda, lee y actualiza el carrito en localStorage.
   Renderiza la tabla dinámicamente y calcula el total.
   ============================================================ */

// ─── OBTENER EL CARRITO ACTUAL ────────────────────────────────────────────────
function obtenerCarrito() {
    return leer('carrito') || []; // Si no hay carrito guardado, devolvemos array vacío
}

// ─── AGREGAR UN JUEGO AL CARRITO ──────────────────────────────────────────────
function agregarAlCarrito(juegoId) {
    // Leer los juegos desde localStorage (funciona en cualquier página)
    const juegos = leer('juegos') || [];
    const juego = juegos.find(j => j.id === juegoId);
    if (!juego) return;

    if (juego.estado === 'agotado') {
        Swal.fire('Juego agotado', 'Este juego no está disponible en este momento.', 'info');
        return;
    }

    // Obtener el carrito actual
    const carrito = obtenerCarrito();

    // Verificar si el juego ya está en el carrito
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

    // Agregar el juego al carrito
    carrito.push({
        id: juego.id,
        nombre: juego.nombre,
        plataforma: juego.plataforma,
        precio: juego.precio,
        imagen: juego.imagen
    });

    // Guardar en localStorage
    guardar('carrito', carrito);

    // Actualizar el contador del carrito en el navbar
    actualizarContadorCarrito();

    Toastify({
        text: `🛒 "${juego.nombre}" agregado al carrito`,
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: '#00439c'
    }).showToast();
}

// ─── ACTUALIZAR EL CONTADOR DEL CARRITO EN EL NAVBAR ─────────────────────────
function actualizarContadorCarrito() {
    const carrito = obtenerCarrito();
    const contadores = document.querySelectorAll('.contador-carrito');
    contadores.forEach(el => {
        el.textContent = carrito.length;
        el.style.display = carrito.length > 0 ? 'inline' : 'none';
    });
}

// ─── RENDERIZAR LA TABLA DEL CARRITO ─────────────────────────────────────────
function renderizarCarrito() {
    const tbody = document.getElementById('tbody-carrito');
    const seccionVacio = document.getElementById('carrito-vacio');
    const seccionTabla = document.getElementById('carrito-con-items');

    if (!tbody) return;

    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        // Mostrar mensaje de carrito vacío
        if (seccionVacio) seccionVacio.style.display = 'block';
        if (seccionTabla) seccionTabla.style.display = 'none';
        return;
    }

    // Mostrar la tabla
    if (seccionVacio) seccionVacio.style.display = 'none';
    if (seccionTabla) seccionTabla.style.display = 'block';

    // Generar filas de la tabla
    tbody.innerHTML = carrito.map(item => `
        <tr>
            <td>
                <img src="${item.imagen}" alt="${item.nombre}"
                     onerror="this.src='imagenes/icono.png'"
                     style="width:50px;height:60px;object-fit:cover;border-radius:6px">
                ${item.nombre}
            </td>
            <td>${item.plataforma}</td>
            <td>${item.precio === 0 ? 'GRATIS' : `$${item.precio.toFixed(2)}`}</td>
            <td>
                <button class="btn-eliminar-carrito"
                        onclick="eliminarDelCarrito(${item.id})">
                    <i class="fa-solid fa-trash"></i> Quitar
                </button>
            </td>
        </tr>`).join('');

    // Calcular y mostrar el total
    const total = carrito.reduce((suma, item) => suma + item.precio, 0);
    const spanTotal = document.getElementById('total-carrito');
    if (spanTotal) spanTotal.textContent = `$${total.toFixed(2)}`;

    // Actualizar el botón de pago
    const btnPago = document.getElementById('btn-confirmar-pago');
    if (btnPago) btnPago.textContent = `Confirmar Pago de $${total.toFixed(2)}`;
}

// ─── ELIMINAR UN ITEM DEL CARRITO ────────────────────────────────────────────
function eliminarDelCarrito(id) {
    Swal.fire({
        title: '¿Quitar del carrito?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d53900',
        cancelButtonColor: '#999',
        confirmButtonText: 'Sí, quitar',
        cancelButtonText: 'Cancelar'
    }).then(resultado => {
        if (resultado.isConfirmed) {
            // Filtrar el array para quitar el item
            const carrito = obtenerCarrito().filter(item => item.id !== id);
            guardar('carrito', carrito);

            // Volver a renderizar
            renderizarCarrito();
            actualizarContadorCarrito();

            Toastify({
                text: '🗑️ Juego quitado del carrito',
                duration: 2000,
                gravity: 'top',
                position: 'right',
                backgroundColor: '#d53900'
            }).showToast();
        }
    });
}

// ─── VACIAR TODO EL CARRITO ───────────────────────────────────────────────────
function vaciarCarrito() {
    Swal.fire({
        title: '¿Vaciar el carrito?',
        text: 'Se eliminarán todos los juegos seleccionados.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d53900',
        cancelButtonColor: '#999',
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'Cancelar'
    }).then(resultado => {
        if (resultado.isConfirmed) {
            guardar('carrito', []);
            renderizarCarrito();
            actualizarContadorCarrito();
        }
    });
}

// ─── CONFIRMAR COMPRA ─────────────────────────────────────────────────────────
function confirmarCompra(evento) {
    evento.preventDefault();

    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
        Swal.fire('Carrito vacío', 'Agrega juegos al carrito antes de comprar.', 'info');
        return;
    }

    const total = carrito.reduce((suma, item) => suma + item.precio, 0);

    Swal.fire({
        title: '¡Compra exitosa!',
        html: `Tu compra de <strong>$${total.toFixed(2)}</strong> ha sido procesada.<br>¡Gracias por comprar en Matador House!`,
        icon: 'success',
        confirmButtonColor: '#00439c',
        confirmButtonText: 'Volver a la tienda'
    }).then(() => {
        // Vaciar el carrito después de comprar
        guardar('carrito', []);
        actualizarContadorCarrito();
        window.location.href = 'index.html';
    });
}

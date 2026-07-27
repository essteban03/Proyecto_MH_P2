/* ============================================================
   crud.js — Operaciones de Agregar, Editar y Eliminar juegos
   
   Cada función modifica el array en memoria Y actualiza
   localStorage, luego vuelve a renderizar la pantalla.
   ============================================================ */

// ─── ABRIR FORMULARIO PARA AGREGAR NUEVO JUEGO ───────────────────────────────
function abrirFormularioAgregar() {
    const modal = document.getElementById('modal-formulario');
    const titulo = document.getElementById('titulo-modal-form');
    const form = document.getElementById('form-juego');

    if (!modal) return;

    titulo.textContent = 'Agregar Nuevo Juego';
    form.reset(); // Limpiar el formulario

    // Quitar el ID de edición si venía de una edición previa
    form.removeAttribute('data-id-editar');

    modal.style.display = 'flex';
}

// ─── CERRAR MODAL DEL FORMULARIO ─────────────────────────────────────────────
function cerrarFormulario() {
    const modal = document.getElementById('modal-formulario');
    if (modal) modal.style.display = 'none';
}

// ─── ABRIR FORMULARIO PARA EDITAR UN JUEGO EXISTENTE ─────────────────────────
function abrirFormularioEditar(id) {
    const juego = todosLosJuegos.find(j => j.id === id);
    if (!juego) return;

    const modal = document.getElementById('modal-formulario');
    const titulo = document.getElementById('titulo-modal-form');
    const form = document.getElementById('form-juego');

    titulo.textContent = 'Editar Juego';

    // Llenar el formulario con los datos actuales del juego
    document.getElementById('form-nombre').value = juego.nombre;
    document.getElementById('form-categoriaId').value = juego.categoriaId;
    document.getElementById('form-descripcion').value = juego.descripcion;
    document.getElementById('form-precio').value = juego.precio;
    document.getElementById('form-plataforma').value = juego.plataforma;
    document.getElementById('form-estado').value = juego.estado;
    document.getElementById('form-etiqueta').value = juego.etiqueta || '';

    // Guardamos el ID del juego que estamos editando en el formulario
    form.setAttribute('data-id-editar', id);

    modal.style.display = 'flex';
}

// ─── GUARDAR JUEGO (AGREGAR O EDITAR según el contexto) ──────────────────────
function guardarJuego(evento) {
    evento.preventDefault(); // Evitar que el form recargue la página

    const form = document.getElementById('form-juego');
    const idEditar = form.getAttribute('data-id-editar');

    // Leer los valores del formulario
    const nombre = document.getElementById('form-nombre').value.trim();
    const categoriaId = parseInt(document.getElementById('form-categoriaId').value);
    const descripcion = document.getElementById('form-descripcion').value.trim();
    const precio = parseFloat(document.getElementById('form-precio').value);
    const plataforma = document.getElementById('form-plataforma').value;
    const estado = document.getElementById('form-estado').value;
    const etiqueta = document.getElementById('form-etiqueta').value.trim();

    // ── VALIDACIONES ─────────────────────────────────────────────
    if (!nombre) {
        Swal.fire('Campo requerido', 'El nombre del juego es obligatorio.', 'warning');
        return;
    }
    if (!categoriaId) {
        Swal.fire('Campo requerido', 'Debes seleccionar una categoría.', 'warning');
        return;
    }
    if (!descripcion) {
        Swal.fire('Campo requerido', 'La descripción es obligatoria.', 'warning');
        return;
    }
    if (isNaN(precio) || precio < 0) {
        Swal.fire('Precio inválido', 'El precio debe ser un número mayor o igual a 0.', 'warning');
        return;
    }

    if (idEditar) {
        // ── MODO EDITAR ──────────────────────────────────────────
        editarJuego(parseInt(idEditar), { nombre, categoriaId, descripcion, precio, plataforma, estado, etiqueta });
    } else {
        // ── MODO AGREGAR ─────────────────────────────────────────
        agregarJuego({ nombre, categoriaId, descripcion, precio, plataforma, estado, etiqueta });
    }

    cerrarFormulario();
}

// ─── AGREGAR UN NUEVO JUEGO ───────────────────────────────────────────────────
function agregarJuego(datos) {
    // Generar ID único: el mayor ID existente + 1
    const maxId = todosLosJuegos.reduce((max, j) => j.id > max ? j.id : max, 0);

    const nuevoJuego = {
        id: maxId + 1,
        nombre: datos.nombre,
        categoriaId: datos.categoriaId,
        descripcion: datos.descripcion,
        precio: datos.precio,
        plataforma: datos.plataforma,
        estado: datos.estado,
        etiqueta: datos.etiqueta,
        calificacion: null,
        resenas: null,
        imagen: 'imagenes/icono.png', // Imagen por defecto
        fechaRegistro: new Date().toISOString().split('T')[0] // Fecha de hoy
    };

    // Agregar al array en memoria
    todosLosJuegos.push(nuevoJuego);

    // Guardar en localStorage
    guardar('juegos', todosLosJuegos);

    // Volver a renderizar la pantalla
    renderizarTarjetas(todosLosJuegos);
    actualizarIndicadores(todosLosJuegos);

    // Notificación con Toastify
    Toastify({
        text: `✅ "${datos.nombre}" agregado correctamente`,
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: '#00439c'
    }).showToast();
}

// ─── EDITAR UN JUEGO EXISTENTE ────────────────────────────────────────────────
function editarJuego(id, datos) {
    // Usar map() para actualizar solo el juego con ese ID
    todosLosJuegos = todosLosJuegos.map(juego => {
        if (juego.id === id) {
            // Combinar los datos viejos con los nuevos (el spread ... preserva imagen y otros campos)
            return { ...juego, ...datos };
        }
        return juego; // Los demás se quedan igual
    });

    // Guardar en localStorage
    guardar('juegos', todosLosJuegos);

    // Volver a renderizar
    renderizarTarjetas(todosLosJuegos);
    actualizarIndicadores(todosLosJuegos);

    Toastify({
        text: `✏️ "${datos.nombre}" actualizado correctamente`,
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: '#28a745'
    }).showToast();
}

// ─── CONFIRMAR Y ELIMINAR UN JUEGO ───────────────────────────────────────────
function confirmarEliminar(id) {
    const juego = todosLosJuegos.find(j => j.id === id);
    if (!juego) return;

    // Pedir confirmación con SweetAlert2
    Swal.fire({
        title: '¿Eliminar este juego?',
        html: `Estás a punto de eliminar <strong>"${juego.nombre}"</strong>.<br>Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d53900',
        cancelButtonColor: '#999',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(resultado => {
        if (resultado.isConfirmed) {
            eliminarJuego(id, juego.nombre);
        }
    });
}

// ─── ELIMINAR UN JUEGO (se llama después de confirmar) ───────────────────────
function eliminarJuego(id, nombre) {
    // filter() devuelve todos los juegos EXCEPTO el que tiene ese ID
    todosLosJuegos = todosLosJuegos.filter(juego => juego.id !== id);

    // Guardar en localStorage
    guardar('juegos', todosLosJuegos);

    // Volver a renderizar
    renderizarTarjetas(todosLosJuegos);
    actualizarIndicadores(todosLosJuegos);

    Toastify({
        text: `🗑️ "${nombre}" eliminado`,
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: '#d53900'
    }).showToast();
}

// ─── RESTABLECER DATOS ORIGINALES ────────────────────────────────────────────
function confirmarRestablecimiento() {
    Swal.fire({
        title: '¿Restablecer datos originales?',
        text: 'Se borrarán todos los cambios realizados y se cargarán los datos originales.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#00439c',
        cancelButtonColor: '#999',
        confirmButtonText: 'Sí, restablecer',
        cancelButtonText: 'Cancelar'
    }).then(async resultado => {
        if (resultado.isConfirmed) {
            mostrarIndicadorCarga(true);

            // Borrar localStorage y recargar desde JSON
            const datos = await restablecerDatosOriginales();
            todosLosJuegos = datos.juegos;
            todasLasCategorias = datos.categorias;
            juegosFiltrados = [...todosLosJuegos];

            llenarFiltrosCategoria();
            renderizarTarjetas(todosLosJuegos);
            actualizarIndicadores(todosLosJuegos);

            mostrarIndicadorCarga(false);

            Swal.fire('¡Datos restablecidos!', 'Se cargaron los datos originales.', 'success');
        }
    });
}

// ─── LLENAR SELECTOR DE CATEGORÍAS EN EL FORMULARIO ──────────────────────────
function llenarSelectCategorias() {
    const select = document.getElementById('form-categoriaId');
    if (!select || todasLasCategorias.length === 0) return;

    select.innerHTML = '<option value="">-- Selecciona una categoría --</option>';

    todasLasCategorias.forEach(cat => {
        const opcion = document.createElement('option');
        opcion.value = cat.id;
        opcion.textContent = cat.nombre;
        select.appendChild(opcion);
    });
}

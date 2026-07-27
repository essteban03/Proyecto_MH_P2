
function abrirFormularioAgregar() {
    const modal = document.getElementById('modal-formulario');
    const titulo = document.getElementById('titulo-modal-form');
    const form = document.getElementById('form-juego');

    if (!modal) return;

    titulo.textContent = 'Agregar Nuevo Juego';
    form.reset(); 

    
    form.removeAttribute('data-id-editar');

    modal.style.display = 'flex';
}


function cerrarFormulario() {
    const modal = document.getElementById('modal-formulario');
    if (modal) modal.style.display = 'none';
}


function abrirFormularioEditar(id) {
    const juego = todosLosJuegos.find(j => j.id === id);
    if (!juego) return;

    const modal = document.getElementById('modal-formulario');
    const titulo = document.getElementById('titulo-modal-form');
    const form = document.getElementById('form-juego');

    titulo.textContent = 'Editar Juego';

    
    document.getElementById('form-nombre').value = juego.nombre;
    document.getElementById('form-categoriaId').value = juego.categoriaId;
    document.getElementById('form-descripcion').value = juego.descripcion;
    document.getElementById('form-precio').value = juego.precio;
    document.getElementById('form-plataforma').value = juego.plataforma;
    document.getElementById('form-estado').value = juego.estado;
    document.getElementById('form-etiqueta').value = juego.etiqueta || '';

    
    form.setAttribute('data-id-editar', id);

    modal.style.display = 'flex';
}


function guardarJuego(evento) {
    evento.preventDefault(); 

    const form = document.getElementById('form-juego');
    const idEditar = form.getAttribute('data-id-editar');

    
    const nombre = document.getElementById('form-nombre').value.trim();
    const categoriaId = parseInt(document.getElementById('form-categoriaId').value);
    const descripcion = document.getElementById('form-descripcion').value.trim();
    const precio = parseFloat(document.getElementById('form-precio').value);
    const plataforma = document.getElementById('form-plataforma').value;
    const estado = document.getElementById('form-estado').value;
    const etiqueta = document.getElementById('form-etiqueta').value.trim();

    
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
        
        editarJuego(parseInt(idEditar), { nombre, categoriaId, descripcion, precio, plataforma, estado, etiqueta });
    } else {
        
        agregarJuego({ nombre, categoriaId, descripcion, precio, plataforma, estado, etiqueta });
    }

    cerrarFormulario();
}


function agregarJuego(datos) {
    
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
        imagen: 'imagenes/icono.png', 
        fechaRegistro: new Date().toISOString().split('T')[0] 
    };

    
    todosLosJuegos.push(nuevoJuego);

    
    guardar('juegos', todosLosJuegos);

    
    renderizarTarjetas(todosLosJuegos);
    actualizarIndicadores(todosLosJuegos);

    
    Toastify({
        text: `✅ "${datos.nombre}" agregado correctamente`,
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: '#00439c'
    }).showToast();
}


function editarJuego(id, datos) {
    
    todosLosJuegos = todosLosJuegos.map(juego => {
        if (juego.id === id) {
            
            return { ...juego, ...datos };
        }
        return juego; 
    });

    
    guardar('juegos', todosLosJuegos);

    
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


function confirmarEliminar(id) {
    const juego = todosLosJuegos.find(j => j.id === id);
    if (!juego) return;

    
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


function eliminarJuego(id, nombre) {
    
    todosLosJuegos = todosLosJuegos.filter(juego => juego.id !== id);

    
    guardar('juegos', todosLosJuegos);

    
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

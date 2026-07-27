


let todosLosJuegos = [];      
let todasLasCategorias = [];  
let juegosFiltrados = [];     


async function inicializarCatalogo() {
    mostrarIndicadorCarga(true);

    
    todosLosJuegos = await cargarJuegos();
    todasLasCategorias = await cargarCategorias();

    
    juegosFiltrados = [...todosLosJuegos];

    
    llenarFiltrosCategoria();

    
    renderizarTarjetas(juegosFiltrados);

    
    actualizarIndicadores(juegosFiltrados);

    mostrarIndicadorCarga(false);
}


function mostrarIndicadorCarga(mostrar) {
    const indicador = document.getElementById('indicador-carga');
    if (indicador) {
        indicador.style.display = mostrar ? 'block' : 'none';
    }
}


function llenarFiltrosCategoria() {
    const select = document.getElementById('filtro-categoria');
    if (!select) return;

    
    select.innerHTML = '<option value="">Todas las categorías</option>';

    
    todasLasCategorias.forEach(cat => {
        const opcion = document.createElement('option');
        opcion.value = cat.id;
        opcion.textContent = cat.nombre;
        select.appendChild(opcion);
    });
}


function renderizarTarjetas(listaJuegos) {
    const contenedor = document.getElementById('contenedor-juegos');
    if (!contenedor) return;

    
    if (listaJuegos.length === 0) {
        contenedor.innerHTML = `
            <div class="sin-resultados">
                <i class="fa-solid fa-magnifying-glass"></i>
                <p>No se encontraron juegos con esos criterios.</p>
            </div>`;
        return;
    }

    
    contenedor.innerHTML = listaJuegos.map(juego => crearTarjetaHTML(juego)).join('');
}


function crearTarjetaHTML(juego) {
    
    const categoria = todasLasCategorias.find(cat => cat.id === juego.categoriaId);
    const nombreCategoria = categoria ? categoria.nombre : 'Sin categoría';

    
    const estrellas = juego.calificacion
        ? '⭐'.repeat(juego.calificacion)
        : 'Sin calificación';

    
    const badge = juego.etiqueta
        ? `<span class="badge-juego">${juego.etiqueta}</span>`
        : '';

    
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


function buscarJuegos(textoBusqueda) {
    const texto = textoBusqueda.toLowerCase().trim();

    
    const resultado = aplicarFiltros(texto);

    renderizarTarjetas(resultado);
    actualizarIndicadores(resultado);
}


function aplicarFiltros(textoBusqueda = '') {
    const filtroCategoria = document.getElementById('filtro-categoria')?.value || '';
    const filtroPlataforma = document.getElementById('filtro-plataforma')?.value || '';
    const filtroEstado = document.getElementById('filtro-estado')?.value || '';

    let resultado = [...todosLosJuegos];

    
    if (textoBusqueda) {
        resultado = resultado.filter(juego =>
            juego.nombre.toLowerCase().includes(textoBusqueda) ||
            juego.descripcion.toLowerCase().includes(textoBusqueda)
        );
    }

    
    if (filtroCategoria) {
        resultado = resultado.filter(juego => juego.categoriaId === parseInt(filtroCategoria));
    }

    
    if (filtroPlataforma) {
        resultado = resultado.filter(juego => juego.plataforma.includes(filtroPlataforma));
    }

    
    if (filtroEstado) {
        resultado = resultado.filter(juego => juego.estado === filtroEstado);
    }

    return resultado;
}


function ordenarJuegos(criterio) {
    const textoBusqueda = document.getElementById('buscador')?.value || '';
    let lista = aplicarFiltros(textoBusqueda.toLowerCase().trim());

    
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


function actualizarIndicadores(lista) {
    const total = lista.length;

    
    const conPrecio = lista.filter(j => j.precio > 0);
    const promedio = conPrecio.length > 0
        ? conPrecio.reduce((sum, j) => sum + j.precio, 0) / conPrecio.length
        : 0;

    
    const masCaro = conPrecio.length > 0
        ? conPrecio.reduce((max, j) => j.precio > max.precio ? j : max)
        : null;
    const masBarato = conPrecio.length > 0
        ? conPrecio.reduce((min, j) => j.precio < min.precio ? j : min)
        : null;

    
    const disponibles = lista.filter(j => j.estado === 'disponible').length;

    
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

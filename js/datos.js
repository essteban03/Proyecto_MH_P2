async function cargarJuegos() {
    if (existeDato('juegos')) {
        
        return leer('juegos');
    }

    try {
        
        const respuesta = await fetch('json/juegos.json');

        
        if (!respuesta.ok) {
            throw new Error('No se pudo cargar juegos.json');
        }

        const juegos = await respuesta.json();

        
        guardar('juegos', juegos);

        return juegos;

    } catch (error) {
        console.error('Error al cargar juegos:', error);
        return []; 
    }
}


async function cargarCategorias() {
    if (existeDato('categorias')) {
        return leer('categorias');
    }

    try {
        const respuesta = await fetch('json/categorias.json');

        if (!respuesta.ok) {
            throw new Error('No se pudo cargar categorias.json');
        }

        const categorias = await respuesta.json();
        guardar('categorias', categorias);
        return categorias;

    } catch (error) {
        console.error('Error al cargar categorias:', error);
        return [];
    }
}


async function cargarUsuarios() {
    if (existeDato('usuarios')) {
        return leer('usuarios');
    }

    try {
        const respuesta = await fetch('json/usuarios.json');

        if (!respuesta.ok) {
            throw new Error('No se pudo cargar usuarios.json');
        }

        const usuarios = await respuesta.json();
        guardar('usuarios', usuarios);
        return usuarios;

    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        return [];
    }
}



async function restablecerDatosOriginales() {
    eliminarClave('juegos');
    eliminarClave('categorias');
    eliminarClave('usuarios');

    const juegos = await cargarJuegos();
    const categorias = await cargarCategorias();
    const usuarios = await cargarUsuarios();

    return { juegos, categorias, usuarios };
}

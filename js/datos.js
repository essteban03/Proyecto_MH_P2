/* ============================================================
   datos.js — Carga los archivos JSON con fetch
   
   Primera vez: carga desde los archivos JSON y guarda en localStorage.
   Las siguientes veces: usa los datos ya guardados en el navegador.
   ============================================================ */

// Carga los juegos. Si ya están en localStorage, los usa directamente.
// Si no, los descarga del archivo JSON y los guarda.
async function cargarJuegos() {
    if (existeDato('juegos')) {
        // Ya están guardados, solo los leemos
        return leer('juegos');
    }

    try {
        // Primera vez: descargamos el archivo JSON
        const respuesta = await fetch('json/juegos.json');

        // Verificamos que la respuesta fue exitosa
        if (!respuesta.ok) {
            throw new Error('No se pudo cargar juegos.json');
        }

        const juegos = await respuesta.json();

        // Guardamos en localStorage para las próximas veces
        guardar('juegos', juegos);

        return juegos;

    } catch (error) {
        console.error('Error al cargar juegos:', error);
        return []; // Devolvemos array vacío para que la app no se rompa
    }
}

// Carga las categorías (mismo proceso que juegos)
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

// Carga los usuarios (mismo proceso)
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

// Restablece todos los datos originales desde los JSON
// (borra el localStorage y vuelve a cargar desde los archivos)
async function restablecerDatosOriginales() {
    eliminarClave('juegos');
    eliminarClave('categorias');
    eliminarClave('usuarios');

    const juegos = await cargarJuegos();
    const categorias = await cargarCategorias();
    const usuarios = await cargarUsuarios();

    return { juegos, categorias, usuarios };
}

function guardar(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
}



function leer(clave) {
    const datos = localStorage.getItem(clave);
    return datos ? JSON.parse(datos) : null;
}


function eliminarClave(clave) {
    localStorage.removeItem(clave);
}


function existeDato(clave) {
    return localStorage.getItem(clave) !== null;
}

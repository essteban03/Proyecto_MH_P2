/* ============================================================
   storage.js — Funciones para manejar localStorage
   
   Este archivo centraliza todas las operaciones de guardado
   y lectura del navegador. Así no repetimos código.
   ============================================================ */

// Guarda cualquier dato en localStorage (lo convierte a texto JSON)
function guardar(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
}

// Lee y devuelve los datos de localStorage (convierte el texto a objeto/array)
// Si la clave no existe, devuelve null
function leer(clave) {
    const datos = localStorage.getItem(clave);
    return datos ? JSON.parse(datos) : null;
}

// Elimina una clave completa del localStorage
function eliminarClave(clave) {
    localStorage.removeItem(clave);
}

// Verifica si ya existen datos guardados para esa clave
function existeDato(clave) {
    return localStorage.getItem(clave) !== null;
}

# Matador House 🎮

**La tienda de juegos PS4 y PS5 número uno en Ecuador**

---

## 👤 Estudiante

**Esteban Gordillo**  
Asignatura: Fundamentos de Sistemas Web  
Institución: UISRAEL

---

## 📋 Descripción

Matador House es una tienda en línea para la venta de juegos de PlayStation 4 y PlayStation 5 en Ecuador. El proyecto evolucionó desde una página HTML estática hasta una aplicación web completamente dinámica e interactiva, aplicando JavaScript, manipulación del DOM, archivos JSON, almacenamiento local y consumo de APIs externas.

---

## 🎯 Objetivo

Integrar HTML semántico, diseño responsivo, JavaScript, archivos JSON, almacenamiento local, librerías y APIs externas en una tienda de videojuegos funcional, demostrando la evolución del proyecto a través de los tres parciales.

---

## ✅ Funcionalidades

- **Catálogo dinámico**: tarjetas generadas con JavaScript desde archivos JSON
- **Búsqueda en tiempo real**: filtra juegos mientras escribes
- **Filtros**: por categoría, plataforma y estado
- **Ordenamiento**: por precio, nombre y calificación
- **Ver detalles**: modal con información completa del juego (SweetAlert2)
- **Agregar juegos**: formulario con validación completa
- **Editar juegos**: formulario pre-llenado con datos actuales
- **Eliminar juegos**: confirmación con SweetAlert2
- **Restablecer datos**: recarga los datos originales desde JSON
- **Carrito de compras**: dinámico con localStorage, cálculo automático del total
- **Registro de usuarios**: validación completa, con selector de países (API)
- **Login funcional**: verifica credenciales contra localStorage
- **Widget de clima**: muestra el clima de 4 ciudades ecuatorianas (Open-Meteo)
- **Panel de administración**: tabla de juegos, gráficos estadísticos (Chart.js)
- **Indicadores dinámicos**: total, promedio precio, más caro, más barato
- **Notificaciones**: Toastify para confirmaciones rápidas
- **Persistencia**: todos los datos se guardan en localStorage

---

## 🛠️ Tecnologías utilizadas

- HTML5 semántico
- CSS3 (Vanilla + Bootstrap 5.3)
- JavaScript (ES6+)
- JSON (archivos de datos)
- localStorage (persistencia en el navegador)

---

## 📚 Librerías incorporadas

| Librería | Versión | Uso |
|---|---|---|
| Bootstrap | 5.3.3 | Layout y componentes responsivos |
| Font Awesome | 6.5.0 | Íconos |
| SweetAlert2 | 11 | Confirmaciones y modales |
| Toastify | Última | Notificaciones breves |
| Chart.js | Última | Gráficos estadísticos |

---

## 🌐 APIs consumidas

| API | URL | Uso |
|---|---|---|
| Countries.dev | `https://countries.dev/api/countries` | Selector de países en el registro |
| Open-Meteo | `https://api.open-meteo.com/v1/forecast` | Widget de clima para Ecuador |

---

## 📁 Estructura de carpetas

```
matador_house/
├── index.html          ← Página principal (juegos destacados + clima)
├── catalogo.html       ← Catálogo completo con CRUD
├── admin.html          ← Panel de administración y gráficos
├── registro.html       ← Registro de usuarios con API de países
├── login.html          ← Login funcional con localStorage
├── nosotros.html       ← Información de la empresa
├── contacto.html       ← Formulario de contacto y mapa
├── carrito.html        ← Carrito dinámico con localStorage
├── exito.html          ← Página de confirmación
│
├── css/
│   ├── general.css     ← Estilos base y responsivos
│   ├── index.css       ← Estilos del inicio
│   ├── catalogo.css    ← Estilos del catálogo, admin y widgets
│   ├── registro.css    ← Estilos del formulario de registro
│   ├── login.css       ← Estilos del login
│   ├── carrito.css     ← Estilos del carrito
│   ├── contacto.css    ← Estilos del contacto
│   └── nosotros.css    ← Estilos de la página nosotros
│
├── js/
│   ├── storage.js      ← Funciones de localStorage (guardar/leer)
│   ├── datos.js        ← Carga de JSON con fetch
│   ├── catalogo.js     ← Renderizado, búsqueda, filtros, indicadores
│   ├── crud.js         ← Agregar, editar, eliminar juegos
│   ├── carrito.js      ← Lógica completa del carrito
│   ├── registro.js     ← Formulario de registro + API de países
│   ├── clima.js        ← Widget del clima (Open-Meteo)
│   ├── graficos.js     ← Gráficos con Chart.js
│   └── main.js         ← Inicialización de index.html
│
├── json/
│   ├── juegos.json     ← 28 juegos de PS4/PS5
│   ├── categorias.json ← 8 categorías de juegos
│   └── usuarios.json   ← 20 usuarios de ejemplo
│
└── imagenes/
    └── (imágenes de los juegos)
```

---

## 🚀 Instrucciones para ejecutar

1. Clona el repositorio:
   ```bash
   git clone https://github.com/essteban03/Proyecto_MH_P2
   ```

2. Abre la carpeta en tu editor de código (VS Code recomendado)

3. Instala la extensión **Live Server** en VS Code

4. Haz clic derecho en `index.html` → **"Open with Live Server"**

5. La aplicación abrirá en `http://127.0.0.1:5500`

> ⚠️ **Importante**: El proyecto **debe ejecutarse con Live Server** para que los archivos JSON carguen correctamente. Abrir el HTML directamente desde el explorador de archivos no funciona con `fetch`.

---

## 🔗 Enlaces

- **Repositorio GitHub**: https://github.com/essteban03/Proyecto_MH_P2
- **GitHub Pages**: https://essteban03.github.io/Proyecto_MH_P2/

---

## 📸 Capturas principales

*(Agregar capturas después de la demostración)*

---

© 2026 Matador House — Todos los derechos reservados.
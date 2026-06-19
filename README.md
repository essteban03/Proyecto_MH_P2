# Matador House

## Descripción
Matador House es una tienda en línea de videojuegos y suscripciones PlayStation (PS4/PS5) para Ecuador. El sitio permite explorar juegos destacados, comparar planes de PlayStation Plus, ver trailers, crear una cuenta, iniciar sesión y simular una compra con carrito y pago.

## Objetivo
Integrar estilos CSS externos, componentes de Bootstrap, diseño adaptable y representación de datos en formato JSON y XML dentro de un proyecto web de e-commerce.

## Tecnologías utilizadas
- HTML5 semántico
- CSS3 (Box Model, Flexbox, Grid, media queries, transiciones)
- Bootstrap 5.3 (Navbar, Carousel, Modal, Accordion, Alert, Badge)
- Font Awesome 6 (iconografía)
- JSON y XML (representación de datos)

## Estructura de carpetas
```
matador-house/
│
├── index.html
├── nosotros.html
├── contacto.html
├── registro.html
├── login.html
├── carrito.html
├── exito.html
│
├── css/
│   ├── general.css
│   ├── index.css
│   ├── nosotros.css
│   ├── contacto.css
│   ├── registro.css
│   ├── login.css
│   ├── carrito.css
│   └── exito.css
│
├── imagenes/
│   └── (logos, fotos del equipo, portadas de juegos)
│
├── data/
│   ├── datos.json
│   └── datos.xml
│
└── README.md
```

## Páginas disponibles
| Página | Descripción |
|---|---|
| `index.html` | Inicio: carrusel de promociones, juegos destacados, planes PS Plus, trailers |
| `nosotros.html` | Información de la empresa y del equipo |
| `contacto.html` | Formulario de contacto, preguntas frecuentes y mapa |
| `registro.html` | Creación de cuenta de jugador |
| `login.html` | Inicio de sesión |
| `carrito.html` | Carrito de compras y formulario de pago |
| `exito.html` | Confirmación de compra |

## Componentes de Bootstrap utilizados
1. **Navbar** — menú principal con botón de hamburguesa para móvil, presente en todas las páginas con navegación completa.
2. **Carousel** — banner de promociones en la página de inicio (`index.html`).
3. **Modal** — ventana de "Ver detalles" en cada tarjeta de la sección Juegos Destacados.
4. **Accordion** — preguntas frecuentes en `contacto.html`.
5. **Alert** — aviso de oferta de la semana en `index.html`.
6. **Badge** — etiquetas "Nuevo" y "Más Vendido" sobre las tarjetas de juegos.

## Enfoque responsive
El sitio se apoya en el sistema de cuadrícula y los componentes de Bootstrap (que son mobile-first por diseño) y se complementa con media queries propias para ajustar el carrusel, el catálogo de planes (Grid de 3 → 2 → 1 columnas) y las tablas en pantallas pequeñas. Se revisó la visualización en vista móvil, tableta y escritorio.

## Datos JSON y XML
Dentro de la carpeta `data/` se incluyen dos archivos que representan la información mostrada en la sección **Juegos Destacados** de `index.html`:

- **`datos.json`**: arreglo de objetos, uno por cada juego, con los campos `id`, `nombre`, `descripcion`, `precio`, `plataforma`, `calificacion`, `resenas`, `etiqueta` e `imagen`.
- **`datos.xml`**: la misma información estructurada con la etiqueta raíz `<juegos>` y un nodo `<juego>` por cada título.

### Relación entre la interfaz y los datos
| Elemento de la interfaz | Campo JSON / XML |
|---|---|
| Nombre del juego | `nombre` |
| Descripción (mostrada en el modal) | `descripcion` |
| Precio | `precio` |
| Plataforma (PS5 / PS4-PS5) | `plataforma` |
| Estrellas y número de reseñas | `calificacion`, `resenas` |
| Etiqueta "Nuevo" / "Más Vendido" | `etiqueta` |
| Imagen de portada | `imagen` |

Actualmente estos datos se muestran de forma simulada directamente en el HTML. En una etapa posterior del proyecto, esta misma información podría obtenerse dinámicamente desde un servidor o una API en lugar de estar escrita en los archivos HTML.

## Instrucciones para ejecutar el proyecto
1. Descargar o clonar la carpeta del proyecto.
2. Abrir `index.html` directamente en el navegador (no requiere servidor ni base de datos).
3. Navegar entre las páginas usando el menú superior.

## Autor
Esteban Gordillo — Universidad de las Fuerzas Armadas ESPE, Ingeniería en Tecnologías de la Información.
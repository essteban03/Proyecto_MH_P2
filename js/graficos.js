let graficoCategorias = null;
let graficoPlataformas = null;


function generarGraficoCategorias(juegos, categorias) {
    const canvas = document.getElementById('grafico-categorias');
    if (!canvas) return;

    
    if (graficoCategorias) {
        graficoCategorias.destroy();
    }

    
    const conteo = categorias.map(cat => {
        const cantidad = juegos.filter(j => j.categoriaId === cat.id).length;
        return { nombre: cat.nombre, cantidad };
    });

    
    const conDatos = conteo.filter(c => c.cantidad > 0);

    graficoCategorias = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: conDatos.map(c => c.nombre),
            datasets: [{
                label: 'Cantidad de juegos',
                data: conDatos.map(c => c.cantidad),
                backgroundColor: [
                    '#00439c', '#d53900', '#28a745', '#f0a500',
                    '#6f42c1', '#17a2b8', '#e83e8c', '#fd7e14'
                ],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Juegos por Categoría'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 } 
                }
            }
        }
    });
}


function generarGraficoPlataformas(juegos) {
    const canvas = document.getElementById('grafico-plataformas');
    if (!canvas) return;

    if (graficoPlataformas) {
        graficoPlataformas.destroy();
    }

    
    const soloPS5 = juegos.filter(j => j.plataforma === 'PS5').length;
    const ps4yPS5 = juegos.filter(j => j.plataforma === 'PS4 / PS5').length;
    const soloPS4 = juegos.filter(j => j.plataforma === 'PS4').length;

    graficoPlataformas = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: ['Solo PS5', 'PS4 / PS5', 'Solo PS4'],
            datasets: [{
                data: [soloPS5, ps4yPS5, soloPS4],
                backgroundColor: ['#00439c', '#d53900', '#f0a500'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribución por Plataforma'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}


function generarGraficoEstados(juegos) {
    const canvas = document.getElementById('grafico-estados');
    if (!canvas) return;

    const disponibles = juegos.filter(j => j.estado === 'disponible').length;
    const oferta = juegos.filter(j => j.estado === 'oferta').length;
    const agotados = juegos.filter(j => j.estado === 'agotado').length;

    new Chart(canvas, {
        type: 'pie',
        data: {
            labels: ['Disponible', 'En oferta', 'Agotado'],
            datasets: [{
                data: [disponibles, oferta, agotados],
                backgroundColor: ['#28a745', '#f0a500', '#d53900'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Juegos por Estado'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}


async function inicializarGraficos() {
    const juegos = await cargarJuegos();
    const categorias = await cargarCategorias();

    generarGraficoCategorias(juegos, categorias);
    generarGraficoPlataformas(juegos);
    generarGraficoEstados(juegos);
}

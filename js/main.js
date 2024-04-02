document.addEventListener("DOMContentLoaded", () => {
    fetch('https://yrecio.github.io/cuadro-champions-final/json/partidos.json')
    .then(response => response.json())
    .then(datos => {
        mostrarInfo(datos);
    })
    .catch(error => console.error('Error al cargar el JSON:', error));

    document.getElementById("boton-actualizar-contenido").addEventListener("click", function () {
        const datosTexto = document.getElementById("textarea-actualizar-contenido").value;
        try {
            const datos = JSON.parse(datosTexto);
            mostrarInfo(datos); // Usa la función existente para mostrar la información
        } catch (error) {
            console.error('Error al analizar el JSON:', error);
        }
    });

    document.getElementById("boton-descarga-imagen").addEventListener("click", function () {
        let grafico = document.querySelector('main');
        html2canvas(grafico, { scale: 4 }).then(canvas => {
            let enlace = document.createElement("a");
            enlace.href = canvas.toDataURL("image/jpg");
            enlace.download = "cuadro-champions.jpg";
            enlace.click();
        });
    });

    function mostrarInfo(datos) {
        actualizarDatos(datos);
    }

});

function actualizarDatos(datos) {
    ['cuartos', 'semifinales', 'final'].forEach(fase => {
        let numeroPartidos = Object.keys(datos[fase]).length;
        for (let numero = 1; numero <= numeroPartidos; numero++) {
            let bloqueId = `bloque-${fase}-${numero}`;
            let bloque = document.getElementById(bloqueId);
            if (!bloque) continue; // Si el bloque no existe, continúa con el siguiente.

            // Limpia el contenido existente del bloque antes de añadir el nuevo
            while (bloque.firstChild) {
                bloque.removeChild(bloque.firstChild);
            }

            let partido = document.createElement('div');
            partido.className = 'partido';
            partido.id = `partido-${fase}-${numero}`;

            ['local', 'visitante'].forEach(tipo => {
                let equipo = document.createElement('div');
                equipo.className = 'equipo';
                let equipoId = `${fase}-${numero}-${tipo}`;
                equipo.id = equipoId;

                // Ajuste para manejar datos vacíos
                let nombreEquipo = datos[fase][`partido ${numero}`] ? datos[fase][`partido ${numero}`][tipo] : "";
                let rutaImagen = nombreEquipo && datos["rutas-img"][nombreEquipo] ? datos["rutas-img"][nombreEquipo] : 'sin-datos';
                equipo.style.backgroundImage = `url('img/equipos/${rutaImagen}.png')`;

                partido.appendChild(equipo);
            });

            let detalles = document.createElement('div');
            detalles.className = 'detalles';
            detalles.id = `${fase}-${numero}-texto`;
            detalles.textContent = datos[fase][`partido ${numero}`] ? datos[fase][`partido ${numero}`].detalles : '';

            partido.appendChild(detalles);
            bloque.appendChild(partido);
        }
    });
}








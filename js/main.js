document.addEventListener("DOMContentLoaded", () => {
    fetch('json/partidos.json')
        .then(response => response.json())
        .then(datos => {

            // Uso la función principal para actualizar el gráfico con lo que hay en partidos.json
            try {
                actualizarDatos(datos);
            } catch (error) {
                console.log('Error al cargar el JSON subido al servidor') // Mensaje por si falla esta parte
            }

            // Este botón actualiza el contenido de forma temporal a partir de un código introducido

            document.getElementById("boton-actualizar-contenido").addEventListener("click", function () {
                let datosTexto = document.getElementById("textarea-actualizar-contenido").value // Creo una variable que recoge el contenido introducido en el textarea
                let datos = JSON.parse(datosTexto); // Esta nueva variable recoge ese mismo contenido en un objeto para poder manejarlo
                try {
                    actualizarDatos(datos) // Uso la función principal para reemplazar el contenido por lo que hay en el código en el textarea
                } catch (error) {
                    console.error('Error al analizar el JSON introducido en el textarea', error); // Error si el JSON del textarea no funciona
                } // Mensaje por si falla esta parte
            })

            // Este botón descarga la imagen como JPG con el contenido que aparezca, ya sea el consolidado en el partidos.json o el temporal introducido en el textarea

            document.getElementById("boton-descarga-imagen").addEventListener("click", function () {
                let grafico = document.querySelector('main') // Selecciona el bloque main, que es el que se va a imprimir
                html2canvas(grafico, { scale: 4 }).then(canvas => { // Llamo a la función html2canvas de esta biblioteca, introduciendo como parámetros el grafico definido antes y una propiedad para escalarlo. 
                    let enlace = document.createElement("a"); // Crea un enlace dinámico sobre ese elemento
                    enlace.href = canvas.toDataURL("image/jpg"); // Crea una url como imagen
                    enlace.download = "cuadro.champions.jpg" // El nombre de la imagen
                    enlace.click() // Simula que se ha hecho click en ese enlace creado
                })

                // Para entender cómo funciona este botón me fijé en el código de este: https://parzibyte.github.io/ejemplos-html2canvas-javascript/4-Tomar-captura-de-webpage-Descargar/
            })

                .catch(error => console.error('Error general', error)) // Error por si el fallo es más global

        })
})

/* Definición de la función principal a nivel global

Esta función inserta las imágenes con los nombres de los equipos y los textos para
los detalles de cada equipo a partir de dos iteraciones en el código (tanto el introducido
como el subido al servidor, que son iguales,):

1. Iteración por fases del partido (cuartos, semifinales, etc.). Itera en cada fase buscando
el bloque HTML correspondiente a cada partido y crea un elemento con clase "partido" para cada uno.
Si va a añadir contenido por el textarea, lo limpia antes para evitar que se duplique

2. Iteración por tipo de equipo "local y visitante". Crea un elemento con clase "equipo"
para cada uno al que asigna una url con la imagen de fondo en función del nombre asociado
en la fase, equipo y tipo actuales

Al salir de la segunda iteración anida al partido un elemento con detalles (fecha, resultado, etc) en texto.
Por último se anida el elemento partido con todo a su bloque correspondiente.

*/

function actualizarDatos(datos) {
    ['cuartos', 'semifinales', 'final'].forEach(fase => { // Iterar dentro de 'cuartos', 'semifinales' y 'final'. "fase" sería la fase actual en la iteración
        let numeroPartidos = Object.keys(datos[fase]).length; // Número de partidos que hay en cada fase contando las propiedades de cada objeto (la fase)
        for (let numero = 1; numero <= numeroPartidos; numero++) { // Este bucle va anidando las imágenes a cada bloque en el HTML en el lugar correspondiente a partir del número de partidos
            let bloqueId = `bloque-${fase}-${numero}`; // Se define el id del HTML al que se va a llamar, concatenando la fase y número actuales. En el HTML es cada td de la tabla
            let bloque = document.getElementById(bloqueId); // Se almacena la llamada a ese bloque
            if (!bloque) continue; // Si el bloque no existiera, se salta lo de después y pasa al siguiente número

            // Esta parte es para evitar que duplique el contenido
            while (bloque.firstChild) {
                bloque.removeChild(bloque.firstChild) // Deja el td correspondiente sin elementos hijos
            }

            // Creación del elemento hijo con clase "partido" dentro de cada bloque (td)
            let partido = document.createElement('div') // Se crea el div
            partido.className = 'partido'; // Se asigna su clase
            partido.id = `partido-${fase}-${numero}`; // Se crea su id con la fase y número actuales


            // Creación de los elementos hijos (equipo) para anidarlos al elemento partido
            ['local', 'visitante'].forEach(tipo => { // Este forEach va a iterar por cada elemento actual (tipo) para anidar el div con el equipo correspondiente
                let equipo = document.createElement('div'); // Se crea el div
                equipo.className = 'equipo'; // Se asigna su clase
                let equipoId = `${fase}-${numero}-${tipo}`;  // Se crea su id usando la fase número y fase actuales
                equipo.id = equipoId; // Se asigna el id al elemento equipo


                // Rutas de las imágenes que tienen los nombres y los escudos de los equipos
                let nombreEquipo = datos[fase][`partido ${numero}`][tipo] ? datos[fase][`partido ${numero}`][tipo] : ""; // Se crea el nombre de un equipo, al que se asigna el valor si existiera dentro de la fase, equipo y tipo actuales. Si no, se deja un array vacío
                let rutaImagen = nombreEquipo && datos["rutas-img"][nombreEquipo] ? datos["rutas-img"][nombreEquipo] : 'sin-datos'; // Si hay nombre de equipo y datos dentro del objeto rutas-img del código con ese nombre de equipo, se asigna el nombre de ese valor (real-madrid, fc-barcelona, etc) a la variable rutaImagen. Si no, se llamará 'sin-datos' para que se asocie a una imagen que aparece por defecto que se llama así
                equipo.style.backgroundImage = `url('img/equipos/${rutaImagen}.png')`; // Se asigna al elemento equipo una imagen de fondo con que usa rutaImagen como nombre del archivo

                partido.appendChild(equipo); // Se anida al elemento partido el elemento equipo que hemos creado aquí
            });

            // Se anida al elemento partido el elemento detalles
            let detalles = document.createElement('div'); // Se crea el div
            detalles.className = 'detalles'; // Se asigna su clase
            detalles.id = `${fase}-${numero}-texto`;  // Se crea su id usando la fase y número actuales
            detalles.textContent = datos[fase][`partido ${numero}`] ? datos[fase][`partido ${numero}`].detalles : ''; // Si hay valor en la parte de detalles en el JSON, se introduce como texto en el div, si no se deja vacío

            // Se anida el elemento detalles al elemento partido 
            partido.appendChild(detalles);

            // Se anida el elemento partido al elemento bloque (td)
            bloque.appendChild(partido);
        }
    });
}
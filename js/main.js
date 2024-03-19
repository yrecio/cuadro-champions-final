document.addEventListener("DOMContentLoaded", () => {
    fetch('../json/partidos.json')
    .then(response => response.json())
    .then(datos => {
        inicializarUI(datos);
    })
    .catch(error => console.error('Error al cargar el JSON:', error));

    document.getElementById("descarga-imagen").addEventListener("click", function () {
        let grafico = document.querySelector('main');
        html2canvas(grafico, { scale: 4 }).then(canvas => {
            let enlace = document.createElement("a");
            enlace.href = canvas.toDataURL("image/jpg");
            enlace.download = "cuadro-champions.jpg";
            enlace.click();
        });
    });
});

function inicializarUI(datos) {
    crearElementosPartidos(datos);
    crearElementosDesplegables(datos);
    configurarManejadoresDeEventos(datos);
}

function crearElementosPartidos(datos) {
    ['cuartos', 'semifinales', 'final'].forEach(fase => {
        let numeroPartidos = Object.keys(datos[fase]).length;
        for (let numero = 1; numero <= numeroPartidos; numero++) {
            let bloqueId = `bloque-${fase}-${numero}`;
            let bloque = document.getElementById(bloqueId);
            if (!bloque) continue; // Si el bloque no existe, continúa con el siguiente.

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


function crearElementosDesplegables(datos) {
    // Asumiendo que tienes un objeto datos que incluye 'rutas-img' para los equipos y sus nombres.
    const equipos = Object.keys(datos["rutas-img"]);
    ['cuartos', 'semifinales', 'final'].forEach(fase => {
        const limite = fase === 'cuartos' ? 4 : (fase === 'semifinales' ? 2 : fase === 'final' ? 1 : 0);
        for (let numero = 1; numero <= limite; numero++) {
            const desplegables = document.getElementById(`desplegables-${fase}-${numero}`);
            if (!desplegables) continue; // Si no existe el elemento, continúa con el siguiente

            // Crea y añade el título y el separador
            const titulo = document.createElement('p');
            titulo.className = 'titulo-partido-panel';
            titulo.textContent = `${fase.charAt(0).toUpperCase() + fase.slice(1)} ${numero}`;
            desplegables.appendChild(titulo);
            desplegables.appendChild(document.createElement('hr'));

            // Crea los select para local y visitante
            ['local', 'visitante'].forEach(tipo => {
                const label = document.createElement('label');
                label.textContent = `${tipo.charAt(0).toUpperCase() + tipo.slice(1)}: `;
                desplegables.appendChild(label);

                const select = document.createElement('select');
                select.id = `elegir-${fase}-${numero}-${tipo}`;
                select.name = `elegir-${fase}-${numero}-${tipo}`;
                // Rellena el select con las opciones de equipos
                equipos.forEach(equipo => {
                    const option = document.createElement('option');
                    option.value = equipo;
                    option.textContent = equipo;
                    select.appendChild(option);
                });
                desplegables.appendChild(select);
            });

            // Crea y añade el textarea para detalles
            desplegables.appendChild(document.createElement('hr'));
            const labelTextarea = document.createElement('label');
            labelTextarea.textContent = 'Detalles: ';
            desplegables.appendChild(labelTextarea);

            const textarea = document.createElement('textarea');
            textarea.id = `detalles-${fase}-${numero}`;
            textarea.name = `detalles-${fase}-${numero}`;
            textarea.rows = '2';
            textarea.cols = '50';
            desplegables.appendChild(textarea);
        }
    });
}

function configurarManejadoresDeEventos(datos) {
    // Itera sobre cada fase y configura los manejadores de eventos para selects y textareas
    ['cuartos', 'semifinales', 'final'].forEach(fase => {
        const limite = fase === 'cuartos' ? 4 : fase === 'semifinales' ? 2 : 1; // Define el límite de partidos por fase
        
        for (let numero = 1; numero <= limite; numero++) {
            // Configura manejadores de eventos para selects de equipos
            ['local', 'visitante'].forEach(tipo => {
                const selectId = `elegir-${fase}-${numero}-${tipo}`;
                const select = document.getElementById(selectId);
                
                if (select) {
                    select.addEventListener('change', function() {
                        const seleccion = this.value; // Nombre del equipo seleccionado
                        const equipoId = `${fase}-${numero}-${tipo}`; // ID del div del equipo en el DOM
                        const equipoDiv = document.getElementById(equipoId);
                        
                        if (equipoDiv && datos["rutas-img"][seleccion]) {
                            equipoDiv.style.backgroundImage = `url('img/equipos/${datos["rutas-img"][seleccion]}.png')`;
                        }
                    });
                }
            });
            
            // Configura manejador de eventos para textarea de detalles del partido
            const textareaId = `detalles-${fase}-${numero}`;
            const textarea = document.getElementById(textareaId);
            
            if (textarea) {
                textarea.addEventListener('input', function() {
                    const detallesId = `${fase}-${numero}-texto`; // Aquí asumes el ID del div de detalles
                    const detallesDiv = document.getElementById(detallesId);
                    
                    if (detallesDiv) {
                        detallesDiv.textContent = this.value;
                    }
                });
            }
        }
    });
}






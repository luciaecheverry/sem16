document.addEventListener("DOMContentLoaded", function() {
    const preguntaTexto = document.getElementById('preguntaTexto');
    const opcionesContainer = document.getElementById('opcionesContainer');
    const nuevaPreguntaButton = document.getElementById('nuevaPreguntaButton');

    // Función para decodificar entidades HTML
    function decodeHTMLEntities(text) {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }

    // Función para obtener una pregunta de la API
    function obtenerPregunta() {
        fetch('https://opentdb.com/api.php?amount=1&type=multiple')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Datos recibidos de la API:', data);

                if (data.results && data.results.length > 0) {
                    const pregunta = data.results[0];
                    preguntaTexto.textContent = decodeHTMLEntities(pregunta.question);

                    // Limpiar opciones anteriores
                    opcionesContainer.innerHTML = '';

                    // Preparar y mostrar opciones
                    const opciones = [...pregunta.incorrect_answers, pregunta.correct_answer];
                    opciones.sort(() => Math.random() - 0.5);

                    opciones.forEach(opcion => {
                        const li = document.createElement('li');
                        li.textContent = decodeHTMLEntities(opcion);
                        li.addEventListener('click', () => {
                            if (opcion === pregunta.correct_answer) {
                                alert("¡Correcto!");
                            } else {
                                alert("Incorrecto. La respuesta correcta era: " + decodeHTMLEntities(pregunta.correct_answer));
                            }
                        });
                        opcionesContainer.appendChild(li);
                    });
                } else {
                    preguntaTexto.textContent = 'No se pudo obtener una pregunta, intenta de nuevo.';
                }
            })
            .catch(error => {
                console.error('Error al obtener la pregunta:', error);
                preguntaTexto.textContent = 'Hubo un problema al obtener la pregunta.';
            });
    }

    // Evento para cargar una nueva pregunta al hacer clic en el botón
    nuevaPreguntaButton.addEventListener('click', obtenerPregunta);

    // Llama a obtenerPregunta para cargar una pregunta al iniciar la página
    obtenerPregunta();
});


	/*SCRIPT DEL JUEGO ONE PIECEDLE KAIZOKUODLE
	*
	*/
	const sheetID = '1OJVVupqt0UJTB8QJKLH_UNYYaWtY41ekqpZBSlpFdxQ';
	const apiKey = 'AIzaSyAiIS758bKjVHSvAN9Ub__7dSQOWbWSLfQ';
	let dificultad = 'facil';	
	const sheetsNames = {
		facil: 'Fácil',
		medio: 'Medio',
		dificil: 'Difícil',
		imposible: 'Imposible'
	};

	let personajes = [];
	let personajeAleatorio = null;

	// Cargar los datos de la hoja seleccionada
	async function cargarDatos(dificultad) {
		const sheetURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetsNames[dificultad]}?key=${apiKey}`;

		try {
		const response = await fetch(sheetURL);
		const data = await response.json();

		if (data && data.values) {
		personajes = data.values.slice(1);
		personajeAleatorio = personajes[Math.floor(Math.random() * personajes.length)];
		mostrarBusqueda();
		} else {
		alert("Error al cargar los datos.");
		}
		} catch (error) {
		alert("Hubo un problema al cargar los datos.");
		}
	}
	// Mostrar la sección de búsqueda
	function mostrarBusqueda() {
		$('#busqueda-section').show();
		$('#resultado-comparacion').hide();
		$('#mensaje-felicidades').hide();
		$('#comparacion-cuerpo').empty();
	}

	// Función para normalizar texto eliminando tildes y caracteres especiales
	function normalizarTexto(texto) {
		return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
	}

	// Función para dividir la entrada en palabras y verificar si cada palabra aparece en el nombre
	function buscarPorPalabras(nombre, input) {
		const palabrasBusqueda = input.split(' ').map(palabra => normalizarTexto(palabra));
		const nombreNormalizado = normalizarTexto(nombre);

		// Verifica si todas las palabras de la búsqueda están presentes en el nombre
		return palabrasBusqueda.every(palabra => nombreNormalizado.includes(palabra));
	}

	// Función para filtrar personajes y manejar el comportamiento al escribir
	// Función optimizada para filtrar personajes
	function filtrarPersonajes(event) {
		const inputRaw = $('#busqueda').val();
		if (inputRaw === '') {
			mostrarSugerencias(personajes.slice(0, 10));
			return;
		}

		const input = normalizarTexto(inputRaw); // Normalizar solo una vez
		let resultados = personajes.filter(personaje => buscarPorPalabras(personaje[0], input));

		mostrarSugerencias(resultados);

		// Selección automática si solo hay un resultado y se presiona Enter
		if (resultados.length === 1 && event.key === "Enter") {
			seleccionarPersonaje(resultados[0][0]);
		}
	}

	// Función para seleccionar personaje con Enter
	$('#busqueda').on('keydown', function(event) {
            if (event.key === "Enter") {
		const input = normalizarTexto($('#busqueda').val());
    
		// Buscar un personaje con nombre exacto
		const personajeSeleccionado = personajes.find(p => normalizarTexto(p[0]) === input);

		// Si se encuentra una coincidencia exacta, seleccionarlo
		if (personajeSeleccionado) {
		seleccionarPersonaje(personajeSeleccionado[0]);
		} else {
		// Si no hay coincidencia exacta, buscar como antes con "includes"
		const personajeParcial = personajes.find(p => buscarPorPalabras(p[0], input));
		if (personajeParcial) {
		seleccionarPersonaje(personajeParcial[0]);
		}
		}
	}
	});

	// Mostrar las sugerencias en un dropdown debajo de la barra de búsqueda
	function mostrarSugerencias(resultados) {
		const listaSugerencias = $('#autocomplete-list');
		listaSugerencias.empty(); 

		// Agregar cada sugerencia como un item del dropdown
		resultados.forEach(personaje => {
		const item = $('<div class="autocomplete-item"></div>');
		item.text(personaje[0]);
		item.click(function() {
		seleccionarPersonaje(personaje[0]);
		});
		listaSugerencias.append(item);
		});
	}

	// Seleccionar un personaje
	function seleccionarPersonaje(nombre) {
		const personajeSeleccionado = personajes.find(p => p[0] === nombre);
		if (personajeSeleccionado) {
		$('#resultado-comparacion').show();
		compararPersonajes(personajeSeleccionado);
		$('#autocomplete-list').empty();
		$('#busqueda').val('');
		}
	}
	
	// Comparar el personaje seleccionado con el personaje aleatorio
	function compararPersonajes(personajeSeleccionado) {
		const comparacionCuerpo = $('#comparacion-cuerpo'); // 💡 Agregar esta línea

		const columnas = ["Nombre", "Primera Aparición", "Saga", "Arco", "Estado", "Origen", "Raza", "Sexo", "Altura", "Edad", "Cumpleaños", "Fruta del Diablo", "Haki", "Recompensa", "Afiliación", "Ocupación"];
		const filaComparacion = [];
		columnas.forEach((col, index) => {
			const comparacionCuerpo = $('#comparacion-cuerpo');
		
			let valorAleatorio = personajeAleatorio[index] ? String(personajeAleatorio[index]) : "";
			let valorSeleccionado = personajeSeleccionado[index] ? String(personajeSeleccionado[index]) : "";
			let clase = "incorrecto";
			let flecha = "";

			//COMPROBACIÓN TEXTOS
			if(index === 0 || index === 2 || index === 3 || index === 4 || index === 5 || index === 6 || index === 7 || index === 11 || index === 12 || index === 14 ) {
				const normalizarTexto = (texto) => texto.trim().toLowerCase();
				valorAleatorio = valorAleatorio ? String(valorAleatorio) : "";
				valorSeleccionado = valorSeleccionado ? String(valorSeleccionado) : "";
				if (normalizarTexto(valorAleatorio) === normalizarTexto(valorSeleccionado)) {
					clase = "correcto";
				} else if ((index === 11 || index === 12 ) && (valorAleatorio.toLowerCase().includes(valorSeleccionado.toLowerCase()) ||  valorSeleccionado.toLowerCase().includes(valorAleatorio.toLowerCase()))) {
					clase = "parcial";
				} else {
					clase = "incorrecto";
				}	
			}

			//COMPROBACIÓN OCUPACIÓN
			if(index === 15) {
				valorAleatorio = valorAleatorio ? String(valorAleatorio) : "";
				valorSeleccionado = valorSeleccionado ? String(valorSeleccionado) : "";
				let normalizarLista = (texto) => texto
					.split(',')
					.map(word => word.trim().toLowerCase())
					.sort();
				let palabrasAleatorias = normalizarLista(valorAleatorio);
				let palabrasSeleccionadas = normalizarLista(valorSeleccionado);

				if (JSON.stringify(palabrasAleatorias) === JSON.stringify(palabrasSeleccionadas)) {
					clase = "correcto";
				} else if (palabrasSeleccionadas.some(palabra => palabrasAleatorias.includes(palabra))) {
					clase = "parcial";
				} else {
					clase = "incorrecto";
				}
			}

			// Agregar flecha para columnas numéricas
			if ([1, 8, 9, 13].includes(index)) {
				// Manejo de "---"
				if (valorAleatorio === valorSeleccionado){
					clase = "correcto";
				}else if (valorAleatorio === "---" && valorSeleccionado !== "---") {
					clase = "incorrecto";
					flecha = '↓';
				} else if (valorAleatorio !== "---" && valorSeleccionado === "---") {
					clase = "incorrecto";
					flecha = '↑';
				} else {
					const valorAleatorioNumerico = parseFloat(valorAleatorio);
					const valorSeleccionadoNumerico = parseFloat(valorSeleccionado);
					
					if (!isNaN(valorAleatorioNumerico) && !isNaN(valorSeleccionadoNumerico)) {
						if (valorSeleccionadoNumerico === valorAleatorioNumerico) {
							clase = "correcto";
						} else if (valorSeleccionadoNumerico > valorAleatorioNumerico) {
							flecha = '↓';
							clase = "incorrecto";
						} else if (valorSeleccionadoNumerico < valorAleatorioNumerico) {
							flecha = '↑';
							clase = "incorrecto";
						}
					}
				}
			}
		/*	if (index === 1 || index === 8 || index === 9 || index === 13) {
				const valorAleatorioNumerico = parseFloat(valorAleatorio.replace(/[^0-9.-]/g, ''));
				const valorSeleccionadoNumerico = parseFloat(valorSeleccionado.replace(/[^0-9.-]/g, ''));


				if (valorAleatorio === "---" && valorSeleccionado !== "---") {
					flecha = '↓'; 
				} else if (valorAleatorio !== "---" && valorSeleccionado === "---") {
					flecha = '↑'; 
				}
				// Comprobamos si ambos valores son números
				if (!isNaN(valorAleatorioNumerico) && !isNaN(valorSeleccionadoNumerico)) {
					if (valorSeleccionadoNumerico > valorAleatorioNumerico) {
					flecha = '↓';
					} else if (valorSeleccionadoNumerico < valorAleatorioNumerico) {
					flecha = '↑'; 
					}
				}  
			}
*/
			if (index === 10) {
				
				if(valorAleatorio === "---" && valorSeleccionado !== "---"){
					clase = "correcto";
				} else if (valorAleatorio === "---" && valorSeleccionado !== "---") {
					flecha = '↓'; 
				} else if (valorAleatorio !== "---" && valorSeleccionado === "---") {
					flecha = '↑'; 
				}
				// Verificación tengan el formato "día mes"
				if ((valorAleatorio.includes(" ") && valorSeleccionado.includes(" ")) && clase !== "correcto") {
					const [diaAleatorio, mesAleatorio] = valorAleatorio.split(" ");
					const [diaSeleccionado, mesSeleccionado] = valorSeleccionado.split(" ");
					const diaAleatorioNum = parseInt(diaAleatorio, 10);
					const diaSeleccionadoNum = parseInt(diaSeleccionado, 10);

					// Array para convertir el mes a número
					const mesesOrden = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
					const mesAleatorioNum = mesesOrden.indexOf(mesAleatorio);
					const mesSeleccionadoNum = mesesOrden.indexOf(mesSeleccionado);

					// Creamos objetos Date para comparar
					const fechaCorrecta = new Date(2025, mesAleatorioNum, diaAleatorioNum);
					const fechaSeleccionada = new Date(2025, mesSeleccionadoNum, diaSeleccionadoNum);

					// Determinamos la flecha comparando las fechas completas
					if (fechaSeleccionada.getTime() > fechaCorrecta.getTime()) {
					flecha = '↓';
					} else if (fechaSeleccionada.getTime() < fechaCorrecta.getTime()) {
					flecha = '↑';
					}
					// Asignar la clase según coincidencia de día y mes:
					if (diaAleatorioNum === diaSeleccionadoNum && mesAleatorioNum === mesSeleccionadoNum) {
						clase = "correcto";
					} else if (diaAleatorioNum === diaSeleccionadoNum || mesAleatorioNum === mesSeleccionadoNum) {
						clase = "parcial";
					} else {
						clase = "incorrecto";
					}
				}
			}
			
			if (index === 12 || index === 14 || index === 15) {
				filaComparacion.push(`<td class="texto-ajustado ${clase}">${valorSeleccionado.replace(/,/g, "<br>")} ${flecha}</td>`);
			}else if (index === 0) {
				filaComparacion.push(`<td class="texto-ajustado ${clase}">${valorSeleccionado.replace(/\//g, "<br>")} ${flecha}</td>`);
			}else{
				filaComparacion.push(`<td class="texto-ajustado ${clase}">${valorSeleccionado} ${flecha}</td>`);
			}
		});

		comparacionCuerpo.prepend(`<tr>${filaComparacion.join("")}</tr>`);

		//Mensaje de éxito
		const adivinados = $('#comparacion-cuerpo tr:first-child td.correcto').length;
		if (adivinados === columnas.length) {
			$('#mensaje-felicidades').show().html('<span>¡Felicidades! Has adivinado al personaje: ' + personajeAleatorio[0] + '</span>');
			$('#busqueda').prop('disabled', true);
			$('#autocomplete-list').empty();
		}
	}

	//Mensaje de Rendirse
	function mostrarPersonajeCorrecto() {
		$('#mensaje-felicidades').show().html('<span>El personaje era ' + personajeAleatorio[0] + ', más suerte a la próxima.</span>');
		$('#busqueda').prop('disabled', true); 
		$('#autocomplete-list').empty();
	}

	// Configurar dificultad
	$('#facil').click(function() {
		dificultad = 'facil';
		cargarDatos('facil');
		reiniciarJuego(); 
	});
	$('#medio').click(function() {
		dificultad = 'medio';
		cargarDatos('medio');
		reiniciarJuego();
	});
	$('#dificil').click(function() {
		dificultad = 'dificil';
		cargarDatos('dificil');
              reiniciarJuego();
	});
	$('#imposible').click(function() {
		dificultad = 'imposible';
		cargarDatos('imposible');
              reiniciarJuego();
	});

	// Reiniciar el juego
	function reiniciarJuego() {
		$('#mensaje-felicidades').hide();
		$('#busqueda').prop('disabled', false);
		$('#busqueda').val('');
		$('#autocomplete-list').empty();
		$('#resultado-comparacion').hide();
		$('#comparacion-cuerpo').empty();
		cargarDatos(dificultad);
	}

	// Reiniciar el juego al presionar un botón
	$('#reiniciar').click(function() {
		reiniciarJuego();
	});
	
	//AVISOS
	const webhookURL = "https://script.google.com/macros/s/AKfycbwKOAdoyT9Ld8kFZgAkSM8JgAb2n14pQ1c52R-FbVzAAXOgnoijkMPjN_jO_dfdkBPQeg/exec";

	// Mostrar el modal
	document.getElementById("btn-aviso").addEventListener("click", function() {
		document.getElementById("modal-aviso").style.display = "block";
	});

	// Cerrar el modal
	function cerrarModal() {
		document.getElementById("modal-aviso").style.display = "none";
	}
	
	// Enviar aviso
	function enviarAviso() {
		// Obtener los valores del formulario
		var personaje = document.getElementById('nombre-personaje').value;
		var fallo = document.getElementById('descripcion-fallo').value;

		// Validar que los campos no estén vacíos
		if (personaje.trim() === "" || fallo.trim() === "") {
			alert("Por favor, rellena todos los campos.");
			return;
		}

		// Enviar los datos a Google Apps Script usando fetch
		fetch('https://script.google.com/macros/s/AKfycbzBj20YZ95Tii1zYRKnpjiy3JQFMjNisyHKSWPcG2RQ_6k5qGTyWJiqnC_53AECdQHH/exec', {
			method: 'POST',
			body: new URLSearchParams({
				'personaje': personaje,
				'fallo': fallo
			}),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		})
		.then(response => response.text())
		.then(data => {
			alert("Aviso enviado correctamente.");
		})
		.catch(error => {
			alert("Hubo un problema al enviar el aviso.");
		});
		cerrarModal();
	}
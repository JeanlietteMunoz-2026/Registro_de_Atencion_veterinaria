let mascotas = [];
let filtroActual = "Todos";
let indiceBusquedaActual = -1;

const formulario = document.querySelector("#formMascota");
const botonRegistrar = document.getElementById("btnRegistrar");
const mensajeValidacion = document.getElementById("mensajeValidacion");
const mensajeFiltro = document.getElementById("mensajeFiltro");
const listaMascotas = document.getElementById("listaMascotas");
const inputBusqueda = document.getElementById("buscarMascota");
const botonBuscar = document.getElementById("btnBuscar");
const resultadoBusqueda = document.getElementById("resultadoBusqueda");
const botonesFiltro = document.querySelectorAll(".filtro-btn");

function obtenerDatosMascota() {
  const nombre = document.getElementById("nombreMascota").value;
  const especie = document.getElementById("especieMascota").value;
  const propietario = document.getElementById("propietarioMascota").value;
  const edadTexto = document.getElementById("edadMascota").value;
  const estado = document.getElementById("estadoMascota").value;

  return {
    nombre: nombre,
    especie: especie,
    propietario: propietario,
    edadTexto: edadTexto,
    estado: estado
  };
}

function validarFormulario() {
  const datos = obtenerDatosMascota();
  return validarDatosMascota(datos.nombre, datos.especie, datos.propietario, datos.edadTexto, datos.estado);
}

function validarDatosMascota(nombre, especie, propietario, edadTexto, estado) {
  const nombreTrim = nombre.trim();
  const especieTrim = especie.trim();
  const propietarioTrim = propietario.trim();
  const edad = Number(edadTexto);

  if (nombre === "" || especie === "" || propietario === "" || edadTexto === "") {
    mostrarMensaje("Todos los campos son obligatorios.", "error");
    return null;
  }

  if (nombreTrim !== nombre || especieTrim !== especie || propietarioTrim !== propietario) {
    mostrarMensaje("No se permiten espacios al inicio o al final del texto.", "error");
    return null;
  }

  if (nombreTrim.length < 2) {
    mostrarMensaje("El nombre de la mascota debe tener al menos 2 caracteres.", "error");
    return null;
  }

  if (Number.isNaN(edad) || edad <= 0) {
    mostrarMensaje("La edad debe ser un número positivo.", "error");
    return null;
  }

  if (!["Pendiente", "En Atención", "De Alta"].includes(estado)) {
    mostrarMensaje("Selecciona un estado válido.", "error");
    return null;
  }

  return {
    nombre: nombreTrim,
    especie: especieTrim,
    propietario: propietarioTrim,
    edad: edad,
    estado: estado,
    atendido: estado !== "Pendiente"
  };
}

function registrarMascota() {
  const mascota = validarFormulario();

  if (mascota === null) {
    return;
  }

  mascotas.push(mascota);
  limpiarFormulario();
  mostrarMascotas();
  actualizarEstadisticas();
  mostrarMensaje("Mascota registrada correctamente.", "success");
}

function obtenerMascotasFiltradas() {
  if (filtroActual === "Todos") {
    return mascotas;
  }

  return mascotas.filter((mascota) => mascota.estado === filtroActual);
}

function mostrarMascotas() {
  listaMascotas.innerHTML = "";

  const mascotasFiltradas = obtenerMascotasFiltradas();

  if (mascotasFiltradas.length === 0) {
    mensajeFiltro.textContent = "No hay mascotas registradas para este filtro.";
    mensajeFiltro.className = "mensaje error";
    listaMascotas.innerHTML = "";
    return;
  }

  mensajeFiltro.textContent = "";
  mensajeFiltro.className = "mensaje";

  for (const mascota of mascotasFiltradas) {
    const index = mascotas.indexOf(mascota);
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("mascota");

    if (mascota.estado === "De Alta") {
      tarjeta.classList.add("atendido");
    }

    const contenido = document.createElement("div");
    contenido.innerHTML = `
      <p><strong>Nombre:</strong> ${mascota.nombre}</p>
      <p><strong>Especie:</strong> ${mascota.especie}</p>
      <p><strong>Propietario:</strong> ${mascota.propietario}</p>
      <p><strong>Edad:</strong> ${mascota.edad}</p>
      <p class="estado"><strong>Estado:</strong> ${mascota.estado}</p>
    `;

    const botonEstado = document.createElement("button");
    botonEstado.textContent = "Cambiar estado";
    botonEstado.addEventListener("click", function () {
      cambiarEstado(index);
    });

    tarjeta.appendChild(contenido);
    tarjeta.appendChild(botonEstado);
    listaMascotas.appendChild(tarjeta);
  }
}

function cambiarEstado(index) {
  if (index >= 0 && index < mascotas.length) {
    const mascota = mascotas[index];

    if (mascota.estado === "Pendiente") {
      mascota.estado = "En Atención";
      mascota.atendido = true;
    } else if (mascota.estado === "En Atención") {
      mascota.estado = "De Alta";
      mascota.atendido = true;
    } else {
      mascota.estado = "Pendiente";
      mascota.atendido = false;
    }

    mostrarMascotas();
    actualizarEstadisticas();
    mostrarMensaje(`Estado de ${mascota.nombre} actualizado.`, "success");
  }
}

function actualizarEstadisticas() {
  let pendientes = 0;
  let atendidas = 0;

  mascotas.forEach((mascota) => {
    if (mascota.estado === "Pendiente") {
      pendientes += 1;
    } else {
      atendidas += 1;
    }
  });

  document.getElementById("totalMascotas").textContent = `Total de mascotas registradas: ${mascotas.length}`;
  document.getElementById("mascotasPendientes").textContent = `Mascotas pendientes: ${pendientes}`;
  document.getElementById("mascotasAtendidas").textContent = `Mascotas atendidas: ${atendidas}`;
}

function mostrarMensaje(texto, tipo) {
  mensajeValidacion.textContent = texto;
  mensajeValidacion.className = `mensaje ${tipo}`;
}

function limpiarFormulario() {
  document.getElementById("nombreMascota").value = "";
  document.getElementById("especieMascota").value = "";
  document.getElementById("propietarioMascota").value = "";
  document.getElementById("edadMascota").value = "";
  document.getElementById("estadoMascota").value = "Pendiente";
}

function buscarMascotaPorNombre() {
  const termino = inputBusqueda.value.trim().toLowerCase();

  if (termino === "") {
    resultadoBusqueda.innerHTML = "";
    mostrarMensaje("Ingresa un nombre para buscar una mascota.", "error");
    return;
  }

  const mascotaEncontrada = mascotas.find((mascota) => mascota.nombre.toLowerCase() === termino);

  if (!mascotaEncontrada) {
    resultadoBusqueda.innerHTML = "";
    mostrarMensaje("No se encontró ninguna mascota con ese nombre.", "error");
    return;
  }

  indiceBusquedaActual = mascotas.indexOf(mascotaEncontrada);
  mostrarFichaEdicion(mascotaEncontrada, indiceBusquedaActual);
  mostrarMensaje("Se mostró la ficha de edición de la mascota buscada.", "success");
}

function mostrarFichaEdicion(mascota, index) {
  resultadoBusqueda.innerHTML = "";

  const tituloResultado = document.createElement("h3");
  tituloResultado.textContent = "Resultado de búsqueda";
  resultadoBusqueda.appendChild(tituloResultado);

  const ficha = document.createElement("article");
  ficha.className = "ficha-edicion";

  const titulo = document.createElement("h3");
  titulo.textContent = "Ficha de edición";
  ficha.appendChild(titulo);

  const nombreInput = document.createElement("input");
  nombreInput.id = "editNombre";
  nombreInput.value = mascota.nombre;
  ficha.appendChild(crearCampo("Nombre", nombreInput));

  const especieInput = document.createElement("input");
  especieInput.id = "editEspecie";
  especieInput.value = mascota.especie;
  ficha.appendChild(crearCampo("Especie", especieInput));

  const propietarioInput = document.createElement("input");
  propietarioInput.id = "editPropietario";
  propietarioInput.value = mascota.propietario;
  ficha.appendChild(crearCampo("Propietario", propietarioInput));

  const edadInput = document.createElement("input");
  edadInput.id = "editEdad";
  edadInput.type = "number";
  edadInput.value = mascota.edad;
  ficha.appendChild(crearCampo("Edad", edadInput));

  const estadoSelect = document.createElement("select");
  estadoSelect.id = "editEstado";
  ["Pendiente", "En Atención", "De Alta"].forEach((estado) => {
    const opcion = document.createElement("option");
    opcion.value = estado;
    opcion.textContent = estado;
    if (estado === mascota.estado) {
      opcion.selected = true;
    }
    estadoSelect.appendChild(opcion);
  });
  ficha.appendChild(crearCampo("Estado", estadoSelect));

  const acciones = document.createElement("div");
  acciones.className = "acciones";

  const botonGuardar = document.createElement("button");
  botonGuardar.textContent = "Guardar cambios";
  botonGuardar.addEventListener("click", function () {
    guardarEdicion(index);
  });

  const botonEliminar = document.createElement("button");
  botonEliminar.textContent = "Eliminar mascota";
  botonEliminar.addEventListener("click", function () {
    eliminarMascota(index);
  });

  acciones.appendChild(botonGuardar);
  acciones.appendChild(botonEliminar);
  ficha.appendChild(acciones);
  resultadoBusqueda.appendChild(ficha);
}

function crearCampo(labelText, inputElement) {
  const label = document.createElement("label");
  label.textContent = labelText;
  label.appendChild(inputElement);
  return label;
}

function guardarEdicion(index) {
  if (index < 0 || index >= mascotas.length) {
    return;
  }

  const nombre = document.getElementById("editNombre").value;
  const especie = document.getElementById("editEspecie").value;
  const propietario = document.getElementById("editPropietario").value;
  const edadTexto = document.getElementById("editEdad").value;
  const estado = document.getElementById("editEstado").value;

  const datosValidados = validarDatosMascota(nombre, especie, propietario, edadTexto, estado);

  if (datosValidados === null) {
    return;
  }

  mascotas[index] = {
    ...mascotas[index],
    nombre: datosValidados.nombre,
    especie: datosValidados.especie,
    propietario: datosValidados.propietario,
    edad: datosValidados.edad,
    estado: datosValidados.estado,
    atendido: datosValidados.estado !== "Pendiente"
  };

  mostrarMascotas();
  actualizarEstadisticas();
  mostrarFichaEdicion(mascotas[index], index);
  mostrarMensaje("Cambios guardados correctamente.", "success");
}

function eliminarMascota(index) {
  if (index >= 0 && index < mascotas.length) {
    mascotas.splice(index, 1);
    mostrarMascotas();
    actualizarEstadisticas();
    resultadoBusqueda.innerHTML = "";
    mostrarMensaje("Mascota eliminada correctamente.", "success");
  }
}

function cambiarFiltro(nuevoFiltro) {
  filtroActual = nuevoFiltro;
  document.querySelectorAll(".filtro-btn").forEach((boton) => {
    boton.classList.toggle("activo", boton.dataset.filtro === nuevoFiltro);
  });
  mostrarMascotas();
}

botonRegistrar.addEventListener("click", registrarMascota);
botonBuscar.addEventListener("click", buscarMascotaPorNombre);

inputBusqueda.addEventListener("keydown", function (evento) {
  if (evento.key === "Enter") {
    evento.preventDefault();
    buscarMascotaPorNombre();
  }
});

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();
  registrarMascota();
});

botonesFiltro.forEach((boton) => {
  boton.addEventListener("click", function () {
    cambiarFiltro(boton.dataset.filtro);
  });
});

mostrarMascotas();
actualizarEstadisticas();
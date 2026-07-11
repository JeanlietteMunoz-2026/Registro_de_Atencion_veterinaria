let productos = [];

function obtenerDatosProducto() {
    let nombre = document.getElementById("nombreProducto").value.trim();
    let precio = Number(document.getElementById("precioProducto").value);
    let cantidad = Number(document.getElementById("cantidadProducto").value);

    return {
        nombre: nombre,
        precio: precio,
        cantidad: cantidad
    };
}

function validarProducto(producto) {
    if (producto.nombre === "") {
        return "Debe ingresar el nombre del producto.";
    }

    if (producto.precio <= 0 || isNaN(producto.precio)) {
        return "El precio debe ser mayor a 0.";
    }

    if (producto.cantidad <= 0 || isNaN(producto.cantidad)) {
        return "La cantidad debe ser mayor a 0.";
    }

    return "";
}

function agregarProducto() {
    let producto = obtenerDatosProducto();
    let error = validarProducto(producto);

    if (error !== "") {
        mostrarMensaje(error);
        return;
    }

    productos.push(producto);

    limpiarFormulario();
    mostrarMensaje("Producto agregado correctamente.");
    mostrarProductos();
    calcularTotalInventario();
}

function mostrarProductos() {
    let lista = document.getElementById("listaProductos");
    lista.innerHTML = "";

    productos.forEach((producto, index) => {
        let item = document.createElement("li");

        item.textContent = producto.nombre + 
            " | Precio: $" + producto.precio + 
            " | Cantidad: " + producto.cantidad;

        let botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";

        botonEliminar.addEventListener("click", function() {
            eliminarProducto(index);
        });

        item.appendChild(botonEliminar);
        lista.appendChild(item);
    });
}

function eliminarProducto(index) {
    productos.splice(index, 1);
    mostrarMensaje("Producto eliminado.");
    mostrarProductos();
    calcularTotalInventario();
}

function calcularTotalInventario() {
    let total = 0;

    productos.forEach(producto => {
        total += producto.precio * producto.cantidad;
    });

    document.getElementById("totalInventario").textContent =
        "Total inventario: $" + total;
}

function mostrarMensaje(texto) {
    document.getElementById("mensaje").textContent = texto;
}

function limpiarFormulario() {
    document.getElementById("nombreProducto").value = "";
    document.getElementById("precioProducto").value = "";
    document.getElementById("cantidadProducto").value = "";
}

document.getElementById("btnAgregar").addEventListener("click", agregarProducto);
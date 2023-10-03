/* let carrito = [];
let total = 0;

function agregarAlCarrito(producto, precio) {
  carrito.push({ producto, precio });
  total += precio;
  actualizarCarrito();
}

function actualizarCarrito() {
  const carritoLista = document.getElementById("carrito-lista");
  const totalElement = document.getElementById("total");
  carritoLista.innerHTML = "";
  carrito.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.innerText = `${item.producto} - $${item.precio}`;
    carritoLista.appendChild(listItem);
  });
  totalElement.innerText = total;
}
 */

/* 
const productosContainer = document.getElementById("productos-container");
const carritoLista = document.getElementById("carrito-lista");
const totalElement = document.getElementById("total");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

function cargarProductos() {
  fetch("./productos.json")
    .then((response) => response.json())
    .then((productos) => {
      productosContainer.innerHTML = "";
      productos.forEach((producto) => {
        const productoDiv = document.createElement("div");
        productoDiv.className = "producto";
        productoDiv.innerHTML = `
                    <img src="producto${producto.id}.jpg" alt="${producto.nombre}">
                    <p>${producto.nombre} - $${producto.precio}</p>
                    <input type="number" min="1" value="1" id="cantidad-${producto.id}">
                    <button class="agregar-btn" onclick="agregarAlCarrito(${producto.id}, '${producto.nombre}', ${producto.precio})">Agregar al carrito</button>
                `;
        productosContainer.appendChild(productoDiv);
      });
    });
}

function agregarAlCarrito(id, nombre, precio) {
  const cantidad = parseInt(document.getElementById(`cantidad-${id}`).value);
  const productoExistente = carrito.find((item) => item.id === id);
  if (productoExistente) {
    productoExistente.cantidad += cantidad;
  } else {
    carrito.push({ id, nombre, precio, cantidad });
  }
  total += precio * cantidad;
  actualizarCarrito();
}

function eliminarDelCarrito(id) {
  const productoIndex = carrito.findIndex((item) => item.id === id);
  if (productoIndex !== -1) {
    total -= carrito[productoIndex].precio * carrito[productoIndex].cantidad;
    carrito.splice(productoIndex, 1);
    actualizarCarrito();
  }
}

function actualizarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  carritoLista.innerHTML = "";
  carrito.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
            ${item.nombre} - $${item.precio} x ${item.cantidad}
            <button class="eliminar-btn" onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
        `;
    carritoLista.appendChild(listItem);
  });
  totalElement.innerText = total;
}

window.onload = cargarProductos; */

class Producto {
  constructor(id, nombre, precio) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
  }
}

class Carrito {
  constructor() {
    this.productos = [];
    this.total = 0;
  }

  agregarProducto(producto, cantidad) {
    const productoExistente = this.productos.find(
      (item) => item.id === producto.id
    );
    if (productoExistente) {
      productoExistente.cantidad += cantidad;
    } else {
      this.productos.push({ ...producto, cantidad });
    }
    this.calcularTotal();
  }

  eliminarProducto(id) {
    const productoIndex = this.productos.findIndex((item) => item.id === id);
    if (productoIndex !== -1) {
      this.total -=
        this.productos[productoIndex].precio *
        this.productos[productoIndex].cantidad;
      this.productos.splice(productoIndex, 1);
      this.calcularTotal();
    }
  }

  calcularTotal() {
    this.total = this.productos.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    );
    this.actualizarCarrito();
  }

  actualizarCarrito() {
    const carritoLista = document.getElementById("carrito-lista");
    const totalElement = document.getElementById("total");
    carritoLista.innerHTML = "";
    this.productos.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
            ${item.nombre} - $${item.precio} x ${item.cantidad}
            <button class="eliminar-btn" data-id="${item.id}">Eliminar</button>
        `;
      carritoLista.appendChild(listItem);
    });
    totalElement.innerText = this.total.toFixed(2);
    localStorage.setItem("carrito", JSON.stringify(this.productos));
  }
}

function cargarProductos() {
  fetch("./productos.json")
    .then((response) => response.json())
    .then((productos) => {
      const productosContainer = document.getElementById("productos-container");
      productosContainer.innerHTML = "";
      productos.forEach((producto) => {
        const productoDiv = document.createElement("div");
        productoDiv.className = "producto";
        productoDiv.innerHTML = `
                  <img src="producto${producto.id}.jpg" alt="${producto.nombre}">
                  <p>${producto.nombre} - $${producto.precio}</p>
                  <input type="number" min="1" value="1" id="cantidad-${producto.id}">
                  <button class="agregar-btn" data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${producto.precio}">Agregar al carrito</button>
              `;
        productosContainer.appendChild(productoDiv);
      });
    });
}

window.onload = function () {
  const carrito = new Carrito();
  cargarProductos(); // Cargar productos al cargar la página

  // Asociar eventos a los botones de agregar y eliminar productos
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("agregar-btn")) {
      const productoId = parseInt(event.target.dataset.id);
      const productoNombre = event.target.dataset.nombre;
      const productoPrecio = parseFloat(event.target.dataset.precio);
      const cantidad = parseInt(
        document.getElementById(`cantidad-${productoId}`).value
      );
      const producto = new Producto(productoId, productoNombre, productoPrecio);
      carrito.agregarProducto(producto, cantidad);
    }

    if (event.target.classList.contains("eliminar-btn")) {
      const productoId = parseInt(event.target.dataset.id);
      carrito.eliminarProducto(productoId);
    }
  });
};

// Llamo a los contenedores y los dejo disponibles de forma global
const contenedor = document.getElementById("contenedor");
const contenedor1 = document.getElementById("contenedor1");
const contenidoDelCarrito = document.getElementById("contenidoCarrito");
const precioTotal = document.getElementById("totalCompra");
const agregados = document.getElementById("agregados");
const botonCarrito = document.getElementById("botonDelCarrito");
const cerrarModal = document.getElementById("cerrar");
cerrarModal.addEventListener("click", () => {
  location.reload();
});
//en este array guardo mis prod agregados al carrito
let productosSeleccionados = [];

//console.log(productosSeleccionados+"---->test");

//aca traigo la data de los productos

fetch("https://github.com/AleBa86/entregaFinalJs43070BaezAlejandro/blob/6b97c4355b8eea3b81639f831468057b87156332/data.json")
  .then((res) => res.json())
  .then((json) => {
    //recorro el arreglo
    for (const producto of json) {
      //creo y asigno un id a mis cards, para despues modifica el css
      let divProd = document.createElement("div");
      divProd.setAttribute("id", "cards");
      //armo la card con la data q quiero mostrar
      divProd.innerHTML = `
                                            <h2>${producto.nombre}<h2/>
                                            <img class="card-img-top" src = ${producto.img}></img>
                                            <h5>Precio $ ${producto.precio}</h5>
                                            <button class="btn btn-outline-success mb-2" id="agregar${producto.id}">Agregar al carrito</button>
                                            `;
      //asigno la clase de bs para q quede en 3 cols
      divProd.className =
        "col-4 m-1 card d-flex justify-content-between align-items-center ";
      // renderizo
      contenedor.appendChild(divProd);
      //agrego eventListener para click en boton agregar
      let botonAgregar = document.getElementById(`agregar${producto.id}`);
      botonAgregar.addEventListener("click", () => {
        //agregue timeout, xq necesito refrescar y al refrescar, no se muestra el tosty, con el timeOut, se llega a ver la tosty =)
        setTimeout('document.location.reload()',300)
      //llamo a toastify
        console.log(botonAgregar.id);
        Toastify({
          text: `Agregaste ${producto.nombre}`,
          duration: 2000,
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: true,
          gravity: "top",
          position: "left",
          stopOnFocus: true,
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
          onClick: function () {},
        }).showToast();
        //llamo la funcion que guarda el objeto
        const evaluarCantidades = productosSeleccionados.some((repetidos) => repetidos.id === producto.id);
        if(evaluarCantidades){
          productosSeleccionados.map((produ)=> {
            if(produ.id === producto.id){
              produ.stock++;
            }
          });
        }else{
        agregadosAlCarrito(
          producto.id,
          producto.nombre,
          producto.precio,
          producto.img,
          producto.stock
        );
        }
        localStorage.setItem("carrito", JSON.stringify(productosSeleccionados));
        
      });
      
    }
  });

  //console.log(cards +"a ver q trae");
const agregadosAlCarrito = (id, nombre, precio, img, stock) => {
  
  let prod = {
    id: id,
    nombre: nombre,
    precio: precio,
    img: img,
    stock: stock,
  };
  //console.log(prod.precio);
  productosSeleccionados.push(prod);
  localStorage.setItem("carrito", JSON.stringify(productosSeleccionados));
  calcularTotal();
  calcularCantidad();
  
};

// con esta funcion sumo y "resto"el precio total del carrito
  function calcularTotal() {
    let actualizarCarrito = JSON.parse(localStorage.getItem("carrito"));
    let resultado = 0;
    actualizarCarrito.forEach((item) => {
      resultado += (item.precio * item.stock);
      
      return resultado;
    });
    precioTotal.innerHTML = resultado;
  }
// con esta funcion cuento la cantidad de productos distintos que estan en el boton carrito
  function calcularCantidad() {
  agregados.innerText = productosSeleccionados.length;
  }

//esta funcion trae lo que esta almacenado en el localstorage y elimina los productos del id seleccionado
const eliminarProd = (id) => {
  //contenidoDelCarrito.innerHTML = "";
  let json = localStorage.getItem("carrito");
  productosSeleccionados = JSON.parse(json);

  let prodABorrar = productosSeleccionados.filter(
    (carrito) => carrito.id != id
  );
  localStorage.setItem("carrito", JSON.stringify(prodABorrar));

};

// con esto guardo los cambios, lo voy a comentar, a ver si se me ocurre algo mejor.
function guardar() {
  //contenidoDelCarrito.innerHTML = "";
  let almacenarCarrito = JSON.parse(localStorage.getItem("carrito"));
  
  almacenarCarrito.forEach((element) => {
    agregadosAlCarrito(
      element.id,
      element.nombre,
      element.precio,
      element.img,
      element.stock
    );
    let divTest = document.createElement("div");
    divTest.innerHTML = `
      
      <h2>${element.nombre}</h2>
      <img class="img-fluid" src="${element.img}"></img>
      <p>Precio: $${element.precio}</p><p>Cantidad: ${element.stock}</p><p>Total por producto: ${element.precio * element.stock}</p>
      <button id="eliminar${element.id}" type="button" class="btn btn-outline-danger d-grid gap-2 col-6 mx-auto mt-2 mb-2">Quitar del Carrito</button>
      <hr />
      `;
      
      
    contenidoDelCarrito.appendChild(divTest);
    
    //voy a llamar al boton eliminar

    let botonEliminarProd = document.getElementById(`eliminar${element.id}`);
    //agrego eventlistener al hacer click
    botonEliminarProd.addEventListener("click", () => {
      //llamo a la función borrar
      eliminarProd(element.id);
      //llamo a las funciones q suman los totales
      calcularCantidad();
      calcularTotal();
      
      
      //y llamo a un tosty q me muestre lo q borre
      Toastify({
        text: `Eliminaste ${element.nombre} del carrito`,
        duration: 2000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top",
        position: "left",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to left, #f50707, #eeaeae)",
        },
        onClick: function () {},
      }).showToast();
      //borro el objeto creado en el carrito
      divTest.remove();
    });
    
  });
}

guardar();

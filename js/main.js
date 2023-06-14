// Llamo a los contenedores y los dejo disponibles de forma global
const contenedor = document.getElementById("contenedor");
const contenedor1 = document.getElementById("contenedor1");
const contenidoDelCarrito = document.getElementById("contenidoCarrito");
const precioTotal = document.getElementById("totalCompra");
const agregados = document.getElementById("agregados");
const botonCarrito = document.getElementById("botonDelCarrito");

//en este array guardo mis prod agregados al carrito
let productosSeleccionados = [];
console.log(productosSeleccionados+"---->test");

//aca traigo la data de los productos

fetch("/data.json")
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
      //agrego eventListener para click en boton agregar, dispara toastify
      let botonAgregar = document.getElementById(`agregar${producto.id}`);
      botonAgregar.addEventListener("click", () => {
        
        //agregue timeout, xq necesito refrescar y al refrescar, no se muestra el tosty, con el timeOut, se llega a ver la tosty =)
        //setTimeout('document.location.reload()',300)
        console.log(botonAgregar.id);
        console.log(productosSeleccionados+"antes del push");
        productosSeleccionados.push({
            id: producto.id,
              nombre: producto.nombre,
              precio: producto.precio,
              img: producto.img,
              stock: producto.stock,
        })
        console.log(productosSeleccionados+"----->adentro del agergar prod");
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
        sumarTodo();
        guardar();
        
      });
      
    }
  });

function sumarTodo() {
  
//console.log(productosSeleccionados+"vamo a ver");
  // let cantidad = Object.values(productosSeleccionados).reduce((acc, el) => acc + el.stock, 0);
  // agregados.innerHTML = cantidad;
  // console.log(cantidad);
  // let todoElprecio = Object.values(productosSeleccionados).reduce((acc, el) => acc + (el.precio * el.stock), 0)
  // precioTotal.innerHTML = todoElprecio;

//pego lo sigueinte para modificar, lo anterior no modificar:

let cantidad = productosSeleccionados.reduce((acc, el) => acc + el.stock, 0);
  agregados.innerHTML = cantidad;
  console.log(cantidad);
  let todoElprecio = productosSeleccionados.reduce((acc, el) => acc + (el.precio * el.stock), 0)
  precioTotal.innerHTML = todoElprecio;

  //console.log(todoElprecio+"todo el precio");
  
}

// esta es la que funciona
const eliminarProd = (id) => {
  let json = localStorage.getItem("carrito");
  productosSeleccionados = JSON.parse(json);
  
 
  let prodABorrar = productosSeleccionados.filter(
    (carrito) => carrito.id != id
  );
  localStorage.setItem("carrito", JSON.stringify(prodABorrar));
  sumarTodo();
  
 // guardar();
  
  //location.reload();
};

// const eliminarProd = (id) => {
//   let obtenerCarrito = localStorage.getItem("carrito");
//   productosSeleccionados = JSON.parse(obtenerCarrito);
  
//   productosSeleccionados.find((element) => element.id);
//   productosSeleccionados = productosSeleccionados.filter((carrito) => carrito.id !== productosSeleccionados
//   );
//   sumarTodo();
//   localStorage.setItem("carrito", JSON.stringify(productosSeleccionados));
  
//   guardar();
//   //location.reload();
// };

// con esto guardo los cambios, lo voy a comentar, a ver si se me ocurre algo mejor.
const guardar = () => {
  contenidoDelCarrito.innerHTML = "";

    productosSeleccionados.forEach((element) => {
      console.log(productosSeleccionados+"almacenarcarrito");
      let divTest = document.createElement("div");
      divTest.innerHTML = `
        
        <h2>${element.nombre}</h2>
        <img class="img-fluid" src="${element.img}"></img>
        <h5>Precio: $${element.precio}</h5>
        <button id="eliminar${element.id}" type="button" class="btn btn-outline-danger d-grid gap-2 col-6 mx-auto mt-2 mb-2">Quitar del Carrito</button>
        `;
        
        
      contenidoDelCarrito.appendChild(divTest);
      localStorage.setItem("carrito", JSON.stringify(productosSeleccionados)); 
      sumarTodo();
          //voy a llamar al boton eliminar

    let botonEliminarProd = document.getElementById(`eliminar${element.id}`);
    //agrego eventlistener al hacer click
    botonEliminarProd.addEventListener("click", () => {
      //invoco a la función borrar
      eliminarProd(element.id);
      //console.log(eliminarProd+"--> entre al eliminarProd");
      sumarTodo();
      //console.log(sumarTodo+"--entre al sumarTodo");
      divTest.remove();
      
      
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
      
      //restarTodo();
      //location.reload();

    })

    // guardar();
  });
}

//guardar();

/* 

me falta lograr que el reduce, muestre un solo html cuando elijo el mismo producto y aumente su cantidad seleccionada
me falta que se resten bien los productos, cuando los elimino. En realidad se descuentan pero es como que va atrasado
de este ultimo punto, se desprende, que cuando elimino todo lo del carrito, siempre me queda en el boton, el 1, x eso
creo que va como "atrasado"

*/

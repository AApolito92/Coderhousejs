


//variables

let carrito = JSON.parse(localStorage.getItem("carritoStorage")) || [];

const d = document;

const cajaMain = d.getElementById("cajaMain");

let storageLocal;

let cantidad = 0;

let acumulador = 0;

let flag = 0; //para controlar el display del carro de compras

console.log(carrito);


// cargo datos del carrito si ya esta guardado.

function checkCartStorage(array) {
  if (array.length > 0) {

    for (i = 0; i < array.length; i++) {

      cantidad += array[i].cantidad;
      acumulador += array[i].precio;

    }
  }
}

checkCartStorage(carrito);





//contendor principal y visualizacion de carrito

const cajaFiltros = d.createElement("div");
cajaFiltros.id = "cajaFiltros";
cajaMain.append(cajaFiltros);

const botonFiltroUno = d.createElement("button")
botonFiltroUno.innerHTML = "burgers"
botonFiltroUno.id = "burger"
botonFiltroUno.onclick = filterProducts;
cajaFiltros.append(botonFiltroUno)

const botonFiltroDos = d.createElement("button")
botonFiltroDos.innerHTML = "Extras"
botonFiltroDos.id = "sideDish"
botonFiltroDos.onclick =filterProducts;
cajaFiltros.append(botonFiltroDos)

const botonFiltroTres = d.createElement("button")
botonFiltroTres.innerHTML = "Todos"
botonFiltroTres.id = "Todos"
botonFiltroTres.onclick =filterProducts;
cajaFiltros.append(botonFiltroTres)


const carritoBox = d.createElement("div");
carritoBox.id = "cajaCarrito"
cajaMain.append(carritoBox);

const botonCarro = d.createElement("button");
botonCarro.innerHTML = "Ver carrito";
botonCarro.classList ="botonCarrito";
botonCarro.onclick = verCarrito;
carritoBox.append(botonCarro);

const cajaMenu = d.createElement("div");
cajaMenu.id = "menuBox";
cajaMain.append(cajaMenu);


// funciones 

function renderizarContent (arrayInfo){

  

  for (i = 0; i < arrayInfo.length; i++) {

    //main box/div 
    div = d.createElement("div");
    div.id = arrayInfo[i].id;
    div.classList = arrayInfo[i].clase;
    cajaMenu.append(div);

    //foto de las burgers
    pic = d.createElement("img");
    pic.src = arrayInfo[i].foto;
    pic.alt = arrayInfo[i].alt;
    div.append(pic);

    //div contenedor de descripcion y precio
    div1 = d.createElement("div");
    div1.classList = "containerDescription"
    div.append(div1);

    // titulo del producto
    h3 = d.createElement("h3");
    h3.innerHTML = arrayInfo[i].nombre;
    div1.append(h3);

    // descripcion del producto
    detalle = d.createElement("p");
    detalle.innerHTML = arrayInfo[i].descripcion;
    div1.append(detalle);

    // precio del producto
    texto1 = d.createElement("p");
    texto1.classList = "precio";
    texto1.innerHTML = "Precio: $"
    div1.append(texto1);

    precioCombo = d.createElement("span");
    precioCombo.innerHTML = arrayInfo[i].pCombo;
    texto1.append(precioCombo);

    //contenedor de selector de unidades
    div2 =d.createElement("div");
    div2.classList = "unitContainer"
    div1.append(div2);

    iconMinus= d.createElement("i")
    iconMinus.classList="fa-solid fa-minus";     
    iconMinus.onclick = restaUnidad ;
    div2.append(iconMinus);

    unitCounter =d.createElement("span");
    unitCounter.classList="cantidadUnidades";
    unitCounter.innerHTML= 1;
    div2.append(unitCounter);

    iconPlus= d.createElement("i")
    iconPlus.classList="fa-solid fa-plus";
    div2.append(iconPlus);
    iconPlus.onclick = sumaUnidad;      


    //boton addCarrito
    boton = d.createElement("button");
    boton.innerHTML = "Agregar a carrito";
    div.append(boton);
    boton.onclick = addCarrito;

  }
}


// funcion de filtro 

function filterProducts (){

  ctgr = this.id 
  console.log (ctgr);
  if ((ctgr === "burger") || (ctgr === "sideDish")){
  cajaMenu.innerHTML = "";
  fetch("../json/bdBurgers.json")
  .then(response => response.json())
  .then(data => {
     arrayFiltrado = data.filter (el => el.categoria === ctgr)
     console.log (arrayFiltrado);
     renderizarContent(arrayFiltrado);
     
  });  } else if (ctgr === "Todos"){
    cajaMenu.innerHTML = "";
    fetch("../json/bdBurgers.json")
  .then(response => response.json())
  .then(data => {
      renderizarContent(data);
      console.log(data);
  });


  }
}

//funcion creadora 

function burgerC(id, name, precio, unidades) {
  this.id = id;
  this.nombre = name;
  this.precio = precio;
  this.cantidad = unidades;
};

function crear(id, name, precio, unidades) {
  const burga = new burgerC(id, name, precio, unidades);
  carrito.push(burga);

}





//productos generados con DOM desde archivo JSON

fetch("../json/bdBurgers.json")
  .then(response => response.json())
  .then(data => {
      renderizarContent(data);
  });




//funciones del carro de compras

function validarDuplicado(array, valor) {

  index = array.findIndex(x => x.id == valor)
  return index;

}

function addCarrito() {
  idBurger = this.parentNode.id;
  precioBurger = parseFloat(this.parentNode.getElementsByTagName("span")[0].innerHTML);
  NombreBurger = this.parentNode.getElementsByTagName("h3")[0].innerText;
  unidadesBurger = parseFloat(this.parentNode.getElementsByClassName("cantidadUnidades")[0].innerHTML);
  precioBurger *= unidadesBurger;  

  // valor que capture la cantidad
  cantidad+=unidadesBurger;
  acumulador += precioBurger;
  validarDuplicado(carrito, idBurger);

  if (carrito.length == 0) {
    crear(idBurger, NombreBurger, precioBurger,unidadesBurger);
  } else if (index == -1) {
    crear(idBurger, NombreBurger, precioBurger,unidadesBurger);
  } else {
    carrito[index].precio += precioBurger;
    carrito[index].cantidad+=unidadesBurger;
  }
  storageLocal = JSON.stringify(carrito);
  localStorage.setItem("carritoStorage", storageLocal);
  flag == 1 ? verCarrito() : flag == 0;

  this.parentNode.getElementsByClassName("cantidadUnidades")[0].innerHTML = 1 ;

  Toastify({
    text: "Añadido al carrito",
    duration: 1500,
    gravity: "bottom", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #b92b27, #1565C0)",
      borderRadius: "50%",
    },
    //onClick: function(){} // Callback after click
  }).showToast();

}


function eliminarItem () {
  x = this.parentNode.classList.value;
  console.log(x);

  index = carrito.findIndex(el => el.id == x)
  console.log(index);   
  
  cantidad-=carrito[index].cantidad
  acumulador -=carrito[index].precio

  carrito.splice(index,1);

  storageLocal = JSON.stringify(carrito);
  localStorage.setItem("carritoStorage", storageLocal);  

  verCarrito(); 

}


function verCarrito() {
  flag = 1;
  carritoBox.textContent = "";



  botonCarro1 = d.createElement("button");
  botonCarro1.innerHTML = "Vaciar carrito";
  botonCarro1.onclick = emptyCarrito;
  carritoBox.appendChild(botonCarro1);

  carritoBox.append(botonCarro);
  listaCompra = d.createElement("ul");
  carritoBox.append(listaCompra);

  for (i = 0; i < carrito.length; i++) {
    listaItems = d.createElement("li");
    listaItems.innerHTML = `${carrito[i].cantidad} - ${carrito[i].nombre}`
    listaItems.classList = carrito[i].id;
    listaCompra.append(listaItems);

    botonEliminar = d.createElement("button");
    botonEliminar.innerHTML = "eliminar";
    botonEliminar.onclick = eliminarItem;
    listaItems.append(botonEliminar);    

  }

  divCarro = d.createElement("div");
  carritoBox.append(divCarro);
  itemTotales = d.createElement("p");
  itemTotales = `Cantidad de items ${cantidad}  - Monto final ${acumulador} $`;
  divCarro.append(itemTotales);

  botonCarro3 = d.createElement("button");
  botonCarro3.innerHTML = "Finalizar compra";
  botonCarro3.onclick = finalizarCompra;
  carritoBox.appendChild(botonCarro3);

}

function finalizarCompra (){
  
   Swal.fire('Gracias por tu compra'), carritoBox.textContent = "";
  
if (carrito.length == 0 ) {
  Swal.fire('No hay items en el carrito')
  const botonCarro = d.createElement("button");
  botonCarro.innerHTML = "Ver carrito";
  botonCarro.onclick = verCarrito;
  carritoBox.append(botonCarro);
} else {

  Swal.fire(`Gracias por tu compra \n Cantidad de items ${cantidad}  - Monto final ${acumulador} $`);
  
  localStorage.removeItem("carritoStorage");
  carrito = [];
  cantidad = 0;
  acumulador = 0;
  flag = 0;
  carritoBox.textContent = "";

  const botonCarro = d.createElement("button");
  botonCarro.innerHTML = "Ver carrito";
  botonCarro.onclick = verCarrito;
  carritoBox.append(botonCarro);
}


 



}


function emptyCarrito() {

  carrito.length == 0 ? Swal.fire('Ya esta vacio') : Swal.fire('Se vacio el carrito');
  localStorage.removeItem("carritoStorage");
  carrito = [];
  cantidad = 0;
  acumulador = 0;
  flag = 0;
  carritoBox.textContent = "";

  const botonCarro = d.createElement("button");
  botonCarro.innerHTML = "Ver carrito";
  botonCarro.onclick = verCarrito;
  carritoBox.append(botonCarro);
}

// suma y resta de unidades (pendiente agregar maximo de unidades)
function sumaUnidad(){
  captura = this.parentNode.getElementsByClassName("cantidadUnidades")[0].innerHTML;
  if (captura >= 10){
    this.parentNode.getElementsByClassName("cantidadUnidades")[0].innerHTML = captura ;  
  } else {
    captura++
    this.parentNode.getElementsByClassName("cantidadUnidades")[0].innerHTML = captura ;
  }

}

function restaUnidad(){
  captura = this.parentNode.getElementsByClassName("cantidadUnidades")[0].innerHTML;
  if (captura == 1){
    this.parentNode.getElementsByClassName("cantidadUnidades")[0].innerHTML = captura ;
  } else {
  captura--
  this.parentNode.getElementsByClassName("cantidadUnidades")[0].innerHTML = captura ;}
}




const formularioContactos = document.querySelector("#contacto"),
  listadoContactos = document.querySelector("#listado-contactos tbody");
eventListeners();

function eventListeners() {
  // Cuando el formulario de crear o editar se ejecuta
  formularioContactos.addEventListener("submit", leerFormulario);

  // Listener para eliminar el boton
  if (listadoContactos) {
    listadoContactos.addEventListener("click", eliminarContacto);
  }
}

function leerFormulario(e) {
  e.preventDefault();

  // Leer los datos de los inputs
  const nombre = document.querySelector("#nombre").value,
    empresa = document.querySelector("#empresa").value,
    telefono = document.querySelector("#telefono").value,
    accion = document.querySelector("#accion").value;

  if (nombre === "" || empresa === "" || telefono === "") {
    // Dos parametros texto y clase
    mostrarNotificacion("Todos los campos son obligatorios", "error");
    //mostrarNotificacion("Contacto creado correctamente", "correcto");
  } else {
    //Pasa la validacion, crear llamando a Ajax
    const infoContacto = new FormData();
    infoContacto.append("nombre", nombre);
    infoContacto.append("empresa", empresa);
    infoContacto.append("telefono", telefono);
    infoContacto.append("accion", accion);

    if (accion === "crear") {
      //Crearemos un nuevo contacto
      insertarDB(infoContacto);
    } else {
      // Editar el contacto
      // Leer el id
      const idRegistro = document.querySelector("#id").value;
      infoContacto.append("id", idRegistro);
      actualizarRegistro(infoContacto);
    }
  }
}
/** Insertar en la DB via Ajax **/
function insertarDB(datos) {
  // LLamando a Ajax
  const xhr = new XMLHttpRequest();

  //abrir la conexion
  xhr.open("POST", "inc/models/modelo-contactos.php", true);

  //pasar los datos
  xhr.onload = function () {
    if (this.status === 200) {
      // Leemos la respuesta de PHP
      const respuesta = JSON.parse(xhr.responseText);
      console.log(JSON.parse(xhr.responseText));

      // Inserta un nuevo elemento a la tabla
      const nuevoContacto = document.createElement("tr");
      nuevoContacto.innerHTML = `
        <td>${respuesta.datos.nombre}</td>
        <td>${respuesta.datos.empresa}</td>
        <td>${respuesta.datos.telefono}</td>
      `;

      // crear contenedor para los botones
      const contenedorAcciones = document.createElement("td");

      // Crear el icono de editar
      const iconoEditar = document.createElement("i");
      iconoEditar.classList.add("fas", "fa-pen-square");

      // Crear el enlace para editar
      const btnEditar = document.createElement("a");
      btnEditar.appendChild(iconoEditar);
      btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
      btnEditar.classList.add("btn", "btn-editar");

      // Agregarlo al padre
      contenedorAcciones.appendChild(btnEditar);

      //Crear el icono de eliminar
      const iconoEliminar = document.createElement("i");
      iconoEliminar.classList.add("fas", "fa-trash-alt");

      // Crear el boton de eliminar
      const btnEliminar = document.createElement("button");
      btnEliminar.appendChild(iconoEliminar);
      btnEliminar.setAttribute("data-id", respuesta.datos.id_insertado);
      btnEliminar.classList.add("btn", "btn-borrar");
      contenedorAcciones.appendChild(btnEliminar);

      // Agregarlo al tr
      nuevoContacto.appendChild(contenedorAcciones);

      // Agregarlo con los contactos
      listadoContactos.append(nuevoContacto);

      // Resetear el form
      document.querySelector("form").reset();
      // Mostrar la notificacion
      mostrarNotificacion("Contacto Creado Correctamente", "correcto");
    }
  };
  // enviar los datos
  xhr.send(datos);
}

// Actualizar Registro
function actualizarRegistro(datos) {
  //Crear el objeto
  const xhr = new XMLHttpRequest();
  //abrir la conexion
  xhr.open("POST", "inc/models/modelo-contactos.php", true);
  //leer la respuesta
  xhr.onload = function () {
    if (this.status === 200) {
      const respuesta = JSON.parse(xhr.responseText);

      if (respuesta.respuesta === "correcto") {
        //mostrar notificacion de Correcto
        mostrarNotificacion("Contacto Editado Correctamente", "correcto");
      } else if (respuesta.respuesta === "error") {
        //Hubo un error
        mostrarNotificacion("Hubo un error", "error");
      }

      //Despues de 3 segundos redireccionar
      setTimeout(() => {
        window.location.href = "index.php";
      }, 4000);
    }
  };
  //enviar la peticion
  xhr.send(datos);
}

// Eliminar contacto
function eliminarContacto(e) {
  if (e.target.parentElement.classList.contains("btn-borrar")) {
    // Tomar el ID
    const id = e.target.parentElement.getAttribute("data-id");

    // Preguntar al usuario
    const respuesta = confirm("Estar Seguro(a) ?");

    if (respuesta) {
      // Lamando a Ajax
      // Crear el objeto
      const xhr = new XMLHttpRequest();
      // Abrir la conexion
      xhr.open(
        "GET",
        `inc/models/modelo-contactos.php?id=${id}&accion=borrar`,
        true
      );
      // Leer la respuesta
      xhr.onload = function () {
        if (this.status === 200) {
          const resultado = JSON.parse(xhr.responseText);

          if (resultado.respuesta == "correcto") {
            // Eliminar el registro del DOM
            e.target.parentElement.parentElement.parentElement.remove();
            // Mostrar notificacion
            mostrarNotificacion("Contacto eliminado", "correcto");
          } else {
            // Mostramos una notificacion
            mostrarNotificacion("HUbo un error...", "error");
          }
        } else {
          console.log("error");
        }
      };
      // Enviar la peticion
      xhr.send();
    }
  }
}

// Notificacion en pantalla

function mostrarNotificacion(mensaje, clase) {
  const notificacion = document.createElement("div");

  notificacion.classList.add(clase, "notificacion", "sombra");
  notificacion.textContent = mensaje;

  // formulario
  formularioContactos.insertBefore(
    notificacion,
    document.querySelector("form legend")
  );

  // Ocultar y mostrar la notificacion
  setTimeout(() => {
    notificacion.classList.add("visible");
    setTimeout(() => {
      notificacion.classList.remove("visible");
      setTimeout(() => {
        notificacion.remove();
      }, 500);
    }, 3000);
  }, 100);
}

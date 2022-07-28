//=============== variables ===============//
const startBtn = document.querySelector("#start");
const stopBtn = document.querySelector("#stop");
const resetBtn = document.querySelector("#reset");
const agregarBtn = document.querySelector("#agregar");
const botonIcono = document.querySelector("#agregar i");
const historial = document.querySelector("#historial");

let hora = "0" + 0;
let minutos = "0" + 0;
let segundos = "0" + 0;
let milisegundos = "0" + 0;
let intervaloId;
let tiempos = [];

//=============== eventos ===============//
startBtn.addEventListener("click", startFn);
stopBtn.addEventListener("click", stopFn);
resetBtn.addEventListener("click", resetFn);
agregarBtn.addEventListener("click", agregarFn);
historial.addEventListener("click", opcionesFn);
document.addEventListener("DOMContentLoaded", mostrarTiemposFn);

//=============== funciones ===============//
function startFn() {
  startBtn.setAttribute("disabled", "true");
  stopBtn.removeAttribute("disabled");
  agregarBtn.removeAttribute("disabled");
  contador();
}
function stopFn() {
  stopBtn.setAttribute("disabled", "true");
  startBtn.removeAttribute("disabled");
  agregarBtn.removeAttribute("disabled");
  clearInterval(intervaloId);
}
function resetFn() {
  startBtn.removeAttribute("disabled");
  stopBtn.removeAttribute("disabled");
  agregarBtn.setAttribute("disabled", "true");

  clearInterval(intervaloId);
  hora = minutos = segundos = milisegundos = "0" + 0;
  actualizarValores();
}
function reiniciarBotonAgregar() {
  botonIcono.classList.replace("bx-save", "bx-timer");
  agregarBtn.removeAttribute("data-id");
  resetBtn.click();
}

function actualizarValores() {
  document.querySelector("#horas").innerText = hora;
  document.querySelector("#minutos").innerText = minutos;
  document.querySelector("#segundos").innerText = segundos;
  document.querySelector("#milisegundos").innerText = milisegundos;
}

function contador() {
  intervaloId = setInterval(() => {
    milisegundos++;
    milisegundos = milisegundos < 10 ? "0" + milisegundos : milisegundos;
    if (milisegundos == 100) {
      segundos++;
      segundos = segundos < 10 ? "0" + segundos : segundos;
      milisegundos = "0" + 0;
    }
    if (segundos == 60) {
      minutos++;
      minutos = minutos < 10 ? "0" + minutos : minutos;
      segundos = "0" + 0;
    }
    if (minutos == 60) {
      hora++;
      hora = hora < 10 ? "0" + hora : hora;
      minutos = "0" + 0;
    }
    actualizarValores();
  }, 10);
}

function generarId() {
  const fecha = Date.now().toString(36).substr(2);
  const ramdom = Math.random().toString(36).substr(2);
  return fecha + ramdom;
}

function formatearFecha(fecha) {
  const _fecha = new Date(fecha);
  const opciones = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return _fecha.toLocaleString(_fecha, opciones);
}

function agregarFn() {
  const tiempo = {
    hora,
    minutos,
    segundos,
    milisegundos,
    id: generarId(),
    fecha: new Date(),
  };

  const getId = agregarBtn.getAttribute("data-id");
  if (getId) {
    const tiemposActualizados = tiempos.map((t) => {
      if (t.id == getId) {
        t.hora = hora;
        t.minutos = minutos;
        t.segundos = segundos;
        t.milisegundos = milisegundos;
        return t;
      }
      return t;
    });
    tiempos = [...tiemposActualizados];
    reiniciarBotonAgregar();
  } else {
    tiempos = [...tiempos, tiempo];
  }
  imprimirHtml();
}

function imprimirHtml() {
  eliminarHtml();

  tiempos.forEach((tiempo) => {
    const { hora, minutos, segundos, milisegundos, fecha, id } = tiempo;
    const item = document.createElement("div");
    item.classList.add("item");
    item.innerHTML = `
          <div>
            <span id="horas-sg">${hora}</span>
            <span class="puntos">:</span>
            <span id="minutos-sg">${minutos}</span>
            <span class="puntos">:</span>
            <span id="segundos-sg">${segundos}</span>
            <span class="puntos puntos--color">:</span>
            <span id="milisegundos-sg">${milisegundos}</span>
          </div>
          <div class="rigth">
            <button class="dots">
              <i class="bx bx-dots-vertical-rounded"></i>
            </button>
            <div class="opciones">
              <button class="editar" data-id="${id}"><i class="bx bx-edit-alt"></i></button>
              <button class="eliminar" data-id="${id}"><i class="bx bx-trash"></i></button>
            </div>
          </div>

          <p>${formatearFecha(fecha)}</p>
          `;
    historial.appendChild(item);
  });
  localStorage.setItem("historial-contador", JSON.stringify(tiempos));
}

function eliminarHtml() {
  while (historial.firstChild) {
    historial.removeChild(historial.firstChild);
  }
}

function mostrarTiemposFn() {
  const getTiempos =
    JSON.parse(localStorage.getItem("historial-contador")) || [];
  tiempos = getTiempos;
  imprimirHtml();
}

function opcionesFn(e) {
  const { target } = e;
  if (target.classList.contains("dots")) {
    const elemento = e.target.parentElement.querySelector(".opciones");
    elemento.classList.toggle("active");
  }
  if (target.classList.contains("editar")) {
    const elemento =
      e.target.parentElement.parentElement.querySelector(".opciones");
    elemento.classList.remove("active");
    const id = target.getAttribute("data-id");
    const tiempoEditar = tiempos.filter((t) => t?.id == id)[0];
    hora = tiempoEditar.hora;
    minutos = tiempoEditar.minutos;
    segundos = tiempoEditar.segundos;
    milisegundos = tiempoEditar.milisegundos;
    botonIcono.classList.replace("bx-timer", "bx-save");
    agregarBtn.setAttribute("data-id", id);
    stopBtn.click();
    actualizarValores();
  }
  if (target.classList.contains("eliminar")) {
    const elemento =
      e.target.parentElement.parentElement.querySelector(".opciones");
    elemento.classList.remove("active");
    const id = target.getAttribute("data-id");
    const tiemposActualizados = tiempos.filter((t) => t?.id != id);
    tiempos = [...tiemposActualizados];
    const getId = agregarBtn.getAttribute("data-id");
    if (getId == id) {
      reiniciarBotonAgregar();
    }
    imprimirHtml();
    stopBtn.click();
  }
}

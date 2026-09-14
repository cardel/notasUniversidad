/* Ejercicio interactivo: tres maneras de guardar muchos (clase 11). */
var EJERCICIO = (function () {
  /* Escenarios y la disciplina que les corresponde. */
  var ESCENARIOS = [
    { texto: "Deshacer y rehacer en un editor de texto", tad: "pila" },
    { texto: "Los turnos de una EPS: se atiende en el orden en que se llega", tad: "cola" },
    { texto: "Una lista de reproducción donde se salta a la canción 7", tad: "lista" },
    { texto: "Las funciones que se llaman unas a otras: termina primero la última que entró", tad: "pila" },
    { texto: "Los documentos que esperan en una impresora compartida", tad: "cola" },
    { texto: "Los asientos de un bus, que se reservan por número", tad: "lista" }
  ];
  return { escenarios: ESCENARIOS };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var PISTAS = {
      pila: "Lo que importa es lo último que llegó: solo se toca un extremo.",
      cola: "Lo que importa es el orden de llegada: entra por un extremo y sale por el otro.",
      lista: "Hace falta la posición: se lee o se escribe en cualquier lugar."
    };
    var aciertos = EJERCICIO.escenarios.map(function () { return false; });
    document.querySelectorAll("[data-esc]").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var i = parseInt(boton.dataset.esc, 10);
        var v = document.getElementById("veredicto-esc-" + i);
        var esperado = EJERCICIO.escenarios[i].tad;
        if (boton.dataset.tad === esperado) {
          v.className = "veredicto bien";
          v.textContent = "Así es. " + PISTAS[esperado];
          aciertos[i] = true;
          boton.parentNode.querySelectorAll("button").forEach(function (b) { b.disabled = true; });
          if (aciertos.every(function (x) { return x; })) {
            document.getElementById("carta-cierre").style.display = "block";
          }
        } else {
          v.className = "veredicto mal";
          v.textContent = "Pregúntese por dónde entra y por dónde sale lo que se guarda. " + PISTAS[boton.dataset.tad] + " ¿Es eso lo que pide la situación?";
        }
      });
    });
  })();
}

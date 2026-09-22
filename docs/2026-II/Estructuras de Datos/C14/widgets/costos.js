/* Ejercicio interactivo: lo que cobra cada operación (clase 14). */
var EJERCICIO = (function () {
  /* Cuantas veces parte por la mitad lower_bound un rango de n: techo de log2(n). */
  function pasosLowerBound(n) {
    var pasos = 0;
    var tam = n;
    while (tam > 1) { tam = Math.ceil(tam / 2); pasos = pasos + 1; }
    return pasos;
  }
  /* Comparaciones de q consultas con find (q * n) y con sort + lower_bound (n log n + q log n). */
  function comparaciones(n, q) {
    var log = Math.ceil(Math.log2(n));
    return { find: q * n, ordenar: n * log + q * log };
  }
  return { pasosLowerBound: pasosLowerBound, comparaciones: comparaciones,
           respuestas: { erase: "kn", espacio: "logn" } };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var logradas = { lb: false, erase: false, consultas: false, espacio: false };
    function revisar() {
      if (logradas.lb && logradas.erase && logradas.consultas && logradas.espacio) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }
    document.getElementById("btn-lb").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-lb");
      var n = parseInt(document.getElementById("pred-lb").value, 10);
      var esperado = EJERCICIO.pasosLowerBound(4096);
      if (n === esperado) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: 12, porque 4096 = 2^12 y cada paso deja la mitad. find, en el peor caso, mira los 4096.";
        logradas.lb = true; revisar();
      } else if (n === 4096 || n === 2048) {
        ver.className = "veredicto mal";
        ver.textContent = "Eso es recorrer. lower_bound parte el rango por la mitad en cada paso: cuente cuántas mitades hay hasta llegar a 1.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "4096, 2048, 1024, ... ¿cuántas veces se puede dividir entre 2 hasta llegar a 1?";
      }
    });
    var MENSAJES_ERASE = {
      kn: null,
      n: "Cada erase corre lo que sigue: con k borrados en medio son k corrimientos de hasta n elementos. Θ(n) lo logra la versión que compacta.",
      k: "Un erase no cuesta O(1) salvo al final del vector: en medio corre todo lo que sigue."
    };
    document.querySelectorAll("#opciones-erase button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var ver = document.getElementById("veredicto-erase");
        var m = MENSAJES_ERASE[boton.dataset.op];
        if (m === null) {
          ver.className = "veredicto bien";
          ver.textContent = "Correcto: O(kn). Con 100 borrados en un vector de 1000, hasta 100 000 corrimientos; compactando, 1000 copias.";
          logradas.erase = true; revisar();
        } else {
          ver.className = "veredicto mal";
          ver.textContent = m;
        }
      });
    });
    var MENSAJES_CONSULTAS = {
      ordenar: null,
      find: "find por consulta hace hasta n comparaciones cada vez: un millón de consultas por un millón de elementos son 10^12 comparaciones.",
      igual: "No es lo mismo: ordenar cuesta n log n una sola vez y después cada consulta cuesta log n. Las cuentas son 10^12 contra unos 4 · 10^7."
    };
    document.querySelectorAll("#opciones-consultas button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var ver = document.getElementById("veredicto-consultas");
        var m = MENSAJES_CONSULTAS[boton.dataset.op];
        var c = EJERCICIO.comparaciones(1000000, 1000000);
        if (m === null) {
          ver.className = "veredicto bien";
          ver.textContent = "Correcto: ordenar una vez y usar lower_bound. Unas " + c.ordenar.toExponential(1).replace("e+", " · 10^") + " comparaciones contra " + c.find.toExponential(0).replace("e+", " · 10^") + " con find por consulta. Es la cuenta de UVa 10474.";
          logradas.consultas = true; revisar();
        } else {
          ver.className = "veredicto mal";
          ver.textContent = m;
        }
      });
    });
    var MENSAJES_ESPACIO = {
      logn: null,
      n: "sort ordena en sitio: no copia el vector. Lo que pide aparte es la pila de la recursión, y esa es logarítmica.",
      uno: "Casi: sort no copia el vector, pero su recursión pide una pila de profundidad log n."
    };
    document.querySelectorAll("#opciones-espacio button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var ver = document.getElementById("veredicto-espacio");
        var m = MENSAJES_ESPACIO[boton.dataset.op];
        if (m === null) {
          ver.className = "veredicto bien";
          ver.textContent = "Correcto: O(log n), la pila de la recursión. mediana, en cambio, pagó Θ(n) por recibir el vector por valor: ese costo lo puso la firma de la función, no el sort.";
          logradas.espacio = true; revisar();
        } else {
          ver.className = "veredicto mal";
          ver.textContent = m;
        }
      });
    });
  })();
}

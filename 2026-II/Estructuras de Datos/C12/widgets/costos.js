/* Ejercicio interactivo: lo que costó cada solución (clase 12). */
var EJERCICIO = (function () {
  /* La papa caliente: pases del frente al final que hace ultimo(n, k). */
  function pasesPapa(n, k) { return (n - 1) * (k - 1); }
  /* quitarRepetidos en sitio: casillas corridas por eliminar con la lista sobre arreglo. */
  function corridasRepetidos(lista) {
    var v = lista.slice();
    var p = 0;
    var corridas = 0;
    while (p < v.length - 1) {
      if (v[p] === v[p + 1]) { corridas = corridas + (v.length - (p + 2)); v.splice(p + 1, 1); } else { p = p + 1; }
    }
    return corridas;
  }
  /* ColaDP: trasvases que provoca una secuencia de operaciones. */
  function trasvases(ops) {
    var entrada = [];
    var salida = [];
    var t = 0;
    ops.forEach(function (op) {
      if (op === "encolar") { entrada.push(1); }
      else {
        if (salida.length === 0) { while (entrada.length > 0) { salida.push(entrada.pop()); } t = t + 1; }
        if (op === "desencolar") { salida.pop(); }
      }
    });
    return t;
  }
  var CASOS = { papa: { n: 7, k: 5 }, repetidos: [4, 4, 4, 4, 9], dp: ["encolar", "encolar", "encolar", "frente", "desencolar", "desencolar", "encolar", "encolar", "desencolar", "frente"] };
  return { casos: CASOS, pasesPapa: pasesPapa, corridasRepetidos: corridasRepetidos, trasvases: trasvases };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var logradas = { papa: false, repetidos: false, dp: false, balanceado: false };
    function revisar() {
      if (logradas.papa && logradas.repetidos && logradas.dp && logradas.balanceado) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }
    document.getElementById("btn-papa").addEventListener("click", function () {
      var v = document.getElementById("veredicto-papa");
      var c = EJERCICIO.casos.papa;
      var dado = parseInt(document.getElementById("pred-papa").value, 10);
      if (dado === EJERCICIO.pasesPapa(c.n, c.k)) {
        v.className = "veredicto bien"; v.textContent = "Correcto: 6 rondas por 4 pases = 24, más 6 salidas. Es Θ(nk): con k grande frente a n la papa da vueltas completas, y k módulo el tamaño actual las ahorra.";
        logradas.papa = true; revisar();
      } else if (dado === 30) { v.className = "veredicto mal"; v.textContent = "Cada ronda pasa k − 1 = 4 veces, no 5: la quinta persona no pasa, sale."; }
      else if (dado === 28) { v.className = "veredicto mal"; v.textContent = "Las rondas son n − 1 = 6, porque el juego termina cuando queda una persona."; }
      else { v.className = "veredicto mal"; v.textContent = "Cuente rondas por pases: hay n − 1 rondas y en cada una la papa pasa k − 1 veces."; }
    });
    document.getElementById("btn-repetidos").addEventListener("click", function () {
      var v = document.getElementById("veredicto-repetidos");
      var dado = parseInt(document.getElementById("pred-repetidos").value, 10);
      if (dado === EJERCICIO.corridasRepetidos(EJERCICIO.casos.repetidos)) {
        v.className = "veredicto bien"; v.textContent = "Correcto: 3 + 2 + 1 = 6. Cada eliminar(p + 1) corre lo que sigue, y con todos iguales se elimina n − 1 veces: Θ(n²) en el peor caso. Construir una lista nueva con agregar sería Θ(n) de tiempo y Θ(n) de espacio.";
        logradas.repetidos = true; revisar();
      } else if (dado === 3) { v.className = "veredicto mal"; v.textContent = "Tres son las eliminaciones. Cada una corre las casillas que quedan a la derecha de la eliminada: 3, luego 2, luego 1."; }
      else { v.className = "veredicto mal"; v.textContent = "Al eliminar la posición 1 de ⟨4 4 4 4 9⟩ se corren 3 casillas; en la siguiente, 2; en la última, 1."; }
    });
    document.getElementById("btn-dp").addEventListener("click", function () {
      var v = document.getElementById("veredicto-dp");
      var dado = parseInt(document.getElementById("pred-dp").value, 10);
      if (dado === EJERCICIO.trasvases(EJERCICIO.casos.dp)) {
        v.className = "veredicto bien"; v.textContent = "Correcto: 2. El primer frente trasvasa tres; los dos desencolar y el segundo frente encuentran salida con algo. El tercer desencolar vacía salida y el último frente vuelve a trasvasar. Cada elemento se trasvasa una sola vez: O(1) amortizado.";
        logradas.dp = true; revisar();
      } else if (dado === 4) { v.className = "veredicto mal"; v.textContent = "No se trasvasa en cada frente ni en cada desencolar: solo cuando salida está vacía."; }
      else if (dado === 1) { v.className = "veredicto mal"; v.textContent = "Hay un segundo trasvase: después del tercer desencolar, salida queda vacía y el último frente tiene que traer los dos que esperaban en entrada."; }
      else { v.className = "veredicto mal"; v.textContent = "Siga las dos pilas: se trasvasa solo cuando se pide frente o desencolar con salida vacía."; }
    });
    var MENSAJES = {
      constante: "La pila guarda las aperturas pendientes; con una cadena de n aperturas guarda las n.",
      lineal: null,
      cuadratico: "Cada carácter dispara a lo sumo una operación de O(1): el tiempo es lineal, y el espacio también en el peor caso."
    };
    document.querySelectorAll("#opciones-bal button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var v = document.getElementById("veredicto-bal");
        var m = MENSAJES[boton.dataset.op];
        if (m === null) { v.className = "veredicto bien"; v.textContent = "Correcto: Θ(n) en tiempo y O(n) de espacio, que se alcanza con una cadena de puras aperturas."; logradas.balanceado = true; revisar(); }
        else { v.className = "veredicto mal"; v.textContent = m; }
      });
    });
  })();
}

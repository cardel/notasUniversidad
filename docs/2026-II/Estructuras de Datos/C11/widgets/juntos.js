/* Ejercicio interactivo: los tres contratos, juntos (clase 11). */
var EJERCICIO = (function () {
  /* meter, quitar y ver: el mismo programa bajo dos disciplinas. */
  var PROGRAMA = [["meter", 5], ["meter", 8], ["quitar"], ["meter", 3], ["ver"]];

  function correr(ops, disciplina) {
    var s = [];
    var visto = null;
    ops.forEach(function (op) {
      if (op[0] === "meter") { s.push(op[1]); }
      else if (op[0] === "quitar") { if (disciplina === "pila") { s.pop(); } else { s.shift(); } }
      else { visto = disciplina === "pila" ? s[s.length - 1] : s[0]; }
    });
    return { ve: visto, tamano: s.length };
  }
  /* Que necesita cada funcion: la disciplina minima con la que se escribe. */
  var FUNCIONES = [
    { texto: "Atender turnos en el orden de llegada", tad: "cola" },
    { texto: "Leer el tercer elemento sin quitar nada", tad: "lista" },
    { texto: "Deshacer la última operación", tad: "pila" },
    { texto: "Insertar un valor en la mitad", tad: "lista" }
  ];
  /* Costos con la lista sobre arreglo: insertar en p corre n - p casillas. */
  function corridasInsertar(n, p) { return n - p; }
  /* revertir con insertar(0, ...): la k-esima insercion corre k - 1. */
  function corridasRevertir(n) { var s = 0; var k = 0; while (k < n) { s = s + k; k = k + 1; } return s; }
  return { programa: PROGRAMA, correr: correr, funciones: FUNCIONES, corridasInsertar: corridasInsertar, corridasRevertir: corridasRevertir };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    function pintarCodigo(id, lineas) {
      var caja = document.getElementById(id);
      lineas.forEach(function (par, i) {
        var linea = document.createElement("div");
        linea.className = "linea" + (par[1] ? " " + par[1] : "");
        var num = document.createElement("span");
        num.className = "num";
        num.textContent = i + 1;
        var txt = document.createElement("span");
        txt.className = "txt";
        txt.textContent = par[0];
        linea.appendChild(num);
        linea.appendChild(txt);
        caja.appendChild(linea);
      });
    }
    pintarCodigo("codigo-programa", [
      ["meter(5);", "bloque-1"],
      ["meter(8);", "bloque-1"],
      ["quitar();", "bloque-2"],
      ["meter(3);", "bloque-1"],
      ["printf(\"%d\\n\", ver());", "bloque-3"]
    ]);
    var logradas = { programa: false, funciones: false };
    function revisar() {
      if (logradas.programa && logradas.funciones) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }
    document.getElementById("btn-programa").addEventListener("click", function () {
      var v = document.getElementById("veredicto-programa");
      var p = EJERCICIO.correr(EJERCICIO.programa, "pila");
      var c = EJERCICIO.correr(EJERCICIO.programa, "cola");
      var dp = parseInt(document.getElementById("pred-pila").value, 10);
      var dc = parseInt(document.getElementById("pred-cola").value, 10);
      if (dp === p.ve && dc === c.ve) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: como pila ve 3 y como cola ve 8. Las mismas cinco líneas, dos respuestas: quitar sacó al 8 en la pila y al 5 en la cola.";
        logradas.programa = true;
        revisar();
      } else if (dp === 8 || dc === 3) {
        v.className = "veredicto mal";
        v.textContent = "Parece cruzado: en la pila quitar saca lo último que entró (el 8) y ver lee lo último que quedó; en la cola quitar saca lo primero (el 5) y ver lee lo que lleva más tiempo.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "Corra el programa dos veces, una con apilar/desapilar/tope y otra con encolar/desencolar/frente.";
      }
    });
    /* --- Carta 3: cuanto cuesta ----------------------------------- */
    var costosOk = { insertar: false, revertir: false, mc: false };
    function revisarCostos() {
      if (costosOk.insertar && costosOk.revertir && costosOk.mc) {
        document.getElementById("cierre-costos").style.display = "block";
      }
    }
    document.getElementById("btn-c-insertar").addEventListener("click", function () {
      var v = document.getElementById("veredicto-c-insertar");
      var dado = parseInt(document.getElementById("pred-c-insertar").value, 10);
      if (dado === EJERCICIO.corridasInsertar(8, 2)) {
        v.className = "veredicto bien"; v.textContent = "Correcto: 6. Se corren las casillas de la posición 2 a la 7 para abrir campo; las posiciones 0 y 1 no se tocan. Por eso insertar en medio es O(n) y agregar al final O(1).";
        costosOk.insertar = true; revisarCostos();
      } else if (dado === 8) { v.className = "veredicto mal"; v.textContent = "No se corre todo el arreglo: lo que está antes de la posición 2 se queda quieto."; }
      else if (dado === 2) { v.className = "veredicto mal"; v.textContent = "Se corre lo que está desde la posición 2 hasta el final, no lo de antes."; }
      else { v.className = "veredicto mal"; v.textContent = "Dibuje ocho casillas e inserte en la 2: cuente cuántas cambian de lugar."; }
    });
    document.getElementById("btn-c-revertir").addEventListener("click", function () {
      var v = document.getElementById("veredicto-c-revertir");
      var dado = parseInt(document.getElementById("pred-c-revertir").value, 10);
      if (dado === EJERCICIO.corridasRevertir(6)) {
        v.className = "veredicto bien"; v.textContent = "Correcto: 0 + 1 + 2 + 3 + 4 + 5 = 15. Cada insertar al frente corre todo lo ya escrito: n(n − 1)/2 corridas, Θ(n²). Con agregar desde el final no se corre nada: Θ(n).";
        costosOk.revertir = true; revisarCostos();
      } else if (dado === 6) { v.className = "veredicto mal"; v.textContent = "Seis son las inserciones. La pregunta es cuántas casillas se corren en total: la primera corre 0, la segunda 1, la tercera 2..."; }
      else if (dado === 21) { v.className = "veredicto mal"; v.textContent = "Casi: la primera inserción corre 0 casillas, no 1, porque la lista está vacía."; }
      else { v.className = "veredicto mal"; v.textContent = "Sume lo que corre cada inserción: al insertar el k-ésimo al frente ya hay k − 1 elementos."; }
    });
    var MENSAJES_MC = {
      lineal: "La pila auxiliar recibe los n elementos antes de devolverlos: el espacio aparte de la pila es Θ(n), no constante.",
      constante: null,
      cuadratico: "No hay nada cuadrático: son 2n operaciones de O(1) y una auxiliar que llega a n."
    };
    document.querySelectorAll("#opciones-c-mc button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var v = document.getElementById("veredicto-c-mc");
        var m = MENSAJES_MC[boton.dataset.op];
        if (m === null) {
          v.className = "veredicto bien"; v.textContent = "Correcto: Θ(n) en tiempo y Θ(n) de espacio. Mirar sin destruir se paga con la pila auxiliar; en la cola, dar la vuelta cuesta Θ(n) de tiempo y Θ(1) de espacio.";
          costosOk.mc = true; revisarCostos();
        } else { v.className = "veredicto mal"; v.textContent = m; }
      });
    });

    var aciertos = EJERCICIO.funciones.map(function () { return false; });
    var PISTA = {
      cola: "Solo hace falta sacar en orden de llegada: la cola alcanza.",
      pila: "Solo hace falta lo último: la pila alcanza.",
      lista: "Hace falta una posición, y ni la pila ni la cola la tienen: toca lista."
    };
    document.querySelectorAll("[data-fn]").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var i = parseInt(boton.dataset.fn, 10);
        var v = document.getElementById("veredicto-fn-" + i);
        var esperado = EJERCICIO.funciones[i].tad;
        if (boton.dataset.tad === esperado) {
          v.className = "veredicto bien";
          v.textContent = "Así es. " + PISTA[esperado];
          aciertos[i] = true;
          boton.parentNode.querySelectorAll("button").forEach(function (b) { b.disabled = true; });
          if (aciertos.every(function (x) { return x; })) { logradas.funciones = true; revisar(); }
        } else {
          v.className = "veredicto mal";
          v.textContent = "Con lista se puede todo, pero la pregunta es cuál es el contrato más pequeño que alcanza. " + PISTA[esperado === "lista" ? "lista" : boton.dataset.tad];
        }
      });
    });
  })();
}

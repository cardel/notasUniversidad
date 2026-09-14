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
  return { programa: PROGRAMA, correr: correr, funciones: FUNCIONES };
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

/* Ejercicio interactivo: una cola hecha con dos pilas (clase 12). */
var EJERCICIO = (function () {
  /* La secuencia de operaciones de la carta. */
  var OPERACIONES = [
    ["encolar", 3], ["encolar", 8], ["encolar", 1], ["frente"], ["desencolar"],
    ["encolar", 5], ["encolar", 9], ["frente"], ["desencolar"], ["desencolar"], ["frente"]
  ];

  /* Simula ColaDP: devuelve lo que responde cada frente y cuantos trasvases hubo. */
  function simular(ops) {
    var entrada = [];
    var salida = [];
    var respuestas = [];
    var trasvases = 0;
    var estados = [];
    function trasvasar() {
      while (entrada.length > 0) { salida.push(entrada.pop()); }
      trasvases = trasvases + 1;
    }
    ops.forEach(function (op) {
      if (op[0] === "encolar") { entrada.push(op[1]); }
      else if (op[0] === "frente") {
        if (salida.length === 0) { trasvasar(); }
        respuestas.push(salida[salida.length - 1]);
      } else {
        if (salida.length === 0) { trasvasar(); }
        salida.pop();
      }
      estados.push({ op: op.join(" "), entrada: entrada.slice(), salida: salida.slice() });
    });
    return { respuestas: respuestas, trasvases: trasvases, estados: estados };
  }

  return { operaciones: OPERACIONES, simular: simular };
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

    pintarCodigo("codigo-ops", EJERCICIO.operaciones.map(function (op, i) {
      var texto = op[0] === "encolar" ? "c.encolar(" + op[1] + ");" : "c." + op[0] + "();";
      if (op[0] === "frente") { texto = "printf(\"%d\\n\", c.frente());"; }
      return [texto, op[0] === "frente" ? "bloque-2" : (op[0] === "encolar" ? "bloque-1" : "")];
    }));

    var r = EJERCICIO.simular(EJERCICIO.operaciones);

    document.getElementById("btn-dp").addEventListener("click", function () {
      var v = document.getElementById("veredicto-dp");
      var dadas = [0, 1, 2].map(function (k) { return parseInt(document.getElementById("pred-dp-" + k).value, 10); });
      var tras = parseInt(document.getElementById("pred-dp-tras").value, 10);
      var bienRespuestas = dadas.every(function (x, k) { return x === r.respuestas[k]; });
      if (bienRespuestas && tras === r.trasvases) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: 3, 8 y 5, con dos trasvases. El segundo frente no trasvasa porque salida todavía tiene al 8 y al 1 debajo; el 5 y el 9 esperan en entrada hasta que salida se vacía.";
        document.getElementById("tabla-dp").style.display = "block";
        var cuerpo = document.getElementById("cuerpo-dp");
        r.estados.forEach(function (e) {
          var fila = document.createElement("tr");
          [e.op, "⟨" + e.entrada.join(" ") + "⟩", "⟨" + e.salida.join(" ") + "⟩"].forEach(function (c) {
            var td = document.createElement("td");
            td.textContent = c;
            fila.appendChild(td);
          });
          cuerpo.appendChild(fila);
        });
      } else if (bienRespuestas) {
        v.className = "veredicto mal";
        v.textContent = "Los tres frentes están bien. Cuente los trasvases: solo ocurren cuando se pide frente o desencolar con salida vacía.";
      } else if (dadas[1] === 5 || dadas[1] === 9) {
        v.className = "veredicto mal";
        v.textContent = "El segundo frente no es lo último que entró. Después del primer desencolar, salida aún guarda al 8 y al 1; el 5 y el 9 se quedan en entrada.";
      } else if (dadas[0] === 1) {
        v.className = "veredicto mal";
        v.textContent = "Es una cola: el primero en entrar sale primero. Al trasvasar, el 3 que entró primero queda en el tope de salida.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "Siga las dos pilas: encolar apila en entrada; frente y desencolar usan salida y solo trasvasan cuando salida está vacía.";
      }
    });
  })();
}

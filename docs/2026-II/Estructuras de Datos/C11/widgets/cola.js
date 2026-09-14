/* Ejercicio interactivo: TAD Cola (clase 11). */
var EJERCICIO = (function () {
  var OPERACIONES = [["encolar", 3], ["encolar", 6], ["desencolar"], ["encolar", 1], ["frente"], ["encolar", 8], ["desencolar"], ["frente"]];
  var ROTAR = { cola: [4, 7, 1, 9], k: 3 };

  function simular(ops) {
    var c = [];
    var frentes = [];
    ops.forEach(function (op) {
      if (op[0] === "encolar") { c.push(op[1]); }
      else if (op[0] === "desencolar") { c.shift(); }
      else { frentes.push(c[0]); }
    });
    return { frentes: frentes, tamano: c.length, cola: c.slice() };
  }
  /* Pasa los primeros k del frente al final. */
  function rotar(cola, k) {
    var c = cola.slice();
    var i = 0;
    while (i < k) { c.push(c.shift()); i = i + 1; }
    return c;
  }
  return { operaciones: OPERACIONES, casoRotar: ROTAR, simular: simular, rotar: rotar };
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
    function leerLista(texto) {
      return texto.trim().split(/[\s,]+/).filter(function (x) { return x !== ""; }).map(Number);
    }
    function iguales(a, b) {
      return a.length === b.length && a.every(function (x, i) { return x === b[i]; });
    }
    pintarCodigo("codigo-ops", [
      ["Cola c;", ""],
      ["c.encolar(3);", "bloque-1"],
      ["c.encolar(6);", "bloque-1"],
      ["c.desencolar();", "bloque-2"],
      ["c.encolar(1);", "bloque-1"],
      ["printf(\"%d\\n\", c.frente());", "bloque-3"],
      ["c.encolar(8);", "bloque-1"],
      ["c.desencolar();", "bloque-2"],
      ["printf(\"%d %d\\n\", c.frente(), c.tamano());", "bloque-3"]
    ]);
    pintarCodigo("codigo-rotar", [
      ["void rotar(Cola &c, int k) {", ""],
      ["  int i = 0;", ""],
      ["  while (i < k) {", ""],
      ["    Elemento x = c.frente();", "bloque-2"],
      ["    c.desencolar();", "bloque-2"],
      ["    c.encolar(x);", "bloque-1"],
      ["    i = i + 1;", ""],
      ["  }", ""],
      ["}", ""]
    ]);
    pintarCodigo("codigo-vacia", [
      ["Cola c;", ""],
      ["c.encolar(2);", "bloque-1"],
      ["c.desencolar();", "bloque-2"],
      ["printf(\"vacia: %d\\n\", c.vacia());", ""],
      ["printf(\"%d\\n\", c.frente());", "bloque-3"]
    ]);

    var logradas = { ops: false, rotar: false, vacia: false };
    function revisar() {
      if (logradas.ops && logradas.rotar && logradas.vacia) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    document.getElementById("btn-ops").addEventListener("click", function () {
      var v = document.getElementById("veredicto-ops");
      var r = EJERCICIO.simular(EJERCICIO.operaciones);
      var f1 = parseInt(document.getElementById("pred-f1").value, 10);
      var f2 = parseInt(document.getElementById("pred-f2").value, 10);
      var n = parseInt(document.getElementById("pred-n").value, 10);
      if (f1 === r.frentes[0] && f2 === r.frentes[1] && n === r.tamano) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: 6, y después 1 con tamaño 2. El 3 salió primero porque entró primero; el 8 espera al final.";
        logradas.ops = true;
        revisar();
      } else if (f1 === 1 || f2 === 8) {
        v.className = "veredicto mal";
        v.textContent = "Eso sería una pila. En la cola lo que acaba de entrar queda al final, y frente lee el que lleva más tiempo esperando.";
      } else if (f1 === 3) {
        v.className = "veredicto mal";
        v.textContent = "El 3 ya salió con el primer desencolar. Después de él, el frente es el 6.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "Dibuje la cola tras cada línea: encolar pone al final, desencolar quita el frente, frente lee sin quitar.";
      }
    });

    document.getElementById("btn-rotar").addEventListener("click", function () {
      var v = document.getElementById("veredicto-rotar");
      var c = EJERCICIO.casoRotar;
      var esperado = EJERCICIO.rotar(c.cola, c.k);
      var dado = leerLista(document.getElementById("pred-rotar").value);
      if (iguales(dado, esperado)) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: ⟨9 4 7 1⟩. Tres vueltas mandan 4, 7 y 1 al final, en ese orden, y el 9 queda de frente. Con k = 4 la cola volvería a ser la misma.";
        logradas.rotar = true;
        revisar();
      } else if (iguales(dado, [1, 9, 4, 7]) || iguales(dado, [7, 1, 9, 4])) {
        v.className = "veredicto mal";
        v.textContent = "Cuente las vueltas: cada una pasa un solo elemento del frente al final. Con k = 3 pasan tres.";
      } else if (iguales(dado, [9, 1, 7, 4])) {
        v.className = "veredicto mal";
        v.textContent = "Los que pasan al final conservan su orden entre sí: la cola no invierte nada.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "Vuelta 1: ⟨7 1 9 4⟩. Siga dos vueltas más.";
      }
    });

    var MENSAJES = {
      cero: "frente no inventa valores. La implementación vigila n > 0 con assert y detiene el programa.",
      assert: null,
      basura: "Sin assert podría pasar. Con el assert de cola.h, el programa se detiene antes de leer nada."
    };
    document.querySelectorAll("#opciones-vacia button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var v = document.getElementById("veredicto-vacia");
        var m = MENSAJES[boton.dataset.op];
        if (m === null) {
          v.className = "veredicto bien";
          v.textContent = "Correcto. Salida real: vacia: 1 y luego cola.h:37: Elemento Cola::frente(): Assertion `n > 0' failed. La precondición de frente es la misma de tope y desencolar, y la vigila la implementación.";
          logradas.vacia = true;
          revisar();
        } else {
          v.className = "veredicto mal";
          v.textContent = m;
        }
      });
    });
  })();
}

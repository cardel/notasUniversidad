/* Ejercicio interactivo: TAD Lista (clase 11). */
var EJERCICIO = (function () {
  var OPERACIONES = [["agregar", 4], ["agregar", 6], ["insertar", 0, 2], ["asignar", 2, 9], ["eliminar", 1], ["insertar", 2, 5]];
  /* Llamadas sobre <2 9 5>: cumple o viola la precondicion. */
  var LLAMADAS = [
    { texto: "l.obtener(3)", cumple: false },
    { texto: "l.insertar(3, 1)", cumple: true },
    { texto: "l.eliminar(3)", cumple: false },
    { texto: "l.asignar(0, 7)", cumple: true }
  ];
  var INTERCALAR = { a: [1, 2, 3], b: [8, 9] };

  function simular(ops) {
    var l = [];
    ops.forEach(function (op) {
      if (op[0] === "agregar") { l.push(op[1]); }
      else if (op[0] === "insertar") { l.splice(op[1], 0, op[2]); }
      else if (op[0] === "asignar") { l[op[1]] = op[2]; }
      else { l.splice(op[1], 1); }
    });
    return l;
  }
  /* a0 b0 a1 b1 ...; lo que sobra de la mas larga va al final. */
  function intercalar(a, b) {
    var r = [];
    var i = 0;
    while (i < a.length || i < b.length) {
      if (i < a.length) { r.push(a[i]); }
      if (i < b.length) { r.push(b[i]); }
      i = i + 1;
    }
    return r;
  }
  return { operaciones: OPERACIONES, llamadas: LLAMADAS, intercalar: intercalar, casoIntercalar: INTERCALAR, simular: simular };
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
      ["Lista l;", ""],
      ["l.agregar(4);", "bloque-1"],
      ["l.agregar(6);", "bloque-1"],
      ["l.insertar(0, 2);", "bloque-2"],
      ["l.asignar(2, 9);", "bloque-3"],
      ["l.eliminar(1);", "bloque-2"],
      ["l.insertar(2, 5);", "bloque-2"],
      ["imprimir(l);", ""]
    ]);
    pintarCodigo("codigo-intercalar", [
      ["Lista intercalar(Lista &a, Lista &b) {", ""],
      ["  Lista r;", ""],
      ["  int i = 0;", ""],
      ["  while (i < a.tamano() || i < b.tamano()) {", "bloque-2"],
      ["    if (i < a.tamano()) { r.agregar(a.obtener(i)); }", "bloque-1"],
      ["    if (i < b.tamano()) { r.agregar(b.obtener(i)); }", "bloque-1"],
      ["    i = i + 1;", ""],
      ["  }", ""],
      ["  return r;", ""],
      ["}", ""]
    ]);

    var logradas = { ops: false, pre: false, inter: false };
    function revisar() {
      if (logradas.ops && logradas.pre && logradas.inter) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    document.getElementById("btn-ops").addEventListener("click", function () {
      var v = document.getElementById("veredicto-ops");
      var esperado = EJERCICIO.simular(EJERCICIO.operaciones);
      var dado = leerLista(document.getElementById("pred-ops").value);
      var n = parseInt(document.getElementById("pred-ops-n").value, 10);
      if (iguales(dado, esperado) && n === esperado.length) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: < 2 9 5 >, tamaño 3. El insertar(2, 5) final cumple la precondición porque p = n = 2: es agregar al final.";
        logradas.ops = true;
        revisar();
      } else if (iguales(dado, [2, 9])) {
        v.className = "veredicto mal";
        v.textContent = "Falta el último insertar: con p igual al tamaño, insertar no viola nada y pone el 5 al final.";
      } else if (iguales(dado, [2, 4, 9, 5]) || iguales(dado, [2, 4, 6, 5])) {
        v.className = "veredicto mal";
        v.textContent = "Revise el eliminar(1): quita el elemento de la posición 1 (el 4) y corre el resto a la izquierda.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "Escriba el estado después de cada línea: agregar pone al final, insertar corre a la derecha, eliminar corre a la izquierda.";
      }
    });

    var aciertosPre = EJERCICIO.llamadas.map(function () { return false; });
    var PISTA_PRE = [
      "obtener exige 0 ≤ p < n, y con n = 3 la posición 3 no existe.",
      "insertar admite p = n: poner en la posición 3 es agregar al final.",
      "eliminar exige p < n: no hay posición 3 que eliminar.",
      "asignar exige 0 ≤ p < n y la posición 0 existe."
    ];
    document.querySelectorAll("[data-llamada]").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var i = parseInt(boton.dataset.llamada, 10);
        var v = document.getElementById("veredicto-pre-" + i);
        var dice = boton.dataset.res === "cumple";
        if (dice === EJERCICIO.llamadas[i].cumple) {
          v.className = "veredicto bien";
          v.textContent = "Así es. " + PISTA_PRE[i];
          aciertosPre[i] = true;
          boton.parentNode.querySelectorAll("button").forEach(function (b) { b.disabled = true; });
          if (aciertosPre.every(function (x) { return x; })) {
            logradas.pre = true;
            revisar();
          }
        } else {
          v.className = "veredicto mal";
          v.textContent = PISTA_PRE[i];
        }
      });
    });

    document.getElementById("btn-inter").addEventListener("click", function () {
      var v = document.getElementById("veredicto-inter");
      var c = EJERCICIO.casoIntercalar;
      var esperado = EJERCICIO.intercalar(c.a, c.b);
      var dado = leerLista(document.getElementById("pred-inter").value);
      if (iguales(dado, esperado)) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: < 1 8 2 9 3 >. En i = 2 la lista b ya se agotó: el segundo if es la precondición de obtener, vigilada desde el área del programador.";
        logradas.inter = true;
        revisar();
      } else if (iguales(dado, [1, 8, 2, 9])) {
        v.className = "veredicto mal";
        v.textContent = "El ciclo sigue mientras alguna de las dos tenga elementos: en i = 2 todavía queda el 3 de a.";
      } else if (iguales(dado, [1, 2, 3, 8, 9])) {
        v.className = "veredicto mal";
        v.textContent = "Eso sería copiar a y después b. Aquí en cada vuelta se agrega uno de a y uno de b.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "Siga i = 0, 1, 2: en cada vuelta agrega a_i si existe y b_i si existe.";
      }
    });
  })();
}

/* Ejercicio interactivo: el iterador como puntero (clase 14). */
var EJERCICIO = (function () {
  var V = [4, 8, 1, 6, 3];

  /* it = v.begin() + k: que hay ahi y que indice es. */
  function posicion(v, k) {
    return { valor: v[k], indice: k };
  }

  /* Recorrido con iterador que imprime los pares; devuelve lo impreso y cuantas veces se leyo *it. */
  function pares(v) {
    var salida = [];
    var lecturas = 0;
    var it = 0;
    while (it !== v.length) {
      lecturas = lecturas + 1;
      if (v[it] % 2 === 0) { salida.push(v[it]); }
      it = it + 1;
    }
    return { salida: salida, lecturas: lecturas };
  }

  /* Tras k avances desde begin, ¿ya es end? */
  function esEnd(v, k) {
    return k === v.length;
  }

  return { v: V, posicion: posicion, pares: pares, esEnd: esEnd };
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
    var logradas = { pos: false, pares: false, end: false };
    function revisar() {
      if (logradas.pos && logradas.pares && logradas.end) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    pintarCodigo("codigo-pos", [
      ["vector<int> v = {4, 8, 1, 6, 3};", ""],
      ["vector<int>::iterator it = v.begin() + 3;", "bloque-1"],
      ["printf(\"%d %d\\n\", *it, (int) (it - v.begin()));", "bloque-2"]
    ]);
    document.getElementById("btn-pos").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-pos");
      var r = EJERCICIO.posicion(EJERCICIO.v, 3);
      var valor = parseInt(document.getElementById("pred-pos-valor").value, 10);
      var indice = parseInt(document.getElementById("pred-pos-indice").value, 10);
      if (valor === r.valor && indice === r.indice) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: 6 3. v.begin() + 3 señala la casilla 3, *it lee lo que hay ahí (6) e it - v.begin() devuelve cuántas casillas hay desde el principio (3).";
        logradas.pos = true; revisar();
      } else if (valor === 3 && indice === 3) {
        ver.className = "veredicto mal";
        ver.textContent = "*it no es el índice: es el contenido de la casilla 3. Cuente desde 0.";
      } else if (valor === 1) {
        ver.className = "veredicto mal";
        ver.textContent = "begin() + 3 avanza tres casillas desde la 0: la 0 es el 4, la 1 el 8, la 2 el 1 y la 3 el 6.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Dibuje las cinco casillas con sus índices 0 a 4 y ponga la flecha de it sobre la casilla 3.";
      }
    });

    pintarCodigo("codigo-pares", [
      ["vector<int> v = {4, 8, 1, 6, 3};", ""],
      ["vector<int>::iterator it = v.begin();", "bloque-1"],
      ["while (it != v.end()) {", "bloque-1"],
      ["  if (*it % 2 == 0) {", "bloque-2"],
      ["    printf(\" %d\", *it);", "bloque-2"],
      ["  }", ""],
      ["  ++it;", "bloque-3"],
      ["}", ""]
    ]);
    document.getElementById("btn-pares").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-pares");
      var r = EJERCICIO.pares(EJERCICIO.v);
      var dada = leerLista(document.getElementById("pred-pares").value);
      var lecturas = parseInt(document.getElementById("pred-pares-n").value, 10);
      if (iguales(dada, r.salida) && lecturas === r.lecturas) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: 4 8 6, y *it se leyó 5 veces, una por casilla. El recorrido con iterador es el de índice con otros nombres: it != v.end() es p < size(), *it es v[p], ++it es p = p + 1.";
        logradas.pares = true; revisar();
      } else if (iguales(dada, r.salida)) {
        ver.className = "veredicto mal";
        ver.textContent = "La salida está bien. Cuente las lecturas de *it: el if lo lee en cada vuelta, sea par o no, y hay una vuelta por elemento.";
      } else if (iguales(dada, [4, 8, 1, 6, 3])) {
        ver.className = "veredicto mal";
        ver.textContent = "Solo se imprimen los que pasan el if: los pares.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Siga el iterador casilla por casilla, del begin() al end(), y anote cuáles son pares.";
      }
    });

    var MENSAJES_END = {
      si: null,
      no: "Cinco avances desde begin() sobre cinco elementos dejan a it justo después del último: eso es exactamente end().",
      ultimo: "end() no es el último elemento: es la casilla que sigue al último y no se lee. Tras cinco ++it desde begin(), it ya está ahí."
    };
    pintarCodigo("codigo-end", [
      ["vector<int> v = {4, 8, 1, 6, 3};", ""],
      ["vector<int>::iterator it = v.begin();", ""],
      ["++it; ++it; ++it; ++it; ++it;", "bloque-1"],
      ["printf(\"%d\\n\", it == v.end());", "bloque-2"]
    ]);
    document.querySelectorAll("#opciones-end button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var ver = document.getElementById("veredicto-end");
        var m = MENSAJES_END[boton.dataset.op];
        if (m === null) {
          ver.className = "veredicto bien";
          ver.textContent = "Correcto: imprime 1. Con cinco elementos, cinco avances llevan a it a end(), la casilla que sigue a la última. Leer *it ahí sería el mismo error que v[5].";
          logradas.end = true; revisar();
        } else {
          ver.className = "veredicto mal";
          ver.textContent = m;
        }
      });
    });
  })();
}

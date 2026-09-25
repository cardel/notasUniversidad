/* Ejercicio interactivo: lower_bound, unique y accumulate (clase 14). */
var EJERCICIO = (function () {
  var ORDENADO = [2, 4, 4, 4, 9, 11];
  var CONSULTAS = [4, 5, 11, 12];
  var CON_REPETIDOS = [7, 3, 7, 1, 3, 3, 9];

  /* Primera posicion cuyo valor no es menor que x, en un vector ordenado. */
  function lowerBound(v, x) {
    var lo = 0;
    var hi = v.length;
    while (lo < hi) {
      var m = Math.floor((lo + hi) / 2);
      if (v[m] < x) { lo = m + 1; } else { hi = m; }
    }
    return lo;
  }

  /* sort + unique + erase: el vector final y cuantos distintos dejo unique al frente. */
  function sinRepetidos(v) {
    var w = v.slice().sort(function (a, b) { return a - b; });
    var destino = 0;
    var p = 0;
    while (p < w.length) {
      if (p === 0 || w[p] !== w[p - 1]) {
        w[destino] = w[p];
        destino = destino + 1;
      }
      p = p + 1;
    }
    var tras_unique = w.slice();
    w.splice(destino, w.length - destino);
    return { ordenado: v.slice().sort(function (a, b) { return a - b; }), trasUnique: tras_unique, distintos: destino, final: w };
  }

  /* accumulate con int: suma modulo 2^32 con signo. */
  function acumularInt(v) {
    var s = 0;
    v.forEach(function (x) { s = (s + x) | 0; });
    return s;
  }

  return { ordenado: ORDENADO, consultas: CONSULTAS, conRepetidos: CON_REPETIDOS,
           lowerBound: lowerBound, sinRepetidos: sinRepetidos, acumularInt: acumularInt };
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
    var logradas = { lb: false, unique: false, acc: false };
    function revisar() {
      if (logradas.lb && logradas.unique && logradas.acc) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    pintarCodigo("codigo-lb", [
      ["vector<int> v = {2, 4, 4, 4, 9, 11};   // ya ordenado", ""],
      ["vector<int>::iterator it = lower_bound(v.begin(), v.end(), x);", "bloque-1"],
      ["printf(\"%d\\n\", (int) (it - v.begin()));", "bloque-2"]
    ]);
    document.getElementById("btn-lb").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-lb");
      var esperado = EJERCICIO.consultas.map(function (x) { return EJERCICIO.lowerBound(EJERCICIO.ordenado, x); });
      var dada = leerLista(document.getElementById("pred-lb").value);
      if (iguales(dada, esperado)) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: 1 4 5 6. Con 4, la primera de las tres apariciones; con 5, que no está, la posición donde iría (la del 9); con 11, la última casilla; con 12, mayor que todos, end(): índice 6, el tamaño. Por eso se comprueba it != v.end() antes de leer *it.";
        logradas.lb = true; revisar();
      } else if (dada.length === 4 && dada[0] === 3) {
        ver.className = "veredicto mal";
        ver.textContent = "lower_bound da la primera posición cuyo valor no es menor que x: con tres 4 seguidos, la primera, no la última.";
      } else if (dada.length === 4 && dada[3] !== 6) {
        ver.className = "veredicto mal";
        ver.textContent = "Con 12, ningún valor es mayor o igual: lower_bound devuelve end(), y end() - begin() es el tamaño del vector.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Cuatro números, uno por consulta: la primera posición con valor >= x, o el tamaño si no la hay.";
      }
    });

    pintarCodigo("codigo-unique", [
      ["vector<int> v = {7, 3, 7, 1, 3, 3, 9};", ""],
      ["sort(v.begin(), v.end());", "bloque-1"],
      ["vector<int>::iterator fin = unique(v.begin(), v.end());", "bloque-2"],
      ["printf(\"%d\\n\", (int) (fin - v.begin()));", "bloque-2"],
      ["v.erase(fin, v.end());", "bloque-3"]
    ]);
    document.getElementById("btn-unique").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-unique");
      var r = EJERCICIO.sinRepetidos(EJERCICIO.conRepetidos);
      var dada = leerLista(document.getElementById("pred-unique").value);
      var n = parseInt(document.getElementById("pred-unique-n").value, 10);
      if (iguales(dada, r.final) && n === r.distintos) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: imprime 4 y v queda < 1 3 7 9 >. Tras el sort, < 1 3 3 3 7 7 9 >; unique copia al frente cada valor distinto del anterior y devuelve la posición 4, donde termina lo válido; el erase recorta desde ahí.";
        logradas.unique = true; revisar();
        document.getElementById("nota-unique").style.display = "block";
        document.getElementById("nota-unique").textContent = "Con esta biblioteca, justo después de unique y antes del erase el vector quedó < " + r.trasUnique.join(" ") + " >: de la posición 4 en adelante no significa nada, y otra biblioteca puede dejar otra cosa.";
      } else if (iguales(dada, r.final)) {
        ver.className = "veredicto mal";
        ver.textContent = "El vector final está bien. Lo que imprime es cuántos distintos dejó unique al frente: la posición que devuelve.";
      } else if (iguales(dada, [7, 3, 1, 9]) || iguales(dada, [7, 3, 7, 1, 9])) {
        ver.className = "veredicto mal";
        ver.textContent = "Primero va el sort: unique solo junta repetidos consecutivos, y después del sort los iguales quedan juntos y en orden.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Tres pasos: ordene, deje un solo representante de cada valor y recorte. Escriba el vector que queda y cuántos son.";
      }
    });

    var MENSAJES_ACC = {
      negativo: null,
      grande: "En int no cabe: 4 000 000 000 supera 2 147 483 647. La suma se acumula en el tipo del valor inicial, 0, que es int, y da la vuelta.",
      error: "Compila sin avisos: sumar dos int es válido, aunque el resultado no quepa. El desbordamiento se ve en la salida, no en el compilador."
    };
    pintarCodigo("codigo-acc", [
      ["vector<int> v = {2000000000, 2000000000};", ""],
      ["int s = accumulate(v.begin(), v.end(), 0);", "bloque-1"],
      ["printf(\"%d\\n\", s);", "bloque-2"]
    ]);
    document.querySelectorAll("#opciones-acc button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var ver = document.getElementById("veredicto-acc");
        var m = MENSAJES_ACC[boton.dataset.op];
        if (m === null) {
          ver.className = "veredicto bien";
          ver.textContent = "Correcto: imprime " + EJERCICIO.acumularInt([2000000000, 2000000000]) + ". El 0 inicial es int, la suma se acumula en int y 4 000 000 000 no cabe. Con 0LL la suma es long long y sale 4000000000.";
          logradas.acc = true; revisar();
        } else {
          ver.className = "veredicto mal";
          ver.textContent = m;
        }
      });
    });
  })();
}

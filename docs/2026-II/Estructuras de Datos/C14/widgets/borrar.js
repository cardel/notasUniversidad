/* Ejercicio interactivo: borrar mientras se recorre (clase 14). */
var EJERCICIO = (function () {
  var V = [-2, 5, -1, -3, 7, 0, -4];

  /* it = v.erase(it) cuando es negativo, ++it si no. Devuelve el vector final y
     cuantos elementos se corrieron en total (cada erase en p corre n - p - 1). */
  function quitarNegativosErase(v) {
    var w = v.slice();
    var corridos = 0;
    var it = 0;
    while (it !== w.length) {
      if (w[it] < 0) {
        corridos = corridos + (w.length - it - 1);
        w.splice(it, 1);
      } else {
        it = it + 1;
      }
    }
    return { final: w, corridos: corridos };
  }

  /* Compactar: copia hacia el frente y recorta. Cuenta las copias hechas. */
  function quitarNegativosCompactar(v) {
    var w = v.slice();
    var destino = 0;
    var copias = 0;
    var p = 0;
    while (p < w.length) {
      if (w[p] >= 0) {
        w[destino] = w[p];
        copias = copias + 1;
        destino = destino + 1;
      }
      p = p + 1;
    }
    w.splice(destino, w.length - destino);
    return { final: w, copias: copias };
  }

  /* El error: v.erase(it) y luego ++it siempre. Que elementos revisa y cuales se salta. */
  function erroneo(v) {
    var w = v.slice();
    var revisados = [];
    var it = 0;
    while (it < w.length) {
      revisados.push(w[it]);
      if (w[it] < 0) {
        w.splice(it, 1);
      }
      it = it + 1;
    }
    var saltados = v.filter(function (x) { return revisados.indexOf(x) === -1; });
    return { final: w, revisados: revisados, saltados: saltados };
  }

  return { v: V, erase: quitarNegativosErase, compactar: quitarNegativosCompactar, erroneo: erroneo };
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
    var logradas = { erase: false, error: false, costo: false };
    function revisar() {
      if (logradas.erase && logradas.error && logradas.costo) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    pintarCodigo("codigo-erase", [
      ["vector<int> v = {-2, 5, -1, -3, 7, 0, -4};", ""],
      ["vector<int>::iterator it = v.begin();", ""],
      ["while (it != v.end()) {", "bloque-1"],
      ["  if (*it < 0) {", "bloque-2"],
      ["    it = v.erase(it);", "bloque-2"],
      ["  } else {", ""],
      ["    ++it;", "bloque-3"],
      ["  }", ""],
      ["}", ""]
    ]);
    document.getElementById("btn-erase").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-erase");
      var r = EJERCICIO.erase(EJERCICIO.v);
      var dada = leerLista(document.getElementById("pred-erase").value);
      if (iguales(dada, r.final)) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: < 5 7 0 >. Cada erase devuelve la posición del que sigue, así que -3, que venía justo después de -1, también se revisa; el 0 no es negativo y se queda.";
        logradas.erase = true; revisar();
      } else if (iguales(dada, [5, -3, 7, 0])) {
        ver.className = "veredicto mal";
        ver.textContent = "Ese es el resultado del ciclo erróneo que salta un elemento tras cada erase. Aquí it = v.erase(it) ya deja a it sobre el -3, y no se avanza.";
      } else if (iguales(dada, [5, 7])) {
        ver.className = "veredicto mal";
        ver.textContent = "El 0 no es negativo: la condición es *it < 0.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Recorra con la regla: si es negativo, se borra y it queda sobre el siguiente; si no, ++it.";
      }
    });

    var MENSAJES_ERROR = {
      salta: null,
      igual: "No es igual: tras v.erase(it), it ya señala al elemento siguiente, y el ++it lo salta sin revisarlo. Con dos negativos seguidos, el segundo sobrevive.",
      todos: "Peor que dejar uno: cuando el último elemento se borra, el ++it pasa más allá de end() y el ciclo lee memoria que no es del vector."
    };
    pintarCodigo("codigo-error", [
      ["vector<int> v = {-2, 5, -1, -3, 7, 0, -4};", ""],
      ["vector<int>::iterator it = v.begin();", ""],
      ["while (it != v.end()) {", "bloque-1"],
      ["  if (*it < 0) {", "bloque-2"],
      ["    v.erase(it);", "bloque-2"],
      ["  }", ""],
      ["  ++it;", "bloque-3"],
      ["}", ""]
    ]);
    document.querySelectorAll("#opciones-error button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var ver = document.getElementById("veredicto-error");
        var m = MENSAJES_ERROR[boton.dataset.op];
        if (m === null) {
          ver.className = "veredicto bien";
          ver.textContent = "Correcto: el -3 nunca se revisa, porque tras borrar el -1 el ++it lo salta, y queda < 5 -3 7 0 >. Y al borrar el -4 final, it queda en end() y el ++it lo pasa de largo: el while ya no se detiene donde debe. Un iterador tras erase no vale; se usa el que erase devuelve.";
          logradas.error = true; revisar();
        } else {
          ver.className = "veredicto mal";
          ver.textContent = m;
        }
      });
    });

    document.getElementById("btn-costo").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-costo");
      var e = EJERCICIO.erase(EJERCICIO.v);
      var c = EJERCICIO.compactar(EJERCICIO.v);
      var corridos = parseInt(document.getElementById("pred-corridos").value, 10);
      var copias = parseInt(document.getElementById("pred-copias").value, 10);
      if (corridos === e.corridos && copias === c.copias) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: " + e.corridos + " corrimientos con erase uno a uno (6 al borrar -2, 4 al borrar -1, 3 al borrar -3, 0 al borrar -4) contra " + c.copias + " copias al compactar, una por elemento que queda. Con k borrados sobre n elementos, O(kn) frente a Θ(n).";
        logradas.costo = true; revisar();
      } else if (corridos === e.corridos) {
        ver.className = "veredicto mal";
        ver.textContent = "Los corrimientos están bien. Al compactar se copia cada elemento que no es negativo a su nueva posición: cuente cuántos quedan.";
      } else if (copias === c.copias) {
        ver.className = "veredicto mal";
        ver.textContent = "Las copias están bien. Cada erase en la posición p corre los que van después: n - p - 1 en ese momento, y n va bajando con cada borrado.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Cuente por separado: un erase en p corre los elementos que están después de p; compactar copia una vez cada elemento que se queda.";
      }
    });
  })();
}

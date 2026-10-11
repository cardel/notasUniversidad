/* Ejercicio interactivo: cuál entrada es el peor caso y qué pivote lo evita (clase 19). */
var EJERCICIO = (function () {
  var ENTRADAS = {
    a: [6, 21, 12, 15, 18, 9, 3],
    b: [6, 3, 12, 9, 18, 15, 21],
    c: [9, 3, 21, 6, 18, 15, 12],
    d: [12, 3, 18, 9, 6, 21, 15]
  };
  var PEOR = "a";
  var ESTRATEGIA = "azar";

  function intercambiar(a, p, q) {
    var temp = a[p];
    a[p] = a[q];
    a[q] = temp;
  }

  function particionar(a, ini, fin, registro) {
    var x = a[fin];
    var i = ini - 1;
    var j = ini;
    while (j < fin) {
      registro.comparaciones = registro.comparaciones + 1;
      if (a[j] <= x) {
        i = i + 1;
        intercambiar(a, i, j);
      }
      j = j + 1;
    }
    intercambiar(a, i + 1, fin);
    return i + 1;
  }

  /* Con medio = true, antes de partir se cambia a[(ini + fin) / 2] con a[fin]. */
  function quicksort(a, ini, fin, nivel, medio, registro) {
    if (nivel > registro.profundidad) { registro.profundidad = nivel; }
    if (ini < fin) {
      if (medio) {
        intercambiar(a, Math.floor((ini + fin) / 2), fin);
      }
      var pivote = a[fin];
      var q = particionar(a, ini, fin, registro);
      registro.pivotes.push({ ini: ini, fin: fin, pivote: pivote, q: q,
                              extremo: q === ini || q === fin });
      quicksort(a, ini, q - 1, nivel + 1, medio, registro);
      quicksort(a, q + 1, fin, nivel + 1, medio, registro);
    }
  }

  function ordenar(v, medio) {
    var a = v.slice();
    var registro = { comparaciones: 0, profundidad: 0, pivotes: [] };
    quicksort(a, 0, a.length - 1, 1, medio, registro);
    registro.final = a;
    return registro;
  }

  return { entradas: ENTRADAS, peor: PEOR, estrategia: ESTRATEGIA, ordenar: ordenar };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var E = EJERCICIO.entradas;
    var U = {};
    var M = {};
    Object.keys(E).forEach(function (k) {
      U[k] = EJERCICIO.ordenar(E[k], false);
      M[k] = EJERCICIO.ordenar(E[k], true);
    });
    function decir(id, bien, texto) {
      var ver = document.getElementById(id);
      ver.className = "veredicto " + (bien ? "bien" : "mal");
      ver.textContent = texto;
    }
    function valor(id) {
      return parseInt(document.getElementById(id).value, 10);
    }
    var logradas = { peor: false, cuenta: false, razon: false, medio: false, estrategia: false };
    function revisar() {
      if (Object.keys(logradas).every(function (k) { return logradas[k]; })) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    var MSJ_PEOR = {
      a: "Correcto: la A. No se parece a una entrada ordenada, pero cada pivote resulta ser el menor o el mayor de su rango: 3, 6, 21, 9, 12 y 15. Cada partición quita un solo elemento.",
      b: "La B casi está ordenada y por eso parece la candidata, pero solo la primera partición es mala: después del 21, el último de a[0..5] es el 15, que deja cuatro elementos a la izquierda y uno a la derecha. Cuesta " + U.b.comparaciones + " comparaciones.",
      c: "La C deja al 12, la mediana, como primer pivote: tres de cada lado. Cuesta " + U.c.comparaciones + " comparaciones.",
      d: "La D empieza con el 15 como pivote, que deja cuatro a la izquierda y dos a la derecha. Cuesta " + U.d.comparaciones + " comparaciones."
    };
    document.querySelectorAll("#opciones-peor button").forEach(function (b) {
      b.addEventListener("click", function () {
        var op = b.dataset.op;
        if (op === EJERCICIO.peor) {
          decir("veredicto-peor", true, MSJ_PEOR[op]);
          logradas.peor = true; revisar();
        } else {
          decir("veredicto-peor", false, MSJ_PEOR[op]);
        }
      });
    });

    document.getElementById("btn-cuenta").addEventListener("click", function () {
      var d = valor("pred-cuenta");
      var c = U.a.comparaciones;
      if (d === c) {
        decir("veredicto-cuenta", true, "Correcto: " + c + " = 6 + 5 + 4 + 3 + 2 + 1 = 7 · 6 / 2. Es la misma cuenta del arreglo ordenado: lo que la produce es el pivote en un extremo, no el orden de la entrada.");
        logradas.cuenta = true; revisar();
      } else if (d === 49 || d === 42) {
        decir("veredicto-cuenta", false, "Las particiones encogen: 6 comparaciones la primera, 5 la segunda, y así hasta 1.");
      } else if (d === 6) {
        decir("veredicto-cuenta", false, "Esa es la primera partición. El 3 queda en la casilla 0 y la derecha tiene seis elementos más por partir.");
      } else {
        decir("veredicto-cuenta", false, "Cada pivote de A es un extremo de su rango. ¿Cuántas comparaciones hace un rango de m elementos, y qué tamaños van saliendo?");
      }
    });

    var MSJ_RAZON = {
      extremo: "Correcto. El costo de particionar es fijo, m − 1 comparaciones para m elementos; lo que cambia es el tamaño de las dos llamadas que siguen. Si el pivote es un extremo, una de ellas recibe m − 1 elementos y la otra ninguno.",
      desorden: "El desorden no es el problema: C y D también están desordenadas y cuestan " + U.c.comparaciones + ". Y un arreglo ordenado, sin ningún desorden, cae en el mismo peor caso.",
      intercambios: "Los intercambios no entran en la cuenta. Lo que se cuenta son comparaciones, y una partición de m elementos hace m − 1 sin importar cuántos intercambios haga: el total depende solo del tamaño de los rangos.",
      grande: "El 21 en la casilla 1 no decide nada por sí solo. Lo que decide es qué valor queda en la última casilla de cada rango cuando le toca partir."
    };
    document.querySelectorAll("#opciones-razon button").forEach(function (b) {
      b.addEventListener("click", function () {
        var op = b.dataset.op;
        decir("veredicto-razon", op === "extremo", MSJ_RAZON[op]);
        if (op === "extremo") { logradas.razon = true; revisar(); }
      });
    });

    document.getElementById("btn-medio").addEventListener("click", function () {
      var d = valor("pred-medio");
      var c = M.a.comparaciones;
      if (d === c) {
        decir("veredicto-medio", true, "Correcto: " + c + ", contra " + U.a.comparaciones + " con el último. El primer pivote pasa a ser a[3] = 15, que deja cuatro elementos a la izquierda y dos a la derecha. Dentro de la izquierda los pivotes 12, 9 y 6 vuelven a caer en un extremo, pero el rango ya es de cuatro: 6 + 3 + 2 + 1, más 1 de la derecha.");
        logradas.medio = true; revisar();
      } else if (d === U.a.comparaciones) {
        decir("veredicto-medio", false, "Con el del medio la primera partición ya cambia: el pivote es a[3] = 15, no el 3.");
      } else if (d === 10) {
        decir("veredicto-medio", false, "10 sería con particiones perfectas de 3 y 3. El 15 deja cuatro a un lado y dos al otro; siga la llamada de la izquierda.");
      } else {
        decir("veredicto-medio", false, "Antes de cada particionar se cambia a[(ini + fin) / 2] con a[fin]. Empiece con a[3] = 15 como pivote del rango completo.");
      }
    });

    var MSJ_ESTRATEGIA = {
      azar: "Correcto. Con la casilla escogida al azar ninguna entrada fija provoca siempre el peor caso, y el tiempo esperado es Θ(n log n) sobre cualquier entrada. El peor caso sigue existiendo, pero depende de la suerte y no de los datos.",
      medio: "El del medio arregla el ordenado y el al revés, pero existen entradas fijas que lo llevan a Θ(n²): basta que el valor de la casilla del medio sea un extremo en cada llamada. El enunciado pide que ninguna entrada lo provoque siempre.",
      primero: "Tomar el primero es el espejo de tomar el último: un arreglo ordenado lo pone otra vez en el mínimo de cada rango.",
      estricta: "Cambiar <= por < solo decide hacia qué lado van los iguales al pivote. Con valores distintos, como los de A, la traza es la misma y el costo también."
    };
    document.querySelectorAll("#opciones-estrategia button").forEach(function (b) {
      b.addEventListener("click", function () {
        var op = b.dataset.op;
        decir("veredicto-estrategia", op === EJERCICIO.estrategia, MSJ_ESTRATEGIA[op]);
        if (op === EJERCICIO.estrategia) { logradas.estrategia = true; revisar(); }
      });
    });
  })();
}

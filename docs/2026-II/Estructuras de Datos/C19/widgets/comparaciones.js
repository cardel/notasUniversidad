/* Ejercicio interactivo: comparaciones y profundidad de quicksort (clase 19). */
var EJERCICIO = (function () {
  var ENTRADAS = {
    ordenado: [2, 5, 8, 11, 14, 17],
    reves: [17, 14, 11, 8, 5, 2],
    balanceado: [14, 2, 20, 17, 8, 5, 11]
  };

  function intercambiar(a, p, q) {
    var temp = a[p];
    a[p] = a[q];
    a[q] = temp;
  }

  /* particionar de la sesion, contando una comparacion por vuelta. */
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

  /* quicksort de la sesion; nivel cuenta las llamadas abiertas, la inicial es 1. */
  function quicksort(a, ini, fin, nivel, registro) {
    if (nivel > registro.profundidad) { registro.profundidad = nivel; }
    if (ini < fin) {
      var antes = registro.comparaciones;
      var rango = a.slice(ini, fin + 1);
      var q = particionar(a, ini, fin, registro);
      registro.llamadas.push({ nivel: nivel, ini: ini, fin: fin, antes: rango,
                               despues: a.slice(ini, fin + 1), q: q,
                               comparaciones: registro.comparaciones - antes });
      quicksort(a, ini, q - 1, nivel + 1, registro);
      quicksort(a, q + 1, fin, nivel + 1, registro);
    }
  }

  function ordenar(v) {
    var a = v.slice();
    var registro = { comparaciones: 0, profundidad: 0, llamadas: [] };
    quicksort(a, 0, a.length - 1, 1, registro);
    registro.final = a;
    return registro;
  }

  return { entradas: ENTRADAS, ordenar: ordenar };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var E = EJERCICIO.entradas;
    var R = {
      ordenado: EJERCICIO.ordenar(E.ordenado),
      reves: EJERCICIO.ordenar(E.reves),
      balanceado: EJERCICIO.ordenar(E.balanceado)
    };
    function decir(id, bien, texto) {
      var ver = document.getElementById(id);
      ver.className = "veredicto " + (bien ? "bien" : "mal");
      ver.textContent = texto;
    }
    function valor(id) {
      return parseInt(document.getElementById(id).value, 10);
    }
    var logradas = { ordenado: false, reves: false, balanceado: false, profundidad: false };
    function revisar() {
      if (logradas.ordenado && logradas.reves && logradas.balanceado && logradas.profundidad) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    document.getElementById("btn-ordenado").addEventListener("click", function () {
      var d = valor("pred-ordenado");
      var c = R.ordenado.comparaciones;
      if (d === c) {
        decir("veredicto-ordenado", true, "Correcto: " + c + " = 5 + 4 + 3 + 2 + 1. El pivote es siempre el mayor de su rango, la izquierda pierde un solo elemento por llamada y cada partición compara todos los demás: 6 · 5 / 2.");
        logradas.ordenado = true; revisar();
      } else if (d === 5) {
        decir("veredicto-ordenado", false, "Esas son las de la primera partición. Después queda a[0..4], todavía ordenado, y se vuelve a partir.");
      } else if (d === 36 || d === 30) {
        decir("veredicto-ordenado", false, "Es cuadrático, pero no n² ni n(n − 1): las particiones van encogiendo, con 5, 4, 3, 2 y 1 comparaciones.");
      } else if (d === 6 * 5 / 2 - 5 || d === 21) {
        decir("veredicto-ordenado", false, "Cuente una comparación por vuelta: un rango de m elementos da m − 1 vueltas.");
      } else {
        decir("veredicto-ordenado", false, "Siga la primera partición: ¿dónde queda el 17 y qué rango le queda a la llamada siguiente?");
      }
    });

    document.getElementById("btn-reves").addEventListener("click", function () {
      var d = valor("pred-reves");
      var c = R.reves.comparaciones;
      if (d === c) {
        decir("veredicto-reves", true, "Correcto: " + c + ", las mismas del ordenado. El primer pivote es el 2, el mínimo: queda en la casilla 0 y la derecha se lleva cinco elementos. Esos cinco ya no vienen al revés, pero en cada llamada el último vuelve a ser el menor o el mayor de su rango, y cada partición quita uno solo.");
        logradas.reves = true; revisar();
      } else if (d === 5) {
        decir("veredicto-reves", false, "Esa es solo la primera partición, que deja el 2 en la casilla 0. La derecha tiene cinco elementos y hay que seguirla.");
      } else if (d < c) {
        decir("veredicto-reves", false, "Al revés no ayuda: el primer pivote es el mínimo y la partición sale igual de desbalanceada que con el máximo. Siga la llamada sobre a[1..5].");
      } else {
        decir("veredicto-reves", false, "Use el paso a paso de abajo con la entrada al revés y mire dónde queda cada q.");
      }
    });

    document.getElementById("btn-balanceado").addEventListener("click", function () {
      var d = valor("pred-balanceado");
      var c = R.balanceado.comparaciones;
      if (d === c) {
        decir("veredicto-balanceado", true, "Correcto: " + c + ". El 11 es la mediana y deja tres de cada lado: 6 comparaciones. Cada lado vuelve a tener la mediana al final, el 5 a la izquierda y el 17 a la derecha, con 2 comparaciones cada uno. Los rangos de un elemento no comparan.");
        logradas.balanceado = true; revisar();
      } else if (d === 21) {
        decir("veredicto-balanceado", false, "21 es lo que costaría con siete elementos si cada pivote fuera un extremo. Mire dónde queda el 11.");
      } else if (d === 6) {
        decir("veredicto-balanceado", false, "Esa es la primera partición. Quedan dos rangos de tres elementos, y cada uno se parte.");
      } else if (d === 12 || d === 14) {
        decir("veredicto-balanceado", false, "Un rango de tres elementos da dos vueltas, no tres ni cuatro: compara todos menos el pivote.");
      } else {
        decir("veredicto-balanceado", false, "Primera partición: 6 comparaciones. ¿Qué queda a cada lado del 11 y quién es el último de cada lado?");
      }
    });

    document.getElementById("btn-profundidad").addEventListener("click", function () {
      var po = valor("pred-prof-ordenado");
      var pb = valor("pred-prof-balanceado");
      var eo = R.ordenado.profundidad;
      var eb = R.balanceado.profundidad;
      if (po === eo && pb === eb) {
        decir("veredicto-profundidad", true, "Correcto: " + eo + " y " + eb + ". Con el ordenado cada llamada abre otra con un elemento menos, de a[0..5] hasta a[0..0]: seis registros en la pila a la vez, uno por elemento. Con el balanceado, 7 → 3 → 1: tres niveles, ⌈log₂(7 + 1)⌉. Es el espacio aparte de quicksort, Θ(n) en el peor caso y Θ(log n) en el balanceado.");
        logradas.profundidad = true; revisar();
      } else if (po === eo - 1 || pb === eb - 1) {
        decir("veredicto-profundidad", false, "Cuente también la llamada del último nivel, la de rango vacío o de un elemento: abre su registro aunque no entre al if.");
      } else if (po === R.ordenado.llamadas.length + 1 && pb === R.balanceado.llamadas.length + 1) {
        decir("veredicto-profundidad", false, "Eso cuenta llamadas en total, no las que están abiertas al mismo tiempo. Cuando una llamada termina, su registro sale de la pila.");
      } else {
        decir("veredicto-profundidad", false, "Siga la cadena más larga de llamadas anidadas: cada una espera a que termine la que abrió.");
      }
    });

    var vista = { entrada: "balanceado", k: 0 };
    function pintarTabla() {
      var L = R[vista.entrada].llamadas;
      var cuerpo = document.getElementById("tabla-llamadas");
      cuerpo.innerHTML = "";
      var acumulado = 0;
      var n = 0;
      while (n < L.length) {
        var ll = L[n];
        acumulado = acumulado + ll.comparaciones;
        var tr = document.createElement("tr");
        var celdas = n < vista.k
          ? [n + 1, ll.nivel, "a[" + ll.ini + ".." + ll.fin + "]", ll.antes.join(" "), ll.despues.join(" "), ll.q, ll.comparaciones, acumulado]
          : [n + 1, "", "", "", "", "", "", ""];
        celdas.forEach(function (v) {
          var td = document.createElement("td");
          td.textContent = v;
          if (n >= vista.k) { td.className = "pend"; }
          tr.appendChild(td);
        });
        cuerpo.appendChild(tr);
        n = n + 1;
      }
      document.getElementById("progreso-llamadas").textContent =
        "entrada " + E[vista.entrada].join(" ") + ": " + vista.k + " de " + L.length + " llamadas que parten un rango";
      document.getElementById("btn-llamada").disabled = vista.k === L.length;
    }
    document.querySelectorAll("#opciones-entrada button").forEach(function (b) {
      b.addEventListener("click", function () {
        vista.entrada = b.dataset.op;
        vista.k = 0;
        pintarTabla();
      });
    });
    document.getElementById("btn-llamada").addEventListener("click", function () {
      if (vista.k < R[vista.entrada].llamadas.length) { vista.k = vista.k + 1; pintarTabla(); }
    });
    document.getElementById("btn-reinicio-llamadas").addEventListener("click", function () {
      vista.k = 0; pintarTabla();
    });
    pintarTabla();
  })();
}

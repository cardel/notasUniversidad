/* Ejercicio interactivo: los ejercicios con la biblioteca (clase 14). */
var EJERCICIO = (function () {
  var A = [1, 2, 5, 8, 9, 12];
  var B = [2, 3, 5, 9, 10];
  var PALABRAS = ["set", "map", "set", "list", "map", "set", "deque"];
  var IMPAR = [6, 1, 9, 4, 2];
  var PAR = [6, 1, 9, 4];

  /* Interseccion con dos iteradores; cuenta las vueltas del while. */
  function interseccion(a, b) {
    var r = [];
    var vueltas = 0;
    var i = 0;
    var j = 0;
    while (i < a.length && j < b.length) {
      vueltas = vueltas + 1;
      if (a[i] < b[j]) { i = i + 1; }
      else if (b[j] < a[i]) { j = j + 1; }
      else { r.push(a[i]); i = i + 1; j = j + 1; }
    }
    return { resultado: r, vueltas: vueltas };
  }

  /* Frecuencias: sort y un recorrido con dos ciclos anidados. */
  function frecuencias(p) {
    var w = p.slice().sort();
    var lineas = [];
    var it = 0;
    while (it < w.length) {
      var actual = w[it];
      var cuenta = 0;
      while (it < w.length && w[it] === actual) { cuenta = cuenta + 1; it = it + 1; }
      lineas.push(actual + " " + cuenta);
    }
    return lineas;
  }

  /* Mediana sobre una copia ordenada. */
  function mediana(v) {
    var w = v.slice().sort(function (a, b) { return a - b; });
    var n = w.length;
    return n % 2 === 1 ? w[Math.floor(n / 2)] : (w[n / 2 - 1] + w[n / 2]) / 2;
  }

  return { a: A, b: B, palabras: PALABRAS, impar: IMPAR, par: PAR,
           interseccion: interseccion, frecuencias: frecuencias, mediana: mediana };
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
    var logradas = { inter: false, frec: false, med: false };
    function revisar() {
      if (logradas.inter && logradas.frec && logradas.med) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    pintarCodigo("codigo-inter", [
      ["vector<int> a = {1, 2, 5, 8, 9, 12};", ""],
      ["vector<int> b = {2, 3, 5, 9, 10};", ""],
      ["vector<int>::iterator i = a.begin();", ""],
      ["vector<int>::iterator j = b.begin();", ""],
      ["while (i != a.end() && j != b.end()) {", "bloque-1"],
      ["  if (*i < *j) { ++i; }", "bloque-2"],
      ["  else if (*j < *i) { ++j; }", "bloque-2"],
      ["  else { r.push_back(*i); ++i; ++j; }", "bloque-3"],
      ["}", ""]
    ]);
    document.getElementById("btn-inter").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-inter");
      var r = EJERCICIO.interseccion(EJERCICIO.a, EJERCICIO.b);
      var dada = leerLista(document.getElementById("pred-inter").value);
      var vueltas = parseInt(document.getElementById("pred-inter-n").value, 10);
      if (iguales(dada, r.resultado) && vueltas === r.vueltas) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: < 2 5 9 > en " + r.vueltas + " vueltas. Cada vuelta avanza al menos un iterador, y el ciclo para cuando b se agota tras el 10, con el 12 de a sin mirar: por eso el costo es Θ(n_a + n_b) y no n_a · n_b.";
        logradas.inter = true; revisar();
      } else if (iguales(dada, r.resultado)) {
        ver.className = "veredicto mal";
        ver.textContent = "La intersección está bien. Cuente las vueltas del while: cada una avanza i, j o los dos, y termina apenas uno de los dos llega a end().";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Siga los dos iteradores: el menor avanza; cuando son iguales se guarda y avanzan los dos.";
      }
    });

    pintarCodigo("codigo-frec", [
      ["vector<string> p = {\"set\", \"map\", \"set\", \"list\", \"map\", \"set\", \"deque\"};", ""],
      ["sort(p.begin(), p.end());", "bloque-1"],
      ["vector<string>::iterator it = p.begin();", ""],
      ["while (it != p.end()) {", "bloque-2"],
      ["  string actual = *it;", ""],
      ["  int cuenta = 0;", ""],
      ["  while (it != p.end() && *it == actual) { cuenta = cuenta + 1; ++it; }", "bloque-3"],
      ["  printf(\"%s %d\\n\", actual.c_str(), cuenta);", ""],
      ["}", ""]
    ]);
    document.getElementById("btn-frec").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-frec");
      var esperado = EJERCICIO.frecuencias(EJERCICIO.palabras);
      var dada = document.getElementById("pred-frec").value.trim().split(/\s*[,;\n]\s*/).map(function (s) { return s.trim().replace(/\s+/g, " "); }).filter(function (s) { return s !== ""; });
      if (iguales(dada, esperado)) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: deque 1, list 1, map 2, set 3, en orden alfabético porque el sort los dejó así. El ciclo de adentro consume cada grupo de iguales y el de afuera toma el siguiente distinto: cada palabra se visita una vez.";
        logradas.frec = true; revisar();
      } else if (dada.length === 4 && dada[0].indexOf("set") === 0) {
        ver.className = "veredicto mal";
        ver.textContent = "El orden de salida es el del sort, alfabético, no el de aparición.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Cuatro líneas, una por palabra distinta, en el orden en que quedan tras el sort, separadas por coma: palabra cuenta, palabra cuenta, ...";
      }
    });

    document.getElementById("btn-med").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-med");
      var m1 = parseFloat(document.getElementById("pred-med-impar").value);
      var m2 = parseFloat(document.getElementById("pred-med-par").value);
      var e1 = EJERCICIO.mediana(EJERCICIO.impar);
      var e2 = EJERCICIO.mediana(EJERCICIO.par);
      if (m1 === e1 && m2 === e2) {
        ver.className = "veredicto bien";
        ver.textContent = "Correcto: 4 y 5. Ordenados quedan < 1 2 4 6 9 > y < 1 4 6 9 >: con n impar es el del medio, v[n / 2]; con n par, el promedio de los dos del medio. Y los vectores de main siguen desordenados, porque mediana recibió una copia.";
        logradas.med = true; revisar();
      } else if (m1 === 9 || m2 === 6.5 || m2 === 7.5) {
        ver.className = "veredicto mal";
        ver.textContent = "Primero se ordena la copia; la posición del medio se toma sobre el vector ordenado, no sobre el original.";
      } else {
        ver.className = "veredicto mal";
        ver.textContent = "Ordene cada vector en papel y tome el del medio; con n par, el promedio de los dos del medio.";
      }
    });
  })();
}

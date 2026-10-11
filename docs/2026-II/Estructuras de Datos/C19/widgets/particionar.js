/* Ejercicio interactivo: particionar paso a paso (clase 19). */
var EJERCICIO = (function () {
  var ARREGLO = [3, 8, 1, 6, 9, 2, 5];
  var LINEAS = [
    "// Parte a[ini..fin] alrededor de x = a[fin] y",
    "// devuelve la posicion final del pivote. Exige ini <= fin.",
    "int particionar(Elemento a[], int ini, int fin) {",
    "  Elemento x = a[fin];",
    "  int i = ini - 1;",
    "  int j = ini;",
    "  while (j < fin) {",
    "    if (a[j] <= x) {",
    "      i = i + 1;",
    "      intercambiar(a, i, j);",
    "    }",
    "    j = j + 1;",
    "  }",
    "  intercambiar(a, i + 1, fin);",
    "  return i + 1;",
    "}"
  ];
  var LINEA_WHILE = 6;
  var LINEA_RETURN = 14;

  function intercambiar(a, p, q) {
    var temp = a[p];
    a[p] = a[q];
    a[q] = temp;
  }

  /* La zona de la casilla k cuando se evalua la condicion con i y j. */
  function zona(k, ini, fin, i, j) {
    var z = "sin revisar";
    if (k === fin) {
      z = "pivote";
    } else if (k >= ini && k <= i) {
      z = "menor";
    } else if (k >= i + 1 && k <= j - 1) {
      z = "mayor";
    }
    return z;
  }

  /* El mismo codigo de la sesion, con una foto en cada evaluacion de la condicion. */
  function particionar(a, ini, fin) {
    var pasos = [];
    var comparaciones = 0;
    var intercambios = 0;
    var propios = 0;
    var x = a[fin];
    var i = ini - 1;
    var j = ini;
    var seguir = true;
    while (seguir) {
      var foto = { i: i, j: j, a: a.slice(), linea: LINEA_WHILE, final: false };
      if (j < fin) {
        comparaciones = comparaciones + 1;
        if (a[j] <= x) {
          foto.cumple = true;
          foto.texto = "a[" + j + "] = " + a[j] + " <= " + x + ": i pasa a " + (i + 1) +
            (i + 1 === j ? " y a[" + j + "] se cambia consigo mismo"
                         : " y se cambian a[" + (i + 1) + "] = " + a[i + 1] + " y a[" + j + "] = " + a[j]);
          i = i + 1;
          intercambiar(a, i, j);
          intercambios = intercambios + 1;
          if (i === j) {
            propios = propios + 1;
          }
        } else {
          foto.cumple = false;
          foto.texto = "a[" + j + "] = " + a[j] + " > " + x + ": solo avanza j";
        }
        j = j + 1;
      } else {
        foto.cumple = null;
        foto.texto = "j = fin y la condición falla: sigue el último intercambio, a[" +
          (i + 1) + "] con a[" + fin + "]";
        seguir = false;
      }
      pasos.push(foto);
    }
    intercambiar(a, i + 1, fin);
    intercambios = intercambios + 1;
    if (i + 1 === fin) {
      propios = propios + 1;
    }
    pasos.push({ i: i, j: j, a: a.slice(), linea: LINEA_RETURN, final: true, cumple: null,
                 texto: "el pivote " + x + " queda en la casilla " + (i + 1) + " y la función devuelve " + (i + 1) });
    return { q: i + 1, x: x, final: a.slice(), pasos: pasos, comparaciones: comparaciones,
             intercambios: intercambios, propios: propios };
  }

  return { arreglo: ARREGLO, lineas: LINEAS, particionar: particionar, zona: zona };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var A = EJERCICIO.arreglo;
    var FIN = A.length - 1;
    var R = EJERCICIO.particionar(A.slice(), 0, FIN);

    function pintarCodigo(id, lineas, actual) {
      var caja = document.getElementById(id);
      caja.innerHTML = "";
      lineas.forEach(function (t, k) {
        var linea = document.createElement("div");
        linea.className = "linea" + (k === actual ? " actual" : "");
        var num = document.createElement("span");
        num.className = "num";
        num.textContent = k + 1;
        var txt = document.createElement("span");
        txt.className = "txt";
        txt.textContent = t;
        linea.appendChild(num);
        linea.appendChild(txt);
        caja.appendChild(linea);
      });
    }
    function chip(padre, rotulo, valor, cuenta) {
      var d = document.createElement("div");
      d.className = "chip" + (cuenta ? " cuenta" : "");
      var b = document.createElement("b");
      b.textContent = rotulo + ": ";
      d.appendChild(b);
      d.appendChild(document.createTextNode(String(valor)));
      padre.appendChild(d);
    }
    function decir(id, bien, texto) {
      var ver = document.getElementById(id);
      ver.className = "veredicto " + (bien ? "bien" : "mal");
      ver.textContent = texto;
    }
    function leerNumeros(texto) {
      return texto.trim().split(/[\s,;]+/).filter(function (x) { return x !== ""; })
                  .map(function (x) { return parseInt(x, 10); });
    }
    function iguales(a, b) {
      return a.length === b.length && a.every(function (x, k) { return x === b[k]; });
    }
    var logradas = { q: false, final: false, intercambios: false };
    function revisar() {
      if (logradas.q && logradas.final && logradas.intercambios) {
        document.getElementById("carta-cierre").style.display = "block";
      }
    }

    document.getElementById("btn-q").addEventListener("click", function () {
      var dado = parseInt(document.getElementById("pred-q").value, 10);
      if (dado === R.q) {
        decir("veredicto-q", true, "Correcto: q = " + R.q + ". Antes del pivote quedan los valores menores o iguales que " +
          R.x + ": el 3, el 1 y el 2. Ocupan las casillas 0 a 2, en el orden que sea, y el pivote toma la siguiente.");
        logradas.q = true; revisar();
      } else if (dado === FIN) {
        decir("veredicto-q", false, "El pivote solo se queda en fin cuando todos los demás son menores o iguales que él. Aquí 8, 6 y 9 son mayores que " + R.x + ".");
      } else {
        decir("veredicto-q", false, "Cuente cuántos de los otros seis valen " + R.x + " o menos. Esos ocupan las casillas 0 en adelante, y el pivote va justo después.");
      }
    });

    var vista = { k: 0 };
    function pintarVista() {
      var p = R.pasos[vista.k];
      pintarCodigo("codigo-particionar", EJERCICIO.lineas, p.linea);
      var chips = document.getElementById("chips-particionar");
      chips.innerHTML = "";
      chip(chips, "x", R.x, false);
      chip(chips, "i", p.i, false);
      chip(chips, "j", p.j, false);
      var hechas = 0;
      var m = 0;
      while (m < vista.k) {
        if (R.pasos[m].cumple !== null) { hechas = hechas + 1; }
        m = m + 1;
      }
      chip(chips, "comparaciones", hechas, true);
      var caja = document.getElementById("arreglo-particionar");
      caja.innerHTML = "";
      var k = 0;
      while (k < p.a.length) {
        var cel = document.createElement("div");
        var z = p.final ? (k < R.q ? "menor" : (k === R.q ? "pivote" : "mayor"))
                        : EJERCICIO.zona(k, 0, FIN, p.i, p.j);
        var clases = "caja fija";
        if (z === "menor") { clases = clases + " zona-menor"; }
        if (z === "mayor") { clases = clases + " zona-mayor"; }
        if (z === "pivote") { clases = clases + " zona-pivote"; }
        if (!p.final && k === p.j && p.j < FIN) { clases = clases + " actual"; }
        cel.className = clases;
        var idx = document.createElement("span");
        idx.className = "indice";
        idx.textContent = k;
        cel.appendChild(idx);
        cel.appendChild(document.createTextNode(p.a[k]));
        var marcas = [];
        if (!p.final && k === p.i) { marcas.push("i"); }
        if (!p.final && k === p.j) { marcas.push("j"); }
        if (p.final && k === R.q) { marcas.push("q"); }
        if (marcas.length > 0) {
          var mk = document.createElement("span");
          mk.className = "marca";
          mk.textContent = marcas.join(" ");
          cel.appendChild(mk);
        }
        caja.appendChild(cel);
        k = k + 1;
      }
      document.getElementById("progreso-particionar").textContent =
        "paso " + (vista.k + 1) + " de " + R.pasos.length + ": " + p.texto;
      document.getElementById("btn-paso").disabled = vista.k === R.pasos.length - 1;
    }
    document.getElementById("btn-paso").addEventListener("click", function () {
      if (vista.k < R.pasos.length - 1) { vista.k = vista.k + 1; pintarVista(); }
    });
    document.getElementById("btn-reinicio").addEventListener("click", function () {
      vista.k = 0; pintarVista();
    });
    pintarVista();

    document.getElementById("btn-final").addEventListener("click", function () {
      var dada = leerNumeros(document.getElementById("pred-final").value);
      var ordenado = A.slice().sort(function (u, v) { return u - v; });
      if (iguales(dada, R.final)) {
        decir("veredicto-final", true, "Correcto: " + R.final.join(" ") + ". Los menores quedan en el orden en que j los encontró, 3, 1 y 2, y los mayores no: el 8 viajó al final cuando el pivote ocupó su casilla.");
        logradas.final = true; revisar();
      } else if (iguales(dada, ordenado)) {
        decir("veredicto-final", false, "Ese es el arreglo ordenado. particionar no ordena los lados: solo deja los menores o iguales antes del pivote y los mayores después.");
      } else if (dada.length !== A.length) {
        decir("veredicto-final", false, "Son siete valores, los mismos del principio en otro orden.");
      } else {
        decir("veredicto-final", false, "Siga el paso a paso: cada vez que a[j] <= " + R.x + ", ese valor se cambia con la primera casilla de la zona de los mayores.");
      }
    });

    document.getElementById("btn-intercambios").addEventListener("click", function () {
      var dado = parseInt(document.getElementById("pred-intercambios").value, 10);
      if (dado === R.intercambios) {
        decir("veredicto-intercambios", true, "Correcto: " + R.intercambios + ". Tres dentro del ciclo, uno por cada valor menor o igual que " + R.x +
          " (el 3, el 1 y el 2), y el último que pone el pivote en su casilla. El primero cambia a[0] consigo mismo: el 3 ya estaba en la zona de los menores.");
        logradas.intercambios = true; revisar();
      } else if (dado === R.intercambios - 1) {
        decir("veredicto-intercambios", false, "Falta uno. ¿Contó el intercambio de después del ciclo, el que lleva el pivote a la casilla i + 1?");
      } else if (dado === R.intercambios - R.propios - 1 || dado === R.intercambios - R.propios) {
        decir("veredicto-intercambios", false, "El código llama a intercambiar aunque i y j sean la misma casilla. Esa llamada también cuenta.");
      } else if (dado === R.comparaciones) {
        decir("veredicto-intercambios", false, "Ese es el número de comparaciones, una por vuelta. Solo hay intercambio en las vueltas donde a[j] <= x.");
      } else {
        decir("veredicto-intercambios", false, "Cuente las vueltas en que a[j] <= " + R.x + " y súmele el intercambio final.");
      }
    });
  })();
}

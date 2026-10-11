/* Ejercicio interactivo: particionar y quicksort sobre un arreglo propio (clase 19). */
var EJERCICIO = (function () {
  var MAXIMO = 12;
  var LINEAS = [
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

  function intercambiar(a, p, q) {
    var temp = a[p];
    a[p] = a[q];
    a[q] = temp;
  }

  /* Lee enteros separados por espacios o comas; devuelve null si algo no es entero. */
  function leer(texto) {
    var partes = texto.trim().split(/[\s,;]+/).filter(function (x) { return x !== ""; });
    var valores = [];
    var bien = partes.length >= 2 && partes.length <= MAXIMO;
    var k = 0;
    while (k < partes.length) {
      if (!/^-?\d{1,3}$/.test(partes[k])) {
        bien = false;
      } else {
        valores.push(parseInt(partes[k], 10));
      }
      k = k + 1;
    }
    return bien ? valores : null;
  }

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

  /* particionar de la sesion, con una foto en cada evaluacion de la condicion
     (lineas 4 y 12 de LINEAS, contadas desde 0). */
  function particionar(a, ini, fin, pasos) {
    var x = a[fin];
    var i = ini - 1;
    var j = ini;
    var comparaciones = 0;
    var seguir = true;
    while (seguir) {
      var foto = { i: i, j: j, a: a.slice(), linea: 4, final: false, comparaciones: comparaciones };
      if (j < fin) {
        comparaciones = comparaciones + 1;
        if (a[j] <= x) {
          foto.texto = "a[" + j + "] = " + a[j] + " <= " + x + ": i pasa a " + (i + 1) +
            (i + 1 === j ? " y a[" + j + "] se cambia consigo mismo"
                         : " y se cambian a[" + (i + 1) + "] y a[" + j + "]");
          i = i + 1;
          intercambiar(a, i, j);
        } else {
          foto.texto = "a[" + j + "] = " + a[j] + " > " + x + ": solo avanza j";
        }
        j = j + 1;
      } else {
        foto.texto = "j = fin y la condición falla: sigue el intercambio de a[" + (i + 1) + "] con a[" + fin + "]";
        seguir = false;
      }
      if (pasos !== null) { pasos.push(foto); }
    }
    intercambiar(a, i + 1, fin);
    if (pasos !== null) {
      pasos.push({ i: i, j: j, a: a.slice(), linea: 12, final: true, q: i + 1,
                   comparaciones: comparaciones,
                   texto: "el pivote " + x + " queda en la casilla " + (i + 1) + " y la función devuelve " + (i + 1) });
    }
    return { q: i + 1, comparaciones: comparaciones };
  }

  /* quicksort de la sesion; anota cada llamada que entra al if y la profundidad. */
  function quicksort(a, ini, fin, nivel, registro) {
    if (nivel > registro.profundidad) { registro.profundidad = nivel; }
    if (ini < fin) {
      var antes = a.slice(ini, fin + 1);
      var r = particionar(a, ini, fin, null);
      registro.comparaciones = registro.comparaciones + r.comparaciones;
      registro.llamadas.push({ nivel: nivel, ini: ini, fin: fin, antes: antes,
                               despues: a.slice(ini, fin + 1), q: r.q,
                               comparaciones: r.comparaciones });
      quicksort(a, ini, r.q - 1, nivel + 1, registro);
      quicksort(a, r.q + 1, fin, nivel + 1, registro);
    }
  }

  function ordenar(v) {
    var a = v.slice();
    var registro = { llamadas: [], comparaciones: 0, profundidad: 0 };
    quicksort(a, 0, a.length - 1, 1, registro);
    registro.final = a;
    return registro;
  }

  function trazaParticion(v) {
    var a = v.slice();
    var pasos = [];
    var r = particionar(a, 0, a.length - 1, pasos);
    return { pasos: pasos, q: r.q, comparaciones: r.comparaciones, final: a };
  }

  return { maximo: MAXIMO, lineas: LINEAS, leer: leer, zona: zona,
           trazaParticion: trazaParticion, ordenar: ordenar };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var estado = { valores: null, traza: null, k: 0 };

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

    function pintarPaso() {
      var T = estado.traza;
      var p = T.pasos[estado.k];
      var fin = p.a.length - 1;
      pintarCodigo("codigo-libre", EJERCICIO.lineas, p.linea);
      var chips = document.getElementById("chips-libre");
      chips.innerHTML = "";
      chip(chips, "x", estado.valores[fin], false);
      chip(chips, "i", p.i, false);
      chip(chips, "j", p.j, false);
      chip(chips, "comparaciones", p.comparaciones, true);
      var caja = document.getElementById("arreglo-libre");
      caja.innerHTML = "";
      var k = 0;
      while (k <= fin) {
        var z = p.final ? (k < p.q ? "menor" : (k === p.q ? "pivote" : "mayor"))
                        : EJERCICIO.zona(k, 0, fin, p.i, p.j);
        var cel = document.createElement("div");
        var clases = "caja fija";
        if (z === "menor") { clases = clases + " zona-menor"; }
        if (z === "mayor") { clases = clases + " zona-mayor"; }
        if (z === "pivote") { clases = clases + " zona-pivote"; }
        if (!p.final && k === p.j && p.j < fin) { clases = clases + " actual"; }
        cel.className = clases;
        var idx = document.createElement("span");
        idx.className = "indice";
        idx.textContent = k;
        cel.appendChild(idx);
        cel.appendChild(document.createTextNode(p.a[k]));
        var marcas = [];
        if (!p.final && k === p.i) { marcas.push("i"); }
        if (!p.final && k === p.j) { marcas.push("j"); }
        if (p.final && k === p.q) { marcas.push("q"); }
        if (marcas.length > 0) {
          var mk = document.createElement("span");
          mk.className = "marca";
          mk.textContent = marcas.join(" ");
          cel.appendChild(mk);
        }
        caja.appendChild(cel);
        k = k + 1;
      }
      document.getElementById("progreso-libre").textContent =
        "paso " + (estado.k + 1) + " de " + T.pasos.length + ": " + p.texto;
      document.getElementById("btn-paso").disabled = estado.k === T.pasos.length - 1;
    }

    function pintarLlamadas() {
      var R = EJERCICIO.ordenar(estado.valores);
      var cuerpo = document.getElementById("tabla-llamadas");
      cuerpo.innerHTML = "";
      R.llamadas.forEach(function (ll, n) {
        var tr = document.createElement("tr");
        [n + 1, ll.nivel, "a[" + ll.ini + ".." + ll.fin + "]", ll.antes.join(" "),
         ll.despues.join(" "), ll.q, ll.comparaciones].forEach(function (v) {
          var td = document.createElement("td");
          td.textContent = v;
          tr.appendChild(td);
        });
        cuerpo.appendChild(tr);
      });
      var n = estado.valores.length;
      document.getElementById("resumen-llamadas").textContent =
        "Arreglo ordenado: " + R.final.join(" ") + ". " +
        (R.llamadas.length === 1 ? "Una llamada parte un rango y hace "
                                  : R.llamadas.length + " llamadas parten un rango y en total hacen ") +
        R.comparaciones + (R.comparaciones === 1 ? " comparación." : " comparaciones.") + " Con n = " + n + ", un arreglo ya ordenado haría n(n − 1)/2 = " +
        (n * (n - 1) / 2) + ". La pila de llamadas llegó a " + R.profundidad +
        " llamadas abiertas a la vez, contando la inicial y las de rango vacío o de un elemento.";
    }

    document.getElementById("btn-cargar").addEventListener("click", function () {
      var ver = document.getElementById("veredicto-cargar");
      var v = EJERCICIO.leer(document.getElementById("entrada").value);
      if (v === null) {
        ver.className = "veredicto mal";
        ver.textContent = "Escriba entre 2 y " + EJERCICIO.maximo + " enteros de hasta tres cifras, separados por espacios o comas.";
        document.getElementById("zona-trabajo").style.display = "none";
      } else {
        ver.className = "veredicto";
        estado.valores = v;
        estado.traza = EJERCICIO.trazaParticion(v);
        estado.k = 0;
        document.getElementById("zona-trabajo").style.display = "block";
        document.getElementById("rango").textContent =
          "particionar(a, 0, " + (v.length - 1) + ") con x = a[" + (v.length - 1) + "] = " + v[v.length - 1];
        pintarPaso();
        pintarLlamadas();
      }
    });
    document.getElementById("btn-paso").addEventListener("click", function () {
      if (estado.traza !== null && estado.k < estado.traza.pasos.length - 1) { estado.k = estado.k + 1; pintarPaso(); }
    });
    document.getElementById("btn-reinicio").addEventListener("click", function () {
      if (estado.traza !== null) { estado.k = 0; pintarPaso(); }
    });
  })();
}

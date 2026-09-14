if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* La particion de tbb::blocked_range con el particionador simple: un rango
   [ini, fin) es divisible mientras (fin - ini) > grano, y se parte por la
   mitad entera: izquierda [ini, med), derecha [med, fin).                 */

function partir(ini, fin, grano, maxProf) {
  var nodo = { ini: ini, fin: fin };
  if (fin - ini > grano) {
    if (maxProf !== undefined && maxProf <= 0) { nodo.cortado = true; return nodo; }
    var med = ini + Math.floor((fin - ini) / 2);
    var sig = maxProf === undefined ? undefined : maxProf - 1;
    nodo.izq = partir(ini, med, grano, sig);
    nodo.der = partir(med, fin, grano, sig);
  }
  return nodo;
}

/* Cuantas hojas, de que tamanos y con cuantos niveles queda un rango de
   tamano t. Solo depende del tamano, y en cada nivel hay a lo sumo dos
   tamanos distintos, asi que la memoria por tamano deja esto en O(log n)
   aunque las hojas sean un millon.                                        */
function resumen(t, grano, memo) {
  memo = memo || {};
  if (memo[t]) { return memo[t]; }
  var r;
  if (t <= grano) {
    r = { hojas: 1, min: t, max: t, prof: 0 };
  } else {
    var a = resumen(Math.floor(t / 2), grano, memo);
    var b = resumen(t - Math.floor(t / 2), grano, memo);
    r = { hojas: a.hojas + b.hojas, min: Math.min(a.min, b.min),
          max: Math.max(a.max, b.max), prof: 1 + Math.max(a.prof, b.prof) };
  }
  memo[t] = r;
  return r;
}

function hojasDe(nodo) {
  if (!nodo.izq) { return [nodo]; }
  return hojasDe(nodo.izq).concat(hojasDe(nodo.der));
}

function hojas(n, grano) {
  return resumen(n, grano).hojas;
}

function profundidad(n, grano) {
  return resumen(n, grano).prof;
}

/* Los nodos agrupados por nivel: [[raiz], [izq, der], ...]. */
function niveles(nodo) {
  var filas = [];
  function bajar(nd, nivel) {
    if (!filas[nivel]) { filas[nivel] = []; }
    filas[nivel].push(nd);
    if (nd.izq) { bajar(nd.izq, nivel + 1); bajar(nd.der, nivel + 1); }
  }
  bajar(nodo, 0);
  return filas;
}

/* La cadena de tamanos por la rama izquierda: 1000, 500, 250, 125, 62. */
function cadena(n, grano) {
  var lista = [n];
  while (n > grano) { n = Math.floor(n / 2); lista.push(n); }
  return lista;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { partir: partir, resumen: resumen, hojasDe: hojasDe, hojas: hojas,
                     profundidad: profundidad, niveles: niveles, cadena: cadena };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;
  var n = 1000;
  var grano = 100;
  var MAX_NIVELES = 6;

  function pintarArbol() {
    var raiz = partir(0, n, grano, MAX_NIVELES - 1);
    var filas = niveles(raiz);
    var res = resumen(n, grano);
    var html = "";
    filas.forEach(function (nodos, nivel) {
      var cajas = nodos.map(function (nd) {
        var hoja = !nd.izq && !nd.cortado;
        var ancho = (nd.fin - nd.ini) / n * 100;
        return "<span class=\"nodo" + (hoja ? " hoja" : "") + "\" title=\"[" + num(nd.ini) +
          ", " + num(nd.fin) + "): " + num(nd.fin - nd.ini) + "\" style=\"left:calc(" +
          (nd.ini / n * 100) + "% + 1px);width:calc(" + ancho + "% - 2px)\">" +
          (ancho > 6 ? num(nd.fin - nd.ini) : "") + "</span>";
      }).join("");
      html += "<div class=\"barra-fila\"><span class=\"rotulo\" style=\"width:4.2rem\">nivel " +
        nivel + "</span><span class=\"pista-barra\" style=\"position:relative;height:30px\">" +
        cajas + "</span><span class=\"valor\">" + num(nodos.length) + "</span></div>";
    });
    if (res.prof + 1 > MAX_NIVELES) {
      var faltan = res.prof + 1 - MAX_NIVELES;
      html += "<div class=\"progreso\">… y " + num(faltan) +
        (faltan === 1 ? " nivel más" : " niveles más") + ", hasta " + num(res.hojas) +
        " hojas.</div>";
    }
    document.getElementById("panel-arbol").innerHTML = html;

    Motor.pintarChips("chips-arbol", [
      { texto: "hojas", valor: num(res.hojas), cuenta: true },
      { texto: "niveles", valor: num(res.prof) },
      { texto: "hoja más pequeña", valor: num(res.min) },
      { texto: "hoja más grande", valor: num(res.max) }
    ]);
  }

  function pintar() {
    document.getElementById("ver-n").textContent = num(n);
    document.getElementById("ver-grano").textContent = num(grano);
    document.getElementById("llamada").textContent =
      "tbb::blocked_range<int>(0, " + n + ", " + grano + ")";
    document.getElementById("pregunta-n").textContent = num(n);
    document.getElementById("pregunta-grano").textContent = num(grano);
    document.getElementById("veredicto").className = "veredicto";
    pintarArbol();
  }

  function explicar(bien, real, dicho) {
    var c = cadena(n, grano);
    var ultimo = c[c.length - 1];
    var penultimo = c.length > 1 ? c[c.length - 2] : null;
    var texto = "Los tamaños por la rama izquierda van " +
      c.map(function (x) { return num(x); }).join(" → ") + ". " +
      (penultimo !== null
        ? num(penultimo) + " todavía supera el grano de " + num(grano) + " y se parte; " +
          num(ultimo) + " no, y ahí queda la hoja. "
        : "El rango entero no supera el grano y no se parte. ") +
      "Cada nivel duplica los subrangos: 2^" + profundidad(n, grano) + " = " + num(real) + ".";
    return (bien ? "Sí: " + num(real) + " subrangos. " : "Quedan " + num(real) +
      " subrangos, no " + num(dicho) + ". ") + texto;
  }

  var RAZONES = {
    correcta: "La paralela está bien: 20 × 10 = 200 por elemento y un millón de " +
      "elementos dan 2×10⁸. La secuencial recorre v, que vale 10 por elemento, y " +
      "por eso imprime 10⁷. Hasta que los dos números coincidan, la comparación " +
      "de tiempos no dice nada.",
    duplica: "El reparto no cambia la suma: 2×10⁸ es exactamente 200 por elemento " +
      "por un millón de elementos. Lo que está mal es el otro número, el de la " +
      "versión que recorre v en vez de w.",
    distintas: "Se escribieron para comparar el mismo cálculo. Si miden cosas " +
      "distintas, la tabla de tiempos que viene después compara peras con " +
      "manzanas y no dice nada del reparto.",
    medir: "Al revés. Un tiempo de un cálculo equivocado no sirve para nada, y " +
      "revisar el número es lo primero: comparar los dos resultados va antes que " +
      "comparar los dos relojes."
  };

  document.querySelectorAll("[data-n]").forEach(function (b) {
    b.addEventListener("click", function () { n = parseInt(b.dataset.n, 10); pintar(); });
  });
  document.querySelectorAll("[data-grano]").forEach(function (b) {
    b.addEventListener("click", function () { grano = parseInt(b.dataset.grano, 10); pintar(); });
  });
  Motor.conectarPrediccion(
    { entrada: "prediccion", boton: "btn-comprobar", veredicto: "veredicto" },
    function () { return hojas(n, grano); },
    explicar);
  Motor.conectarOpciones("opciones-resultado", "veredicto-resultado", RAZONES);

  pintar();
})();

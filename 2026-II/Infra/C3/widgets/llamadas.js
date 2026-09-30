if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* El fib recursivo de la clase, llamada por llamada: fib(n) = n si n <= 1 y
   fib(n - 1) + fib(n - 2) si no. Sin memoizacion cada llamada con n > 1
   hace dos mas; con @lru_cache cada valor de n entra al cuerpo una vez.   */

/* Cifras del reporte de cProfile de la clase, con fib(35). El reporte suma
   las llamadas del propio programa (print, Stats, ...): son 9.             */
var MEDIDO = {
  n: 35,
  programa: 9,
  sinMemo: { fib: 29860703, totales: 29860712, primitivas: 10, segundos: 4.957, sinPerfilador: 3.5 },
  conMemo: { fib: 36, totales: 45, primitivas: 10, segundos: 0 }
};

/* Cuatro filas del reporte de ruta.py y las dos duraciones del encabezado. */
var RUTA = {
  llamadas: 8004232,
  perfilado: 2.963,
  sinPerfilador: 1.382,
  filas: [
    { clave: "mas_cercano", ncalls: 2000, tottime: 0.786, cumtime: 2.461 },
    { clave: "distancia", ncalls: 4000000, tottime: 1.232, cumtime: 1.675 },
    { clave: "sleep", ncalls: 1, tottime: 0.5, cumtime: 0.5 },
    { clave: "sqrt", ncalls: 4000000, tottime: 0.443, cumtime: 0.443 }
  ]
};

function fib(n) {
  var a = 0, b = 1;
  for (var i = 0; i < n; i++) { var c = a + b; a = b; b = c; }
  return a;
}

/* Llamadas a fib sin memo: llamadas(0) = llamadas(1) = 1 y
   llamadas(n) = 1 + llamadas(n - 1) + llamadas(n - 2). Vale 2 fib(n+1) - 1. */
function llamadas(n) {
  if (n <= 1) { return 1; }
  var a = 1, b = 1;
  for (var i = 2; i <= n; i++) { var c = 1 + b + a; a = b; b = c; }
  return b;
}

/* Con @lru_cache entran al cuerpo los n + 1 valores distintos, una vez cada
   uno; los aciertos de cache devuelven antes de entrar a fib.             */
function llamadasMemo(n) { return n + 1; }

/* Las cifras del encabezado del reporte para fib(n): fib, mas las del
   programa; primitivas son las 9 del programa y una sola de fib.           */
function reporte(n, memo) {
  var deFib = memo ? llamadasMemo(n) : llamadas(n);
  return { fib: deFib, totales: deFib + MEDIDO.programa, primitivas: MEDIDO.programa + 1 };
}

function arbol(n) {
  return { n: n, hijos: n > 1 ? [arbol(n - 1), arbol(n - 2)] : [] };
}

/* Orden de ejecucion (preorden): primero fib(n - 1) hasta el fondo, despues
   fib(n - 2). repetido: ese n ya se habia calculado en un paso anterior.  */
function pasos(n) {
  var lista = [], vistos = {};
  function visitar(m, prof) {
    var rep = vistos[m] === true;
    vistos[m] = true;
    lista.push({ n: m, profundidad: prof, repetido: rep });
    if (m > 1) { visitar(m - 1, prof + 1); visitar(m - 2, prof + 1); }
  }
  visitar(n, 0);
  return lista;
}

/* Los pasos agrupados por profundidad, con su indice en la lista. */
function porNivel(lista) {
  var niveles = [];
  lista.forEach(function (p, i) {
    while (niveles.length <= p.profundidad) { niveles.push([]); }
    niveles[p.profundidad].push({ indice: i, n: p.n, repetido: p.repetido });
  });
  return niveles;
}

/* Segundos como los imprime el reporte, con tres decimales fijos. */
function seg(x) { return x.toFixed(3).replace(".", ",") + " s"; }

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    MEDIDO: MEDIDO, RUTA: RUTA, fib: fib, llamadas: llamadas,
    llamadasMemo: llamadasMemo, reporte: reporte, arbol: arbol, pasos: pasos,
    porNivel: porNivel, seg: seg
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;
  var n = 5;
  var lista = pasos(n);
  var k = 0;                 // llamadas mostradas hasta ahora
  var vistaCrece = false;    // la tabla de la carta 2 se destapa al comprobar
  var vistaMemo = false;     // la tabla de la carta 3 se destapa al comprobar
  var FILAS_RUTA = { mas_cercano: "fila-mas_cercano", correcta: "fila-distancia",
                     sleep: "fila-sleep", sqrt: "fila-sqrt" };

  function pintarArbol() {
    var html = "";
    porNivel(lista).forEach(function (fila, prof) {
      html += "<div class=\"fila-esc\"><span class=\"rotulo\" style=\"width:4.4rem\">prof. " +
        prof + "</span>";
      fila.forEach(function (p) {
        var clase = "caja";
        if (p.indice >= k) { clase += " futura"; }
        else { clase += p.repetido ? " repetida" : " visitada"; }
        if (p.indice === k - 1) { clase += " actual"; }
        var titulo = "llamada " + (p.indice + 1) + ": fib(" + p.n + ")" +
          (p.repetido ? ", ya calculado antes" : ", primera vez");
        html += "<span class=\"" + clase + "\" title=\"" + titulo + "\">" + p.n + "</span>";
      });
      html += "</div>";
    });
    document.getElementById("arbol").innerHTML = html;
  }

  function pintarCodigo() {
    var actual = k > 0 ? lista[k - 1] : null;
    document.getElementById("linea-base").className =
      "linea bloque-1" + (actual && actual.n <= 1 ? " actual" : "");
    document.getElementById("linea-rec").className =
      "linea bloque-1" + (actual && actual.n > 1 ? " actual" : "");
  }

  function textoPaso() {
    if (k === 0) {
      return "fib(" + n + ") todavía no se ha llamado. Siguiente muestra cada " +
        "llamada en el orden en que Python la hace.";
    }
    var p = lista[k - 1];
    var t = "Llamada " + num(k) + ": fib(" + p.n + "), profundidad " + p.profundidad + ". ";
    t += p.n <= 1
      ? "Caso base: devuelve " + p.n + " sin llamar a nadie."
      : "Llama a fib(" + (p.n - 1) + ") y, cuando esa vuelve, a fib(" + (p.n - 2) + ").";
    if (p.repetido) {
      var debajo = llamadas(p.n) - 1;
      t += " fib(" + p.n + ") ya se había calculado: con memoización la caché " +
        "responde aquí sin entrar al cuerpo" +
        (debajo > 0 ? " y las " + num(debajo) + " llamadas que cuelgan de esta no ocurren." : ".");
    } else {
      t += " Primera vez que se calcula fib(" + p.n + ").";
    }
    return t;
  }

  function pintarPaso() {
    var hechas = k >= lista.length;
    document.getElementById("ver-n").textContent = n;
    document.getElementById("progreso").textContent = k === 0
      ? "fib(" + n + "): ninguna llamada todavía."
      : "Llamadas hasta ahora: " + num(k) + (hechas ? " · fib(" + n + ") terminó." : "");
    document.getElementById("btn-siguiente").disabled = hechas;
    document.getElementById("paso-texto").textContent = textoPaso();
    pintarArbol();
    pintarCodigo();
    Motor.pintarChips("chips-arbol", [
      { texto: "llamadas a fib", valor: hechas ? num(lista.length) : "?", cuenta: true },
      { texto: "valores distintos de n", valor: hechas ? num(n + 1) : "?" },
      { texto: "repetidas", valor: hechas ? num(lista.length - (n + 1)) : "?" }
    ]);
  }

  function pintarCrece() {
    document.getElementById("tabla-crece").hidden = !vistaCrece;
    if (!vistaCrece) { return; }
    document.getElementById("cuerpo-crece").innerHTML = [5, 6, 7, 10, 20, 35].map(function (m) {
      return "<tr" + (m === 6 ? " style=\"background:var(--resalte)\"" : "") + "><td>" + m +
        "</td><td>" + num(llamadas(m)) + "</td><td>" +
        num(llamadas(m) / llamadas(m - 1), 2) + "</td></tr>";
    }).join("");
  }

  function pintarMemo() {
    var pend = "<td class=\"pend\">?</td>";
    var raya = "<td class=\"pend\">—</td>";
    var filas = [
      ["Llamadas que ejecutan el cuerpo de fib", num(llamadas(6)), num(llamadasMemo(6)),
       num(MEDIDO.sinMemo.fib), num(MEDIDO.conMemo.fib)],
      ["Llamadas primitivas a fib", "1", "1", "1", "1"],
      ["Llamadas totales del reporte", raya, raya, num(MEDIDO.sinMemo.totales), num(MEDIDO.conMemo.totales)],
      ["Llamadas primitivas del reporte", raya, raya, num(MEDIDO.sinMemo.primitivas), num(MEDIDO.conMemo.primitivas)],
      ["Tiempo reportado", raya, raya, seg(MEDIDO.sinMemo.segundos), seg(MEDIDO.conMemo.segundos)]
    ];
    document.getElementById("cuerpo-memo").innerHTML = filas.map(function (f) {
      var celdas = f.slice(1).map(function (c) {
        if (!vistaMemo) { return pend; }
        return c.indexOf("<td") === 0 ? c : "<td>" + c + "</td>";
      }).join("");
      return "<tr><td style=\"text-align:left\">" + f[0] + "</td>" + celdas + "</tr>";
    }).join("");
  }

  function explicarA(bien, real, dicho) {
    vistaCrece = true;
    pintarCrece();
    var t = bien ? "Sí, " + num(real) + ". " : "Son " + num(real) + ", no " + num(dicho) + ". ";
    t += "fib(6) es una llamada más las de fib(5) y fib(4): 1 + " + num(llamadas(5)) +
      " + " + num(llamadas(4)) + " = " + num(llamadas(6)) + ". Cada n nuevo multiplica " +
      "el conteo por cerca de 1,6: es exponencial, O(2ⁿ), y con fib(35) son " +
      num(llamadas(35)) + " llamadas a fib, las del reporte de la clase.";
    return t;
  }

  function explicarB(bien, real, dicho) {
    vistaMemo = true;
    pintarMemo();
    var t = bien ? "Sí, " + num(real) + ". " : "Son " + num(real) + ", no " + num(dicho) + ". ";
    t += "Con @lru_cache cada valor de n entra al cuerpo una sola vez: fib(6), fib(5), " +
      "…, fib(0), siete valores. Las otras " + num(llamadas(6) - llamadasMemo(6)) +
      " llamadas del árbol las responde la caché antes de entrar a fib y el perfilador " +
      "no las cuenta. Con fib(35) son " + num(MEDIDO.conMemo.fib) + " en lugar de " +
      num(MEDIDO.sinMemo.fib) + "; el reporte dice " + num(MEDIDO.conMemo.totales) +
      " porque suma las " + num(MEDIDO.programa) + " llamadas del resto del programa, y " +
      num(MEDIDO.conMemo.primitivas) + " primitivas en los dos casos: esas " +
      num(MEDIDO.programa) + " y una sola de fib, porque las demás vienen de la recursión.";
    return t;
  }

  var RAZONES_TOCAR = {
    correcta: "distancia. Es el tottime más alto de la tabla, 1,232 s, repartido en " +
      "cuatro millones de llamadas. mas_cercano acumula 2,461 s, pero 1,675 de esos " +
      "son distancia: por su cuenta gasta 0,786. El programa se va en la función chica " +
      "que se llama cuatro millones de veces, y ahí se empieza.",
    mas_cercano: "Su cumtime de 2,461 s es el mayor, pero es tiempo acumulado: incluye " +
      "los 1,675 s de distancia, a la que llama dos mil veces por punto. Lo que " +
      "mas_cercano hace por su cuenta son 0,786 s, y ni siquiera es lo más alto de la " +
      "columna tottime.",
    sleep: "Son 0,500 s exactos y no son cálculo: el programa espera al sensor. " +
      "Optimizar código no acorta una espera; se quita o se hace otra cosa mientras " +
      "tanto. Además es una sola llamada, y la tabla muestra que el tiempo de cálculo " +
      "está en las cuatro millones de distancia.",
    sqrt: "Sus 0,443 s ya están dentro del cumtime de distancia: 1,675 = 1,232 + 0,443. " +
      "math.sqrt está escrita en C y no hay nada que optimizarle; lo que se puede hacer " +
      "es no llamarla, comparando distancias al cuadrado, y ese cambio se hace en " +
      "distancia."
  };

  var RAZONES_INFORME = {
    correcta: "1,382 s, el de time sin perfilador. cProfile anota la entrada y la salida " +
      "de las 8.004.232 llamadas, y eso cuesta: el encabezado sube a 2,963 s, más del " +
      "doble. La tabla sirve para ordenar funciones entre sí; la duración del programa " +
      "se mide sin perfilador.",
    perfilado: "Los 2,963 s incluyen el costo de instrumentar 8.004.232 llamadas: " +
      "cProfile anota cada entrada y cada salida. Sin él la misma corrida dio 1,382 s. " +
      "Ese número compara funciones dentro de una misma corrida; no es lo que dura el " +
      "programa.",
    promedio: "Promediar una medida con perfilador y otra sin él no mide nada: los " +
      "2,963 s cargan un costo de instrumentación que el programa real no paga. La " +
      "corrida sin perfilador ya está medida y es la que va: 1,382 s.",
    menos30: "Restar el 30 % supone que el sobrecosto es fijo, y no lo es: pesa más " +
      "cuando hay millones de llamadas cortas, como aquí, donde la corrida pasó de " +
      "1,382 a 2,963 s, un 114 % más. El número del perfilador no se corrige; se mide " +
      "sin él."
  };

  function resaltarFila(op) {
    Object.keys(FILAS_RUTA).forEach(function (c) {
      document.getElementById(FILAS_RUTA[c]).className =
        "linea bloque-1" + (c === op ? " actual" : "");
    });
  }

  document.querySelectorAll("[data-n]").forEach(function (b) {
    b.addEventListener("click", function () {
      n = parseInt(b.dataset.n, 10);
      lista = pasos(n);
      k = 0;
      pintarPaso();
    });
  });
  document.getElementById("btn-siguiente").addEventListener("click", function () {
    k = Math.min(k + 1, lista.length); pintarPaso();
  });
  document.getElementById("btn-todo").addEventListener("click", function () {
    k = lista.length; pintarPaso();
  });
  document.getElementById("btn-reiniciar").addEventListener("click", function () {
    k = 0; pintarPaso();
  });
  Motor.conectarPrediccion(
    { entrada: "prediccion-a", boton: "btn-comprobar-a", veredicto: "veredicto-a" },
    function () { return llamadas(6); },
    explicarA);
  Motor.conectarPrediccion(
    { entrada: "prediccion-b", boton: "btn-comprobar-b", veredicto: "veredicto-b" },
    function () { return llamadasMemo(6); },
    explicarB);
  Motor.conectarOpciones("opciones-tocar", "veredicto-tocar", RAZONES_TOCAR);
  document.querySelectorAll("#opciones-tocar button").forEach(function (b) {
    b.addEventListener("click", function () { resaltarFila(b.dataset.op); });
  });
  Motor.conectarOpciones("opciones-informe", "veredicto-informe", RAZONES_INFORME);

  pintarPaso();
  pintarCrece();
  pintarMemo();
})();

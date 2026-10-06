if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Las tres clausulas de variables de OpenMP sobre el mismo programa: x vale 10
   antes de la region y cada hilo escribe su identificador adentro. ejecutar()
   devuelve que ve cada hilo al entrar, con que sale su copia y que queda afuera
   al cerrar. Sin DOM y sin azar.                                            */

var INICIAL = 10;
var HILOS = 4;
var ESCRITURAS = [0, 1, 2, 3];        // omp_get_thread_num() de cada hilo
var CLAUSULAS = ["shared", "private", "firstprivate"];

/* La tabla de la clase, palabra por palabra. */
var TABLA = [
  { clausula: "shared", copia: "no", entrada: "el de afuera", afuera: "sí" },
  { clausula: "private", copia: "sí", entrada: "sin inicializar", afuera: "no" },
  { clausula: "firstprivate", copia: "sí", entrada: "el de afuera", afuera: "no" }
];

function filaTabla(clausula) {
  return TABLA.filter(function (f) { return f.clausula === clausula; })[0];
}

/* firstprivate suma sobre el valor heredado; las otras dos asignan. */
function operador(clausula) {
  return clausula === "firstprivate" ? "+=" : "=";
}

function lineasPrograma(clausula) {
  return [
    "int x = " + INICIAL + ";",
    "#pragma omp parallel " + clausula + "(x)",
    "{",
    "    x " + operador(clausula) + " omp_get_thread_num();",
    "    printf(\"Hilo %d: x = %d\\n\", omp_get_thread_num(), x);",
    "}",
    "printf(\"Afuera: x = %d\\n\", x);"
  ];
}

/* dentro[i] es null cuando la copia entra sin inicializar. afuera es el valor
   de la variable original al cerrar la region.                              */
function ejecutar(clausula, valorInicial, escrituraPorHilo, hilos) {
  var dentro = [], despues = [], i, esc;
  for (i = 0; i < hilos; i++) {
    esc = escrituraPorHilo[i % escrituraPorHilo.length];
    if (clausula === "private") {
      dentro.push(null);
      despues.push(esc);
    } else if (clausula === "firstprivate") {
      dentro.push(valorInicial);
      despues.push(valorInicial + esc);
    } else {
      dentro.push(valorInicial);
      despues.push(esc);
    }
  }
  return {
    dentro: dentro,
    despues: despues,
    afuera: clausula === "shared" ? despues[hilos - 1] : valorInicial,
    copia: clausula !== "shared",
    hereda: clausula !== "private",
    seVe: clausula === "shared"
  };
}

function textoEntrada(clausula) {
  return clausula === "private" ? "sin inicializar" : Motor.num(INICIAL);
}

function textoEscritura(clausula, hilo) {
  return "x " + operador(clausula) + " " + Motor.num(ESCRITURAS[hilo]);
}

function textoAfuera(clausula) {
  var r = ejecutar(clausula, INICIAL, ESCRITURAS, HILOS);
  if (clausula === "shared") {
    return "Al cerrar la región x vale " + Motor.num(r.afuera) +
      ": hay una sola x y la escritura del hilo que llegó último es la que quedó.";
  }
  return "Al cerrar la región x vale " + Motor.num(r.afuera) + ": las " +
    Motor.num(HILOS) + " copias se descartan y la x de afuera nunca se tocó.";
}

var NOTAS = {
  shared: "Hay una sola x. La columna de entrada dice " + INICIAL + " porque es " +
    "lo que había antes de la región, pero el orden de las escrituras no está " +
    "fijado y un hilo que entre tarde puede encontrarse ya el valor de otro. El " +
    "ejemplo de la clase protege esa escritura con #pragma omp atomic: dos sumas " +
    "que se cruzan pierden una de las dos.",
  private: "Lo que cada hilo imprimió adentro no deja rastro afuera. La copia " +
    "entra sin inicializar y este programa le asigna un valor en la primera línea " +
    "de la región, antes de leerla.",
  firstprivate: "Cada copia arranca en " + INICIAL + " y sale en " + INICIAL +
    " más el identificador del hilo. Las cuatro cuentas se van con las copias; " +
    "para quedarse con el total hay que combinarlas, por ejemplo con reduction."
};

function explicarPrediccion(bien, real, dicho) {
  var num = Motor.num;
  var s = bien ? "Sí: imprime " + num(real) + ". "
    : "No: imprime " + num(real) + ", no " + num(dicho, 2) + ". ";
  s += "private le da a cada hilo una copia propia de x; esa copia se descarta " +
    "al cerrar la región y la variable de afuera no se toca, así que sigue en " +
    num(INICIAL) + ". Lo de adentro es otra historia: la copia entra sin " +
    "inicializar, no en " + num(INICIAL) + ", y leerla antes de asignarle algo " +
    "devuelve basura. Para heredar el valor de afuera está firstprivate.";
  return s;
}

var CASOS = [
  {
    id: "acumulador",
    correcta: "private",
    razones: {
      correcta: "Sí. Cada hilo necesita su propio acumulador, y lo pone en cero " +
        "él mismo al entrar, así que el valor de afuera no le hace falta.",
      shared: "Con shared hay un solo acumulador para los cuatro hilos: la " +
        "escritura de uno se pierde cuando cae entre la lectura y la escritura " +
        "de otro. Protegerlo con atomic arregla la cuenta y serializa la suma.",
      firstprivate: "firstprivate también da copia por hilo, pero la inicializa " +
        "con el valor de afuera. Ese valor aquí no interesa: el acumulador se " +
        "pone en cero en la primera línea de la región."
    }
  },
  {
    id: "consulta",
    correcta: "shared",
    razones: {
      correcta: "Sí. Nadie escribe, así que no hay carrera que proteger y una " +
        "sola copia en memoria sirve para los cuatro hilos. Es además lo que " +
        "pasa por defecto con una variable declarada antes de la región.",
      private: "private da una copia sin inicializar: la tabla llegaría vacía y " +
        "las consultas devolverían basura.",
      firstprivate: "firstprivate sí copia la tabla con sus valores, pero una " +
        "vez por hilo: con cuatro hilos son cuatro tablas enteras en " +
        "memoria para datos que nadie modifica."
    }
  },
  {
    id: "contador",
    correcta: "firstprivate",
    razones: {
      correcta: "Sí. La copia por hilo entra con el valor de afuera, que es el 0 " +
        "de partida. Afuera el contador sigue en 0 al cerrar la región, así que " +
        "el total hay que combinarlo aparte.",
      shared: "shared no copia nada: los cuatro hilos incrementan el mismo " +
        "contador y los incrementos que se cruzan se pierden, salvo que cada uno " +
        "vaya con atomic.",
      private: "La copia por hilo la da, sí, pero entra sin inicializar y el " +
        "primer incremento suma sobre basura. Es el error más repetido con esta " +
        "cláusula."
    }
  },
  {
    id: "salida",
    correcta: "shared",
    razones: {
      correcta: "Sí. El resultado tiene que quedar afuera, y cada hilo escribe " +
        "posiciones distintas, así que no se pisan entre ellos.",
      private: "Con private cada hilo escribe en su propia copia y al cerrar la " +
        "región las cuatro copias se descartan: afuera el arreglo queda igual " +
        "que antes.",
      firstprivate: "firstprivate copia el arreglo a cada hilo y tampoco se ve " +
        "afuera. Los resultados se irían con las copias al cerrar la región."
    }
  }
];

function contarAciertos(respuestas) {
  return respuestas.filter(function (r) { return r.primera === "correcta"; }).length;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    INICIAL: INICIAL, HILOS: HILOS, ESCRITURAS: ESCRITURAS, CLAUSULAS: CLAUSULAS,
    TABLA: TABLA, NOTAS: NOTAS, CASOS: CASOS,
    filaTabla: filaTabla, operador: operador, lineasPrograma: lineasPrograma,
    ejecutar: ejecutar, textoEntrada: textoEntrada, textoEscritura: textoEscritura,
    textoAfuera: textoAfuera, explicarPrediccion: explicarPrediccion,
    contarAciertos: contarAciertos
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;
  var clausula = null;          // ninguna escogida al abrir
  var vistas = {};              // clausulas que ya se miraron en la carta 3
  var destapada = false;        // columnas de la tabla de la carta 4
  var respuestas = [];
  var comprobada = false;       // la prediccion de la carta 2 ya se comprobo

  function pintarPresets() {
    document.querySelectorAll("[data-clausula]").forEach(function (b) {
      b.classList.toggle("activo", b.dataset.clausula === clausula);
    });
  }

  function pintarCodigo() {
    var caja = document.getElementById("codigo-clausula");
    caja.hidden = !clausula;
    if (!clausula) {
      caja.innerHTML = "";
      return;
    }
    caja.innerHTML = lineasPrograma(clausula).map(function (l, i) {
      return "<div class=\"linea bloque-1\"><span class=\"num\">" + (i + 1) +
        "</span><span class=\"txt\">" + l + "</span></div>";
    }).join("");
  }

  function pintarHilos() {
    if (!clausula) {
      document.getElementById("cuerpo-hilos").innerHTML =
        "<tr><td class=\"pend\" colspan=\"4\">?</td></tr>";
      document.getElementById("linea-afuera").textContent = "";
      Motor.pintarChips("chips-clausula", []);
      document.getElementById("nota-clausula").textContent = "";
      return;
    }
    var r = ejecutar(clausula, INICIAL, ESCRITURAS, HILOS);
    document.getElementById("cuerpo-hilos").innerHTML = r.dentro.map(function (v, i) {
      var entra = v === null
        ? "<td class=\"pend\">sin inicializar</td>"
        : "<td class=\"cod\">" + num(v) + "</td>";
      return "<tr><td>hilo " + num(i) + "</td>" + entra +
        "<td class=\"cod\">" + textoEscritura(clausula, i) + "</td>" +
        "<td class=\"cod\"><b>" + num(r.despues[i]) + "</b></td></tr>";
    }).join("");
    document.getElementById("linea-afuera").textContent = textoAfuera(clausula);
    var f = filaTabla(clausula);
    Motor.pintarChips("chips-clausula", [
      { texto: "¿copia por hilo?", valor: f.copia },
      { texto: "¿valor al entrar?", valor: f.entrada },
      { texto: "¿se ve afuera?", valor: f.afuera, cuenta: true }
    ]);
    document.getElementById("nota-clausula").textContent = NOTAS[clausula];
  }

  function pintarProgreso() {
    var cuantas = CLAUSULAS.filter(function (c) { return vistas[c]; }).length;
    document.getElementById("progreso-clausula").textContent = clausula
      ? clausula + "(x) con " + num(HILOS) + " hilos · " + num(cuantas) + " de " +
        num(CLAUSULAS.length) + " cláusulas miradas"
      : comprobada
        ? "Escoja una cláusula para ver qué hace con las cuatro copias de x."
        : "Primero haga su predicción en la carta 2 y compruébela.";
  }

  function pintarTabla() {
    var pend = "<td class=\"pend\">?</td>";
    document.getElementById("cuerpo-tabla").innerHTML = TABLA.map(function (f) {
      var celdas = destapada
        ? "<td>" + f.copia + "</td><td>" + f.entrada + "</td><td>" + f.afuera + "</td>"
        : pend + pend + pend;
      return "<tr><td class=\"cod\">" + f.clausula + "</td>" + celdas + "</tr>";
    }).join("");
    document.getElementById("nota-tabla").textContent = destapada
      ? "Una variable declarada antes de la región es shared si no se dice otra " +
        "cosa, y por eso escribir en ella exige protección."
      : "Las tres columnas se destapan al mirar las tres cláusulas arriba, o al " +
        "responder el primer caso de abajo.";
  }

  function pintarMarcador() {
    Motor.pintarChips("panel-marcador", [
      { texto: "a la primera", valor: num(contarAciertos(respuestas)) + " de " +
        num(CASOS.length), cuenta: true },
      { texto: "respondidos", valor: num(respuestas.length) }
    ]);
  }

  function destapar() {
    if (destapada || !comprobada) { return; }
    destapada = true;
    pintarTabla();
  }

  document.querySelectorAll("[data-clausula]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (!comprobada) {
        document.getElementById("progreso-clausula").textContent =
          "Primero haga su predicción en la carta 2 y compruébela.";
        return;
      }
      clausula = b.dataset.clausula;
      vistas[clausula] = true;
      pintarPresets();
      pintarCodigo();
      pintarHilos();
      pintarProgreso();
      if (CLAUSULAS.every(function (c) { return vistas[c]; })) { destapar(); }
    });
  });

  Motor.conectarPrediccion(
    { entrada: "prediccion-x", boton: "btn-comprobar-x", veredicto: "veredicto-x" },
    function () { return ejecutar("private", INICIAL, ESCRITURAS, HILOS).afuera; },
    explicarPrediccion);

  document.getElementById("btn-comprobar-x").addEventListener("click", function () {
    if (!isNaN(Motor.leerNumero("prediccion-x"))) {
      document.getElementById("aviso-copia").hidden = false;
      comprobada = true;
      if (respuestas.length) { destapar(); }
      pintarProgreso();
    }
  });

  CASOS.forEach(function (c) {
    Motor.conectarOpciones("opciones-" + c.id, "veredicto-" + c.id, c.razones);
    document.querySelectorAll("#opciones-" + c.id + " button").forEach(function (b) {
      b.addEventListener("click", function () {
        var ya = respuestas.filter(function (r) { return r.id === c.id; }).length;
        if (!ya) {
          respuestas.push({ id: c.id, primera: b.dataset.op });
          pintarMarcador();
        }
        destapar();
      });
    });
  });

  pintarPresets();
  pintarCodigo();
  pintarHilos();
  pintarProgreso();
  pintarTabla();
  pintarMarcador();
})();

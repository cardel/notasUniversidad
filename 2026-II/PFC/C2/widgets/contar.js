/* Contar: cuántas multiplicaciones hace factorial(n), y qué queda esperando
   mientras tanto. La simulación reproduce 01_factorial_recursivo.scala. */
(function () {
  var CODIGO = [
    { txt: "def factorial(n: Int): Int =", num: null },
    { txt: "  if (n == 0) 1", num: 1 },
    { txt: "  else n * factorial(n - 1)", num: 2 }
  ];

  /* Un paso por línea que se ejecuta. En la bajada, cada entrada a la línea 2
     deja una multiplicación esperando; en la subida, cada una se resuelve. */
  function simular(n) {
    var pasos = [];
    var k;
    for (k = n; k >= 1; k = k - 1) {
      pasos.push({ linea: 2, n: k, hechas: 0, esperando: n - k + 1,
                   fase: "bajando" });
    }
    pasos.push({ linea: 1, n: 0, hechas: 0, esperando: n, fase: "caso base" });
    for (k = 1; k <= n; k = k + 1) {
      pasos.push({ linea: null, n: k, hechas: k, esperando: n - k,
                   fase: "subiendo" });
    }
    return pasos;
  }

  var API = { simular: simular, CODIGO: CODIGO };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  /* La pila dibujada: una caja por multiplicación que espera. */
  function pintarPila(e) {
    var caja = document.getElementById("pila");
    caja.innerHTML = "";
    var esperando = e.actual ? e.actual.esperando : 0;
    var i;
    for (i = esperando; i >= 1; i = i - 1) {
      var marco = document.createElement("div");
      marco.className = "marco";
      var nAquel = e.params - i + 1;
      marco.textContent = nAquel + " * ___";
      caja.appendChild(marco);
    }
    var pie = document.getElementById("pie-pila");
    if (!e.actual) {
      pie.textContent = "Todavía no ha entrado nadie.";
    } else if (e.actual.fase === "bajando") {
      pie.textContent = "factorial(" + e.actual.n + ") entró y dejó su multiplicación esperando.";
    } else if (e.actual.fase === "caso base") {
      pie.textContent = "factorial(0) devuelve 1. La pila está en su punto más alto: "
        + e.actual.esperando + " multiplicaciones esperando.";
    } else if (!e.terminado) {
      pie.textContent = "Se resolvió una multiplicación. Quedan " + e.actual.esperando + ".";
    } else {
      pie.textContent = "Listo: " + e.actual.hechas + " multiplicaciones en total, y la pila vacía.";
    }
  }

  Motor.iniciar({
    codigo: CODIGO,
    paramsIniciales: 4,
    chips: [
      { campo: "n", rotulo: "n" },
      { campo: "hechas", rotulo: "multiplicaciones hechas" },
      { campo: "esperando", rotulo: "esperando", clase: "alerta" }
    ],
    simular: simular,
    alPintar: pintarPila
  });

  Motor.prediccionNumerica(function (valor, n) {
    if (valor === n) {
      return { ok: true, msg: "Correcto: factorial(" + n + ") hace " + n
        + " multiplicaciones, una por cada llamada que no es el caso base." };
    }
    if (valor === n + 1) {
      return { ok: false, msg: "Casi. Son " + n + ". Hay " + (n + 1)
        + " llamadas, pero factorial(0) no multiplica: devuelve 1 y ya." };
    }
    return { ok: false, msg: "No. Son " + n + ". Avance paso a paso y mire el contador de la "
      + "línea del else: sube uno por cada llamada con n > 0." };
  });

  document.querySelectorAll("[data-preset]").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("[data-preset]").forEach(function (o) { o.className = ""; });
      b.className = "primario";
      Motor.limpiarVeredicto();
      document.getElementById("prediccion").value = "";
      Motor.reiniciar(parseInt(b.getAttribute("data-preset"), 10));
    });
  });
})();

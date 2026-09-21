/* Suma2: suma2(f, prox) devuelve sumaF sin correrla. Se predice el valor de
   g(1, 3) + g(4, 5) y cuántas veces corre el if de sumaF, y los contadores
   lo confirman. Los números (15, 7 y 0) salen de 04_funciones_devuelven_
   funciones.scala corrido con scala-cli. */
(function () {
  var CODIGO = [
    { txt: "def suma2(f: Int => Int, prox: Int => Int): (Int, Int) => Int = {", num: null },
    { txt: "  def sumaF(a: Int, b: Int): Int =", num: null },
    { txt: "    if (a > b) 0", num: 1 },
    { txt: "    else f(a) + sumaF(prox(a), b)", num: 2 },
    { txt: "  sumaF", num: 3 },
    { txt: "}", num: null },
    { txt: "", num: null },
    { txt: "val g = suma2(x => x, x => x + 1)", num: 4 },
    { txt: "g(1, 3) + g(4, 5)", num: 5 }
  ];

  function llamada(a, b, pasos, rotulo) {
    var acumulado = 0, x = a;
    while (x <= b) {
      pasos.push({ linea: 1, a: x, b: b, llamada: rotulo, acumulado: null });
      pasos.push({ linea: 2, a: x, b: b, llamada: rotulo, acumulado: null });
      x = x + 1;
    }
    pasos.push({ linea: 1, a: x, b: b, llamada: rotulo, acumulado: 0 });
    while (x > a) { x = x - 1; acumulado = acumulado + x; pasos.push({ linea: null, a: x, b: b, llamada: rotulo + " sube", acumulado: acumulado }); }
    return acumulado;
  }

  function simular() {
    var pasos = [];
    pasos.push({ linea: 4, a: "–", b: "–", llamada: "val g", acumulado: null });
    pasos.push({ linea: 3, a: "–", b: "–", llamada: "val g", acumulado: null });
    pasos.push({ linea: 5, a: "–", b: "–", llamada: "g(1, 3) + g(4, 5)", acumulado: null });
    var v1 = llamada(1, 3, pasos, "g(1, 3)");
    var v2 = llamada(4, 5, pasos, "g(4, 5)");
    pasos.push({ linea: 5, a: "–", b: "–", llamada: "g(1, 3) + g(4, 5)", acumulado: v1 + v2 });
    return pasos;
  }

  function cuenta(pasos, linea) { return pasos.filter(function (p) { return p.linea === linea; }).length; }

  var API = { CODIGO: CODIGO, simular: simular, cuenta: cuenta };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  var PASOS = simular();
  var RESPUESTAS = { valor: 15, ifs: cuenta(PASOS, 1), ifsVal: 0 };
  var acertadas = {};

  function comprobar(id, esperado, bien, mal) {
    var inp = document.getElementById("pred-" + id), v = document.getElementById("ver-" + id);
    var valor = parseInt(inp.value, 10);
    if (isNaN(valor)) { v.className = "veredicto mal"; v.textContent = "Escriba un número primero."; return; }
    var ok = valor === esperado;
    v.className = "veredicto " + (ok ? "bien" : "mal");
    v.textContent = ok ? bien : mal;
    if (ok) { acertadas[id] = true; }
    if (Object.keys(acertadas).length === 3) { document.getElementById("carta-cierre").classList.remove("bloqueado"); }
  }

  document.getElementById("btn-valor").addEventListener("click", function () {
    comprobar("valor", RESPUESTAS.valor, "Correcto: (1 + 2 + 3) + (4 + 5) = 6 + 9 = 15.", "No. g suma los enteros del rango: g(1, 3) = 6 y g(4, 5) = 9.");
  });
  document.getElementById("btn-ifs").addEventListener("click", function () {
    comprobar("ifs", RESPUESTAS.ifs, "Correcto: 7. Cada llamada a sumaF evalúa el if una vez, incluida la que cierra: 4 en g(1, 3) y 3 en g(4, 5).", "No. Cuente las llamadas a sumaF, no los términos: la que llega con a > b también evalúa el if. Son 4 + 3.");
  });
  document.getElementById("btn-ifs-val").addEventListener("click", function () {
    comprobar("ifsVal", RESPUESTAS.ifsVal, "Correcto: 0. suma2 define sumaF y la devuelve; no la llama. Hasta que no llega un rango, no hay nada que sumar.", "No. En val g = suma2(…) el if no corre ni una vez: suma2 solo fabrica sumaF y la devuelve. Correrá cuando g reciba a y b.");
  });

  Motor.iniciar({
    codigo: CODIGO,
    paramsIniciales: 0,
    chips: [
      { campo: "llamada", rotulo: "en" },
      { campo: "a", rotulo: "a" },
      { campo: "b", rotulo: "b" },
      { campo: "acumulado", rotulo: "acumulado", clase: "alerta" }
    ],
    simular: function () { return PASOS; },
    alPintar: function (e) {
      var pie = document.getElementById("pie");
      if (!e.actual) { pie.textContent = ""; }
      else if (e.actual.linea === 4 || e.actual.linea === 3) { pie.textContent = "suma2 corre, define sumaF y la devuelve. El if de sumaF va en × 0."; }
      else if (e.terminado) { pie.textContent = "Fin: 6 + 9 = 15. El if corrió " + e.conteos[1] + " veces, todas después del val."; }
      else { pie.textContent = "El if lleva × " + (e.conteos[1] || 0) + "."; }
    }
  });
})();

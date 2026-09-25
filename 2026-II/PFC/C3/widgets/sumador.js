/* Sumador: una función que fabrica funciones, seguida por sustitución. Los
   tres valores (8, 16, 10) salen de 13_sumador.scala y de correr las dos
   llamadas compuestas con scala-cli. */
(function () {
  var CASOS = [
    { rotulo: "sumador(5)(3)", valor: 8, guarda: { },
      pasos: [
        { expr: "sumador(5)(3)", regla: "Primero se reduce sumador(5): es una llamada como cualquier otra, y devuelve una función.", n: "–" },
        { expr: "((x: Int) => x + 5)(3)", regla: "sumador(5) es el literal con n reemplazado por 5. La función fabricada ya no sabe de sumador: solo recuerda el 5.", n: "5" },
        { expr: "3 + 5", regla: "Se aplica el literal a 3: x = 3.", n: "5" },
        { expr: "8", regla: "8.", n: "5" }
      ] },
    { rotulo: "val s = sumador(5); val t = sumador(s(1)); t(10)", valor: 16,
      pasos: [
        { expr: "val s = sumador(5)", regla: "s queda ligada a una función, no a un número.", n: "–" },
        { expr: "val s = (x: Int) => x + 5", regla: "La función guarda n = 5.", n: "s: 5" },
        { expr: "val t = sumador(s(1))", regla: "Por valor, el argumento s(1) se reduce antes de llamar a sumador.", n: "s: 5" },
        { expr: "val t = sumador(1 + 5)", regla: "s(1) es 1 + 5.", n: "s: 5" },
        { expr: "val t = sumador(6)", regla: "Ahora sí se llama a sumador, con 6.", n: "s: 5" },
        { expr: "val t = (x: Int) => x + 6", regla: "t es otra función, con su propio n = 6. s sigue guardando 5: son dos funciones distintas.", n: "s: 5 · t: 6" },
        { expr: "t(10)", regla: "Se aplica t a 10.", n: "s: 5 · t: 6" },
        { expr: "10 + 6", regla: "x = 10, n = 6.", n: "s: 5 · t: 6" },
        { expr: "16", regla: "16. Ni s ni sumador intervinieron en este último paso.", n: "s: 5 · t: 6" }
      ] },
    { rotulo: "aplicaDos(sumador(3), 4)", valor: 10,
      pasos: [
        { expr: "aplicaDos(sumador(3), 4)", regla: "Por valor, los argumentos se reducen antes de entrar: sumador(3) primero.", n: "–" },
        { expr: "aplicaDos((x: Int) => x + 3, 4)", regla: "El primer argumento ya es una función con n = 3. Llamémosla g.", n: "g: 3" },
        { expr: "g(g(4))", regla: "Cuerpo de aplicaDos con f = g, x = 4.", n: "g: 3" },
        { expr: "g(4 + 3)", regla: "El argumento interno se reduce primero: g(4) es 4 + 3.", n: "g: 3" },
        { expr: "g(7)", regla: "7.", n: "g: 3" },
        { expr: "7 + 3", regla: "Se aplica g otra vez.", n: "g: 3" },
        { expr: "10", regla: "10. sumador(3) se llamó una sola vez y su función se usó dos.", n: "g: 3" }
      ] }
  ];

  var API = { CASOS: CASOS };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  var actual = 0, k = 0, resueltos = {};

  function pintar() {
    var c = CASOS[actual];
    var caja = document.getElementById("panel-reduccion");
    caja.innerHTML = "";
    var i;
    for (i = 0; i <= k; i = i + 1) {
      var fila = document.createElement("div");
      fila.className = "reduccion" + (i === k ? " ultima" : "");
      var flecha = document.createElement("span");
      flecha.className = "flecha-red"; flecha.textContent = i === 0 ? "" : "→";
      var texto = document.createElement("code");
      texto.className = "expr"; texto.textContent = c.pasos[i].expr;
      fila.appendChild(flecha); fila.appendChild(texto);
      caja.appendChild(fila);
    }
    document.getElementById("regla").textContent = c.pasos[k].regla;
    document.getElementById("chip-n").textContent = c.pasos[k].n;
    document.getElementById("rotulo-caso").textContent = c.rotulo;
    document.getElementById("ver-paso").textContent = k;
    document.getElementById("ver-total").textContent = c.pasos.length - 1;
    document.querySelectorAll("[data-caso]").forEach(function (b, i) {
      b.className = (i === actual ? "primario" : "") + (resueltos[i] ? " hecho" : "");
    });
  }

  document.querySelectorAll("[data-caso]").forEach(function (b) {
    b.addEventListener("click", function () {
      actual = parseInt(b.getAttribute("data-caso"), 10); k = 0;
      document.getElementById("prediccion").value = "";
      document.getElementById("veredicto").className = "veredicto";
      document.getElementById("veredicto").textContent = "";
      document.getElementById("panel-ejecucion").classList.add("bloqueado");
      pintar();
    });
  });
  document.getElementById("btn-comprobar").addEventListener("click", function () {
    var c = CASOS[actual], v = document.getElementById("veredicto");
    var valor = parseInt(document.getElementById("prediccion").value, 10);
    if (isNaN(valor)) { v.className = "veredicto mal"; v.textContent = "Escriba un número primero."; return; }
    if (valor === c.valor) {
      v.className = "veredicto bien"; v.textContent = "Correcto: " + c.valor + ". Siga la sustitución para ver qué n guarda cada función.";
      resueltos[actual] = true;
      if (Object.keys(resueltos).length === CASOS.length) { document.getElementById("carta-cierre").classList.remove("bloqueado"); }
    } else {
      v.className = "veredicto mal"; v.textContent = "No es " + valor + ". Reduzca por valor: cada sumador(…) produce una función que recuerda su n, y los argumentos se reducen antes de entrar.";
    }
    document.getElementById("panel-ejecucion").classList.remove("bloqueado");
    pintar();
  });
  document.getElementById("btn-paso").addEventListener("click", function () { if (k < CASOS[actual].pasos.length - 1) { k = k + 1; } pintar(); });
  document.getElementById("btn-reiniciar").addEventListener("click", function () { k = 0; pintar(); });
  pintar();
})();

/* Precedencia: el cuerpo de un literal llega hasta donde la precedencia
   lo deje. Se predice el valor y luego se ve la reducción operación por
   operación. Los seis valores (8, 6, 11, 8, 7, 9, 3) salen de
   12_errores_anonimas.scala y de correr los literales con scala-cli. */
(function () {
  var CASOS = [
    { rotulo: "promedioMal(4, 8)", def: "val promedioMal = (x, y) => x + y / 2", valor: 8,
      pasos: ["4 + 8 / 2", "4 + 4", "8"],
      reglas: ["Se sustituyen x = 4, y = 8 en el cuerpo tal como está escrito.", "La división va primero: 8 / 2 = 4. El + no la agrupa.", "4 + 4 = 8. No es el promedio."] },
    { rotulo: "promedio(4, 8)", def: "val promedio = (x, y) => (x + y) / 2", valor: 6,
      pasos: ["(4 + 8) / 2", "12 / 2", "6"],
      reglas: ["Se sustituyen x = 4, y = 8.", "El paréntesis obliga a sumar primero: 12.", "12 / 2 = 6."] },
    { rotulo: "promedioMal(7, 9)", def: "val promedioMal = (x, y) => x + y / 2", valor: 11,
      pasos: ["7 + 9 / 2", "7 + 4", "11"],
      reglas: ["Se sustituyen x = 7, y = 9.", "9 / 2 entre enteros es 4: la división descarta el resto.", "7 + 4 = 11."] },
    { rotulo: "promedio(7, 9)", def: "val promedio = (x, y) => (x + y) / 2", valor: 8,
      pasos: ["(7 + 9) / 2", "16 / 2", "8"],
      reglas: ["Se sustituyen x = 7, y = 9.", "Primero la suma: 16.", "16 / 2 = 8."] },
    { rotulo: "f1(3)", def: "val f1 = (x: Int) => x * 2 + 1", valor: 7,
      pasos: ["3 * 2 + 1", "6 + 1", "7"],
      reglas: ["Se sustituye x = 3 en todo el cuerpo: el literal llega hasta el final de la línea.", "El * va antes que el +: 6.", "6 + 1 = 7."] },
    { rotulo: "f2(3)", def: "val f2 = (x: Int) => x * (2 + 1)", valor: 9,
      pasos: ["3 * (2 + 1)", "3 * 3", "9"],
      reglas: ["Se sustituye x = 3.", "El paréntesis va primero: 3.", "3 * 3 = 9."] },
    { rotulo: "f3(5)", def: "val f3 = (x: Int) => x - 1 * 2", valor: 3,
      pasos: ["5 - 1 * 2", "5 - 2", "3"],
      reglas: ["Se sustituye x = 5.", "1 * 2 se hace antes que la resta: 2. No es (5 - 1) * 2.", "5 - 2 = 3."] }
  ];

  var API = { CASOS: CASOS };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  var actual = 0;
  var k = 0;
  var resueltos = {};

  function pintar() {
    var c = CASOS[actual];
    document.getElementById("def-caso").textContent = c.def;
    document.getElementById("rotulo-caso").textContent = c.rotulo;
    var caja = document.getElementById("panel-reduccion");
    caja.innerHTML = "";
    var i;
    for (i = 0; i <= k && i < c.pasos.length; i = i + 1) {
      var fila = document.createElement("div");
      fila.className = "reduccion" + (i === k ? " ultima" : "");
      var flecha = document.createElement("span");
      flecha.className = "flecha-red"; flecha.textContent = i === 0 ? "" : "→";
      var texto = document.createElement("code");
      texto.className = "expr"; texto.textContent = c.pasos[i];
      fila.appendChild(flecha); fila.appendChild(texto);
      caja.appendChild(fila);
    }
    document.getElementById("regla").textContent = k < c.pasos.length ? c.reglas[k] : "";
    document.getElementById("ver-paso").textContent = k;
    document.getElementById("ver-total").textContent = c.pasos.length - 1;
    document.querySelectorAll("[data-caso]").forEach(function (b, i) {
      b.className = (i === actual ? "primario" : "") + (resueltos[i] ? " hecho" : "");
    });
  }

  document.querySelectorAll("[data-caso]").forEach(function (b) {
    b.addEventListener("click", function () {
      actual = parseInt(b.getAttribute("data-caso"), 10);
      k = 0;
      document.getElementById("prediccion").value = "";
      document.getElementById("veredicto").className = "veredicto";
      document.getElementById("veredicto").textContent = "";
      document.getElementById("panel-ejecucion").classList.add("bloqueado");
      pintar();
    });
  });
  document.getElementById("btn-comprobar").addEventListener("click", function () {
    var c = CASOS[actual];
    var v = document.getElementById("veredicto");
    var valor = parseInt(document.getElementById("prediccion").value, 10);
    if (isNaN(valor)) { v.className = "veredicto mal"; v.textContent = "Escriba un número primero."; return; }
    if (valor === c.valor) {
      v.className = "veredicto bien";
      v.textContent = "Correcto: " + c.valor + ". Ahora recórralo paso a paso.";
      resueltos[actual] = true;
      if (Object.keys(resueltos).length === CASOS.length) { document.getElementById("carta-cierre").classList.remove("bloqueado"); }
    } else {
      v.className = "veredicto mal";
      v.textContent = "No es " + valor + ". Escriba el cuerpo con los valores puestos y pregúntese qué operación va primero; el paso a paso lo muestra.";
    }
    document.getElementById("panel-ejecucion").classList.remove("bloqueado");
    pintar();
  });
  document.getElementById("btn-paso").addEventListener("click", function () {
    if (k < CASOS[actual].pasos.length - 1) { k = k + 1; }
    pintar();
  });
  document.getElementById("btn-reiniciar").addEventListener("click", function () { k = 0; pintar(); });
  pintar();
})();

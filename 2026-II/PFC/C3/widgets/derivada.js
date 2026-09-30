/* Derivada: derivada(cube, dx)(2) para tres dx, calculada con la expansión
   12 + 6·dx + dx² antes de ver lo que imprime el programa, y la segunda
   derivada como pregunta de opciones. Los flotantes salen de
   14_error_derivada.scala y de correr derivada(derivada(cube, dx), dx)(2). */
(function () {
  var FILAS = [
    { dx: "1.0", exacto: 19, impreso: "19.0" },
    { dx: "0.1", exacto: 12.61, impreso: "12.61000000000001" },
    { dx: "0.0001", exacto: 12.0006, impreso: "12.000600010022566" }
  ];
  function formula(dx) { return 12 + 6 * dx + dx * dx; }

  var SEGUNDA = {
    texto: "derivada(derivada(cube, 0.01), 0.01)(2)",
    opciones: [
      { txt: "cerca de 12", ok: true, msg: "Correcto: 12.059999999998183. Derivar dos veces x³ da 6x, que en 2 vale 12; el 0.06 de más es el error de aproximar dos veces con dx = 0.01. La segunda derivada se construye igual que la primera: derivada recibe una función y devuelve otra, y la de adentro ya era una función." },
      { txt: "cerca de 6", ok: false, msg: "No. 6 es la segunda derivada de x³ en x = 1, o el coeficiente de x. En x = 2 es 6 · 2 = 12; el programa imprime 12.06." },
      { txt: "cerca de 24", ok: false, msg: "No. 24 sería 6 · 4, como si se evaluara en x = 4. La derivada de la derivada de x³ es 6x; en 2 vale 12, y el programa imprime 12.06." },
      { txt: "no compila: derivada recibe una función, no otra derivada", ok: false, msg: "Sí compila. derivada(cube, 0.01) es de tipo Double => Double, exactamente lo que el parámetro f espera. Se puede anidar cuantas veces se quiera, e imprime 12.06." }
    ]
  };

  var API = { FILAS: FILAS, formula: formula, SEGUNDA: SEGUNDA };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  var hechas = {};
  function avanzar(id) {
    hechas[id] = true;
    if (hechas.tabla && hechas.segunda) { document.getElementById("carta-cierre").classList.remove("bloqueado"); }
  }

  document.getElementById("btn-comprobar-tabla").addEventListener("click", function () {
    var malas = 0, vacias = 0;
    FILAS.forEach(function (f, i) {
      var inp = document.getElementById("v-" + i);
      var v = parseFloat(inp.value.replace(",", "."));
      if (isNaN(v)) { vacias = vacias + 1; inp.className = ""; return; }
      var ok = Math.abs(v - f.exacto) < 0.0005;
      inp.className = ok ? "bien" : "mal";
      if (!ok) { malas = malas + 1; }
    });
    var ver = document.getElementById("veredicto-tabla");
    if (vacias > 0) { ver.className = "veredicto mal"; ver.textContent = "Faltan " + vacias + " casillas."; return; }
    if (malas === 0) {
      ver.className = "veredicto bien";
      ver.textContent = "Correcto: 19, 12.61 y 12.0006. El error es 6·dx + dx², y por eso cae con dx. Ahora compare con lo que imprime el programa.";
      FILAS.forEach(function (f, i) { document.getElementById("imp-" + i).textContent = f.impreso; });
      avanzar("tabla");
    } else {
      ver.className = "veredicto mal";
      ver.textContent = malas + " en rojo. Con la fórmula: 12 + 6·dx + dx². Para dx = 1 es 12 + 6 + 1; para 0.1 es 12 + 0.6 + 0.01.";
    }
  });

  var ops = document.getElementById("opciones-segunda");
  SEGUNDA.opciones.forEach(function (o) {
    var b = document.createElement("button");
    b.textContent = o.txt;
    b.addEventListener("click", function () {
      ops.querySelectorAll("button").forEach(function (x) { x.className = ""; });
      b.className = o.ok ? "primario" : "";
      var v = document.getElementById("veredicto-segunda");
      v.className = "veredicto " + (o.ok ? "bien" : "mal");
      v.textContent = o.msg;
      if (o.ok) { avanzar("segunda"); }
    });
    ops.appendChild(b);
  });
})();

/* Cuentas: llamadas y hondura de las tres versiones del factorial, para un
   n dado. Las del árbol salen de la función cuentas de la sesión y
   coinciden con 10_arbol_medido.scala. */
(function () {
  function cuentasArbol(i, j) {
    if (i >= j || i === j - 1) { return { llamadas: 1, hondura: 1 }; }
    var m = i + Math.floor((j - i) / 2);
    var a = cuentasArbol(i, m), b = cuentasArbol(m, j);
    return { llamadas: 1 + a.llamadas + b.llamadas, hondura: 1 + Math.max(a.hondura, b.hondura) };
  }

  /* Hondura = marcos de pila en el punto más hondo, como los midió la sesión. */
  function esperadas(n) {
    var arb = cuentasArbol(1, n + 1);
    return {
      factorial: { llamadas: n + 1, hondura: n + 1 },
      fact: { llamadas: n + 1, hondura: 1 },
      factArbol: { llamadas: arb.llamadas, hondura: arb.hondura }
    };
  }

  var API = { esperadas: esperadas, cuentasArbol: cuentasArbol };
  if (typeof module !== "undefined") { module.exports = API; }
  if (typeof document === "undefined") { return; }

  var FILAS = ["factorial", "fact", "factArbol"];
  var COLS = ["llamadas", "hondura"];
  var nActual = 8;

  function limpiar() {
    FILAS.forEach(function (f) { COLS.forEach(function (c) {
      var inp = document.getElementById(f + "-" + c);
      inp.value = ""; inp.className = "";
      document.getElementById("real-" + f + "-" + c).textContent = "";
    }); });
    document.getElementById("veredicto").className = "veredicto";
    document.getElementById("veredicto").textContent = "";
    document.getElementById("n-actual").textContent = nActual;
    document.getElementById("carta-cierre").classList.add("bloqueado");
  }

  document.getElementById("btn-comprobar").addEventListener("click", function () {
    var esp = esperadas(nActual), malas = 0, vacias = 0;
    FILAS.forEach(function (f) { COLS.forEach(function (c) {
      var inp = document.getElementById(f + "-" + c);
      var v = parseInt(inp.value, 10);
      var real = document.getElementById("real-" + f + "-" + c);
      if (isNaN(v)) { vacias = vacias + 1; inp.className = ""; return; }
      var bien = v === esp[f][c];
      inp.className = bien ? "bien" : "mal";
      real.textContent = bien ? "" : "→ " + esp[f][c];
      if (!bien) { malas = malas + 1; }
    }); });
    var ver = document.getElementById("veredicto");
    if (vacias > 0) {
      ver.className = "veredicto mal"; ver.textContent = "Faltan " + vacias + " casillas.";
    } else if (malas === 0) {
      ver.className = "veredicto bien";
      ver.textContent = "Las seis bien. Mire la columna de llamadas: el árbol hace más que las otras dos. Y mire la de hondura: es la única que no crece con n.";
      document.getElementById("carta-cierre").classList.remove("bloqueado");
    } else {
      ver.className = "veredicto mal";
      ver.textContent = malas + " casilla(s) en rojo; al lado está el valor. Fórmulas: lineal n + 1 y n + 1; cola n + 1 y 1; árbol 2n − 1 y ⌈log₂ n⌉ + 1.";
    }
  });

  document.querySelectorAll("[data-preset]").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("[data-preset]").forEach(function (o) { o.className = ""; });
      b.className = "primario";
      nActual = parseInt(b.getAttribute("data-preset"), 10);
      limpiar();
    });
  });

  limpiar();
})();

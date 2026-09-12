/* Ejercicio interactivo: cazar testigos (clase 6, notacion O). */
var EJERCICIO = (function () {
  /* T(n) = a*n + b, cota c*n. La pareja (c, k) sirve cuando la
     desigualdad a*n + b <= c*n vale para todo n >= k. */
  function cumple(a, b, c, k, n) {
    return a * n + b <= c * n;
  }

  function valida(a, b, c, k) {
    /* Con c <= a la desigualdad falla siempre; con c > a, falla
       exactamente mientras (c - a) * n < b. */
    return c > a && (c - a) * k >= b;
  }

  function contraejemplo(a, b, c, k) {
    var n = k;
    var tope = k + 100000;
    while (n < tope && cumple(a, b, c, k, n)) {
      n = n + 1;
    }
    return n;
  }

  function primeraNCuadrado() {
    /* Primer n con 3n + 4 <= n^2. */
    var n = 1;
    while (3 * n + 4 > n * n) {
      n = n + 1;
    }
    return n;
  }

  return {
    cumple: cumple,
    valida: valida,
    contraejemplo: contraejemplo,
    primeraNCuadrado: primeraNCuadrado
  };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {

    /* --- Tarjeta 1: el experimento 3n + 4 contra n^2 ------------- */
    function tablaExperimento() {
      var cuerpo = document.getElementById("cuerpo-experimento");
      cuerpo.innerHTML = "";
      var n;
      for (n = 1; n <= 6; n = n + 1) {
        var t = 3 * n + 4;
        var g = n * n;
        var ok = t <= g;
        var tr = document.createElement("tr");
        tr.innerHTML = "<td>" + n + "</td><td>" + t + "</td><td>" + g +
          "</td><td>" + (ok ? "sí" : "no") + "</td>";
        if (ok) { tr.style.background = "var(--verde-suave)"; }
        cuerpo.appendChild(tr);
      }
      document.getElementById("tabla-experimento").style.display = "block";
    }

    document.getElementById("btn-experimento").addEventListener("click", function () {
      var v = document.getElementById("veredicto-experimento");
      var valor = parseInt(document.getElementById("prediccion-experimento").value, 10);
      var esperado = EJERCICIO.primeraNCuadrado();
      if (isNaN(valor)) {
        v.className = "veredicto mal";
        v.textContent = "Escriba un número primero.";
      } else if (valor === esperado) {
        v.className = "veredicto bien";
        v.textContent = "Correcto: desde n = " + esperado + " la parábola no vuelve a " +
          "perder. Ese punto de arranque es la k de la definición; aquí funcionó " +
          "sin ayuda de constante (c = 1). Mire la tabla.";
        tablaExperimento();
      } else if (valor < esperado) {
        v.className = "veredicto mal";
        v.textContent = "En n = " + valor + ": 3n + 4 = " + (3 * valor + 4) +
          " y n² = " + (valor * valor) + ". Todavía gana la recta; siga probando.";
      } else {
        v.className = "veredicto mal";
        v.textContent = "En n = " + valor + " sí se cumple, pero ya venía " +
          "cumpliéndose desde antes. Se pide el primer n.";
      }
    });

    /* --- Tarjetas 2 y 3: cazar testigos --------------------------- */
    function armarCazador(ids, a, b, nombreT) {
      var encontrados = [];

      document.getElementById(ids.boton).addEventListener("click", function () {
        var c = parseInt(document.getElementById(ids.c).value, 10);
        var k = parseInt(document.getElementById(ids.k).value, 10);
        var v = document.getElementById(ids.veredicto);
        if (isNaN(c) || isNaN(k) || c < 1 || k < 1) {
          v.className = "veredicto mal";
          v.textContent = "Escriba una c y una k, ambas de 1 en adelante.";
          return;
        }
        if (EJERCICIO.valida(a, b, c, k)) {
          var clave = c + "," + k;
          var nueva = encontrados.indexOf(clave) < 0;
          if (nueva) { encontrados.push(clave); }
          var fichas = document.getElementById(ids.fichas);
          if (nueva) {
            var ficha = document.createElement("span");
            ficha.className = "ficha";
            ficha.textContent = "c = " + c + ", k = " + k;
            fichas.appendChild(ficha);
          }
          v.className = "veredicto bien";
          if (encontrados.length >= 2) {
            v.textContent = "Sirve: desde n = " + k + ", " + nombreT + " no supera a " +
              c + "n. Ya tiene " + encontrados.length + " parejas distintas: los " +
              "testigos no son únicos. Una c más apretada se paga con una k más " +
              "lejana, y cualquier pareja válida demuestra el teorema.";
          } else {
            v.textContent = "¡Sirve! Desde n = " + k + ", " + nombreT + " no supera a " +
              c + "n. Compruébelo en n = " + k + ": " + (a * k + b) + " ≤ " + (c * k) +
              ". ¿Puede encontrar otra pareja distinta?";
          }
        } else if (c <= a) {
          v.className = "veredicto mal";
          v.textContent = "Con c = " + c + " se pide " + a + "n + " + b + " ≤ " + c +
            "n, y eso obliga a " + b + " ≤ " + (c - a) + "n: ningún k lo salva. La c " +
            "tiene que superar al coeficiente " + a + " del término que manda.";
        } else {
          var ce = EJERCICIO.contraejemplo(a, b, c, k);
          v.className = "veredicto mal";
          v.textContent = "Falla en n = " + ce + ": " + nombreT + " da " +
            (a * ce + b) + " y " + c + "n da " + (c * ce) + ". La c alcanza, pero el " +
            "arranque quedó corto: suba la k.";
        }
      });
    }

    armarCazador(
      { boton: "btn-cazar1", c: "c1", k: "k1", veredicto: "veredicto-cazar1", fichas: "fichas1" },
      3, 4, "3n + 4"
    );
    armarCazador(
      { boton: "btn-cazar2", c: "c2", k: "k2", veredicto: "veredicto-cazar2", fichas: "fichas2" },
      5, 5, "5n + 5"
    );

    /* --- Tarjeta 4: la pareja que no sirve ------------------------ */
    Array.prototype.forEach.call(document.querySelectorAll("#opciones-cierre button"), function (btn) {
      btn.addEventListener("click", function () {
        var v = document.getElementById("veredicto-cierre");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          v.className = "veredicto bien";
          v.textContent = "Exacto: con c = 2 se pide 2n + 10 ≤ 2n, es decir 10 ≤ 0, " +
            "y ni k = 1000 ni ninguna otra lo arregla. La c debe superar al " +
            "coeficiente del término que manda; la k solo paga los términos menores.";
        } else if (op === "holgada") {
          v.className = "veredicto mal";
          v.textContent = "c = 12 con k = 1 sí sirve: 2n + 10 ≤ 2n + 10n = 12n desde " +
            "n = 1. Es la jugada de inflar el término suelto.";
        } else if (op === "apretada") {
          v.className = "veredicto mal";
          v.textContent = "c = 3 con k = 10 sí sirve: 2n + 10 ≤ 3n equivale a " +
            "10 ≤ n. La c apretada se pagó con la k.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "c = 12 con k = 5 sí sirve: si la desigualdad vale desde " +
            "n = 1, con mayor razón vale desde n = 5.";
        }
      });
    });
  })();
}

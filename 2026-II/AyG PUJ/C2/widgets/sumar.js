/* Ejercicio interactivo: sumarArreglo (clase 2, invariantes de ciclo). */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "def sumarArreglo(A):",   num: null },
    { txt: "    i = 0",              num: 1 },
    { txt: "    ans = 0",             num: 2 },
    { txt: "    while i < len(A):",  num: 3 },
    { txt: "        ans = ans + A[i]", num: 4 },
    { txt: "        i = i + 1",      num: 5 },
    { txt: "    return ans",          num: 6 }
  ];

  function simular(params) {
    var A = params.A;
    var pasos = [];
    var i = null, ans = null;
    function snap(linea, extra) {
      var p = { linea: linea, i: i, ans: ans };
      if (extra) { for (var c in extra) { p[c] = extra[c]; } }
      pasos.push(p);
    }
    i = 0; snap(1);
    ans = 0; snap(2);
    var corriendo = true;
    while (corriendo) {
      snap(3, { chequeo: true });
      if (i < A.length) {
        ans = ans + A[i]; snap(4);
        i = i + 1; snap(5);
      } else {
        corriendo = false;
      }
    }
    snap(6);
    return pasos;
  }

  function sumaPrefijo(A, k) {
    var s = 0;
    var t = 0;
    while (t < k) {
      s = s + A[t];
      t = t + 1;
    }
    return s;
  }

  return { codigo: CODIGO, simular: simular, sumaPrefijo: sumaPrefijo };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var PRESETS = [
      { A: [9, 4, -5, 1, 8, 3] },
      { A: [3, 1, 3] },
      { A: [7] }
    ];
    var patronOK = false;
    var cotasOK = false;

    function alPintar(e) {
      var A = e.params.A;
      var cuerpo = document.getElementById("cuerpo-estados");
      cuerpo.innerHTML = "";
      var fila = 0;
      var m;
      for (m = 0; m < e.k; m = m + 1) {
        var p = e.pasos[m];
        if (p.chequeo) {
          fila = fila + 1;
          var patron;
          if (patronOK) {
            patron = p.i === 0
              ? "suma vacía = 0 ✓"
              : "A[0] + … + A[" + (p.i - 1) + "] = " +
                EJERCICIO.sumaPrefijo(A, p.i) + " ✓";
          } else {
            patron = "…";
          }
          var tr = document.createElement("tr");
          tr.innerHTML = "<td>" + fila + "</td><td>" + p.i + "</td><td>" +
            p.ans + "</td><td" + (patronOK ? "" : " class='pend'") + ">" +
            patron + "</td>";
          cuerpo.appendChild(tr);
        }
      }
      if (fila === 0) {
        var trv = document.createElement("tr");
        trv.innerHTML = "<td colspan='4' class='pend'>Ejecute: cada chequeo del while agrega una fila.</td>";
        cuerpo.appendChild(trv);
      }
      document.getElementById("col-patron").textContent = patronOK
        ? "I₁: ans = A[0..i)"
        : "¿Qué se repite?";
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo,
      simular: EJERCICIO.simular,
      chips: [
        { campo: "i", rotulo: "i" },
        { campo: "ans", rotulo: "ans", clase: "cuenta" }
      ],
      paramsIniciales: PRESETS[0],
      alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor, params) {
      var A = params.A;
      var esperado = EJERCICIO.sumaPrefijo(A, A.length);
      var mayor = A[0];
      A.forEach(function (v) { if (v > mayor) { mayor = v; } });
      if (valor === esperado) {
        return { ok: true, msg: "Correcto: la suma es " + esperado +
          ". Ahora ejecute y fíjese en la pareja (i, ans) de cada chequeo." };
      }
      if (valor === mayor) {
        return { ok: false, msg: "Ese es el mayor elemento; ans acumula la suma " +
          "de todos." };
      }
      if (valor === A.length) {
        return { ok: false, msg: "Ese es el número de elementos, no su suma." };
      }
      return { ok: false, msg: "No coincide. Sume a mano los elementos del arreglo." };
    });

    Array.prototype.forEach.call(document.querySelectorAll(".presets button"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll(".presets button"), function (b) {
          b.classList.remove("primario");
        });
        btn.classList.add("primario");
        Motor.limpiarVeredicto();
        Motor.reiniciar(PRESETS[parseInt(btn.getAttribute("data-preset"), 10)]);
      });
    });

    /* ---- tarjeta 4: los dos invariantes ---- */
    function revisarDescubrimiento() {
      if (patronOK && cotasOK) {
        document.getElementById("paso-1").classList.remove("bloqueado");
        document.getElementById("nota-pasos").innerHTML = "Invariantes: " +
          "<b>I₀: 0 ≤ i ≤ N</b> e <b>I₁: ans = A[0] + … + A[i−1]</b>. " +
          "El teorema a demostrar: <b>Teorema 1 — los invariantes I₀ e I₁ se " +
          "cumplen.</b>";
      }
    }

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-patron button"), function (btn) {
      btn.addEventListener("click", function () {
        var v = document.getElementById("veredicto-patron");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          patronOK = true;
          v.className = "veredicto bien";
          v.textContent = "Ese es I₁: en cada chequeo, ans lleva la suma de los " +
            "primeros i elementos (el elemento A[i] todavía no entra). La tabla " +
            "ya lo verifica fila por fila.";
          Motor.repintar();
          revisarDescubrimiento();
        } else if (op === "masuno") {
          v.className = "veredicto mal";
          v.textContent = "Mire la primera fila: con i = 0, esa fórmula pediría " +
            "ans = A[0], pero ans vale 0. El elemento A[i] entra en la vuelta, no antes.";
        } else if (op === "solo") {
          v.className = "veredicto mal";
          v.textContent = "Mire la fila i = 2 del arreglo inicial: A[2] = −5 pero " +
            "ans marca 13. ans no guarda un elemento: acumula.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "Esa es la poscondición, la meta: solo se cumple en la " +
            "última fila. El invariante debe valer en todas, empezando por (0, 0).";
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-cotas button"), function (btn) {
      btn.addEventListener("click", function () {
        var v = document.getElementById("veredicto-cotas");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          cotasOK = true;
          v.className = "veredicto bien";
          v.textContent = "Ese es I₀: i arranca en 0 y el último chequeo ocurre " +
            "justo con i = N, cuando la condición i < N por fin falla.";
          revisarDescubrimiento();
        } else if (op === "estricta") {
          v.className = "veredicto mal";
          v.textContent = "Mire el último chequeo de la tabla: i llega a N. Es " +
            "justo ese chequeo el que hace terminar el ciclo, y el invariante " +
            "también debe cubrirlo.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "El primer chequeo ocurre con i = 0, antes de la " +
            "primera vuelta. La cota inferior debe dejarlo entrar.";
        }
      });
    });

    /* ---- tarjeta 5: la demostración ---- */
    function completarPaso(idPaso, idSiguiente) {
      document.getElementById(idPaso).classList.add("hecho");
      if (idSiguiente) {
        document.getElementById(idSiguiente).classList.remove("bloqueado");
      }
    }

    Array.prototype.forEach.call(document.querySelectorAll("#paso-1 .opciones button"), function (btn) {
      btn.addEventListener("click", function () {
        var v = document.getElementById("veredicto-p1");
        if (btn.getAttribute("data-p1") === "00") {
          v.className = "veredicto bien";
          v.textContent = "Correcto: i = 0 (línea 1) y ans = 0 (línea 2).";
          completarPaso("paso-1", "paso-2");
        } else {
          v.className = "veredicto mal";
          v.textContent = "Relea las líneas 1 y 2: las dos variables arrancan en 0.";
        }
      });
    });

    document.getElementById("btn-p2").addEventListener("click", function () {
      completarPaso("paso-2", "paso-3");
    });

    Array.prototype.forEach.call(document.querySelectorAll("#paso-3 .opciones button"), function (btn) {
      btn.addEventListener("click", function () {
        var v = document.getElementById("veredicto-p3");
        var op = btn.getAttribute("data-p3");
        if (op === "n") {
          v.className = "veredicto bien";
          v.textContent = "Correcto: la condición es i < N, así que el primer " +
            "chequeo que falla es i = N. (Ojo: con i <= N habría terminado en " +
            "N + 1, como en el factorial.)";
          completarPaso("paso-3", null);
          document.getElementById("conclusion").style.display = "block";
        } else if (op === "n1") {
          v.className = "veredicto mal";
          v.textContent = "Eso pasaría si la condición fuera i <= N. Aquí es " +
            "i < N: mire el último chequeo de la tabla.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "Con i = N − 1 la condición i < N todavía se cumple y " +
            "el ciclo da una vuelta más.";
        }
      });
    });
  })();
}

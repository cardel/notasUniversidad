/* Ejercicio interactivo: fact (clase 2, invariantes de ciclo). */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "def fact(N):",          num: null },
    { txt: "    ans = 1",           num: 1 },
    { txt: "    i = 1",             num: 2 },
    { txt: "    while i <= N:",     num: 3 },
    { txt: "        ans = ans * i", num: 4 },
    { txt: "        i = i + 1",     num: 5 },
    { txt: "    return ans",        num: 6 }
  ];

  function factorialDe(k) {
    var f = 1;
    var t = 1;
    while (t <= k) {
      f = f * t;
      t = t + 1;
    }
    return f;
  }

  function simular(params) {
    var N = params.n;
    var pasos = [];
    var i = null, ans = null;
    function snap(linea, extra) {
      var p = { linea: linea, i: i, ans: ans };
      if (extra) { for (var c in extra) { p[c] = extra[c]; } }
      pasos.push(p);
    }
    ans = 1; snap(1);
    i = 1; snap(2);
    var corriendo = true;
    while (corriendo) {
      snap(3, { chequeo: true });
      if (i <= N) {
        ans = ans * i; snap(4);
        i = i + 1; snap(5);
      } else {
        corriendo = false;
      }
    }
    snap(6);
    return pasos;
  }

  return { codigo: CODIGO, simular: simular, factorialDe: factorialDe };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var patronOK = false;
    var cotasOK = false;

    function alPintar(e) {
      var cuerpo = document.getElementById("cuerpo-estados");
      cuerpo.innerHTML = "";
      var fila = 0;
      var m;
      for (m = 0; m < e.k; m = m + 1) {
        var p = e.pasos[m];
        if (p.chequeo) {
          fila = fila + 1;
          var patron = patronOK
            ? "(" + p.i + " − 1)! = " + EJERCICIO.factorialDe(p.i - 1) + " ✓"
            : "…";
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
        ? "I₁: ans = (i − 1)!"
        : "¿Qué se repite?";
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo,
      simular: EJERCICIO.simular,
      chips: [
        { campo: "i", rotulo: "i" },
        { campo: "ans", rotulo: "ans", clase: "cuenta" }
      ],
      paramsIniciales: { n: 5 },
      alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor, params) {
      var N = params.n;
      var esperado = EJERCICIO.factorialDe(N);
      if (valor === esperado) {
        return { ok: true, msg: "Correcto: fact(" + N + ") = " + esperado +
          ". Ahora ejecute y fíjese en la pareja (i, ans) de cada chequeo." };
      }
      if (valor === N * (N - 1)) {
        return { ok: false, msg: "Multiplicó solo los dos últimos factores. El " +
          "ciclo acumula todos: 1 · 2 · … · N." };
      }
      if (valor === Math.pow(2, N)) {
        return { ok: false, msg: "Eso sería duplicar en cada vuelta. Aquí el " +
          "factor cambia: en la vuelta con i = k se multiplica por k." };
      }
      if (valor === N) {
        return { ok: false, msg: "Ese es el número de vueltas. ans acumula el " +
          "producto de todas." };
      }
      return { ok: false, msg: "No coincide. Recuerde: N! = 1 · 2 · … · N." };
    });

    document.getElementById("rango-n").addEventListener("input", function (ev) {
      var N = parseInt(ev.target.value, 10);
      document.getElementById("ver-n").textContent = N;
      document.getElementById("pred-n").textContent = N;
      Motor.limpiarVeredicto();
      Motor.reiniciar({ n: N });
    });

    /* ---- tarjeta 4: los dos invariantes ---- */
    function revisarDescubrimiento() {
      if (patronOK && cotasOK) {
        document.getElementById("paso-1").classList.remove("bloqueado");
        document.getElementById("nota-pasos").innerHTML = "Invariantes: " +
          "<b>I₀: 1 ≤ i ≤ N + 1</b> e <b>I₁: ans = (i − 1)!</b>. El teorema a " +
          "demostrar: <b>Teorema 1 — los invariantes I₀ e I₁ se cumplen.</b>";
      }
    }

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-patron button"), function (btn) {
      btn.addEventListener("click", function () {
        var v = document.getElementById("veredicto-patron");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          patronOK = true;
          v.className = "veredicto bien";
          v.textContent = "Ese es I₁: en cada chequeo, ans lleva multiplicados " +
            "los factores 1, 2, …, i − 1 (el factor i entra en la vuelta, no " +
            "antes). La tabla ya lo verifica fila por fila.";
          Motor.repintar();
          revisarDescubrimiento();
        } else if (op === "ifact") {
          v.className = "veredicto mal";
          v.textContent = "Mire la fila i = 2: esa fórmula pediría ans = 2! = 2, " +
            "pero ans marca 1. El factor i todavía no ha entrado al producto.";
        } else if (op === "meta") {
          v.className = "veredicto mal";
          v.textContent = "Esa es la poscondición: solo se cumple al final. En la " +
            "primera fila ans vale 1, no N!.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "Mire la primera fila: i · (i − 1) = 1 · 0 = 0, pero " +
            "ans vale 1. Se rompe de entrada.";
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
          v.textContent = "Ese es I₀. La condición es i <= N, así que el último " +
            "chequeo ocurre con i = N + 1: la cota superior debe dejarlo entrar. " +
            "Compare con sumarArreglo, que usa < y termina en N.";
          revisarDescubrimiento();
        } else if (op === "corta") {
          v.className = "veredicto mal";
          v.textContent = "Mire el último chequeo de la tabla: i llega a N + 1. " +
            "Con la condición i <= N, ese es justo el chequeo que termina el ciclo.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "Nunca se rompe, pero es más floja de lo necesario: i " +
            "jamás vale 0, porque arranca en 1. Las cotas útiles se leen " +
            "ajustadas del código.";
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
        if (btn.getAttribute("data-p1") === "uno") {
          v.className = "veredicto bien";
          v.textContent = "Correcto: 0! se define como 1, el producto vacío.";
          completarPaso("paso-1", "paso-2");
        } else {
          v.className = "veredicto mal";
          v.textContent = "0! se define como 1 (el producto vacío). Por eso ans " +
            "arranca en 1 y no en 0.";
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
        if (op === "n1") {
          v.className = "veredicto bien";
          v.textContent = "Correcto: el primer chequeo que falla la condición " +
            "i <= N es i = N + 1. Mire la última fila de la traza.";
          completarPaso("paso-3", null);
          document.getElementById("conclusion").style.display = "block";
        } else if (op === "n") {
          v.className = "veredicto mal";
          v.textContent = "Con i = N la condición i <= N todavía se cumple y el " +
            "ciclo da una vuelta más. Eso pasaría si la condición fuera i < N, " +
            "como en sumarArreglo.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "El valor final de i sí depende de N (es N + 1), pero " +
            "la forma es siempre la misma: la cota superior de I₀.";
        }
      });
    });

    /* ---- tarjeta 6: N = -1 ---- */
    document.getElementById("btn-negativo").addEventListener("click", function () {
      var sec = document.getElementById("sec-negativo");
      sec.innerHTML = "";
      var ficha = document.createElement("span");
      ficha.className = "ficha";
      ficha.textContent = "(1, 1)";
      sec.appendChild(ficha);
      var flecha = document.createElement("span");
      flecha.className = "flecha";
      flecha.textContent = "→ chequeo: 1 ≤ −1 es falso → return 1";
      sec.appendChild(flecha);
      document.getElementById("alerta-negativo").style.display = "block";
    });
  })();
}

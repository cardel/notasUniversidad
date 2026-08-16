/* Ejercicio interactivo: triangulo (clase 4). */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "int triangulo(int n) {",              num: null },
    { txt: "    int i = 0;",                      num: 1 },
    { txt: "    int cuenta = 0;",                 num: 2 },
    { txt: "    while (i < n) {",                 num: 3 },
    { txt: "        int j = 0;",                  num: 4 },
    { txt: "        while (j < i) {",             num: 5 },
    { txt: "            cuenta = cuenta + 1;",    num: 6 },
    { txt: "            j = j + 1;",              num: 7 },
    { txt: "        }",                           num: null },
    { txt: "        i = i + 1;",                  num: 8 },
    { txt: "    }",                               num: null },
    { txt: "    return cuenta;",                  num: 9 }
  ];

  function simular(params) {
    var n = params.n;
    var pasos = [];
    var i = null, j = null, cuenta = null;
    function snap(linea, extra) {
      var p = { linea: linea, i: i, j: j, cuenta: cuenta };
      if (extra) { for (var c in extra) { p[c] = extra[c]; } }
      pasos.push(p);
    }
    i = 0; snap(1);
    cuenta = 0; snap(2);
    var externo = true;
    while (externo) {
      snap(3);
      if (i < n) {
        j = 0; snap(4);
        var interno = true;
        while (interno) {
          snap(5);
          if (j < i) {
            cuenta = cuenta + 1; snap(6, { fila: i });
            j = j + 1; snap(7);
          } else {
            interno = false;
          }
        }
        var cerrada = i;
        i = i + 1; snap(8, { vuelta: cerrada, veces: cerrada });
      } else {
        externo = false;
      }
    }
    snap(9);
    return pasos;
  }

  return { codigo: CODIGO, simular: simular };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var FORMULAS = {
      1: { txt: "1",          fn: function (n) { return 1; } },
      2: { txt: "1",          fn: function (n) { return 1; } },
      3: { txt: "n + 1",      fn: function (n) { return n + 1; } },
      4: { txt: "n",          fn: function (n) { return n; } },
      5: { txt: "n(n + 1)/2", fn: function (n) { return n * (n + 1) / 2; } },
      6: { txt: "n(n − 1)/2", fn: function (n) { return n * (n - 1) / 2; } },
      7: { txt: "n(n − 1)/2", fn: function (n) { return n * (n - 1) / 2; } },
      8: { txt: "n",          fn: function (n) { return n; } },
      9: { txt: "1",          fn: function (n) { return 1; } }
    };
    var gauss = false;
    var resuelta = false;

    function alPintar(e) {
      var n = e.params.n;
      var vueltas = [];
      var celdasPorFila = {};
      var m;
      for (m = 0; m < e.k; m = m + 1) {
        var p = e.pasos[m];
        if (p.vuelta !== undefined) {
          vueltas.push({ vuelta: p.vuelta, veces: p.veces, cuenta: p.cuenta });
        }
        if (p.fila !== undefined) {
          celdasPorFila[p.fila] = (celdasPorFila[p.fila] || 0) + 1;
        }
      }

      var cuerpoTraza = document.getElementById("cuerpo-traza");
      cuerpoTraza.innerHTML = "";
      vueltas.forEach(function (v) {
        var tr = document.createElement("tr");
        tr.innerHTML = "<td>i = " + v.vuelta + "</td><td>" + v.veces +
          "</td><td>" + v.cuenta + "</td>";
        cuerpoTraza.appendChild(tr);
      });
      if (vueltas.length === 0) {
        var trv = document.createElement("tr");
        trv.innerHTML = "<td colspan='3' class='pend'>Todavía no termina ninguna vuelta.</td>";
        cuerpoTraza.appendChild(trv);
      }

      var panelEscalera = document.getElementById("panel-escalera");
      panelEscalera.innerHTML = "";
      var fila, c;
      for (fila = 0; fila < n; fila = fila + 1) {
        var divFila = document.createElement("div");
        divFila.className = "fila-esc";
        var rot = document.createElement("span");
        rot.className = "rotulo";
        rot.textContent = "i = " + fila;
        divFila.appendChild(rot);
        var hechas = celdasPorFila[fila] || 0;
        for (c = 0; c < fila; c = c + 1) {
          var celda = document.createElement("span");
          celda.className = c < hechas ? "celda llena" : "celda";
          divFila.appendChild(celda);
        }
        if (gauss) {
          for (c = 0; c < n - 1 - fila; c = c + 1) {
            var espejo = document.createElement("span");
            espejo.className = "celda espejo";
            divFila.appendChild(espejo);
          }
        }
        panelEscalera.appendChild(divFila);
      }
      var totalCeldas = n * (n - 1) / 2;
      var formulaEscalera = document.getElementById("formula-escalera");
      if (gauss) {
        formulaEscalera.innerHTML = "Dos escaleras llenan un rectángulo de n × (n − 1) = " +
          n + " × " + (n - 1) + " = " + (n * (n - 1)) +
          " casillas. La escalera azul es la mitad: <b>n(n − 1)/2 = " + totalCeldas + "</b>.";
      } else if (e.terminado) {
        formulaEscalera.innerHTML = "La línea 6 corrió 0 + 1 + … + " + (n - 1) +
          " = <b>" + totalCeldas + "</b> veces. Oprima el botón para ver de dónde sale la fórmula.";
      } else {
        formulaEscalera.textContent = "";
      }

      var cuerpoConteo = document.getElementById("cuerpo-conteo");
      cuerpoConteo.innerHTML = "";
      var total = 0;
      var num;
      for (num = 1; num <= 9; num = num + 1) {
        var f = FORMULAS[num];
        var veces = e.conteos[num] || 0;
        total = total + veces;
        var tr2 = document.createElement("tr");
        tr2.innerHTML = "<td>" + num + "</td><td>" + veces + "</td>" +
          (resuelta
            ? "<td>" + f.txt + "</td><td>" + f.fn(n) + "</td>"
            : "<td class='pend'>…</td><td class='pend'>…</td>");
        cuerpoConteo.appendChild(tr2);
      }
      var totalT = document.getElementById("total-t");
      if (resuelta && e.terminado) {
        var tn = (3 * n * n + 5 * n) / 2 + 4;
        totalT.innerHTML = "Suma de la columna simulada: <b>" + total +
          "</b>. La fórmula general T(n) = (3n² + 5n)/2 + 4 evaluada en n = " + n +
          " da <b>" + tn + "</b>. Coinciden: la cuenta cuadra.";
      } else if (resuelta) {
        totalT.textContent = "Termine la ejecución para comparar la fórmula contra lo simulado.";
      } else {
        totalT.textContent = "Las fórmulas se revelan cuando encuentre la fórmula general (tarjeta 6).";
      }
      document.getElementById("n-formula").textContent = n;
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo,
      simular: EJERCICIO.simular,
      chips: [
        { campo: "i", rotulo: "i" },
        { campo: "j", rotulo: "j" },
        { campo: "cuenta", rotulo: "cuenta", clase: "cuenta" }
      ],
      paramsIniciales: { n: 4 },
      alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor, params) {
      var n = params.n;
      var esperado = n * (n - 1) / 2;
      if (valor === esperado) {
        return { ok: true, msg: "Correcto: la línea 6 corre 0 + 1 + … + (n − 1) = " +
          esperado + " veces. ¿Qué fórmula produce esa suma para cualquier n? La pregunta está al final." };
      }
      if (valor === n * n) {
        return { ok: false, msg: "Multiplicó las dos cotas como si los ciclos fueran independientes. " +
          "Aquí el interno depende de i: corre 0, 1, 2, … veces. Ejecute paso a paso y mire la escalera." };
      }
      if (valor === n * (n - 1)) {
        return { ok: false, msg: "Cerca: contó cada casilla dos veces. La escalera es la mitad del rectángulo n × (n − 1)." };
      }
      if (valor === n * (n + 1) / 2) {
        return { ok: false, msg: "Esa es la cuenta de la condición (línea 5), que se evalúa una vez más por cada vuelta del interno. La pregunta es por el cuerpo." };
      }
      return { ok: false, msg: "No coincide. Pista: congele i, cuente cuántas veces corre el interno en esa vuelta y después sume las vueltas." };
    });

    document.getElementById("rango-n").addEventListener("input", function (ev) {
      document.getElementById("ver-n").textContent = ev.target.value;
      Motor.limpiarVeredicto();
      Motor.reiniciar({ n: parseInt(ev.target.value, 10) });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-analisis button"), function (b) {
      b.addEventListener("click", function () {
        var v = document.getElementById("veredicto-analisis");
        var op = b.getAttribute("data-op");
        if (op === "correcta") {
          resuelta = true;
          v.className = "veredicto bien";
          v.textContent = "Correcto: 0 + 1 + … + (n − 1) = n(n − 1)/2. El término que " +
            "manda cuando n crece es n²: duplicar n multiplica el trabajo por cerca de " +
            "cuatro. La tabla de conteo ya muestra las fórmulas de todas las líneas.";
          Motor.repintar();
        } else if (op === "cuadrado") {
          v.className = "veredicto mal";
          v.textContent = "Eso multiplica las cotas como si los ciclos fueran independientes. " +
            "Ejecute con n = 4: la columna de la línea 6 marca 6, no 16.";
        } else if (op === "doble") {
          v.className = "veredicto mal";
          v.textContent = "El doble: esa fórmula cuenta el rectángulo completo del truco de " +
            "Gauss, no la escalera. Con n = 4 daría 12 y la columna marca 6.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "Esa es la fórmula de la condición (línea 5), que se evalúa una vez " +
            "más por vuelta. Compare las columnas de las líneas 5 y 6.";
        }
      });
    });

    document.getElementById("btn-gauss").addEventListener("click", function () {
      gauss = !gauss;
      this.textContent = gauss
        ? "Quitar el espejo"
        : "Completar el rectángulo (truco de Gauss)";
      Motor.repintar();
    });
  })();
}

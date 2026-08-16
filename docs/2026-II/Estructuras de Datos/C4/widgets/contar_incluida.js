/* Ejercicio interactivo: contar_incluida (clase 4). */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "int contar_incluida(int n) {",        num: null },
    { txt: "    int i = 0;",                      num: 1 },
    { txt: "    int cuenta = 0;",                 num: 2 },
    { txt: "    while (i < n) {",                 num: 3 },
    { txt: "        int j = 0;",                  num: 4 },
    { txt: "        while (j <= i) {",            num: 5 },
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
          if (j <= i) {
            cuenta = cuenta + 1; snap(6, { fila: i });
            j = j + 1; snap(7);
          } else {
            interno = false;
          }
        }
        var cerrada = i;
        i = i + 1; snap(8, { vuelta: cerrada, veces: cerrada + 1 });
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
      5: { txt: "n(n + 3)/2", fn: function (n) { return n * (n + 3) / 2; } },
      6: { txt: "n(n + 1)/2", fn: function (n) { return n * (n + 1) / 2; } },
      7: { txt: "n(n + 1)/2", fn: function (n) { return n * (n + 1) / 2; } },
      8: { txt: "n",          fn: function (n) { return n; } },
      9: { txt: "1",          fn: function (n) { return 1; } }
    };
    var gauss = false;

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
        for (c = 0; c < fila + 1; c = c + 1) {
          var celda = document.createElement("span");
          celda.className = c < hechas ? "celda llena" : "celda";
          divFila.appendChild(celda);
        }
        if (gauss) {
          for (c = 0; c < n - fila; c = c + 1) {
            var espejo = document.createElement("span");
            espejo.className = "celda espejo";
            divFila.appendChild(espejo);
          }
        }
        panelEscalera.appendChild(divFila);
      }
      var totalCeldas = n * (n + 1) / 2;
      var formulaEscalera = document.getElementById("formula-escalera");
      if (gauss) {
        formulaEscalera.innerHTML = "Dos escaleras llenan un rectángulo de n × (n + 1) = " +
          n + " × " + (n + 1) + " = " + (n * (n + 1)) +
          " casillas. La escalera azul es la mitad: <b>n(n + 1)/2 = " + totalCeldas + "</b>.";
      } else if (e.terminado) {
        formulaEscalera.innerHTML = "La línea 6 corrió 1 + 2 + … + " + n +
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
          (e.terminado
            ? "<td>" + f.txt + "</td><td>" + f.fn(n) + "</td>"
            : "<td class='pend'>…</td><td class='pend'>…</td>");
        cuerpoConteo.appendChild(tr2);
      }
      var totalT = document.getElementById("total-t");
      if (e.terminado) {
        var tn = (3 * n * n + 11 * n) / 2 + 4;
        totalT.innerHTML = "Suma de la columna simulada: <b>" + total +
          "</b>. La fórmula general T(n) = (3n² + 11n)/2 + 4 evaluada en n = " + n +
          " da <b>" + tn + "</b>. Coinciden: la cuenta cuadra.";
      } else {
        totalT.textContent = "Las fórmulas se revelan cuando la ejecución llega al final.";
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
      var esperado = n * (n + 1) / 2;
      if (valor === esperado) {
        return { ok: true, msg: "Correcto: la línea 6 corre 1 + 2 + … + n = n(n + 1)/2 = " +
          esperado + " veces. Ejecute la simulación y confirme." };
      }
      if (valor === n * (n - 1) / 2) {
        return { ok: false, msg: "Esa es la versión estricta (j < i). El signo igual regala " +
          "una ejecución por vuelta: la suma pasa de 0 + 1 + … + (n − 1) a 1 + 2 + … + n." };
      }
      if (valor === n * n) {
        return { ok: false, msg: "Multiplicó las dos cotas como si los ciclos fueran independientes. " +
          "El interno depende de i: corre 1, 2, 3, … veces." };
      }
      if (valor === n * (n + 1)) {
        return { ok: false, msg: "Cerca: contó cada casilla dos veces. La escalera es la mitad del rectángulo n × (n + 1)." };
      }
      return { ok: false, msg: "No coincide. Pista: en la vuelta i el interno corre i + 1 veces. Sume esas cantidades." };
    });

    document.getElementById("rango-n").addEventListener("input", function (ev) {
      document.getElementById("ver-n").textContent = ev.target.value;
      Motor.limpiarVeredicto();
      Motor.reiniciar({ n: parseInt(ev.target.value, 10) });
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

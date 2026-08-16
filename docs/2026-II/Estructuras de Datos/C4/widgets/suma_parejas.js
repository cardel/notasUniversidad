/* Ejercicio interactivo: suma_parejas (clase 4). */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "int suma_parejas(int datos[], int n) {",       num: null },
    { txt: "    int suma = 0;",                            num: 1 },
    { txt: "    int i = 0;",                               num: 2 },
    { txt: "    while (i < n) {",                          num: 3 },
    { txt: "        int j = i;",                           num: 4 },
    { txt: "        while (j < n) {",                      num: 5 },
    { txt: "            suma = suma + datos[i] * datos[j];", num: 6 },
    { txt: "            j = j + 1;",                       num: 7 },
    { txt: "        }",                                    num: null },
    { txt: "        i = i + 1;",                           num: 8 },
    { txt: "    }",                                        num: null },
    { txt: "    return suma;",                             num: 9 }
  ];

  function generarDatos(n) {
    var datos = [];
    var i;
    for (i = 0; i < n; i = i + 1) { datos.push(i + 1); }
    return datos;
  }

  function simular(params) {
    var n = params.n;
    var datos = generarDatos(n);
    var pasos = [];
    var i = null, j = null, suma = null;
    function snap(linea, extra) {
      var p = { linea: linea, i: i, j: j, suma: suma };
      if (extra) { for (var c in extra) { p[c] = extra[c]; } }
      pasos.push(p);
    }
    suma = 0; snap(1);
    i = 0; snap(2);
    var externo = true;
    while (externo) {
      snap(3);
      if (i < n) {
        j = i; snap(4);
        var interno = true;
        while (interno) {
          snap(5);
          if (j < n) {
            suma = suma + datos[i] * datos[j]; snap(6, { fila: i });
            j = j + 1; snap(7);
          } else {
            interno = false;
          }
        }
        var cerrada = i;
        i = i + 1; snap(8, { vuelta: cerrada, veces: n - cerrada });
      } else {
        externo = false;
      }
    }
    snap(9);
    return pasos;
  }

  return { codigo: CODIGO, simular: simular, generarDatos: generarDatos };
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

    function mostrarDatos(n) {
      document.getElementById("ver-datos").textContent =
        "{" + EJERCICIO.generarDatos(n).join(", ") + "}";
    }

    function alPintar(e) {
      var n = e.params.n;
      var vueltas = [];
      var celdasPorFila = {};
      var m;
      for (m = 0; m < e.k; m = m + 1) {
        var p = e.pasos[m];
        if (p.vuelta !== undefined) {
          vueltas.push({ vuelta: p.vuelta, veces: p.veces, suma: p.suma });
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
          "</td><td>" + v.suma + "</td>";
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
        for (c = 0; c < n - fila; c = c + 1) {
          var celda = document.createElement("span");
          celda.className = c < hechas ? "celda llena" : "celda";
          divFila.appendChild(celda);
        }
        if (gauss) {
          for (c = 0; c < fila + 1; c = c + 1) {
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
        formulaEscalera.innerHTML = "La línea 6 corrió " + n + " + " + (n - 1) +
          " + … + 1 = <b>" + totalCeldas + "</b> veces: la misma suma de siempre, leída al revés.";
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
        { campo: "suma", rotulo: "suma", clase: "cuenta" }
      ],
      paramsIniciales: { n: 4 },
      alPintar: alPintar
    });
    mostrarDatos(4);

    Motor.prediccionNumerica(function (valor, params) {
      var n = params.n;
      var esperado = n * (n + 1) / 2;
      if (valor === esperado) {
        return { ok: true, msg: "Correcto: la línea 6 corre n + (n − 1) + … + 1 = n(n + 1)/2 = " +
          esperado + " veces. El patrón baja, pero la suma es la misma." };
      }
      if (valor === n * (n - 1) / 2) {
        return { ok: false, msg: "Esa sería la cuenta si j arrancara en i + 1 (parejas estrictas). " +
          "Aquí j arranca en i, así que cada vuelta gana una ejecución." };
      }
      if (valor === n * n) {
        return { ok: false, msg: "Eso contaría cada i con cada j completo. Aquí j arranca en i: " +
          "la primera vuelta corre n veces y la última una sola." };
      }
      if (valor === n * (n + 1)) {
        return { ok: false, msg: "Cerca: contó cada casilla dos veces. La escalera es la mitad del rectángulo n × (n + 1)." };
      }
      return { ok: false, msg: "No coincide. Pista: en la vuelta i el interno corre n − i veces. Sume esas cantidades." };
    });

    document.getElementById("rango-n").addEventListener("input", function (ev) {
      var n = parseInt(ev.target.value, 10);
      document.getElementById("ver-n").textContent = n;
      mostrarDatos(n);
      Motor.limpiarVeredicto();
      Motor.reiniciar({ n: n });
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

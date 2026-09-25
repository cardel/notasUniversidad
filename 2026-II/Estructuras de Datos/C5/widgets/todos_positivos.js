/* Ejercicio interactivo: todos_positivos (clase 5). */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "int todos_positivos(int datos[], int n) {", num: null },
    { txt: "    int todos = 1;",                        num: 1 },
    { txt: "    int i = 0;",                            num: 2 },
    { txt: "    while (i < n && todos == 1) {",         num: 3 },
    { txt: "        if (datos[i] <= 0) {",              num: 4 },
    { txt: "            todos = 0;",                    num: 5 },
    { txt: "        }",                                 num: null },
    { txt: "        i = i + 1;",                        num: 6 },
    { txt: "    }",                                     num: null },
    { txt: "    return todos;",                         num: 7 }
  ];

  var BASE = [3, 4, 5, 2, 7, 1, 6, 8];

  function datosIniciales(n) {
    return BASE.slice(0, n);
  }

  function simular(params) {
    var n = params.n;
    var datos = params.datos;
    var pasos = [];
    var i = null, todos = null;
    function snap(linea, extra) {
      var p = { linea: linea, i: i, todos: todos };
      if (extra) { for (var c in extra) { p[c] = extra[c]; } }
      pasos.push(p);
    }
    todos = 1; snap(1);
    i = 0; snap(2);
    var sigue = true;
    while (sigue) {
      snap(3);
      if (i < n && todos === 1) {
        snap(4, { mira: i });
        if (datos[i] <= 0) {
          todos = 0; snap(5, { mira: i });
        }
        i = i + 1;
        snap(6, {
          vuelta: i - 1,
          valor: datos[i - 1],
          noPositivo: datos[i - 1] <= 0,
          todosDespues: todos
        });
      } else {
        sigue = false;
      }
    }
    snap(7);
    return pasos;
  }

  return { codigo: CODIGO, simular: simular, datosIniciales: datosIniciales };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var params = { n: 6, datos: EJERCICIO.datosIniciales(6) };
    var resuelta = false;

    function alPintar(e) {
      var n = e.params.n;
      var datos = e.params.datos;
      var vueltas = [];
      var visitadas = {};
      var m;
      for (m = 0; m < e.k; m = m + 1) {
        var p = e.pasos[m];
        if (p.vuelta !== undefined) {
          vueltas.push(p);
        }
        if (p.mira !== undefined) {
          visitadas[p.mira] = true;
        }
      }
      var actualCelda = e.actual && e.actual.mira !== undefined ? e.actual.mira : null;

      var panelArreglo = document.getElementById("panel-arreglo");
      panelArreglo.innerHTML = "";
      var idx;
      for (idx = 0; idx < n; idx = idx + 1) {
        var caja = document.createElement("div");
        var clases = "caja " + (datos[idx] > 0 ? "positivo" : "negativo");
        if (visitadas[idx]) { clases = clases + " visitada"; }
        if (actualCelda === idx) { clases = clases + " actual"; }
        caja.className = clases;
        caja.setAttribute("data-idx", idx);
        var ind = document.createElement("span");
        ind.className = "indice";
        ind.textContent = idx;
        caja.appendChild(ind);
        caja.appendChild(document.createTextNode(datos[idx]));
        panelArreglo.appendChild(caja);
      }

      var cuerpoTraza = document.getElementById("cuerpo-traza");
      cuerpoTraza.innerHTML = "";
      vueltas.forEach(function (v) {
        var tr = document.createElement("tr");
        tr.innerHTML = "<td>i = " + v.vuelta + "</td><td>" + v.valor + "</td><td>" +
          (v.noPositivo ? "sí" : "no") + "</td><td>" + v.todosDespues + "</td>";
        cuerpoTraza.appendChild(tr);
      });
      if (vueltas.length === 0) {
        var trv = document.createElement("tr");
        trv.innerHTML = "<td colspan='4' class='pend'>Todavía no termina ninguna vuelta.</td>";
        cuerpoTraza.appendChild(trv);
      }

      var filas = [
        { linea: 1, mejor: "1", mejorVal: 1, peor: "1", peorVal: 1 },
        { linea: 2, mejor: "1", mejorVal: 1, peor: "1", peorVal: 1 },
        { linea: 3, mejor: "2", mejorVal: 2, peor: "n + 1", peorVal: n + 1 },
        { linea: 4, mejor: "1", mejorVal: 1, peor: "n", peorVal: n },
        { linea: 5, mejor: "1", mejorVal: 1, peor: "0", peorVal: 0 },
        { linea: 6, mejor: "1", mejorVal: 1, peor: "n", peorVal: n },
        { linea: 7, mejor: "1", mejorVal: 1, peor: "1", peorVal: 1 }
      ];
      var cuerpoConteo = document.getElementById("cuerpo-conteo");
      cuerpoConteo.innerHTML = "";
      var total = 0;
      filas.forEach(function (f) {
        var veces = e.conteos[f.linea] || 0;
        total = total + veces;
        var tr = document.createElement("tr");
        tr.innerHTML = "<td>" + f.linea + "</td><td>" + veces + "</td>" +
          (resuelta
            ? "<td>" + f.mejor + " = " + f.mejorVal + "</td><td>" + f.peor + " = " + f.peorVal + "</td>"
            : "<td class='pend'>…</td><td class='pend'>…</td>");
        cuerpoConteo.appendChild(tr);
      });
      var totalT = document.getElementById("total-t");
      if (resuelta && e.terminado) {
        totalT.innerHTML = "Este arreglo costó <b>" + total + "</b> pasos. Los extremos: " +
          "mejor caso <b>8</b> (el primer valor ya no es positivo) y peor caso " +
          "<b>3n + 4 = " + (3 * n + 4) + "</b> (todos positivos: el ciclo llega hasta el final).";
      } else if (e.terminado) {
        totalT.innerHTML = "Este arreglo costó <b>" + total + "</b> pasos. Cambie los datos, " +
          "compare totales y responda la pregunta de la tarjeta 5 para revelar los extremos.";
      } else {
        totalT.textContent = "Los extremos se revelan cuando encuentre la fórmula del peor caso (tarjeta 5).";
      }
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo,
      simular: EJERCICIO.simular,
      chips: [
        { campo: "i", rotulo: "i" },
        { campo: "todos", rotulo: "todos", clase: "cuenta" }
      ],
      paramsIniciales: params,
      alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor, prm) {
      var n = prm.n;
      var datos = prm.datos;
      var p = -1;
      var idx = 0;
      while (idx < n && p === -1) {
        if (datos[idx] <= 0) { p = idx; }
        idx = idx + 1;
      }
      var esperado = p === -1 ? n : p + 1;
      if (valor === esperado) {
        var detalle = p === -1
          ? "todos los valores son positivos, así que el ciclo llega hasta el final: n vueltas."
          : "el ciclo procesa la casilla " + p + ", pone todos en 0 y la siguiente condición lo frena: " + esperado + " vueltas.";
        return { ok: true, msg: "Correcto: " + detalle };
      }
      if (p !== -1 && valor === n) {
        return { ok: false, msg: "El ciclo no llega hasta el final: cuando todos pasa a 0, la condición del while lo frena. Ejecute paso a paso y mire dónde se detiene." };
      }
      if (valor === esperado + 1) {
        return { ok: false, msg: "Esa es la cuenta de la condición (línea 3), que se evalúa una vez más que el cuerpo." };
      }
      return { ok: false, msg: "No coincide. Pista: busque la primera casilla con un valor que no sea positivo; el ciclo la procesa y ahí se frena." };
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-analisis button"), function (b) {
      b.addEventListener("click", function () {
        var v = document.getElementById("veredicto-analisis");
        var op = b.getAttribute("data-op");
        if (op === "correcta") {
          resuelta = true;
          v.className = "veredicto bien";
          v.textContent = "Correcto: en el peor caso (todos positivos) la función ejecuta " +
            "3n + 4 pasos, lineal (O(n)); el mejor caso queda en 8, constante (O(1)). " +
            "Cuando se reporta una sola cota, se reporta la del peor caso.";
          Motor.repintar();
        } else if (op === "mejor") {
          v.className = "veredicto mal";
          v.textContent = "Ese es el mejor caso: el primer valor ya no es positivo y el " +
            "ciclo corta de inmediato. El peor caso recorre todo el arreglo.";
        } else if (op === "vueltas") {
          v.className = "veredicto mal";
          v.textContent = "n cuenta solo las vueltas del ciclo. Cada vuelta ejecuta varias " +
            "líneas y la condición se evalúa una vez más: mire los contadores con n = 6.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "Le faltan las líneas de afuera del ciclo y la evaluación extra " +
            "de la condición. Ejecute con n = 6, todos positivos: el total es 22, no 18.";
        }
      });
    });

    function reiniciarCon(n, datos) {
      params = { n: n, datos: datos };
      Motor.limpiarVeredicto();
      Motor.reiniciar(params);
    }

    document.getElementById("rango-n").addEventListener("input", function (ev) {
      var n = parseInt(ev.target.value, 10);
      document.getElementById("ver-n").textContent = n;
      reiniciarCon(n, EJERCICIO.datosIniciales(n));
    });

    document.getElementById("panel-arreglo").addEventListener("click", function (ev) {
      var caja = ev.target.closest(".caja");
      if (caja) {
        var idx = parseInt(caja.getAttribute("data-idx"), 10);
        var datos = params.datos.slice();
        datos[idx] = -datos[idx];
        reiniciarCon(params.n, datos);
      }
    });

    Array.prototype.forEach.call(document.querySelectorAll(".presets button"), function (b) {
      b.addEventListener("click", function () {
        var n = params.n;
        var datos = EJERCICIO.datosIniciales(n);
        var caso = b.getAttribute("data-caso");
        if (caso === "inicio") { datos[0] = -datos[0]; }
        if (caso === "medio") { datos[Math.floor(n / 2)] = -datos[Math.floor(n / 2)]; }
        if (caso === "final") { datos[n - 1] = -datos[n - 1]; }
        reiniciarCon(n, datos);
      });
    });
  })();
}

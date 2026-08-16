/* Ejercicio interactivo: mitades (clase 5). */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "int mitades(int n) {",                num: null },
    { txt: "    int i = n;",                      num: 1 },
    { txt: "    int cuenta = 0;",                 num: 2 },
    { txt: "    while (i > 0) {",                 num: 3 },
    { txt: "        cuenta = cuenta + 1;",        num: 4 },
    { txt: "        i = i / 2;",                  num: 5 },
    { txt: "    }",                               num: null },
    { txt: "    return cuenta;",                  num: 6 }
  ];

  function vueltas(n) {
    var i = n;
    var v = 0;
    while (i > 0) {
      v = v + 1;
      i = Math.floor(i / 2);
    }
    return v;
  }

  function simular(params) {
    var n = params.n;
    var pasos = [];
    var i = null, cuenta = null;
    function snap(linea, extra) {
      var p = { linea: linea, i: i, cuenta: cuenta };
      if (extra) { for (var c in extra) { p[c] = extra[c]; } }
      pasos.push(p);
    }
    i = n; snap(1);
    cuenta = 0; snap(2);
    var sigue = true;
    while (sigue) {
      snap(3);
      if (i > 0) {
        cuenta = cuenta + 1; snap(4, { visita: i });
        i = Math.floor(i / 2); snap(5);
      } else {
        sigue = false;
      }
    }
    snap(6);
    return pasos;
  }

  return { codigo: CODIGO, simular: simular, vueltas: vueltas };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    function alPintar(e) {
      var n = e.params.n;
      var visitas = [];
      var m;
      for (m = 0; m < e.k; m = m + 1) {
        if (e.pasos[m].visita !== undefined) { visitas.push(e.pasos[m].visita); }
      }

      var panel = document.getElementById("panel-secuencia");
      panel.innerHTML = "";
      visitas.forEach(function (v, idx) {
        if (idx > 0) {
          var fl = document.createElement("span");
          fl.className = "flecha";
          fl.textContent = "→";
          panel.appendChild(fl);
        }
        var ficha = document.createElement("span");
        ficha.className = "ficha";
        ficha.textContent = v;
        panel.appendChild(ficha);
      });
      if (e.terminado && visitas.length > 0) {
        var fl2 = document.createElement("span");
        fl2.className = "flecha";
        fl2.textContent = "→";
        panel.appendChild(fl2);
        var tope = document.createElement("span");
        tope.className = "ficha tachada";
        tope.textContent = "0";
        panel.appendChild(tope);
      }

      var formulaSec = document.getElementById("formula-secuencia");
      if (e.terminado) {
        formulaSec.innerHTML = "Con n = " + n + " el índice visita <b>" + visitas.length +
          "</b> valores antes de llegar a 0: vueltas = ⌊log₂ n⌋ + 1 = " +
          (visitas.length - 1) + " + 1.";
      } else {
        formulaSec.textContent = "";
      }

      var cuerpoCrec = document.getElementById("cuerpo-crecimiento");
      cuerpoCrec.innerHTML = "";
      [10, 100, 1000, 1000000].forEach(function (ene) {
        var tr = document.createElement("tr");
        var etiqueta = ene === 1000000 ? "1 000 000" : String(ene);
        tr.innerHTML = "<td>" + etiqueta + "</td><td>" + EJERCICIO.vueltas(ene) + "</td>";
        cuerpoCrec.appendChild(tr);
      });

      var v = EJERCICIO.vueltas(n);
      var filas = [
        { linea: 1, txt: "1", val: 1 },
        { linea: 2, txt: "1", val: 1 },
        { linea: 3, txt: "⌊log₂ n⌋ + 2", val: v + 1 },
        { linea: 4, txt: "⌊log₂ n⌋ + 1", val: v },
        { linea: 5, txt: "⌊log₂ n⌋ + 1", val: v },
        { linea: 6, txt: "1", val: 1 }
      ];
      var cuerpoConteo = document.getElementById("cuerpo-conteo");
      cuerpoConteo.innerHTML = "";
      var total = 0;
      filas.forEach(function (f) {
        var veces = e.conteos[f.linea] || 0;
        total = total + veces;
        var tr = document.createElement("tr");
        tr.innerHTML = "<td>" + f.linea + "</td><td>" + veces + "</td>" +
          (e.terminado
            ? "<td>" + f.txt + "</td><td>" + f.val + "</td>"
            : "<td class='pend'>…</td><td class='pend'>…</td>");
        cuerpoConteo.appendChild(tr);
      });
      var totalT = document.getElementById("total-t");
      if (e.terminado) {
        totalT.innerHTML = "Suma de la columna simulada: <b>" + total +
          "</b>. La fórmula general T(n) = 3⌊log₂ n⌋ + 7 evaluada en n = " + n +
          " da <b>" + (3 * (v - 1) + 7) + "</b>. Coinciden: la cuenta cuadra.";
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
        { campo: "cuenta", rotulo: "cuenta", clase: "cuenta" }
      ],
      paramsIniciales: { n: 20 },
      alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor, params) {
      var n = params.n;
      var esperado = EJERCICIO.vueltas(n);
      if (valor === esperado) {
        return { ok: true, msg: "Correcto: la línea 4 corre ⌊log₂ n⌋ + 1 = " + esperado +
          " veces. Mire la secuencia: son los mismos números de potencias, al revés." };
      }
      if (valor === esperado - 1) {
        return { ok: false, msg: "Le faltó una vuelta: cuando i llega a 1 todavía entra una vez más (1 / 2 = 0 recién después)." };
      }
      if (valor === Math.floor(n / 2)) {
        return { ok: false, msg: "El índice no baja de 2 en 2: se parte por la mitad. Después de una vuelta ya va por n/2, después por n/4, …" };
      }
      if (valor === n) {
        return { ok: false, msg: "Eso sería un ciclo que baja de uno en uno. Aquí cada vuelta descarta la mitad de lo que queda." };
      }
      return { ok: false, msg: "No coincide. Pista: escriba los valores que toma i (n, n/2, n/4, …) y cuente cuántos hay antes de llegar a 0." };
    });

    function cambiarN(n) {
      document.getElementById("rango-n").value = n;
      document.getElementById("ver-n").textContent = n;
      Motor.limpiarVeredicto();
      Motor.reiniciar({ n: n });
    }

    document.getElementById("rango-n").addEventListener("input", function (ev) {
      cambiarN(parseInt(ev.target.value, 10));
    });
    Array.prototype.forEach.call(document.querySelectorAll(".presets button"), function (b) {
      b.addEventListener("click", function () {
        cambiarN(parseInt(b.getAttribute("data-n"), 10));
      });
    });
  })();
}

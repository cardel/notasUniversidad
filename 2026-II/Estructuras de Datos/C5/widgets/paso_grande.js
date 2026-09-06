/* Ejercicio interactivo: paso_grande (clase 5). */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "int paso_grande(int n) {",            num: null },
    { txt: "    int i = 0;",                      num: 1 },
    { txt: "    int cuenta = 0;",                 num: 2 },
    { txt: "    while (i <= n) {",                num: 3 },
    { txt: "        cuenta = cuenta + 1;",        num: 4 },
    { txt: "        i = i + n / 5;",              num: 5 },
    { txt: "    }",                               num: null },
    { txt: "    return cuenta;",                  num: 6 }
  ];

  function vueltas(n) {
    var i = 0;
    var v = 0;
    var salto = Math.floor(n / 5);
    while (i <= n) {
      v = v + 1;
      i = i + salto;
    }
    return v;
  }

  function simular(params) {
    var n = params.n;
    var salto = Math.floor(n / 5);
    var pasos = [];
    var i = null, cuenta = null;
    function snap(linea, extra) {
      var p = { linea: linea, i: i, cuenta: cuenta };
      if (extra) { for (var c in extra) { p[c] = extra[c]; } }
      pasos.push(p);
    }
    i = 0; snap(1);
    cuenta = 0; snap(2);
    var sigue = true;
    while (sigue) {
      snap(3);
      if (i <= n) {
        cuenta = cuenta + 1; snap(4, { visita: i });
        i = i + salto; snap(5);
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
    var resuelta = false;

    function alPintar(e) {
      var n = e.params.n;
      var salto = Math.floor(n / 5);
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
        tope.textContent = (visitas[visitas.length - 1] + salto) + " > " + n;
        panel.appendChild(tope);
      }

      var formulaSec = document.getElementById("formula-secuencia");
      if (e.terminado) {
        formulaSec.innerHTML = "Con n = " + n + " el paso vale " + salto +
          " y salen <b>" + visitas.length + "</b> vueltas. Pruebe los presets, " +
          "anote las vueltas de cada n y compare.";
      } else {
        formulaSec.textContent = "";
      }

      var cuerpoConteo = document.getElementById("cuerpo-conteo");
      cuerpoConteo.innerHTML = "";
      var total = 0;
      [1, 2, 3, 4, 5, 6].forEach(function (num) {
        var veces = e.conteos[num] || 0;
        total = total + veces;
        var tr = document.createElement("tr");
        tr.innerHTML = "<td>" + num + "</td><td>" + veces + "</td>";
        cuerpoConteo.appendChild(tr);
      });
      var totalT = document.getElementById("total-t");
      if (resuelta && e.terminado) {
        var v = EJERCICIO.vueltas(n);
        totalT.innerHTML = "Total: <b>" + total + "</b> pasos = 3 × vueltas + 4 = 3 × " +
          v + " + 4. Como las vueltas nunca pasan de 8 (con n ≥ 10), el total " +
          "queda acotado por 28 sin importar qué tan grande sea n.";
      } else if (e.terminado) {
        totalT.innerHTML = "Total: <b>" + total + "</b> pasos con n = " + n +
          ". Pruebe otros n y responda la pregunta de la tarjeta 5.";
      } else {
        totalT.textContent = "El total se comenta cuando la ejecución llega al final.";
      }
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
        return { ok: true, msg: "Correcto: con paso n/5 = " + Math.floor(n / 5) +
          " salen " + esperado + " vueltas. Cambie n con los presets y compare." };
      }
      if (valor === Math.floor(n / 5)) {
        return { ok: false, msg: "Ese es el tamaño del paso, no el número de vueltas. " +
          "Divida el camino (0 hasta n) entre el paso." };
      }
      if (valor === n) {
        return { ok: false, msg: "Eso sería un ciclo que sube de uno en uno. Aquí cada " +
          "vuelta avanza la quinta parte del camino." };
      }
      return { ok: false, msg: "No coincide. Pista: el camino mide n y cada vuelta avanza " +
        "n/5. ¿Cuántos saltos caben, contando el arranque en 0 y el posible tope en n?" };
    });

    Array.prototype.forEach.call(document.querySelectorAll("#opciones-analisis button"), function (b) {
      b.addEventListener("click", function () {
        var v = document.getElementById("veredicto-analisis");
        var op = b.getAttribute("data-op");
        if (op === "correcta") {
          resuelta = true;
          v.className = "veredicto bien";
          v.textContent = "Correcto: el camino mide n y cada vuelta avanza n/5, así que las " +
            "vueltas quedan entre 6 y 8 para cualquier n ≥ 10. El costo es constante (O(1)) " +
            "aunque el código mencione a n.";
          Motor.repintar();
        } else if (op === "paso") {
          v.className = "veredicto mal";
          v.textContent = "n/5 es el tamaño del paso, no el número de vueltas. Con n = 1000 " +
            "el paso vale 200 y las vueltas siguen siendo 6.";
        } else if (op === "log") {
          v.className = "veredicto mal";
          v.textContent = "Logarítmico sería si el paso partiera el camino restante por la " +
            "mitad. Aquí avanza una fracción fija del total: compare n = 20 y n = 1000.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "Lineal sería avanzar de uno en uno. Compare los presets: con " +
            "n = 20 y con n = 1000 salen las mismas 6 vueltas.";
        }
      });
    });

    function cambiarN(n) {
      document.getElementById("rango-n").value = n;
      document.getElementById("ver-n").textContent = n;
      document.getElementById("ver-paso-n").textContent = n;
      document.getElementById("ver-salto").textContent = Math.floor(n / 5);
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

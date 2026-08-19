/* Ejercicio interactivo: mezclar (clase 2, divide y venceras). */
var EJERCICIO = (function () {
  var CODIGO = [
    { txt: "def mezclar(izq, der):",                    num: null },
    { txt: "    resultado = []",                        num: 1 },
    { txt: "    i = 0",                                 num: 2 },
    { txt: "    j = 0",                                 num: 3 },
    { txt: "    while i < len(izq) and j < len(der):",  num: 4 },
    { txt: "        if izq[i] <= der[j]:",              num: 5 },
    { txt: "            resultado.append(izq[i])",      num: 6 },
    { txt: "            i = i + 1",                     num: 7 },
    { txt: "        else:",                             num: null },
    { txt: "            resultado.append(der[j])",      num: 8 },
    { txt: "            j = j + 1",                     num: 9 },
    { txt: "    while i < len(izq):",                   num: 10 },
    { txt: "        resultado.append(izq[i])",          num: 11 },
    { txt: "        i = i + 1",                         num: 12 },
    { txt: "    while j < len(der):",                   num: 13 },
    { txt: "        resultado.append(der[j])",          num: 14 },
    { txt: "        j = j + 1",                         num: 15 },
    { txt: "    return resultado",                      num: 16 }
  ];

  function simular(params) {
    var izq = params.izq;
    var der = params.der;
    var pasos = [];
    var i = null, j = null;
    var resultado = [];
    function snap(linea, extra) {
      var p = { linea: linea, i: i, j: j, copiados: resultado.length,
                res: resultado.slice() };
      if (extra) { for (var c in extra) { p[c] = extra[c]; } }
      pasos.push(p);
    }
    snap(1);
    i = 0; snap(2);
    j = 0; snap(3);
    var corriendo = true;
    while (corriendo) {
      snap(4, { chequeo: true });
      if (i < izq.length && j < der.length) {
        snap(5);
        if (izq[i] <= der[j]) {
          resultado.push(izq[i]);
          snap(6, { evento: izq[i] + " <= " + der[j] + ": sale " + izq[i] });
          i = i + 1; snap(7);
        } else {
          resultado.push(der[j]);
          snap(8, { evento: izq[i] + " > " + der[j] + ": sale " + der[j] });
          j = j + 1; snap(9);
        }
      } else {
        corriendo = false;
      }
    }
    var sobraIzq = true;
    while (sobraIzq) {
      snap(10);
      if (i < izq.length) {
        resultado.push(izq[i]);
        snap(11, { evento: "der agotada: se copia " + izq[i] });
        i = i + 1; snap(12);
      } else {
        sobraIzq = false;
      }
    }
    var sobraDer = true;
    while (sobraDer) {
      snap(13);
      if (j < der.length) {
        resultado.push(der[j]);
        snap(14, { evento: "izq agotada: se copia " + der[j] });
        j = j + 1; snap(15);
      } else {
        sobraDer = false;
      }
    }
    snap(16);
    return pasos;
  }

  return { codigo: CODIGO, simular: simular };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var PRESETS = [
      { izq: [2, 4, 7], der: [1, 3, 6] },
      { izq: [1, 2, 3], der: [7, 8, 9] },
      { izq: [1, 4, 4, 9], der: [2, 4, 8] }
    ];

    function filaFichas(rotulo, valores, tomados) {
      var fila = document.createElement("div");
      fila.className = "fila-listas";
      var rot = document.createElement("span");
      rot.className = "rotulo";
      rot.textContent = rotulo;
      fila.appendChild(rot);
      var sec = document.createElement("div");
      sec.className = "secuencia";
      sec.style.margin = "0";
      valores.forEach(function (v, idx) {
        var ficha = document.createElement("span");
        ficha.className = "ficha" + (idx < tomados ? " tachada" : "");
        ficha.textContent = v;
        sec.appendChild(ficha);
      });
      if (valores.length === 0) {
        var vacio = document.createElement("span");
        vacio.className = "flecha";
        vacio.textContent = "(vacía)";
        sec.appendChild(vacio);
      }
      fila.appendChild(sec);
      return fila;
    }

    function alPintar(e) {
      var izq = e.params.izq;
      var der = e.params.der;
      var actual = e.actual;
      var i = actual && actual.i !== null ? actual.i : 0;
      var j = actual && actual.j !== null ? actual.j : 0;
      var res = actual ? actual.res : [];

      var panel = document.getElementById("panel-listas");
      panel.innerHTML = "";
      panel.appendChild(filaFichas("izq", izq, i));
      panel.appendChild(filaFichas("der", der, j));
      panel.appendChild(filaFichas("resultado", res, 0));

      var cuerpo = document.getElementById("cuerpo-traza");
      cuerpo.innerHTML = "";
      var m;
      for (m = 0; m < e.k; m = m + 1) {
        var p = e.pasos[m];
        if (p.evento) {
          var tr = document.createElement("tr");
          tr.innerHTML = "<td>" + p.evento + "</td><td>" +
            p.res[p.res.length - 1] + "</td><td>[" + p.res.join(", ") + "]</td>";
          cuerpo.appendChild(tr);
        }
      }
      if (cuerpo.children.length === 0) {
        var trv = document.createElement("tr");
        trv.innerHTML = "<td colspan='3' class='pend'>Todavía no sale ningún elemento.</td>";
        cuerpo.appendChild(trv);
      }
    }

    Motor.iniciar({
      codigo: EJERCICIO.codigo,
      simular: EJERCICIO.simular,
      chips: [
        { campo: "i", rotulo: "i" },
        { campo: "j", rotulo: "j" },
        { campo: "copiados", rotulo: "copiados", clase: "cuenta" }
      ],
      paramsIniciales: PRESETS[0],
      alPintar: alPintar
    });

    Motor.prediccionNumerica(function (valor, params) {
      var n = params.izq.length;
      var m = params.der.length;
      if (valor === n + m) {
        return { ok: true, msg: "Correcto: " + n + " + " + m + " = " + (n + m) +
          ". Cada elemento de las dos listas se copia exactamente una vez. " +
          "Guarde ese dato: es la clave del costo." };
      }
      if (valor === n * m) {
        return { ok: false, msg: "Multiplicó los tamaños, como si cada elemento se " +
          "comparara con todos los del frente. La mezcla copia cada elemento una " +
          "sola vez." };
      }
      if (valor === Math.max(n, m)) {
        return { ok: false, msg: "Ese es el tamaño de la lista más larga; resultado " +
          "junta las dos completas." };
      }
      return { ok: false, msg: "No coincide. ¿Algún elemento se pierde? ¿Alguno se " +
        "copia dos veces?" };
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

    /* ---- tarjeta 4: el patrón ---- */
    Array.prototype.forEach.call(document.querySelectorAll("#opciones-patron button"), function (btn) {
      btn.addEventListener("click", function () {
        var v = document.getElementById("veredicto-patron");
        var op = btn.getAttribute("data-op");
        if (op === "correcta") {
          v.className = "veredicto bien";
          v.textContent = "Ese es el invariante. Dice tres cosas a la vez: cuántos " +
            "elementos hay, cuáles son y en qué orden están. Con él, los cuatro " +
            "pasos de la tarjeta 5 salen solos.";
          document.getElementById("paso-1").classList.remove("bloqueado");
          document.getElementById("nota-pasos").innerHTML = "Invariante: " +
            "<b>resultado contiene, en orden, los i + j menores</b>.";
        } else if (op === "debil") {
          v.className = "veredicto mal";
          v.textContent = "Cierto, pero débil: no dice que estén ordenados ni que " +
            "sean los menores. Con ese invariante el paso de éxito no puede " +
            "concluir que el final queda ordenado.";
        } else if (op === "falsa") {
          v.className = "veredicto mal";
          v.textContent = "Mire la traza con las listas iniciales: en la primera " +
            "comparación pasa lo contrario (2 > 1). No es cierto en todas las vueltas.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "Esa es la poscondición: solo vale al final. En las filas " +
            "intermedias todavía faltan elementos por copiar.";
        }
      });
    });

    /* ---- tarjeta 5: pasos ---- */
    function cablearPaso(idBoton, idPaso, idSiguiente, alFinal) {
      document.getElementById(idBoton).addEventListener("click", function () {
        document.getElementById(idPaso).classList.add("hecho");
        if (idSiguiente) {
          document.getElementById(idSiguiente).classList.remove("bloqueado");
        }
        if (alFinal) { alFinal(); }
      });
    }
    cablearPaso("btn-m1", "paso-1", "paso-2");
    cablearPaso("btn-m2", "paso-2", "paso-3");
    cablearPaso("btn-m3", "paso-3", "paso-4");
    cablearPaso("btn-m4", "paso-4", null, function () {
      document.getElementById("nota-clrs").style.display = "block";
    });

    /* ---- tarjeta 6: costo ---- */
    Array.prototype.forEach.call(document.querySelectorAll("#opciones-costo button"), function (btn) {
      btn.addEventListener("click", function () {
        var v = document.getElementById("veredicto-costo");
        var op = btn.getAttribute("data-op");
        if (op === "lineal") {
          v.className = "veredicto bien";
          v.textContent = "Correcto: cada vuelta copia exactamente un elemento, y hay " +
            "n en total. Este Θ(n) es la f(n) de la recurrencia del ordenamiento " +
            "por mezcla: T(n) = 2·T(n/2) + Θ(n).";
        } else if (op === "cuadrado") {
          v.className = "veredicto mal";
          v.textContent = "Eso sería si cada elemento se comparara con todos los " +
            "demás. La traza muestra a lo sumo una comparación por copia.";
        } else {
          v.className = "veredicto mal";
          v.textContent = "Ese va a ser el costo del ordenamiento completo, no el de " +
            "una mezcla. La mezcla sola es más barata.";
        }
      });
    });
  })();
}

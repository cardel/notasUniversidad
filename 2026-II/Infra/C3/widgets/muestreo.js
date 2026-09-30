if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Un perfilador estadistico como Pyinstrument despierta cada interval
   segundos, guarda la pila y deduce el reparto del tiempo del conteo de
   muestras. Las cifras son las del deck: fib(35) con interval 0.1 da 46
   muestras en 4.640 s, y el Monte Carlo con uniform reparte 13.2 s entre
   siete nodos [self], que es donde cae cada muestra.                     */

var FIB = { duracion: 4.64, interval: 0.1, cpu: 4.623 };
var TOTAL = 13.2;
var PESOS = [50, 20, 10, 5, 1];
var PRESETS = [5, 13, 46, 132, 1000];

var REPARTO = [
  { nombre: "point [self]", segundos: 4.0 },
  { nombre: "Random.uniform [self]", segundos: 2.7 },
  { nombre: "Random.random", segundos: 1.5 },
  { nombre: "<genexpr> [self]", segundos: 2.6 },
  { nombre: "hits [self]", segundos: 1.3 },
  { nombre: "abs", segundos: 0.5 },
  { nombre: "estimate_pi [self]", segundos: 0.6 }
].map(function (f) {
  return { nombre: f.nombre, segundos: f.segundos, fraccion: f.segundos / TOTAL };
});

/* Una muestra cada interval segundos; lo que sobra al final no cuenta. */
function muestras(duracion, interval) {
  return Math.floor(duracion / interval);
}

/* Regla practica: interval en torno a 1/100 del tiempo total. */
function intervalo(duracion) {
  return duracion / 100;
}

/* Para ver con confianza una funcion que pesa X % hacen falta ~100/X. */
function muestrasNecesarias(porcentaje) {
  return Math.ceil(100 / porcentaje);
}

/* Generador congruencial lineal: la misma semilla da la misma secuencia.
   Los dos primeros valores se descartan porque semillas vecinas los dan
   casi iguales.                                                           */
function lcg(semilla) {
  var x = semilla >>> 0;
  function paso() {
    x = (Math.imul(1664525, x) + 1013904223) >>> 0;
    return x / 4294967296;
  }
  paso(); paso();
  return paso;
}

/* Cada muestra cae en una funcion segun su fraccion acumulada. Devuelve
   cuantas cayeron en cada una y el porcentaje que reportaria el perfilador. */
function simular(reparto, nMuestras, semilla) {
  var azar = lcg(semilla);
  var conteo = reparto.map(function () { return 0; });
  for (var k = 0; k < nMuestras; k++) {
    var u = azar(), acumulado = 0, i = 0;
    while (i < reparto.length - 1 && u >= acumulado + reparto[i].fraccion) {
      acumulado += reparto[i].fraccion;
      i++;
    }
    conteo[i] += 1;
  }
  return {
    total: nMuestras,
    muestras: conteo,
    estimado: conteo.map(function (c) { return nMuestras ? c / nMuestras * 100 : 0; })
  };
}

/* Mayor diferencia entre lo estimado y lo real, en puntos porcentuales. */
function error(reparto, estimado) {
  var peor = 0;
  reparto.forEach(function (f, i) {
    peor = Math.max(peor, Math.abs(estimado[i] - f.fraccion * 100));
  });
  return peor;
}

/* Nombres de las funciones que no recibieron ninguna muestra. */
function ausentes(reparto, sim) {
  return reparto.filter(function (f, i) { return sim.muestras[i] === 0; })
    .map(function (f) { return f.nombre; });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    FIB: FIB, TOTAL: TOTAL, PESOS: PESOS, PRESETS: PRESETS, REPARTO: REPARTO,
    muestras: muestras, intervalo: intervalo, muestrasNecesarias: muestrasNecesarias,
    lcg: lcg, simular: simular, error: error, ausentes: ausentes
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;
  var n = PRESETS[0];       // muestras del proximo sorteo
  var semilla = 1;          // avanza con cada Muestrear
  var corridas = 0;
  var ultima = null;        // resultado del ultimo sorteo; null antes del primero
  var reglaVista = false;   // la tabla de la carta 2 se destapa al mover el control

  var NOTA_PRESET = {
    5: "una muestra cada 2,64 s: cinco fotos de un programa de trece segundos.",
    13: "cerca de una muestra por segundo.",
    46: "una muestra cada 0,287 s, algo más de tres por segundo.",
    132: "así se corrió en clase: interval = 0,1 sobre 13,2 s.",
    1000: "interval = 0,0132, cerca de 1/1.000 del total; el overhead empieza a notarse."
  };

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function pct(x) { return num(x, 1) + " %"; }
  function signo(d) {
    var r = Math.round(d * 10) / 10;   // el signo se decide sobre lo que se imprime
    return (r > 0 ? "+" : r < 0 ? "−" : "") + num(Math.abs(r), 1);
  }

  // El valor de un input numerico llega con punto decimal aunque el
  // estudiante escriba coma; aqui se aceptan las dos.
  function leerDecimal(id) {
    return parseFloat(String(document.getElementById(id).value).replace(",", "."));
  }

  // Como Motor.conectarPrediccion, con el lector de arriba y un 2 % justo:
  // 0,001 no admite el margen fijo de 0,005 del motor.
  function conectarDecimal(ids, esperado, explicar) {
    var caja = document.getElementById(ids.veredicto);
    document.getElementById(ids.boton).addEventListener("click", function () {
      var dicho = leerDecimal(ids.entrada);
      var real = esperado();
      var bien = !isNaN(dicho) && Math.abs(dicho - real) <= Math.abs(real) * 0.02;
      caja.className = "veredicto " + (bien ? "bien" : "mal");
      caja.textContent = isNaN(dicho)
        ? Motor.veredictoNumerico(dicho, real).motivo
        : explicar(bien, real, dicho);
    });
  }

  /* Carta 2: la regla 100/X, con la tabla tapada hasta mover el control. */
  function pintarRegla() {
    var x = parseInt(document.getElementById("rango-x").value, 10);
    if (isNaN(x) || x < 1) { x = 1; }
    var nec = muestrasNecesarias(x);
    document.getElementById("ver-x").textContent = reglaVista ? num(x) + " %" : "?";
    document.getElementById("cuerpo-regla").innerHTML = PESOS.map(function (p) {
      var m = muestrasNecesarias(p);
      var marca = reglaVista && p === x ? " style=\"background:var(--resalte)\"" : "";
      return "<tr" + marca + "><td>" + num(p) + " %</td>" + (reglaVista
        ? "<td>" + num(m) + "</td><td>" + num(TOTAL / m, 4) + " s</td>"
        : "<td class=\"pend\">?</td><td class=\"pend\">?</td>") + "</tr>";
    }).join("");
    Motor.pintarChips("chips-regla", !reglaVista ? [] : [
      { texto: "pesa", valor: num(x) + " %" },
      { texto: "muestras necesarias", valor: "≈ " + num(nec), cuenta: true },
      { texto: "para 13,2 s, interval", valor: "≈ " + num(TOTAL / nec, 4) + " s" }
    ]);
  }

  /* Carta 3: barras reales y, tras muestrear, la estimada debajo de cada una. */
  function escala() {
    var mayor = 0;
    REPARTO.forEach(function (f, i) {
      mayor = Math.max(mayor, f.fraccion * 100, ultima ? ultima.estimado[i] : 0);
    });
    return Math.max(40, Math.ceil(mayor / 10) * 10);
  }

  function filasBarras() {
    var filas = [];
    REPARTO.forEach(function (f, i) {
      var real = f.fraccion * 100;
      filas.push({
        rotulo: esc(f.nombre),
        valor: pct(real),
        bloques: [{ inicio: 0, fin: real, color: "var(--azul)",
                    texto: real > 8 ? num(f.segundos, 1) + " s" : "",
                    titulo: f.nombre + ": " + num(f.segundos, 1) + " de " + num(TOTAL, 1) + " s" }]
      });
      if (!ultima) { return; }
      var m = ultima.muestras[i], e = ultima.estimado[i];
      filas.push({
        rotulo: "<span style=\"color:var(--gris)\">↳ estimado</span>",
        valor: pct(e),
        bloques: m === 0 ? [] : [{ inicio: 0, fin: e, color: "var(--ambar)",
                    texto: e > 5 ? num(m) : "",
                    titulo: num(m) + " de " + num(ultima.total) + " muestras" }]
      });
    });
    return filas;
  }

  function pintarBarras() {
    Motor.pintarGantt("panel-barras", filasBarras(), escala());
    // la fila estimada va en posicion impar y cierra el par de cada funcion
    var filas = document.getElementById("panel-barras").querySelectorAll(".barra-fila");
    filas.forEach(function (f, i) { if (ultima && i % 2 === 1) { f.classList.add("par"); } });
  }

  function pintarTabla() {
    document.getElementById("cuerpo-muestreo").innerHTML = REPARTO.map(function (f, i) {
      var real = f.fraccion * 100;
      var celdas = "<td class=\"pend\">?</td><td class=\"pend\">?</td><td class=\"pend\">?</td>";
      if (ultima) {
        var m = ultima.muestras[i], e = ultima.estimado[i];
        celdas = "<td>" + num(m) + "</td>" + (m === 0
          ? "<td style=\"color:var(--rojo)\">no aparece en el reporte</td>"
          : "<td>" + pct(e) + "</td>") + "<td>" + signo(e - real) + "</td>";
      }
      return "<tr><td style=\"text-align:left;font-family:ui-monospace,monospace\">" +
        esc(f.nombre) + "</td><td>" + pct(real) + "</td>" + celdas + "</tr>";
    }).join("");
  }

  function masDesviada() {
    var peor = 0;
    REPARTO.forEach(function (f, i) {
      var d = Math.abs(ultima.estimado[i] - f.fraccion * 100);
      if (d > Math.abs(ultima.estimado[peor] - REPARTO[peor].fraccion * 100)) { peor = i; }
    });
    return REPARTO[peor].nombre;
  }

  function pintarMuestreo() {
    document.getElementById("ver-n").textContent = num(n);
    Motor.pintarChips("chips-interval", [
      { texto: "para 13,2 s equivale a", valor: "interval ≈ " + num(TOTAL / n, 4) + " s" }
    ]);
    document.getElementById("nota-preset").textContent =
      "Con " + num(n) + " muestras, " + NOTA_PRESET[n];
    document.getElementById("progreso").textContent = !ultima
      ? "Las barras azules son el reparto real de los 13,2 s. Pulse Muestrear para ver " +
        "lo que reportaría el perfilador con " + num(n) + " muestras."
      : "Corrida " + num(corridas) + ": " + num(ultima.total) + " muestras. Cada Muestrear " +
        "es otro sorteo con el mismo interval: cambia qué función sale desviada, no el " +
        "tamaño típico de la desviación.";
    pintarBarras();
    pintarTabla();
    var faltan = ultima ? ausentes(REPARTO, ultima) : [];
    Motor.pintarChips("chips-muestreo", !ultima ? [] : [
      { texto: "error máximo", valor: num(error(REPARTO, ultima.estimado), 1) + " puntos", cuenta: true },
      { texto: "la más desviada", valor: esc(masDesviada()) },
      { texto: "no aparecen", valor: faltan.length ? faltan.map(esc).join(", ") : "ninguna" }
    ]);
  }

  /* Carta 1: las dos predicciones. */
  function explicarA(bien, real, dicho) {
    var t = "Una muestra cada décima de segundo durante " + num(FIB.duracion, 2) + " s: " +
      num(FIB.duracion, 2) + " / " + num(FIB.interval, 1) + " = " + num(real) + ". El reporte " +
      "de la clase dice Samples: 46, Duration: 4,640 y CPU time: 4,623, cálculo puro sin esperas. " +
      "La versión con memoización dura 0,000 s con el mismo interval: cero muestras, y el " +
      "reporte dice No samples were recorded.";
    return (bien ? "Sí, " + num(real) + ". " : "No: son " + num(real) + ", no " + num(dicho, 2) + ". ") + t;
  }

  function explicarB(bien, real, dicho) {
    var t = "La regla es 1/100 del tiempo total: 0,1 / 100 = " + num(real, 3) + " s, y caben " +
      "cerca de 100 muestras. Con interval = 0,1 el programa termina antes de la primera " +
      "muestra y el reporte queda vacío, como le pasó a fib con memoización. Un programa de " +
      "10 s pide 0,1.";
    return (bien ? "Sí, " + num(real, 3) + " s. " : "No: " + num(real, 3) + " s, no " + num(dicho, 4) + ". ") + t;
  }

  /* Carta 4: por que el arbol no trae el conteo de llamadas. */
  var RAZONES = {
    correcta: "Eso es. Cada 1,2 ms el perfilador anota la pila y sigue; entre una muestra y " +
      "la siguiente, distancia entró y salió unas dos mil veces sin que nadie lo apuntara. " +
      "Por eso el árbol dice 1,582 s en distancia y no dice cuántas llamadas fueron. Para el " +
      "conteo exacto está cProfile: 4.000.000, contadas una por una.",
    intervalo: "Con 2.377 muestras en 2,876 s el árbol es detallado, y aun así no trae el " +
      "conteo. Bajar el intervalo da más muestras y tiempos más finos; el número de " +
      "llamadas no sale de ningún intervalo, porque el muestreo no lo anota.",
    c: "distancia está en ruta.py:5, escrita en Python, y el árbol la muestra con 1,582 s: " +
      "1,150 de aritmética propia y 0,432 en la llamada a sqrt. El perfilador la ve; lo que " +
      "no anota es cuántas veces entró.",
    pocas: "Fueron cuatro millones: dos mil puntos contra dos mil. cProfile las cuenta una " +
      "por una, ncalls 4000000; Pyinstrument no las cuenta, sean pocas o muchas."
  };

  document.getElementById("rango-x").addEventListener("input", function () {
    reglaVista = true;
    pintarRegla();
  });
  document.querySelectorAll("[data-n]").forEach(function (b) {
    b.addEventListener("click", function () {
      n = parseInt(b.dataset.n, 10);
      ultima = null;
      pintarMuestreo();
    });
  });
  document.getElementById("btn-muestrear").addEventListener("click", function () {
    ultima = simular(REPARTO, n, semilla);
    semilla += 1;
    corridas += 1;
    pintarMuestreo();
  });
  Motor.conectarPrediccion(
    { entrada: "prediccion-a", boton: "btn-comprobar-a", veredicto: "veredicto-a" },
    function () { return muestras(FIB.duracion, FIB.interval); },
    explicarA);
  conectarDecimal(
    { entrada: "prediccion-b", boton: "btn-comprobar-b", veredicto: "veredicto-b" },
    function () { return intervalo(0.1); },
    explicarB);
  Motor.conectarOpciones("opciones-conteo", "veredicto-conteo", RAZONES);

  pintarRegla();
  pintarMuestreo();
})();

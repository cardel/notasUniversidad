if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Reparto de las iteraciones de un parallel for entre los hilos del equipo.
   Cada politica entrega los bloques en un orden distinto; el costo de cada
   iteracion sale de costosUniformes o costosCrecientes y el reloj se mide en
   unidades de trabajo. Los cuatro tiempos de la carta 3 son medidos en un
   AMD Ryzen 5 3600 de 6 nucleos y 12 hilos de hardware.                 */

var N = 12;               // iteraciones del ciclo del panel
var HILOS = 3;            // hilos del equipo del panel
var HILOS_MAQUINA = 12;   // hilos de hardware de la maquina de las medidas

var COLORES = ["var(--azul)", "var(--ambar)", "var(--verde)"];

var POLITICAS = [
  { clave: "static",   etiqueta: "static",    politica: "static",  chunk: 0,
    clausula: "schedule(static)" },
  { clave: "static1",  etiqueta: "static 1",  politica: "static",  chunk: 1,
    clausula: "schedule(static, 1)" },
  { clave: "dynamic2", etiqueta: "dynamic 2", politica: "dynamic", chunk: 2,
    clausula: "schedule(dynamic, 2)" },
  { clave: "guided",   etiqueta: "guided",    politica: "guided",  chunk: 1,
    clausula: "schedule(guided)" }
];

var PATRONES = {
  uniforme:  { etiqueta: "uniforme",  cuerpo: "resultado[i] = dato[i] * 2;" },
  creciente: { etiqueta: "creciente", cuerpo: "resultado[i] = trabajo_variable(i);" }
};

/* Lo medido sobre el ciclo de n = 10.000 x 10.000. */
var MEDIDO = [
  { clave: "static",      politica: "static",          ms: 57.05 },
  { clave: "dynamic2",    politica: "dynamic, 2",      ms: 49.83 },
  { clave: "guided",      politica: "guided",          ms: 58.93 },
  { clave: "dynamic1000", politica: "dynamic, 1000",   ms: 66.26 }
];

function costosUniformes(n) {
  var c = [];
  for (var i = 0; i < n; i++) { c.push(1); }
  return c;
}

function costosCrecientes(n) {
  var c = [];
  for (var i = 0; i < n; i++) { c.push(i + 1); }
  return c;
}

/* Tamanos de bloque que entrega cada politica, en el orden en que salen.
   static sin chunk parte en tantos bloques contiguos como hilos; static con
   chunk y dynamic cortan de a chunk; guided entrega la mitad de lo que queda
   repartido entre los hilos, nunca menos que chunk.                        */
function bloques(politica, iteraciones, hilos, chunk) {
  var lista = [], i, tam;
  if (politica === "static" && !chunk) {
    var base = Math.floor(iteraciones / hilos), resto = iteraciones % hilos, desde = 0;
    for (i = 0; i < hilos; i++) {
      tam = base + (i < resto ? 1 : 0);
      if (tam > 0) { lista.push({ desde: desde, tam: tam }); desde += tam; }
    }
    return lista;
  }
  if (politica === "static" || politica === "dynamic") {
    var c = Math.max(1, chunk);
    for (i = 0; i < iteraciones; i += c) {
      lista.push({ desde: i, tam: Math.min(c, iteraciones - i) });
    }
    return lista;
  }
  var entregadas = 0, minimo = Math.max(1, chunk);
  while (entregadas < iteraciones) {
    var quedan = iteraciones - entregadas;
    tam = Math.min(quedan, Math.max(minimo, Math.ceil(quedan / (2 * hilos))));
    lista.push({ desde: entregadas, tam: tam });
    entregadas += tam;
  }
  return lista;
}

/* Reparte los bloques entre los hilos. static los asigna de antemano por
   turnos; dynamic y guided se los dan al hilo que se desocupa primero.     */
function repartir(politica, iteraciones, hilos, chunk, costos) {
  var lista = bloques(politica, iteraciones, hilos, chunk), equipo = [], h;
  for (h = 0; h < hilos; h++) {
    equipo.push({ hilo: h, iteraciones: [], bloques: [], fin: 0 });
  }
  lista.forEach(function (b, k) {
    var destino = equipo[k % hilos], i;
    if (politica !== "static") {
      destino = equipo[0];
      for (var j = 1; j < hilos; j++) {
        if (equipo[j].fin < destino.fin) { destino = equipo[j]; }
      }
    }
    var costo = 0;
    for (i = b.desde; i < b.desde + b.tam; i++) {
      destino.iteraciones.push(i);
      costo += costos[i];
    }
    destino.bloques.push({
      inicio: destino.fin, fin: destino.fin + costo, desde: b.desde, tam: b.tam, costo: costo
    });
    destino.fin += costo;
  });
  return equipo;
}

function makespan(reparto) {
  return reparto.reduce(function (m, h) { return Math.max(m, h.fin); }, 0);
}

function iteracionesPorHilo(reparto) {
  return reparto.map(function (h) { return h.iteraciones.length; });
}

function cargaPareja(reparto) {
  var fines = reparto.map(function (h) { return h.fin; });
  return Math.max.apply(null, fines) === Math.min.apply(null, fines);
}

function hiloMasCargado(reparto) {
  var cual = 0;
  reparto.forEach(function (h) { if (h.fin > reparto[cual].fin) { cual = h.hilo; } });
  return cual;
}

function etiquetaRango(desde, tam) {
  return tam === 1 ? String(desde) : desde + "-" + (desde + tam - 1);
}

function filasGantt(reparto) {
  return reparto.map(function (h) {
    return {
      rotulo: "hilo " + h.hilo,
      valor: Motor.num(h.fin),
      bloques: h.bloques.map(function (b, k) {
        return {
          inicio: b.inicio, fin: b.fin, color: COLORES[k % COLORES.length],
          texto: etiquetaRango(b.desde, b.tam),
          titulo: "iteraciones " + etiquetaRango(b.desde, b.tam) + ", " +
            Motor.num(b.costo) + " unidades"
        };
      })
    };
  });
}

function mejorMedido() {
  return MEDIDO.reduce(function (a, b) { return b.ms < a.ms ? b : a; });
}

function esperadoStatic() {
  return repartir("static", N, HILOS, 0, costosUniformes(N))[HILOS - 1].iteraciones[0];
}

function hilosAnidados() {
  return HILOS_MAQUINA * HILOS_MAQUINA;
}

function explicarStatic(bien, real, dicho) {
  return (bien ? "Así es. " : "Escribió " + Motor.num(dicho, 2) + ". ") +
    "static parte las doce iteraciones en tres bloques contiguos de cuatro: el hilo 0 se " +
    "lleva de la 0 a la 3, el hilo 1 de la 4 a la 7 y el hilo 2 arranca en la " +
    Motor.num(real) + ". El panel de arriba quedó en ese reparto.";
}

function explicarAnidado(bien, real, dicho) {
  return (bien ? "Sí, son " : "Escribió " + Motor.num(dicho, 2) + "; la cuenta da ") +
    "12 × 12 = " + Motor.num(real) + " hilos: cada uno de los doce hilos externos abre su " +
    "propia región de doce. Por eso el anidamiento viene apagado y la región interna corre " +
    "con un equipo de un solo hilo. Para repartir los dos ciclos de una vez está collapse.";
}

var RAZONES_TIEMPOS = {
  correcta: "Sí: 49,83 ms, el mejor de los cuatro. dynamic entrega dos iteraciones al hilo " +
    "que se desocupa, así que el que acaba pronto vuelve por más en vez de esperar a los otros.",
  static: "Con static el reloj marcó 57,05 ms. El reparto queda decidido antes de arrancar y " +
    "coordinarlo no cuesta nada, pero el hilo que acaba temprano se queda esperando a los demás.",
  guided: "guided quedó en 58,93 ms. Arranca con bloques grandes y los va recortando; sobre " +
    "este ciclo no le ganó al reparto de a dos iteraciones.",
  dynamic1000: "Los bloques de 1000 dieron el peor tiempo de los cuatro: 66,26 ms. Bloques " +
    "tan grandes dejan hilos ociosos al final del ciclo."
};

var RAZONES_CICLOS = {
  correcta: "collapse(2) funde los dos ciclos en uno. El equipo reparte las 12 × 10.000 = " +
    "120.000 iteraciones y a cada hilo le toca un puñado de columnas, no una fila entera.",
  anidar: "Cada hilo externo abre otro equipo de doce, muchos más hilos que los 12 de hardware. El planificador pasa más tiempo " +
    "cambiando de contexto que calculando.",
  interno: "Con el parallel for adentro, cada fila abre y cierra su propia región: doce " +
    "arranques de equipo, y cada hilo cuesta decenas de microsegundos.",
  externo: "Doce iteraciones entre doce hilos, una para cada uno. Si las filas no cuestan " +
    "igual, el hilo que se llevó la fila lenta fija el tiempo total y los otros once esperan."
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    N: N, HILOS: HILOS, HILOS_MAQUINA: HILOS_MAQUINA, COLORES: COLORES,
    POLITICAS: POLITICAS, PATRONES: PATRONES, MEDIDO: MEDIDO,
    costosUniformes: costosUniformes, costosCrecientes: costosCrecientes,
    bloques: bloques, repartir: repartir, makespan: makespan,
    iteracionesPorHilo: iteracionesPorHilo, hiloMasCargado: hiloMasCargado,
    cargaPareja: cargaPareja,
    etiquetaRango: etiquetaRango, filasGantt: filasGantt, mejorMedido: mejorMedido,
    esperadoStatic: esperadoStatic, hilosAnidados: hilosAnidados,
    explicarStatic: explicarStatic, explicarAnidado: explicarAnidado,
    RAZONES_TIEMPOS: RAZONES_TIEMPOS, RAZONES_CICLOS: RAZONES_CICLOS
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;
  var politica = "dynamic2";
  var patron = "creciente";
  var abiertoStatic = false;     // los dos static se habilitan con la carta 2
  var destapadoTiempos = false;  // la tabla de la carta 3 se destapa al responder

  function conf() {
    return POLITICAS.filter(function (p) { return p.clave === politica; })[0];
  }
  function costos() {
    return patron === "uniforme" ? costosUniformes(N) : costosCrecientes(N);
  }
  function reparto() {
    var c = conf();
    return repartir(c.politica, N, HILOS, c.chunk, costos());
  }
  function bloqueado(clave) {
    return !abiertoStatic && (clave === "static" || clave === "static1");
  }

  function pintarPresets() {
    document.querySelectorAll("[data-politica]").forEach(function (b) {
      b.classList.toggle("activo", b.dataset.politica === politica);
      b.disabled = bloqueado(b.dataset.politica);
    });
    document.querySelectorAll("[data-patron]").forEach(function (b) {
      b.classList.toggle("activo", b.dataset.patron === patron);
    });
    document.getElementById("nota-static").textContent = abiertoStatic
      ? "Con static el reparto queda decidido antes de arrancar: cada hilo sabe sus " +
        "iteraciones sin preguntarle a nadie."
      : "Responda la predicción de abajo para abrir los dos repartos static.";
  }

  function pintarCodigo() {
    var lineas = [
      "#pragma omp parallel for " + conf().clausula,
      "for (int i = 0; i &lt; n; i++)",
      "    " + PATRONES[patron].cuerpo
    ];
    document.getElementById("codigo-panel").innerHTML = lineas.map(function (t, i) {
      return "<div class=\"linea" + (i === 0 ? " bloque-1" : "") + "\">" +
        "<span class=\"num\">" + (i + 1) + "</span><span class=\"txt\">" + t + "</span></div>";
    }).join("");
  }

  function pintarPanel() {
    var r = reparto(), tope = makespan(r) || 1;
    Motor.pintarGantt("panel-gantt", filasGantt(r), tope);
    document.getElementById("cuerpo-reparto").innerHTML = r.map(function (h) {
      return "<tr><td>hilo " + h.hilo + "</td><td style=\"text-align:left\">" +
        h.iteraciones.join(", ") + "</td><td>" + num(h.fin) + "</td></tr>";
    }).join("");
    Motor.pintarChips("chips-reparto", [
      { texto: "termina en", valor: num(tope) + " unidades" },
      { texto: "iteraciones por hilo", valor: iteracionesPorHilo(r).join(" · ") },
      { texto: "hilo más cargado",
        valor: cargaPareja(r) ? "empate" : "hilo " + hiloMasCargado(r), cuenta: true }
    ]);
  }

  function pintarTiempos() {
    var mejor = mejorMedido().clave;
    document.getElementById("cuerpo-tiempos").innerHTML = MEDIDO.map(function (f) {
      var celda = destapadoTiempos
        ? "<td>" + num(f.ms, 2) + " ms</td>"
        : "<td class=\"pend\">?</td>";
      var fondo = destapadoTiempos && f.clave === mejor
        ? " style=\"background:var(--resalte)\"" : "";
      return "<tr" + fondo + "><td>schedule(" + f.politica + ")</td>" + celda + "</tr>";
    }).join("");
  }

  function pintar() {
    pintarPresets();
    pintarCodigo();
    pintarPanel();
    pintarTiempos();
  }

  document.querySelectorAll("[data-politica]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (bloqueado(b.dataset.politica)) { return; }
      politica = b.dataset.politica;
      pintar();
    });
  });
  document.querySelectorAll("[data-patron]").forEach(function (b) {
    b.addEventListener("click", function () {
      patron = b.dataset.patron;
      pintar();
    });
  });

  Motor.conectarPrediccion(
    { entrada: "prediccion-static", boton: "btn-comprobar-static", veredicto: "veredicto-static" },
    esperadoStatic, explicarStatic);
  document.getElementById("btn-comprobar-static").addEventListener("click", function () {
    if (isNaN(Motor.leerNumero("prediccion-static"))) { return; }
    abiertoStatic = true;
    politica = "static";
    patron = "uniforme";
    pintar();
  });

  Motor.conectarPrediccion(
    { entrada: "prediccion-anidado", boton: "btn-comprobar-anidado", veredicto: "veredicto-anidado" },
    hilosAnidados, explicarAnidado);
  document.getElementById("btn-comprobar-anidado").addEventListener("click", function () {
    if (isNaN(Motor.leerNumero("prediccion-anidado"))) { return; }
    document.getElementById("extra-anidado").style.display = "block";
  });

  Motor.conectarOpciones("opciones-tiempos", "veredicto-tiempos", RAZONES_TIEMPOS);
  document.querySelectorAll("#opciones-tiempos button").forEach(function (b) {
    b.addEventListener("click", function () {
      destapadoTiempos = true;
      pintarTiempos();
      document.getElementById("extra-tiempos").style.display = "block";
    });
  });

  Motor.conectarOpciones("opciones-ciclos", "veredicto-ciclos", RAZONES_CICLOS);

  pintar();
})();

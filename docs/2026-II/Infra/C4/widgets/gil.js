if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* El GIL reparte ocho tareas entre h hilos. Una tarea es
   { tipo: "calculo" | "espera", duracion }. Las de calculo se serializan,
   porque solo un hilo ejecuta bytecode a la vez, y encima pagan el cambio de
   turno; las de espera se solapan, porque el hilo suelta el GIL antes de
   dormirse. La medicion de la apertura, sumar cien millones de enteros de una
   lista de Python, esta en MEDIDO.                                          */

var SOBRECOSTO = 0.04;   // segundos que cuesta un cambio de turno del GIL
var D = 0.63;            // duracion de cada una de las ocho tareas

var COLOR = { calculo: "var(--azul)", espera: "var(--gris)", cambio: "var(--ambar)" };

function repetir(n, tipo, duracion, nombre, corto) {
  var lista = [];
  for (var i = 0; i < n; i++) {
    lista.push({ tipo: tipo, duracion: duracion, nombre: nombre, corto: corto });
  }
  return lista;
}

var PROGRAMAS = {
  calculo: {
    nombre: "cálculo puro",
    tareas: repetir(8, "calculo", D, "sumar 12,5 millones de enteros", "sumar")
  },
  espera: {
    nombre: "espera de red",
    tareas: repetir(8, "espera", D, "esperar la respuesta del servidor", "esperar")
  },
  mitad: {
    nombre: "mitad y mitad",
    tareas: repetir(4, "espera", D, "esperar la respuesta del servidor", "esperar")
      .concat(repetir(4, "calculo", D, "sumar el bloque que llegó", "sumar"))
  }
};
var DEFECTO = "calculo";
var HILOS = [1, 2, 4, 8, 16];
var HILOS_DEFECTO = 4;

/* Lo medido en la maquina de la clase: ms es la medida en segundos. */
var MEDIDO = [
  { hilos: 1, ms: 5.05 },
  { hilos: 2, ms: 6.27 },
  { hilos: 4, ms: 7.04 },
  { hilos: 8, ms: 6.23 },
  { hilos: 16, ms: 5.48 }
];

function esCalculo(t) { return t.tipo === "calculo"; }

/* Reparto por turnos: el hilo i recibe las tareas i, i + h, i + 2h... */
function repartir(tareas, h) {
  var hilos = [];
  for (var i = 0; i < h; i++) { hilos.push([]); }
  tareas.forEach(function (t, i) { hilos[i % h].push(t); });
  return hilos;
}

function tiempoSecuencial(tareas) {
  return tareas.reduce(function (s, t) { return s + t.duracion; }, 0);
}

function sumaCalculo(tareas) {
  return tareas.filter(esCalculo).reduce(function (s, t) { return s + t.duracion; }, 0);
}

function sumaEspera(tareas) {
  return tareas.filter(function (t) { return !esCalculo(t); })
    .reduce(function (s, t) { return s + t.duracion; }, 0);
}

/* Las esperas de los hilos corren a la vez, asi que manda la mas larga. */
function esperaMayor(tareas, h) {
  return repartir(tareas, h).reduce(function (m, hilo) {
    var e = hilo.filter(function (t) { return !esCalculo(t); })
      .reduce(function (s, t) { return s + t.duracion; }, 0);
    return Math.max(m, e);
  }, 0);
}

/* Hilos que llegan a pelear por el GIL: no mas que tareas de calculo. */
function hilosEnCalculo(tareas, h) {
  return Math.min(h, tareas.filter(esCalculo).length);
}

/* El interprete cede el GIL cada pocos milisegundos, asi que cada tarea de
   calculo queda partida en tantos turnos como hilos compitan, y el GIL cambia
   de mano en cada frontera. Con un solo hilo no hay a quien pasarlo.        */
function cambiosDeTurno(tareas, h) {
  var c = tareas.filter(esCalculo).length;
  if (c === 0 || h <= 1) { return 0; }
  return c * hilosEnCalculo(tareas, h) - 1;
}

/* Tiempo de pared: el calculo completo, uno a la vez, mas los cambios de
   turno, mas la espera del hilo que mas espera.                            */
function tiempoConHilos(tareas, h, sobrecosto) {
  if (sobrecosto === undefined) { sobrecosto = SOBRECOSTO; }
  return sumaCalculo(tareas) + sobrecosto * cambiosDeTurno(tareas, h) +
    esperaMayor(tareas, h);
}

function ganancia(tareas, h, sobrecosto) {
  var t = tiempoConHilos(tareas, h, sobrecosto);
  return t > 0 ? tiempoSecuencial(tareas) / t : 0;
}

/* Ganancia medida contra la corrida de un solo hilo. */
function gananciaMedida(i) { return MEDIDO[0].ms / MEDIDO[i].ms; }

/* Linea de tiempo en tramos, en orden: primero las esperas, que arrancan las
   de todos los hilos en cero, y despues los turnos de calculo, uno a uno,
   con el cambio de turno entre dos consecutivos.                           */
function planear(tareas, h, sobrecosto) {
  if (sobrecosto === undefined) { sobrecosto = SOBRECOSTO; }
  var reparto = repartir(tareas, h);
  var tramos = [];
  reparto.forEach(function (hilo, i) {
    var t = 0;
    hilo.forEach(function (tarea) {
      if (!esCalculo(tarea)) {
        tramos.push({ hilo: i, tipo: "espera", inicio: t, fin: t + tarea.duracion,
                      nombre: tarea.nombre, corto: tarea.corto });
        t += tarea.duracion;
      }
    });
  });
  var hA = hilosEnCalculo(tareas, h);
  var colas = reparto.map(function (hilo, i) {
    var trozos = [];
    hilo.filter(esCalculo).forEach(function (tarea, j) {
      for (var s = 0; s < hA; s++) {
        trozos.push({ hilo: i, tarea: j + 1, turno: s + 1, de: hA,
                      duracion: tarea.duracion / hA,
                      nombre: tarea.nombre, corto: tarea.corto });
      }
    });
    return trozos;
  });
  var reloj = esperaMayor(tareas, h);
  var primero = true, pos = 0, quedan = true;
  while (quedan) {
    quedan = false;
    for (var i = 0; i < colas.length; i++) {
      if (pos >= colas[i].length) { continue; }
      quedan = true;
      var tr = colas[i][pos];
      if (!primero && h > 1) {
        tramos.push({ hilo: -1, tipo: "cambio", inicio: reloj, fin: reloj + sobrecosto });
        reloj += sobrecosto;
      }
      tramos.push({ hilo: i, tipo: "calculo", inicio: reloj, fin: reloj + tr.duracion,
                    tarea: tr.tarea, turno: tr.turno, de: tr.de,
                    nombre: tr.nombre, corto: tr.corto });
      reloj += tr.duracion;
      primero = false;
    }
    pos++;
  }
  return tramos;
}

function tituloTramo(s) {
  var num = Motor.num;
  if (s.tipo === "cambio") {
    return "cambio de turno del GIL: " + num(s.fin - s.inicio, 2) + " s";
  }
  if (s.tipo === "espera") {
    return "hilo " + s.hilo + ", " + s.nombre + ": " + num(s.fin - s.inicio, 2) +
      " s sin el GIL";
  }
  return "hilo " + s.hilo + " con el GIL, " + s.nombre + ", turno " + s.turno +
    " de " + s.de + ": " + num(s.fin - s.inicio, 2) + " s";
}

/* Una fila por hilo y una del GIL, con los primeros k tramos. */
function filasGantt(tareas, h, sobrecosto, k) {
  var num = Motor.num;
  var esc = tiempoConHilos(tareas, h, sobrecosto) || 1;
  var vistos = planear(tareas, h, sobrecosto).slice(0, k);
  function ancho(s) { return (s.fin - s.inicio) / esc; }
  function sumar(lista) {
    return lista.reduce(function (a, s) { return a + (s.fin - s.inicio); }, 0);
  }
  var filas = [];
  for (var i = 0; i < h; i++) {
    var mios = vistos.filter(function (s) { return s.hilo === i; });
    filas.push({
      rotulo: "hilo " + i,
      valor: num(sumar(mios), 2) + " s",
      bloques: mios.map(function (s) {
        return { inicio: s.inicio, fin: s.fin, color: COLOR[s.tipo],
                 texto: ancho(s) > 0.05 ? s.corto : "", titulo: tituloTramo(s) };
      })
    });
  }
  var gil = vistos.filter(function (s) { return s.tipo !== "espera"; });
  filas.push({
    rotulo: "el GIL",
    valor: num(sumar(gil.filter(function (s) { return s.tipo === "calculo"; })), 2) + " s",
    bloques: gil.map(function (s) {
      return { inicio: s.inicio, fin: s.fin, color: COLOR[s.tipo],
               texto: s.tipo === "calculo" && ancho(s) > 0.05 ? "hilo " + s.hilo : "",
               titulo: tituloTramo(s) };
    })
  });
  return filas;
}

/* Que pasa en el tramo i, contando desde 0. */
function describirPaso(tareas, h, sobrecosto, i) {
  var num = Motor.num;
  var tramos = planear(tareas, h, sobrecosto);
  var s = tramos[i];
  var t = "Tramo " + (i + 1) + ": ";
  if (s.tipo === "espera") {
    t += "el hilo " + s.hilo + " aguarda " + num(s.fin - s.inicio, 2) +
      " s. Suelta el GIL antes de dormirse, así que los otros hilos también " +
      "esperan en ese mismo rato, no después.";
  } else if (s.tipo === "cambio") {
    t += "el GIL cambia de mano y se pagan " + num(s.fin - s.inicio, 2) +
      " s en los que ningún hilo avanza.";
  } else {
    t += "el hilo " + s.hilo + " toma el GIL y calcula " + num(s.fin - s.inicio, 2) +
      " s, el turno " + s.turno + " de " + s.de + " de su tarea. Mientras dura, " +
      "ningún otro hilo ejecuta bytecode.";
  }
  return t + " Reloj: " + num(s.fin, 2) + " s.";
}

/* Cierre cuando ya pasaron todos los tramos: de donde sale el total. */
function describirCierre(tareas, h, sobrecosto) {
  if (sobrecosto === undefined) { sobrecosto = SOBRECOSTO; }
  var num = Motor.num;
  var total = tiempoConHilos(tareas, h, sobrecosto);
  var seq = tiempoSecuencial(tareas);
  var calc = sumaCalculo(tareas);
  var esp = sumaEspera(tareas);
  var mayor = esperaMayor(tareas, h);
  var c = cambiosDeTurno(tareas, h);
  var t = "Total con " + h + (h === 1 ? " hilo: " : " hilos: ") + num(total, 2) +
    " s contra " + num(seq, 2) + " s de un solo hilo, ganancia " +
    num(seq / total, 2) + ". ";
  if (calc > 0) {
    t += "Los " + num(calc, 2) + " s de cálculo se hacen igual, uno a la vez";
    t += c > 0
      ? ", y encima " + num(c) + " cambios de turno × " + num(sobrecosto, 2) +
        " s suman " + num(c * sobrecosto, 2) + " s. "
      : ". ";
  }
  if (esp > 0) {
    t += "De los " + num(esp, 2) + " s de espera, el hilo que más aguarda carga " +
      num(mayor, 2) + " s, y eso es lo único que aporta al total: las esperas " +
      "corren unas sobre otras. ";
  }
  if (calc > 0 && esp === 0) {
    t += "Nada se reparte: agregar hilos a este programa solo agrega cambios de turno.";
  } else if (esp > 0 && calc === 0) {
    t += "Aquí los hilos sí sirven, y por eso: no compiten por el GIL, esperan.";
  } else {
    t += "La mitad que espera se reparte; la que calcula, no.";
  }
  return t;
}

/* Veredicto de la prediccion: el programa de espera de red con cuatro hilos.
   Es el unico de los tres que el estudiante puede calcular con la tabla de la
   carta 1: las esperas se solapan, asi que cada hilo se lleva dos tareas.     */
function explicarPrediccion(bien, real, dicho) {
  var num = Motor.num;
  var espera = PROGRAMAS.espera.tareas;
  var calculo = PROGRAMAS.calculo.tareas;
  var t = bien
    ? "Sí: " + num(real, 2) + " s."
    : "No: son " + num(real, 2) + " s, no " + num(dicho, 2) + ".";
  t += " Las ocho esperas se solapan: cada hilo se lleva dos y las cuatro " +
    "parejas corren a la vez, así que el total es 2 × 0,63. El hilo que espera " +
    "una respuesta suelta el GIL antes de dormirse y otro avanza mientras tanto. " +
    "Con el programa de cálculo puro no pasa eso: los " +
    num(sumaCalculo(calculo), 2) + " s se hacen uno a la vez y encima se pagan " +
    num(cambiosDeTurno(calculo, 4)) + " cambios de turno. En la máquina de la " +
    "clase ese programa midió 7,04 s con cuatro hilos contra 5,05 s con uno.";
  return t;
}

var RAZONES_NUCLEOS = {
  correcta: "Sí. El GIL es un mutex de CPython y solo uno lo tiene: los hilos se " +
    "turnan para ejecutar bytecode, así que las cien millones de sumas salen " +
    "igual de seguidas que con un hilo, y encima se paga el cambio de turno. Con " +
    "16 hilos la corrida quedó en 5,48 s, todavía por encima de los 5,05 s de un " +
    "solo hilo.",
  nucleos: "Los núcleos sobran: 6 físicos y 12 hilos de hardware. Con 4 hilos, que " +
    "caben de sobra en 6 núcleos, el tiempo subió a 7,04 s en vez de bajar; si el " +
    "cuello fuera el número de núcleos, esa corrida habría sido la más rápida.",
  cache: "El mismo trabajo en un solo hilo tarda 5,05 s y recorre exactamente la " +
    "misma lista. Lo que cambia entre las cinco corridas es de quién es el turno, " +
    "no cómo se pasea la memoria: la lista y el recorrido son idénticos en todas.",
  carrera: "Cada hilo suma su segmento en una variable local y el total se arma al " +
    "final, así que el resultado sale correcto en las cinco corridas. Una condición " +
    "de carrera daría números distintos cada vez; aquí el número está bien y lo que " +
    "no mejora es el tiempo."
};

var RAZONES_SIRVEN = {
  correcta: "Sí. Los bucles de Python que multiplican las matrices son bytecode y " +
    "nada más: el hilo no suelta el GIL por su cuenta, solo lo cede cuando el " +
    "intérprete lo obliga cada pocos milisegundos. Ocho hilos se turnan para hacer " +
    "el mismo trabajo, como en las cinco medidas de la tabla.",
  descargas: "Las 50 descargas pasan casi todo su tiempo aguardando la respuesta " +
    "del servidor, y el hilo suelta el GIL antes de dormirse. Por eso las esperas " +
    "se solapan: con el programa de espera de red y cuatro hilos, los 5,04 s de " +
    "espera se vuelven 1,26.",
  archivos: "Leer 200 archivos es casi todo espera del disco. Mientras el sistema " +
    "operativo trae los bloques el hilo no tiene el GIL, así que otro hilo pide su " +
    "archivo en ese mismo rato y las 200 lecturas se montan unas sobre otras."
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    SOBRECOSTO: SOBRECOSTO, PROGRAMAS: PROGRAMAS, DEFECTO: DEFECTO, HILOS: HILOS,
    HILOS_DEFECTO: HILOS_DEFECTO, MEDIDO: MEDIDO,
    RAZONES_NUCLEOS: RAZONES_NUCLEOS, RAZONES_SIRVEN: RAZONES_SIRVEN,
    esCalculo: esCalculo, repartir: repartir, tiempoSecuencial: tiempoSecuencial,
    sumaCalculo: sumaCalculo, sumaEspera: sumaEspera, esperaMayor: esperaMayor,
    hilosEnCalculo: hilosEnCalculo, cambiosDeTurno: cambiosDeTurno,
    tiempoConHilos: tiempoConHilos, ganancia: ganancia, gananciaMedida: gananciaMedida,
    planear: planear, filasGantt: filasGantt, describirPaso: describirPaso,
    describirCierre: describirCierre, explicarPrediccion: explicarPrediccion
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;
  var prog = DEFECTO;
  var h = HILOS_DEFECTO;
  var k = 0;                  // tramos mostrados
  var vistaGanancia = false;  // la columna de la carta 4 se destapa al responder

  function tareas() { return PROGRAMAS[prog].tareas; }
  function tramos() { return planear(tareas(), h, SOBRECOSTO); }

  function pintarPresets() {
    document.querySelectorAll("[data-programa]").forEach(function (b) {
      b.classList.toggle("activo", b.dataset.programa === prog);
    });
    document.querySelectorAll("[data-hilos]").forEach(function (b) {
      b.classList.toggle("activo", Number(b.dataset.hilos) === h);
    });
  }

  function pintarTareas() {
    document.getElementById("cuerpo-tareas").innerHTML = tareas().map(function (t, i) {
      return "<tr><td style=\"text-align:left\">" + t.nombre + "</td><td>" +
        "<span class=\"tipo\" style=\"background:" + COLOR[t.tipo] + "\"></span>" +
        (esCalculo(t) ? "cálculo" : "espera") + "</td><td>" + num(t.duracion, 2) +
        " s</td><td>hilo " + (i % h) + "</td></tr>";
    }).join("");
  }

  function pintarPaso() {
    var lista = tramos();
    var hechos = k >= lista.length;
    Motor.pintarGantt("panel-gantt", filasGantt(tareas(), h, SOBRECOSTO, k),
      tiempoConHilos(tareas(), h, SOBRECOSTO) || 1);
    document.getElementById("progreso").textContent = k === 0
      ? "Programa " + PROGRAMAS[prog].nombre + " con " + h +
        (h === 1 ? " hilo: " : " hilos: ") + lista.length + " tramos por recorrer."
      : "Tramo " + k + " de " + lista.length + " · " + PROGRAMAS[prog].nombre +
        " con " + h + (h === 1 ? " hilo" : " hilos") + (hechos ? " · terminó" : "");
    document.getElementById("btn-siguiente").disabled = hechos;
    var texto = k > 0 ? describirPaso(tareas(), h, SOBRECOSTO, k - 1) : "";
    if (hechos) { texto += " " + describirCierre(tareas(), h, SOBRECOSTO); }
    document.getElementById("paso-texto").textContent = texto;

    var vistos = lista.slice(0, k);
    var reloj = vistos.reduce(function (m, s) { return Math.max(m, s.fin); }, 0);
    var cambios = vistos.filter(function (s) { return s.tipo === "cambio"; }).length;
    Motor.pintarChips("chips-gil", [
      { texto: "tiempo total", valor: num(hechos ? tiempoConHilos(tareas(), h, SOBRECOSTO) : reloj, 2) + " s" },
      { texto: "tiempo secuencial", valor: num(tiempoSecuencial(tareas()), 2) + " s" },
      { texto: "cambios de turno", valor: num(cambios) },
      { texto: "ganancia", valor: hechos ? num(ganancia(tareas(), h, SOBRECOSTO), 2) : "?", cuenta: true }
    ]);
  }

  function pintarMedido() {
    document.getElementById("cuerpo-medido").innerHTML = MEDIDO.map(function (f, i) {
      var g = vistaGanancia
        ? "<td>" + num(gananciaMedida(i), 2) + "</td>"
        : "<td class=\"pend\">?</td>";
      return "<tr" + (f.hilos === 1 ? " style=\"background:var(--resalte)\"" : "") +
        "><td>" + f.hilos + "</td><td>" + num(f.ms, 2) + " s</td>" + g + "</tr>";
    }).join("");
  }

  function pintar() {
    pintarPresets();
    pintarTareas();
    pintarPaso();
    pintarMedido();
  }

  document.querySelectorAll("[data-programa]").forEach(function (b) {
    b.addEventListener("click", function () {
      prog = b.dataset.programa; k = 0; pintar();
    });
  });
  document.querySelectorAll("[data-hilos]").forEach(function (b) {
    b.addEventListener("click", function () {
      h = Number(b.dataset.hilos); k = 0; pintar();
    });
  });
  document.getElementById("btn-siguiente").addEventListener("click", function () {
    k = Math.min(k + 1, tramos().length); pintarPaso();
  });
  document.getElementById("btn-todo").addEventListener("click", function () {
    k = tramos().length; pintarPaso();
  });
  document.getElementById("btn-reiniciar").addEventListener("click", function () {
    k = 0; pintarPaso();
  });

  Motor.conectarPrediccion(
    { entrada: "prediccion-gil", boton: "btn-comprobar-gil", veredicto: "veredicto-gil" },
    function () { return tiempoConHilos(PROGRAMAS.espera.tareas, 4, SOBRECOSTO); },
    explicarPrediccion);
  Motor.conectarOpciones("opciones-nucleos", "veredicto-nucleos", RAZONES_NUCLEOS);
  Motor.conectarOpciones("opciones-sirven", "veredicto-sirven", RAZONES_SIRVEN);
  document.querySelectorAll("#opciones-nucleos button").forEach(function (b) {
    b.addEventListener("click", function () { vistaGanancia = true; pintarMedido(); });
  });

  pintar();
})();

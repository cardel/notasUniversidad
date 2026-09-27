if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Los dos hilos de la clase con los join en dos sitios distintos:
   start-start-join-join y start-join-start-join. Modelo del reloj: un start
   pone el hilo a correr desde el instante en que va el principal y no lo
   detiene; un join adelanta el reloj del principal hasta el fin de ese hilo,
   y si el hilo ya habia terminado no espera nada.                          */

var ETIQUETA = {
  start1: "t1.start()", start2: "t2.start()",
  join1: "t1.join()", join2: "t2.join()"
};

/* Las dos versiones, con el comentario tal como esta en el codigo de clase. */
var VERSIONES = {
  a: {
    nombre: "start-start-join-join",
    comentario: "# Sirve: los dos hilos corren a la vez",
    orden: ["start1", "start2", "join1", "join2"]
  },
  b: {
    nombre: "start-join-start-join",
    comentario: "# No sirve: el segundo hilo arranca cuando el primero ya termino",
    orden: ["start1", "join1", "start2", "join2"]
  }
};

var DURACIONES = [
  { clave: "3-2", h1: 3, h2: 2 },
  { clave: "2-2", h1: 2, h2: 2 },
  { clave: "1-4", h1: 1, h2: 4 }
];
var DEFECTO = "3-2";

var COLOR_HILO = { "1": "var(--azul)", "2": "var(--ambar)" };
var COLOR_ESPERA = "var(--gris)";
var CLASE_OP = { start1: "bloque-1", join1: "bloque-1", start2: "bloque-2", join2: "bloque-2" };

/* La tabla de instantes de la clase, con hilo 1 de 3 s e hilo 2 de 2 s. */
var TRAZA = [
  { instante: "t0", a: "arrancan hilo 1 e hilo 2", b: "arranca hilo 1" },
  { instante: "t1", a: "los dos avanzan", b: "hilo 1 avanza, hilo 2 no existe" },
  { instante: "t2", a: "termina hilo 2", b: "termina hilo 1, arranca hilo 2" },
  { instante: "t3", a: "termina hilo 1", b: "hilo 2 avanza solo" },
  { instante: "t4", a: "—", b: "termina hilo 2" }
];

function duracionesDe(clave) {
  var d = DURACIONES.filter(function (x) { return x.clave === clave; })[0] || DURACIONES[0];
  return { h1: d.h1, h2: d.h2 };
}

function duracionDe(n, duraciones) {
  return String(n) === "1" ? duraciones.h1 : duraciones.h2;
}

/* Recorre la lista de operaciones y devuelve los tramos de cada hilo, los
   tramos en que el principal quedo bloqueado y el instante en que queda.   */
function simular(orden, duraciones) {
  var reloj = 0, hilos = {}, bloques = [], espera = [];
  orden.forEach(function (op) {
    var n = op.slice(-1);
    if (op.indexOf("start") === 0) {
      var b = { hilo: Number(n), inicio: reloj, fin: reloj + duracionDe(n, duraciones) };
      hilos[n] = b;
      bloques.push(b);
      return;
    }
    var h = hilos[n];
    if (!h) { return; }              // un join sin start no tiene a quien esperar
    if (h.fin > reloj) {
      espera.push({ hilo: Number(n), inicio: reloj, fin: h.fin });
      reloj = h.fin;
    }
  });
  return { bloques: bloques, total: reloj, esperaPrincipal: espera };
}

/* Como esta todo tras las primeras k operaciones de una version. */
function estadoTras(version, duraciones, k) {
  return simular(VERSIONES[version].orden.slice(0, k), duraciones);
}

function total(version, duraciones) {
  return simular(VERSIONES[version].orden, duraciones).total;
}

/* Lo que se gana poniendo los dos join al final con estas duraciones. */
function ahorro(duraciones) {
  return total("b", duraciones) - total("a", duraciones);
}

/* Una sola escala para las dos versiones, para que se vea cual acaba antes. */
function escala(duraciones) {
  return Math.max(total("a", duraciones), total("b", duraciones),
                  duraciones.h1, duraciones.h2) || 1;
}

/* Las lineas de codigo de una version; op marca la operacion de cada linea. */
function lineas(version) {
  var v = VERSIONES[version];
  var salida = [{ txt: v.comentario, op: null }];
  v.orden.forEach(function (op) { salida.push({ txt: ETIQUETA[op], op: op }); });
  salida.push({ txt: "total = r1 + r2", op: null });
  return salida;
}

/* Tres filas: hilo 1, hilo 2 y el principal, con sus tramos de espera. */
function filasGantt(version, duraciones, k) {
  var num = Motor.num;
  var e = estadoTras(version, duraciones, k);
  var filas = ["1", "2"].map(function (n) {
    var b = e.bloques.filter(function (x) { return String(x.hilo) === n; })[0];
    return {
      rotulo: "hilo " + n,
      valor: b ? num(b.fin, 1) + " s" : "—",
      bloques: b ? [{
        inicio: b.inicio, fin: b.fin, color: COLOR_HILO[n], texto: "hilo " + n,
        titulo: "hilo " + n + ": corre de " + num(b.inicio, 1) + " a " + num(b.fin, 1) + " s"
      }] : []
    };
  });
  filas.push({
    rotulo: "principal",
    valor: num(e.total, 1) + " s",
    bloques: e.esperaPrincipal.map(function (t) {
      return {
        inicio: t.inicio, fin: t.fin, color: COLOR_ESPERA, texto: "espera",
        titulo: "el principal espera al hilo " + t.hilo + ", de " +
          num(t.inicio, 1) + " a " + num(t.fin, 1) + " s"
      };
    })
  });
  return filas;
}

/* Que hizo la operacion i (desde 0) y como movio el reloj del principal. */
function describirPaso(version, duraciones, i) {
  var num = Motor.num;
  var op = VERSIONES[version].orden[i];
  var n = op.slice(-1);
  var antes = estadoTras(version, duraciones, i);
  var despues = estadoTras(version, duraciones, i + 1);
  if (op.indexOf("start") === 0) {
    return ETIQUETA[op] + ": el hilo " + n + " arranca en " + num(antes.total, 1) +
      " s y va a terminar en " + num(antes.total + duracionDe(n, duraciones), 1) +
      " s. El principal no espera aquí: pasa a la línea siguiente en el mismo instante.";
  }
  if (despues.total > antes.total) {
    return ETIQUETA[op] + ": el principal se bloquea desde " + num(antes.total, 1) +
      " hasta " + num(despues.total, 1) + " s, que es cuando el hilo " + n + " termina.";
  }
  var b = despues.bloques.filter(function (x) { return String(x.hilo) === n; })[0];
  return ETIQUETA[op] + ": el hilo " + n + " ya había terminado en " + num(b.fin, 1) +
    " s, antes de que el principal llegara a esta línea. El join retorna de inmediato y " +
    "el reloj se queda en " + num(despues.total, 1) + " s.";
}

/* Cierre cuando ya pasaron las cuatro operaciones. */
function describirCierre(version, duraciones) {
  var num = Motor.num;
  var t = total(version, duraciones);
  if (version === "a") {
    return "Con los dos join al final el programa termina en " + num(t, 1) +
      " s: los dos hilos avanzaron a la vez y el principal esperó al más largo, " +
      "máx(" + num(duraciones.h1, 1) + ", " + num(duraciones.h2, 1) + ") = " + num(t, 1) + " s.";
  }
  return "Con el join del hilo 1 delante del start del hilo 2 el programa termina en " +
    num(t, 1) + " s: " + num(duraciones.h1, 1) + " + " + num(duraciones.h2, 1) +
    ". En ningún momento hubo dos hilos corriendo, así que los tiempos se suman y se " +
    "pierden " + num(ahorro(duraciones), 1) + " s frente a la otra versión.";
}

function explicarA(duraciones, bien, real, dicho) {
  var num = Motor.num;
  var lento = duraciones.h1 >= duraciones.h2 ? "1" : "2";
  var otro = lento === "1" ? "2" : "1";
  return (bien ? "Sí: " + num(real, 1) + " s." :
          "No: termina en " + num(real, 1) + " s, no en " + num(dicho, 1) + ".") +
    " Los dos start van seguidos, así que hilo 1 e hilo 2 arrancan en el instante 0 y " +
    "avanzan a la vez. El principal se bloquea en los join hasta el más largo de los dos, " +
    "máx(" + num(duraciones.h1, 1) + ", " + num(duraciones.h2, 1) + ") = " + num(real, 1) +
    " s; el hilo " + otro + " termina antes o a la par y su join ya no espera. Los tiempos " +
    "no se suman: manda el hilo " + lento + ".";
}

function explicarB(duraciones, bien, real, dicho) {
  var num = Motor.num;
  return (bien ? "Sí: " + num(real, 1) + " s." :
          "No: termina en " + num(real, 1) + " s, no en " + num(dicho, 1) + ".") +
    " El join del hilo 1 está delante del start del hilo 2, y el hilo 2 no existe hasta que " +
    "el principal sale de ese join: " + num(duraciones.h1, 1) + " + " + num(duraciones.h2, 1) +
    " = " + num(real, 1) + " s. Los dos hilos nunca coinciden, así que los tiempos se suman y " +
    "el programa corre igual que si no hubiera hilos.";
}

var RAZONES = {
  correcta: "Los cuatro start seguidos y los cuatro join juntos, justo antes del resumen. " +
    "Los cuatro archivos se escriben a la vez, el principal se bloquea una sola vez y el total " +
    "es el del hilo más lento en lugar de la suma de los cuatro.",
  pegados: "Cada join pegado a su start deja el programa en serie: el segundo hilo no arranca " +
    "hasta que el primero terminó, y el total es la suma de los cuatro tiempos. Es " +
    "start-join-start-join estirado a cuatro hilos.",
  lento: "join espera a un hilo, no a todos. Uniendo solo al que se cree más lento, los otros " +
    "tres pueden seguir escribiendo cuando el resumen ya salió, y el resumen cuenta archivos a " +
    "medias. Además, cuál es el más lento cambia con los datos de cada corrida.",
  ninguno: "Sin ningún join el principal imprime el resumen sin haber esperado a nadie: los " +
    "cuatro hilos siguen escribiendo mientras el resumen ya está en pantalla. Y si los hilos " +
    "se crearon con daemon=True, el intérprete los corta al terminar el script y los archivos " +
    "quedan a medio escribir."
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    ETIQUETA: ETIQUETA, VERSIONES: VERSIONES, DURACIONES: DURACIONES, DEFECTO: DEFECTO,
    TRAZA: TRAZA, RAZONES: RAZONES, CLASE_OP: CLASE_OP,
    duracionesDe: duracionesDe, duracionDe: duracionDe, simular: simular,
    estadoTras: estadoTras, total: total, ahorro: ahorro, escala: escala, lineas: lineas,
    filasGantt: filasGantt, describirPaso: describirPaso, describirCierre: describirCierre,
    explicarA: explicarA, explicarB: explicarB
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;
  var version = "a";
  var claveDur = DEFECTO;
  var k = 0;                        // operaciones recorridas
  var hechas = { a: false, b: false };   // versiones ya recorridas hasta el final

  function dur() { return duracionesDe(claveDur); }

  function pintarPresets() {
    document.querySelectorAll("[data-dur]").forEach(function (b) {
      b.classList.toggle("activo", b.dataset.dur === claveDur);
    });
    document.querySelectorAll("[data-version]").forEach(function (b) {
      b.classList.toggle("activo", b.dataset.version === version);
    });
  }

  function pintarDuraciones() {
    var d = dur();
    Motor.pintarChips("chips-duraciones", [
      { texto: "hilo 1 tarda", valor: num(d.h1, 1) + " s" },
      { texto: "hilo 2 tarda", valor: num(d.h2, 1) + " s" }
    ]);
  }

  function pintarCodigo() {
    var opActual = k > 0 ? VERSIONES[version].orden[k - 1] : null;
    document.getElementById("codigo-version").innerHTML = lineas(version).map(function (l, i) {
      var clase = "linea" + (l.op ? " " + CLASE_OP[l.op] : "") +
        (l.op && l.op === opActual ? " actual" : "");
      return "<div class=\"" + clase + "\"><span class=\"num\">" + (i + 1) +
        "</span><span class=\"txt\">" + l.txt + "</span></div>";
    }).join("");
  }

  function pintarPaso() {
    var d = dur();
    var completa = k >= 4;
    pintarCodigo();
    Motor.pintarGantt("panel-gantt", filasGantt(version, d, k), escala(d));
    document.getElementById("progreso").textContent = k === 0
      ? "Versión " + VERSIONES[version].nombre + ": cuatro operaciones por recorrer."
      : "Operación " + k + " de 4 · versión " + VERSIONES[version].nombre +
        (completa ? " · terminó" : "");
    document.getElementById("btn-siguiente").disabled = completa;

    var texto = k > 0 ? describirPaso(version, d, k - 1) : "";
    if (completa) { texto += " " + describirCierre(version, d); }
    document.getElementById("paso-texto").textContent = texto;

    var chips = [{ texto: "reloj del principal", valor: num(estadoTras(version, d, k).total, 1) + " s" }];
    if (completa) {
      chips.push({ texto: "total de esta versión", valor: num(total(version, d), 1) + " s" });
      chips.push({
        texto: version === "a" ? "ahorra" : "pierde",
        valor: num(ahorro(d), 1) + " s", cuenta: true
      });
    }
    Motor.pintarChips("chips-gantt", chips);
  }

  function celda(txt, visible) {
    if (!visible) { return "<td class=\"pend\">?</td>"; }
    if (txt === "—") { return "<td class=\"pend\">—</td>"; }
    return "<td style=\"text-align:left\">" + txt + "</td>";
  }

  function pintarTraza() {
    document.getElementById("cuerpo-traza").innerHTML = TRAZA.map(function (f) {
      return "<tr><td>" + f.instante + "</td>" + celda(f.a, hechas.a) + celda(f.b, hechas.b) + "</tr>";
    }).join("");
    document.getElementById("aviso-traza").textContent = (hechas.a && hechas.b)
      ? "Las dos columnas salieron del paso a paso."
      : "Recorra hasta el final cada versión en la carta anterior y la columna correspondiente se llena.";
  }

  function pintar() {
    pintarPresets();
    pintarDuraciones();
    pintarPaso();
    pintarTraza();
  }

  document.querySelectorAll("[data-dur]").forEach(function (b) {
    b.addEventListener("click", function () {
      claveDur = b.dataset.dur;
      k = 0;
      hechas = { a: false, b: false };
      document.getElementById("veredicto-a").className = "veredicto";
      document.getElementById("veredicto-b").className = "veredicto";
      pintar();
    });
  });
  document.querySelectorAll("[data-version]").forEach(function (b) {
    b.addEventListener("click", function () {
      version = b.dataset.version;
      k = 0;
      pintarPresets();
      pintarPaso();
    });
  });
  document.getElementById("btn-siguiente").addEventListener("click", function () {
    k = Math.min(k + 1, 4);
    if (k === 4) { hechas[version] = true; }
    pintarPaso();
    pintarTraza();
  });
  document.getElementById("btn-todo").addEventListener("click", function () {
    k = 4;
    hechas[version] = true;
    pintarPaso();
    pintarTraza();
  });
  document.getElementById("btn-reiniciar").addEventListener("click", function () {
    k = 0;
    pintarPaso();
  });

  Motor.conectarPrediccion(
    { entrada: "prediccion-a", boton: "btn-comprobar-a", veredicto: "veredicto-a" },
    function () { return total("a", dur()); },
    function (bien, real, dicho) { return explicarA(dur(), bien, real, dicho); });
  Motor.conectarPrediccion(
    { entrada: "prediccion-b", boton: "btn-comprobar-b", veredicto: "veredicto-b" },
    function () { return total("b", dur()); },
    function (bien, real, dicho) { return explicarB(dur(), bien, real, dicho); });
  Motor.conectarOpciones("opciones-join", "veredicto-join", RAZONES);

  pintar();
})();

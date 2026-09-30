if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Balanceo de carga como en balanceo.cpp: 64 tareas, 4 hilos, y la tarea i
   cuesta proporcional a i*i. Tres repartos: bloques contiguos, por turnos
   (i % 4) y por demanda con un contador fetch_add.                        */

var TAREAS = 64;
var HILOS = 4;
var COLORES = ["var(--azul)", "var(--ambar)", "var(--verde)", "var(--rojo)"];

/* Tiempos medidos en el deck, en ms. */
var MEDIDO = { contiguo: 824, demanda: 379 };

function costo(i) { return i * i; }

function costosBase() {
  var c = [];
  for (var i = 0; i < TAREAS; i++) { c.push(costo(i)); }
  return c;
}

/* Permutacion fija de los costos con un LCG de semilla 7, para que los
   costos dejen de crecer con el indice.                                   */
function costosErraticos() {
  var c = costosBase();
  var s = 7;
  for (var i = c.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) % 2147483648;
    var j = s % (i + 1);
    var t = c[i]; c[i] = c[j]; c[j] = t;
  }
  return c;
}

function total(costos) {
  return costos.reduce(function (a, b) { return a + b; }, 0);
}

/* Devuelve { porHilo, fin, tareasPorHilo, unidadesPorHilo, orden }.
   orden es la lista de asignaciones en el orden temporal en que ocurren.  */
function repartir(modo, costos) {
  costos = costos || costosBase();
  var T = costos.length;
  var porHilo = [], libre = [], h, i;
  for (h = 0; h < HILOS; h++) { porHilo.push([]); libre.push(0); }
  var orden = [];

  function asignar(i, h) {
    var b = { i: i, hilo: h, inicio: libre[h], fin: libre[h] + costos[i] };
    porHilo[h].push(b);
    libre[h] = b.fin;
    orden.push(b);
  }

  if (modo === "contiguo") {
    var porHiloN = T / HILOS;
    for (h = 0; h < HILOS; h++) {
      for (i = h * porHiloN; i < (h + 1) * porHiloN; i++) { asignar(i, h); }
    }
  } else if (modo === "turnos") {
    for (i = 0; i < T; i++) { asignar(i, i % HILOS); }
  } else {
    // demanda: cada hilo toma la siguiente tarea al quedar libre; en
    // empate de tiempo gana el hilo de indice menor (los cuatro arrancan en 0).
    for (i = 0; i < T; i++) {
      var quien = 0;
      for (h = 1; h < HILOS; h++) { if (libre[h] < libre[quien]) { quien = h; } }
      asignar(i, quien);
    }
  }

  // en el orden temporal: por instante de inicio y, en empate, por hilo
  orden.sort(function (a, b) { return a.inicio - b.inicio || a.hilo - b.hilo; });
  var fin = Math.max.apply(null, libre);
  return {
    porHilo: porHilo,
    fin: fin,
    tareasPorHilo: porHilo.map(function (l) { return l.length; }),
    unidadesPorHilo: libre.slice(),
    espera: libre.reduce(function (s, x) { return s + (fin - x); }, 0),
    orden: orden
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    TAREAS: TAREAS, HILOS: HILOS, MEDIDO: MEDIDO, costo: costo,
    costosBase: costosBase, costosErraticos: costosErraticos, total: total,
    repartir: repartir
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;
  var modo = "contiguo";
  var erratico = false;
  var k = 0;              // cuantas asignaciones se han mostrado
  var comparada = false;  // la tabla de la carta 4 se destapa al comprobar B
  var NOMBRE = { contiguo: "bloques contiguos", turnos: "por turnos", demanda: "por demanda" };

  function costos() { return erratico ? costosErraticos() : costosBase(); }
  function escala() { return repartir("contiguo", costos()).fin; }

  function pintarTareas() {
    var c = costos();
    var mayor = Math.max.apply(null, c);
    var html = "<div style=\"display:flex;align-items:flex-end;gap:2px;height:90px\">";
    c.forEach(function (x, i) {
      html += "<span title=\"tarea " + i + ": " + num(x) + "\" style=\"flex:1;" +
        "height:" + Math.max(2, x / mayor * 88) + "px;background:" +
        (erratico ? "var(--gris)" : COLORES[Math.floor(i / (TAREAS / HILOS))]) +
        ";border-radius:2px 2px 0 0\"></span>";
    });
    html += "</div><div class=\"progreso\">tarea 0 … tarea 63; la altura es el costo" +
      (erratico ? ", barajado" : ", i²") + "</div>";
    document.getElementById("panel-tareas").innerHTML = html;
    Motor.pintarChips("chips-tareas", [
      { texto: "trabajo total", valor: num(total(c)) + " unidades" },
      { texto: "ideal por hilo", valor: num(total(c) / HILOS) },
      { texto: "la más cara", valor: num(mayor), cuenta: true }
    ]);
  }

  function pintarGantt() {
    var r = repartir(modo, costos());
    var vistas = r.orden.slice(0, k);
    var filas = [];
    for (var h = 0; h < HILOS; h++) {
      var bloques = vistas.filter(function (b) { return b.hilo === h; }).map(function (b) {
        return { inicio: b.inicio, fin: b.fin, color: COLORES[h],
                 texto: (b.fin - b.inicio) / escala() > 0.03 ? String(b.i) : "",
                 titulo: "tarea " + b.i + ": " + num(b.fin - b.inicio) };
      });
      var finHilo = bloques.length ? bloques[bloques.length - 1].fin : 0;
      filas.push({ rotulo: "hilo " + h, bloques: bloques, valor: num(finHilo) });
    }
    Motor.pintarGantt("panel-gantt", filas, escala());

    var hechas = k >= r.orden.length;
    document.getElementById("progreso").textContent = k === 0
      ? "Reparto " + NOMBRE[modo] + ": " + r.orden.length + " tareas por asignar."
      : "Asignadas " + k + " de " + r.orden.length + " · reparto " + NOMBRE[modo] +
        (hechas ? " · termina en " + num(r.fin) + " unidades" : "");
    document.getElementById("btn-siguiente").disabled = hechas;

    var ultima = k > 0 ? r.orden[k - 1] : null;
    document.getElementById("paso-texto").textContent = !ultima ? "" :
      "La tarea " + ultima.i + " (" + num(ultima.fin - ultima.inicio) + " unidades) " +
      (modo === "contiguo" ? "va al hilo " + ultima.hilo + " porque está en su bloque."
       : modo === "turnos" ? "va al hilo " + ultima.i % HILOS + " porque " + ultima.i +
         " % 4 = " + (ultima.i % HILOS) + "."
       : "la toma el hilo " + ultima.hilo + " porque fue el primero en desocuparse, " +
         "en el instante " + num(ultima.inicio) + ".");

    // las cuentas del reparto aparecen cuando ya se asignaron las 64 tareas
    Motor.pintarChips("chips-gantt", !hechas ? [] : [
      { texto: "termina en", valor: num(r.fin), cuenta: true },
      { texto: "ideal", valor: num(total(costos()) / HILOS) },
      { texto: "tareas por hilo", valor: r.tareasPorHilo.join(" / ") },
      { texto: "unidades por hilo", valor: r.unidadesPorHilo.map(function (u) { return num(u); }).join(" / ") },
      { texto: "espera acumulada", valor: num(r.espera) }
    ]);
  }

  function pintarComparacion() {
    document.getElementById("tabla-comparacion").hidden = !comparada;
    if (!comparada) { return; }
    var c = costos();
    var filas = ["contiguo", "turnos", "demanda"].map(function (m) {
      var r = repartir(m, c);
      return "<tr" + (m === modo ? " style=\"background:var(--resalte)\"" : "") +
        "><td>" + NOMBRE[m] + "</td><td>" + num(r.fin) + "</td><td>" +
        num(r.fin / (total(c) / HILOS), 2) + "</td><td>" + r.tareasPorHilo.join(" / ") +
        "</td></tr>";
    }).join("");
    document.getElementById("cuerpo-comparacion").innerHTML = filas;
  }

  function pintar() {
    document.getElementById("ver-modo").textContent = NOMBRE[modo];
    pintarTareas();
    pintarGantt();
    pintarComparacion();
  }

  function explicarA(bien, real, dicho) {
    var c = costosBase();
    var r = repartir("contiguo", c);
    var peor = r.unidadesPorHilo.indexOf(r.fin);
    var texto = "El hilo " + peor + " recibe las tareas 48 a 63, las dieciséis más " +
      "caras: " + num(r.unidadesPorHilo[peor]) + " de " + num(total(c)) + " unidades, el " +
      real + " %. Los otros tres suman entre los tres " +
      num(total(c) - r.unidadesPorHilo[peor]) + ".";
    return (bien ? "Sí, el " + real + " %. " : "Es el " + real + " %, no el " + num(dicho) + " %. ") + texto;
  }

  function explicarB(bien, real, dicho) {
    comparada = true;
    pintarComparacion();
    var c = costosBase();
    var a = repartir("contiguo", c).fin, b = repartir("demanda", c).fin;
    var texto = "En unidades, " + num(a) + " contra " + num(b) + ": " + num(real, 2) +
      " veces. Medido en la máquina de la clase, " + num(MEDIDO.contiguo) + " contra " +
      num(MEDIDO.demanda) + " ms, " + num(MEDIDO.contiguo / MEDIDO.demanda, 2) +
      " veces. El trabajo es el mismo; lo que cambia es quién hace cada tarea y cuándo.";
    return (bien ? "Sí: " : "Son " + num(real, 2) + " veces, no " + num(dicho, 2) + ". ") + texto;
  }

  var RAZONES = {
    correcta: "Cuando el costo de las tareas es parejo. Ahí el reparto fijo es más " +
      "barato: no hay contador que coordinar y ningún hilo termina mucho antes " +
      "que otro.",
    turnos: "Por turnos solo atenúa cuando el costo crece de forma suave, como i². " +
      "Con la casilla de costos erráticos los turnos vuelven a desbalancear y el " +
      "reparto por demanda sigue parejo.",
    demanda: "Por demanda paga un fetch_add por tarea. Con tareas parejas y baratas " +
      "ese costo se nota y no compra nada, porque el reparto fijo ya estaba " +
      "balanceado.",
    muchas: "El número de tareas no dice nada del desbalance: 64 tareas de costo " +
      "i² en bloques contiguos dejan tres hilos esperando. Lo que importa es si " +
      "cuestan lo mismo."
  };

  document.querySelectorAll("[data-modo]").forEach(function (b) {
    b.addEventListener("click", function () { modo = b.dataset.modo; k = 0; pintar(); });
  });
  document.getElementById("erratico").addEventListener("change", function (e) {
    erratico = e.target.checked; k = 0; pintar();
  });
  document.getElementById("btn-siguiente").addEventListener("click", function () {
    k = Math.min(k + 1, TAREAS); pintarGantt();
  });
  document.getElementById("btn-todo").addEventListener("click", function () {
    k = TAREAS; pintarGantt();
  });
  document.getElementById("btn-reiniciar").addEventListener("click", function () {
    k = 0; pintarGantt();
  });
  Motor.conectarPrediccion(
    { entrada: "prediccion-a", boton: "btn-comprobar-a", veredicto: "veredicto-a" },
    function () {
      var c = costosBase(); var r = repartir("contiguo", c);
      return Math.round(r.fin / total(c) * 100);
    },
    explicarA);
  Motor.conectarPrediccion(
    { entrada: "prediccion-b", boton: "btn-comprobar-b", veredicto: "veredicto-b" },
    function () {
      var c = costosBase();
      return repartir("contiguo", c).fin / repartir("demanda", c).fin;
    },
    explicarB);
  Motor.conectarOpciones("opciones-fijo", "veredicto-fijo", RAZONES);

  pintar();
})();

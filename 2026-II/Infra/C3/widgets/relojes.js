if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Reloj de pared contra tiempo de CPU, como en la medicion del deck con
   perf_counter y process_time. Un programa es una lista de tramos: una
   espera suma reloj y nada de CPU; un calculo con h hilos suma h veces su
   duracion a la CPU. sleeper() midio 1,75 s reales y 0,00 de CPU;
   spinlock(), 2,50 y 2,50.                                                 */

var PROGRAMAS = {
  clase: {
    nombre: "el de la clase",
    tramos: [
      { nombre: "sleeper()", corto: "sleeper()", tipo: "espera", duracion: 1.75, hilos: 1,
        detalle: "que termine time.sleep(1.75)", medido: { real: 1.75, cpu: 0 } },
      { nombre: "spinlock()", corto: "spinlock()", tipo: "calculo", duracion: 2.5, hilos: 1,
        detalle: "un bucle de cien millones de pasos", medido: { real: 2.5, cpu: 2.5 } }
    ]
  },
  servidor: {
    nombre: "servidor",
    tramos: [
      { nombre: "leer el archivo", corto: "leer", tipo: "espera", duracion: 0.8, hilos: 1,
        detalle: "el disco" },
      { nombre: "calcular estadísticas", corto: "calcular", tipo: "calculo", duracion: 1.2, hilos: 1 },
      { nombre: "consultar el servicio", corto: "consultar", tipo: "espera", duracion: 1.0, hilos: 1,
        detalle: "la respuesta por red" },
      { nombre: "procesar en paralelo", corto: "procesar", tipo: "calculo", duracion: 0.5, hilos: 4 }
    ]
  },
  cuatro: {
    nombre: "cuatro hilos un segundo",
    tramos: [
      { nombre: "calcular con cuatro hilos", corto: "calcular", tipo: "calculo", duracion: 1.0, hilos: 4 }
    ]
  }
};
var DEFECTO = "servidor";
var COLOR = { espera: "var(--gris)", calculo: "var(--azul)" };

function esCalculo(t) { return t.tipo === "calculo"; }

/* CPU que aporta un tramo: la espera no ocupa ningun nucleo. */
function cpuTramo(t) { return esCalculo(t) ? t.duracion * t.hilos : 0; }

/* perf_counter: reloj de pared, la suma de todas las duraciones. */
function reloj(tramos) {
  return tramos.reduce(function (s, t) { return s + t.duracion; }, 0);
}

/* process_time: suma de duracion x hilos de los tramos de calculo. */
function cpu(tramos) {
  return tramos.reduce(function (s, t) { return s + cpuTramo(t); }, 0);
}

/* Lo que marca cada reloj al terminar cada tramo. */
function acumulados(tramos) {
  var r = 0, c = 0;
  return tramos.map(function (t) {
    r += t.duracion;
    c += cpuTramo(t);
    return { fin_reloj: r, fin_cpu: c };
  });
}

function cociente(tramos) {
  var r = reloj(tramos);
  return r > 0 ? cpu(tramos) / r : 0;
}

/* Lectura del cociente CPU/reloj, como en el deck: los dos relojes
   coinciden -> calcula; el reloj va muy por encima -> espera.            */
function clasificar(tramos) {
  var q = cociente(tramos);
  if (q > 0.8) { return "cpu"; }
  if (q < 0.5) { return "espera"; }
  return "mixto";
}

var LECTURA = {
  cpu: "ligado a CPU",
  espera: "ligado a espera",
  mixto: "mixto"
};

/* Las dos filas del Gantt con los primeros k tramos: la de reloj lleva un
   bloque por tramo; la de CPU, uno por tramo de calculo de ancho
   duracion x hilos, sin las esperas.                                       */
function filasGantt(tramos, k) {
  var num = Motor.num;
  var acc = acumulados(tramos);
  var bReloj = [], bCpu = [];
  var n = Math.min(k, tramos.length);
  for (var i = 0; i < n; i++) {
    var t = tramos[i];
    var r0 = i ? acc[i - 1].fin_reloj : 0;
    var c0 = i ? acc[i - 1].fin_cpu : 0;
    bReloj.push({
      inicio: r0, fin: acc[i].fin_reloj, color: COLOR[t.tipo], texto: t.corto,
      titulo: t.nombre + ": " + num(t.duracion, 2) + " s de " +
        (esCalculo(t) ? "cálculo" : "espera")
    });
    if (esCalculo(t)) {
      bCpu.push({
        inicio: c0, fin: acc[i].fin_cpu, color: COLOR.calculo,
        texto: t.corto + (t.hilos > 1 ? " ×" + t.hilos : ""),
        titulo: t.nombre + ": " + num(t.duracion, 2) + " s × " + t.hilos +
          (t.hilos > 1 ? " hilos = " : " hilo = ") + num(cpuTramo(t), 2) + " s de CPU"
      });
    }
  }
  var finR = n ? acc[n - 1].fin_reloj : 0;
  var finC = n ? acc[n - 1].fin_cpu : 0;
  return [
    { rotulo: "reloj de pared", bloques: bReloj, valor: num(finR, 2) + " s" },
    { rotulo: "CPU", bloques: bCpu, valor: num(finC, 2) + " s" }
  ];
}

/* Texto del paso i (desde 0): que hizo el tramo y cuanto movio cada reloj. */
function describirPaso(tramos, i) {
  var num = Motor.num;
  var t = tramos[i];
  var acc = acumulados(tramos);
  var r0 = i ? acc[i - 1].fin_reloj : 0;
  var c0 = i ? acc[i - 1].fin_cpu : 0;
  var s = "Tramo " + (i + 1) + ", " + t.nombre + ": ";
  if (esCalculo(t)) {
    s += num(t.duracion, 2) + " s de cálculo con " + t.hilos +
      (t.hilos > 1 ? " hilos, " + t.hilos + " núcleos ocupados a la vez. " : " hilo. ") +
      "El reloj de pared pasa de " + num(r0, 2) + " a " + num(acc[i].fin_reloj, 2) +
      " y la CPU de " + num(c0, 2) + " a " + num(acc[i].fin_cpu, 2);
    s += t.hilos > 1
      ? ": suma " + t.hilos + " × " + num(t.duracion, 2) + " = " + num(cpuTramo(t), 2) + " s."
      : ", lo mismo que el reloj.";
  } else {
    s += num(t.duracion, 2) + " s de espera" + (t.detalle ? ", aguardando " + t.detalle : "") +
      ". El reloj de pared pasa de " + num(r0, 2) + " a " + num(acc[i].fin_reloj, 2) +
      "; la CPU se queda en " + num(c0, 2) + " porque ningún núcleo trabaja para el proceso.";
  }
  if (t.medido) {
    s += " En la clase midió " + num(t.medido.real, 2) + " s reales y " +
      num(t.medido.cpu, 2) + " de CPU.";
  }
  return s;
}

/* Cierre cuando ya pasaron todos los tramos, segun la lectura del cociente. */
function describirCierre(tramos) {
  var num = Motor.num;
  var q = cociente(tramos);
  var lectura = clasificar(tramos);
  var s = "CPU/reloj = " + num(q, 2) + ". ";
  if (lectura === "cpu") {
    s += (q > 1 ? "La CPU supera al reloj" : "Los dos relojes casi coinciden") +
      ": leído por el cociente, el programa está calculando, y la salida es " +
      "paralelizar o cambiar de algoritmo.";
  } else if (lectura === "espera") {
    s += "El reloj de pared va muy por encima de la CPU: el programa está esperando, " +
      "y agregar núcleos no ayuda.";
  } else {
    s += "Ni lo uno ni lo otro: de " + num(reloj(tramos), 2) + " s de reloj, " +
      num(cpu(tramos), 2) + " son cálculo y el resto espera. Hay que mirar tramo por tramo.";
  }
  return s;
}

function listar(nombres) {
  if (nombres.length <= 1) { return nombres.join(""); }
  return nombres.slice(0, -1).join(", ") + " y " + nombres[nombres.length - 1];
}

/* Veredicto de la prediccion de perf_counter. */
function explicarReloj(tramos, bien, real, dicho) {
  var num = Motor.num;
  var terminos = tramos.map(function (t) { return t.corto + " " + num(t.duracion, 2); });
  var hayEsperas = tramos.some(function (t) { return !esCalculo(t); });
  var s = bien ? "Sí: " + num(real, 2) + " s." : "No: marca " + num(real, 2) + " s, no " + num(dicho, 2) + ".";
  s += " perf_counter es reloj de pared y suma todos los tramos" +
    (hayEsperas ? ", esperas incluidas: " : ": ") +
    terminos.join(" + ") + (terminos.length > 1 ? " = " + num(real, 2) : " s") + ".";
  var conHilos = tramos.filter(function (t) { return t.hilos > 1; });
  if (conHilos.length) {
    var t = conHilos[0];
    s += " Los hilos no lo cambian: " + t.nombre + " dura " + num(t.duracion, 2) +
      " s en el reloj con " + t.hilos + " hilos, igual que con uno.";
  }
  var medidos = tramos.filter(function (t) { return t.medido; });
  if (medidos.length) {
    s += " En la clase cada función se midió aparte: " + listar(medidos.map(function (t) {
      return t.nombre + " " + num(t.medido.real, 2) + " s";
    })) + ".";
  }
  return s;
}

/* Veredicto de la prediccion de process_time. */
function explicarCpu(tramos, bien, real, dicho) {
  var num = Motor.num;
  var calc = tramos.filter(esCalculo);
  var esperas = tramos.filter(function (t) { return !esCalculo(t); });
  var terminos = calc.map(function (t) { return t.corto + " " + num(t.duracion, 2) + " × " + t.hilos; });
  var s = bien ? "Sí: " + num(real, 2) + " s." : "No: marca " + num(real, 2) + " s, no " + num(dicho, 2) + ".";
  s += " process_time suma solo los tramos de cálculo, cada uno tantas veces como hilos " +
    "tenga: " + terminos.join(" + ") + " = " + num(real, 2) + ".";
  if (esperas.length) {
    s += (esperas.length > 1 ? " Las esperas no suman: " : " La espera no suma: ") +
      listar(esperas.map(function (t) { return t.nombre + " (" + num(t.duracion, 2) + " s)"; })) +
      (esperas.length > 1 ? " pasan" : " pasa") + " sin que ningún núcleo trabaje para el " +
      "proceso, que aguarda " + listar(esperas.map(function (t) { return t.detalle; })) +
      "; el reloj de pared corre solo.";
  }
  var conHilos = calc.filter(function (t) { return t.hilos > 1; });
  if (conHilos.length) {
    var t = conHilos[0];
    s += " El tramo " + t.nombre + " suma " + t.hilos + " veces su duración: " + t.hilos +
      " núcleos ocupados " + num(t.duracion, 2) + " s son " + num(cpuTramo(t), 2) +
      " s de CPU, más de lo que marca el reloj en ese tramo.";
  }
  var medidos = tramos.filter(function (t) { return t.medido; });
  if (medidos.length) {
    s += " En la clase, process_time marcó " + listar(medidos.map(function (t) {
      return num(t.medido.cpu, 2) + " s en " + t.nombre;
    })) + ".";
  }
  return s;
}

/* Carta 4, sobre el programa servidor: 3,2 s de CPU en 3,5 s de reloj. */
var RAZONES = {
  correcta: "En las dos esperas. Leer el archivo (0,8 s) y consultar el servicio (1,0 s) " +
    "son 1,8 s de reloj en los que el proceso no gasta procesador: de los 3,5 s, calculó en " +
    "1,7 y esperó en 1,8. Agregar núcleos no acorta una espera; la acorta pedir menos o " +
    "solaparla con otro trabajo.",
  paralelo: "El tramo paralelo va al revés: suma más CPU que reloj, 2,0 s contra 0,5. Ahí el " +
    "procesador está ocupado de sobra, en cuatro núcleos a la vez; no hay tiempo sin CPU.",
  estadisticas: "Calcular estadísticas dura 1,2 s en el reloj y 1,2 s de CPU: un hilo " +
    "ocupando un núcleo todo el tiempo. Entre los dos relojes no queda ningún hueco.",
  nohay: "El 0,91 sale porque el tramo de 4 hilos infla la CPU: 2,0 s de CPU en 0,5 s de " +
    "reloj tapan las esperas dentro del cociente. Los 1,8 s de espera siguen ahí: de 3,5 s de " +
    "reloj, el proceso calculó en 1,7."
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PROGRAMAS: PROGRAMAS, DEFECTO: DEFECTO, RAZONES: RAZONES, LECTURA: LECTURA,
    esCalculo: esCalculo, cpuTramo: cpuTramo, reloj: reloj, cpu: cpu,
    acumulados: acumulados, cociente: cociente, clasificar: clasificar,
    filasGantt: filasGantt, describirPaso: describirPaso, describirCierre: describirCierre,
    explicarReloj: explicarReloj, explicarCpu: explicarCpu
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;
  var actual = DEFECTO;
  var k = 0;   // cuantos tramos se han mostrado

  function tramos() { return PROGRAMAS[actual].tramos; }
  function escala() { var t = tramos(); return Math.max(reloj(t), cpu(t)) || 1; }

  /* El valor de un input number siempre trae punto decimal, y Motor.leerNumero
     lo quita como separador de miles; aqui se lee directo y el veredicto lo
     da Motor.veredictoNumerico.                                             */
  function leerSegundos(id) {
    var v = String(document.getElementById(id).value).trim().replace(",", ".");
    return v === "" ? NaN : parseFloat(v);
  }

  function conectarSegundos(ids, esperado, explicar) {
    var caja = document.getElementById(ids.veredicto);
    document.getElementById(ids.boton).addEventListener("click", function () {
      var dicho = leerSegundos(ids.entrada);
      var real = esperado();
      var v = Motor.veredictoNumerico(dicho, real);
      caja.className = "veredicto " + (v.bien ? "bien" : "mal");
      caja.textContent = isNaN(dicho) ? v.motivo : explicar(v.bien, real, dicho);
    });
  }

  function pintarPresets() {
    document.querySelectorAll("[data-preset]").forEach(function (b) {
      b.classList.toggle("activo", b.dataset.preset === actual);
    });
  }

  function pintarTabla() {
    document.getElementById("cuerpo-tramos").innerHTML = tramos().map(function (t) {
      return "<tr><td style=\"text-align:left\">" + t.nombre + "</td><td>" +
        "<span class=\"tipo\" style=\"background:" + COLOR[t.tipo] + "\"></span>" +
        (esCalculo(t) ? "cálculo" : "espera") + "</td><td>" + num(t.duracion, 2) +
        " s</td><td>" + t.hilos + "</td></tr>";
    }).join("");
  }

  function pintarGantt() {
    var t = tramos();
    var hechas = k >= t.length;
    Motor.pintarGantt("panel-gantt", filasGantt(t, k), escala());
    document.getElementById("progreso").textContent = k === 0
      ? "Programa " + PROGRAMAS[actual].nombre + ": " + t.length +
        (t.length === 1 ? " tramo por recorrer." : " tramos por recorrer.")
      : "Tramo " + k + " de " + t.length + " · programa " + PROGRAMAS[actual].nombre +
        (hechas ? " · terminó" : "");
    document.getElementById("btn-siguiente").disabled = hechas;

    var texto = k > 0 ? describirPaso(t, k - 1) : "";
    if (hechas) { texto += " " + describirCierre(t); }
    document.getElementById("paso-texto").textContent = texto;

    var vistos = t.slice(0, k);
    var r = reloj(vistos), c = cpu(vistos);
    var chips = [
      { texto: "reloj hasta ahora", valor: num(r, 2) + " s" },
      { texto: "CPU hasta ahora", valor: num(c, 2) + " s" },
      { texto: "CPU/reloj", valor: r > 0 ? num(c / r, 2) : "–" }
    ];
    if (hechas) { chips.push({ texto: "el programa", valor: LECTURA[clasificar(t)], cuenta: true }); }
    Motor.pintarChips("chips-gantt", chips);
  }

  function pintar() {
    pintarPresets();
    pintarTabla();
    pintarGantt();
    // las predicciones de la carta 2 valen para el programa que esta puesto
    document.getElementById("veredicto-reloj").className = "veredicto";
    document.getElementById("veredicto-cpu").className = "veredicto";
  }

  document.querySelectorAll("[data-preset]").forEach(function (b) {
    b.addEventListener("click", function () { actual = b.dataset.preset; k = 0; pintar(); });
  });
  document.getElementById("btn-siguiente").addEventListener("click", function () {
    k = Math.min(k + 1, tramos().length); pintarGantt();
  });
  document.getElementById("btn-todo").addEventListener("click", function () {
    k = tramos().length; pintarGantt();
  });
  document.getElementById("btn-reiniciar").addEventListener("click", function () {
    k = 0; pintarGantt();
  });
  conectarSegundos(
    { entrada: "prediccion-reloj", boton: "btn-comprobar-reloj", veredicto: "veredicto-reloj" },
    function () { return reloj(tramos()); },
    function (bien, real, dicho) { return explicarReloj(tramos(), bien, real, dicho); });
  conectarSegundos(
    { entrada: "prediccion-cpu", boton: "btn-comprobar-cpu", veredicto: "veredicto-cpu" },
    function () { return cpu(tramos()); },
    function (bien, real, dicho) { return explicarCpu(tramos(), bien, real, dicho); });
  Motor.conectarOpciones("opciones-cociente", "veredicto-cociente", RAZONES);

  pintar();
})();

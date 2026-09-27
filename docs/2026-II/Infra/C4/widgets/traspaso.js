if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Traspaso de datos entre procesos. Con los mismos datos, el Array en memoria
   compartida costo 0,10 s; el Pipe, 1,38 s; la Queue, 1,68 s. Los dos ultimos
   empaquetan cada dato con pickle y lo desempaquetan al otro lado, y por eso
   quedan entre 14 y 17 veces por encima. El Array no convierte nada, pero
   solo guarda tipos simples de C y no sincroniza por su cuenta.            */

var MECANISMOS = [
  {
    id: "array", nombre: "Array en memoria compartida", corto: "Array",
    s: 0.10, serializa: false, objetos: false, sincroniza: false,
    extremos: "todos los procesos que comparten el bloque"
  },
  {
    id: "pipe", nombre: "Pipe", corto: "Pipe",
    s: 1.38, serializa: true, objetos: true, sincroniza: true,
    extremos: "dos, uno en cada punta"
  },
  {
    id: "queue", nombre: "Queue", corto: "Queue",
    s: 1.68, serializa: true, objetos: true, sincroniza: true,
    extremos: "varios productores y varios consumidores"
  }
];

/* El tiempo del Array es la base contra la que se miden los otros dos. */
var BASE = 0.10;

/* El viaje de un dato por cada camino, etapa por etapa. */
var ETAPAS = {
  queue: [
    { corto: "pickle", color: "var(--ambar)",
      titulo: "el productor empaqueta el objeto en bytes",
      texto: "el productor entrega el objeto y pickle lo convierte en una cadena de bytes" },
    { corto: "tubería", color: "var(--gris)",
      titulo: "los bytes viajan por una tubería del sistema",
      texto: "los bytes viajan por una tubería del sistema operativo hasta el otro proceso" },
    { corto: "unpickle", color: "var(--ambar)",
      titulo: "el consumidor reconstruye el objeto",
      texto: "el consumidor saca los bytes y pickle reconstruye el objeto" }
  ],
  array: [
    { corto: "escribir", color: "var(--azul)",
      titulo: "el productor escribe en el bloque compartido",
      texto: "el productor escribe el número en su posición del bloque compartido, sin convertir nada" },
    { corto: "leer", color: "var(--azul)",
      titulo: "el consumidor lee la misma posición",
      texto: "el consumidor lee esa posición y ya tiene el dato" }
  ]
};

/* Las lineas del ejemplo que trabaja cada etapa, con el bloque de color que
   les toca en el .html.                                                    */
var LINEAS = {
  "ln-put": "bloque-2", "ln-get": "bloque-2",
  "ln-esc": "bloque-1", "ln-lee": "bloque-1"
};

var SITUACIONES = [
  {
    n: 1,
    texto: "Dos procesos y un flujo de mensajes entre ellos, uno en cada extremo.",
    correcta: "pipe",
    razones: {
      pipe: "Sí. Pipe da exactamente dos extremos, uno para cada proceso, y entre los dos " +
        "mecanismos que serializan es el más rápido: 1,38 s contra 1,68 s de la Queue con los " +
        "mismos datos. La Queue mantiene una fila con candados para varios productores y " +
        "consumidores, y aquí hay uno de cada lado.",
      queue: "Funciona, y es lo que se usa en cuanto hay más de dos procesos, pero con dos paga " +
        "de más: 1,68 s contra 1,38 s del Pipe para los mismos datos. Lo que se está pagando es " +
        "la fila que reparte entre varios, y no hay varios.",
      array: "El Array no lleva mensajes: guarda números en posiciones fijas, y quien lee no " +
        "sabe si el valor que ve acabó de llegar o llevaba ahí un rato. Un flujo de mensajes " +
        "necesita que el otro lado se entere, y eso el Array no lo hace: habría que agregar un " +
        "Lock y un índice a mano."
    }
  },
  {
    n: 2,
    texto: "Un productor y cuatro consumidores que toman trabajos de la misma fila.",
    correcta: "queue",
    razones: {
      queue: "Sí. La Queue admite varios productores y varios consumidores sobre la misma fila y " +
        "entrega cada trabajo a uno solo. El get bloquea al consumidor que llega con la fila " +
        "vacía y la sincronización viene puesta; se paga con el empaquetado de pickle, entre 14 " +
        "y 17 veces el costo de la memoria compartida.",
      pipe: "Pipe tiene dos extremos y nada más. Con cuatro consumidores habría que abrir cuatro " +
        "pipes y decidir a mano a cuál mandar cada trabajo, y dos procesos leyendo el mismo " +
        "extremo se pueden partir un mensaje.",
      array: "Un Array de posiciones no dice cuál trabajo está libre ni cuál ya tomó alguien: eso " +
        "se lleva con un índice compartido y un Lock escritos a mano, porque el Array no " +
        "sincroniza. Y solo guarda tipos simples de C, mientras un trabajo suele ser algo más " +
        "que un número."
    }
  },
  {
    n: 3,
    texto: "Cuatro procesos que llenan cada uno su parte de un arreglo de diez millones de flotantes.",
    correcta: "array",
    razones: {
      array: "Sí. Cada proceso escribe en su tramo del mismo bloque y nadie copia nada: es el " +
        "camino de 0,10 s. Los flotantes son tipos simples de C, que es justo lo que el Array " +
        "guarda, y como los tramos no se cruzan no hace falta un Lock.",
      queue: "Cada flotante entraría por pickle y saldría por pickle: es el camino de 1,68 s, " +
        "entre 14 y 17 veces el del Array con los mismos datos. Además el proceso que recibe " +
        "tendría que volver a armar el arreglo con lo que le llega.",
      pipe: "Pipe también empaqueta cada dato: 1,38 s contra los 0,10 s del Array. Y son dos " +
        "extremos, mientras aquí hay cuatro procesos escribiendo, así que habría que abrir " +
        "varios y juntar los pedazos al final."
    }
  },
  {
    n: 4,
    texto: "Hay que pasar un diccionario con listas adentro.",
    correcta: "queue",
    razones: {
      queue: "Sí. pickle convierte el diccionario completo, con las listas de adentro, y lo " +
        "reconstruye al otro lado. Se paga el empaquetado, entre 14 y 17 veces el costo de la " +
        "memoria compartida, y a cambio el objeto pasa tal cual. Si son solo dos procesos, un " +
        "Pipe hace lo mismo más barato: 1,38 s contra 1,68 s.",
      pipe: "Pipe mueve el diccionario igual de bien, y con dos procesos sale mejor: 1,38 s " +
        "contra 1,68 s. Se queda corto en cuanto hay más de dos, porque solo tiene dos extremos; " +
        "con varios consumidores la que reparte es la Queue.",
      array: "El Array guarda tipos simples de C: enteros, flotantes, caracteres. Un diccionario " +
        "con listas adentro no cabe ahí, y aplanarlo a mano es escribir el empaquetado que " +
        "pickle ya hace."
    }
  },
  {
    n: 5,
    texto: "El productor corre mucho más rápido que el consumidor y la memoria se está llenando.",
    correcta: "queue",
    razones: {
      queue: "Sí. Una Queue creada con maxsize deja de aceptar cuando la fila se llena: el put " +
        "bloquea y el productor se frena hasta que el consumidor saque algo. La memoria en vuelo " +
        "queda acotada por el número que se puso en maxsize.",
      pipe: "El extremo de escritura también bloquea, pero cuando se llena el buffer del " +
        "sistema, y ese tamaño no lo fija el programa: no hay un número que decir para acotar " +
        "cuántos mensajes quedan en vuelo. Eso es lo que hace maxsize en la Queue.",
      array: "El Array tiene tamaño fijo desde que se crea, así que la memoria no crece; el " +
        "problema pasa a ser otro. El productor rápido sobrescribe posiciones que el consumidor " +
        "todavía no leyó y esos datos se pierden, porque el Array no sincroniza ni avisa."
    }
  },
  {
    n: 6,
    texto: "Dos procesos que se pasan cien millones de números y el tiempo importa.",
    correcta: "array",
    razones: {
      array: "Sí. Los números son tipos simples de C y ahí no hay nada que convertir: se " +
        "escriben y se leen en el mismo bloque. Con los mismos datos, ese camino costó 0,10 s y " +
        "la Queue 1,68 s. La sincronización queda por cuenta del programa, con un Lock o con " +
        "tramos que no se cruzan.",
      queue: "Es el más lento de los tres, entre 14 y 17 veces el de la memoria compartida, " +
        "porque cada número pasa por pickle dos veces: al entrar y al salir. Con cien millones " +
        "de números, esa conversión es la que manda en el tiempo.",
      pipe: "Con dos procesos el Pipe es el más rápido entre los que serializan, 1,38 s, pero " +
        "sigue empaquetando cada número: 13,8 veces los 0,10 s del Array. Cuando lo que se pasa " +
        "son números y el tiempo importa, la conversión se evita."
    }
  }
];

function mecanismo(id) {
  for (var i = 0; i < MECANISMOS.length; i++) {
    if (MECANISMOS[i].id === id) { return MECANISMOS[i]; }
  }
  return null;
}

/* Cuantas veces el tiempo de la memoria compartida. */
function factor(id) {
  var m = mecanismo(id);
  return m === null ? NaN : m.s / BASE;
}

/* Segundos con dos decimales fijos, como se midieron: 0,10 y no 0,1. */
function seg(x) { return x.toFixed(2).replace(".", ",") + " s"; }

function etapas(id) { return ETAPAS[id] || []; }

function situacion(n) {
  for (var i = 0; i < SITUACIONES.length; i++) {
    if (SITUACIONES[i].n === n) { return SITUACIONES[i]; }
  }
  return null;
}

/* El mecanismo que le va a la situacion n. */
function elegir(n) {
  var s = situacion(n);
  return s === null ? null : s.correcta;
}

/* Las razones con la del mecanismo acertado renombrada a "correcta", que es
   lo que el motor espera para pintar en verde.                             */
function razonesPara(s) {
  var salida = {};
  MECANISMOS.forEach(function (m) {
    salida[m.id === s.correcta ? "correcta" : m.id] = s.razones[m.id];
  });
  return salida;
}

/* Las seis situaciones tienen que traer razon para los tres mecanismos. */
function validar() {
  for (var i = 0; i < SITUACIONES.length; i++) {
    var s = SITUACIONES[i];
    if (mecanismo(s.correcta) === null) { return false; }
    for (var j = 0; j < MECANISMOS.length; j++) {
      var r = s.razones[MECANISMOS[j].id];
      if (typeof r !== "string" || !r.trim()) { return false; }
    }
  }
  return true;
}

/* Filas de etapas de la Queue y del Array con las k primeras recorridas.
   Cada etapa ocupa un lugar: la escala es el numero de etapas, no segundos. */
function filasEtapas(k) {
  return ["queue", "array"].map(function (id) {
    var lista = etapas(id);
    var n = Math.min(Math.max(k, 0), lista.length);
    var bloques = [];
    for (var i = 0; i < n; i++) {
      bloques.push({
        inicio: i, fin: i + 1, color: lista[i].color,
        texto: lista[i].corto, titulo: lista[i].titulo
      });
    }
    return {
      rotulo: mecanismo(id).corto, bloques: bloques,
      valor: n + " de " + lista.length
    };
  });
}

/* La barra mas larga de los tiempos medidos: la de la Queue. */
function escalaSegundos() {
  var tope = 0;
  MECANISMOS.forEach(function (m) { if (m.s > tope) { tope = m.s; } });
  return tope;
}

/* Una fila por mecanismo con su tiempo medido; en ambar los que serializan. */
function filasSegundos() {
  var tope = escalaSegundos();
  return MECANISMOS.map(function (m) {
    var f = factor(m.id);
    return {
      rotulo: m.corto, valor: seg(m.s),
      bloques: [{
        inicio: 0, fin: m.s,
        color: m.serializa ? "var(--ambar)" : "var(--azul)",
        texto: m.s / tope > 0.2 ? "×" + Motor.num(f, 1) : "",
        titulo: m.nombre + ": " + seg(m.s) + ", " + Motor.num(f, 1) + " veces el Array"
      }]
    };
  });
}

/* Que hace cada camino en la etapa k, contada desde 1. */
function describirEtapa(k) {
  var q = etapas("queue"), a = etapas("array");
  if (k <= 0) {
    return "Todavía no ha pasado nada. Siguiente mueve un dato por los dos caminos a la vez: " +
      "por una Queue y por un Array compartido.";
  }
  var t = "Etapa " + k + " de " + q.length + ". Queue: " + q[k - 1].texto + ".";
  if (k <= a.length) {
    t += " Array: " + a[k - 1].texto + ".";
  } else {
    t += " Array: nada, el dato ya quedó leído en la etapa " + a.length + ".";
  }
  return t;
}

/* Cierre cuando los dos caminos terminaron; los segundos solo si ya se
   comprobo la prediccion.                                                  */
function cierreEtapas(destapado) {
  var t = " La Queue convirtió el dato dos veces, al salir y al entrar; el Array no lo copió " +
    "ni lo convirtió ninguna vez.";
  if (destapado) {
    t += " Eso es lo que separa " + seg(mecanismo("queue").s) + " de " + seg(BASE) + ".";
  }
  return t;
}

/* Las lineas del ejemplo que se resaltan en la etapa k. */
function lineasActivas(k) {
  if (k === 1) { return ["ln-put", "ln-esc"]; }
  if (k === 2) { return ["ln-lee"]; }
  if (k === 3) { return ["ln-get"]; }
  return [];
}

/* Veredicto de la prediccion del factor de la Queue. */
function explicarFactor(bien, real, dicho) {
  var num = Motor.num;
  var q = mecanismo("queue"), p = mecanismo("pipe");
  var t;
  if (bien) {
    t = "Sí: " + num(real, 1) + " veces. ";
  } else if (Math.abs(dicho - real) < 1) {
    t = "Casi: el cociente es " + num(real, 1) + " y no " + num(dicho, 1) + ". ";
  } else {
    t = "No: son " + num(real, 1) + " veces, no " + num(dicho, 1) + ". ";
  }
  t += "La Queue costó " + seg(q.s) + " y la memoria compartida " + seg(BASE) + ", así que el " +
    "cociente es " + num(real, 1) + ", que redondeado son 17 veces. Cada dato se empaqueta con " +
    "pickle en el productor y se desempaqueta en el consumidor, y ese trabajo desaparece cuando " +
    "los dos procesos escriben y leen el mismo bloque de memoria. El Pipe costó " + seg(p.s) +
    ", " + num(factor("pipe"), 1) + " veces: los dos mecanismos que serializan quedan entre 14 " +
    "y 17 veces por encima del Array.";
  return t;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    MECANISMOS: MECANISMOS, BASE: BASE, ETAPAS: ETAPAS, LINEAS: LINEAS,
    SITUACIONES: SITUACIONES, mecanismo: mecanismo, factor: factor, seg: seg,
    etapas: etapas, situacion: situacion, elegir: elegir, razonesPara: razonesPara,
    validar: validar, filasEtapas: filasEtapas, escalaSegundos: escalaSegundos,
    filasSegundos: filasSegundos, describirEtapa: describirEtapa,
    cierreEtapas: cierreEtapas, lineasActivas: lineasActivas,
    explicarFactor: explicarFactor
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;
  var TOTAL = etapas("queue").length;
  var k = 0;              // etapas recorridas
  var destapado = false;  // los tiempos salen al comprobar la prediccion

  function pintarTiempos() {
    document.getElementById("aviso-tiempos").hidden = destapado;
    document.getElementById("cuerpo-tiempos").innerHTML = MECANISMOS.map(function (m) {
      // el 0,10 s del Array es el dato de la pregunta; los otros dos esperan
      var visible = destapado || m.id === "array";
      return "<tr><td style=\"text-align:left\">" + m.nombre + "</td>" +
        (visible ? "<td>" + seg(m.s) + "</td>" : "<td class=\"pend\">?</td>") +
        "<td>" + (m.serializa ? "sí" : "no") + "</td></tr>";
    }).join("");
  }

  function pintarColumnas() {
    document.getElementById("tabla-columnas").hidden = !destapado;
    document.getElementById("aviso-columnas").hidden = destapado;
    if (!destapado) { return; }
    document.getElementById("cuerpo-columnas").innerHTML = MECANISMOS.map(function (m) {
      return "<tr><td style=\"text-align:left\">" + m.nombre + "</td><td>" +
        (m.serializa ? "sí, con pickle" : "no") + "</td><td>" +
        (m.objetos ? "sí" : "solo tipos simples de C") + "</td><td>" +
        (m.sincroniza ? "sí" : "no, con Lock a mano") + "</td><td style=\"text-align:left\">" +
        m.extremos + "</td></tr>";
    }).join("");
  }

  function pintarSegundos() {
    document.getElementById("aviso-segundos").hidden = destapado;
    Motor.pintarGantt("panel-segundos", destapado ? filasSegundos() : [], escalaSegundos());
  }

  function pintarCodigo() {
    var activas = lineasActivas(k);
    Object.keys(LINEAS).forEach(function (id) {
      document.getElementById(id).className = "linea " + LINEAS[id] +
        (activas.indexOf(id) >= 0 ? " actual" : "");
    });
  }

  function pintarEtapas() {
    var hechas = k >= TOTAL;
    Motor.pintarGantt("panel-etapas", filasEtapas(k), TOTAL);
    document.getElementById("progreso").textContent = k === 0
      ? "Un dato por cada camino: " + TOTAL + " etapas en la Queue, " +
        etapas("array").length + " en el Array."
      : "Etapa " + k + " de " + TOTAL + (hechas ? " · los dos caminos terminaron" : "");
    document.getElementById("btn-siguiente").disabled = hechas;
    document.getElementById("paso-texto").textContent =
      describirEtapa(k) + (hechas ? cierreEtapas(destapado) : "");
    Motor.pintarChips("chips-etapas", [
      { texto: "etapas recorridas", valor: num(Math.min(k, TOTAL)) + " de " + num(TOTAL) },
      { texto: "pasos por pickle", valor: hechas ? "2 en la Queue, 0 en el Array" : "?",
        cuenta: true }
    ]);
    pintarCodigo();
  }

  document.getElementById("btn-siguiente").addEventListener("click", function () {
    k = Math.min(k + 1, TOTAL); pintarEtapas();
  });
  document.getElementById("btn-todo").addEventListener("click", function () {
    k = TOTAL; pintarEtapas();
  });
  document.getElementById("btn-reiniciar").addEventListener("click", function () {
    k = 0; pintarEtapas();
  });

  Motor.conectarPrediccion(
    { entrada: "prediccion-factor", boton: "btn-comprobar-factor",
      veredicto: "veredicto-factor" },
    function () { return factor("queue"); },
    function (bien, real, dicho) {
      destapado = true;
      pintarTiempos();
      pintarColumnas();
      pintarSegundos();
      pintarEtapas();
      return explicarFactor(bien, real, dicho);
    });

  SITUACIONES.forEach(function (s) {
    document.getElementById("sit-" + s.n).textContent = s.texto;
    var idOpciones = "opciones-s" + s.n;
    document.querySelectorAll("#" + idOpciones + " button").forEach(function (b) {
      b.dataset.op = b.dataset.mec === s.correcta ? "correcta" : b.dataset.mec;
    });
    Motor.conectarOpciones(idOpciones, "veredicto-s" + s.n, razonesPara(s));
  });

  pintarTiempos();
  pintarColumnas();
  pintarSegundos();
  pintarEtapas();
})();

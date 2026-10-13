if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* La misma diferencia, medida de cuatro formas. El par ./bueno y ./malo suma la
   misma matriz de 10.000 x 10.000 enteros con los indices al reves, y cada
   herramienta devuelve una razon distinta entre los dos (MEDIDAS). Las cuentas
   son razon(), razonMedida(), ordenAscendente() y esSiguiente(); el banco de
   situaciones de la ultima carta reparte cinco preguntas entre cinco
   herramientas.                                                              */

/* Las cuatro medidas del mismo par de binarios. La de perf se calcula con los
   contadores crudos de la corrida; las otras tres son la razon que reporto
   cada herramienta.                                                          */
var MEDIDAS = [
  { clave: "tiempo", nombre: "/usr/bin/time -v", mide: "tiempo de usuario", razon: 1.4 },
  { clave: "cachegrind", nombre: "cachegrind", mide: "fallos de D1 simulados", razon: 9.4 },
  { clave: "callgrind", nombre: "callgrind",
    mide: "fallos de lectura de sumaMatriz", razon: 18.0 },
  { clave: "perf", nombre: "perf", mide: "cache-misses reales",
    razon: 415, crudo: { bueno: 260870, malo: 108341596 } }
];

var COMPARACION = {
  columnas: ["top / ps", "Valgrind", "perf"],
  filas: [
    { rasgo: "Lenguajes", valores: ["cualquiera", "C/C++", "cualquiera"] },
    { rasgo: "Costo", valores: ["nulo", "alto, hasta 10x", "mínimo"] },
    { rasgo: "Caché", valores: ["no mide", "simulada", "real, contadores del procesador"] },
    { rasgo: "Detalle", valores: ["proceso", "función y línea", "función"] },
    { rasgo: "Sobre un proceso vivo", valores: ["sí", "no", "sí"] }
  ]
};

var ORDEN_TRABAJO = [
  { herramienta: "top, htop o ps",
    que: "visión general: qué proceso consume, cuántos hilos tiene, cuánta memoria pide" },
  { herramienta: "cachegrind y callgrind",
    que: "análisis de caché y costo por función y por línea, sobre una corrida de prueba" },
  { herramienta: "perf",
    que: "contadores del procesador sobre la corrida real, sin frenarla" }
];

function dec1(x) { return x.toFixed(1).replace(".", ","); }
function dec2(x) { return x.toFixed(2).replace(".", ","); }

function razon(malo, bueno) { return malo / bueno; }

/* La razon de cada herramienta: la de perf sale de sus propios contadores. */
function razonMedida(m) {
  return m.crudo ? razon(m.crudo.malo, m.crudo.bueno) : m.razon;
}

function buscarMedida(clave) {
  for (var i = 0; i < MEDIDAS.length; i++) {
    if (MEDIDAS[i].clave === clave) { return MEDIDAS[i]; }
  }
  return null;
}

/* Claves de las cuatro medidas, de la razon mas chica a la mas grande. */
function ordenAscendente(lista) {
  return lista.slice().sort(function (a, b) {
    return razonMedida(a) - razonMedida(b);
  }).map(function (m) { return m.clave; });
}

/* Si `clave` es la que sigue despues de lo ya acomodado en `parcial`. */
function esSiguiente(parcial, clave, lista) {
  return ordenAscendente(lista)[parcial.length] === clave;
}

function faltan(parcial, lista) { return lista.length - parcial.length; }

/* La razon como la escribe la tabla: un decimal, salvo la de perf, que llega a
   los cientos y se redondea a entero.                                        */
function textoRazon(clave) {
  var r = razonMedida(buscarMedida(clave));
  return r >= 100 ? Motor.num(r) + "x" : dec1(r) + "x";
}

/* Donde cae cada herramienta en la escala, para el veredicto del orden. */
var RAZONES_ORDEN = {
  tiempo: "El tiempo de usuario es el que menos se mueve, 1,4 veces: incluye " +
    "todo lo demás que hace el programa, y la espera de memoria queda diluida " +
    "entre el resto. Es el primero de la escala.",
  cachegrind: "Cachegrind simula una caché sin captador anticipado, así que " +
    "cuenta los fallos de los dos binarios con la misma vara y da 9,4 veces. " +
    "Queda por encima del reloj y por debajo de lo que atribuye callgrind.",
  callgrind: "callgrind separa los fallos de lectura que ocurren dentro de " +
    "sumaMatriz y deja fuera el resto del programa, así que sube a 18,0 veces. " +
    "Es el penúltimo: más que cachegrind, menos que los contadores reales.",
  perf: "Los contadores del procesador dan 415 veces, la razón más grande de " +
    "las cuatro: el captador anticipado esconde casi todos los fallos de " +
    "./bueno y ninguno de los de ./malo. Es el final de la escala."
};

var RAZONES_ESCALA = {
  correcta: "Es la explicación. El tiempo de reloj incluye todo lo demás que " +
    "hace el programa; la simulación de Valgrind no tiene captador anticipado " +
    "y mide los dos binarios con la misma vara; y los contadores del " +
    "procesador muestran cuántos fallos llegaron de verdad a memoria en cada " +
    "caso, que es donde el captador deja a ./bueno casi sin pérdidas y a " +
    "./malo con todas.",
  instrumento: "No. Las cuatro miden bien, cada una lo suyo: segundos de " +
    "usuario, fallos simulados, fallos atribuidos a una función y fallos " +
    "contados por el procesador. Son cuatro preguntas distintas sobre el mismo " +
    "par de binarios.",
  promediar: "No. El promedio de 1,4 y 415 no corresponde a ninguna magnitud. " +
    "Cada número responde a una pregunta y se lee con su herramienta; mezclarlos " +
    "pierde justo lo que cada nivel aporta.",
  exagera: "No. Las 415 veces son un conteo, no una estimación: 260.870 contra " +
    "108.341.596 fallos en la misma máquina. Lo que cambia entre niveles es " +
    "qué se cuenta, no la exactitud."
};

var RAZONES_ARRANQUE = {
  correcta: "Es por donde arranca la sesión. top, htop o ps no cuestan nada, " +
    "corren sobre el proceso tal como está y descartan lo obvio: el programa " +
    "equivocado, un solo hilo donde debían ir doce, memoria que se agota, " +
    "tiempo de sistema por las nubes.",
  valgrind: "No. Valgrind es el paso más caro, hasta diez veces más lento, y " +
    "pide relanzar el programa bajo su control. Vale la pena cuando ya se sabe " +
    "que el problema está en la caché o en una función concreta.",
  perf: "No tan rápido. perf cuesta poco y sirve en producción, pero sus " +
    "contadores se interpretan con una sospecha en mano. Sin saber todavía qué " +
    "proceso ni cuántos hilos, los números no tienen con qué compararse.",
  codigo: "No. Leer el programa completo antes de medirlo es lo que convierte " +
    "una tarde en una semana. La medición dice dónde mirar, y ahí sí el código " +
    "responde por qué."
};

/* ---- Banco de situaciones de la ultima carta ---- */

var CLAVES = ["top", "callgrind", "perf", "ps", "strace"];

var HERRAMIENTAS = {
  top: "top o htop",
  callgrind: "callgrind con callgrind_annotate o KCachegrind",
  perf: "perf",
  ps: "ps con thcount",
  strace: "strace -c"
};

var SITUACIONES = [
  {
    id: "servidor-lento",
    rotulo: "El servidor va lento ahora",
    texto: "El servidor va lento ahora mismo y no sé qué proceso lo tiene ocupado.",
    correcta: "top",
    razones: {
      top: "Sí. Ordena los procesos por consumo y refresca cada par de " +
        "segundos, así que el culpable aparece arriba sin preguntarle nada a " +
        "nadie. htop agrega la vista por núcleo, que delata un proceso " +
        "ocupando uno solo.",
      ps: "ps da la foto de un instante y hay que pedirle las columnas y " +
        "ordenarlas a mano. Sirve para un reporte, no para mirar una máquina " +
        "que se está moviendo.",
      perf: "perf stat -p mide un proceso que uno ya eligió. Aquí falta " +
        "justamente ese paso, y perf stat -a necesita permiso de la máquina " +
        "completa.",
      callgrind: "Valgrind corre el programa desde cero bajo su simulador y lo " +
        "frena hasta diez veces. No se engancha a lo que ya está ocupando el " +
        "servidor.",
      strace: "strace -c se engancha a un proceso, no a la máquina, y empieza " +
        "por el que uno le señale: la pregunta es precisamente cuál."
    }
  },
  {
    id: "linea-del-tiempo",
    rotulo: "En qué línea se pierde el tiempo",
    texto: "Quiero saber en qué línea del archivo se pierde el tiempo.",
    correcta: "callgrind",
    razones: {
      callgrind: "Sí. Cuenta las instrucciones de cada línea y las atribuye a " +
        "su función; callgrind_annotate las imprime junto al fuente y " +
        "KCachegrind las muestra ordenadas, con el árbol de llamadas.",
      perf: "perf report atribuye por función, y con las pilas por línea " +
        "necesita el binario con símbolos y acierta a medias con -O2. El " +
        "conteo exacto por línea es de callgrind.",
      top: "top llega al proceso y ahí se detiene: no sabe de funciones ni de " +
        "líneas.",
      ps: "ps informa del proceso completo, con su tiempo acumulado y sus " +
        "hilos. Nada del interior del programa.",
      strace: "strace -c cuenta llamadas al sistema. Si el tiempo se va en " +
        "cómputo, la traza sale casi vacía y la línea sigue sin aparecer."
    }
  },
  {
    id: "produccion",
    rotulo: "Medir en producción",
    texto: "Necesito medir un proceso en producción sin frenarlo.",
    correcta: "perf",
    razones: {
      perf: "Sí. Los contadores viven en el procesador, el costo es mínimo y " +
        "perf stat -p se engancha al proceso que ya está corriendo y lo suelta " +
        "al terminar.",
      callgrind: "Valgrind multiplica el tiempo hasta por diez y exige " +
        "relanzar el programa bajo su control. En producción eso es una caída, " +
        "no una medición.",
      top: "top no estorba, y tampoco entra: dice cuánta CPU y cuánta memoria " +
        "consume el proceso, no en qué se le va el tiempo adentro.",
      ps: "ps tampoco frena nada y tampoco mide: cuenta hilos, memoria y " +
        "tiempo acumulado en el instante en que se pregunta.",
      strace: "strace intercepta cada llamada al sistema y el proceso se " +
        "detiene en cada una. En producción se usa por tramos cortos y con la " +
        "cuenta clara de lo que cuesta."
    }
  },
  {
    id: "cuantos-hilos",
    rotulo: "Cuántos hilos arrancó",
    texto: "Quiero saber cuántos hilos arrancó de verdad el programa.",
    correcta: "ps",
    razones: {
      ps: "Sí. ps -o pid,thcount,comm -p PID responde con el número de hilos " +
        "vivos del proceso, que es lo que contradice o confirma la petición de " +
        "OMP_NUM_THREADS.",
      top: "top -H los lista uno por línea y hay que contarlos a mano. La " +
        "columna thcount ya trae el número.",
      perf: "perf stat da los núcleos ocupados, que es otra cosa: 10,26 " +
        "núcleos pueden salir de doce hilos trabajando a medias o de veinte " +
        "peleándose.",
      callgrind: "Valgrind serializa los hilos del programa que corre bajo su " +
        "control, así que lo que se observe ahí no es la corrida real.",
      strace: "strace -f deja ver los clone() que crearon los hilos, y hay que " +
        "leer la traza entera para contarlos."
    }
  },
  {
    id: "llamadas-sistema",
    rotulo: "Llamadas al sistema",
    texto: "Sospecho que el programa pasa el día haciendo llamadas al sistema.",
    correcta: "strace",
    razones: {
      strace: "Sí. strace -c resume la corrida por llamada: cuántas veces, " +
        "cuánto tiempo y cuántos errores devolvió cada una. Un read() repetido " +
        "un millón de veces aparece en la primera fila.",
      top: "top muestra la columna de tiempo de sistema subiendo, que es la " +
        "sospecha, no la respuesta: no dice qué llamada se repite.",
      perf: "perf stat separa el tiempo de usuario del de sistema, y perf " +
        "trace se le parece. El resumen por llamada, con conteos y errores, es " +
        "de strace -c.",
      callgrind: "Valgrind cuenta instrucciones del programa. El tiempo que " +
        "pasa dentro del núcleo no es instrucción suya y queda fuera del conteo.",
      ps: "ps entrega el tiempo acumulado del proceso sin separar qué parte se " +
        "fue en el núcleo, y menos en qué llamada."
    }
  }
];

/* Generador congruencial lineal: la misma semilla da la misma secuencia. */
function lcg(semilla) {
  var x = semilla >>> 0;
  return function () {
    x = (Math.imul(1664525, x) + 1013904223) >>> 0;
    return x / 4294967296;
  };
}

function barajar(lista, semilla) {
  var r = lcg(semilla);
  var copia = lista.slice();
  for (var i = copia.length - 1; i > 0; i--) {
    var j = Math.floor(r() * (i + 1));
    var t = copia[i]; copia[i] = copia[j]; copia[j] = t;
  }
  return copia;
}

function buscar(situaciones, id) {
  for (var i = 0; i < situaciones.length; i++) {
    if (situaciones[i].id === id) { return situaciones[i]; }
  }
  return null;
}

/* El motor espera la clave "correcta" en la opcion que resuelve. */
function razonesPara(situacion) {
  var salida = {};
  CLAVES.forEach(function (c) {
    salida[c === situacion.correcta ? "correcta" : c] = situacion.razones[c];
  });
  return salida;
}

function contarAciertos(respuestas, situaciones) {
  return respuestas.filter(function (r) {
    var s = buscar(situaciones, r.id);
    return s !== null && s.correcta === r.primera;
  }).length;
}

/* Cada situacion trae razon para las cinco herramientas. */
function validar(situaciones) {
  for (var i = 0; i < situaciones.length; i++) {
    var s = situaciones[i];
    if (CLAVES.indexOf(s.correcta) < 0) { return false; }
    for (var j = 0; j < CLAVES.length; j++) {
      var r = s.razones[CLAVES[j]];
      if (typeof r !== "string" || !r.trim()) { return false; }
    }
  }
  return true;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    MEDIDAS: MEDIDAS, COMPARACION: COMPARACION, ORDEN_TRABAJO: ORDEN_TRABAJO,
    CLAVES: CLAVES, HERRAMIENTAS: HERRAMIENTAS, SITUACIONES: SITUACIONES,
    RAZONES_ORDEN: RAZONES_ORDEN, RAZONES_ESCALA: RAZONES_ESCALA,
    RAZONES_ARRANQUE: RAZONES_ARRANQUE,
    dec1: dec1, dec2: dec2, razon: razon, razonMedida: razonMedida,
    buscarMedida: buscarMedida, ordenAscendente: ordenAscendente,
    esSiguiente: esSiguiente, faltan: faltan, textoRazon: textoRazon,
    lcg: lcg, barajar: barajar, buscar: buscar, razonesPara: razonesPara,
    contarAciertos: contarAciertos, validar: validar
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;

  /* ---- Carta 1: ordenar las cuatro razones ---- */
  var acomodadas = [];
  var botonesOrden = document.querySelectorAll("#op-orden-escala button");
  var cajaOrden = document.getElementById("ver-orden");

  function pintarTablaMedidas() {
    var completo = acomodadas.length === MEDIDAS.length;
    document.getElementById("cuerpo-medidas").innerHTML = MEDIDAS.map(function (m) {
      var celda = completo
        ? "<td>" + textoRazon(m.clave) + "</td>"
        : "<td class=\"pend\">?</td>";
      return "<tr><td style=\"text-align:left\"><code>" + m.nombre +
        "</code></td><td style=\"text-align:left\">" + m.mide + "</td>" +
        celda + "</tr>";
    }).join("");
  }

  function pintarSecuencia() {
    var fichas = acomodadas.map(function (c) {
      return "<span class=\"ficha\">" + buscarMedida(c).nombre + "</span>";
    });
    for (var i = acomodadas.length; i < MEDIDAS.length; i++) {
      fichas.push("<span class=\"ficha tachada\">?</span>");
    }
    document.getElementById("secuencia-escala").innerHTML =
      fichas.join("<span class=\"flecha\">→</span>");
    document.getElementById("progreso-escala").textContent =
      acomodadas.length === MEDIDAS.length
        ? "Las cuatro en su lugar, de la razón más chica a la más grande"
        : "Faltan " + num(faltan(acomodadas, MEDIDAS)) + " de " +
          num(MEDIDAS.length);
  }

  function refrescarBotonesOrden() {
    botonesOrden.forEach(function (b) {
      b.disabled = acomodadas.indexOf(b.dataset.clave) >= 0;
    });
  }

  botonesOrden.forEach(function (b) {
    b.addEventListener("click", function () {
      var clave = b.dataset.clave;
      if (esSiguiente(acomodadas, clave, MEDIDAS)) {
        acomodadas.push(clave);
        cajaOrden.className = "veredicto bien";
        cajaOrden.textContent = "Va en ese lugar. " + RAZONES_ORDEN[clave];
        if (acomodadas.length === MEDIDAS.length) {
          document.getElementById("nota-escala").hidden = false;
        }
      } else {
        cajaOrden.className = "veredicto mal";
        cajaOrden.textContent = "No es la que sigue. " + RAZONES_ORDEN[clave];
      }
      refrescarBotonesOrden();
      pintarSecuencia();
      pintarTablaMedidas();
    });
  });

  document.getElementById("btn-reiniciar-escala").addEventListener("click",
    function () {
      acomodadas = [];
      cajaOrden.className = "veredicto";
      cajaOrden.textContent = "";
      document.getElementById("nota-escala").hidden = true;
      refrescarBotonesOrden();
      pintarSecuencia();
      pintarTablaMedidas();
    });

  Motor.conectarOpciones("op-escala", "ver-escala", RAZONES_ESCALA);

  /* ---- Carta 3: la tabla de la sesion ---- */
  document.getElementById("cuerpo-comparacion").innerHTML =
    COMPARACION.filas.map(function (f) {
      return "<tr><td style=\"text-align:left\">" + f.rasgo + "</td>" +
        f.valores.map(function (v) { return "<td>" + v + "</td>"; }).join("") +
        "</tr>";
    }).join("");

  /* ---- Carta 4: una herramienta por situacion ---- */
  var orden = SITUACIONES.slice();
  var semilla = 1;
  var indice = 0;
  var respuestas = [];
  var razones = {};

  var botones = document.querySelectorAll("#op-herramientas button");
  var caja = document.getElementById("ver-herramientas");
  var btnSiguiente = document.getElementById("btn-siguiente");
  var btnOtra = document.getElementById("btn-otra");
  var resumen = document.getElementById("resumen");

  function actual() { return orden[indice]; }

  function respondida() {
    return respuestas.length > 0 &&
      respuestas[respuestas.length - 1].id === actual().id;
  }

  function mostrarSituacion() {
    var s = actual();
    document.getElementById("progreso-herramientas").textContent =
      "Situación " + num(indice + 1) + " de " + num(orden.length);
    document.getElementById("texto-situacion").textContent = s.texto;
    var nuevas = razonesPara(s);
    Object.keys(razones).forEach(function (k) { delete razones[k]; });
    Object.keys(nuevas).forEach(function (k) { razones[k] = nuevas[k]; });
    botones.forEach(function (b) {
      b.dataset.op = b.dataset.clave === s.correcta ? "correcta" : b.dataset.clave;
      b.classList.remove("elegida");
    });
    caja.className = "veredicto";
    caja.textContent = "";
    btnSiguiente.hidden = true;
    btnSiguiente.textContent = indice + 1 < orden.length
      ? "Siguiente situación" : "Ver el marcador";
  }

  function pintarMarcador() {
    Motor.pintarChips("panel-marcador", [
      { texto: "a la primera",
        valor: num(contarAciertos(respuestas, SITUACIONES)), cuenta: true },
      { texto: "respondidas",
        valor: num(respuestas.length) + " de " + num(orden.length) }
    ]);
  }

  function agregarFila(s, primera) {
    var color = primera === s.correcta ? "var(--verde)" : "var(--rojo)";
    document.getElementById("cuerpo-marcador").innerHTML +=
      "<tr><td style=\"text-align:left\">" + s.rotulo + "</td><td style=\"color:" +
      color + "\">" + HERRAMIENTAS[primera] + "</td><td>" +
      HERRAMIENTAS[s.correcta] + "</td></tr>";
  }

  function terminar() {
    var aciertos = contarAciertos(respuestas, SITUACIONES);
    document.getElementById("progreso-herramientas").textContent =
      "Las " + num(orden.length) + " situaciones respondidas";
    resumen.textContent = num(aciertos) + " de " + num(orden.length) +
      " a la primera. " + (aciertos === orden.length
        ? "Cinco preguntas distintas, cinco herramientas, y ninguna responde la " +
          "del vecino."
        : "La tabla marca en cuáles la primera elección fue otra; vuelva a esas " +
          "y lea la razón de la que sí responde.");
    resumen.hidden = false;
    btnOtra.hidden = false;
    btnSiguiente.hidden = true;
  }

  function reiniciar() {
    orden = barajar(SITUACIONES, semilla);
    semilla += 1;
    indice = 0;
    respuestas = [];
    document.getElementById("cuerpo-marcador").innerHTML = "";
    resumen.hidden = true;
    btnOtra.hidden = true;
    mostrarSituacion();
    pintarMarcador();
  }

  Motor.conectarOpciones("op-herramientas", "ver-herramientas", razones);

  botones.forEach(function (b) {
    b.addEventListener("click", function () {
      botones.forEach(function (o) { o.classList.remove("elegida"); });
      b.classList.add("elegida");
      if (!respondida()) {
        respuestas.push({ id: actual().id, primera: b.dataset.clave });
        agregarFila(actual(), b.dataset.clave);
        pintarMarcador();
      }
      btnSiguiente.hidden = false;
    });
  });

  btnSiguiente.addEventListener("click", function () {
    if (indice + 1 < orden.length) { indice += 1; mostrarSituacion(); }
    else { terminar(); }
  });

  btnOtra.addEventListener("click", reiniciar);

  /* ---- Carta 5: por donde empezar ---- */
  Motor.conectarOpciones("op-arranque", "ver-arranque", RAZONES_ARRANQUE);

  document.getElementById("lista-orden").innerHTML =
    ORDEN_TRABAJO.map(function (p) {
      return "<li><b>" + p.herramienta + "</b>: " + p.que + "</li>";
    }).join("");

  document.querySelectorAll("#op-arranque button").forEach(function (b) {
    b.addEventListener("click", function () {
      document.getElementById("nota-arranque").hidden = false;
    });
  });

  Motor.pintarChips("datos-herramientas", [
    { texto: "situaciones", valor: num(SITUACIONES.length) },
    { texto: "herramientas", valor: num(CLAVES.length) }
  ]);

  pintarSecuencia();
  pintarTablaMedidas();
  mostrarSituacion();
  pintarMarcador();
})();

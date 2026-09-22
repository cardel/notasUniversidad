if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Ocho preguntas sobre ruta.py. Siete se contestan con una de las cuatro
   herramientas de la clase; la octava pregunta por el costo del muestreo y
   trae sus propias opciones. Cada pregunta lleva su lista de opciones, la
   clave correcta y una razon por opcion; el marcador cuenta los aciertos a
   la primera y la baraja usa un LCG.                                       */

var HERRAMIENTAS = [
  { clave: "time", texto: "time.perf_counter" },
  { clave: "timeit", texto: "timeit" },
  { clave: "cprofile", texto: "cProfile" },
  { clave: "pyinstrument", texto: "Pyinstrument" }
];

/* Lo que dice el deck de ruta.py, para las chips del encabezado. */
var PROGRAMA = { puntos: 2000, llamadas: 4000000, espera: 0.5 };

var PREGUNTAS = [
  {
    id: "conteo",
    rotulo: "Conteo de llamadas",
    texto: "¿Cuántas veces se llamó distancia?",
    opciones: HERRAMIENTAS,
    correcta: "cprofile",
    razones: {
      cprofile: "Sí. La fila de distancia trae ncalls 4.000.000, y la de " +
        "math.sqrt otras tantas: cProfile registra cada entrada y cada " +
        "salida de función, así que el conteo es exacto, contado uno por " +
        "uno. El encabezado suma 8.004.232 llamadas en todo el programa.",
      pyinstrument: "En ninguna línea del árbol aparece un número de " +
        "llamadas. Pyinstrument mira dónde está el programa cada 1,2 ms, " +
        "2.377 veces en esta corrida, y anota la pila; entre dos miradas " +
        "pasan cientos de llamadas a distancia sin que ninguna quede " +
        "registrada. El muestreo ubica, no cuenta.",
      time: "Dos perf_counter entregan dos instantes y su diferencia, " +
        "1,382 s de reloj en esta corrida. No saben qué funciones hay " +
        "dentro ni cuántas veces se entró en cada una.",
      timeit: "timeit repite un fragmento number veces y suma los " +
        "tiempos; el conteo que conoce es el que uno le pasa, no el de las " +
        "llamadas internas. Para saber que distancia corrió 4.000.000 de " +
        "veces hay que instrumentar cada llamada, y eso lo hace cProfile."
    }
  },
  {
    id: "quien",
    rotulo: "Quién llamó a quién",
    texto: "¿Quién llamó a quién hasta llegar a distancia?",
    opciones: HERRAMIENTAS,
    correcta: "pyinstrument",
    razones: {
      pyinstrument: "Sí. La sangría del árbol lo dibuja: main → recorrido " +
        "→ <genexpr> → mas_cercano → distancia, y debajo de distancia el " +
        "[self] y sqrt. Cada nivel de sangría es una llamada más en la pila.",
      cprofile: "La tabla trae una fila por función ordenada por cumtime, " +
        "pero no dice quién llamó a quién: que mas_cercano tenga cumtime " +
        "2,461 y distancia 1,675 hay que casarlo a mano, o pedir callers " +
        "en pstats. En el árbol la cadena viene dibujada.",
      time: "Dos perf_counter alrededor de main dan 1,382 s y nada más: " +
        "esa medición no trae nombres de funciones ni pila de llamadas.",
      timeit: "timeit cronometra el fragmento que uno le pasa, aislado con " +
        "su setup. No entra al programa a ver quién llama a quién; para " +
        "eso hay que perfilar, y el árbol de Pyinstrument dibuja la cadena."
    }
  },
  {
    id: "espera",
    rotulo: "El medio segundo de espera",
    texto: "¿Dónde está el medio segundo en que el programa no gasta CPU?",
    opciones: HERRAMIENTAS,
    correcta: "pyinstrument",
    razones: {
      pyinstrument: "Sí. El encabezado trae Duration 2,876 contra CPU " +
        "time 2,358: la diferencia de medio segundo es reloj sin " +
        "procesador, y el árbol la ubica en la rama leer_sensor → sleep, " +
        "0,501 s. Dos números y una rama, sin restar nada por fuera.",
      cprofile: "La tabla trae la fila de time.sleep con tottime 0,500, " +
        "así que el dato está. Lo que no trae es la separación entre reloj " +
        "y CPU: el encabezado da un solo número, 2,963 s, y para saber que " +
        "ese medio segundo fue espera y no cómputo hay que conocer la " +
        "función de antemano. Pyinstrument lo dice con Duration y CPU time.",
      time: "El time de la terminal separa real 1,382 de user 0,870, y la " +
        "diferencia es el medio segundo: sabe que hubo espera, pero no en " +
        "qué función. Ubicarla pide un perfilador.",
      timeit: "timeit repite el fragmento y suma el reloj; no distingue " +
        "CPU de espera ni entra al programa a ver en qué función se " +
        "durmió. Con sleep adentro, cada repetición carga el medio segundo " +
        "y el promedio sale contaminado."
    }
  },
  {
    id: "informe",
    rotulo: "El tiempo del informe",
    texto: "¿Qué tiempo del programa va en el informe?",
    opciones: HERRAMIENTAS,
    correcta: "time",
    razones: {
      time: "Sí. El tiempo del programa es el que corre sin nadie " +
        "mirando: 1,382 s de reloj y 0,870 de CPU, medidos con time o con " +
        "dos perf_counter. Los perfiladores agregan su costo a lo que miden " +
        "y sus números no se reportan como duración.",
      cprofile: "Los 2,963 s del encabezado traen el costo de instrumentar " +
        "8.004.232 llamadas: el programa corrió 2,19 veces más lento que " +
        "solo. La tabla sirve para ordenar funciones entre sí, no para " +
        "copiar la duración al informe.",
      pyinstrument: "Duration 2,876 también trae el costo del perfilador, " +
        "2,16 veces la base en este programa: el enganche del muestreo se " +
        "dispara en cada una de las ocho millones de llamadas. El tiempo " +
        "que se reporta es el de la corrida sin perfilador, 1,382 s.",
      timeit: "timeit repite el fragmento number veces y entrega el total, " +
        "y en un programa con sleep de medio segundo cada repetición lo " +
        "carga. Para el tiempo de una corrida real en su ambiente basta " +
        "una medición limpia con time."
    }
  },
  {
    id: "comparar",
    rotulo: "Comparar dos versiones",
    texto: "¿La versión sin la llamada a distancia es más rápida que la " +
      "original? ¿Cuánto?",
    opciones: HERRAMIENTAS,
    correcta: "timeit",
    razones: {
      timeit: "Sí. Las dos versiones se cronometran con el mismo number y " +
        "se divide entre él: el ruido del sistema se promedia y la " +
        "relación entre los dos promedios es el cuánto. La base pasó de " +
        "1,382 a 1,174 s, y una sola corrida no separa esa diferencia del " +
        "ruido.",
      time: "Dos corridas sueltas dan dos números, 1,382 y 1,174, pero una " +
        "diferencia de 0,2 s con una medición por lado queda expuesta al " +
        "ruido del sistema: la siguiente corrida puede invertirla. timeit " +
        "repite y promedia; con perf_counter habría que armar el ciclo y " +
        "la desviación a mano.",
      cprofile: "cProfile dice que las llamadas bajaron de 8.004.232 a " +
        "6.232, y eso explica por qué mejora, pero sus tiempos traen el " +
        "costo del perfilador y ese costo cambia entre versiones: 2,19 " +
        "veces en una y casi nada en la otra. El cuánto se mide con las " +
        "dos versiones sin perfilador, repetidas.",
      pyinstrument: "El árbol ubica dónde se fue el tiempo en cada versión, " +
        "pero Duration carga el enganche del muestreo, que en la original " +
        "costó 2,16 veces y en la otra casi nada: comparar esos dos " +
        "Duration exagera la mejora. El cuánto se mide repitiendo las dos " +
        "versiones sin perfilador."
    }
  },
  {
    id: "produccion",
    rotulo: "En producción",
    texto: "¿Cuál se puede dejar corriendo en un servicio en producción " +
      "para ver dónde se va el tiempo?",
    opciones: HERRAMIENTAS,
    correcta: "pyinstrument",
    razones: {
      pyinstrument: "Sí. Muestrea la pila cada milisegundo y en un " +
        "servicio corriente, sin millones de llamadas diminutas, el costo " +
        "queda cerca del 5 %; la tabla de la clase lo marca como sí, con " +
        "cuidado. El cuidado es este programa: con cuatro millones de " +
        "llamadas cortas el enganche subió el costo a 2,16 veces.",
      cprofile: "Instrumenta cada entrada y cada salida de función y cuesta " +
        "entre 30 y 45 % en un programa corriente; en ruta.py fue 2,19 " +
        "veces. Un servicio con ese sobrecosto encendido todo el tiempo " +
        "atiende a la mitad de velocidad; se usa en una sesión aparte, " +
        "cuando hace falta el conteo exacto.",
      time: "perf_counter sí se deja en producción y cuesta casi nada, " +
        "pero entrega un número por bloque medido: dice cuánto tardó la " +
        "petición, no en qué función se fue el tiempo. Para ubicarlo hace " +
        "falta un perfilador de costo bajo.",
      timeit: "timeit repite el fragmento number veces para promediar, y " +
        "esa repetición es su costo: en un servicio atendería la misma " +
        "petición cien veces. La tabla de la clase lo marca sin uso en " +
        "producción."
    }
  },
  {
    id: "self",
    rotulo: "Propio contra sqrt",
    texto: "¿Cuánto del tiempo de distancia es aritmética suya y cuánto es " +
      "la llamada a sqrt?",
    opciones: HERRAMIENTAS,
    correcta: "pyinstrument",
    razones: {
      pyinstrument: "Sí. El árbol lo separa en dos hijos de distancia: " +
        "1,150 en [self], que es la aritmética propia, y 0,432 en sqrt. " +
        "Los dos suman los 1,582 del nodo y no hay que restar nada.",
      cprofile: "El dato está, pero repartido: distancia tiene tottime " +
        "1,232 y cumtime 1,675, y la fila de math.sqrt trae 0,443. La " +
        "aritmética propia es el tottime y la llamada a sqrt es cumtime " +
        "menos tottime, 0,443; la resta la hace uno. Pyinstrument la trae " +
        "hecha en los nodos [self] y sqrt.",
      time: "Dos perf_counter alrededor de distancia medirían las dos " +
        "cosas juntas, y ponerlos dentro de una función que corre " +
        "4.000.000 de veces cambia lo que se mide. Separar lo propio de lo " +
        "delegado es trabajo de un perfilador.",
      timeit: "timeit puede cronometrar sqrt aislado con un setup, pero " +
        "eso mide sqrt fuera de su contexto, no la parte de distancia que " +
        "se va en llamarlo. El reparto entre lo propio y lo delegado sale " +
        "del perfil, no de un fragmento repetido."
    }
  },
  {
    id: "costo",
    rotulo: "El costo del muestreo",
    texto: "¿Por qué aquí Pyinstrument costó casi lo mismo que cProfile " +
      "(2,16× contra 2,19×)?",
    opciones: [
      { clave: "enganche", texto: "El enganche que decide si guarda la pila corre en cada llamada" },
      { clave: "intervalo", texto: "Porque el intervalo de muestreo era muy pequeño" },
      { clave: "duracion", texto: "Porque el programa dura poco" },
      { clave: "instrumenta", texto: "Porque también instrumenta cada llamada" }
    ],
    correcta: "enganche",
    razones: {
      enganche: "Sí. Pyinstrument guarda la pila cada milisegundo, pero " +
        "para saber cuándo tocó instala un enganche que corre en cada " +
        "entrada y salida de función. Con 8.004.232 llamadas diminutas ese " +
        "enganche pesa tanto como instrumentarlas todas: 2,990 s contra " +
        "3,024 de cProfile. Con la llamada eliminada, 6.232 llamadas, los " +
        "dos perfiladores cuestan lo mismo que la base: 1,116 y 1,176 " +
        "contra 1,174.",
      intervalo: "El intervalo fija cuántas muestras se guardan, 2.377 en " +
        "2,876 s, y guardar una pila cada milisegundo es barato. Lo caro es " +
        "la consulta que decide si ya pasó el milisegundo, y esa corre en " +
        "cada llamada, sea el intervalo de 1 ms o de 10.",
      duracion: "La versión sin la llamada dura casi lo mismo, 1,174 s, y " +
        "ahí Pyinstrument no costó nada: 1,176 s. El precio no lo fija " +
        "cuánto dura el programa sino cuántas veces entra y sale de una " +
        "función: 8.004.232 contra 6.232.",
      instrumenta: "No instrumenta: mide la pila en instantes fijos y por " +
        "eso el árbol no trae el conteo de llamadas. Lo que sí corre en " +
        "cada llamada es el enganche que revisa si toca guardar una " +
        "muestra, y con cuatro millones de llamadas a distancia esa " +
        "revisión cuesta lo mismo que instrumentar."
    }
  }
];

/* true si son ocho y cada una trae cuatro opciones con clave y texto
   distintas, la correcta entre ellas y una razon con texto por opcion.     */
function validar(preguntas) {
  if (!preguntas || preguntas.length !== 8) { return false; }
  for (var i = 0; i < preguntas.length; i++) {
    var p = preguntas[i];
    if (!p.id || !p.rotulo || !p.texto) { return false; }
    if (!p.opciones || p.opciones.length !== 4 || !p.razones) { return false; }
    var claves = [];
    for (var j = 0; j < p.opciones.length; j++) {
      var o = p.opciones[j];
      if (!o.clave || !o.texto || claves.indexOf(o.clave) >= 0) { return false; }
      claves.push(o.clave);
      var r = p.razones[o.clave];
      if (typeof r !== "string" || !r.trim()) { return false; }
    }
    if (claves.indexOf(p.correcta) < 0) { return false; }
  }
  return true;
}

/* Generador congruencial lineal: la misma semilla da la misma secuencia. */
function lcg(semilla) {
  var x = semilla >>> 0;
  return function () {
    x = (Math.imul(1664525, x) + 1013904223) >>> 0;
    return x / 4294967296;
  };
}

/* Copia barajada de la lista (Fisher-Yates) con el LCG de la semilla. */
function barajar(lista, semilla) {
  var r = lcg(semilla);
  var copia = lista.slice();
  for (var i = copia.length - 1; i > 0; i--) {
    var j = Math.floor(r() * (i + 1));
    var t = copia[i]; copia[i] = copia[j]; copia[j] = t;
  }
  return copia;
}

/* Las razones con la clave correcta renombrada a "correcta", que es lo que
   el motor espera para pintar en verde.                                    */
function razonesPara(pregunta) {
  var salida = {};
  pregunta.opciones.forEach(function (o) {
    salida[o.clave === pregunta.correcta ? "correcta" : o.clave] =
      pregunta.razones[o.clave];
  });
  return salida;
}

/* Texto del boton de una opcion, para el marcador. */
function textoOpcion(pregunta, clave) {
  for (var i = 0; i < pregunta.opciones.length; i++) {
    if (pregunta.opciones[i].clave === clave) { return pregunta.opciones[i].texto; }
  }
  return clave;
}

function buscar(preguntas, id) {
  for (var i = 0; i < preguntas.length; i++) {
    if (preguntas[i].id === id) { return preguntas[i]; }
  }
  return null;
}

/* respuestas: [{ id, primera }] con la primera clave que se pulso. */
function contarAciertos(respuestas, preguntas) {
  return respuestas.filter(function (r) {
    var p = buscar(preguntas, r.id);
    return p !== null && p.correcta === r.primera;
  }).length;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    HERRAMIENTAS: HERRAMIENTAS, PROGRAMA: PROGRAMA, PREGUNTAS: PREGUNTAS,
    validar: validar, lcg: lcg, barajar: barajar, razonesPara: razonesPara,
    textoOpcion: textoOpcion, buscar: buscar, contarAciertos: contarAciertos
  };
}

if (typeof document !== "undefined") (function () {
  var orden = PREGUNTAS.slice();
  var semilla = 1;
  var indice = 0;
  var respuestas = [];
  // El motor lee este mismo objeto en cada clic; se rellena por pregunta.
  var razones = {};

  var botones = document.querySelectorAll("#opciones button");
  var caja = document.getElementById("veredicto");
  var btnSiguiente = document.getElementById("btn-siguiente");
  var btnOtra = document.getElementById("btn-otra");
  var resumen = document.getElementById("resumen");

  function actual() { return orden[indice]; }

  function respondida() {
    return respuestas.length > 0 &&
      respuestas[respuestas.length - 1].id === actual().id;
  }

  function mostrarPregunta() {
    var p = actual();
    document.getElementById("progreso").textContent =
      "Pregunta " + Motor.num(indice + 1) + " de " + Motor.num(orden.length);
    document.getElementById("texto-pregunta").textContent = p.texto;
    var nuevas = razonesPara(p);
    Object.keys(razones).forEach(function (k) { delete razones[k]; });
    Object.keys(nuevas).forEach(function (k) { razones[k] = nuevas[k]; });
    // Los cuatro botones toman el texto y la clave de la pregunta actual.
    botones.forEach(function (b, i) {
      var o = p.opciones[i];
      b.textContent = o.texto;
      b.dataset.clave = o.clave;
      b.dataset.op = o.clave === p.correcta ? "correcta" : o.clave;
      b.classList.remove("elegida");
    });
    caja.className = "veredicto";
    caja.textContent = "";
    btnSiguiente.hidden = true;
    btnSiguiente.textContent = indice + 1 < orden.length
      ? "Siguiente pregunta" : "Ver el resumen";
  }

  function pintarMarcador() {
    var aciertos = contarAciertos(respuestas, PREGUNTAS);
    Motor.pintarChips("panel-marcador", [
      { texto: "a la primera", valor: Motor.num(aciertos), cuenta: true },
      { texto: "respondidas", valor: Motor.num(respuestas.length) + " de " +
        Motor.num(orden.length) }
    ]);
  }

  function agregarFila(p, primera) {
    var bien = primera === p.correcta;
    var color = bien ? "var(--verde)" : "var(--rojo)";
    document.getElementById("cuerpo-marcador").innerHTML +=
      "<tr><td>" + p.rotulo + "</td><td style=\"color:" + color + "\">" +
      textoOpcion(p, primera) + "</td><td>" + textoOpcion(p, p.correcta) +
      "</td></tr>";
  }

  function terminar() {
    var aciertos = contarAciertos(respuestas, PREGUNTAS);
    document.getElementById("progreso").textContent =
      "Las " + Motor.num(orden.length) + " preguntas respondidas";
    resumen.textContent = Motor.num(aciertos) + " de " +
      Motor.num(orden.length) + " a la primera. " +
      (aciertos === orden.length
        ? "Cada pregunta le dijo qué herramienta la contesta."
        : "La tabla de arriba dice en cuáles la primera lectura fue otra: " +
          "vuelva a esas y lea la razón de la herramienta que sí era.");
    resumen.hidden = false;
    btnOtra.hidden = false;
    btnSiguiente.hidden = true;
  }

  function reiniciar() {
    orden = barajar(PREGUNTAS, semilla);
    semilla += 1;
    indice = 0;
    respuestas = [];
    document.getElementById("cuerpo-marcador").innerHTML = "";
    resumen.hidden = true;
    btnOtra.hidden = true;
    mostrarPregunta();
    pintarMarcador();
  }

  Motor.pintarChips("datos-programa", [
    { texto: "puntos", valor: Motor.num(PROGRAMA.puntos) },
    { texto: "llamadas a distancia", valor: Motor.num(PROGRAMA.llamadas) },
    { texto: "espera en sleep", valor: Motor.num(PROGRAMA.espera, 1) + " s" }
  ]);

  Motor.conectarOpciones("opciones", "veredicto", razones);

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
    if (indice + 1 < orden.length) {
      indice += 1;
      mostrarPregunta();
    } else {
      terminar();
    }
  });

  btnOtra.addEventListener("click", reiniciar);

  mostrarPregunta();
  pintarMarcador();
})();

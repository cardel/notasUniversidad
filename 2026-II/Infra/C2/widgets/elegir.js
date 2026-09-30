if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Ocho situaciones y las mismas siete estrategias como respuesta. Cada
   situacion trae la clave correcta y una razon por cada estrategia; el
   marcador cuenta los aciertos a la primera y la baraja usa un LCG.       */

var CLAVES = ["datos", "tareas", "agrupar", "demanda", "dospasadas",
              "pipeline", "secuencial"];

var ESTRATEGIAS = {
  datos: "Descomposición de datos",
  tareas: "Descomposición de tareas",
  agrupar: "Agrupar tareas y usar un grupo de hilos",
  demanda: "Reparto por demanda",
  dospasadas: "Reformular en dos pasadas",
  pipeline: "Pipeline",
  secuencial: "Dejarlo secuencial"
};

var SITUACIONES = [
  {
    id: "filtro",
    rotulo: "Filtro sobre 4.000 fotos",
    texto: "Aplicar el mismo filtro de desenfoque a 4.000 fotos del mismo " +
      "tamaño que ya están en disco y caben en memoria.",
    correcta: "datos",
    razones: {
      datos: "Sí. Son 4.000 datos del mismo tamaño y una sola operación " +
        "sobre cada uno: las fotos se parten en trozos disjuntos, cada hilo " +
        "desenfoca las suyas y no queda nada que combinar al final. Con " +
        "costo parejo, el reparto fijo alcanza.",
      tareas: "Hay una sola operación, el desenfoque. La descomposición de " +
        "tareas reparte operaciones distintas sobre los mismos datos, como " +
        "el máximo, la suma y el conteo de pares sobre un mismo vector; " +
        "aquí lo que abunda son los datos.",
      agrupar: "Desenfocar una foto cuesta milisegundos, muy por encima de " +
        "las decenas de microsegundos que cuesta crear un hilo: no hay " +
        "tareas tan pequeñas que haya que agrupar. Eso es un problema de " +
        "granularidad, y aquí no aparece.",
      demanda: "Las fotos son del mismo tamaño, así que cada una cuesta lo " +
        "mismo y con reparto fijo los hilos terminan casi al tiempo. El " +
        "reparto por demanda paga un contador compartido para corregir un " +
        "desbalance que no existe; eso es balanceo de carga.",
      dospasadas: "Las dos pasadas reformulan una cadena de dependencias, " +
        "como la suma de prefijos donde s[i] necesita s[i-1]. Desenfocar " +
        "la foto 7 no necesita nada de la foto 6: no hay cadena que romper.",
      pipeline: "El pipeline es para un flujo que va llegando y pasa por " +
        "varias etapas en orden. Las 4.000 fotos ya están en disco, caben " +
        "en memoria y hay una sola etapa: es una colección que se reparte " +
        "de una vez, no un flujo.",
      secuencial: "Dejarlo secuencial regala todo el margen: 4.000 " +
        "operaciones independientes del mismo costo es el caso más limpio " +
        "de descomposición de datos, y con k hilos el tiempo baja cerca de " +
        "k veces mientras la memoria aguante."
    }
  },
  {
    id: "estadisticas",
    rotulo: "Máximo, suma y pares",
    texto: "Sobre un vector de 50 millones que cabe en memoria, calcular el " +
      "máximo, la suma y cuántos elementos son pares.",
    correcta: "tareas",
    razones: {
      tareas: "Sí. Son tres operaciones independientes sobre los mismos 50 " +
        "millones: ninguna necesita el resultado de las otras. Con un hilo " +
        "por pregunta, los 94 ms de la versión secuencial bajaron a 44, " +
        "aceleración de 2,1 con tres hilos.",
      datos: "También se puede, partiendo el vector y haciendo las tres " +
        "preguntas sobre cada trozo, pero deja tres parciales de distinto " +
        "tipo que combinar al final. La división que está a la vista son " +
        "los tres trabajos: un hilo por pregunta y nada que combinar; eso " +
        "es descomposición de tareas.",
      agrupar: "Cada una de las tres operaciones recorre 50 millones de " +
        "elementos y dura decenas de milisegundos: son tres tareas grandes, " +
        "no un millón de pequeñas. La granularidad no es el problema aquí.",
      demanda: "Solo hay tres tareas y se sabe cuáles son; con un hilo para " +
        "cada una no hay cola de la que sacar la siguiente. El reparto por " +
        "demanda corrige el desbalance entre muchas tareas de costo " +
        "desigual, y eso es balanceo de carga.",
      dospasadas: "El máximo, la suma y el conteo de pares no dependen " +
        "entre sí, y ninguna posición necesita el resultado de la anterior. " +
        "Las dos pasadas resuelven una cadena de dependencias, y aquí no " +
        "hay cadena.",
      pipeline: "Las tres preguntas no son etapas por las que pasa cada " +
        "dato en orden: cada una lee el vector entero por su cuenta. Un " +
        "pipeline encadena pasos consecutivos; aquí los tres pasos son " +
        "independientes y van al tiempo, no en fila.",
      secuencial: "Las tres pasadas en secuencia tardan 94 ms y con un hilo " +
        "por pregunta 44. Dejarlo secuencial se justifica cuando repartir " +
        "cuesta más que calcular, y con tres tareas de decenas de " +
        "milisegundos no es el caso; es descomposición de tareas."
    }
  },
  {
    id: "imagenes",
    rotulo: "10.000 imágenes de costo desigual",
    texto: "Procesar 10.000 imágenes; cada una tarda entre 2 y 400 ms según " +
      "su tamaño y no se sabe cuál es cuál hasta abrirla. Ocho núcleos.",
    correcta: "demanda",
    razones: {
      demanda: "Sí. El costo por imagen varía doscientas veces y no se " +
        "conoce antes de abrirla, así que cualquier reparto fijo deja a un " +
        "hilo con las caras mientras los otros esperan. Con un contador " +
        "atómico cada hilo toma la siguiente al terminar y los ocho " +
        "núcleos siguen ocupados hasta el final.",
      datos: "Partir las 10.000 imágenes en ocho bloques fijos reparte el " +
        "conteo, no el trabajo: un bloque cargado de imágenes de 400 ms " +
        "marca el tiempo total mientras los otros siete núcleos esperan. " +
        "Con costo desigual y desconocido la pregunta es de balanceo de " +
        "carga.",
      tareas: "Hay una sola operación, procesar la imagen; no hay varias " +
        "operaciones distintas que repartir. La descomposición de tareas " +
        "escala con el número de trabajos distintos, y aquí hay uno.",
      agrupar: "Agrupar sirve cuando las tareas son tan pequeñas que crear " +
        "un hilo cuesta más que hacerlas. Aquí la más barata dura 2 ms, " +
        "cien veces el costo de un hilo, y agrupar en bloques fijos " +
        "empeora el desbalance entre las de 2 y las de 400; eso es " +
        "granularidad, y no es lo que falla.",
      dospasadas: "Cada imagen se procesa sola: la número 500 no necesita " +
        "nada de la 499. Las dos pasadas rompen una cadena de " +
        "dependencias, y aquí no hay ninguna.",
      pipeline: "Las 10.000 imágenes ya están; no llegan como flujo ni " +
        "pasan por etapas encadenadas. Un pipeline sirve cuando hay varios " +
        "pasos en orden por cada dato, y aquí hay un solo paso con costo " +
        "desigual: balanceo de carga.",
      secuencial: "Son 10.000 tareas independientes y con ocho núcleos el " +
        "tiempo puede bajar cerca de ocho veces si el reparto mantiene a " +
        "todos ocupados. Dejarlo secuencial regala ese margen; lo que hay " +
        "que resolver es el balanceo de carga."
    }
  },
  {
    id: "micro",
    rotulo: "Un millón de tareas de 2 µs",
    texto: "Un millón de tareas independientes de 2 µs cada una.",
    correcta: "agrupar",
    razones: {
      agrupar: "Sí. Crear, planificar y unir un hilo cuesta decenas de " +
        "microsegundos, más de diez veces la tarea de 2 µs: un hilo por " +
        "tarea multiplica el tiempo en vez de dividirlo. Agrupadas en " +
        "bloques de miles, cada bloque dura milisegundos y el costo fijo " +
        "se diluye; un grupo de hilos que reciba los bloques evita crear y " +
        "destruir hilos.",
      datos: "La descomposición de datos es la idea de fondo, pero dicha " +
        "así deja sin responder la pregunta del tamaño: con tareas de mil " +
        "operaciones, 400 tareas en 4 hilos tardaron 6,6 ms contra 0,4 ms " +
        "en secuencia. Lo que decide aquí es cuánto agrupar, y eso es " +
        "granularidad.",
      tareas: "Es una misma operación repetida un millón de veces, no " +
        "varias operaciones distintas. La descomposición de tareas reparte " +
        "trabajos diferentes, y aquí hay uno solo.",
      demanda: "Un fetch_add por cada tarea de 2 µs cuesta tanto como la " +
        "tarea, y un millón de ellos sobre la misma variable pone a los " +
        "hilos en fila. El reparto por demanda corrige costo desigual, " +
        "balanceo de carga, y estas tareas cuestan todas lo mismo.",
      dospasadas: "Las tareas son independientes: ninguna necesita el " +
        "resultado de otra. Las dos pasadas reformulan una cadena de " +
        "dependencias, y aquí no hay cadena que romper.",
      pipeline: "No hay etapas por las que pase cada tarea, hay una sola " +
        "operación de 2 µs. Un pipeline pone una cola con cerrojo entre " +
        "etapas, y ese cerrojo cuesta más que la tarea entera.",
      secuencial: "Un millón por 2 µs son 2 s de trabajo independiente: " +
        "con cuatro hilos y bloques grandes baja a cerca de medio segundo. " +
        "Lo que no sirve es un hilo por tarea; con la granularidad " +
        "ajustada, el reparto sí paga."
    }
  },
  {
    id: "saldo",
    rotulo: "Saldo máximo día a día",
    texto: "Para cada día, el saldo máximo alcanzado hasta ese día en una " +
      "serie de 20 millones de saldos, y la operación por elemento es costosa.",
    correcta: "dospasadas",
    razones: {
      dospasadas: "Sí. El máximo hasta cada día es una cadena: la posición " +
        "i necesita el resultado de la i-1. Como el máximo es asociativo, " +
        "cada hilo calcula el máximo de su bloque, se acumulan esos " +
        "parciales para saber con qué máximo arranca cada bloque y cada " +
        "hilo rehace el suyo. Se recorre dos veces, pero con una operación " +
        "costosa el reparto gana, como en la suma de prefijos: 2.731 ms en " +
        "secuencia contra 1.636 en dos pasadas.",
      datos: "Partir la serie en bloques y aplicar el ciclo tal como está " +
        "no sirve: el hilo que arranca en el día 5 millones no sabe cuál " +
        "era el máximo hasta el día anterior. Primero hay que romper la " +
        "cadena, y eso es dependencias.",
      tareas: "Hay una sola operación, el máximo acumulado; no hay varios " +
        "trabajos distintos que repartir. La descomposición de tareas " +
        "escala con el número de operaciones, y aquí es una.",
      agrupar: "El tamaño de la tarea no es la traba: 20 millones de " +
        "operaciones costosas dan bloques grandes de sobra. Lo que impide " +
        "repartir es que cada día depende del anterior, y eso se resuelve " +
        "en dependencias, no en granularidad.",
      demanda: "El costo por elemento es parejo, así que no hay desbalance " +
        "que corregir. Y aunque lo hubiera, sacar el siguiente día de una " +
        "cola no resuelve que ese día necesita el máximo del anterior: es " +
        "una cadena de dependencias.",
      pipeline: "No hay etapas distintas por las que pase cada saldo: es " +
        "una sola operación con una cadena hacia atrás. El pipeline " +
        "encadena pasos diferentes sobre un flujo, no un acumulado sobre " +
        "una serie completa.",
      secuencial: "Con la operación costosa, la segunda pasada cuesta menos " +
        "de lo que ahorra el reparto: en la suma de prefijos de 20 " +
        "millones, 2.731 ms en secuencia contra 1.636 con cuatro hilos. " +
        "Dejarlo secuencial vale cuando la operación es una suma pelada, y " +
        "aquí no lo es."
    }
  },
  {
    id: "logs",
    rotulo: "Registros que llegan por red",
    texto: "Un flujo de registros que llega por red: cada uno se lee, se " +
      "parsea y se escribe en una base de datos, en ese orden.",
    correcta: "pipeline",
    razones: {
      pipeline: "Sí. Los registros van llegando y cada uno pasa por las " +
        "mismas tres etapas en orden. Con una cola entre etapas, cada una " +
        "trabaja sobre un registro distinto al mismo tiempo y la que " +
        "espera red o base de datos no bloquea a las demás; el ritmo lo " +
        "marca la etapa lenta.",
      datos: "La descomposición de datos parte una colección que ya está " +
        "completa en memoria. Un flujo que llega por red no tiene un " +
        "tamaño que partir: cuando se quiere cortar en bloques, el " +
        "siguiente registro todavía no ha llegado.",
      tareas: "Leer, parsear y escribir no son tres trabajos " +
        "independientes: el segundo necesita la salida del primero y el " +
        "tercero la del segundo. La descomposición de tareas exige que las " +
        "operaciones no dependan entre sí, y estas van en cadena.",
      agrupar: "Agrupar registros en lotes ayuda dentro de una etapa, pero " +
        "no dice quién hace cada paso ni cómo trabajan al tiempo. La " +
        "granularidad ajusta el tamaño del lote; el orden de las etapas " +
        "pide un pipeline.",
      demanda: "El reparto por demanda saca tareas independientes de una " +
        "cola. Aquí cada registro tiene tres pasos ordenados y el que " +
        "escribe necesita que ya esté parseado: la pregunta es cómo " +
        "encadenar etapas, no cómo balancear costo desigual.",
      dospasadas: "Las dos pasadas reformulan una cadena entre posiciones " +
        "consecutivas de un arreglo completo, como la suma de prefijos. " +
        "Aquí la cadena es entre etapas de un mismo registro, y el arreglo " +
        "no está completo: sigue llegando. Eso es pipeline, no dependencias.",
      secuencial: "En secuencia cada registro espera a que el anterior " +
        "termine de escribirse, y mientras la escritura espera a la base " +
        "de datos el procesador no hace nada. Con tres etapas encadenadas, " +
        "24 lotes bajaron de 964 a 501 ms: es un pipeline."
    }
  },
  {
    id: "sumapelada",
    rotulo: "Suma de prefijos pelada",
    texto: "Un ciclo de 20 millones donde s[i] = s[i-1] + v[i] y la suma es " +
      "lo único que se hace por elemento.",
    correcta: "secuencial",
    razones: {
      secuencial: "Sí. La cadena pide dos pasadas, y la segunda recorre los " +
        "20 millones otra vez. Cuando lo único por elemento es una suma, " +
        "ese segundo recorrido es puro movimiento de memoria y cuesta más " +
        "de lo que ahorra el reparto: gana la versión secuencial. Se mide " +
        "y se decide con el número.",
      datos: "Partir el ciclo tal como está no sirve: s[i] necesita s[i-1] " +
        "y el hilo que arranca en la mitad no sabe con qué acumulado " +
        "empezar. Es una cadena de dependencias, y con una suma pelada ni " +
        "romperla paga.",
      tareas: "Hay una sola operación, la suma acumulada; no hay varios " +
        "trabajos independientes que repartir. La descomposición de tareas " +
        "no aplica a un solo trabajo.",
      agrupar: "El tamaño de las tareas no es la traba: son 20 millones de " +
        "elementos y cualquier bloque es grande. Lo que impide repartir es " +
        "que cada posición depende de la anterior, y eso se decide en " +
        "dependencias, no en granularidad.",
      demanda: "El costo por elemento es idéntico, así que no hay " +
        "desbalance que corregir con balanceo de carga. Y sacar posiciones " +
        "de una cola no resuelve que cada una necesita el acumulado de la " +
        "anterior.",
      dospasadas: "Es la reformulación que corresponde a la cadena, pero la " +
        "segunda pasada vuelve a recorrer los 20 millones y con una suma " +
        "pelada ese recorrido cuesta más de lo que ahorra el reparto. Con " +
        "una operación costosa gana; con la suma sola, gana la versión " +
        "secuencial. Es el caso límite de dependencias.",
      pipeline: "No hay etapas distintas por las que pase cada elemento: " +
        "es una sola suma con una cadena hacia atrás. El pipeline encadena " +
        "pasos diferentes sobre un flujo, no un acumulado sobre un arreglo."
    }
  },
  {
    id: "ventana",
    rotulo: "Ventana de cinco sobre la entrada",
    texto: "Para cada posición de un arreglo de temperaturas, el promedio de " +
      "las cinco posiciones anteriores del arreglo de ENTRADA.",
    correcta: "datos",
    razones: {
      datos: "Sí. Cada salida lee cinco posiciones del arreglo de entrada, " +
        "que nadie escribe: la salida i no necesita la salida i-1. Es una " +
        "operación por elemento sobre datos que ya están, y se reparte en " +
        "bloques contiguos; cada hilo lee hasta cinco posiciones antes de " +
        "su bloque y eso es todo.",
      tareas: "Hay una sola operación, el promedio de la ventana; no hay " +
        "varios trabajos distintos. La descomposición de tareas reparte " +
        "operaciones diferentes, y aquí es una.",
      agrupar: "Cada promedio son cinco lecturas y una división, pequeño " +
        "para un hilo por posición, pero el reparto en bloques de millones " +
        "ya resuelve eso: es descomposición de datos con bloques grandes. " +
        "La granularidad entraría solo si alguien pusiera un hilo por " +
        "posición.",
      demanda: "Todas las ventanas cuestan lo mismo, cinco lecturas y una " +
        "división, así que el reparto fijo deja a los hilos parejos. El " +
        "reparto por demanda paga un contador para corregir un desbalance " +
        "que no hay; eso es balanceo de carga.",
      dospasadas: "Parece una cadena, pero las cinco posiciones anteriores " +
        "se leen del arreglo de entrada, no de la salida: la salida i no " +
        "depende de la salida i-1. Las dos pasadas rompen una cadena sobre " +
        "la salida, como en la suma de prefijos, y aquí no la hay; " +
        "revíselo en dependencias.",
      pipeline: "El arreglo ya está completo; no llega como flujo ni pasa " +
        "por etapas en orden. Un pipeline encadena pasos distintos sobre " +
        "datos que van llegando, y aquí hay un solo paso sobre datos que " +
        "ya están.",
      secuencial: "No hay razón para renunciar al reparto: cada salida " +
        "solo lee la entrada y el trabajo se parte en bloques " +
        "independientes, descomposición de datos. Lo único que pide " +
        "cuidado es el borde de cada bloque, que lee cinco posiciones del " +
        "bloque anterior, y son lecturas, no esperas."
    }
  }
];

/* true si son ocho, cada una tiene su correcta entre las siete claves y
   trae las siete razones con texto.                                        */
function validar(situaciones) {
  if (!situaciones || situaciones.length !== 8) { return false; }
  for (var i = 0; i < situaciones.length; i++) {
    var s = situaciones[i];
    if (!s.id || !s.texto) { return false; }
    if (CLAVES.indexOf(s.correcta) < 0) { return false; }
    if (!s.razones) { return false; }
    for (var j = 0; j < CLAVES.length; j++) {
      var r = s.razones[CLAVES[j]];
      if (typeof r !== "string" || !r.trim()) { return false; }
    }
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
function razonesPara(situacion) {
  var salida = {};
  CLAVES.forEach(function (c) {
    salida[c === situacion.correcta ? "correcta" : c] = situacion.razones[c];
  });
  return salida;
}

function buscar(situaciones, id) {
  for (var i = 0; i < situaciones.length; i++) {
    if (situaciones[i].id === id) { return situaciones[i]; }
  }
  return null;
}

/* respuestas: [{ id, primera }] con la primera clave que se pulso. */
function contarAciertos(respuestas, situaciones) {
  return respuestas.filter(function (r) {
    var s = buscar(situaciones, r.id);
    return s !== null && s.correcta === r.primera;
  }).length;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    CLAVES: CLAVES, ESTRATEGIAS: ESTRATEGIAS, SITUACIONES: SITUACIONES,
    validar: validar, lcg: lcg, barajar: barajar, razonesPara: razonesPara,
    buscar: buscar, contarAciertos: contarAciertos
  };
}

if (typeof document !== "undefined") (function () {
  var orden = SITUACIONES.slice();
  var semilla = 1;
  var indice = 0;
  var respuestas = [];
  // El motor lee este mismo objeto en cada clic; se rellena por situacion.
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

  function mostrarSituacion() {
    var s = actual();
    document.getElementById("progreso").textContent =
      "Situación " + Motor.num(indice + 1) + " de " + Motor.num(orden.length);
    document.getElementById("texto-situacion").textContent = s.texto;
    var nuevas = razonesPara(s);
    Object.keys(razones).forEach(function (k) { delete razones[k]; });
    Object.keys(nuevas).forEach(function (k) { razones[k] = nuevas[k]; });
    botones.forEach(function (b) {
      var clave = b.dataset.clave;
      b.dataset.op = clave === s.correcta ? "correcta" : clave;
      b.classList.remove("elegida");
    });
    caja.className = "veredicto";
    caja.textContent = "";
    btnSiguiente.hidden = true;
    btnSiguiente.textContent = indice + 1 < orden.length
      ? "Siguiente situación" : "Ver el resumen";
  }

  function pintarMarcador() {
    var aciertos = contarAciertos(respuestas, SITUACIONES);
    Motor.pintarChips("panel-marcador", [
      { texto: "a la primera", valor: Motor.num(aciertos), cuenta: true },
      { texto: "respondidas", valor: Motor.num(respuestas.length) + " de " +
        Motor.num(orden.length) }
    ]);
  }

  function agregarFila(s, primera) {
    var bien = primera === s.correcta;
    var color = bien ? "var(--verde)" : "var(--rojo)";
    document.getElementById("cuerpo-marcador").innerHTML +=
      "<tr><td>" + s.rotulo + "</td><td style=\"color:" + color + "\">" +
      ESTRATEGIAS[primera] + "</td><td>" + ESTRATEGIAS[s.correcta] +
      "</td></tr>";
  }

  function terminar() {
    var aciertos = contarAciertos(respuestas, SITUACIONES);
    document.getElementById("progreso").textContent =
      "Las " + Motor.num(orden.length) + " situaciones respondidas";
    resumen.textContent = Motor.num(aciertos) + " de " +
      Motor.num(orden.length) + " a la primera. " +
      (aciertos === orden.length
        ? "La forma del problema le dijo la estrategia en todas."
        : "La tabla de arriba dice en cuáles la primera lectura fue otra: " +
          "vuelva a esas y lea la razón de la estrategia que sí era.");
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
      mostrarSituacion();
    } else {
      terminar();
    }
  });

  btnOtra.addEventListener("click", reiniciar);

  mostrarSituacion();
  pintarMarcador();
})();

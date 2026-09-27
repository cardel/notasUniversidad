if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Ocho situaciones de programas con hilos y las cinco piezas de
   sincronizacion de la clase como respuesta. Cada situacion trae una razon
   por opcion: la correcta dice por que sirve y cada distractor dice con que
   dato concreto se queda corto. El marcador cuenta los aciertos a la
   primera y la baraja usa un LCG, sin Math.random. La ultima carta es la
   cuenta del costo: ocho secciones criticas de 40 ms en fila y los 10 ms
   que le quedan al ultimo hilo.                                           */

var HERRAMIENTAS = {
  lock: "Lock",
  rlock: "RLock",
  semaforo: "Semaphore",
  evento: "Event",
  condicion: "Condition"
};

var CLAVES = ["lock", "rlock", "semaforo", "evento", "condicion"];

/* La cuenta de la carta final, con los numeros de la clase. */
var CERROJO = { hilos: 8, critica: 40, resto: 10 };

var SITUACIONES = [
  {
    id: "saldo",
    rotulo: "El total compartido",
    texto: "Ocho hilos suman sobre el mismo total y el resultado sale " +
      "distinto en cada corrida.",
    correcta: "lock",
    razones: {
      lock: "Sí. Leer el total, sumar y escribir son tres pasos, y entre el " +
        "primero y el tercero cabe otro hilo con el valor viejo en la mano. " +
        "Con un Lock alrededor de los tres, los ocho hilos pasan de uno en " +
        "uno y el total vuelve a salir igual en cada corrida.",
      rlock: "Un RLock también excluye, pero lo que agrega es dejar que el " +
        "mismo hilo vuelva a entrar llevando la cuenta de las veces. La " +
        "suma no se llama a sí misma, así que ese contador no hace nada y " +
        "cada acquire pesa un poco más que el del Lock.",
      semaforo: "Un Semaphore con más de un permiso deja entrar a varios " +
        "hilos a la vez, que es justo lo que se quiere evitar. Con un solo " +
        "permiso imita al Lock, salvo que acepta un release de un hilo que " +
        "nunca hizo acquire y ahí el cupo sube de uno sin que nada avise.",
      evento: "Un Event tiene dos estados y, cuando está puesto, pasan " +
        "todos los que esperaban: no excluye a nadie. Los ocho hilos " +
        "seguirían entrando juntos a las tres operaciones de la suma.",
      condicion: "Una Condition sirve para dormir hasta que otro hilo " +
        "avise. Aquí ninguno espera nada: los ocho tienen su número listo y " +
        "lo único que falta es que no se crucen dentro de la suma."
    }
  },
  {
    id: "conexiones",
    rotulo: "Cinco conexiones",
    texto: "El servicio remoto acepta a lo sumo cinco conexiones a la vez y " +
      "hay veinte hilos que lo consultan.",
    correcta: "semaforo",
    razones: {
      semaforo: "Sí. Semaphore(5) arranca con cinco permisos: los primeros " +
        "cinco hilos hacen acquire y pasan, y los otros quince se quedan " +
        "dentro del acquire hasta que alguno libere el suyo. El límite del " +
        "servicio queda escrito en un solo número.",
      lock: "Un Lock deja pasar a uno solo, así que las veinte consultas " +
        "irían en fila india y de las cinco conexiones que el servicio " +
        "acepta se usaría una. El límite no es uno, es cinco.",
      rlock: "Deja pasar a uno solo, igual que el Lock; lo que agrega es " +
        "que ese mismo hilo puede volver a entrar. Ninguna de las dos cosas " +
        "lleva la cuenta de cuántos están adentro.",
      evento: "Un Event puesto suelta a todos los que esperan de una vez, " +
        "así que los veinte hilos abrirían su conexión al mismo tiempo y el " +
        "servicio recibiría veinte. No cuenta cupos: avisa.",
      condicion: "Con una Condition se puede llevar el contador a mano y " +
        "dormir al hilo cuando llegue a cinco, pero eso es reescribir lo " +
        "que Semaphore ya trae. La Condition se paga cuando la espera " +
        "depende del estado de una estructura, no de un cupo fijo."
    }
  },
  {
    id: "arranque",
    rotulo: "El arranque",
    texto: "Veinte hilos ya están creados pero no deben empezar a procesar " +
      "hasta que el archivo de configuración esté leído.",
    correcta: "evento",
    razones: {
      evento: "Sí. Los veinte hilos llaman a wait y quedan dormidos sin " +
        "gastar procesador; el hilo que lee la configuración llama a set " +
        "una sola vez y los veinte despiertan. Un aviso, muchos que lo " +
        "esperan, y ninguno tuvo que preguntar en un ciclo.",
      lock: "El lector podría tomar un Lock y soltarlo al terminar, pero " +
        "entonces los veinte hilos entrarían de uno en uno a mirar si ya " +
        "está puesto el dato, y el que salga primero arranca antes que el " +
        "último. El cerrojo excluye, no avisa.",
      rlock: "Mismo caso que el Lock, con una reentrada que aquí nadie usa: " +
        "ningún hilo vuelve a tomar el cerrojo que ya tiene.",
      semaforo: "Liberar veinte permisos al final del lector sí soltaría a " +
        "los veinte, pero hay que acertar cuántos hilos esperan; si mañana " +
        "son veinticinco, cinco se quedan dormidos para siempre. El Event " +
        "no cuenta a nadie.",
      condicion: "Con notify_all funciona, y de hecho una Condition es un " +
        "aviso con cerrojo incluido. Cuando lo único que se transmite es " +
        "que ya se puede seguir, y no el estado de una estructura " +
        "compartida, el Event dice lo mismo en dos líneas."
    }
  },
  {
    id: "buffer",
    rotulo: "Productor y consumidor",
    texto: "Un hilo produce datos y otro los consume de una lista " +
      "compartida; el consumidor debe dormir mientras no haya nada y " +
      "despertar cuando llegue algo.",
    correcta: "condicion",
    razones: {
      condicion: "Sí. El consumidor toma la Condition, mira la lista y, si " +
        "está vacía, llama a wait: ahí suelta el cerrojo y duerme. El " +
        "productor agrega un dato y llama a notify, y el consumidor " +
        "despierta con el cerrojo otra vez en la mano y la lista no vacía. " +
        "El aviso y la exclusión vienen en la misma pieza.",
      lock: "El Lock protege la lista de las dos escrituras, pero no sabe " +
        "dormir: el consumidor toma el cerrojo, ve la lista vacía, lo " +
        "suelta y vuelve a intentar. Ese giro en vacío gasta un núcleo " +
        "entero y encima le quita el cerrojo al productor en cada vuelta.",
      evento: "El Event avisa y hay que acordarse de hacer clear. Con " +
        "varios datos llegando, el consumidor puede ver el aviso puesto y " +
        "la lista ya vacía porque otro se llevó el dato antes: entre " +
        "despertar y mirar no hay nada que lo proteja.",
      semaforo: "Un Semaphore lleva la cuenta de los datos disponibles y " +
        "sirve como aviso, pero no protege la lista: hay que sumarle un " +
        "Lock y quedan dos objetos que se coordinan a mano. La Condition " +
        "trae el cerrojo adentro.",
      rlock: "Un RLock es un Lock que el mismo hilo puede volver a tomar, y " +
        "ninguna de las dos cosas duerme al consumidor. Sin espera con " +
        "aviso sigue girando sobre una lista vacía."
    }
  },
  {
    id: "recursiva",
    rotulo: "La función que se llama a sí misma",
    texto: "Una función que ya tomó el cerrojo se llama a sí misma para " +
      "procesar un subárbol y el programa se queda congelado.",
    correcta: "rlock",
    razones: {
      rlock: "Sí. El RLock recuerda qué hilo lo tiene y cuántas veces lo " +
        "tomó: la segunda llamada entra, el contador sube a dos, y el " +
        "cerrojo se libera cuando vuelve a cero. Es el caso del recorrido " +
        "de un árbol, donde cada nivel llama al siguiente.",
      lock: "El Lock es el que produjo el congelamiento: no sabe quién lo " +
        "tiene, así que la segunda llamada de la misma función se pone a " +
        "esperar detrás de la primera y nadie va a soltarlo, porque el que " +
        "lo tiene es el que está esperando.",
      semaforo: "Semaphore(1) se congela igual: no mira quién llama, mira " +
        "el contador, y con un solo permiso el segundo acquire del mismo " +
        "hilo bloquea. Con dos permisos deja de bloquear, pero entonces " +
        "también entran otros hilos a la vez.",
      evento: "Un Event no protege el subárbol de nada: si se usa como " +
        "cerrojo hay que poner y quitar el aviso a mano, y dos hilos pueden " +
        "ver el mismo estado y entrar juntos. El problema aquí no es " +
        "avisar, es que el mismo hilo vuelva a entrar.",
      condicion: "Una Condition se construye sobre un cerrojo y por omisión " +
        "usa un RLock, así que la reentrada saldría de regalo. Pedirla solo " +
        "por eso es cargar con un wait y un notify que nadie va a llamar."
    }
  },
  {
    id: "diccionario",
    rotulo: "El diccionario a medias",
    texto: "Dos hilos insertan en el mismo diccionario y a veces falta una " +
      "de las claves.",
    correcta: "lock",
    razones: {
      lock: "Sí. La inserción no es un paso: calcula, ubica y a veces " +
        "redimensiona la tabla, y ahí es donde se pierde la clave del otro " +
        "hilo. Con un Lock alrededor entra uno a la vez y las dos claves " +
        "quedan.",
      rlock: "También excluye, pero la inserción no se llama a sí misma y " +
        "el contador de reentradas queda sin usar. Un Lock hace lo mismo " +
        "con menos trabajo en cada acquire.",
      semaforo: "Con más de un permiso entran varios hilos, que es el " +
        "problema. Con un permiso imita al Lock, y un release de más sube " +
        "el cupo a dos sin que nada lo impida: vuelven a entrar dos hilos " +
        "al mismo diccionario.",
      evento: "Un Event no bloquea: con el aviso puesto pasan todos. Los " +
        "dos hilos seguirían insertando a la vez y la clave se perdería " +
        "igual.",
      condicion: "La Condition sirve para esperar a que el diccionario " +
        "tenga algo. Aquí nadie espera: los dos hilos tienen su par listo " +
        "y lo que falta es que no escriban al mismo tiempo."
    }
  },
  {
    id: "cupo",
    rotulo: "Tres escrituras a disco",
    texto: "Se quiere que a lo sumo tres hilos estén escribiendo en disco " +
      "al mismo tiempo, y los demás esperen turno.",
    correcta: "semaforo",
    razones: {
      semaforo: "Sí. Semaphore(3) entrega tres permisos; el cuarto hilo se " +
        "queda dentro del acquire hasta que uno de los tres termine de " +
        "escribir y haga release. Subir o bajar el cupo es cambiar ese " +
        "número y nada más.",
      lock: "El Lock fija el cupo en uno: los hilos escribirían de a uno y " +
        "el disco quedaría con menos trabajo en vuelo del que se pidió. Lo " +
        "que se pide son tres a la vez.",
      rlock: "Cupo de uno, igual que el Lock, más una reentrada que aquí no " +
        "se usa: ninguna escritura llama a otra escritura.",
      evento: "El Event no cuenta: con el aviso puesto pasan todos los que " +
        "esperaban y los hilos escribirían juntos. Poner y quitar el aviso " +
        "para simular tres cupos es llevar el contador a mano.",
      condicion: "Se puede: la Condition duerme al cuarto hilo mientras un " +
        "contador propio marque tres. Ese contador con su cerrojo es " +
        "exactamente lo que ya hace un Semaphore."
    }
  },
  {
    id: "apagado",
    rotulo: "El apagado",
    texto: "Hay que avisarles a todos los hilos que el programa va a " +
      "terminar para que cierren lo que tengan abierto.",
    correcta: "evento",
    razones: {
      evento: "Sí. Un solo Event que todos consultan: cada hilo revisa " +
        "is_set al cerrar su vuelta, o espera con wait y un tiempo límite, " +
        "y el set del hilo principal alcanza a todos con una llamada. El " +
        "aviso se pone una vez y se queda puesto.",
      lock: "Un cerrojo no transmite ningún estado: el que lo toma solo " +
        "sabe que nadie más está adentro. Para el aviso habría que inventar " +
        "una variable aparte y protegerla, que es escribir el Event a mano.",
      rlock: "Igual que el Lock en cuanto al aviso, y la reentrada no tiene " +
        "nada que ver con avisar que se va a cerrar.",
      semaforo: "Habría que liberar un permiso por hilo y acertar cuántos " +
        "hay; el hilo que apareció después se queda esperando un permiso " +
        "que nadie le va a dar y no cierra lo que tenía abierto.",
      condicion: "Con notify_all funciona, y es lo que se usa cuando al " +
        "despertar hay que revisar además el estado de una estructura. Para " +
        "un aviso que se pone una vez y no se quita, el Event hace eso y " +
        "nada más."
    }
  }
];

/* true si son ocho situaciones con id distinto, texto y rotulo, la correcta
   entre las cinco claves y una razon con texto para cada una de las cinco. */
function validar(situaciones) {
  if (!situaciones || situaciones.length !== 8) { return false; }
  var ids = [];
  for (var i = 0; i < situaciones.length; i++) {
    var s = situaciones[i];
    if (!s.id || !s.rotulo || !s.texto || !s.razones) { return false; }
    if (ids.indexOf(s.id) >= 0) { return false; }
    ids.push(s.id);
    if (CLAVES.indexOf(s.correcta) < 0) { return false; }
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

/* Las secciones criticas van una tras otra, y cuando el ultimo hilo suelta
   el cerrojo todavia le falta su parte sin proteger.                       */
function tiempoConCerrojo(hilos, critica, resto) {
  return hilos * critica + resto;
}

/* Una fila por hilo: el hueco del comienzo es la espera en acquire, el
   primer bloque la seccion critica y el segundo el resto del trabajo.      */
function filasCerrojo(hilos, critica, resto) {
  var filas = [];
  for (var i = 0; i < hilos; i++) {
    var ini = i * critica;
    var num = Motor.num;
    filas.push({
      rotulo: "hilo " + num(i + 1),
      valor: num(ini + critica + resto) + " ms",
      bloques: [
        {
          inicio: ini, fin: ini + critica, color: "var(--azul)",
          texto: num(critica),
          titulo: "sección crítica del hilo " + num(i + 1) + ": de " +
            num(ini) + " a " + num(ini + critica) + " ms, con el cerrojo en " +
            "la mano" + (i > 0 ? ", después de esperar " + num(ini) + " ms" : "")
        },
        {
          inicio: ini + critica, fin: ini + critica + resto,
          color: "var(--verde)", texto: "",
          titulo: "el resto del trabajo del hilo " + num(i + 1) + ": " +
            num(resto) + " ms sin cerrojo, de " + num(ini + critica) + " a " +
            num(ini + critica + resto) + " ms"
        }
      ]
    });
  }
  return filas;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    HERRAMIENTAS: HERRAMIENTAS, CLAVES: CLAVES, CERROJO: CERROJO,
    SITUACIONES: SITUACIONES, validar: validar, lcg: lcg, barajar: barajar,
    razonesPara: razonesPara, buscar: buscar, contarAciertos: contarAciertos,
    tiempoConCerrojo: tiempoConCerrojo, filasCerrojo: filasCerrojo
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
    // Los cinco botones conservan su texto; solo cambia cual es la correcta.
    botones.forEach(function (b) {
      b.dataset.op = b.dataset.clave === s.correcta ? "correcta" : b.dataset.clave;
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
      HERRAMIENTAS[primera] + "</td><td>" + HERRAMIENTAS[s.correcta] +
      "</td></tr>";
  }

  function terminar() {
    var aciertos = contarAciertos(respuestas, SITUACIONES);
    document.getElementById("progreso").textContent =
      "Las " + Motor.num(orden.length) + " situaciones respondidas";
    resumen.textContent = Motor.num(aciertos) + " de " +
      Motor.num(orden.length) + " a la primera. " +
      (aciertos === orden.length
        ? "Cada situación dijo qué pieza la resuelve y por qué las otras " +
          "cuatro se quedan cortas."
        : "La tabla de arriba dice en cuáles la primera lectura fue otra: " +
          "vuelva a esas y lea la razón de la pieza que sí era.");
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

  Motor.pintarChips("datos-situaciones", [
    { texto: "situaciones", valor: Motor.num(SITUACIONES.length) },
    { texto: "piezas de sincronización", valor: Motor.num(CLAVES.length) }
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
      mostrarSituacion();
    } else {
      terminar();
    }
  });

  btnOtra.addEventListener("click", reiniciar);

  mostrarSituacion();
  pintarMarcador();

  // Carta del costo: el Gantt y las cuentas se pintan al comprobar.
  var c = CERROJO;
  var total = tiempoConCerrojo(c.hilos, c.critica, c.resto);

  Motor.conectarPrediccion(
    { entrada: "prediccion-tiempo", boton: "btn-comprobar-tiempo",
      veredicto: "veredicto-tiempo" },
    function () { return total; },
    function (bien, real, dicho) {
      var num = Motor.num;
      var s = bien ? "Sí: " + num(real) + " ms. "
        : "No: " + num(real) + " ms, no " + num(dicho) + ". ";
      s += "Las " + num(c.hilos) + " secciones críticas no se solapan: el " +
        "cerrojo lo tiene un hilo a la vez, así que van una tras otra, " +
        num(c.hilos) + " × " + num(c.critica) + " = " +
        num(c.hilos * c.critica) + " ms. Cuando el último sale del cerrojo " +
        "todavía le quedan sus " + num(c.resto) + " ms sin proteger: " +
        num(c.hilos * c.critica) + " + " + num(c.resto) + " = " + num(real) +
        " ms. Con un solo hilo el mismo programa tarda " +
        num(tiempoConCerrojo(1, c.critica, c.resto)) + " ms, y con ocho " +
        "tarda " + num(real / tiempoConCerrojo(1, c.critica, c.resto), 1) +
        " veces eso.";
      return s;
    }
  );

  document.getElementById("btn-comprobar-tiempo").addEventListener("click",
    function () {
      var num = Motor.num;
      Motor.pintarGantt("panel-gantt",
        filasCerrojo(c.hilos, c.critica, c.resto), total);
      Motor.pintarChips("chips-gantt", [
        { texto: "secciones críticas en fila",
          valor: num(c.hilos * c.critica) + " ms" },
        { texto: "más el resto del último", valor: num(c.resto) + " ms" },
        { texto: "total", valor: num(total) + " ms", cuenta: true }
      ]);
      document.getElementById("nota-costo").hidden = false;
    });
})();

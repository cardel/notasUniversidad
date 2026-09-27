if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* El ejemplo de la lista global de la clase: el hijo imprime [1, 4, 9, 16] y
   el padre imprime [], porque cada proceso tiene su propio espacio de
   memoria. Aqui se reproduce que ve cada uno segun donde viva el resultado,
   que hereda el hijo segun el modo de arranque y que pasos ocurren al
   crearlo con fork, forkserver y spawn.                                    */

var LISTA = [1, 2, 3, 4];

/* Lo que hace cuadrados(): num * num por cada elemento de la lista. */
function cuadrados(lista) {
  return lista.map(function (n) { return n * n; });
}

/* Donde puede vivir el resultado. comparte dice si el padre alcanza a ver lo
   que escribio el hijo; serializado, si el dato pasa por pickle.           */
var ESCENARIOS = {
  global: {
    nombre: "una variable global",
    comparte: false,
    serializado: "no",
    explicacion: "El hijo llena su propia copia de resultado y la imprime: [1, 4, 9, 16]. " +
      "La del padre sigue vacía porque append escribió en la memoria del hijo, y nada " +
      "devuelve ese cambio cuando el hijo termina."
  },
  argumento: {
    nombre: "un argumento de Process",
    comparte: false,
    serializado: "sí, la lista de entrada",
    explicacion: "La lista de entrada sí llega al hijo: viaja serializada con pickle, así que " +
      "el hijo ve [1, 2, 3, 4] con cualquier modo de arranque. Lo que no vuelve es el " +
      "resultado: el hijo lo arma en su propia memoria y el padre se queda con []."
  },
  array: {
    nombre: "un multiprocessing.Array",
    comparte: true,
    serializado: "no",
    tituloComun: "Bloque de memoria compartida: multiprocessing.Array('i', 4)",
    comun: "El sistema operativo mapea el mismo bloque en los dos procesos, así que las dos " +
      "filas de resultado son la misma memoria y no dos copias.",
    explicacion: "resultado es un multiprocessing.Array('i', 4). El hijo escribe " +
      "resultado[idx] = num * num y el padre lee [1, 4, 9, 16] después del join, porque el " +
      "arreglo no vive en la memoria privada de ninguno de los dos. Solo entran tipos simples " +
      "de C."
  },
  manager: {
    nombre: "una lista de Manager",
    comparte: true,
    serializado: "sí, en cada acceso",
    tituloComun: "Proceso servidor del Manager: manager.list()",
    comun: "El servidor guarda la lista de Python y los otros dos procesos la manipulan con " +
      "proxies: el dato no está en la memoria de ninguno de ellos.",
    explicacion: "Un Manager levanta un proceso servidor que guarda la lista de Python, y los " +
      "demás la manipulan con proxies. El padre ve [1, 4, 9, 16], y a cambio cada lectura y " +
      "cada escritura es un viaje de ida y vuelta al servidor, con serialización incluida: " +
      "para un diccionario de configuración no se nota; para un bucle de millones de accesos, sí."
  }
};

/* Que imprime cada proceso con la lista [1, 2, 3, 4]. */
function ejecutar(escenario) {
  var e = ESCENARIOS[escenario];
  var res = cuadrados(LISTA);
  return {
    enHijo: res.slice(),
    enPadre: e.comparte ? res.slice() : [],
    explicacion: e.explicacion
  };
}

var MODOS = {
  fork: { donde: "solo en Unix" },
  forkserver: { donde: "el modo por defecto en Linux desde Python 3.14" },
  spawn: { donde: "lo único que hay en Windows y macOS" }
};

/* Por que el hijo ve o no ve el dato, por tipo de dato y modo de arranque. */
var PORQUE = {
  global: {
    fork: "El hijo sale como copia del padre y hereda la variable tal como estaba: la ve sin " +
      "que nadie se la mande.",
    forkserver: "El proceso servidor importa el módulo por su cuenta y de ahí sale el hijo, " +
      "así que la variable queda en el valor que tiene al importar, no en el que el padre le " +
      "puso después.",
    spawn: "El hijo es un intérprete nuevo que importa el módulo desde cero: la variable " +
      "arranca en su valor inicial y lo que el padre le asignó en el bloque principal no " +
      "existe ahí."
  },
  argumento: {
    fork: "Lo que va en args= llega siempre, y con fork ya estaba dentro de la memoria copiada.",
    forkserver: "Lo que va en args= viaja serializado desde el padre hasta el hijo, así que " +
      "llega igual que con fork.",
    spawn: "Lo que va en args= se serializa con pickle, viaja por la tubería y el hijo lo " +
      "reconstruye: por eso un programa que pasa sus datos como argumentos también corre en " +
      "Windows."
  },
  compartida: {
    fork: "El Array vive en un bloque que el sistema operativo mapea en los dos procesos; el " +
      "hijo lo recibe mapeado, no copiado.",
    forkserver: "El Array se pasa en args= y multiprocessing le entrega al hijo el mismo " +
      "bloque, no una copia de los datos.",
    spawn: "El Array se pasa en args= y multiprocessing le entrega al hijo el mismo bloque: lo " +
      "que escribe uno lo lee el otro."
  }
};

/* tipo: global | argumento | compartida. Solo la variable global depende del
   modo de arranque, y solo fork la hereda.                                 */
function hereda(modo, tipo) {
  return {
    ve: !(tipo === "global" && modo !== "fork"),
    porque: PORQUE[tipo][modo]
  };
}

var PASOS = {
  fork: [
    { texto: "El padre llama a fork y el sistema operativo duplica el proceso." },
    { texto: "El hijo arranca con una copia de la memoria del padre: las variables globales " +
        "están donde el padre las dejó." },
    { texto: "El hijo ejecuta el target. El módulo no se vuelve a importar." }
  ],
  forkserver: [
    { texto: "En el primer Process, el padre levanta un proceso servidor limpio." },
    { texto: "El servidor importa el módulo, así que todo lo que está fuera del bloque " +
        "principal se ejecuta otra vez allí." },
    { texto: "El padre le pide un hijo al servidor y le manda el target y los argumentos " +
        "serializados." },
    { texto: "El servidor hace fork: el hijo sale con la memoria del servidor, no con la del " +
        "padre." },
    { texto: "El hijo ejecuta el target. Lo que el padre cambió después de levantar el " +
        "servidor no está ahí." }
  ],
  spawn: [
    { texto: "El padre lanza un intérprete de Python nuevo, sin nada de su memoria." },
    { texto: "El intérprete importa el módulo, así que todo lo que está fuera del bloque " +
        "principal se ejecuta otra vez." },
    { texto: "El padre serializa el target y los argumentos y los manda por una tubería." },
    { texto: "El hijo los reconstruye con pickle y prepara la llamada." },
    { texto: "El hijo ejecuta el target. Las variables globales quedan en el valor que tienen " +
        "al importar el módulo." }
  ]
};

function PASOS_ARRANQUE(modo) { return PASOS[modo].slice(); }

/* Con que queda el hijo cuando termina el arranque. */
function resumenModo(modo) {
  var aviso = " Crear procesos fuera del bloque if __name__ == \"__main__\": los crea sin fin.";
  if (modo === "fork") {
    return "El hijo tiene una copia de la memoria del padre: la variable global llega con lo " +
      "que el padre le puso y el módulo no se importó otra vez. Está " + MODOS.fork.donde + ".";
  }
  if (modo === "forkserver") {
    return "El hijo salió del servidor limpio: los argumentos llegaron, la variable global no. " +
      "El módulo se importó otra vez dentro del servidor." + aviso + " Es " +
      MODOS.forkserver.donde + ".";
  }
  return "El hijo es un intérprete nuevo: los argumentos llegaron serializados y la variable " +
    "global quedó en su valor inicial. El módulo se importó otra vez." + aviso + " Es " +
    MODOS.spawn.donde + ".";
}

var RAZONES_SALIDA = {
  correcta: "En el hijo [1, 4, 9, 16] y en el padre []. El hijo recorre la lista, hace append " +
    "sobre su propia copia de resultado y la imprime llena; cuando el padre imprime, después " +
    "del join, la suya sigue como la dejó.",
  hilos: "Eso pasaría con threading: dos hilos del mismo proceso comparten el espacio de " +
    "memoria y ven la misma lista. Aquí hay dos procesos y dos copias de resultado, y el " +
    "append del hijo toca solo la suya.",
  vacias: "El hijo sí calculó: su print sale antes del join, con [1, 4, 9, 16]. La lista vacía " +
    "es solo la del padre, que nunca recibió nada de vuelta.",
  error: "No hay error. Cada proceso escribe en su propia copia y nada choca: el programa " +
    "termina bien, y por eso engaña. El append se hizo, pero en la memoria del otro proceso."
};

var RAZONES_WINDOWS = {
  correcta: "En Windows el arranque es spawn y el hijo no hereda la memoria del padre: vuelve " +
    "a importar el módulo y la variable queda en su valor inicial, no en el que el padre le " +
    "puso en el bloque principal. En Linux con fork el hijo sale como copia y la variable " +
    "llega llena. Lo que se necesite compartir se pasa en args= o se pone en memoria " +
    "compartida.",
  nohay: "Windows sí tiene multiprocessing. Lo que cambia es el modo de arranque: spawn en " +
    "lugar de fork, y con spawn la memoria del padre no se hereda.",
  lock: "El problema no es de carrera: el dato no llega nunca. Un Lock ordena a dos procesos " +
    "que escriben sobre lo mismo; aquí el hijo lee una variable que en su espacio está en el " +
    "valor inicial, y fallaría igual con un solo proceso.",
  grande: "El tamaño no entra en el asunto. Con fork la memoria ni se copia al crear el hijo: " +
    "el sistema operativo la comparte hasta que alguien escribe. Con spawn el hijo importa el " +
    "módulo desde cero y la variable no se hereda, sea de cuatro elementos o de cuatro millones."
};

var RAZONES_CERROJO = {
  correcta: "Tomar el cerrojo del Value alrededor de la lectura y la escritura: " +
    "with total.get_lock(): total.value += parcial, o un Lock propio pasado a cada proceso. La " +
    "memoria es compartida, pero total.value += parcial son tres pasos: leer, sumar y " +
    "escribir, y dos procesos pueden leer el mismo valor antes de que el otro escriba. El " +
    "cerrojo interno del Value hace indivisible cada acceso, no la secuencia.",
  array: "Un Array trae el mismo problema en cada posición que dos procesos toquen a la vez. " +
    "Sirve cuando el trabajo se reparte en segmentos disjuntos, como los cuatro tramos de la " +
    "suma paralela, donde cada proceso escribe donde nadie más escribe.",
  manager: "Un Manager guarda objetos de Python en un proceso servidor y cobra un viaje de ida " +
    "y vuelta por acceso: más lento, y el aumento sigue siendo leer, sumar y escribir. Tampoco " +
    "lo vuelve indivisible.",
  copia: "Pasar el número como argumento le da a cada proceso su propia copia: los cuatro " +
    "sumarían sobre valores separados y el padre no vería ninguno de los cambios. Es el caso " +
    "de la lista global otra vez."
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    LISTA: LISTA, ESCENARIOS: ESCENARIOS, MODOS: MODOS, PORQUE: PORQUE, PASOS: PASOS,
    RAZONES_SALIDA: RAZONES_SALIDA, RAZONES_WINDOWS: RAZONES_WINDOWS,
    RAZONES_CERROJO: RAZONES_CERROJO,
    cuadrados: cuadrados, ejecutar: ejecutar, hereda: hereda,
    PASOS_ARRANQUE: PASOS_ARRANQUE, resumenModo: resumenModo
  };
}

if (typeof document !== "undefined") (function () {
  var num = Motor.num;
  var escenario = "global";
  var modo = "forkserver";
  var k = 0;                 // pasos del arranque ya mostrados
  var vistaHereda = false;   // la tabla de la carta 4 se destapa al responder

  function comoLista(v) {
    return "[" + v.map(function (x) { return num(x); }).join(", ") + "]";
  }

  function marcarPresets(atributo, valor) {
    document.querySelectorAll("[data-" + atributo + "]").forEach(function (b) {
      b.classList.toggle("activo", b.dataset[atributo] === valor);
    });
  }

  function caja(titulo, lineas) {
    return "<div class=\"espacio\"><b>" + titulo + "</b>" + lineas.map(function (l) {
      return "<div><code>" + l + "</code></div>";
    }).join("") + "</div>";
  }

  function pintarEspacios() {
    var e = ESCENARIOS[escenario];
    var r = ejecutar(escenario);
    var html = caja("Proceso padre", [
      "lista = " + comoLista(LISTA),
      "resultado = " + comoLista(r.enPadre),
      "imprime " + comoLista(r.enPadre)
    ]) + caja("Proceso hijo (p1)", [
      "lista = " + comoLista(LISTA),
      "resultado = " + comoLista(r.enHijo),
      "imprime " + comoLista(r.enHijo)
    ]);
    if (e.comun) {
      html += "<div class=\"espacio\" style=\"grid-column:1 / -1;border-color:var(--verde);" +
        "background:var(--verde-suave)\"><b>" + e.tituloComun + "</b><div>" + e.comun +
        "</div></div>";
    }
    document.getElementById("panel-espacios").innerHTML = html;
    document.getElementById("texto-escenario").textContent = r.explicacion;
    Motor.pintarChips("chips-espacios", [
      { texto: "el padre imprime", valor: comoLista(r.enPadre), cuenta: !e.comparte },
      { texto: "el hijo imprime", valor: comoLista(r.enHijo) },
      { texto: "el dato viaja serializado", valor: e.serializado }
    ]);
  }

  function pintarPasos() {
    var ps = PASOS_ARRANQUE(modo);
    var hechas = k >= ps.length;
    document.getElementById("pasos").innerHTML = ps.slice(0, k).map(function (p, i) {
      return "<div class=\"paso" + (i === k - 1 ? " actual" : "") + "\"><b>" + (i + 1) +
        "</b><span>" + p.texto + "</span></div>";
    }).join("");
    document.getElementById("progreso").textContent = k === 0
      ? "Arranque con " + modo + ": " + ps.length + " pasos por recorrer."
      : "Paso " + k + " de " + ps.length + " · arranque con " + modo +
        (hechas ? " · el hijo ya corre" : "");
    document.getElementById("btn-siguiente").disabled = hechas;
    document.getElementById("paso-texto").textContent = hechas ? resumenModo(modo) : "";
    var esFork = modo === "fork";
    Motor.pintarChips("chips-pasos", [
      { texto: "el módulo se importa en el hijo", valor: esFork ? "no" : "sí", cuenta: !esFork },
      { texto: "hereda la memoria del padre", valor: esFork ? "sí" : "no" },
      { texto: "los argumentos viajan serializados", valor: esFork ? "no" : "sí" }
    ]);
  }

  function pintarHereda() {
    var tipos = ["global", "argumento", "compartida"];
    var orden = ["fork", "forkserver", "spawn"];
    document.getElementById("cuerpo-hereda").innerHTML = orden.map(function (m) {
      var celdas = tipos.map(function (t) {
        if (!vistaHereda) { return "<td class=\"pend\">?</td>"; }
        var h = hereda(m, t);
        return "<td style=\"font-weight:600;color:" + (h.ve ? "var(--verde)" : "var(--rojo)") +
          "\">" + (h.ve ? "Sí" : "No") + "</td>";
      }).join("");
      var resalte = vistaHereda && m === "spawn" ? " style=\"background:var(--resalte)\"" : "";
      return "<tr" + resalte + "><td style=\"text-align:left\"><code>" + m + "</code></td>" +
        celdas + "</tr>";
    }).join("");
    document.getElementById("texto-hereda").textContent = vistaHereda
      ? "La columna de la variable global, modo por modo. fork: " + PORQUE.global.fork +
        " forkserver: " + PORQUE.global.forkserver + " spawn: " + PORQUE.global.spawn
      : "";
  }

  function destaparSalida() {
    var r = ejecutar("global");
    document.getElementById("salida-real").innerHTML = [
      "Resultado en p1: " + comoLista(r.enHijo),
      "Resultado en el programa principal: " + comoLista(r.enPadre)
    ].map(function (l) {
      return "<div class=\"linea bloque-3\"><span class=\"num\"></span><span class=\"txt\">" +
        l + "</span></div>";
    }).join("");
    document.getElementById("salida-real").hidden = false;
  }

  document.querySelectorAll("[data-escenario]").forEach(function (b) {
    b.addEventListener("click", function () {
      escenario = b.dataset.escenario;
      marcarPresets("escenario", escenario);
      pintarEspacios();
    });
  });
  document.querySelectorAll("[data-modo]").forEach(function (b) {
    b.addEventListener("click", function () {
      modo = b.dataset.modo;
      k = 0;
      marcarPresets("modo", modo);
      pintarPasos();
    });
  });
  document.getElementById("btn-siguiente").addEventListener("click", function () {
    k = Math.min(k + 1, PASOS_ARRANQUE(modo).length); pintarPasos();
  });
  document.getElementById("btn-todo").addEventListener("click", function () {
    k = PASOS_ARRANQUE(modo).length; pintarPasos();
  });
  document.getElementById("btn-reiniciar").addEventListener("click", function () {
    k = 0; pintarPasos();
  });

  Motor.conectarOpciones("opciones-salida", "veredicto-salida", RAZONES_SALIDA);
  document.querySelectorAll("#opciones-salida button").forEach(function (b) {
    b.addEventListener("click", destaparSalida);
  });
  Motor.conectarOpciones("opciones-windows", "veredicto-windows", RAZONES_WINDOWS);
  document.querySelectorAll("#opciones-windows button").forEach(function (b) {
    b.addEventListener("click", function () { vistaHereda = true; pintarHereda(); });
  });
  Motor.conectarOpciones("opciones-cerrojo", "veredicto-cerrojo", RAZONES_CERROJO);

  marcarPresets("escenario", escenario);
  marcarPresets("modo", modo);
  pintarEspacios();
  pintarPasos();
  pintarHereda();
})();

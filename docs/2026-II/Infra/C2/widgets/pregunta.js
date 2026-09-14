/* Las dos mediciones del deck, el mismo programa con tareas de dos tamanos,
   y tres preguntas de opciones sobre lo que la tabla muestra. No hay nada
   que simular: los numeros son los medidos y aqui solo se leen.            */

if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Tiempos en milisegundos; tamano es el exponente de 10 de cada tarea.
   La relacion es la que trae el deck: secuencial dividido entre 4 hilos.  */
var FILAS = [
  { tamano: 3, secuencial: 0.4, hilos: 6.6, relacion: 0.06 },
  { tamano: 6, secuencial: 393.6, hilos: 108.3, relacion: 3.64 }
];

var TANDAS = { tareas: 400, hilosPorTanda: 4 };

function numeroDeTandas(t) {
  return t.tareas / t.hilosPorTanda;
}

/* Lo que se va en administrar hilos: todo lo que el paralelo tarda por
   encima del secuencial. Devuelve ms, microsegundos por hilo y cuantas
   veces el trabajo util cabe en ese sobrante.                              */
function sobrecosto(fila, t) {
  var admin = fila.hilos - fila.secuencial;
  return {
    administracion: admin,
    porHilo: admin / t.tareas * 1000,
    veces: admin / fila.secuencial
  };
}

var PREGUNTAS = [
  {
    id: "cambio",
    razones: {
      correcta: "Eso es. La única columna que se movió es la primera: cada " +
        "tarea pasó de 10³ a 10⁶ operaciones. Con los mismos 4 hilos, la " +
        "misma máquina y el mismo programa, la relación fue de 0,06 a 3,64.",
      hilos: "Las dos filas se midieron con 4 hilos; es la misma columna en " +
        "ambas. Con los mismos hilos una fila tarda 6,6 ms y la otra 108,3 ms, " +
        "así que el cambio está en otro lado.",
      maquina: "Es la misma máquina en las dos filas, con los mismos núcleos " +
        "y la misma caché, y las mediciones se corrieron una tras otra. Lo " +
        "que se movió es el tamaño de cada tarea: de 10³ a 10⁶.",
      algoritmo: "El programa es el mismo línea por línea: 400 tareas en 100 " +
        "tandas de 4 hilos. Solo cambió cuánto trabajo trae cada tarea, de " +
        "10³ a 10⁶ operaciones."
    }
  },
  {
    id: "tiempo",
    razones: {
      correcta: "Eso es. El trabajo útil son 0,4 ms, lo que tarda la versión " +
        "secuencial; los otros 6,2 ms son crear, planificar y unir 400 hilos " +
        "en 100 tandas. Crear y unir un hilo cuesta decenas de microsegundos, " +
        "y 400 veces eso suma más de quince veces el trabajo.",
      lento: "Los hilos calculan a la misma velocidad que el hilo principal: " +
        "el trabajo son los mismos 0,4 ms, repartidos entre cuatro. Los 6,2 ms " +
        "restantes no son cálculo, son administración de 400 hilos.",
      memoria: "Con tareas de 10³ operaciones los datos caben en caché y la " +
        "memoria no alcanza a ser el cuello. La versión secuencial toca los " +
        "mismos datos y tarda 0,4 ms; los 6,2 ms de más son de los hilos.",
      cache: "Cuatro hilos compiten por la caché cuando trabajan largo sobre " +
        "los mismos datos; aquí cada hilo vive unas decenas de microsegundos " +
        "y su trabajo cabe entero. Los 6,2 ms de más van en crear y unir " +
        "hilos, no en fallos de caché."
    }
  },
  {
    id: "conclusion",
    razones: {
      correcta: "Eso es. Antes de tocar el código hay que responder qué se " +
        "reparte, de qué tamaño es cada parte y cómo se asigna a los hilos. " +
        "Tardar lo mismo con cuatro hilos es la señal de que alguna de las " +
        "tres quedó sin responder, como en la fila de 10³ de la tabla.",
      noparalelizable: "La tabla lo desmiente: el mismo programa da 0,06 con " +
        "tareas de 10³ y 3,64 con tareas de 10⁶. El problema sí se " +
        "paraleliza; lo que falla es cómo se partió.",
      nucleos: "La segunda fila alcanza 3,64 con esos mismos cuatro hilos, " +
        "así que la máquina tiene núcleos para los cuatro. Con núcleos de " +
        "sobra el tiempo puede no bajar igual: la primera fila lo muestra.",
      mashilos: "Más hilos con la misma partición agregan más creación, " +
        "planificación y unión: en la primera fila cada hilo ya cuesta más " +
        "que el trabajo que hace. Antes de subir el número hay que revisar " +
        "qué se reparte y de qué tamaño."
    }
  }
];

/* Cada pregunta trae exactamente una clave "correcta" y todas las claves
   llevan texto. Es lo que se comprueba antes de publicar.                 */
function validar(preguntas) {
  if (!Array.isArray(preguntas) || !preguntas.length) { return false; }
  return preguntas.every(function (p) {
    if (!p || typeof p.id !== "string" || !p.id) { return false; }
    var claves = Object.keys(p.razones || {});
    var correctas = claves.filter(function (k) { return k === "correcta"; });
    if (correctas.length !== 1) { return false; }
    return claves.every(function (k) {
      return typeof p.razones[k] === "string" && p.razones[k].trim().length > 0;
    });
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    FILAS: FILAS, TANDAS: TANDAS, PREGUNTAS: PREGUNTAS,
    numeroDeTandas: numeroDeTandas, sobrecosto: sobrecosto, validar: validar
  };
}

if (typeof document !== "undefined") (function () {

  function pintarTabla() {
    var filas = FILAS.map(function (f) {
      var ayuda = f.relacion >= 1;
      return "<tr><td>10<sup>" + f.tamano + "</sup></td>" +
        "<td>" + Motor.num(f.secuencial, 1) + " ms</td>" +
        "<td>" + Motor.num(f.hilos, 1) + " ms</td>" +
        "<td><b style=\"color:" + (ayuda ? "var(--verde)" : "var(--rojo)") +
        "\">" + Motor.num(f.relacion, 2) + "</b></td></tr>";
    }).join("");
    document.getElementById("cuerpo-tabla").innerHTML = filas;
  }

  function pintarChips() {
    Motor.pintarChips("chips-tandas", [
      { texto: "tareas", valor: Motor.num(TANDAS.tareas) },
      { texto: "hilos por tanda", valor: Motor.num(TANDAS.hilosPorTanda) },
      { texto: "tandas", valor: Motor.num(numeroDeTandas(TANDAS)), cuenta: true }
    ]);
  }

  PREGUNTAS.forEach(function (p) {
    Motor.conectarOpciones("opciones-" + p.id, "veredicto-" + p.id, p.razones);
  });

  pintarTabla();
  pintarChips();
})();

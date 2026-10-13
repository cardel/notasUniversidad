if (typeof Motor === "undefined") { var Motor = require("./motor.js"); }

/* Contar los fallos de cache con Valgrind: los contadores de callgrind sobre
   ./bueno (matriz[i][j]) y ./malo (matriz[j][i]), la misma suma de una matriz
   de 10.000 x 10.000 enteros. Las cuentas son enterosPorLinea,
   aciertosPorFallo, fallosIdeales, razonDeFallos, tasaDeFallo,
   fraccionHastaMemoria, pesoDeLaFuncion y vecesLaCache.                     */

var LINEA = 64;          /* bytes de una linea de cache */
var ENTERO = 4;          /* bytes de un int */
var ANCHO = 10000;       /* filas y columnas de la matriz */
var L3 = 32000000;       /* bytes de la L3 de la maquina medida */
var CICLOS_POR_FALLO = 200;  /* costo tipico de un acceso que llega a memoria */

/* Contadores del resumen de callgrind, los dos binarios. */
var CONTADORES = [
  { contador: "I refs (instrucciones)", bueno: 3504816314, malo: 3504816328 },
  { contador: "D refs (accesos a datos)", bueno: 1901594260, malo: 1901594268 },
  { contador: "D1 misses", bueno: 12653756, malo: 118909812 },
  { contador: "D1mr (fallos de lectura)", bueno: 6366206, malo: 112622262 },
  { contador: "D1mw (fallos de escritura)", bueno: 6287550, malo: 6287550 },
  { contador: "LLd misses", bueno: 12518925, malo: 104365640 }
];

/* callgrind_annotate sobre ./malo, y la misma funcion en ./bueno. */
var ANOTACION = [
  { funcion: "sumaMatriz", instrucciones: 48.51, fallosLectura: 112509996 },
  { funcion: "main", instrucciones: 51.36, fallosLectura: 3 }
];

var FALLOS_SUMA_BUENO = 6253939;
var I1_MISSES = 2044;    /* identico en los dos binarios */
var RESULTADO = 999900000000;

function fila(nombre) {
  return CONTADORES.filter(function (f) { return f.contador.indexOf(nombre) === 0; })[0];
}

/* Cuantos enteros caben en una linea de cache. */
function enterosPorLinea(bytesLinea, bytesEntero) { return bytesLinea / bytesEntero; }

/* Recorriendo la linea entera, el primer acceso falla y el resto acierta. */
function aciertosPorFallo(bytesLinea, bytesEntero) {
  return enterosPorLinea(bytesLinea, bytesEntero) - 1;
}

/* Bytes que ocupa la matriz. */
function bytesDeLaMatriz(ancho, bytesEntero) { return ancho * ancho * bytesEntero; }

/* Veces que la matriz excede una cache de este tamano. */
function vecesLaCache(bytes, bytesCache) { return bytes / bytesCache; }

/* Fallos previstos cuando cada linea se usa completa: una linea por cada
   grupo de enterosPorLinea accesos. */
function fallosIdeales(ancho, bytesLinea, bytesEntero) {
  return (ancho * ancho) / enterosPorLinea(bytesLinea, bytesEntero);
}

/* Veces que un conteo de fallos supera al otro. */
function razonDeFallos(fallosMalo, fallosBueno) { return fallosMalo / fallosBueno; }

/* Tasa de fallo en por ciento, a partir de fallos y accesos. */
function tasaDeFallo(fallos, accesos) { return fallos / accesos * 100; }

/* Que parte de los fallos de L1 llega hasta memoria, en por ciento. */
function fraccionHastaMemoria(fallosUltimoNivel, fallosPrimerNivel) {
  return fallosUltimoNivel / fallosPrimerNivel * 100;
}

/* Que parte de un total le toca a una funcion, en por ciento. */
function pesoDeLaFuncion(parte, total) { return parte / total * 100; }

/* Ciclos que se van esperando datos. */
function ciclosPerdidos(fallos, ciclosPorFallo) { return fallos * ciclosPorFallo; }

function fmt(x) { return Motor.num(x); }
function dec1(x) { return Motor.num(x, 1); }
/* Dos decimales siempre, para que 99,90 no se lea como 99,9. */
function dec2(x) {
  var partes = x.toFixed(2).split(".");
  return Motor.num(Number(partes[0])) + "," + partes[1];
}
function pct1(x) { return dec1(x) + " %"; }

var LECTURAS = fila("D1mr");
var ESCRITURAS = fila("D1mw");
var ACCESOS = fila("D refs");
var PRIMER_NIVEL = fila("D1 misses");
var ULTIMO_NIVEL = fila("LLd misses");
var INSTRUCCIONES = fila("I refs");

function explicarEnteros(bien, real) {
  return (bien ? "Correcto. " : "No. ") + "Una línea de " + LINEA + " bytes guarda " +
    LINEA + " / " + ENTERO + " = " + real + " enteros. El hardware nunca trae un entero " +
    "suelto: trae la línea completa, con los " + aciertosPorFallo(LINEA, ENTERO) +
    " vecinos del que se pidió.";
}

function explicarAciertos(bien, real) {
  return (bien ? "Correcto. " : "No. ") + "El primer acceso a la línea falla y la trae; " +
    "los " + real + " siguientes la encuentran en L1. Con ese reparto, las " +
    fmt(ANCHO * ANCHO) + " lecturas de ./bueno deberían costar " +
    fmt(fallosIdeales(ANCHO, LINEA, ENTERO)) + " fallos, y callgrind cuenta " +
    fmt(FALLOS_SUMA_BUENO) + " dentro de sumaMatriz.";
}

function explicarRazon(bien, real, dicho) {
  var texto = "La razón es " + dec1(real) + ": " + fmt(LECTURAS.malo) + " fallos de " +
    "lectura contra " + fmt(LECTURAS.bueno) + ". La cuenta de cabeza da " +
    enterosPorLinea(LINEA, ENTERO) + ", una línea aprovechada entera contra una línea " +
    "por acceso, y la medición queda algo por encima.";
  if (bien) { return "Correcto. " + texto; }
  if (dicho !== undefined && dicho < 2) {
    return "No. " + texto + " Divida el fallo grande por el pequeño, no al revés.";
  }
  return "No. " + texto;
}

var RAZONES_ESCRITURAS = {
  correcta: "Es la explicación. Las dos versiones llenan la matriz en main con el mismo " +
    "ciclo por filas, y lo único que cambia es sumaMatriz, que solo lee. El patrón de " +
    "escritura queda intacto y el contador sale igual hasta el último dígito: " +
    fmt(ESCRITURAS.bueno) + " en los dos, cerca de los " +
    fmt(fallosIdeales(ANCHO, LINEA, ENTERO)) + " que se esperan al escribir " +
    fmt(bytesDeLaMatriz(ANCHO, ENTERO)) + " bytes en líneas de " + LINEA + ".",
  valgrind: "No. callgrind reporta lectura y escritura por separado: D1mr y D1mw son dos " +
    "contadores distintos y los dos están en la tabla. Si no los separara, no se podría " +
    "ver que la diferencia entre los binarios está toda del lado de la lectura.",
  aciertan: "No. Una escritura falla igual que una lectura cuando la línea no está en " +
    "caché, y hay que traerla antes de modificarla. De los " + fmt(PRIMER_NIVEL.bueno) +
    " fallos de ./bueno, " + fmt(ESCRITURAS.bueno) + " son de escritura: casi la mitad.",
  casualidad: "No. callgrind simula la caché en vez de leer los contadores del " +
    "procesador, así que cuenta accesos y líneas sin el ruido de otros procesos. Repetir " +
    "la corrida devuelve otra vez " + fmt(ESCRITURAS.bueno) + ", y por eso dos números " +
    "iguales ahí significan mismo patrón, no suerte."
};

var RAZONES_TASA = {
  correcta: "Es la lectura correcta. Una tasa se mira junto al número de accesos: " +
    pct1(tasaDeFallo(PRIMER_NIVEL.malo, ACCESOS.malo)) + " de " + fmt(ACCESOS.malo) +
    " accesos son " + fmt(PRIMER_NIVEL.malo) + " fallos de L1, " + fmt(LECTURAS.malo) +
    " de ellos de lectura. De ahí, " + fmt(ULTIMO_NIVEL.malo) + " bajan hasta memoria, " +
    "del orden de " + CICLOS_POR_FALLO + " ciclos cada uno: unos " +
    dec1(ciclosPerdidos(ULTIMO_NIVEL.malo, CICLOS_POR_FALLO) / 1e9) + " mil millones de " +
    "ciclos esperando datos.",
  despreciable: "No. El porcentaje es chico y el número no: sobre " + fmt(ACCESOS.malo) +
    " accesos, " + pct1(tasaDeFallo(PRIMER_NIVEL.malo, ACCESOS.malo)) + " son " +
    fmt(PRIMER_NIVEL.malo) + " fallos. La tasa sola no dice cuánto cuesta.",
  umbral: "No. No hay umbral que separe lo grave de lo leve. Con suficientes accesos " +
    "una tasa del 1 % ya domina el tiempo, y en un programa con pocos accesos un 30 % " +
    "no se alcanza a notar. Lo que decide es el producto de tasa por accesos.",
  instrucciones: "No. Las instrucciones casi no cambian entre los dos binarios: " +
    fmt(INSTRUCCIONES.bueno) + " contra " + fmt(INSTRUCCIONES.malo) + ", " +
    (INSTRUCCIONES.malo - INSTRUCCIONES.bueno) + " de diferencia. El procesador ejecuta " +
    "el mismo trabajo en los dos; lo que cambia es cuánto espera."
};

var RAZONES_FUNCION = {
  correcta: "Es lo que dicen las dos columnas. sumaMatriz carga con " +
    dec2(ANOTACION[0].instrucciones) + " % de las instrucciones y " +
    dec2(pesoDeLaFuncion(ANOTACION[0].fallosLectura, LECTURAS.malo)) + " % de los fallos " +
    "de lectura, " + fmt(ANOTACION[0].fallosLectura) + " de " + fmt(LECTURAS.malo) +
    ". El perfilador señala la función antes de que nadie lea una línea del programa.",
  main: "No. main tiene más instrucciones, " + dec2(ANOTACION[1].instrucciones) + " %, y " +
    ANOTACION[1].fallosLectura + " fallos de lectura: inicializa la matriz por filas y " +
    "aprovecha cada línea. Acelerar una función que no falla no mueve el tiempo del " +
    "programa, porque el tiempo se está yendo en los fallos de la otra.",
  coincidir: "No. Un porcentaje reparte instrucciones y el otro reparte fallos; nada los " +
    "obliga a coincidir. La diferencia entre " + dec2(ANOTACION[0].instrucciones) + " % y " +
    dec2(pesoDeLaFuncion(ANOTACION[0].fallosLectura, LECTURAS.malo)) + " % es " +
    "justamente lo que localiza el problema: la mitad del trabajo concentra todos los fallos.",
  medicion: "No. Las dos columnas son conteos de la misma simulación y suman lo que " +
    "reporta el resumen: " + fmt(ANOTACION[0].fallosLectura) + " más " +
    ANOTACION[1].fallosLectura + " fallos de lectura contra " + fmt(LECTURAS.malo) +
    " del total. Una función puede concentrar los fallos sin concentrar las instrucciones."
};

var RAZONES_CIERRE = {
  correcta: "Es para lo que sirve. callgrind compara patrones de acceso y apunta a la " +
    "función que falla, y eso no cambia con la carga de la máquina ni con el reloj: dos " +
    "corridas de la simulación son comparables entre sí. El tiempo absoluto se mide " +
    "después, con el binario sin instrumentar.",
  tiempos: "No. Los números de callgrind son accesos y fallos simulados, no " +
    "microsegundos. Un modelo de caché de dos niveles no reproduce la predicción de " +
    "saltos ni el prefetch del procesador real, así que un tiempo derivado de ahí no " +
    "sirve para reportar.",
  reemplaza: "No. perf lee los contadores del hardware mientras el programa corre a " +
    "velocidad normal, y responde qué tan rápido fue; callgrind responde por qué. Las " +
    "dos herramientas se usan en orden, no una en lugar de la otra.",
  inutil: "No. Correr diez veces más lento es el precio de contar cada acceso a memoria, " +
    "y se paga una vez, en una corrida de diagnóstico con una entrada más pequeña. Lo " +
    "que se saca de ahí es la función culpable, que no aparece en un cronómetro."
};

function iniciar() {
  var vista = false;   /* la tabla de contadores se destapa al pedirlo */

  function pintarContadores() {
    var filas = CONTADORES.map(function (f) {
      var celda = vista ? "<td>" + fmt(f.malo) + "</td>" : "<td class=\"pend\">?</td>";
      return "<tr><td style=\"text-align:left\">" + f.contador + "</td><td>" +
        fmt(f.bueno) + "</td>" + celda + "</tr>";
    });
    filas.push("<tr><td style=\"text-align:left\">D1 miss rate</td><td>" +
      pct1(tasaDeFallo(PRIMER_NIVEL.bueno, ACCESOS.bueno)) + "</td>" +
      (vista ? "<td>" + pct1(tasaDeFallo(PRIMER_NIVEL.malo, ACCESOS.malo)) + "</td>"
             : "<td class=\"pend\">?</td>") + "</tr>");
    document.getElementById("cuerpo-contadores").innerHTML = filas.join("");
    Motor.pintarChips("chips-contadores", [
      { texto: "enteros por línea", valor: enterosPorLinea(LINEA, ENTERO), cuenta: true },
      { texto: "aciertos por fallo", valor: aciertosPorFallo(LINEA, ENTERO), cuenta: true },
      { texto: "fallos previstos en ./bueno",
        valor: fmt(fallosIdeales(ANCHO, LINEA, ENTERO)) },
      { texto: "fallos de lectura en sumaMatriz de ./bueno",
        valor: vista ? fmt(FALLOS_SUMA_BUENO) : "?" }
    ]);
  }

  function pintarAnotacion() {
    document.getElementById("cuerpo-anotacion").innerHTML = ANOTACION.map(function (f) {
      return "<tr><td style=\"text-align:left\"><code>" + f.funcion + "</code></td><td>" +
        dec2(f.instrucciones) + " %</td><td>" + fmt(f.fallosLectura) + "</td><td>" +
        dec2(pesoDeLaFuncion(f.fallosLectura, LECTURAS.malo)) + " %</td></tr>";
    }).join("");
  }

  Motor.conectarPrediccion(
    { entrada: "pred-enteros", boton: "btn-enteros", veredicto: "ver-enteros" },
    function () { return enterosPorLinea(LINEA, ENTERO); },
    explicarEnteros);

  Motor.conectarPrediccion(
    { entrada: "pred-aciertos", boton: "btn-aciertos", veredicto: "ver-aciertos" },
    function () { return aciertosPorFallo(LINEA, ENTERO); },
    explicarAciertos);

  document.getElementById("btn-destapar").addEventListener("click", function () {
    vista = true;
    pintarContadores();
    document.getElementById("nota-contadores").hidden = false;
  });

  Motor.conectarPrediccion(
    { entrada: "pred-razon", boton: "btn-razon", veredicto: "ver-razon" },
    function () { return razonDeFallos(LECTURAS.malo, LECTURAS.bueno); },
    explicarRazon);

  document.getElementById("btn-razon").addEventListener("click", function () {
    Motor.pintarChips("chips-razon", [
      { texto: "veces más fallos de lectura",
        valor: dec1(razonDeFallos(LECTURAS.malo, LECTURAS.bueno)), cuenta: true },
      { texto: "la matriz en veces la L3",
        valor: dec1(vecesLaCache(bytesDeLaMatriz(ANCHO, ENTERO), L3)) },
      { texto: "fallos de L1 que llegan a memoria en ./malo",
        valor: dec1(fraccionHastaMemoria(ULTIMO_NIVEL.malo, PRIMER_NIVEL.malo)) + " %" }
    ]);
    document.getElementById("nota-razon").hidden = false;
  });

  Motor.conectarOpciones("op-escrituras", "ver-escrituras", RAZONES_ESCRITURAS);
  Motor.conectarOpciones("op-tasa", "ver-tasa", RAZONES_TASA);
  Motor.conectarOpciones("op-funcion", "ver-funcion", RAZONES_FUNCION);
  Motor.conectarOpciones("op-cierre", "ver-cierre", RAZONES_CIERRE);

  pintarContadores();
  pintarAnotacion();
}

if (typeof document !== "undefined") { iniciar(); }

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    LINEA: LINEA, ENTERO: ENTERO, ANCHO: ANCHO, L3: L3,
    CICLOS_POR_FALLO: CICLOS_POR_FALLO, CONTADORES: CONTADORES, ANOTACION: ANOTACION,
    FALLOS_SUMA_BUENO: FALLOS_SUMA_BUENO, I1_MISSES: I1_MISSES, RESULTADO: RESULTADO,
    fila: fila, enterosPorLinea: enterosPorLinea, aciertosPorFallo: aciertosPorFallo,
    bytesDeLaMatriz: bytesDeLaMatriz, vecesLaCache: vecesLaCache,
    fallosIdeales: fallosIdeales, razonDeFallos: razonDeFallos, tasaDeFallo: tasaDeFallo,
    fraccionHastaMemoria: fraccionHastaMemoria, pesoDeLaFuncion: pesoDeLaFuncion,
    ciclosPerdidos: ciclosPerdidos,
    explicarEnteros: explicarEnteros, explicarAciertos: explicarAciertos,
    explicarRazon: explicarRazon,
    RAZONES_ESCRITURAS: RAZONES_ESCRITURAS, RAZONES_TASA: RAZONES_TASA,
    RAZONES_FUNCION: RAZONES_FUNCION, RAZONES_CIERRE: RAZONES_CIERRE
  };
}

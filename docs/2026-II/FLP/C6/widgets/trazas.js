/* Trazas completas de procedimientos recursivos. Se predice el valor y los
   conteos, y al comprobar la página abre la traza con el ambiente de cada
   paso, la cadena de ambientes en su punto más hondo y cada clausura con el
   marco que capturó. */
var PREDICCIONES = [
  {
    id: "trazas-dos-parametros",
    titulo: "1. Dos parámetros, uno que baja y otro que acumula",
    enunciado:
      "El primer parámetro cuenta hacia atrás y el segundo se va " +
      "duplicando. ¿Cuánto vale, cuántos ambientes se crean y cuántas " +
      "llamadas a <code>value-of</code> hay?",
    programa: "letrec h(a,b) = if ==(a,0) then b else (h sub1(a) *(b,2)) in (h 3 1)",
    campos: ["valor", "ambientes", "valueOf"],
    pista:
      "Los ambientes son el marco recursivo más uno por llamada, y las " +
      "llamadas son cuatro: a vale 3, 2, 1 y 0. Cada ambiente de llamada " +
      "liga los dos parámetros a la vez, porque la aplicación extiende con " +
      "la lista completa."
  },
  {
    id: "trazas-acumulador",
    titulo: "2. El resultado llega armado al caso base",
    enunciado:
      "Aquí la suma se hace al bajar, no al subir: cuando <code>n</code> " +
      "llega a 0 el total ya está en <code>t</code>. ¿Cuánto vale, cuántas " +
      "variables se evalúan y cuántos procedimientos se aplican?",
    programa: "letrec acum(n,t) = if ==(n,0) then t else (acum sub1(n) +(t,n)) in (acum 3 0)",
    campos: ["valor", "variables", "applyProc"],
    pista:
      "Cuente las variables de cada vuelta: la prueba usa n, la rama else usa " +
      "acum, n, t y n otra vez. La última vuelta solo evalúa n y t. El valor " +
      "sale del caso base sin ninguna operación pendiente encima."
  },
  {
    id: "trazas-parametro-tapa",
    titulo: "3. El parámetro tapa una ligadura de afuera",
    enunciado:
      "Hay un <code>n</code> ligado a 9 antes del <code>letrec</code>, y el " +
      "procedimiento tiene un parámetro que se llama igual. ¿Cuánto vale, " +
      "cuántos ambientes se crean y cuántas clausuras?",
    programa: "let n = 9 in letrec f(n) = if ==(n,0) then 0 else (f sub1(n)) in (f 2)",
    campos: ["valor", "ambientes", "clausuras"],
    pista:
      "El ambiente del parámetro es el eslabón más nuevo de la cadena, así " +
      "que la búsqueda de n lo encuentra ahí y nunca llega al eslabón del " +
      "let. El 9 sigue en la cadena y nadie lo alcanza."
  },
  {
    id: "trazas-libre-despues",
    titulo: "4. Una variable libre que se liga después",
    enunciado:
      "El cuerpo del procedimiento nombra <code>y</code>, y hay un " +
      "<code>let y = 50</code> entre la declaración y la llamada. El " +
      "ambiente inicial también liga <code>y</code>, con 2. ¿Cuánto vale el " +
      "programa y cuántas clausuras se crean?",
    programa: "letrec f(n) = if ==(n,0) then y else (f sub1(n)) in let y = 50 in (f 1)",
    campos: ["valor", "clausuras"],
    pista:
      "La clausura que fabrica apply-env captura el marco recursivo, y ese " +
      "marco cuelga del ambiente de antes del let. El eslabón con y = 50 se " +
      "creó después y queda fuera de esa cadena, así que la y que se " +
      "encuentra es la del ambiente inicial."
  }
];

var EJEMPLOS = [
  "letrec h(a,b) = if ==(a,0) then b else (h sub1(a) *(b,2)) in (h 3 1)",
  "letrec acum(n,t) = if ==(n,0) then t else (acum sub1(n) +(t,n)) in (acum 3 0)",
  "let n = 9 in letrec f(n) = if ==(n,0) then 0 else (f sub1(n)) in (f 2)",
  "letrec f(n) = if ==(n,0) then y else (f sub1(n)) in let y = 50 in (f 1)"
];

if (typeof module !== "undefined") { module.exports = { PREDICCIONES: PREDICCIONES, EJEMPLOS: EJEMPLOS }; }

if (typeof document !== "undefined") {
  MotorClausuras.montar({ interprete: InterpreteRecursivos, predicciones: PREDICCIONES,
                          destino: "predicciones", libre: "libre", ejemplos: EJEMPLOS });
}

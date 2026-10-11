/* Generación diferida de clausuras. Cinco programas con el mismo
   procedimiento declarado y distinto uso, para separar tres cuentas que
   suelen confundirse: cuántas declaraciones hay, cuántas clausuras se
   fabrican y cuántos procedimientos se aplican. */
var PREDICCIONES = [
  {
    id: "diferida-sin-consultar",
    titulo: "1. Un procedimiento declarado y nunca nombrado",
    enunciado:
      "El <code>letrec</code> declara <code>f</code> y el cuerpo no lo " +
      "menciona. ¿Cuánto vale el programa, cuántos ambientes se crean y " +
      "cuántas clausuras?",
    programa: "letrec f(n) = *(n,2) in 7",
    campos: ["valor", "ambientes", "clausuras"],
    pista:
      "El marco recursivo se construye siempre: guarda el nombre, la lista de " +
      "parámetros y el cuerpo sin evaluar. La clausura es otra cosa, y la " +
      "fabrica apply-env cuando alguien consulta el nombre."
  },
  {
    id: "diferida-el-valor",
    titulo: "2. El nombre, sin aplicarlo",
    enunciado:
      "Ahora el cuerpo del <code>letrec</code> es el nombre a secas. ¿Cuánto " +
      "vale el programa, cuántas clausuras se crean y cuántos " +
      "procedimientos se aplican?",
    programa: "letrec f(n) = *(n,2) in f",
    campos: ["valor", "clausuras", "applyProc"],
    pista:
      "Consultar el nombre ya fabrica la clausura, y el valor del programa es " +
      "esa clausura. Aplicar es un paso aparte que aquí no ocurre: el " +
      "programa no tiene ningún paréntesis de aplicación."
  },
  {
    id: "diferida-una-consulta",
    titulo: "3. Consultado una vez, aplicado una vez",
    enunciado:
      "El <code>let</code> guarda en <code>g</code> lo que vale <code>f</code>, " +
      "y después aplica <code>g</code>. ¿Cuánto vale, cuántas clausuras se " +
      "crean y cuántos procedimientos se aplican?",
    programa: "letrec f(n) = *(n,2) in let g = f in (g 5)",
    campos: ["valor", "clausuras", "applyProc"],
    pista:
      "El nombre f se consulta una sola vez, en la parte derecha del let. " +
      "Después g está en un marco simple que ya guarda la clausura, así que " +
      "consultar g no fabrica nada nuevo."
  },
  {
    id: "diferida-dos-consultas",
    titulo: "4. El mismo procedimiento, dos llamadas",
    enunciado:
      "Dos aplicaciones del mismo procedimiento, sin recursión de por medio. " +
      "¿Cuánto vale, cuántas clausuras y cuántas aplicaciones?",
    programa: "letrec doble(n) = *(n,2) in +((doble 3), (doble 4))",
    campos: ["valor", "clausuras", "applyProc"],
    pista:
      "Hay una declaración y dos consultas del nombre, una por aplicación. " +
      "Las dos clausuras que salen son iguales campo por campo y capturan el " +
      "mismo marco; lo que las separa es que se fabricaron en momentos " +
      "distintos."
  },
  {
    id: "diferida-recursiva",
    titulo: "5. Cada nivel consulta otra vez",
    enunciado:
      "Una recursión que baja de 3 a 0. ¿Cuánto vale, cuántas clausuras se " +
      "crean, cuántos procedimientos se aplican y cuántas variables se " +
      "evalúan?",
    programa: "letrec cuenta(n) = if ==(n,0) then 0 else add1((cuenta sub1(n))) in (cuenta 3)",
    campos: ["valor", "clausuras", "applyProc", "variables"],
    pista:
      "La clausura no se guarda en ninguna parte: el marco recursivo sigue " +
      "guardando parámetros y cuerpos, así que cada vez que el cuerpo nombra " +
      "a cuenta se fabrica una nueva. Cuente las llamadas, la de arriba " +
      "incluida."
  }
];

var EJEMPLOS = [
  "letrec f(n) = *(n,2) in 7",
  "letrec f(n) = *(n,2) in f",
  "letrec doble(n) = *(n,2) in +((doble 3), (doble 4))",
  "letrec fib(n) = if <(n,2) then n else +((fib sub1(n)), (fib -(n,2))) in (fib 5)"
];

if (typeof module !== "undefined") { module.exports = { PREDICCIONES: PREDICCIONES, EJEMPLOS: EJEMPLOS }; }

if (typeof document !== "undefined") {
  MotorClausuras.montar({ interprete: InterpreteRecursivos, predicciones: PREDICCIONES,
                          destino: "predicciones", libre: "libre", ejemplos: EJEMPLOS });
}

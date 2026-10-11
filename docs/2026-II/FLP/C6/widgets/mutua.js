/* Recursión mutua: varios procedimientos declarados en un mismo letrec que
   se nombran entre sí. Un solo marco guarda las tres listas paralelas, y por
   eso cada cuerpo encuentra a los demás. */
var PREDICCIONES = [
  {
    id: "mutua-sube-baja",
    titulo: "1. Dos que se llaman alternándose",
    enunciado:
      "<code>sube</code> llama a <code>baja</code> y <code>baja</code> llama " +
      "a <code>sube</code>, y los dos casos base devuelven cosas distintas. " +
      "La llamada empieza en <code>sube</code> con 5. ¿Cuánto vale, cuántos " +
      "ambientes se crean y cuántas clausuras?",
    programa: "letrec sube(n) = if ==(n,0) then 0 else (baja sub1(n)) baja(n) = if ==(n,0) then 100 else (sube sub1(n)) in (sube 5)",
    campos: ["valor", "ambientes", "clausuras"],
    pista:
      "Siga quién tiene el turno en cada paso: con 5 lo tiene sube, con 4 " +
      "baja, con 3 sube. El que recibe el 0 es el que decide el valor. Los " +
      "ambientes son un marco recursivo y uno por llamada."
  },
  {
    id: "mutua-el-otro-turno",
    titulo: "2. El mismo programa desde el otro",
    enunciado:
      "Las dos declaraciones no cambian; cambia por dónde empieza. ¿Cuánto " +
      "vale, cuántas clausuras se crean y cuántos procedimientos se aplican?",
    programa: "letrec sube(n) = if ==(n,0) then 0 else (baja sub1(n)) baja(n) = if ==(n,0) then 100 else (sube sub1(n)) in (baja 1)",
    campos: ["valor", "clausuras", "applyProc"],
    pista:
      "Dos clausuras, y no son de un mismo procedimiento: una de baja y una " +
      "de sube. El marco recursivo tiene las dos declaraciones y apply-env " +
      "fabrica la que se le pida."
  },
  {
    id: "mutua-tres-en-cadena",
    titulo: "3. Tres declaraciones, ninguna recursiva",
    enunciado:
      "<code>uno</code> llama a <code>dos</code>, <code>dos</code> llama a " +
      "<code>tres</code> y <code>tres</code> calcula. Ninguno se llama a sí " +
      "mismo. ¿Cuánto vale, cuántos ambientes se crean y cuántas clausuras?",
    programa: "letrec uno(n) = (dos n) dos(n) = (tres n) tres(n) = *(n,n) in (uno 4)",
    campos: ["valor", "ambientes", "clausuras"],
    pista:
      "Tres declaraciones no son tres marcos: el <code>arbno</code> de la " +
      "gramática entrega los nombres, los parámetros y los cuerpos como tres " +
      "listas paralelas, y el marco recursivo es uno solo con esas tres " +
      "listas adentro."
  },
  {
    id: "mutua-par-impar",
    titulo: "4. La paridad sin dividir",
    enunciado:
      "Cada uno quita 1 y le pasa el turno al otro; el primero en recibir el " +
      "0 responde. ¿Cuánto vale, cuántas variables se evalúan y cuántos " +
      "procedimientos se aplican?",
    programa: "letrec par(n) = if ==(n,0) then 1 else (impar sub1(n)) impar(n) = if ==(n,0) then 0 else (par sub1(n)) in (par 3)",
    campos: ["valor", "variables", "applyProc"],
    pista:
      "Cuente las variables de cada vuelta: la prueba usa n, y la rama else " +
      "usa el nombre del otro procedimiento y n otra vez. La vuelta final " +
      "solo evalúa n."
  }
];

var EJEMPLOS = [
  "letrec sube(n) = if ==(n,0) then 0 else (baja sub1(n)) baja(n) = if ==(n,0) then 100 else (sube sub1(n)) in (sube 5)",
  "letrec uno(n) = (dos n) dos(n) = (tres n) tres(n) = *(n,n) in (uno 4)",
  "letrec par(n) = if ==(n,0) then 1 else (impar sub1(n)) impar(n) = if ==(n,0) then 0 else (par sub1(n)) in (par 3)",
  "letrec in +(x,1)"
];

if (typeof module !== "undefined") { module.exports = { PREDICCIONES: PREDICCIONES, EJEMPLOS: EJEMPLOS }; }

if (typeof document !== "undefined") {
  MotorClausuras.montar({ interprete: InterpreteRecursivos, predicciones: PREDICCIONES,
                          destino: "predicciones", libre: "libre", ejemplos: EJEMPLOS });
}

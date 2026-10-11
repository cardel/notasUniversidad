/* El procedimiento que no se encuentra a sí mismo. Cinco programas donde la
   recursión se intenta con let y proc: uno funciona porque nunca se aplica,
   otro se detiene, otro da un resultado creíble y equivocado, y el de letrec
   da lo que se esperaba. Las respuestas se calculan corriendo el
   interpretador sobre el programa que ve el estudiante. */
var PREDICCIONES = [
  {
    id: "encuentra-sin-aplicar",
    titulo: "1. El cuerpo que nombra algo que no existe",
    enunciado:
      "El cuerpo del procedimiento nombra <code>g</code>, y <code>g</code> " +
      "todavía no está ligado cuando se construye la clausura. El programa " +
      "no lo aplica. ¿Cuánto vale, cuántas clausuras se crean y cuántos " +
      "procedimientos se aplican?",
    programa: "let g = proc(n) if ==(n,0) then 0 else (g sub1(n)) in 7",
    campos: ["valor", "clausuras", "applyProc"],
    pista:
      "Construir una clausura no evalúa su cuerpo: guarda los parámetros, el " +
      "texto del cuerpo y el ambiente de ese momento. La variable libre se " +
      "busca al aplicar, y aquí nadie aplica nada."
  },
  {
    id: "encuentra-se-detiene",
    titulo: "2. El mismo procedimiento, ahora aplicado",
    enunciado:
      "Cambia una sola cosa: el cuerpo del <code>let</code>. ¿Cuánto vale " +
      "ahora el programa?",
    programa: "let g = proc(n) if ==(n,0) then 0 else (g sub1(n)) in (g 3)",
    campos: ["valor"],
    seDetiene: true,
    pista:
      "Mire en qué ambiente se evalúa el cuerpo de la clausura: cuelga del " +
      "que la clausura capturó, y ese es el ambiente de antes del " +
      "<code>let</code>. El eslabón que liga g se creó después."
  },
  {
    id: "encuentra-letrec",
    titulo: "3. El mismo cuerpo con letrec",
    enunciado:
      "Idéntico al anterior salvo la forma que declara el procedimiento. " +
      "¿Cuánto vale, cuántas clausuras se crean y cuántos procedimientos se " +
      "aplican?",
    programa: "letrec g(n) = if ==(n,0) then 0 else (g sub1(n)) in (g 3)",
    campos: ["valor", "clausuras", "applyProc"],
    pista:
      "Las clausuras no se cuentan por declaración sino por consulta del " +
      "nombre: cada vez que el cuerpo nombra a g, apply-env fabrica una. " +
      "Cuente las llamadas, incluida la primera."
  },
  {
    id: "encuentra-sombra",
    titulo: "4. Dos procedimientos con el mismo nombre",
    enunciado:
      "El de afuera devuelve 1 para cualquier argumento. El de adentro " +
      "intenta ser el factorial y nombra <code>fact</code> en su cuerpo. El " +
      "programa no se detiene: da un número. ¿Cuál, y cuántos procedimientos " +
      "se aplican?",
    programa: "let fact = proc(n) 1 in let fact = proc(n) if ==(n,0) then 1 else *(n, (fact sub1(n))) in (fact 3)",
    campos: ["valor", "applyProc"],
    pista:
      "El <code>fact</code> que nombra el cuerpo de adentro se busca en el " +
      "ambiente que esa clausura capturó, donde fact ya existe: es el de " +
      "afuera. Así que la llamada recursiva no vuelve al mismo " +
      "procedimiento, y la recursión se corta en el primer paso."
  },
  {
    id: "encuentra-hacia-atras",
    titulo: "5. Un procedimiento que nombra a otro",
    enunciado:
      "Aquí la variable libre del segundo cuerpo es el nombre del primer " +
      "procedimiento, declarado antes. ¿Cuánto vale y cuántas clausuras se " +
      "crean?",
    programa: "let g = proc(n) 0 in let h = proc(n) (g n) in (h 5)",
    campos: ["valor", "clausuras"],
    pista:
      "La clausura de h captura un ambiente donde g ya está ligada, porque " +
      "su let es anterior. Nombrar hacia atrás funciona con let y proc; lo " +
      "que no funciona es nombrarse a sí mismo o nombrar hacia adelante."
  }
];

var EJEMPLOS = [
  "let g = proc(n) if ==(n,0) then 0 else (g sub1(n)) in (g 3)",
  "letrec g(n) = if ==(n,0) then 0 else (g sub1(n)) in (g 3)",
  "let fact = proc(n) 1 in let fact = proc(n) if ==(n,0) then 1 else *(n, (fact sub1(n))) in (fact 3)",
  "letrec fact(n) = if ==(n,0) then 1 else *(n, (fact sub1(n))) in (fact 3)"
];

if (typeof module !== "undefined") { module.exports = { PREDICCIONES: PREDICCIONES, EJEMPLOS: EJEMPLOS }; }

if (typeof document !== "undefined") {
  MotorClausuras.montar({ interprete: InterpreteRecursivos, predicciones: PREDICCIONES,
                          destino: "predicciones", libre: "libre", ejemplos: EJEMPLOS });
}

/* Procedimientos en acción. Se predice qué hace el interpretador y después
   se abre el proceso: la traza, la cadena de ambientes y las clausuras con
   el ambiente que cada una capturó. Al final, la máquina abierta. */
var PREDICCIONES = [
  {
    id: "proc-anidado",
    titulo: "1. Un procedimiento aplicado dos veces",
    enunciado:
      "El ambiente inicial liga <code>x = 4</code>, <code>y = 2</code>, " +
      "<code>z = 5</code> sobre otro eslabón con <code>a = 4</code>, " +
      "<code>b = 5</code>, <code>c = 6</code>. ¿Cuánto da, cuántas veces se " +
      "aplica un procedimiento y cuántos ambientes se crean?",
    programa: "let doble = proc(n) *(n,2) in (doble (doble z))",
    campos: ["valor", "applyProc", "ambientes"],
    pista:
      "Cada aplicación crea su propio ambiente con el parámetro ligado, " +
      "aunque sea el mismo procedimiento el que se aplica. El let también " +
      "crea el suyo."
  },
  {
    id: "proc-como-argumento",
    titulo: "2. Un procedimiento que recibe otro",
    enunciado:
      "Un procedimiento es un valor, así que puede viajar como argumento. " +
      "Aquí <code>aplica</code> recibe a <code>inc</code> y lo usa dos veces.",
    programa: "let aplica = proc(f,n) (f (f n)) in let inc = proc(k) add1(k) in (aplica inc 7)",
    campos: ["valor", "applyProc", "clausuras"],
    pista:
      "Cuente las clausuras que se construyen —una por cada proc evaluado— " +
      "y las aplicaciones, que son otra cosa: aplica una vez e inc dos."
  },
  {
    id: "proc-devuelve-proc",
    titulo: "3. Un procedimiento que devuelve otro",
    enunciado:
      "El cuerpo de <code>hacer</code> es a su vez un <code>proc</code>. La " +
      "clausura que devuelve recuerda el <code>a</code> de la llamada, " +
      "aunque esa llamada ya terminó.",
    programa: "let hacer = proc(a) proc(b) *(a,b) in let por3 = (hacer 3) in +((por3 x), (por3 y))",
    campos: ["valor", "applyProc", "clausuras"],
    pista:
      "hacer se aplica una vez y por3 dos. La clausura de por3 guarda el " +
      "ambiente donde a vale 3, y ese ambiente sigue vivo mientras ella lo " +
      "guarde."
  },
  {
    id: "proc-libre",
    titulo: "4. Una variable libre que cambia después",
    enunciado:
      "El cuerpo de <code>p</code> menciona <code>y</code>, y más abajo hay " +
      "otra <code>y</code>. Prediga el valor con la regla del lenguaje.",
    programa: "let p = proc(u) +(u,y) in let y = 100 in (p 1)",
    campos: ["valor", "ambientes", "variables"],
    pista:
      "El cuerpo se evalúa en el ambiente que la clausura capturó, no en el " +
      "de la llamada. Mire el diagrama al abrir el proceso: el ambiente del " +
      "parámetro cuelga del que tenía la clausura."
  }
];

var EJEMPLOS = [
  "let doble = proc(n) *(n,2) in (doble (doble z))",
  "let hacer = proc(a) proc(b) *(a,b) in let por3 = (hacer 3) in (por3 x)",
  "(proc(u) *(u,3) 5)",
  "let f = proc(u) (g u) in 7",
  "(3 4)",
  "let f = proc(u,v) +(u,v) in (f 1)"
];

if (typeof module !== "undefined") { module.exports = { PREDICCIONES: PREDICCIONES, EJEMPLOS: EJEMPLOS }; }

if (typeof document !== "undefined") {
  MotorClausuras.montar({ predicciones: PREDICCIONES, destino: "predicciones",
                          libre: "libre", ejemplos: EJEMPLOS });
}

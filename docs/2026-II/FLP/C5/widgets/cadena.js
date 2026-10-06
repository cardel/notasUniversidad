/* La cadena de ambientes. Se predice cuántos eslabones crea un programa y
   qué devuelve, y después la página muestra la traza con el ambiente de
   cada paso y la cadena dibujada. */
var PREDICCIONES = [
  {
    id: "cadena-tres-lets",
    titulo: "1. Tres eslabones y un nombre repetido",
    enunciado:
      "El ambiente inicial liga <code>x = 4</code>, <code>y = 2</code>, " +
      "<code>z = 5</code> sobre otro eslabón con <code>a = 4</code>, " +
      "<code>b = 5</code>, <code>c = 6</code>. ¿Cuánto vale el programa, " +
      "cuántos ambientes crea y cuántas variables se evalúan?",
    programa: "let a = 3 in let b = *(a,a) in let a = +(a,b) in -(a,b)",
    campos: ["valor", "ambientes", "variables"],
    pista:
      "Cada let crea un eslabón, aunque ligue un nombre que ya existía: aquí " +
      "hay dos ligaduras de a y las dos conviven. Una variable se cuenta " +
      "cada vez que se evalúa, no una vez por nombre."
  },
  {
    id: "cadena-de-paso",
    titulo: "2. El ambiente que aparece y desaparece",
    enunciado:
      "La primera parte derecha es a su vez un <code>let</code>. Ese " +
      "<code>let</code> crea su ambiente, pero no se queda en la cadena " +
      "principal. ¿Cuánto da y cuántos ambientes se crean contando ese?",
    programa: "let s = let u = 2 v = 3 in *(u,v) t = add1(z) in +(s,t)",
    campos: ["valor", "ambientes", "valueOf"],
    pista:
      "El ambiente de paso existe mientras se calcula s y después nadie lo " +
      "alcanza, pero se creó: cuenta. Lo que sobrevive de él es el valor, " +
      "no sus ligaduras."
  },
  {
    id: "cadena-con-if",
    titulo: "3. Una rama que no se recorre",
    enunciado:
      "Aquí hay un <code>if</code> dentro de la cadena. Recuerde que solo " +
      "se evalúa una de las dos ramas, y que eso cambia la cuenta.",
    programa: "let m = +(x,y) n = *(x,y) in let d = -(m,n) in if <(d,0) then -(n,m) else d",
    campos: ["valor", "variables", "valueOf"],
    pista:
      "Cuente primero cuánto vale d y qué rama se toma; las variables de la " +
      "rama que no se visita no se evalúan y no se cuentan."
  }
];

var EJEMPLOS = [
  "let a = 3 in let b = *(a,a) in let a = +(a,b) in -(a,b)",
  "let x = 1 in let x = +(x,1) w = *(x,10) in +(x,w)",
  "let t = let p = 3 q = 4 in *(p,q) in +(t,y)",
  "let p = 10 q = add1(p) in -(q,p)"
];

if (typeof module !== "undefined") { module.exports = { PREDICCIONES: PREDICCIONES, EJEMPLOS: EJEMPLOS }; }

if (typeof document !== "undefined") {
  MotorClausuras.montar({ predicciones: PREDICCIONES, destino: "predicciones",
                          libre: "libre", ejemplos: EJEMPLOS });
}

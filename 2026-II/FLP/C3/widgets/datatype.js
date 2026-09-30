/* ¿Compila este datatype? Declaraciones con define-datatype, unas bien y
   otras con el error que aparece en cada semestre, y después lo que los
   constructores aceptan y lo que rechazan. Lo que se juzga es lo que DrRacket
   responde. */
var BLOQUES = (function () {
  "use strict";
  return [
    {
      id: "compila",
      titulo: "1. ¿DrRacket acepta la declaración?",
      definicion:
        "(define-datatype tipo tipo?\n" +
        "  (variante (campo predicado) ...)\n" +
        "  ...)",
      explicacion:
        "La forma general está arriba. Para cada declaración, decida si " +
        "DrRacket la compila o la rechaza. Cuando la rechaza, la razón dice " +
        "qué mensaje sale.",
      opciones: ["Compila", "No compila"],
      items: [
        { valor: "<code>(define-datatype punto punto?<br>&nbsp;&nbsp;(un-punto (x number?) (y number?)))</code>", correcta: 0,
          razon: "Un tipo, su predicado, una variante con dos campos y sus predicados. Es la forma completa y no le falta nada." },
        { valor: "<code>(define-datatype cmd cmd?<br>&nbsp;&nbsp;(avanza (n number?))<br>&nbsp;&nbsp;(cmd (dir symbol?)))</code>", correcta: 1,
          razon: "La segunda variante se llama igual que el tipo, y define-datatype define las dos como identificadores: DrRacket responde identifier already defined. Es el mismo problema del taller con termino." },
        { valor: "<code>(define-datatype cmd cmd?<br>&nbsp;&nbsp;(avanza-cmd (n)))</code>", correcta: 1,
          razon: "El campo n no tiene predicado. Cada campo va como (nombre predicado), y DrRacket lo dice con esas palabras: expected a field name followed by a predicate expression." },
        { valor: "<code>(define-datatype cmd cmd<br>&nbsp;&nbsp;(avanza-cmd (n number?)))</code>", correcta: 1,
          razon: "El predicado se llama igual que el tipo. No es solo una convención rota: los dos nombres se definen y DrRacket responde identifier already defined. El signo de interrogación no es adorno." },
        { valor: "<code>(define-datatype cmd cmd?<br>&nbsp;&nbsp;(avanza-cmd (n number?) (n number?)))</code>", correcta: 1,
          razon: "Dos campos con el mismo nombre. El constructor es una lambda con esos nombres como parámetros, y una lambda no admite dos iguales: duplicate argument name." },
        { valor: "<code>(define-datatype cmd cmd?<br>&nbsp;&nbsp;(avanza-cmd n number?))</code>", correcta: 1,
          razon: "Faltan los paréntesis del campo. n y number? quedaron como dos cosas sueltas y define-datatype espera pares (nombre predicado)." },
        { valor: "<code>(define-datatype lista-int lista-int?<br>&nbsp;&nbsp;(vacia)<br>&nbsp;&nbsp;(no-vacia (primero number?) (resto lista-int?)))</code>", correcta: 0,
          razon: "Una variante sin campos es válida, y un campo cuyo predicado es el del propio tipo también: así se declara un tipo recursivo, igual que la gramática nombra al no terminal dentro de su producción." },
        { valor: "<code>(define-datatype cmd cmd?<br>&nbsp;&nbsp;(avanza-cmd (n number?))<br>&nbsp;&nbsp;(avanza-cmd (m number?)))</code>", correcta: 1,
          razon: "Dos variantes con el mismo nombre serían dos constructores con el mismo nombre: duplicate binding name." },
        { valor: "<code>(define-datatype cmd cmd?<br>&nbsp;&nbsp;(avanza-cmd (n number?))<br>&nbsp;&nbsp;(repite-cmd (n number?) (cmds cmd?)))</code>", correcta: 0,
          razon: "Compila sin objeción. El problema aparece después: cmds está pensado para guardar una lista de comandos y el predicado cmd? acepta un comando, no una lista. El siguiente bloque muestra qué pasa al construir." }
      ],
      cierre:
        "define-datatype define nombres: el tipo, el predicado y un " +
        "constructor por variante. Casi todo lo que no compila es un nombre " +
        "repetido o un campo mal escrito, y el mensaje de DrRacket lo dice " +
        "con esas palabras. Lo que sí compila y está mal se descubre al " +
        "construir."
    },
    {
      id: "construir",
      titulo: "2. Lo que el constructor acepta y lo que rechaza",
      definicion:
        "(define-datatype cmd cmd?\n" +
        "  (avanza-cmd (n number?))\n" +
        "  (gira-cmd   (dir symbol?))\n" +
        "  (repite-cmd (n number?) (cmds (list-of cmd?))))",
      explicacion:
        "Con esta declaración cargada, prediga qué produce cada expresión. " +
        "El constructor revisa cada campo con su predicado en el momento de " +
        "construir.",
      items: [
        { valor: "<code>(avanza-cmd 3)</code>", opciones: ["Un valor del tipo cmd", "Error"], correcta: 0,
          razon: "Un número cumple number?. El resultado es un cmd, y así lo dice cmd?." },
        { valor: "<code>(avanza-cmd 'tres)</code>", opciones: ["Un valor del tipo cmd", "Error"], correcta: 1,
          razon: "tres es un símbolo y el campo pide number?. El constructor lo rechaza de una vez: bad value for n field. Un dato mal formado nunca llega a existir." },
        { valor: "<code>(repite-cmd 2 (avanza-cmd 1))</code>", opciones: ["Un valor del tipo cmd", "Error"], correcta: 1,
          razon: "El campo cmds pide una lista de comandos y llegó un comando suelto. Hay que envolverlo: (list (avanza-cmd 1))." },
        { valor: "<code>(repite-cmd 0 '())</code>", opciones: ["Un valor del tipo cmd", "Error"], correcta: 0,
          razon: "La lista vacía cumple (list-of cmd?): cero elementos, todos comandos. Un repite sin nada adentro es un dato legal aunque no haga nada." },
        { valor: "<code>(cmd? '(avanza-cmd 1))</code>", opciones: ["#t", "#f"], correcta: 1,
          razon: "Con la comilla eso es una lista de dos elementos, no un valor construido con el constructor. Un datatype no es su forma impresa: solo es un cmd lo que salió de avanza-cmd, gira-cmd o repite-cmd." },
        { valor: "<code>(cmd? (gira-cmd 'izq))</code>", opciones: ["#t", "#f"], correcta: 0,
          razon: "Salió de un constructor del tipo. El predicado del tipo no mira qué variante es, solo que sea alguna de las tres." },
        { valor: "<code>(gira-cmd 'arriba)</code>", opciones: ["Un valor del tipo cmd", "Error"], correcta: 0,
          razon: "arriba es un símbolo y el predicado del campo es symbol?, así que el constructor lo acepta. Que la dirección no exista es un error que este datatype no puede ver: para eso habría que declarar las direcciones como un tipo aparte, con una variante por cada una." }
      ],
      cierre:
        "El predicado de cada campo es lo único que el constructor verifica. " +
        "Un símbolo cualquiera pasa por symbol?, y por eso los conjuntos " +
        "finitos como las direcciones se declaran mejor como un tipo con una " +
        "variante por valor: así el constructor sí rechaza lo que no existe."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = BLOQUES; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorDecisiones.montar({ bloques: BLOQUES, destino: "bloques", cierre: "carta-cierre" });
}

/* Del árbol a la gramática. La receta al revés: los árboles están dados y lo
   que hay que escribir es la gramática que los genera. Primero una
   producción por árbol, después la gramática completa de un lenguaje a
   partir de sus árboles, y al final la producción que le falta a una
   gramática para que un árbol sea suyo. Los árboles se dibujan con
   dibujar-arbol.js. */
var BLOQUES = (function () {
  "use strict";

  function arbol(texto) {
    if (typeof DibujarArbol === "undefined") { return "<code>" + texto + "</code>"; }
    return DibujarArbol.svg(DibujarArbol.desdeTexto(texto));
  }
  function arboles() {
    var partes = Array.prototype.slice.call(arguments).map(function (t) {
      return "<figure>" + arbol(t) + "</figure>";
    });
    return '<div class="candidatos">' + partes.join("") + "</div>";
  }
  function bnf(t) {
    return '<pre class="codigo gramatica">' + t.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</pre>";
  }
  function opciones(a, b, c) {
    return '<ol class="programas gramaticas" type="A"><li>' +
      [a, b, c].map(bnf).join("</li><li>") + "</li></ol>";
  }

  return [
    {
      id: "una-produccion",
      titulo: "1. Una producción por árbol",
      definicion: null,
      explicacion:
        "Cada árbol lo construyó un lenguaje de figuras que no se ha visto. " +
        "El nombre del nodo es la variante y sus hijos son los campos: una " +
        "hoja con un número es un <code>&lt;numero&gt;</code>, una hoja con " +
        "una palabra es un <code>&lt;identificador&gt;</code>, y un hijo que " +
        "es otro nodo del mismo lenguaje es un <code>&lt;figura&gt;</code>. " +
        "Escoja la producción que le corresponde.",
      opciones: ["A", "B", "C"],
      items: [
        { valor: arbol("(circulo-fig 3)") + opciones(
            "<figura> ::= (circulo <numero>)              circulo-fig (radio)",
            "<figura> ::= (circulo <figura>)              circulo-fig (radio)",
            "<figura> ::= circulo                         circulo-fig ()"),
          correcta: 0,
          razon: "Es A. El único hijo es la hoja 3, un número, así que en la producción va <numero>. B pediría otra figura ahí y entonces el hijo sería un nodo, no una hoja; C no tiene hijos y el árbol tiene uno." },
        { valor: arbol("(encima-fig (circulo-fig 3) (cuadrado-fig 5))") + opciones(
            "<figura> ::= (encima <figura> <figura>)      encima-fig (arriba abajo)",
            "<figura> ::= (encima <numero> <numero>)      encima-fig (arriba abajo)",
            "<figura> ::= (encima <figura>)               encima-fig (arriba)"),
          correcta: 0,
          razon: "Es A. Los dos hijos son nodos del mismo lenguaje, así que los dos campos son <figura>. En B serían hojas con números; en C sobraría un hijo en el árbol." },
        { valor: arbol("(repetir-fig 4 (circulo-fig 2))") + opciones(
            "<figura> ::= (repetir <figura> <numero>)     repetir-fig (veces que)",
            "<figura> ::= (repetir <numero> <figura>)     repetir-fig (veces que)",
            "<figura> ::= (repetir <numero> <numero>)     repetir-fig (veces que)"),
          correcta: 1,
          razon: "Es B. El primer hijo es la hoja 4 y el segundo es un nodo: primero <numero> y después <figura>. A los tiene al revés, y el orden de los hijos del árbol es el orden de la producción." },
        { valor: arbol("(color-fig rojo (cuadrado-fig 5))") + opciones(
            "<figura> ::= (color <figura> <figura>)       color-fig (tono que)",
            "<figura> ::= (color <identificador>)         color-fig (tono)",
            "<figura> ::= (color <identificador> <figura>)  color-fig (tono que)"),
          correcta: 2,
          razon: "Es C. La hoja rojo es una palabra, no un número ni un nodo: en la producción va <identificador> y en el datatype el campo lleva symbol?. B pierde la figura que se está coloreando." },
        { valor: arbol("(vacia-fig)") + opciones(
            "<figura> ::= vacia                           vacia-fig ()",
            "<figura> ::= (vacia <figura>)                vacia-fig (que)",
            "<figura> ::= (vacia <numero>)                vacia-fig (tamano)"),
          correcta: 0,
          razon: "Es A. Un nodo sin hijos viene de una producción sin no terminales: una palabra sola. En el datatype es una variante sin campos, (vacia-fig)." },
        { valor: arbol("(grupo-fig ((circulo-fig 1) (cuadrado-fig 2) (vacia-fig)))") + opciones(
            "<figura> ::= (grupo <figura> <figura>)       grupo-fig (una otra)",
            "<figura> ::= (grupo <figura> ...)            grupo-fig (partes)",
            "<figura> ::= (grupo <numero> ...)            grupo-fig (partes)"),
          correcta: 1,
          razon: "Es B. El hijo de grupo-fig no es una figura sino el nodo lista, y adentro van tres figuras: eso es una producción con puntos suspensivos y un campo con (list-of figura?). A fija dos hijos y no habría nodo lista en medio." }
      ],
      cierre:
        "El árbol se lee de arriba abajo: el nodo da el nombre de la " +
        "variante, cada hijo da un campo, y lo que es cada hijo —hoja con " +
        "número, hoja con palabra, nodo del mismo lenguaje o nodo lista— " +
        "dice qué va en la producción. El andamiaje de la sintaxis concreta " +
        "no se puede adivinar desde el árbol: los paréntesis y la palabra " +
        "clave los pone quien escribe la gramática."
    },
    {
      id: "la-gramatica-entera",
      titulo: "2. La gramática de un lenguaje, leída de sus árboles",
      definicion: null,
      explicacion:
        "Ahora varios árboles del mismo lenguaje, que es uno de listas de " +
        "reproducción. De las tres gramáticas, una genera exactamente esos " +
        "árboles; las otras dos generan otros. Escójala.",
      opciones: ["A", "B", "C"],
      items: [
        { valor: arboles("(pista-exp cancion 210)", "(mezcla-exp ((pista-exp a 100) (pista-exp b 90)))") + opciones(
            "<musica> ::= (pista <identificador> <numero>)   pista-exp (nombre seg)\n         ::= (mezcla <musica> ...)             mezcla-exp (partes)",
            "<musica> ::= (pista <identificador>)            pista-exp (nombre)\n         ::= (mezcla <musica> ...)             mezcla-exp (partes)",
            "<musica> ::= (pista <identificador> <numero>)   pista-exp (nombre seg)\n         ::= (mezcla <musica> <musica>)        mezcla-exp (una otra)"),
          correcta: 0,
          razon: "Es A. pista-exp tiene dos hijos, una palabra y un número; a B le falta el número. En el segundo árbol el hijo de mezcla-exp es el nodo lista, así que la producción lleva puntos suspensivos, no dos no terminales como en C." },
        { valor: arboles("(corte-exp (pista-exp tema 200) 30)", "(corte-exp (mezcla-exp ((pista-exp a 100))) 15)") + opciones(
            "<musica> ::= (corte <numero> <musica>)          corte-exp (desde que)",
            "<musica> ::= (corte <musica> <numero>)          corte-exp (que desde)",
            "<musica> ::= (corte <musica> <musica>)          corte-exp (que desde)"),
          correcta: 1,
          razon: "Es B. En los dos árboles el primer hijo es un nodo y el segundo una hoja con número, y eso no cambia porque el nodo de adentro sea una pista o una mezcla. A invierte el orden; C convierte en figura lo que es un número." },
        { valor: arboles("(repite-exp 3 (pista-exp a 100))", "(repite-exp 2 (repite-exp 3 (pista-exp b 60)))") + opciones(
            "<musica> ::= (repite <numero> <pista>)          repite-exp (veces que)\n<pista>  ::= (pista <identificador> <numero>)   pista-exp (nombre seg)",
            "<musica> ::= (repite <numero> <musica>)         repite-exp (veces que)",
            "<musica> ::= (repite <numero> <numero>)         repite-exp (veces que)"),
          correcta: 1,
          razon: "Es B. El segundo árbol tiene un repite dentro de otro, así que el segundo campo admite cualquier música, no solo una pista: con la gramática de A ese árbol no existiría. Que el no terminal se nombre a sí mismo es lo que hace recursivo al lenguaje." },
        { valor: arboles("(lista-exp mis-favoritas ((pista-exp a 100) (pista-exp b 90)))", "(lista-exp vacia ())") + opciones(
            "<musica> ::= (lista <identificador> <musica> ...)  lista-exp (nombre partes)",
            "<musica> ::= (lista <identificador> <musica>)      lista-exp (nombre parte)",
            "<musica> ::= (lista <musica> ...)                  lista-exp (partes)"),
          correcta: 0,
          razon: "Es A. Dos hijos: una hoja con el nombre y el nodo lista con las pistas. El segundo árbol tiene la lista vacía, que los puntos suspensivos permiten y B no: B exige exactamente una. C pierde el nombre." }
      ],
      cierre:
        "Varios árboles del mismo lenguaje alcanzan para escribir su " +
        "gramática: cada nodo distinto es una producción, y un árbol donde " +
        "una variante aparece dentro de sí misma dice que el no terminal se " +
        "nombra a sí mismo. Lo que un solo árbol no dice es si una lista " +
        "puede ir vacía o si un campo admite más variantes de las que se " +
        "ven, y por eso se miran juntos."
    },
    {
      id: "la-produccion-que-falta",
      titulo: "3. La producción que falta",
      definicion: null,
      explicacion:
        "La gramática está incompleta: el árbol de al lado no se puede " +
        "construir con ella. Escoja la producción que hay que agregarle " +
        "para que ese árbol sea suyo.",
      opciones: ["A", "B", "C"],
      items: [
        { valor:
            bnf("<cmd> ::= (avanza <numero>)          avanza-cmd (n)\n      ::= (gira <identificador>)     gira-cmd (dir)") +
            arbol("(repite-cmd 3 ((avanza-cmd 5) (gira-cmd der)))") + opciones(
            "<cmd> ::= (repite <numero> <cmd>)        repite-cmd (n cmds)",
            "<cmd> ::= (repite <numero> <cmd> ...)    repite-cmd (n cmds)",
            "<cmd> ::= (repite <cmd> ...)             repite-cmd (cmds)"),
          correcta: 1,
          razon: "Es B. El segundo hijo del árbol es el nodo lista con dos comandos: puntos suspensivos y un campo (list-of cmd?). A admitiría un solo comando y no habría lista en medio; C pierde el número." },
        { valor:
            bnf("<exp> ::= <numero>                   const-exp (num)\n      ::= (+ <exp> <exp>)            suma-exp (izq der)") +
            arbol("(si-exp (cero?-exp (const-exp 0)) (const-exp 1) (const-exp 2))") + opciones(
            "<exp> ::= (si <exp> <exp> <exp>)         si-exp (prueba si-si si-no)\n      ::= (cero? <exp>)              cero?-exp (arg)",
            "<exp> ::= (si <exp> <exp>)               si-exp (prueba si-si)\n      ::= (cero? <exp>)              cero?-exp (arg)",
            "<exp> ::= (si <exp> <exp> <exp>)         si-exp (prueba si-si si-no)"),
          correcta: 0,
          razon: "Es A. Faltan dos producciones, no una: el árbol trae un si-exp con tres hijos y adentro un cero?-exp que la gramática tampoco tenía. B deja el si con dos hijos y C no agrega el cero?." },
        { valor:
            bnf("<exp> ::= <numero>                   const-exp (num)\n      ::= (let <identificador> <exp>)  let-exp (id cuerpo)") +
            arbol("(var-exp x)") + opciones(
            "<exp> ::= (var <identificador>)          var-exp (id)",
            "<exp> ::= <identificador>                var-exp (id)",
            "<exp> ::= (var <exp>)                    var-exp (id)"),
          correcta: 1,
          razon: "Es B. En el árbol var-exp envuelve una hoja con una palabra, y en la sintaxis concreta del lenguaje una variable se escribe sola: la producción es el no terminal <identificador> sin paréntesis ni palabra clave, como el <numero> de la primera línea. A pediría escribir (var x), que no es lo que hace este lenguaje. El árbol no distingue entre las dos: esa decisión la toma quien escribe la gramática." },
        { valor:
            bnf("<figura> ::= (circulo <numero>)      circulo-fig (radio)\n         ::= (encima <figura> <figura>)  encima-fig (arriba abajo)") +
            arbol("(texto-fig hola 12 (circulo-fig 3))") + opciones(
            "<figura> ::= (texto <identificador> <numero>)        texto-fig (que tam)",
            "<figura> ::= (texto <identificador> <numero> <figura>)  texto-fig (que tam sobre)",
            "<figura> ::= (texto <figura> <numero> <figura>)      texto-fig (que tam sobre)"),
          correcta: 1,
          razon: "Es B. Tres hijos en este orden: palabra, número y nodo, así que tres campos con symbol?, number? y figura?. A se queda en dos y C toma por figura la hoja hola." }
      ],
      cierre:
        "Un árbol que la gramática no genera señala exactamente qué falta: " +
        "el nodo que no tiene producción y, a veces, los nodos que trae " +
        "adentro. Esto es lo que se hace al extender un lenguaje: se dibuja " +
        "el árbol del programa nuevo, se lee de él la producción, y con ella " +
        "vienen la variante del datatype y las cláusulas de parse, unparse y " +
        "el evaluador."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = BLOQUES; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  MotorDecisiones.montar({ bloques: BLOQUES, destino: "bloques", cierre: "carta-cierre" });
}

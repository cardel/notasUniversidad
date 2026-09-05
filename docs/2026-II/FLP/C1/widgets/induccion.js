/* Especificación inductiva de datos (clase 1). Cada bloque presenta un
   conjunto definido por reglas y pide decidir la pertenencia de valores
   concretos; la razón de cada caso nombra la regla que decide. */
var BLOQUES = (function () {
  "use strict";
  return [
    {
      id: "listaint",
      titulo: "1. El conjunto de las listas de enteros",
      definicion:
        "&lt;lista-de-int&gt; ::= ()\n" +
        "               ::= (&lt;int&gt; . &lt;lista-de-int&gt;)",
      explicacion:
        "Dos reglas. La primera dice que la lista vacía está en el conjunto. " +
        "La segunda dice que si se pone un entero al frente de algo que ya " +
        "está en el conjunto, el resultado también está. Nada más entra.",
      items: [
        { valor: "()", dentro: true,
          razon: "Entra por la primera regla, que no pide nada: la lista vacía está en el conjunto por definición." },
        { valor: "(1 2 3)", dentro: true,
          razon: "Entra por la segunda regla, tres veces: (3) sale de () y el entero 3, (2 3) sale de (3) y el 2, y (1 2 3) de ahí con el 1." },
        { valor: "(1 (2) 3)", dentro: false,
          razon: "El segundo elemento es (2), que es una lista y no un entero. La segunda regla exige que lo que va al frente sea un <int>." },
        { valor: "(a b)", dentro: false,
          razon: "a y b son símbolos. Ninguna regla admite símbolos: este conjunto solo tiene enteros adentro." },
        { valor: "(1 . 2)", dentro: false,
          razon: "La segunda regla pide que la cola sea otra <lista-de-int>, y 2 es un entero, no una lista. Este par no termina en ()." },
        { valor: "(-4 0 17)", dentro: true,
          razon: "Los negativos y el cero son enteros: la regla dice <int>, sin más condiciones." }
      ],
      cierre:
        "Una definición inductiva dice dos cosas a la vez: qué entra y, sobre " +
        "todo, que nada más entra. Esa segunda parte es la que permite " +
        "descartar (1 (2) 3) sin dudar."
    },
    {
      id: "slist",
      titulo: "2. Cuando las reglas se llaman entre sí",
      definicion:
        "&lt;s-list&gt; ::= ()\n" +
        "          ::= (&lt;s-exp&gt; . &lt;s-list&gt;)\n" +
        "&lt;s-exp&gt;  ::= &lt;símbolo&gt;\n" +
        "          ::= &lt;s-list&gt;",
      explicacion:
        "Ahora hay dos conjuntos y cada uno aparece en la definición del " +
        "otro. Un elemento de una s-list puede ser un símbolo o, otra vez, " +
        "una s-list completa.",
      items: [
        { valor: "(a b c)", dentro: true,
          razon: "Tres símbolos: cada uno es un <s-exp> por la primera regla de s-exp." },
        { valor: "(a (b c) d)", dentro: true,
          razon: "El segundo elemento es (b c), que es una s-list, y la segunda regla de s-exp permite justamente eso." },
        { valor: "((()) ())", dentro: true,
          razon: "Anidar vacíos también vale: () es una s-list, así que es un s-exp, así que puede ser elemento." },
        { valor: "(a 1 b)", dentro: false,
          razon: "1 no es un símbolo ni una s-list. Las dos reglas de s-exp se quedan cortas, y no hay una tercera." },
        { valor: "a", dentro: false,
          razon: "a es un s-exp, no una s-list. Los dos conjuntos se necesitan mutuamente, pero no son el mismo." },
        { valor: "(a (b (c)) ())", dentro: true,
          razon: "El anidamiento puede ser tan profundo como se quiera: cada nivel vuelve a entrar por la segunda regla de s-exp." }
      ],
      cierre:
        "Dos conjuntos definidos uno en términos del otro no son un problema, " +
        "y ese anidamiento sin límite es la razón de que un procedimiento " +
        "sobre s-lists necesite bajar por el car además de por el cdr."
    },
    {
      id: "llamada",
      titulo: "3. Qué llamada recursiva autoriza la gramática",
      definicion:
        "&lt;lista-de-int&gt; ::= ()\n" +
        "               ::= (&lt;int&gt; . &lt;lista-de-int&gt;)",
      explicacion:
        "Un procedimiento recorre una <code>&lt;lista-de-int&gt;</code> llamada " +
        "<code>lst</code>, y no está en el caso base. ¿Sobre cuáles de estas " +
        "expresiones puede llamarse a sí mismo sin dejar de tener sentido y " +
        "sin quedarse dando vueltas?",
      items: [
        { valor: "(f (cdr lst))", dentro: true,
          razon: "La regla dice que la cola de la lista es otra <lista-de-int>, así que el argumento sigue siendo del tipo que f espera, y es más corto: la recursión avanza hacia ()." },
        { valor: "(f (car lst))", dentro: false,
          razon: "El car es un <int>, no una <lista-de-int>. f recibiría algo de otro conjunto, y car de un número falla en la siguiente vuelta." },
        { valor: "(f lst)", dentro: false,
          razon: "El argumento no cambió. La llamada tiene sentido de tipo, pero nunca se acerca al caso base: es un ciclo infinito." },
        { valor: "(f (cdr (cdr lst)))", dentro: false,
          razon: "Salta de dos en dos y se pasa de largo: en una lista de longitud impar nunca cae en () y el cdr de la vacía falla." },
        { valor: "(f (cons (car lst) (cdr lst)))", dentro: false,
          razon: "Eso reconstruye la misma lista. Es del tipo correcto, pero de nuevo el argumento no decrece." }
      ],
      cierre:
        "La gramática decide dos cosas a la vez. Dice de qué conjunto es cada " +
        "parte, y por eso sobre cuál se puede volver a llamar; y como cada " +
        "regla nombra una parte más pequeña, garantiza que la recursión " +
        "termine. Seguir la gramática no es una costumbre: es lo que hace que " +
        "el procedimiento acabe."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = BLOQUES; }

if (typeof document !== "undefined") {
  (function () {
    var resueltos = {};

    function pintarBloque(bloque) {
      var carta = document.createElement("div");
      carta.className = "carta";
      carta.innerHTML =
        "<h2>" + bloque.titulo + "</h2>" +
        '<div class="codigo gramatica">' + bloque.definicion + "</div>" +
        "<p>" + bloque.explicacion + "</p>" +
        '<div class="lista-items"></div>' +
        '<div class="veredicto"></div>';

      var contenedor = carta.querySelector(".lista-items");
      var veredicto = carta.querySelector(".veredicto");
      var acertados = 0;

      bloque.items.forEach(function (item, i) {
        var fila = document.createElement("div");
        fila.className = "item";
        var etiquetaSi = bloque.id === "llamada" ? "La autoriza" : "Pertenece";
        var etiquetaNo = bloque.id === "llamada" ? "No la autoriza" : "No pertenece";
        fila.innerHTML =
          '<span class="valor">' + item.valor + "</span>" +
          '<span class="opciones">' +
          '<button data-voto="si">' + etiquetaSi + "</button>" +
          '<button data-voto="no">' + etiquetaNo + "</button>" +
          "</span>" +
          '<span class="marca"></span>' +
          '<span class="razon"></span>';

        var marca = fila.querySelector(".marca");
        var razon = fila.querySelector(".razon");
        var listo = false;

        fila.querySelectorAll("[data-voto]").forEach(function (boton) {
          boton.addEventListener("click", function () {
            var dijoSi = boton.getAttribute("data-voto") === "si";
            var correcto = dijoSi === item.dentro;
            fila.querySelectorAll("[data-voto]").forEach(function (b) {
              b.classList.remove("elegido");
            });
            boton.classList.add("elegido");
            marca.textContent = correcto ? "✓" : "✗";
            marca.className = "marca " + (correcto ? "bien" : "mal");
            razon.textContent = item.razon;
            razon.className = "razon " + (correcto ? "bien" : "mal");
            if (correcto && !listo) {
              listo = true;
              acertados++;
              if (acertados === bloque.items.length) {
                veredicto.className = "veredicto bien";
                veredicto.textContent = bloque.cierre;
                resueltos[bloque.id] = true;
                revisarCierre();
              }
            }
          });
        });

        contenedor.appendChild(fila);
      });

      return carta;
    }

    function revisarCierre() {
      var faltan = BLOQUES.some(function (b) { return !resueltos[b.id]; });
      if (!faltan) { document.getElementById("carta-cierre").style.display = "block"; }
    }

    var destino = document.getElementById("bloques");
    BLOQUES.forEach(function (b) { destino.appendChild(pintarBloque(b)); });
  })();
}

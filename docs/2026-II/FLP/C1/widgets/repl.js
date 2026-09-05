/* Retos de recursión estructural (clase 1). El código del estudiante corre
   de verdad sobre el evaluador de mini-scheme.js. */
var RETOS = (function () {
  "use strict";
  return [
    {
      id: "suma",
      titulo: "1. Sumar una lista de números",
      enunciado:
        "Escriba <code>suma-lista</code>, que recibe una lista de números y " +
        "devuelve su suma. La lista vacía suma cero.",
      gramatica:
        "&lt;lista-de-int&gt; ::= ()\n" +
        "                ::= (&lt;int&gt; . &lt;lista-de-int&gt;)",
      esqueleto:
        "(define (suma-lista lst)\n" +
        "  (if (null? lst)\n" +
        "      ???\n" +
        "      ???))\n",
      pruebas: [
        { llamada: "(suma-lista '())", esperado: "0" },
        { llamada: "(suma-lista '(7))", esperado: "7" },
        { llamada: "(suma-lista '(1 2 3 4))", esperado: "10" },
        { llamada: "(suma-lista '(5 -2 10))", esperado: "13" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (obtenido === "()") {
          return "El caso base devolvió la lista vacía. Piense qué tipo de " +
            "valor entrega suma-lista: no una lista, un número. ¿Cuál es la " +
            "suma de ningún número?";
        }
        if ((llamada === "(suma-lista '(7))" && obtenido === "1") ||
            (llamada === "(suma-lista '(1 2 3 4))" && obtenido === "4")) {
          return "Eso es la cantidad de elementos, no su suma: en el paso " +
            "recursivo está sumando 1 en lugar del elemento que tiene a mano.";
        }
        if (llamada === "(suma-lista '(1 2 3 4))" && obtenido === "1") {
          return "Devolvió solo el primer elemento: falta combinarlo con el " +
            "resultado de llamar suma-lista sobre el resto.";
        }
        return null;
      },
      cierre:
        "La estructura del procedimiento copia la de la gramática: una " +
        "cláusula por regla. La regla de la lista vacía da el caso base y la " +
        "regla del par da el paso recursivo, que llama a suma-lista sobre " +
        "exactamente la parte que la regla nombra: el cdr."
    },
    {
      id: "duple",
      titulo: "2. Repetir un valor",
      enunciado:
        "Escriba <code>duple</code>, que recibe un entero <code>n</code> " +
        "mayor o igual a cero y un valor <code>x</code>, y devuelve una " +
        "lista con <code>n</code> copias de <code>x</code>. Aquí la " +
        "recursión no baja por una lista sino por un número.",
      gramatica:
        "&lt;nat&gt; ::= 0\n" +
        "      ::= (add1 &lt;nat&gt;)",
      esqueleto:
        "(define (duple n x)\n" +
        "  ???)\n",
      pruebas: [
        { llamada: "(duple 0 'a)", esperado: "()" },
        { llamada: "(duple 3 'a)", esperado: "(a a a)" },
        { llamada: "(duple 2 '(1 2))", esperado: "((1 2) (1 2))" },
        { llamada: "(duple 1 5)", esperado: "(5)" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(duple 2 '(1 2))" && obtenido === "(1 2 1 2)") {
          return "Usó append donde iba cons: x entra como un elemento, no " +
            "se abre. La lista pedida tiene dos elementos, y cada uno es la " +
            "lista (1 2).";
        }
        if (obtenido === "0") {
          return "El caso base devolvió un número. duple entrega una lista: " +
            "¿cuál es la lista de cero copias?";
        }
        if (llamada === "(duple 3 'a)" && (obtenido === "(a a)" || obtenido === "(a a a a)")) {
          return "Cuenta una copia de más o de menos. Fíjese en qué valor de " +
            "n dispara el caso base y en cuánto baja n en cada llamada.";
        }
        return null;
      },
      cierre:
        "El conjunto de los naturales también se define por inducción, y por " +
        "eso admite la misma receta. El caso base es el cero, y el paso " +
        "recursivo trabaja sobre n menos uno porque esa es la parte que la " +
        "regla nombra."
    },
    {
      id: "elimina",
      titulo: "3. Eliminar la primera ocurrencia",
      enunciado:
        "Escriba <code>elimina-primero</code>, que recibe un símbolo " +
        "<code>s</code> y una lista de símbolos <code>los</code>, y devuelve " +
        "la lista sin la <b>primera</b> aparición de <code>s</code>. Si " +
        "<code>s</code> no está, devuelve la lista igual.",
      gramatica: null,
      esqueleto:
        "(define (elimina-primero s los)\n" +
        "  (cond ((null? los) ???)\n" +
        "        (??? ???)\n" +
        "        (else ???)))\n",
      pruebas: [
        { llamada: "(elimina-primero 'a '(a b c))", esperado: "(b c)" },
        { llamada: "(elimina-primero 'b '(e f g))", esperado: "(e f g)" },
        { llamada: "(elimina-primero 'a4 '(c1 a4 c1 a4))", esperado: "(c1 c1 a4)" },
        { llamada: "(elimina-primero 'x '())", esperado: "()" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(elimina-primero 'a4 '(c1 a4 c1 a4))" && obtenido === "(c1 c1)") {
          return "Quitó las dos apariciones. Cuando encuentra la primera, el " +
            "procedimiento ya terminó: devuelve el cdr sin volver a llamarse.";
        }
        if (llamada === "(elimina-primero 'b '(e f g))" && obtenido === "()") {
          return "Perdió los elementos que no eran b. La cláusula que no " +
            "encuentra el símbolo tiene que reconstruir la lista: pega el " +
            "car al resultado de seguir buscando en el cdr.";
        }
        if (llamada === "(elimina-primero 'a '(a b c))" && obtenido === "(b c a)") {
          return "El símbolo quedó al final: revise el orden en que arma la " +
            "lista de vuelta.";
        }
        return null;
      },
      cierre:
        "Aquí hay dos casos base y no uno: la lista vacía, y la lista cuyo " +
        "primer elemento es el que se busca. Cuando la especificación " +
        "distingue situaciones que la gramática no distingue, la receta se " +
        "estira: cada situación pide su cláusula."
    },
    {
      id: "libre",
      titulo: "4. ¿La variable ocurre libre?",
      enunciado:
        "Escriba <code>ocurre-libre?</code>, que recibe un símbolo " +
        "<code>var</code> y una expresión lambda <code>exp</code>, y responde " +
        "si <code>var</code> aparece libre en <code>exp</code>. Una variable " +
        "está ligada cuando cae dentro de un lambda que la declara.",
      gramatica:
        "&lt;expresion&gt; ::= &lt;identificador&gt;\n" +
        "            ::= (lambda (&lt;identificador&gt;) &lt;expresion&gt;)\n" +
        "            ::= (&lt;expresion&gt; &lt;expresion&gt;)",
      esqueleto:
        "(define (ocurre-libre? var exp)\n" +
        "  (cond ((symbol? exp) ???)\n" +
        "        ((eq? (car exp) 'lambda) ???)\n" +
        "        (else ???)))\n",
      pruebas: [
        { llamada: "(ocurre-libre? 'x 'x)", esperado: "#t" },
        { llamada: "(ocurre-libre? 'x 'y)", esperado: "#f" },
        { llamada: "(ocurre-libre? 'x '(lambda (x) (x y)))", esperado: "#f" },
        { llamada: "(ocurre-libre? 'x '(lambda (y) (x y)))", esperado: "#t" },
        { llamada: "(ocurre-libre? 'x '((lambda (x) x) (x y)))", esperado: "#t" },
        { llamada: "(ocurre-libre? 'y '(lambda (x) (lambda (y) (x y))))", esperado: "#f" }
      ],
      pistas: function (llamada, esperado, obtenido) {
        if (llamada === "(ocurre-libre? 'x '(lambda (x) (x y)))" && obtenido === "#t") {
          return "El lambda declara la misma variable que se busca, así que " +
            "toda aparición dentro del cuerpo está ligada. Antes de mirar el " +
            "cuerpo, compare var con el parámetro.";
        }
        if (llamada === "(ocurre-libre? 'x '(lambda (y) (x y)))" && obtenido === "#f") {
          return "El lambda declara y, no x. Ligar una variable no liga las " +
            "demás: hay que seguir buscando en el cuerpo.";
        }
        if (llamada === "(ocurre-libre? 'x '((lambda (x) x) (x y)))" && obtenido === "#f") {
          return "La expresión es una aplicación de dos partes. La primera " +
            "liga x, pero la segunda no: basta con que ocurra libre en una " +
            "de las dos.";
        }
        return null;
      },
      cierre:
        "Tres reglas en la gramática, tres cláusulas en el procedimiento, y " +
        "cada una pregunta por lo que su regla nombra. La regla del lambda " +
        "es la única que cambia la pregunta antes de bajar, y ese cambio es " +
        "justamente lo que significa ligar una variable."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = RETOS; }

/* --- Interfaz ----------------------------------------------------- */
if (typeof document !== "undefined") {
  (function () {
    var resueltos = {};

    function correrRetoConCodigo(reto, codigo) {
      var sesion = MiniScheme.nuevaSesion();
      var carga = MiniScheme.correr(codigo, sesion);
      if (carga.error) {
        return { estado: "error", mensaje: "Su código no llegó a correr. " + carga.error };
      }
      for (var i = 0; i < reto.pruebas.length; i++) {
        var p = reto.pruebas[i];
        var r = MiniScheme.evaluarExpresion(p.llamada, sesion);
        if (r.error) {
          return { estado: "error", mensaje: p.llamada + " falló: " + r.error };
        }
        var obtenido = MiniScheme.escribir(r.valor);
        if (obtenido !== p.esperado) {
          return { estado: "falla", llamada: p.llamada, esperado: p.esperado, obtenido: obtenido };
        }
      }
      return { estado: "bien" };
    }

    function pintarReto(reto) {
      var carta = document.createElement("div");
      carta.className = "carta";
      var gram = reto.gramatica
        ? '<div class="codigo gramatica">' + reto.gramatica + "</div>"
        : "";
      carta.innerHTML =
        "<h2>" + reto.titulo + "</h2>" +
        "<p>" + reto.enunciado + "</p>" + gram +
        '<div class="casos"></div>' +
        '<textarea class="editor" spellcheck="false" rows="7"></textarea>' +
        '<div class="botones">' +
        '<button class="primario" data-accion="probar">Probar</button>' +
        '<button data-accion="reiniciar">Volver al esqueleto</button>' +
        "</div>" +
        '<div class="veredicto"></div>';

      var casos = carta.querySelector(".casos");
      casos.innerHTML = "<b>Debe cumplir:</b>";
      var ul = document.createElement("ul");
      ul.className = "casos-lista";
      reto.pruebas.forEach(function (p) {
        var li = document.createElement("li");
        li.innerHTML = "<code>" + p.llamada + "</code> → <code>" + p.esperado + "</code>";
        ul.appendChild(li);
      });
      casos.appendChild(ul);

      var editor = carta.querySelector(".editor");
      editor.value = reto.esqueleto;
      var veredicto = carta.querySelector(".veredicto");

      carta.querySelector('[data-accion="reiniciar"]').addEventListener("click", function () {
        editor.value = reto.esqueleto;
        veredicto.className = "veredicto";
      });

      carta.querySelector('[data-accion="probar"]').addEventListener("click", function () {
        if (/\?\?\?/.test(editor.value)) {
          veredicto.className = "veredicto mal";
          veredicto.textContent = "Quedan huecos sin llenar: reemplace cada ??? por una expresión.";
          return;
        }
        var r = correrRetoConCodigo(reto, editor.value);
        if (r.estado === "bien") {
          veredicto.className = "veredicto bien";
          veredicto.textContent = "Pasa las " + reto.pruebas.length + " pruebas. " + reto.cierre;
          resueltos[reto.id] = true;
          revisarCierre();
          return;
        }
        veredicto.className = "veredicto mal";
        if (r.estado === "error") {
          veredicto.textContent = r.mensaje;
          return;
        }
        var pista = reto.pistas(r.llamada, r.esperado, r.obtenido);
        veredicto.textContent =
          r.llamada + " dio " + r.obtenido + " y debía dar " + r.esperado + "." +
          (pista ? " " + pista : "");
      });

      return carta;
    }

    function revisarCierre() {
      var faltan = RETOS.some(function (r) { return !resueltos[r.id]; });
      if (!faltan) { document.getElementById("carta-cierre").style.display = "block"; }
    }

    var destino = document.getElementById("retos");
    RETOS.forEach(function (reto) { destino.appendChild(pintarReto(reto)); });

    /* Consola libre. */
    var consola = document.getElementById("consola-entrada");
    var salida = document.getElementById("consola-salida");
    var sesionLibre = MiniScheme.nuevaSesion();

    function ejecutarConsola() {
      var r = MiniScheme.correr(consola.value, sesionLibre);
      var lineas = [];
      if (r.salida) { lineas.push(r.salida.replace(/\n$/, "")); }
      if (r.error) {
        lineas.push("Error: " + r.error);
      } else {
        r.valores.forEach(function (v) {
          var t = MiniScheme.escribir(v);
          if (t !== "") { lineas.push(t); }
        });
      }
      salida.textContent = lineas.join("\n") ||
        (consola.value.trim() ? "Listo: la sesión quedó con las definiciones." : "");
      salida.className = "consola-salida" + (r.error ? " con-error" : "");
    }

    document.getElementById("btn-consola").addEventListener("click", ejecutarConsola);
    document.getElementById("btn-limpiar").addEventListener("click", function () {
      sesionLibre = MiniScheme.nuevaSesion();
      salida.textContent = "Sesión reiniciada: se olvidaron las definiciones anteriores.";
      salida.className = "consola-salida";
    });
    consola.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { ejecutarConsola(); }
    });
  })();
}

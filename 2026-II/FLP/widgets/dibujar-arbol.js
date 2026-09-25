/* Dibuja un valor como árbol de sintaxis abstracta, en SVG. Recibe la
   descripción que devuelve MiniScheme.inspeccionar —dato, lista o átomo— o
   un texto como el de una prueba, "(repite-cmd 2 ((avanza-cmd 1)))", donde
   una lista que empieza por un símbolo se toma como un nodo con ese nombre y
   sus campos como hijos. Un nodo por variante, una hoja por átomo, y las
   listas de campos como un nodo intermedio. */
var DibujarArbol = (function () {
  "use strict";

  var ALTO_NODO = 26, ANCHO_CARACTER = 7.6, RELLENO = 10, SEPARACION = 14, SALTO = 46;

  function desdeTexto(texto) {
    var formas = MiniScheme.leerTodo(texto);
    return desdeValor(formas[0]);
  }

  /* Convierte un valor leído (listas y átomos) a la descripción del árbol. */
  function desdeValor(v) {
    var d = MiniScheme.inspeccionar(v);
    return etiquetar(d);
  }

  function etiquetar(d) {
    if (d.clase === "dato") {
      return { etiqueta: d.variante, hijos: d.campos.map(etiquetar), tipo: "nodo" };
    }
    if (d.clase === "lista") {
      var primero = d.items[0];
      if (primero && primero.clase === "atomo" && /^[a-zA-Z?!<>=*+\-][a-zA-Z0-9?!<>=*+\-]*$/.test(primero.texto) &&
          !/^-?[0-9]/.test(primero.texto)) {
        return { etiqueta: primero.texto, hijos: d.items.slice(1).map(etiquetar), tipo: "nodo" };
      }
      return { etiqueta: "lista", hijos: d.items.map(etiquetar), tipo: "lista" };
    }
    return { etiqueta: d.texto, hijos: [], tipo: "hoja" };
  }

  function anchoDe(etiqueta) { return etiqueta.length * ANCHO_CARACTER + 2 * RELLENO; }

  /* Calcula el ancho de cada subárbol y deja x, y en cada nodo. */
  function medir(n) {
    n.ancho = anchoDe(n.etiqueta);
    if (n.hijos.length === 0) { n.extension = n.ancho; return n.extension; }
    var total = 0;
    n.hijos.forEach(function (h, i) { total += medir(h) + (i > 0 ? SEPARACION : 0); });
    n.extension = Math.max(n.ancho, total);
    return n.extension;
  }

  function ubicar(n, x0, nivel) {
    n.y = nivel * SALTO;
    if (n.hijos.length === 0) { n.x = x0 + n.extension / 2; return; }
    var suma = n.hijos.reduce(function (a, h) { return a + h.extension; }, 0) + SEPARACION * (n.hijos.length - 1);
    var x = x0 + (n.extension - suma) / 2;
    n.hijos.forEach(function (h) { ubicar(h, x, nivel + 1); x += h.extension + SEPARACION; });
    n.x = (n.hijos[0].x + n.hijos[n.hijos.length - 1].x) / 2;
  }

  function profundidad(n) {
    return n.hijos.length === 0 ? 1 : 1 + Math.max.apply(null, n.hijos.map(profundidad));
  }

  function escapar(t) {
    return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function pintar(n, partes) {
    n.hijos.forEach(function (h) {
      partes.push('<line x1="' + n.x + '" y1="' + (n.y + ALTO_NODO) + '" x2="' + h.x + '" y2="' + h.y + '" class="arbol-arista"/>');
      pintar(h, partes);
    });
    var w = n.ancho, x = n.x - w / 2;
    if (n.tipo === "hoja") {
      partes.push('<text x="' + n.x + '" y="' + (n.y + ALTO_NODO / 2) + '" class="arbol-hoja">' + escapar(n.etiqueta) + '</text>');
    } else {
      partes.push('<rect x="' + x + '" y="' + n.y + '" width="' + w + '" height="' + ALTO_NODO +
                  '" rx="6" class="arbol-' + n.tipo + '"/>');
      partes.push('<text x="' + n.x + '" y="' + (n.y + ALTO_NODO / 2) + '" class="arbol-texto">' + escapar(n.etiqueta) + '</text>');
    }
  }

  function svg(arbol) {
    var raiz = arbol.etiqueta !== undefined ? arbol : etiquetar(arbol);
    var ancho = medir(raiz) + 2 * RELLENO;
    ubicar(raiz, RELLENO, 0);
    var alto = profundidad(raiz) * SALTO;
    var partes = [];
    pintar(raiz, partes);
    return '<svg class="arbol" viewBox="0 0 ' + ancho + ' ' + alto + '" width="' + ancho + '" height="' + alto +
           '" role="img" aria-label="árbol de ' + escapar(raiz.etiqueta) + '">' + partes.join("") + '</svg>';
  }

  return { svg: svg, desdeTexto: desdeTexto, desdeValor: desdeValor, etiquetar: etiquetar };
})();

if (typeof module !== "undefined") { module.exports = DibujarArbol; }

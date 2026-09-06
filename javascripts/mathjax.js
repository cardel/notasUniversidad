// Configuración de MathJax para pymdownx.arithmatex (modo generic).
// arithmatex convierte $...$ / $$...$$ del markdown en \(...\) / \[...\]
// envueltos en elementos con clase "arithmatex"; MathJax solo procesa esos.
//
// Caso aparte: la extensión toc guarda el TEXTO PLANO del encabezado, que ya
// viene con los delimitadores \( \) que produjo arithmatex. Ese texto termina
// en los enlaces .md-nav__link del nav izquierdo y de la tabla de contenidos
// lateral, donde no hay ningún elemento con clase "arithmatex" que MathJax
// pueda reconocer. Por eso processHtmlClass incluye también md-nav__link y
// md-ellipsis: ignoreHtmlClass ".*|" apaga el procesamiento en todo elemento
// con clase, así que habilitar solo el enlace no basta — Material mete el
// texto del título dentro de un <span class="md-ellipsis"> y ese span volvía
// a apagarlo. Con las dos clases el TeX de los títulos deja de verse en crudo
// en la barra lateral, sin tocar los encabezados de los archivos fuente.
// md-ellipsis aparece únicamente dentro de md-nav__link, md-header__topic y
// md-footer__title, que son justamente los sitios donde se filtraba el TeX.
window.MathJax = {
  tex: {
    inlineMath: [["\\(", "\\)"]],
    displayMath: [["\\[", "\\]"]],
    processEscapes: true,
    processEnvironments: true,
  },
  options: {
    ignoreHtmlClass: ".*|",
    processHtmlClass: "arithmatex|md-nav__link|md-ellipsis",
  },
};

// Las fórmulas de los títulos se quedan dentro del ancho de la barra lateral:
// el enlace ya recorta lo que sobra, aquí solo se impide que el contenedor de
// MathJax ensanche la caja y se corrige la línea base.
(function () {
  var css = document.createElement("style");
  css.textContent = [
    ".md-nav__link mjx-container,",
    ".md-header__topic mjx-container,",
    ".md-footer__title mjx-container {",
    "  max-width: 100%;",
    "  overflow: hidden;",
    "  vertical-align: middle;",
    "}",
    ".md-nav__link mjx-container[display='true'],",
    ".md-header__topic mjx-container[display='true'],",
    ".md-footer__title mjx-container[display='true'] {",
    "  display: inline-block;",
    "  margin: 0;",
    "  text-align: left;",
    "}",
  ].join("\n");
  document.head.appendChild(css);
})();

// ¿Queda TeX sin tipografiar en algún sitio que MathJax deba procesar?
// Con instant loading, Material reemplaza el contenido, las dos barras
// laterales, el título del encabezado y el pie, de modo que tras navegar todo
// vuelve a estar en crudo. En la carga inicial, en cambio, el arranque de
// MathJax ya hizo el primer pase y no queda nada pendiente.
function quedaTexSinTipografiar() {
  var nodos = document.querySelectorAll(
    ".arithmatex, .md-nav__link, .md-header__topic, .md-footer__title"
  );
  var pendiente = false;
  var i = 0;
  while (i < nodos.length && !pendiente) {
    if (
      !nodos[i].querySelector("mjx-container") &&
      /\\\(|\\\[/.test(nodos[i].textContent)
    ) {
      pendiente = true;
    }
    i += 1;
  }
  return pendiente;
}

// Re-tipografiar al navegar con instant loading de Material for MkDocs, con la
// secuencia oficial del tema: vaciar la caché de salida, soltar la lista de
// fórmulas ya tipografiadas (esos nodos ya no están en el DOM), reiniciar el
// estado de TeX y volver a tipografiar.
//
// Dos salvaguardas:
//  - En el primer arranque este archivo corre antes de que cargue MathJax, así
//    que se comprueba que la API exista; si no, el propio arranque de MathJax
//    hace el primer pase.
//  - La secuencia solo se ejecuta cuando hay TeX pendiente. clearCache() vacía
//    la hoja de estilos de glifos y esta se reconstruye con lo que se
//    tipografíe a continuación; lanzarla sobre una página ya renderizada
//    dejaba las fórmulas sin glifos (en blanco) y duplicaba los contenedores
//    al reprocesar el MathML accesible.
document$.subscribe(function () {
  if (window.MathJax && MathJax.startup && MathJax.typesetPromise) {
    MathJax.startup.promise = MathJax.startup.promise
      .then(function () {
        var tarea = null;
        if (quedaTexSinTipografiar()) {
          MathJax.startup.output.clearCache();
          MathJax.typesetClear();
          MathJax.texReset();
          tarea = MathJax.typesetPromise();
        }
        return tarea;
      })
      .catch(function (err) {
        console.error("MathJax: fallo al re-tipografiar", err);
      });
  }
});

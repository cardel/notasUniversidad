// Configuración de MathJax para pymdownx.arithmatex (modo generic).
// arithmatex convierte $...$ / $$...$$ del markdown en \(...\) / \[...\]
// envueltos en elementos con clase "arithmatex"; MathJax solo procesa esos.
window.MathJax = {
  tex: {
    inlineMath: [["\\(", "\\)"]],
    displayMath: [["\\[", "\\]"]],
    processEscapes: true,
    processEnvironments: true,
  },
  options: {
    ignoreHtmlClass: ".*|",
    processHtmlClass: "arithmatex",
  },
};

// Re-tipografiar al navegar con instant loading de Material for MkDocs.
document$.subscribe(() => {
  if (window.MathJax && MathJax.startup && MathJax.typesetPromise) {
    MathJax.startup.document.clear();
    MathJax.typesetPromise();
  }
});

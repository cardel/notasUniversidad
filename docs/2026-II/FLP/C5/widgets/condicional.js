/* El condicional y su regla. Qué pasa cuando la prueba no es booleana, qué
   rama llega a evaluarse y por qué el interpretador verifica en vez de
   delegar en el if de Racket. Los valores están medidos con el
   interpretador de la sesión; el ambiente inicial liga x = 4, y = 2, z = 5
   sobre a = 4, b = 5, c = 6. */
var BLOQUES = (function () {
  "use strict";
  function c(t) { return "<code>" + t.replace(/</g, "&lt;") + "</code>"; }

  return [
    {
      id: "que-da-cada-if",
      titulo: "1. Qué da cada condicional",
      definicion:
        "if &lt;expresion&gt; then &lt;expresion&gt; else &lt;expresion&gt;\n" +
        "        if-exp (condicion hace-verdadero hace-falso)\n\n" +
        "ambiente inicial:  [x=4, y=2, z=5]  sobre  [a=4, b=5, c=6]",
      explicacion:
        "Con el interpretador de la sesión, que verifica la prueba con " +
        "<code>boolean?</code> antes de ramificar, diga qué da cada " +
        "programa.",
      opciones: ["A", "B", "C"],
      items: [
        { valor: c("if <(y,x) then -(x,y) else -(y,x)") +
            ' <span class="candidatos"><b>A.</b> 2 &nbsp; <b>B.</b> −2 &nbsp; <b>C.</b> #t</span>',
          correcta: 0,
          razon: "Da 2. La prueba <(2,4) es #t, así que se evalúa -(x,y) y la otra rama ni se mira. Este es el programa que la sesión pedía al empezar: la diferencia restando el menor del mayor." },
        { valor: c("if ==(-(z,5),0) then add1(x) else sub1(x)") +
            ' <span class="candidatos"><b>A.</b> 3 &nbsp; <b>B.</b> 5 &nbsp; <b>C.</b> #t</span>',
          correcta: 1,
          razon: "Da 5. -(z,5) es 0, ==(0,0) es #t, y la rama verdadera es add1(x) = 5. Un if nunca devuelve el booleano de su prueba: devuelve el valor de la rama." },
        { valor: c("if x then 1 else 2") +
            ' <span class="candidatos"><b>A.</b> 1 &nbsp; <b>B.</b> 2 &nbsp; <b>C.</b> se detiene con un error</span>',
          correcta: 2,
          razon: "Se detiene: la prueba vale 4, que no es un booleano. El interpretador lo verifica y aborta con un mensaje que dice qué llegó. Sin esa verificación, Racket tomaría el 4 por verdadero y devolvería 1." },
        { valor: c("if >(x,4) then (f 1) else 9") +
            ' <span class="candidatos"><b>A.</b> 9 &nbsp; <b>B.</b> se detiene: f no está ligada &nbsp; <b>C.</b> se detiene: la prueba no es booleana</span>',
          correcta: 0,
          razon: "Da 9. La prueba >(4,4) es #f, así que solo se evalúa la rama del else y la llamada a f nunca ocurre. Que una rama mencione algo inexistente no importa mientras no se evalúe." },
        { valor: c("if ==(0,0) then (f 1) else 9") +
            ' <span class="candidatos"><b>A.</b> 9 &nbsp; <b>B.</b> se detiene: f no está ligada &nbsp; <b>C.</b> 1</span>',
          correcta: 1,
          razon: "Ahora la prueba es #t y sí se entra a la rama donde está f, que nadie ligó: el error aparece al buscarla en el ambiente. Es el mismo programa anterior con la prueba cambiada, y con eso cambia qué subárbol se recorre." }
      ],
      cierre:
        "De las dos ramas se evalúa una sola, y cuál se evalúa lo decide la " +
        "prueba. Por eso dos programas idénticos salvo en la prueba pueden " +
        "terminar uno con un valor y el otro con un error: no es que una " +
        "rama esté mal escrita, es que nunca se la visita."
    },
    {
      id: "por-que-verificar",
      titulo: "2. Por qué no basta con el if de Racket",
      definicion:
        "Primer intento:\n" +
        "(if-exp (cond si-si si-no)\n" +
        "  (if (evaluar-expresion cond amb)\n" +
        "      (evaluar-expresion si-si amb)\n" +
        "      (evaluar-expresion si-no amb)))\n\n" +
        "El del curso:\n" +
        "(if-exp (cond si-si si-no)\n" +
        "  (let ((v (evaluar-expresion cond amb)))\n" +
        "    (if (boolean? v)\n" +
        "        (if v (evaluar-expresion si-si amb)\n" +
        "              (evaluar-expresion si-no amb))\n" +
        "        (eopl:error \"El test-exp debe ser un booleano\" cond))))",
      explicacion:
        "Los dos pedazos de código hacen lo mismo cuando la prueba es un " +
        "booleano. Juzgue estas afirmaciones sobre lo que los separa.",
      opciones: ["Cierto", "Falso"],
      items: [
        { valor: "Con el primer intento, " + c("if 5 then 1 else 2") + " devuelve 1", correcta: 0,
          razon: "En Racket todo valor distinto de #f cuenta como verdadero, así que el 5 pasa por verdadero y se toma la rama del then. El programa era inválido y nadie se quejó." },
        { valor: "El primer intento hace que el lenguaje definido herede una decisión del lenguaje que lo implementa", correcta: 0,
          razon: "Qué cuenta como verdadero deja de ser una decisión del lenguaje que se está definiendo y pasa a ser la de Racket. Si mañana el interpretador se escribe en otro lenguaje, el programa podría dar otra cosa." },
        { valor: "La verificación con " + c("boolean?") + " hace más lento al interpretador sin cambiar ningún resultado", correcta: 1,
          razon: "Cambia los resultados de todos los programas cuya prueba no sea booleana: donde antes salía un valor inventado, ahora sale un error, que es la intención." },
        { valor: "El orden importa: primero se evalúa la prueba, después se verifica y solo entonces se ramifica", correcta: 0,
          razon: "Son cuatro pasos en ese orden, y el último es el que escoge la rama. Verificar antes de evaluar sería imposible, porque el tipo del valor no se conoce hasta tenerlo." },
        { valor: "Con la verificación, las dos ramas se evalúan para poder compararlas", correcta: 1,
          razon: "Se sigue evaluando una sola. Lo que se verifica es la prueba, no las ramas; evaluar las dos cambiaría el significado del condicional y haría fallar el programa del ítem anterior." }
      ],
      cierre:
        "La regla es la misma que después gobierna la aplicación: antes de " +
        "usar un valor como booleano se verifica que lo sea, y antes de " +
        "aplicar algo se verifica que sea un procedimiento. En los dos " +
        "casos lo que se evita es que el lenguaje anfitrión decida por " +
        "nosotros y entierre el error."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = BLOQUES; }

if (typeof document !== "undefined") {
  MotorDecisiones.montar({ bloques: BLOQUES, destino: "bloques", cierre: "carta-cierre" });
}

/* Interpretado, compilado o las dos cosas. Lo que se juzga no son las
   definiciones sino lo que se observa al usar cada lenguaje: cuándo
   aparecen los errores, qué archivo se distribuye, qué pasa al cambiar una
   línea. */
var BLOQUES = (function () {
  "use strict";

  return [
    {
      id: "que-se-observa",
      titulo: "1. Lo que se nota al usarlo",
      definicion: null,
      explicacion:
        "Cada situación ocurre con un lenguaje que se distribuye ya " +
        "compilado a código máquina o con uno que se interpreta. Diga con " +
        "cuál de los dos.",
      opciones: ["Compilado", "Interpretado"],
      items: [
        { valor: "Un error de escritura en la última línea impide que se ejecute la primera", correcta: 0,
          razon: "El compilador traduce el programa entero antes de que se ejecute nada, así que cualquier error de sintaxis detiene todo. En un lenguaje interpretado las líneas anteriores ya corrieron cuando se llega a la mala." },
        { valor: "El programa alcanza a imprimir tres líneas y falla en la cuarta", correcta: 1,
          razon: "El intérprete va ejecutando mientras avanza, así que el efecto de lo que ya pasó queda hecho. Es la contraparte del caso anterior." },
        { valor: "Para correrlo en otra arquitectura hay que volver a construirlo", correcta: 0,
          razon: "El binario se produjo para un juego de instrucciones concreto. Lo que se porta en el otro camino no es el programa sino el intérprete: una vez portado, los programas corren sin tocarlos." },
        { valor: "Basta con instalar un programa aparte y el mismo archivo de texto corre en cualquier máquina", correcta: 1,
          razon: "Ese programa aparte es el intérprete. El archivo que se distribuye sigue siendo el código fuente, que es lo mismo que ver el programa." },
        { valor: "Se cambia una línea y se prueba de inmediato, sin ningún paso intermedio", correcta: 1,
          razon: "No hay traducción previa que rehacer. En el otro camino cada cambio obliga a repetir la construcción antes de poder probar." },
        { valor: "Con el mismo trabajo por hacer, termina antes", correcta: 0,
          razon: "La traducción se hizo una vez y ya; el intérprete, en cambio, vuelve a recorrer el árbol cada vez que ejecuta. Es el precio de las ventajas anteriores." }
      ],
      cierre:
        "Ninguna de estas propiedades es del lenguaje: son de la manera de " +
        "llevarlo a la máquina. Nada impide escribir un compilador de " +
        "Python ni un intérprete de C, y los dos existen. Lo que decide es " +
        "qué se hace con el árbol después de que el frontend lo construye."
    },
    {
      id: "el-mismo-frontend",
      titulo: "2. Qué comparten y en qué se separan",
      definicion:
        "código fuente  →  [frontend]  →  AST  →  [interpretador]  →  valor\n" +
        "código fuente  →  [frontend]  →  AST  →  [compilador]     →  código destino",
      explicacion:
        "Los dos caminos empiezan igual y se separan en el AST. Diga a " +
        "quién le corresponde cada cosa.",
      opciones: ["Al frontend, común a los dos", "Solo al interpretador", "Solo al compilador"],
      items: [
        { valor: "Partir el texto en tokens", correcta: 0,
          razon: "Scanner y parser hacen falta en los dos caminos: nadie trabaja sobre la cadena de caracteres, ni para evaluar ni para traducir." },
        { valor: "Detectar un error de sintaxis", correcta: 0,
          razon: "Es el frontend el que lo encuentra, por eso los dos caminos lo reportan. Lo que cambia es el momento en que uno lo ve, no quién lo detecta." },
        { valor: "Recorrer el árbol y producir la respuesta", correcta: 1,
          razon: "Eso es interpretar: examinar la estructura del árbol y ejecutar acciones que dependen de ella. Es exactamente lo que hace evaluar-expresion." },
        { valor: "Producir un archivo que la máquina ejecuta sin volver a ver el programa", correcta: 2,
          razon: "El traductor genera el código destino a partir del árbol. Después de eso el fuente ya no hace falta para ejecutar." },
        { valor: "Deducir información sobre el programa sin ejecutarlo", correcta: 2,
          razon: "Es el analizador del compilador, el componente que mira el árbol para decidir cómo traducirlo. Un chequeador de tipos trabaja así, y por eso puede rechazar un programa que nunca se corrió." },
        { valor: "Necesitar un ambiente con el valor de cada variable", correcta: 1,
          razon: "El ambiente guarda valores, y los valores existen mientras el programa corre. Lo que el compilador lleva en su lugar es la información de dónde vivirá cada variable, no cuánto vale." }
      ],
      cierre:
        "El frontend es el mismo trabajo en los dos casos, y es el de esta " +
        "sesión. Lo que viene después se bifurca: recorrer el árbol para " +
        "obtener un valor, o recorrerlo para escribir otro programa. Los " +
        "casos híbridos hacen las dos: se compila a bytecode y una máquina " +
        "virtual lo interpreta."
    },
    {
      id: "hibridos",
      titulo: "3. Los casos que no son ni lo uno ni lo otro",
      definicion: null,
      explicacion:
        "Java compila a bytecode y la máquina virtual lo ejecuta; algunas " +
        "máquinas virtuales compilan a código máquina partes del bytecode " +
        "mientras el programa corre. Juzgue estas afirmaciones sobre ese " +
        "camino.",
      opciones: ["Cierto", "Falso"],
      items: [
        { valor: "El bytecode es código máquina de alguna CPU real", correcta: 1,
          razon: "Es el lenguaje de una máquina que no existe en silicio: la virtual. Por eso el mismo archivo .class corre donde haya una JVM, sin volver a traducirlo." },
        { valor: "Un error de sintaxis se descubre antes de ejecutar", correcta: 0,
          razon: "La traducción a bytecode pasa por el frontend completo, así que ese error aparece al compilar, como en el camino compilado." },
        { valor: "La máquina virtual hace un trabajo parecido al de un interpretador", correcta: 0,
          razon: "Recorre el bytecode y ejecuta lo que cada instrucción indica, que es interpretar, solo que sobre una representación más cercana a la máquina que un árbol." },
        { valor: "Compilar durante la ejecución no tiene sentido, porque para eso se compila antes", correcta: 1,
          razon: "Tiene sentido justamente porque solo entonces se sabe qué partes se ejecutan muchas veces y con qué datos. Esa información no está disponible antes de correr el programa." }
      ],
      cierre:
        "La pregunta útil no es si un lenguaje es compilado o interpretado, " +
        "sino qué le pasa al árbol: se recorre para obtener el valor, se " +
        "traduce a otro lenguaje, o se traduce a uno intermedio que otra " +
        "cosa recorre. Las tres respuestas conviven en los lenguajes de hoy."
    }
  ];
})();

if (typeof module !== "undefined") { module.exports = BLOQUES; }

if (typeof document !== "undefined") {
  MotorDecisiones.montar({ bloques: BLOQUES, destino: "bloques", cierre: "carta-cierre" });
}

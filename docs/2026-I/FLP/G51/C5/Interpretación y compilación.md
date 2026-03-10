# Interpretación y compilación

## Conceptos

1.  El texto de un programa se denomina **código fuente** (o lenguaje fuente). Es una cadena de caracteres que define las instrucciones para la computadora.
2.  Este código fuente es procesado por un **frontend** (o analizador frontal):
    1.  **Verifica la sintaxis**: Comprueba que la estructura del código cumpla con las reglas gramaticales del lenguaje de programación.
    2.  **Construye un AST (Árbol de Sintaxis Abstracta)**: Crea una representación jerárquica y estructurada del programa, eliminando detalles superficiales como espacios o paréntesis, y capturando su lógica esencial.
3.  A partir del AST, se pueden seguir dos caminos principales:
    1.  **Interpretar**: Un **intérprete** recorre el AST y ejecuta las instrucciones directamente, produciendo una respuesta o resultado. No genera un archivo ejecutable independiente.
    2.  **Compilar**: Un **compilador** toma el AST y lo transforma en **código de máquina** (binario) ejecutable por el hardware.
        1.  **Fase de Análisis (Backend)**: Deduce información útil (como tipos de datos), aplica correcciones y realiza **optimizaciones** para mejorar la eficiencia del código resultante.
        2.  **Fase de Síntesis/Traducción**: Genera el código binario de salida específico para una arquitectura de procesador (por ejemplo, x86, ARM).
    3.  **Caso intermedio (Ej: Java)**: El compilador `javac` no genera código de máquina directamente, sino un **bytecode** (código intermedio). Este bytecode es luego **interpretado** por la Máquina Virtual de Java (JVM). Sin embargo, técnicas como la **compilación Just-In-Time (JIT)** pueden traducir partes críticas del bytecode a código de máquina nativo durante la ejecución para mejorar el rendimiento.

## Comentarios Adicionales

*   **Ventajas de la Interpretación**: Mayor portabilidad (el mismo intérprete puede ejecutar el código fuente en diferentes sistemas) y facilidad de depuración, ya que el error se señala en el código fuente original. Suele ser más lento en ejecución.
*   **Ventajas de la Compilación**: Mayor velocidad de ejecución, ya que el código ya está traducido al lenguaje nativo de la máquina. Genera un ejecutable independiente. Es menos portable, ya que el binario está ligado a un sistema operativo y arquitectura específicos.
*   **Lenguajes Híbridos**: Muchos lenguajes modernos (Python, JavaScript, C#) utilizan enfoques híbridos. Por ejemplo, Python compila primero a un bytecode que luego es interpretado, similar al modelo de Java.

## Tabla de Resumen

Concepto | Descripción | Ejemplo/Nota
--- | --- | ---
Código Fuente | Texto del programa escrito por el desarrollador en un lenguaje de alto nivel. | Archivo `.java`, `.py`, `.c`
Frontend | Parte del compilador/intérprete que analiza el código fuente. | Verifica sintaxis, construye el AST.
AST (Árbol de Sintaxis Abstracta) | Representación estructurada en árbol de la lógica del programa. | Base para interpretación o compilación.
Intérprete | Ejecuta directamente las instrucciones del AST. | Python, JavaScript (en navegadores), shell scripts.
Compilador | Traduce el AST a código de máquina ejecutable. | GCC (para C/C++), Rustc.
Backend (Fase de Análisis/Síntesis) | Parte del compilador que optimiza y genera el código objetivo. | Optimizaciones, generación de código ensamblador.
Código de Máquina (Binario) | Instrucciones en lenguaje de bajo nivel entendidas directamente por el CPU. | Archivo `.exe` (Windows), binario ELF (Linux).
Bytecode | Código intermedio, más abstracto que el de máquina, diseñado para ser ejecutado por una máquina virtual. | Archivo `.class` de Java, bytecode de Python (`.pyc`).
Máquina Virtual (VM) | Software que simula una computadora y puede ejecutar bytecode. | JVM (Java), CLR (.NET).
Compilación JIT (Just-In-Time) | Técnica que compila bytecode a código de máquina nativo durante la ejecución. | Mejora el rendimiento en Java (HotSpot), V8 (JavaScript).

**Comentarios Finales:** La elección entre interpretación, compilación o un modelo híbrido depende del equilibrio deseado entre portabilidad, velocidad de desarrollo, rendimiento en ejecución y seguridad. Los lenguajes modernos suelen combinar lo mejor de ambos mundos. Entender estos conceptos es fundamental para comprender cómo se ejecutan los programas y para elegir la herramienta adecuada para cada tarea.
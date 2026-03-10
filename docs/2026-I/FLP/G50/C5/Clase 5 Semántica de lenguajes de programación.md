# Clase 5: Semántica de lenguajes de programación

## Cómo vamos

1. **Abstracción de datos**
    - Representación inductiva y recursiva.
    - Proceso de desarrollar funciones para datos recursivos.

2. **TADs: Tipos abstractos de datos**
    - Tienen dos partes: implementación e interfaz. La implementación puede cambiar de tipo de representación, pero el programador interactúa con la interfaz, por lo que esto es transparente.
    - Para implementar un TAD:
        1. **Constructores**: Permiten crear un elemento perteneciente al TAD.
        2. **Observadores**: Predicados para validar qué variante es y los extractores para extraer la información dentro de los TAD.
    - **Alcance y ligadura de variables**:
        1. `let`: Alcance en bloque (funcional).
        2. `let*`: Alcance secuencial (imperativo).
        3. `letrec`: Alcance recursivo.
    - **Diseño de TADs**: Representación basada en listas, basada en procedimientos y los datatypes.
        - Los datatypes son independientes del tipo y son una representación basada en la gramática.

```scheme
; Definición de un datatype para árboles binarios
(define-datatype tree tree?
  (empty-node)                     ; Constructor para nodo vacío
  (non-empty-node                  ; Constructor para nodo con contenido
    (key symbol?)                  ; La clave es un símbolo
    (left tree?)                   ; Subárbol izquierdo
    (right tree?)                  ; Subárbol derecho
  )
)

; Función para convertir un árbol en una lista en recorrido preorden
(define tree->list
  (lambda (arb)
    (cases tree arb                ; Abre el datatype 'tree'
      (empty-node () '())          ; Caso base: nodo vacío devuelve lista vacía
      (non-empty-node (k l r)      ; Caso recursivo: nodo con clave y subárboles
        (append
          (list k)                 ; Agrega la clave actual
          (tree->list l)           ; Recorre recursivamente el subárbol izquierdo
          (tree->list r)           ; Recorre recursivamente el subárbol derecho
        )
      )
    )
  )
)
```

- Recordar: cuando se trabaja con datos recursivos, en el caso recursivo se debe llamar a la misma función.

3. **Representación concreta vs. abstracta**:
    - **Representación concreta**: El código fuente.
    - **Representación abstracta**: AST (Árbol de sintaxis abstracta).
        - **Parser** (concreta a abstracta): Se usan los constructores que provee el datatype.
        - **Unparser** (abstracta a concreta): Se usa `cases` para abrir el TAD y generar la representación concreta.

## Conceptos teóricos adicionales

- **Semántica de lenguajes**: Estudio del significado de los programas, contrastando con la sintaxis (estructura). Incluye semántica operacional, denotacional y axiomática.
- **AST (Árbol de sintaxis abstracta)**: Representación jerárquica de la estructura del programa, eliminando detalles sintácticos superficiales (como paréntesis, puntos y coma). Es fundamental para análisis estático, optimización e interpretación.
- **TAD (Tipo abstracto de datos)**: Encapsula una estructura de datos ocultando su implementación. Solo se interactúa a través de operaciones definidas en su interfaz, promoviendo modularidad y mantenibilidad.
- **Alcance (scope)**:
    - **Estático (léxico)**: Las variables se resuelven según la estructura del código (como en `let`).
    - **Dinámico**: Las variables se resuelven en tiempo de ejecución según el flujo de llamadas.
- **Ligadura (binding)**: Asociación entre un identificador y una entidad (valor, procedimiento, etc.). Puede ser temprana (en compilación) o tardía (en ejecución).

## Tabla de resumen

| Concepto | Descripción | Ejemplo/Nota |
|----------|-------------|--------------|
| Abstracción de datos | Ocultar detalles de implementación, mostrando solo operaciones esenciales. | Representaciones inductivas/recursivas. |
| TAD (Tipo abstracto de datos) | Estructura que separa interfaz (uso) de implementación (representación interna). | Constructores y observadores. |
| Constructores | Funciones que crean instancias del TAD. | `empty-node`, `non-empty-node`. |
| Observadores | Funciones que inspeccionan o extraen información del TAD. | `tree?`, `cases`. |
| Alcance en bloque (`let`) | Las variables son visibles solo dentro del bloque, sin dependencia secuencial. | Alcance funcional. |
| Alcance secuencial (`let*`) | Las variables se definen en secuencia, pudiendo referenciar las anteriores. | Alcance imperativo. |
| Alcance recursivo (`letrec`) | Permite definiciones mutuamente recursivas dentro del mismo bloque. | Usado para procedimientos recursivos. |
| Datatypes | Definición de tipos inductivos basados en gramática, independientes de representación concreta. | `define-datatype` en Scheme. |
| Representación concreta | Código fuente textual con sintaxis específica. | Programa escrito por el desarrollador. |
| Representación abstracta (AST) | Árbol que captura la estructura lógica del programa, sin detalles sintácticos. | Resultado del parsing. |
| Parser | Convierte representación concreta en abstracta (construye AST). | Usa constructores del datatype. |
| Unparser | Convierte representación abstracta en concreta (genera código). | Usa `cases` para extraer y formatear. |
| Recursión en datos | Estructuras que se definen en términos de sí mismas, requiriendo casos base y recursivos. | Árboles, listas. |

## Comentarios adicionales

- La separación entre representación concreta y abstracta es clave en el diseño de lenguajes: el AST facilita la manipulación y transformación de programas (por ejemplo, en optimizaciones de compiladores).
- Los TADs no solo encapsulan datos, sino que también pueden garantizar invariantes (por ejemplo, un árbol binario de búsqueda siempre ordenado).
- En semántica operacional, el AST es el estado inicial sobre el cual se definen reglas de evaluación paso a paso.
- El uso de `cases` en Scheme (EOPL style) es un patrón de "pattern matching" primitivo que permite descomponer datatypes de manera segura y legible.
- La recursión estructural (como en `tree->list`) sigue naturalmente la definición inductiva del datatype, asegurando terminación si hay casos base bien definidos.
- La elección entre `let`, `let*` y `letrec` afecta no solo el alcance, sino también la posibilidad de referencias circulares y el orden de evaluación.


# Temas

1. [Introduccion a la interpretacion y compilacion](Introduccion%20a%20la%20interpretacion%20y%20compilacion.md)
2. [Scanner parser interprete](Scanner%20parser%20interprete.md)
3. [Introduccion a la interpretacion y compilacion](Introduccion%20a%20la%20interpretacion%20y%20compilacion.md)
4. [Interpretador simple](Interpretador%20simple.md)
5. [Resumen](Resumen.md)
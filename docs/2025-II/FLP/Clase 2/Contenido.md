# Objetivos

Entender la especificación de datos y programas
- Representación inductiva
- Representación basada en gramáticas (BNC)
Especificación recursiva de programas
Alcance de variables/ligaduras
- let
- let*
- letrec

# Contenido
1. [Representación inductiva](Representación%20inductiva.md)
2. [Representacion gramaticas](Representacion%20gramaticas.md)
3. [Especificacion recursiva de programas](Especificacion%20recursiva%20de%20programas.md)
4. [Alcance](Alcance.md)
5. [Ejemplo representacion de programas](Ejemplo%20representacion%20de%20programas.md)

# Resumen

**TABLA COMPARATIVA: DATOS RECURSIVOS Y ALCANCE**

| Concepto | Representación Inductiva | Gramáticas BNC | Ámbito Léxico | Ocurrencia Libre/Ligada |
|----------|--------------------------|----------------|---------------|--------------------------|
| **Definición** | Datos definidos por casos base y recursivos | Especificación formal de estructuras sintácticas | Reglas de visibilidad de variables | Análisis de variables no ligadas |
| **Caso Base** | Elemento inicial (ej: 0, lista vacía) | Terminal (ej: número, símbolo) | Binding más externo | Variable igual al parámetro buscado |
| **Caso Recursivo** | Construcción a partir de casos anteriores | No-terminal con componentes | Bindings internos anidados | Búsqueda en subexpresiones |
| **Ejemplo** | Múltiplos de 6: 6, 12, 18... | `<arbol> ::= <int> \| <symbol> <arbol> <arbol>` | `let`, `let*`, `letrec` | `(lambda (x) (x y))` - x ligada, y libre |
| **Recursión** | Reducción al caso base (resta) | Procesamiento de subcomponentes | Resolución por ámbito anidado | Búsqueda recursiva en expresiones |
| **Resultado** | Validación de pertenencia | Construcción/validación de estructuras | Evaluación de expresiones | Determinación de libertad de variables |

| Concepto             | Representación Inductiva                    | Gramáticas BNC                                   | Ámbito Léxico (let/let*/letrec)      | Ocurrencia Libre/Ligada                  | Tipos de Datos Recursivos          |
| -------------------- | ------------------------------------------- | ------------------------------------------------ | ------------------------------------ | ---------------------------------------- | ---------------------------------- |
| **Definición**       | Datos definidos por casos base y recursivos | Especificación formal de estructuras sintácticas | Reglas de visibilidad de variables   | Análisis de variables no ligadas         | Estructuras autoreferenciales      |
| **Caso Base**        | Elemento inicial (ej: 0, lista vacía)       | Terminal (ej: número, símbolo)                   | Binding más externo                  | Variable igual al parámetro buscado      | Hoja/nodo terminal                 |
| **Caso Recursivo**   | Construcción a partir de casos anteriores   | No-terminal con componentes                      | Bindings internos anidados           | Búsqueda en subexpresiones               | Nodo con referencias a sí mismo    |
| **Sintaxis**         | Ecuaciones matemáticas                      | BNF/BNC                                          | `(let ((x 1)) ...)`                  | `(occurs-free? exp var)`                 | `(define-datatype ...)`            |
| **Ejemplo**          | Múltiplos de 6: 6, 12, 18...                | `<arbol> ::= <int> \| <symbol> <arbol> <arbol>`  | `let*` permite referencia secuencial | `(lambda (x) (x y))` - x ligada, y libre | Listas, árboles, expresiones λ     |
| **Recursión**        | Reducción al caso base                      | Procesamiento de subcomponentes                  | Resolución por ámbito anidado        | Búsqueda recursiva en expresiones        | Procesamiento por pattern matching |
| **Validación**       | Funciones recursivas de pertenencia         | Parsers/validadores sintácticos                  | Evaluación de expresiones            | Determinación de libertad de variables   | Verificación de estructura         |
| **Ámbito**           | N/A                                         | N/A                                              | Léxico (donde se define)             | Depende de ligaduras λ                   | N/A                                |
| **Mutual Recursión** | No aplica                                   | No aplica                                        | `letrec` para referencias mutuas     | Variables ligadas en diferentes λ        | Estructuras recursivas mutuas      |
| **Aplicación**       | Conjuntos inductivos                        | Lenguajes de programación                        | Evaluación de expresiones            | Análisis estático                        | Estructuras de datos complejas     |
| **Resultado**        | Validación de pertenencia                   | Construcción/validación de estructuras           | Valor de la expresión                | Booleano (free/not free)                 | Datos procesados                   |

**MENSAJE PARA LOS ESTUDIANTES EN FUGA:**

La recursión parece infinita hasta que encuentras el caso base. Así como sus motos encontraron un destino, ustedes encontrarán la solución. Regresen, el único error real es abandonar el proceso. La desesperación es una variable ligada que pueden redefinir.

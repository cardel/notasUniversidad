# Intérprete Simple

## Gramática del Lenguaje

Tenemos un primer intérprete que tiene la siguiente gramática:

```ebnf
<programa> ::= <expresion>

<expresion> ::= <numero>
                lit-exp(num)
            ::= <identificador>
                var-exp(id)
            ::= <primitiva> "(" <expresion>*(,) ")"
                prim-exp(prim, exps)

<primitiva> ::= "+"
                add-prim()
            ::= "-"
                sub-prim()
            ::= "*"
                mult-prim()
            ::= "/"
                div-prim()
            ::= "add1"
                add1-prim()
            ::= "sub1"
                sub1-prim()
```

## Conceptos Teóricos

1. **Valores expresados**: Es el tipo de dato que retorna el intérprete como resultado de evaluar una expresión. En este caso, son números.
2. **Valores denotados**: Son aquellos que están almacenados en los ambientes (entornos) y representan el valor asociado a cada variable.

## El TAD de Ambientes

El TAD (Tipo Abstracto de Datos) de ambientes representa el lugar donde almacenamos las ligaduras (asociaciones variable-valor).

1. **Ambiente**: Puede ser vacío o extendido (cuando se agregan nuevas ligaduras).
2. **Apply-env**: Función que busca una variable dentro del ambiente y retorna su valor asociado.
Esto es un datatype por aparte, no se incluye en la gramática, dado que no tiene sentido especificar los ambientes en el código fuente.d

## Estructura del Intérprete

Cuando se evalúa un programa, se extrae la expresión interna y se envía a otra función junto con el ambiente para evaluarla.

```scheme
;; Crea un REPL (Read-Eval-Print Loop) interactivo para el lenguaje
(define interpretador
  (sllgen:make-rep-loop "-->" evaluar-programa
                        (sllgen:make-stream-parser
                         especificacion-lexica especificacion-gramatical)))
                         
;; Función principal que evalúa un programa completo
(define evaluar-programa
  (lambda (pgm)
    (cases programa pgm
      (a-program (exp) (evaluar-expresion exp ambiente-inicial)) ; Extrae la expresión y la evalúa en el ambiente inicial
      ))
  ) 
  
;; Función que evalúa una expresión en un ambiente dado
(define evaluar-expresion
  (lambda (exp amb)
    (cases expresion exp
      .... ; Patrones para cada tipo de expresión
    )
  )
)                       
```

## Pruebas del Intérprete

Podemos hacer diferentes pruebas con las funciones de este intérprete:

```scheme
;; Parseo de una expresión con múltiples argumentos
(parser "-(1,2,3,x)")
#(struct:a-program
  #(struct:prim-exp
    #(struct:minus-prim)
    (#(struct:lit-exp 1)
     #(struct:lit-exp 2)
     #(struct:lit-exp 3)
     #(struct:var-exp x)))) 

;; Evaluación de variables en el ambiente inicial
> (evaluar-expresion (var-exp 'x) ambiente-inicial)
1
> (evaluar-expresion (var-exp 'y) ambiente-inicial)
2

;; Evaluación de una expresión con operación primitiva
> (evaluar-expresion (prim-exp (sum-prim) (list (lit-exp 10) (lit-exp 20))) ambiente-inicial)
30

;; Parseo de una expresión de suma
(parser "+(10,20)")
#(struct:a-program
  #(struct:prim-exp #(struct:sum-prim) (#(struct:lit-exp 10) #(struct:lit-exp 20))))
```

## Consideraciones de Implementación

Para operar esto usted debe tener presente **qué llega en cada caso**, es decir, cómo está estructurado el AST:

- **Datatypes de expresiones**: Representan lo que se escribe (código fuente). Son las estructuras que vienen del parser.
- **Datatypes de valores**: Representan los ambientes y valores internos. Son las estructuras con las que trabaja el evaluador.

## Tabla de Resumen

Concepto | Descripción | Ejemplo en el Código
--- | --- | ---
**Valor Expresado** | Resultado final de evaluar una expresión. | Número retornado por `evaluar-expresion`.
**Valor Denotado** | Valor almacenado en el ambiente asociado a una variable. | El valor `1` asociado a `'x` en `ambiente-inicial`.
**Ambiente** | Estructura que almacena ligaduras variable-valor. | `ambiente-inicial`, `(extended-env ...)`.
**Apply-env** | Función que busca una variable en el ambiente. | `(apply-env amb 'x)` retorna el valor de `x`.
**REPL** | Bucle interactivo de lectura-evaluación-impresión. | `interpretador` creado con `sllgen:make-rep-loop`.
**Evaluación de Programa** | Proceso que toma un AST de programa y retorna un valor. | `evaluar-programa` extrae la expresión y llama a `evaluar-expresion`.
**Evaluación de Expresión** | Proceso que toma un AST de expresión y un ambiente, retorna un valor. | `evaluar-expresion` usa `cases` para procesar cada tipo de expresión.

## Comentarios Adicionales

1. **Separación de Fases**: El diseño separa claramente el parsing (análisis sintáctico) de la evaluación (semántica). El parser construye el AST, y el evaluador trabaja sobre esa estructura.
2. **Ambientes como Parámetro**: El ambiente se pasa explícitamente como parámetro a `evaluar-expresion`, lo que permite un control preciso sobre el contexto de evaluación y facilita la implementación de características como ámbitos léxicos.
3. **Patrón de Diseño Visitor**: La función `cases` implementa un patrón similar al Visitor, donde se define el comportamiento para cada variante del tipo de dato algebraico (cada tipo de expresión).
4. **Extensibilidad**: Para agregar nuevas características al lenguaje (nuevos tipos de expresiones, operadores), se deben extender tanto la especificación gramatical como las funciones de evaluación correspondientes.
5. **Ambiente Inicial**: El ambiente inicial típicamente contiene definiciones preestablecidas (como operadores primitivos o constantes comunes) que están disponibles en todos los programas.
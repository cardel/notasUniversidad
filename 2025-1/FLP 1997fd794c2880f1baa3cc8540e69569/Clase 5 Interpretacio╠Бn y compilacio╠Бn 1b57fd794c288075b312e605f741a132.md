# Clase 5: Interpretación y compilación

# Conceptos

Código de lenguajes de programación

- El código escrito por el programador se conoce **lenguaje fuente/código fuente/lenguaje definido.**
- Posteriormente es pasado por un frontend el cual extrae las partes significativas del código y construye el AST
    - Verifica la correcta escritura del código, si el código no se escribe no se puede generar AST: Error de sintaxis
    - Ejecuta el código a partir del AST

---

Interprete

1. Toma un AST y produce una respuesta
2. Está escrito en un lenguaje de implemetación: Java/Python C/C++

---

Lenguaje interpretados vs compilados

- Interpretado son más lentos, pero permiten tener un alto nivel (no preocuparse por aspectos del hardware, memoria)): Python, javascript, Java (parcialmente), AST el cual es leido por el interprete. Codigo fuente → AST → Interpretado
- Compilado son más rapido, pero no son tan flexibles como interpretados: ASM, Pascal, C, C++ → Generan un binario que se ejecuta directamente en la máquina: Codigo fuente → AST → Codigo maquina (ASM)

## Frontend (Interpretador/Compilación)

Frontend

1. Es un paso fundamental para un compilar/interpretar un programa
2. Transforma código fuente en un  AST
3. El código fuente es una cadena de texto, por lo que se requiere procesarla

---

Scanner

Toma el código fuente y lo transforma en unidades significativas

1. Facilitar el procesamiento de la cadena de texto
2. Extraer información útil para la generación del AST
3. Descartar información que no sea util: comentarios
4. Genera un conjunto unidades léxica/lexemas/tokens

---

Parsing

Toma un un conjunto de unidades significativas y genera el AST

---

Gramática

- Un conjunto de datatypes
- Un conjunto de reglas sintacticas para el escribir el código.

# Interpretador simple

Valores en lenguaje

Cada lenguaje tiene como mı́nimo dos conjuntos:
Los valores expresados: posibles valores de expresiones, y
Los valores denotados: valores limitados a las variables.

# Ejercicio

[2025-03-13-Note-09-46_annotated.pdf](Clase%205%20Interpretacio%CC%81n%20y%20compilacio%CC%81n%201b57fd794c288075b312e605f741a132/2025-03-13-Note-09-46_annotated.pdf)

```racket
#lang eopl
(define especificacion-lexica
  '(
    (espacio-blanco (whitespace) skip)
    (comentario ("#" (arbno (not #\newline))) skip)
    (identificador (letter (arbno (or letter digit "?" "$" "!"))) symbol)
    (numero (digit (arbno digit)) number)
    (numero ("-" digit (arbno digit)) number)
    (numero (digit (arbno digit)"." digit (arbno digit)) number)
    (numero ("-" digit (arbno digit)"." digit (arbno digit)) number)
    )
  )

(define especificacion-gramatical
  '(
    (programa (expresion) a-program)
    (expresion (numero) lit-exp)
    (expresion (identificador) var-exp)
    (expresion ("(" expresion primitiva expresion ")") prim-exp)
    (primitiva ("+") sum-prim)
    (primitiva ("-") minus-prim)
    (primitiva ("*") mult-prim)
    (primitiva ("/") div-prim)
    (primitiva ("add1") add-prim)
    (primitiva ("sub1") sub-prim)
    (primitiva ("**") pot-prim)
    (primitiva ("%") mod-prim)
    )
  )

;;Creamos los datatypes automaticamente
(sllgen:make-define-datatypes especificacion-lexica especificacion-gramatical)

;;Evaluar programa
(define evaluar-programa
  (lambda (pgm)
    (cases programa pgm
      (a-program (exp) (evaluar-expresion exp ambiente-inicial))
      ))
  )

;;ambientes
(define-datatype ambiente ambiente?
  (ambiente-vacio)
  (ambiente-extendido
   (lids (list-of symbol?))
   (lvalue (list-of number?))
   (old-env ambiente?)))

;;apply-env: ambiente -> numero
(define apply-env
  (lambda (env var)
    (cases ambiente env
      (ambiente-vacio () (eopl:error "No se encuentra la variable " var))
      (ambiente-extendido (lid lval old-env)
                          (letrec
                              (
                               (buscar-variable (lambda (lid lval old-env)
                                                  (cond
                                                    [(null? lid) (apply-env old-env var)]
                                                    [(equal? (car lid) var) (car lval)]
                                                    [else
                                                     (buscar-variable (cdr lid) (cdr lval) old-env)]
                                                    )
                                                  )
                                                )
                               )
                            (buscar-variable lid lval old-env)
                            )
                          
                          )
      )
    )
  )

(define ambiente-inicial
  (ambiente-extendido '(x y z) '(1 2 3)
                      (ambiente-extendido '(a b c) '(4 5 6)
                                          (ambiente-vacio))))

;;Evaluar expresion
;;evaluar-expresion: expresion -> numero (valor expresado)
(define evaluar-expresion
  (lambda (exp amb)
    (cases expresion exp
      (lit-exp (dato) dato)
      (var-exp (id) (apply-env amb id))
      (prim-exp (exp1 prim exp2)
                (let
                    (
                     (num1 (evaluar-expresion exp1 amb))
                     (num2 (evaluar-expresion exp2 amb))
                     )
                  (evaluar-primitiva prim num1 num2)
                  )
                )
      )
    )
  )

;;Manejo de primitivas
(define evaluar-primitiva
  (lambda (prim n1 n2)
    (cases primitiva prim
      (sum-prim () (+ n1 n2))
      (minus-prim () (- n1 n2))
      (mult-prim () (* n1 n2))
      (div-prim () (/ n1 n2))
      (add-prim () (+ n1 1))
      (sub-prim () (- n1 1))
      (pot-prim () (expt n1 n2))
      (mod-prim () (modulo n1 n2))
      )
    )
  )

;;Interpretador
(define interpretador
  (sllgen:make-rep-loop "-->" evaluar-programa
                        (sllgen:make-stream-parser
                         especificacion-lexica especificacion-gramatical)))

(interpretador)
```
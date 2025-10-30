Debemos incluir las expresiones de tipo:

1. **proc**
2. **letrec**

```scheme
proc(int x) ...
proc((int*int -> int) x)
proc((int -> (int*int -> int)) x)

letrec
    int f(int x, int y) = ....
    (int*int -> int) g(int x) = ....
```

## Modificaciones en la gramática

```scheme
(expression ("proc" "(" (separated-list type-exp identifier ",") ")" expression) proc-exp)
(expression ("letrec" (arbno
                       type-exp identifier "(" (separated-list type-exp identifier ",") ")"
                       "=" expression)
                      "in"
                      expression) letrec-exp)
(type-exp ("int") int-exp)
(type-exp ("bool") bool-exp)
(type-exp
 ("(" (separated-list type-exp "*") "->" type-exp ")") proc-type-exp)
```

## Representación de tipos

Se definen dos tipos principales:

1. **Tipo atómico**: Tipo primitivo, no compuesto por otros tipos
2. **Tipo procedimiento**: Especifica tipos de argumentos y tipo del resultado

```scheme
; Tipos
(define-datatype type type?
  (atomic-type
   (nombre symbol?))
  (proc-type
   (arg-type (list-of type?))
   (result-t type?)))

; int
(define int-type (atomic-type 'int))
; bool
(define bool-type (atomic-type 'bool))
```
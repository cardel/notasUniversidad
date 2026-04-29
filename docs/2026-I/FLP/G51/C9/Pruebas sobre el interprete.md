# Pruebas sobre el intérprete

## Pruebas de chequeo de tipos

A continuación se presentan pruebas ejecutadas sobre el intérprete de tipos, mostrando tanto casos exitosos como errores detectados.

```scheme
; Prueba 1: Tipo de una variable simple en un let
(type-of-program (scan&parse "let x = 10 in x"))
; Resultado: #(struct:atomic-type int)
; El tipo de x es int, ya que 10 es un literal numérico

> (type-to-external-form (type-of-program (scan&parse "let x = 10 in x")))
; Resultado: int
; type-to-external-form convierte la representación interna a formato legible

; Prueba 2: Tipo de un procedimiento como valor
> (type-to-external-form (type-of-program (scan&parse "let x = proc(int a, int b) +(a,b) in x")))
; Resultado: (int * int -> int)
; El tipo de x es el tipo del procedimiento: recibe dos int y retorna int

; Prueba 3: Aplicación correcta de un procedimiento
> (type-to-external-form (type-of-program (scan&parse "let x = proc(int a, int b) +(a,b) in (x 1 2)")))
; Resultado: int
; (x 1 2): x espera (int * int), 1 es int, 2 es int (match), retorna int

; Prueba 4: Error por tipo incorrecto en argumento
> (type-to-external-form (type-of-program (scan&parse "let x = proc(int a, int b) +(a,b) in (x 1 true)")))
; Resultado: . . check-equal-type!: Types didn’t match: bool != int in
; #(struct:true-exp)
; Error: Se esperaba int como segundo argumento, pero se proporcionó true (bool)
; El chequeo de tipos detecta la inconsistencia en tiempo de análisis estático

; Prueba 5: Error por número incorrecto de argumentos
> (type-to-external-form (type-of-program (scan&parse "let x = proc(int a, int b) +(a,b) in (x 1 2 3)")))
; Resultado: . . type-of-expression: Wrong number of arguments in expression
; #(struct:app-exp #(struct:var-exp x) (#(struct:lit-exp 1) #(struct:lit-exp 2) #(struct:lit-exp 3))):
; expected (int int)
; got (int int int)
; Error: x espera exactamente 2 argumentos, pero se proporcionaron 3

; Prueba 6: Procedimiento recursivo con letrec (caso exitoso)
(type-to-external-form (type-of-program (scan&parse "letrec
int f(int a, bool b) = if b then +(a, (f -(a,1) <(a,0))) else a in (f 3 true)")))
; Resultado: int
; f: (int * bool) -> int
; (f 3 true): 3 es int, true es bool (match), retorna int
; El cuerpo recursivo es consistente: -(a,1) es int, <(a,0) es bool, f espera (int * bool)

; Prueba 7: Tipo del procedimiento recursivo como valor
> (type-to-external-form (type-of-program (scan&parse "letrec
int f(int a, bool b) = if b then +(a, (f -(a,1) <(a,0))) else a in f")))
; Resultado: (int * bool -> int)
; Al evaluar f directamente (sin aplicarlo), obtenemos su tipo como valor de procedimiento

; Prueba 8: Error por inconsistencia en las ramas del if
> (type-to-external-form (type-of-program (scan&parse "letrec
int f(int a, bool b) = if b then +(a, (f -(a,1) <(a,0))) else b in f")))
; Resultado: . . check-equal-type!: Types didn’t match: int != bool in
; #(struct:if-exp #(struct:var-exp b) 
;   #(struct:primapp-exp #(struct:add-prim) 
;     (#(struct:var-exp a) 
;      #(struct:app-exp #(struct:var-exp f) 
;        (#(struct:primapp-exp #(struct:substract-prim) (#(struct:var-exp a) #(struct:lit-exp 1))) 
;         #(struct:primapp-exp #(struct:menor-prim) (#(struct:var-exp a) #(struct:lit-exp 0))))))) 
;   #(struct:var-exp b))
; Error: La rama then retorna int (por la suma +(a, ...)), pero la rama else retorna bool (b)
; El if requiere que ambas ramas tengan el mismo tipo
```

---

## Tabla resumen de conceptos

| Concepto | Descripción | Ejemplo de prueba |
|----------|-------------|-------------------|
| **type-of-program** | Función que calcula el tipo de un programa completo a partir de su representación interna | `(type-of-program (scan&parse "let x = 10 in x"))` retorna `atomic-type int` |
| **type-to-external-form** | Función que convierte la representación interna de tipos a formato legible | `(type-to-external-form ...)` retorna `int`, `(int * int -> int)` |
| **scan&parse** | Función que analiza sintácticamente una cadena y produce un AST (Árbol de Sintaxis Abstracta) | `(scan&parse "let x = 10 in x")` |
| **Tipo atómico** | Tipo básico como int o bool | `#(struct:atomic-type int)` |
| **Tipo de procedimiento** | Tipo compuesto que describe argumentos y retorno | `(int * bool -> int)` |
| **Aplicación correcta** | Cuando los tipos de los argumentos coinciden con los esperados | `(x 1 2)` con x: `(int * int -> int)` |
| **Error de tipo en argumento** | Cuando un argumento no coincide con el tipo esperado | `(x 1 true)` espera int, recibe bool |
| **Error de número de argumentos** | Cuando se proporcionan más o menos argumentos de los esperados | `(x 1 2 3)` espera 2, recibe 3 |
| **Inconsistencia en if** | Cuando las ramas then y else del if no tienen el mismo tipo | `if b then +(a, ...) else b` then retorna int, else retorna bool |
| **Recursión en letrec** | Permite que un procedimiento se llame a sí mismo con tipos consistentes | `f -(a,1) <(a,0)` donde f espera `(int * bool)` |

**Comentarios adicionales:**
- El intérprete de tipos utiliza un **enfoque compositional**: cada expresión tiene reglas de tipado que dependen únicamente de los tipos de sus subexpresiones.
- Los errores se reportan con información detallada: muestran la expresión exacta donde ocurre el error y los tipos que entraron en conflicto.
- La función `type-to-external-form` es útil para depuración, ya que presenta los tipos en un formato más legible que la representación interna con structs.
- El chequeo de tipos en **letrec** requiere que el tipo del procedimiento esté disponible en el ambiente antes de verificar el cuerpo, permitiendo así la recursión.
- Las pruebas muestran que el sistema detecta tres tipos de errores: tipo incorrecto, número incorrecto de argumentos e inconsistencia en las ramas del condicional.
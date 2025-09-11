
# Define-datatype
La función `define-datatype` en EOPL (Essentials of Programming Languages) es una herramienta fundamental para definir **tipos algebraicos de datos (TAD)** en Scheme/Racket. Permite crear tipos recursivos con múltiples variantes (constructores), cada una con sus propios campos y verificadores de tipos.

---

### Partes de `define-datatype`:

1. **Nombre del tipo**:  
   `lc-exp` es el nombre del tipo de dato que se está definiendo.

2. **Predicado del tipo**:  
   `lc-exp?` es un procedimiento generado automáticamente que verifica si un valor pertenece al tipo `lc-exp`.

3. **Variantes (constructores)**:
   - `var-exp`: Constructor para variables.
     - Campo: `id` (debe ser un símbolo, verificado con `symbol?`).
   - `lambda-exp`: Constructor para expresiones lambda.
     - Campos:
       - `lid`: una lista de símbolos (verificado con `(list-of symbol?)`).
       - `exp`: una expresión lambda (verificado con `lc-exp?`).
   - `app-exp`: Constructor para aplicaciones de funciones.
     - Campos:
       - `rator`: el operador (una expresión lambda, verificado con `lc-exp?`).
       - `rand`: el operando (una expresión lambda, verificado con `lc-exp?`).

---

### Tipos de procedimientos generados (TAD):

1. **Constructores**:  
   Se generan procedimientos para cada variante:
   - `var-exp`: Crea una expresión de variable.
   - `lambda-exp`: Crea una expresión lambda.
   - `app-exp`: Crea una expresión de aplicación.

   Ejemplo:  
   `(var-exp 'x)` construye una expresión variable con el símbolo `x`.

2. **Predicado del tipo**:  
   `lc-exp?` verifica si un valor es del tipo `lc-exp`.

3. **Reconocedores de variante**:  
   Para cada variante se genera un predicado:
   - `var-exp?`: Verifica si una expresión es de variante `var-exp`.
   - `lambda-exp?`: Verifica si es una expresión lambda.
   - `app-exp?`: Verifica si es una aplicación.

4. **Extractores de campos**:  
   Para cada campo de cada variante se genera un extractor:
   - Para `var-exp`:
     - `id`: Extrae el símbolo del identificador.
   - Para `lambda-exp`:
     - `lid`: Extrae la lista de parámetros.
     - `exp`: Extrae el cuerpo de la lambda.
   - Para `app-exp`:
     - `rator`: Extrae el operador.
     - `rand`: Extrae el operando.
- Estos extractores vamos a manejarlos con los cases

---

### Ejemplo de uso:

```scheme
; Construcción
(define exp1 (var-exp 'x))
(define exp2 (lambda-exp '(x) (var-exp 'x)))
(define exp3 (app-exp (var-exp 'f) (var-exp 'a)))

; Verificación
(lc-exp? exp1)        ; #t
(var-exp? exp1)       ; #t
(lambda-exp? exp2)    ; #t

; Extracción
(var-exp-id exp1)     ; 'x
(lambda-exp-lid exp2) ; '(x)
(lambda-exp-exp exp2) ; (var-exp 'x)
```

---

### Resumen de procedimientos generados para `lc-exp`:

| Procedimiento      | Tipo         | Descripción |
|-------------------|--------------|-------------|
| `var-exp`         | Constructor  | Crea una variable |
| `lambda-exp`      | Constructor  | Crea una lambda |
| `app-exp`         | Constructor  | Crea una aplicación |
| `lc-exp?`         | Predicado    | Verifica el tipo |
| `var-exp?`        | Predicado    | Verifica variante |
| `lambda-exp?`     | Predicado    | Verifica variante |
| `app-exp?`        | Predicado    | Verifica variante |
| `var-exp-id`      | Extracto     | Obtiene el id |
| `lambda-exp-lid`  | Extracto     | Obtiene los parámetros |
| `lambda-exp-exp`  | Extracto     | Obtiene el cuerpo |
| `app-exp-rator`   | Extracto     | Obtiene el operador |
| `app-exp-rand`    | Extracto     | Obtiene el operando |

Esto permite un manejo tipo-safe y pattern matching mediante `cases` (otra construcción de EOPL) para procesar expresiones de manera recursiva.

# Ejemplo

```lisp
#lang eopl
#|
<lc-exp> ::= <identificador>
          var-exp(id)
         ::= "lambda" "(" <identificador>* ")" <lc-exp>
          lambda-exp(lid, exp)
         ::= "(" <lc-exp> <lc-exp> ")"
          app-exp(rator, rand)
|#

(define-datatype lc-exp lc-exp?
  (var-exp (id symbol?))
  (lambda-exp
   (lid (list-of symbol?))
   (exp lc-exp?)
   )
  (app-exp
   (rator lc-exp?)
   (rand lc-exp?)
   ))

(define exp1 (var-exp 'x))
(define exp2 (lambda-exp '(x y z) (var-exp 'y)))
(define exp3 (app-exp
	(app-exp 
		(lambda-exp  '(a b c) (lambda-exp '(x y z) (var-exp 'x)))
		(var-exp 'z)
	)
	(lambda-exp '(a b c d e f) (var-exp 'e))
))
(define exp4 (app-exp
	(app-exp
		(app-exp
			(app-exp
				(var-exp 'x)
				(lambda-exp '(a b c) 
					(var-exp 'y)
				)
			)
			(app-exp
				(lambda-exp '(x y z) (var-exp 'p))
				(lambda-exp '(m n o p q r t u)
					(lambda-exp '(v w x y z)
						(lambda-exp
							 '(a b c)
							 (var-exp 'p)
						)
					)
				)
			)
		)
		(app-exp
			(var-exp 's)
			(var-exp 'r)
		)
	)
	(app-exp
		(app-exp
			(var-exp 'a)
			(var-exp 'b)
		)
		(var-exp 'x)
	)
))
```

```lisp
> exp1
#(struct:var-exp x)
> exp2
#(struct:lambda-exp (x y z) #(struct:var-exp y))
> exp3
#(struct:app-exp
  #(struct:app-exp
    #(struct:lambda-exp (a b c) #(struct:lambda-exp (x y z) #(struct:var-exp x)))
    #(struct:var-exp z))
  #(struct:lambda-exp (a b c d e f) #(struct:var-exp e)))
> exp4
#(struct:app-exp
  #(struct:app-exp
    #(struct:app-exp
      #(struct:app-exp #(struct:var-exp x) #(struct:lambda-exp (a b c) #(struct:var-exp y)))
      #(struct:app-exp
        #(struct:lambda-exp (x y z) #(struct:var-exp p))
        #(struct:lambda-exp
          (m n o p q r t u)
          #(struct:lambda-exp (v w x y z) #(struct:lambda-exp (a b c) #(struct:var-exp p))))))
    #(struct:app-exp #(struct:var-exp s) #(struct:var-exp r)))
  #(struct:app-exp
    #(struct:app-exp #(struct:var-exp a) #(struct:var-exp b))
    #(struct:var-exp x)))
```

# Extractores TAD
Para esto vamos a utilizar los cases, los cases son reconocimiento de patrones.

Esto nos permite integrar los predicados y extractores en un solo entorno.

Los **`cases`** en EOPL (Essentials of Programming Languages) son una construcción que permite realizar **pattern matching** sobre los tipos de datos definidos con `define-datatype`. Proporcionan una forma elegante y segura de descomponer y procesar las variantes de un tipo algebraico.

---

### Estructura de `cases`:

La forma general es:

```scheme
(cases <tipo> <expresión>
  (<variante1> (<campo1> <campo2> ...) <cuerpo1>)
  (<variante2> (<campo1> <campo2> ...) <cuerpo2>)
  ...
  (else <cuerpo-else>))
```

---

### Relación con `define-datatype`:

1. **Se establece en el tipo definido**:  
   El `<tipo>` en `cases` debe coincidir con el nombre del tipo definido con `define-datatype` (ej: `lc-exp`).

2. **Se aplican los predicados de variante**:  
   Cada cláusula verifica si la expresión coincide con la variante usando el **predicado generado automáticamente** (ej: `var-exp?`, `lambda-exp?`).

3. **Se utilizan los extractores de campos**:  
   Los campos declarados en cada cláusula (ej: `id`, `lid`, `exp`) se **bindean** a los valores extraídos usando los **procedimientos extractores** generados (ej: `var-exp-id`, `lambda-exp-lid`).

---

### Ejemplo con `lc-exp`:

Supongamos que queremos evaluar una expresión lambda-cálculo:

```scheme
(cases <datatype> <variable>
	(<variante1> 
		(campo1 campo2 .. campon)
		<accion>
	)
	(variante2
		(campo1 campo2 ... campon)
		<accion>-
	)
	...
	(varianten
		(campo1 campo2 ... campon)
		<accion>
	)
	(else
		<accion>
	)
)
```

---
Esto permite reconocer el tipo de dato, su variante y sus partes utilizando **pattern matching**


```lisp

(define occurs-free?
  (lambda (exp var)
    (cases lc-exp exp
      (var-exp (id) (equal? var id))
      (lambda-exp
       (lid exp)
       (and (not (member var lid))
            (occurs-free? exp var)))
      (app-exp
       (rator rand)
       (or
        (occurs-free? rator var)
        (occurs-free? rand var))))))

(define expr1 (var-exp 'x)); Identificador caso 1
(define expr2 (lambda-exp '(x) (app-exp (var-exp 'x) (var-exp 'y)))) ; Caso 2 dentro caso 3 (caso 1)
(define expr3 (app-exp (var-exp 'x)  (var-exp 'y))) ; Caso 3 --> Caso 1 y Caso 1
(display (occurs-free? expr1 'x)) ;T
(display "\n")
(display (occurs-free? expr1 'y)) ;F
(display "\n")
(display (occurs-free? expr2 'x)) ;F
(display "\n")
(display (occurs-free? expr2 'y)) ;T
(display "\n")
(display (occurs-free? expr3 'x)) ;T
(display "\n")
(display (occurs-free? expr3 'y)) ;T
```
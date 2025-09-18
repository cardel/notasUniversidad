1. Valores denotados y valores expresados
	1. Los valores denotado son aquellos que están almacenados internamente
	2. Valores expresados son aquellos que el programador maneja directamente
2. Especificación léxica
3. Especificación gramatical.
# Lenguaje de ejemplo

Valores denotados y expresados: Numeros y booleanos

Primitivas: +,-,*,/   and, or, <, <=, >, >=, ==

```bnc
<expression> ::= <identifier>
	             var-exp(id)
	         ::= <number>
	             lit-exp(dat)
	         ::= "true"
	             true-exp()
	         ::= "false"
	             false-exp()
	         ::= <primitive> "(" <expression>* (,) ")"
		         primitive-exp(prim, rands)
		         
<primitive> 
			::= "+" plus-prim()
			::= "-" sub-prim()
			::= "*" times-prim()
			::= "/" div-prim()
			::= "and" and-prim()
			::= "or" or-prim()
			::= ">" more-prim()
			::= ">=" moreeq-prim()
			::= "<" less-prim()
			::= "<=" lesseq-prim()
```

Esto se puede definir así:

```scheme
(define-datatype expression expression?
  (var-exp (id symbol?))
  (lit-exp (dat number?))
  (true-exp)
  (false-exp)
  (prim-exp (prim primitive?)
            (rands (list-of expression?))))

(define-datatype primitive primitive?
  (add-prim)
  (sub-prim)
  (times-prim)
  (div-prim)
  (and-prim)
  (or-prim)
 )
```
A continuación la especificación léxica
```scheme
(define lexical
  '(
    (comment ("%" (arbno (not #\newline))) skip)
    (whitespace (whitespace) skip)
    (number (digit (arbno digit)) number)
    (number ("-" digit (arbno (digit))) number)
    (identifier (letter (arbno (or letter digit))) symbol)
    ))
```

Basado en *Essentials of Programming Languages (EOPL)*, esta es una **especificación léxica** que define los **tokens** (unidades léxicas) de un lenguaje mediante expresiones regulares. Aquí se explica cada parte:

---

### Estructura general:
Cada entrada tiene la forma:  
`(token-name (regex-pattern) action)`  
Donde:
- `token-name`: Nombre del token (ej: `number`, `identifier`).
- `regex-pattern`: Patrón que define la secuencia de caracteres que forman el token.
- `action`: Qué hacer con el token (ej: `skip` para ignorar, `number` para convertirlo a número, `symbol` para tratarlo como símbolo).

---

### Análisis detallado:

#### 1. **Comentarios**:
```scheme
(comment ("%" (arbno (not #\newline))) skip)
```
- **Token name**: `comment`
- **Patrón**:  
  `"%"` → El carácter `%` inicial.  
  `(arbno (not #\newline))` → Cero o más (`arbno`) caracteres que **no** son salto de línea (`#\newline`).  
  → Captura: `%` seguido de cualquier texto hasta el final de la línea (pero sin incluir el `\n`).
- **Acción**: `skip` → Ignorar el token (los comentarios no se procesan sintácticamente).

#### 2. **Números positivos**:
```scheme
(number (digit (arbno digit)) number)
```
- **Token name**: `number`
- **Patrón**:  
  `digit` → Un dígito (0-9).  
  `(arbno digit)` → Cero o más dígitos adicionales.  
  → Captura: secuencias de uno o más dígitos (ej: `0`, `42`, `100`).
- **Acción**: `number` → Convertir la cadena a un valor numérico.

#### 3. **Números negativos**:
```scheme
(number ("-" digit (arbno digit)) number)
```
- **Token name**: `number` (mismo token que arriba, pero para negativos).
- **Patrón**:  
  `"-"` → El signo menos.  
  `digit` → Un dígito.  
  `(arbno digit)` → Cero o más dígitos.  
  → Captura: `-` seguido de uno o más dígitos (ej: `-5`, `-123`).
- **Acción**: `number` → Convertir a número (incluyendo el signo negativo).

#### 4. **Identificadores**:
```scheme
(identifier (letter (arbno (or letter digit))) symbol)
```
- **Token name**: `identifier`
- **Patrón**:  
  `letter` → Una letra (a-z, A-Z).  
  `(arbno (or letter digit))` → Cero o más caracteres que son letras **o** dígitos.  
  → Captura: una letra seguida de letras o dígitos (ej: `x`, `count`, `maxValue123`).
- **Acción**: `symbol` → Tratar el token como un símbolo (usualmente un átomo en el AST).

---

### Resumen de lo que captura:
- **Comentarios**: Líneas que empiezan con `%` (se descartan).
- **Números**: Enteros positivos y negativos (ej: `0`, `123`, `-42`).
- **Identificadores**: Nombres que comienzan con una letra, seguidos de letras/dígitos (ej: `abc`, `var1`).

### Notas según EOPL:
- Esta especificación léxica es típica de un scanner/lexer definido en Scheme/Racket.
- `arbno` significa "arbitrary number" (cero o más repeticiones).
- `or` permite alternativas (ej: letra **o** dígito).
- Los tokens se usan luego en el parser para construir el AST.

# Gramatica

```scheme
(define grammar
  '(
    (program (expression) a-program) ;Punto de partida EOPL
    (expression (identifier) var-exp)
    (expression (number) lit-exp)
    (expression ("true") true-exp)
    (expression ("false") false-exp)
    (expression (primitive "(" (separated-list expression ",") ")") prim-exp)
    (primitive ("+") add-prim)
    (primitive ("-") sub-prim)
    (primitive ("*") prod-prim)
    (primitive ("/") div-prim)
    (primitive ("and") and-prim)
    (primitive ("or") or-prim)
    (primitive ("<") less-prim)
    (primitive ("<=") lesseq-prim)
    (primitive (">") more-prim)
    (primitive (">=") moreeq-prim)
    (primitive ("==") eq-prim)
    (primitive ("!=") neq-prim)
    )
  )
```

Basado en *Essentials of Programming Languages (EOPL)*, esta es una **gramática** definida en Scheme/Racket para un lenguaje de programación simple. Especifica la estructura sintáctica de las expresiones y cómo se construye el AST (Abstract Syntax Tree). Aquí se explica cada parte:

---

### Estructura general:
Cada producción tiene la forma:  
`(non-terminal (components ...) constructor)`  
Donde:
- `non-terminal`: Símbolo no terminal de la gramática (ej: `program`, `expression`).
- `components`: Secuencia de terminales (tokens) o no terminales que forman la producción.
- `constructor`: Función que construye un nodo del AST a partir de los componentes.


#### 1. **Programa**:
```scheme
(program (expression) a-program)
```
- **Producción**: Un programa consiste en una única expresión.
- **Constructor**: `a-program` → Crea un nodo de programa que contiene una expresión.

#### 2. **Expresiones simples**:
```scheme
(expression (identifier) var-exp)
(expression (number) lit-exp)
(expression ("true") true-exp)
(expression ("false") false-exp)
```
- **`var-exp`**: Expresión variable (ej: `x`).
- **`lit-exp`**: Expresión literal numérica (ej: `42`).
- **`true-exp`/`false-exp`**: Valores booleanos.

#### 3. **Expresiones primitivas (operaciones)**:
```scheme
(expression (primitive "(" (separated-list expression ",") ")") prim-exp)
```
- **Estructura**: Un operador primitivo seguido de una lista de argumentos entre paréntesis separados por comas.  
  Ej: `+(1, 2)`, `and(true, false)`.
- **`primitive`**: Define los operadores (ver abajo).
- **`separated-list expression ","`**: Lista de una o más expresiones separadas por comas.
- **Constructor**: `prim-exp` → Crea un nodo de operación primitiva.

#### 4. **Primitivas (operadores)**:
Cada producción de `primitive` define un operador y su constructor asociado:
```scheme
(primitive ("+") add-prim)
(primitive ("-") sub-prim)
(primitive ("*") prod-prim)
(primitive ("/") div-prim)
(primitive ("and") and-prim)
(primitive ("or") or-prim)
(primitive ("<") less-prim)
(primitive ("<=") lesseq-prim)
(primitive (">") more-prim)
(primitive (">=") moreeq-prim)
(primitive ("==") eq-prim)
(primitive ("!=") neq-prim)
```
- **Operadores aritméticos**: `+`, `-`, `*`, `/`.
- **Operadores booleanos**: `and`, `or`.
- **Operadores de comparación**: `<`, `<=`, `>`, `>=`, `==`, `!=`.
- **Constructores**: Cada uno crea un nodo específico para el operador (ej: `add-prim` para la suma).

---

### Ejemplos de derivación:
1. **`5`** → `(lit-exp 5)`  
2. **`x`** → `(var-exp 'x)`  
3. **`+(2, 3)`** → `(prim-exp (add-prim) ((lit-exp 2) (lit-exp 3)))`  
4. **`and(true, false)`** → `(prim-exp (and-prim) ((true-exp) (false-exp)))`

---

### Notas clave (según EOPL):
- Esta gramática define un lenguaje con expresiones primitivas y variables.
- El AST se construye recursivamente durante el parsing.
- Los terminales (ej: `"+"`, `"true"`) deben coincidir con los tokens definidos en la especificación léxica.
- `separated-list` es una utilidad común en definiciones de gramáticas para listas con separadores.

# Construcción del interprete

1. Definimos la especificación léxica
2. Definimos la especificación gramatical
3. Definimos los datatypes: Esto me genera los TAD que requiero para mi lenguaje a partir de la gramática
```scheme
(sllgen:make-define-datatypes lexical grammar)

```

# Scanner

```scheme
(define scanner
  (lambda (program)
    ((sllgen:make-string-scanner lexical grammar) program)))
```

Toma el código fuente y nos lo transforma en unidades léxicas (unidades significativas)

La función `scanner` toma una cadena de entrada (`program`) y utiliza el generador de escáner `sllgen:make-string-scanner` (típico de SLLGEN, herramienta de EOPL) para tokenizar la cadena según la especificación léxica (`lexical`) y gramatical (`grammar`). La salida es una lista de tokens, donde cada token es una lista de la forma:  
`(token-type lexeme line-number)`

---

### Explicación de la salida:

#### 1. **Tokens simples**:
- `(scanner "1")` → `((number 1 1))`  
  - `number`: Tipo de token (definido en `lexical`).  
  - `1`: Lexema (cadena capturada).  
  - `1`: Número de línea donde ocurre.

- `(scanner "5")` → `((number 5 1))`  
  Misma estructura.

#### 2. **Tokens múltiples (con saltos de línea)**:
Entrada:  
```
x
1
2
3
4
+(1,2)
x
y
```
Salida:
```scheme
(
  (identifier x 1)    ; Línea 1: identificador "x"
  (number 1 2)        ; Línea 2: número "1"
  (number 2 3)        ; Línea 3: número "2"
  (number 3 4)        ; Línea 4: número "3"
  (number 4 5)        ; Línea 5: número "4"
  (literal-string6 "+" 6)   ; Línea 6: terminal "+" (de la gramática)
  (literal-string6 "(" 6)   ; Línea 6: terminal "("
  (number 1 6)        ; Línea 6: número "1" (dentro de +(1,2))
  (literal-string6 "," 6)   ; Línea 6: terminal ","
  (number 2 6)        ; Línea 6: número "2"
  (literal-string6 ")" 6)   ; Línea 6: terminal ")"
  (identifier x 7)    ; Línea 7: identificador "x"
  (identifier y 8)    ; Línea 8: identificador "y"
)
```

---

### Observaciones:
- Los terminales de la gramática (como `"+"`, `"("`, `","`, `")"`) se tokenizan como `literal-stringN`, donde `N` es un identificador interno (ej: `literal-string6`). Esto ocurre porque no fueron definidos explícitamente en la especificación léxica (`lexical`), sino que son parte de la gramática.
- Los tokens definidos en `lexical` (`number`, `identifier`) mantienen sus nombres.
- El número de línea (`line-number`) ayuda a rastrear errores.
- El escáner ignora los comentarios (definidos con `skip` en `lexical`), pero en este ejemplo no hay.

---

### ¿Por qué `literal-string6`?
SLLGEN genera nombres internos para terminales de la gramática que no tienen un token-name explícito en `lexical`. En este caso, `"+"`, `"("`, etc., son terminales de la gramática pero no tokens definidos en `lexical`, por lo que se les asigna un nombre genérico (`literal-string6`). Si quisieras evitar esto, deberías definir estos símbolos en la especificación léxica (ej: `(plus "+" symbol)`), pero no es necesario para el parsing.

---

### Relevancia para el parser:
Esta lista de tokens es la entrada para el parser (generado con `sllgen:make-string-parser`), que construirá el AST según la gramática. Los `literal-stringN` serán mapeados a las producciones correspondientes (ej: `"+"` a `add-prim`).

# Parser

```scheme
(define parser
  (lambda (program)
    ((sllgen:make-string-parser lexical grammar) program)))
```

El **parser** (definido implícitamente aquí usando `sllgen:make-string-parser` o similar) toma la salida del scanner y construye un **AST (Abstract Syntax Tree)** según la gramática proporcionada. La estructura del AST se define por los constructores de la gramática (`a-program`, `var-exp`, `lit-exp`, `prim-exp`, etc.).  

---

### Explicación de las salidas:

#### 1. **`(parser "x")`** → `#(struct:a-program #(struct:var-exp x))`
- **AST**:  
  `a-program` contiene una expresión de variable (`var-exp`) con el identificador `x`.
- **Derivación**:  
  `program → expression → identifier → var-exp`

#### 2. **`(parser "1")`** → `#(struct:a-program #(struct:lit-exp 1))`
- **AST**:  
  `a-program` contiene una expresión literal (`lit-exp`) con el valor `1`.
- **Derivación**:  
  `program → expression → number → lit-exp`

#### 3. **`(parser "+(1,2)")`** →
```scheme
#(struct:a-program
  #(struct:prim-exp 
    #(struct:add-prim) 
    (#(struct:lit-exp 1) #(struct:lit-exp 2))))
```
- **AST**:  
  - `a-program` contiene una expresión primitiva (`prim-exp`).  
  - El operador es `add-prim` (suma).  
  - Los argumentos son una lista de dos expresiones literales: `(lit-exp 1)` y `(lit-exp 2)`.
- **Derivación**:  
  `program → expression → primitive "(" (separated-list expression ",") ")"`  
  Donde `primitive → "+" → add-prim` y los `expression` son números.

#### 4. **`(parser "+(1,x)")`** →
```scheme
#(struct:a-program
  #(struct:prim-exp 
    #(struct:add-prim) 
    (#(struct:lit-exp 1) #(struct:var-exp x))))
```
- **AST**:  
  - Misma estructura que el anterior, pero los argumentos son:  
    `(lit-exp 1)` y `(var-exp x)` (variable `x`).
- **Derivación**:  
  Similar, pero uno de los `expression` es un identificador → `var-exp`.

---

### Estructura de los nodos del AST:
- `#(struct:a-program ...)`: Nodo raíz que representa un programa.  
- `#(struct:var-exp sym)`: Nodo para una variable (ej: `x`).  
- `#(struct:lit-exp n)`: Nodo para un literal numérico (ej: `1`).  
- `#(struct:prim-exp prim args)`: Nodo para una operación primitiva, donde:  
  - `prim`: Operador (ej: `#(struct:add-prim)`).  
  - `args`: Lista de argumentos (expresiones).

---

### Notas:
- El parser espera que la entrada sea válida según la gramática. Si no, lanza un error.
- Los constructores (`a-program`, `var-exp`, etc.) son generados automáticamente por SLLGEN a partir de la gramática.
- Este AST está listo para ser evaluado por un intérprete (ej: con `eval-program` definido en EOPL).


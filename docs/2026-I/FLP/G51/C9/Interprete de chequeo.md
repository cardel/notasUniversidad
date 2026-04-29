# Interprete de chequeo

## Definición de reglas de evaluación

### Procedimientos

Para realizar el chequeo de tipos en procedimientos, necesitamos agregar los tipos en los argumentos, para poder determinar qué tipo retorna cada expresión.

```scheme
; Definición de un procedimiento con tipos explícitos en sus parámetros
; ta = int, tb = bool (especificados en la declaración)
proc(int a, bool b) if b then a else +(a,3)
; Evaluación del tipo del cuerpo:
; - if b: b es bool (OK, la condición debe ser bool)
; - then a: a es int
; - else +(a,3): a es int, 3 es int, + retorna int
; - Ambas ramas del if retornan int (OK, consistencia de tipos)
; Por lo tanto el tipo del procedimiento es: (int * bool) -> int
```

### Regla del let

```scheme
; Declaración let con múltiples vinculaciones
let
	x = 1        ; tx = int (literal numérico)
	y = 2        ; ty = int (literal numérico)
	f = proc(int a, int b) +(a,b)  ; tf = (int * int) -> int
in
	(f x y)      ; Aplicación del procedimiento
; Evaluación en ambiente de tipos extendido:
; Ambiente: [x = int, y = int, f = (int * int) -> int]
; (f x y): f espera (int * int), x es int, y es int (match)
; Resultado: int
```

### Regla de evaluación para aplicaciones

Dado (rator rands), el rator debe tener tipo $(t_1, t_2, \ldots, t_n) \to t$ y los rands deben tener tipos $(t_1, t_2, t_3, \ldots, t_n)$, es decir, del mismo tipo que espera el rator.

**Tomando el ejemplo anterior:**

1. (f x y)
2. Ambiente: $[x = int, y = int, f = (int * int) \to int]$ se cumple que f es un procval (valor de procedimiento)
3. $f = (int * int) \to int$: f espera dos argumentos de tipo int. Envío x e y, los cuales son int y la función espera int (match)
4. En consecuencia, la respuesta es int

### Regla del letrec

```scheme
; Declaración letrec con procedimientos recursivos y mutuamente recursivos
letrec
	int p(int x, int y) = if >(x,0)           ; p: (int * int) -> int
						  then +(y, (p sub1(x) y))
						  else y
	int k(bool x, int y) = if x               ; k: (bool * int) -> int
						  then +(y, (p >(y,20) +(y,1)))
						  else y
						  
	in
		+((p 10 20),(k true 0))               ; Cuerpo principal del letrec
```

Para este caso vamos a estructurar los procedimientos p y k:

1. $t_p = (int * int) \to int$ y $t_k = (bool * int) \to int$
2. Vamos a evaluar el cuerpo del letrec sobre el ambiente extendido de tipos que contiene a p y a k: `+((p 10 20),(k true 0))`
3. **(p 10 20):** p recibe dos enteros (OK). De acuerdo a eso x = int, y = int y evaluamos el cuerpo `if >(x,0) then +(y, (p sub1(x) y)) else y`:
   - `>(x,0)`: la primitiva > tiene tipo $(int * int) \to bool$. Observe que x es int y 0 es int (OK)
   - `+(y, (p sub1(x) y))`: la primitiva + tiene tipo $(int * int) \to int$
   - `sub1(x)`: sub1 tiene tipo $int \to int$, donde x es int (OK) y sub1(x) por ende es int
   - Luego y es int, entonces `(p sub1(x) y)` debe retornar un int (por la definición de p)
   - Por lo tanto la suma `+(int, int)` retorna un int
   - Finalmente `y` es int, por lo que la expresión retorna un int
4. **(k true 0):** Tomando en cuenta el tipo de k $(bool * int) \to int$: true es bool, 0 es int (OK). Ahora revisamos el cuerpo `if x then +(y, (p >(y,20) +(y,1))) else y`:
   - `if x`: x es bool (OK, la condición debe ser bool)
   - `+(y, (p >(y,20) +(y,1)))`: y es int
   - Analizamos `(p >(y,20) +(y,1))`:
     - `>(y,20)`: > tiene tipo $(int * int) \to bool$, y es int (OK), 20 es int, por lo que retorna bool
     - `+(y,1)`: + tiene tipo $(int * int) \to int$, y es int, 1 es int, retorna int
     - p espera (int * int), recibe bool e int → **¡INCONSISTENCIA!** `>(y,20)` retorna bool, pero p espera int como primer argumento
   - **Corrección necesaria:** La expresión debería ser `(p +(y,20) +(y,1))` o similar para que ambos argumentos sean int
5. Por lo tanto, `+(int, int)` es correcto y nos retorna un int.

### Reglas de los literales

1. Si es un número, es int
2. Si es true o false, es bool
3. Si es de tipo `proc(t1 a, t2 b, ...) e`, el tipo es $(t_1 * t_2 * \ldots * t_n) \to t$, donde t es el tipo de e evaluado en un ambiente de tipos extendido que incluye los tipos de los argumentos.

---

## Tabla resumen de conceptos

| Concepto | Descripción | Ejemplo |
|----------|-------------|---------|
| **Chequeo de tipos** | Verificación estática de que las expresiones respetan los tipos declarados | `proc(int a, bool b) ...` |
| **Tipo de procedimiento** | Se denota como $(t_1 * t_2 * \ldots * t_n) \to t$ | `(int * bool) -> int` |
| **Ambiente de tipos** | Mapa que asocia identificadores con sus tipos durante la evaluación | `[x = int, y = int, f = (int*int)->int]` |
| **Regla de aplicación** | El rator debe ser un tipo función y los rands deben coincidir con los tipos esperados | `(f x y)` requiere f: (int*int)->int, x: int, y: int |
| **Regla del let** | Extiende el ambiente con los tipos de las variables locales | `let x = 1 in ...` agrega x = int al ambiente |
| **Regla del letrec** | Similar al let pero permite definiciones recursivas y mutuamente recursivas | `letrec int p(int x, int y) = ... in ...` |
| **Literal numérico** | Todo número entero tiene tipo int | `1`, `2`, `10`, `20` |
| **Literal booleano** | true y false tienen tipo bool | `true`, `false` |
| **Primitivas** | Operaciones básicas con tipos fijos: +, >, sub1 | `+`: (int*int)->int, `>`: (int*int)->bool, `sub1`: int->int |
| **Condicional if** | La condición debe ser bool, ambas ramas deben tener el mismo tipo | `if b then a else +(a,3)` requiere b: bool, a: int, +(a,3): int |

**Comentarios adicionales:**
- El chequeo de tipos es un proceso **estático** que ocurre antes de la ejecución del programa, garantizando que no ocurran errores de tipo en tiempo de ejecución.
- La **consistencia de tipos** en las ramas del if es fundamental: ambas deben retornar el mismo tipo para que la expresión completa tenga un tipo definido.
- En el ejemplo del letrec, se identificó una inconsistencia donde `>(y,20)` retorna bool pero se usaba como argumento donde se esperaba int, lo que demuestra la importancia del chequeo riguroso.
- El **ambiente de tipos extendido** permite que dentro del cuerpo de un let o letrec, las variables locales tengan tipos conocidos para el chequeo.
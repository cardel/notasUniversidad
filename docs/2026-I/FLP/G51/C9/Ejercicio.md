
**Parcial del semestre 2022-II**

```scheme
; Definición de un procedimiento que toma dos enteros x, y y devuelve un procedimiento interno
proc(int x, int y)
	; Procedimiento interno que toma un entero k y un booleano t
	proc(int k, bool t)
		; Si t es verdadero, devuelve y (entero), si no, devuelve t (booleano)
		; Inconsistencia: el if debe devolver un único tipo, pero aquí mezcla int y bool
		if t then y else t
```

$(int*int)->((int*bool)->int)$  
**Comentario:** El tipo del procedimiento externo es correcto: recibe dos enteros y devuelve un procedimiento que recibe un entero y un booleano y devuelve un entero. Sin embargo, la implementación interna tiene un error de tipos (ver arriba).

```scheme
; Aplicación del operador > a los argumentos 7 y 6
>(7,6)
```
bool  
**Comentario:** El resultado de `>(7,6)` es un booleano (`true`), por lo que el tipo es `bool`.

```scheme
; Uso de un if con una condición booleana t(4) y dos ramas de tipo int
if (t 4) then +(5,4) else -(x,6)
```

Puedo decir $t = int \rightarrow bool$  
**Comentario:** Correcto. `t` es una función que toma un entero y devuelve un booleano.

Regla del if es int  
**Comentario:** Correcto. Ambas ramas (`+(5,4)` y `-(x,6)`) son de tipo `int`, por lo que el `if` completo es de tipo `int`.

```scheme
; Procedimiento que toma un entero k y una función t de bool a int
proc(int k, (bool -> int) t)
	; Si k > 8, devuelve t (que es de tipo bool -> int)
	; Si no, devuelve un procedimiento que toma un bool q y devuelve *(k,2) (entero)
	if >(k,8)
	  then t
	  else proc(bool q) *(k,2)
	  
```

$(int*(bool->int)) \rightarrow (bool \rightarrow int)$  
**Comentario:** Correcto. Ambas ramas del `if` son de tipo `bool -> int`: `t` ya es de ese tipo, y el procedimiento anónimo también lo es (toma un booleano y devuelve un entero).

Cuidado al comparar t con `proc(bool q) *(k,2)`: ambos son del mismo tipo `bool -> int`.

```scheme
; Procedimiento que toma dos enteros a, b
proc(int a, int b)
	; Si a > b, evalúa (proc(int k) +(a,k) 7) que es un entero
	; Si no, devuelve +(b,3) que también es un entero
	if >(a,b)
		then (proc(int k) +(a,k) 7)
		else +(b,3)
```

$(int*int) \rightarrow int$  
**Comentario:** Correcto. Ambas ramas del `if` son de tipo `int`.

`(proc(int k) +(a,k) 7)`  
**Comentario:** El procedimiento interno es de tipo `int -> int`. Al aplicarlo al argumento `7`, se obtiene un entero (`a+7`). Por lo tanto, la rama `then` es de tipo `int`, al igual que `+(b,3)`.

---

### Tabla de resumen de conceptos

| Concepto | Descripción | Ejemplo en el código |
|----------|-------------|----------------------|
| **Tipo de un procedimiento** | Se denota como $(t_1 * t_2 * ...) \rightarrow t_{retorno}$ | `(int*int)->((int*bool)->int)` |
| **Regla del `if`** | El `if` debe tener ambas ramas del mismo tipo; el tipo del `if` es ese tipo común | `if t then y else t` (inconsistente: `int` vs `bool`) |
| **Aplicación de función** | Al aplicar una función a un argumento, se obtiene el tipo de retorno | `(proc(int k) +(a,k) 7)` es de tipo `int` |
| **Funciones de orden superior** | Procedimientos que toman o devuelven otros procedimientos | `proc(int k, (bool -> int) t)` |
| **Polimorfismo de tipos** | Un mismo nombre puede referirse a diferentes tipos según el contexto | `t` puede ser `bool` o `bool -> int` según el bloque |
| **Inferencia de tipos** | Deducir el tipo de una expresión a partir de sus componentes | `>(7,6)` se infiere como `bool` |
| **Consistencia de tipos** | Todas las expresiones en un mismo contexto deben tener tipos compatibles | En `if t then y else t`, `y` es `int` y `t` es `bool` → inconsistencia |

**Comentarios adicionales:**  
- En lenguajes con tipos estáticos como el del ejercicio, cada expresión debe tener un tipo bien definido en tiempo de compilación.  
- La inconsistencia en el primer `if` (`y` vs `t`) es un error de tipos clásico: un `if` no puede devolver un entero en una rama y un booleano en la otra.  
- Las funciones de orden superior permiten abstracciones poderosas, pero requieren cuidado con la correspondencia de tipos.  
- La inferencia de tipos es fundamental para verificar la corrección de programas sin necesidad de anotaciones explícitas en cada subexpresión.
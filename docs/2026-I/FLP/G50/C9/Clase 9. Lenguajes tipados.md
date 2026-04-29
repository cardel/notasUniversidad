# Clase 9: Lenguajes tipados


1. [Ejercicio interprete](Ejercicio%20interprete.md)

## Clasificación de lenguajes

### Estrategia de tipado

1. **Tipado estático**: ocurre en tiempo de compilación. Requiere el uso de anotadores de tipo como `int`, `boolean`, etc.
2. **Tipado dinámico**: ocurre en tiempo de ejecución. Usa etiquetas para validar los tipos. Es más costoso que el tipado estático.

### Manejo del tipado

1. **Fuertemente tipado**: no acepta errores de tipos.
2. **Débilmente tipado**: hace casting o conversiones cuando tenemos operaciones que no son las esperadas.

```python
# Python: fuertemente tipado (no permite operaciones entre tipos incompatibles)
>>> "1"*"2"
Traceback (most recent call last):
  File "<python-input-2>", line 1, in <module>
    "1"*"2"
    ~~~^~~~
TypeError: can't multiply sequence by non-int of type 'str'
# Sin embargo, permite multiplicar un string por un entero (sobrecarga de operadores)
>>> 2*"3"
'33'
```

```javascript
// JavaScript: débilmente tipado (realiza conversiones implícitas)
> 0 == "0"
true
> 0 == []
true
> "0" == []
false
> 0 === "0"
false
> 0 === []
false

// Conversiones implícitas en operaciones aritméticas
> "1"*"2"
2
> 1*"2"
2
> "2"*3
6
> "1"-3
-2
> "40" - "10"
30
> "xd" - "xd"
NaN
```

**Explicación:** En JavaScript, el operador `==` realiza coerción de tipos antes de comparar, mientras que `===` compara sin coerción. Las operaciones aritméticas convierten automáticamente strings a números cuando es posible; si la conversión falla, se obtiene `NaN` (Not a Number).

# Reglas de tipamiento

## Regla del `if`

```scheme
if e1 then e2 else e3
```

1. `e1` debe ser de tipo `boolean`.
2. `te2 = te3`, las salidas deben ser del mismo tipo.

## Regla del `proc`

```scheme
proc (t1 x1, t2 x2, ..., tn xn) e1
```

El tipo resultante es $(t_1*t_2*\ldots*t_n) \rightarrow t$, donde `e1` es de tipo `t`.

```scheme
proc (int x, (int*int->int) f) (f x)
```

Tipo: $(int*(int*int\rightarrow int))\rightarrow int$

## Regla del `app` (aplicación de expresión)

```scheme
(rator rand1 rand2 ... randn)
```

1. El `rator` debe ser de tipo proc $(t_1*t_2*\ldots*t_n)\rightarrow t$.
2. En los `rands` debe cumplirse que $rand_1 = t_1 \land rand_2 = t_2 \land \ldots \land rand_n = t_n$.
3. Si esto se cumple, la expresión es de tipo $t$.

```scheme
let
	f = proc(int a, int b) +(a,b)
	in
	  (f 2 3)
```

1. `f` es un procval de tipo $(int*int)\rightarrow int$ — ¡ok!
2. `2 = int` (sí) y `3 = int` (sí).
3. Entonces la respuesta es el tipo de `+(a,b)`, que es `int`.

## Regla del `let`

```scheme
let
	id1 = exp1
	id2 = exp2
	...
	idn = expn
	in
		e
```

1. Se hace un ambiente de tipos extendido con $id_1 = t_{exp1}, id_2 = t_{exp2}, \ldots, id_n = t_{expn}$.
2. Se retorna el tipo `t` de `e`, evaluando en el ambiente de tipos extendido.

## Reglas de las primitivas

```scheme
+(4,2)
-(3,4)
```

1. Si son numéricas como la suma o resta: $(int*int)\rightarrow int$.
2. Si son relacionales como `>`, `<`, `=`: $(int*int)\rightarrow boolean$.
3. Si son unarias como `incre`, `decr`: $int \rightarrow int$.
4. Si son lógicas como `and`, `or`: $(boolean, boolean) \rightarrow boolean$.

Cuando se evalúan, se aplica la misma regla de los procedimientos asumiendo la primitiva como una función tipada.

## Regla del `letrec`

```scheme
letrec
	t1 p1(t11 x11, t12 x12, ....., t1n x1n) e1
	t2 p2(t21 x21, t22 x22, ....., t2n x2n) e2
	t3 p3(t31 x31, t32 x32, ....., t3n x3n) e3
	t4 p4(t41 x41, t42 x42, ....., t4n x4n) e4
	...
	tn pn(tn1 xn1, tn2 xn2, ....., tnn xnn) en
	in
		e
```

1. Se debe verificar que el tipo de `ei` sea `ti`, es decir, que el procedimiento retorne el tipo esperado. Esto se hace en **todos** los procedimientos.
2. El tipo de salida del `letrec` es `e` evaluado en un ambiente de tipos extendido que incluye los procedimientos declarados.

## Tabla resumen de conceptos

| Concepto | Definición | Comentarios adicionales |
| :--- | :--- | :--- |
| **Tipado estático** | Verificación de tipos en tiempo de compilación | Requiere anotaciones explícitas; detecta errores antes de ejecutar |
| **Tipado dinámico** | Verificación de tipos en tiempo de ejecución | Usa etiquetas internas; más flexible pero con costo en rendimiento |
| **Fuertemente tipado** | No permite operaciones entre tipos incompatibles | Ejemplo: Python rechaza `"1"*"2"` |
| **Débilmente tipado** | Realiza conversiones implícitas entre tipos | Ejemplo: JavaScript convierte `"1"*"2"` a `2` |
| **Regla del `if`** | La condición debe ser booleana; ambas ramas deben tener el mismo tipo | Garantiza que el resultado tenga un tipo único independientemente del camino |
| **Regla del `proc`** | Un procedimiento tiene tipo $(t_1*\ldots*t_n)\rightarrow t$ | El tipo de retorno se infiere del cuerpo |
| **Regla del `app`** | El operador debe ser una función; los argumentos deben coincidir con los parámetros | Es la aplicación de función tipada |
| **Regla del `let`** | Extiende el ambiente con las definiciones locales | Similar a declarar variables locales con tipo |
| **Regla del `letrec`** | Permite definiciones recursivas verificando que cada cuerpo tenga el tipo declarado | Fundamental para funciones recursivas; requiere verificación mutua |

**Comentarios adicionales:** El sistema de tipos presentado corresponde a un lenguaje funcional simple similar a Scheme con tipos explícitos. La diferencia entre tipado estático y dinámico es ortogonal a la diferencia entre fuertemente y débilmente tipado: un lenguaje puede ser estático y débil (C permite conversiones implícitas entre `int` y `char`) o dinámico y fuerte (Python no permite operaciones entre tipos incompatibles). En lenguajes funcionales tipados, las reglas de tipificación garantizan que programas bien tipados no presenten errores de tipo en tiempo de ejecución (teorema de seguridad de tipos o *type safety*).
# Clase 7. Asignación y paso por referencia

Martes 27 de octubre de 2026.

Hasta aquí el lenguaje solo tenía valores: un identificador se ligaba a un
número y esa ligadura no cambiaba nunca. Esta sesión le agrega estado, y con
el estado aparecen tres cosas nuevas que antes no hacían falta: un almacén
donde viven los valores, una referencia que nombra una celda de ese almacén, y
dos políticas distintas para pasar un argumento. El lenguaje gana expresividad
y pierde una propiedad que venía gratis: dos expresiones iguales pueden dar
resultados distintos.

Las diapositivas y los intérpretes están en el Campus Virtual. Aquí quedan las
notas de la sesión.

Referencia: Friedman y Wand, *Essentials of Programming Languages*, 3.ª
edición, §4.1 a §4.5.

## Lo que no se puede escribir sin estado

Un contador es el ejemplo más corto. Se declara un número y un procedimiento
que lo consulta:

```
let cuenta = 0
in let g = proc() add1(cuenta)
   in +((g), (g))
```

El programa entrega **2**. Las dos llamadas devuelven 1, porque `cuenta`
siempre vale 0: `add1` calcula un valor nuevo y no toca la ligadura. No hay
forma de escribir un contador que avance, y tampoco de escribir nada que
recuerde lo que pasó en una llamada anterior.

El mismo programa en el lenguaje de esta sesión, con `set`, entrega **3**:

```
let cuenta = 0
in let g = proc() begin set cuenta = add1(cuenta); cuenta end
   in +((g), (g))
```

La primera llamada deja `cuenta` en 1 y devuelve 1, la segunda la deja en 2 y
devuelve 2. Lo que cambió no es la aritmética: es que ahora una llamada deja
rastro.

## El almacén

El valor de un identificador deja de estar en el ambiente. El ambiente guarda
una **referencia** y el valor vive en una **celda** del almacén, que es una
lista de celdas numeradas desde 0.

```
ambiente                          almacén
[m -> (a-ref 6)] --> ...          0: 4   1: 2   ...   6: 3
```

La interfaz son tres operaciones:

- `newref` recibe un valor, lo pone en una celda nueva al final y devuelve su
  referencia.
- `deref` recibe una referencia y entrega lo que hay en la celda.
- `setref!` recibe una referencia y un valor, y escribe la celda.

El ambiente inicial ocupa las seis primeras celdas: liga `x = 4`, `y = 2`,
`z = 5` sobre `a = 4`, `b = 5`, `c = 6`, de modo que `x` es la celda 0 y `c`
la 5. Cada programa arranca con el almacén recién inicializado.

Dibujar la cadena de ambientes ya no alcanza. Desde esta sesión el diagrama
lleva el almacén al lado, con la posición de cada celda, y una flecha de cada
referencia a la celda que le toca.

## Referencias explícitas

La primera versión del lenguaje pone las tres operaciones a la vista del
programador. Una referencia es un valor más, que se puede ligar con `let` y
pasar a un procedimiento.

```
let c = newref(0)
in begin
     setref(c, add1(deref(c)));
     setref(c, add1(deref(c)));
     deref(c)
   end
```

Entrega **2**. La celda se crea una vez y las dos escrituras caen en la misma.

Que la referencia sea un valor trae el aliasing, que es lo que distingue a
este lenguaje de todos los anteriores:

```
let celda = newref(5)
in let otro = celda
   in begin
        setref(otro, 99);
        deref(celda)
      end
```

Entrega **99**. `otro` y `celda` no son dos copias: son dos nombres de la
misma celda. Escribir por uno se lee por el otro, y ningún análisis del texto
del programa lo delata, porque los dos nombres se ven iguales de inocentes.

Lo mismo pasa cuando la referencia cruza una llamada:

```
let c = newref(10)
in let f = proc(k) setref(k, 20)
   in begin (f c); deref(c) end
```

Entrega **20**. El procedimiento recibió la referencia, no el número.

## Referencias implícitas: `set`

La segunda versión esconde las tres operaciones. Cada identificador se liga a
una referencia al declararse, leer un identificador hace `deref` solo, y `set`
escribe la celda:

```
let m = 0
in begin set m = add1(m); set m = *(m, 2); m end
```

Entrega **2**. Dos detalles de la cláusula que conviene fijar. El primero:
`apply-env` devuelve la referencia y no el valor, porque `setref!` necesita
saber en qué celda escribir; es `var-exp` quien agrega el `deref`. El segundo:
`set` se usa por su efecto y entrega **1**, de modo que `set x = 9` vale 1 y
no 9.

El estado también se ve a través de una clausura:

```
let t = 0
in let f = proc(k) t
   in begin set t = 1; (f 2) end
```

Entrega **1**. La clausura capturó el ambiente, y el ambiente guarda la
referencia de `t`, no su valor: cuando el cuerpo del procedimiento lee `t`,
lee la celda, que para entonces ya cambió. Capturar un ambiente dejó de ser
capturar una foto.

Un caso que no cambia es el del nombre declarado con `letrec`:

```
letrec f(n) = 7
in begin set f = 5; (f 1) end
```

Entrega **7**. El marco recursivo no guarda un valor que se pueda sobrescribir:
guarda los nombres, los parámetros y los cuerpos, y fabrica la clausura al
buscar el nombre.

## Dos políticas de paso de parámetros

Con estado, la pregunta de qué recibe un procedimiento tiene dos respuestas
distintas.

Por **valor**, cada aplicación reserva una celda nueva con el valor del
operando, de modo que el cuerpo no puede tocar lo del llamador. Por
**referencia**, un operando que es una variable entrega su propia celda, y las
dos ligaduras nombran la misma.

Los mismos programas en las dos políticas:

| Programa | Por valor | Por referencia |
|---|---|---|
| `let p = proc(w) set w = 4 in let m = 3 in begin (p m); m end` | 3 | 4 |
| `let n = 100 in let p = proc(k) begin set k = add1(k); k end in +((p n), (p n))` | 202 | 203 |
| `let swap = proc(u, v) let t = u in begin set u = v; set v = t end in let m = 7 n = 2 in begin (swap m n); -(m, n) end` | 5 | -5 |
| `let f = proc(u, v) ... in (f m +(m, n))` | 42 | 42 |

El tercero es el que decide: `swap` solo intercambia de verdad si los
parámetros comparten las celdas de los argumentos. Por valor intercambia dos
copias y el llamador no se entera.

El cuarto muestra el límite de la regla: lo que decide no es cuánto vale el
operando sino **qué forma tiene**. `+(m, n)` no es una variable, así que se
evalúa y recibe celda propia, igual que por valor. Por eso ese programa
entrega 42 en los dos lenguajes.

Y el segundo muestra que la diferencia no siempre está donde uno la busca: por
referencia la primera llamada deja `n` en 101, de modo que la segunda calcula
sobre 101 y la suma da 203 en vez de 202.

## Lo que se gana y lo que cuesta

Se gana escribir procedimientos que recuerdan, estructuras que se modifican en
el sitio y argumentos de salida. Se pierde poder razonar sobre un programa
leyéndolo: dos apariciones del mismo identificador pueden valer distinto, el
orden de evaluación pasa a importar, y dos nombres pueden ser el mismo lugar
sin que el texto lo diga.

## Ejercicios de la segunda mitad

[Ejercicios · FLP C7](../../../actividades/flp/asignacion-y-paso-por-referencia/index.md){ target=_blank rel=noopener }:
dieciocho actividades que siguen las secciones de esta sesión, desde el valor
y el efecto hasta las dos políticas, con la cadena de ambientes y el almacén
dibujados al comprobar.

## Lo que sigue

El lenguaje ya tiene estado y sigue aceptando programas que fallan al correr,
como sumar un booleano. La sesión siguiente agrega un chequeador que decide
antes de correr, y para eso el programador anota los tipos.

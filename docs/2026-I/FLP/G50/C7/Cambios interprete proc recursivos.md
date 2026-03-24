# Cambios en la gramática

```scheme
(expresion ("letrec" (arbno identificador "(" (separated-list identificador ",") ")" "=" expresion) "in" expresion) letrec-exp)
```

Esta regla será capturada en el evaluador como:

1. Una lista de identificadores que son los nombres de los procedimientos.
2. Una lista de listas que son los argumentos para cada uno de los procedimientos.
3. Una lista de expresiones que son los cuerpos de los procedimientos.
4. Una expresión sobre la cual vamos a evaluar (el cuerpo del `letrec`).

# Cambios en el evaluador

Cuando llega una expresión `letrec`, vamos a crear un ambiente especial llamado **ambiente extendido recursivo** (solo permite definir procedimientos).

```scheme
(letrec-exp (procnames idss cuerpos cuerpo-letrec)
            (evaluar-expresion cuerpo-letrec
                               (ambiente-extendido-recursivo procnames idss cuerpos amb)))
```

Cuando llega un `letrec`, sencillamente evaluamos la expresión en un ambiente extendido recursivo.

## Cambios en el ambiente

Definimos un nuevo tipo de ambiente llamado **ambiente extendido recursivo** en el datatype de ambiente.

```scheme
(ambiente-extendido-recursivo
 (nombre-procedimientos (list-of symbol?))
 (argumentos-proc (list-of (list-of symbol?)))
 (cuerpos-proc (list-of expresion?))
 (old-env ambiente?))
```

Esto nos permite tener un ambiente extendido recursivo especial cuando declaramos procedimientos recursivos, dado que no podemos generar clausuras directamente, sino cuando evaluamos. Este cambio implica también que el procedimiento observador `apply-env` cambia para tener este nuevo caso.

```scheme
(ambiente-extendido-recursivo (procnames lidss cuerpos old-env)
  (letrec
      (
       ;; Función auxiliar para buscar una variable en el marco recursivo
       (buscar-variable (lambda (procnames lidss cuerpos old-env)
                          (cond
                            ;; No está en este marco => buscar en old-env
                            [(null? procnames) (apply-env old-env var)]
                            ;; Encontrado: generar clausura con env (¡no old-env!)
                            [(equal? (car procnames) var)
                             (closure
                              (car lidss)   ; parámetros del procedimiento
                              (car cuerpos) ; cuerpo del procedimiento
                              env)          ; ambiente actual (recursivo)
                             ]
                            ;; No coincide: seguir buscando en el marco
                            [else
                             (buscar-variable (cdr procnames) (cdr lidss) (cdr cuerpos) old-env)]
                            )
                          )
                        )
       )
    ;; Invocar la búsqueda con los datos del marco recursivo
    (buscar-variable procnames lidss cuerpos old-env)
    )
  )
```

El comportamiento de este caso es que si encuentra el procedimiento dentro del ambiente extendido recursivo, genera una **clausura** nueva cada vez que se consulta (en tiempo de ejecución). En caso de no encontrarla, sencillamente sigue buscando en el ambiente que extiende.

Esto permite que cuando tenemos un procedimiento recursivo no se altere el determinismo de los valores, ya que en `letrec` solo podemos declarar procedimientos.

# Conceptos teóricos y ajustes

## 1. `letrec` y recursión mutua
La forma `letrec` permite la definición de procedimientos **recursivos y mutuamente recursivos**. A diferencia de `let`, donde las definiciones no pueden referirse entre sí, `letrec` crea un ámbito en el que todos los identificadores son visibles simultáneamente, resolviendo así el problema de la autorreferencia.

## 2. Ambiente extendido recursivo
Es un **nuevo tipo de ambiente** que encapsula las definiciones de procedimientos recursivos. Su propósito es posponer la creación de clausuras hasta el momento de la consulta (`apply-env`), garantizando que cada clausura se genere con el ambiente correcto que incluye las definiciones recursivas.

## 3. Generación diferida de clausuras
En la implementación, las clausuras no se crean al extender el ambiente, sino cuando se busca un procedimiento. Esto es crucial para la recursión: la clausura debe capturar el ambiente que ya contiene la definición del propio procedimiento (el ambiente recursivo), no el ambiente anterior.

## 4. Determinismo y seguridad
Al restringir `letrec` solo a definiciones de procedimientos, se asegura que no haya **asignaciones circulares** de valores simples, lo que mantiene el determinismo de la evaluación y evita errores semánticos.

# Tabla de resumen

| Concepto | Descripción | Propósito/Importancia |
|----------|-------------|-----------------------|
| `letrec` | Forma especial para definir procedimientos recursivos y mutuamente recursivos. | Permite autorreferencia y recursión mutua dentro de un mismo ámbito léxico. |
| Ambiente extendido recursivo | Nuevo tipo de ambiente que almacena nombres, parámetros y cuerpos de procedimientos definidos en un `letrec`. | Posponer la creación de clausuras hasta que se necesiten, asegurando que capturen el ambiente recursivo correcto. |
| Generación diferida de clausuras | Las clausuras se crean en `apply-env` al buscar un procedimiento, no al construir el ambiente. | Garantiza que cada clausura tenga una referencia al ambiente que incluye su propia definición (necesario para recursión). |
| `apply-env` extendido | Se añade un caso para manejar el ambiente recursivo, buscando y generando clausuras bajo demanda. | Integra la lógica de búsqueda y creación de clausuras en el mecanismo de búsqueda de variables estándar. |
| Restricción a procedimientos | `letrec` solo permite definir procedimientos, no valores simples. | Evita circularidades en valores no procedurales y mantiene la semántica determinista. |

# Comentarios adicionales

- La implementación presentada sigue el **enfoque de entorno recursivo** típico en interpretadores de lenguajes funcionales. Otra alternativa común es usar **referencias mutables** (boxes) para permitir recursión, pero la solución aquí es puramente funcional.
- El ambiente recursivo actúa como un **marco de enlace** que se consulta de manera perezosa: solo cuando se necesita un procedimiento se construye su clausura, lo que puede mejorar el rendimiento si no todos los procedimientos definidos se usan.
- Esta técnica se extiende naturalmente a **recursión mutua**: varios procedimientos definidos en el mismo `letrec` pueden referirse entre sí porque todos están visibles en el mismo ambiente extendido recursivo.
- En lenguajes con **tipado estático**, `letrec` requiere verificación de tipos para asegurar que las definiciones sean consistentes y no causen ciclos en tipos no procedurales.

Gracias a esto podemos escribir cosas como

```scheme
letrec 
	f(x,y) = if >(x,0) then +(y, (f sub1(x) y)) else y
	g(a,b) = if >(a,0) then -(b, (g sub1(a) sub(b))) else 0
```
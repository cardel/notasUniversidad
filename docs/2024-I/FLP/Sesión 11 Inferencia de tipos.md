# Sesión 11 Inferencia de tipos

# Inferencia de tipos

¿Cual es la diferencia con chequeo de tipos?

Vamos a utilizar unas reglas para calcular los tipos de las expresiones, especialmente procedimientos

### Regla del if

if <bool> then <t> else <t>

Regla del proc

(t1*t2*t3*..*tn)→t

### Regla de la evaluación

(procval r1 r2 r3 … rn)

procval = (t1*t2,*t3*tn) →t

r1 = t1, r2 = t2, ..rn = tn

Salida es t

### Regla de las primitivas

+(x,y) (int*int) → int

and(x,y) (bool*bool) → bool

>(x,y) (int*int) → bool

### Regla del let

let a = 3 b = 2 in …

¿Salida? El tipo de la expresión del in

---

¿Como hacemos inferencia de tipos?

1. Generar las variables de tipo
2. Calcular los tipos de los procedimientos
3. Observar lo que está adentro de los procedimientos
4. Observar las evaluaciones de procedimientos

Esto nos genera un sistema de ecuaciones, recordar que las variables ASIGNACIÓN UNICA

---

Que modificaciones hicimos al interprete?

1. Agregamos el tipo ?
2. Generamos las variables de tipo, un serial seguido de un tipo
3. Completamos con las reglas de inferencia
+(x,y)  Regla (int*int) → int  tx = int, ty = int
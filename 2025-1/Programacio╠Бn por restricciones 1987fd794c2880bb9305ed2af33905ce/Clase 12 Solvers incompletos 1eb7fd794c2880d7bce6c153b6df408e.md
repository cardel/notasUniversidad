# Clase 12: Solvers incompletos

# Restricciones de igualdad

IGUALDAD 1
$x = x; x \in D \therefore ; x\in D$  

IGUALDAD 2
$x = y; x \in D_x, y \in D_y \therefore \langle x = y ; x \in D_x \cap D_y , y \in D_x \cap D_y \rangle$ 

DISEQUALITY 1

$\langle x \neq x ; x \in D \rangle$

$\langle ; x \in \emptyset \rangle$

DISEQUALITY 2

$\langle x \neq y ; x \in D_x, y \in D_y \rangle$

$\langle ; x \in D_x , y \in D_y \rangle$

where $D_x \cap D_y = \emptyset$

DISEQUALITY 3

$\langle x \neq y ; x \in D, y = a \rangle$

$\langle ; x \in D - \{a\}, y = a \rangle$

Aquí hay un ejemplo de CSP aplicando las reglas de igualdad y desigualdad:

```
Dominio inicial:
D₁ = {1, 2, 3}
D₂ = {2, 3, 4}
D₃ = {1, 3}

Variables y restricciones:
x₁ ∈ D₁
x₂ ∈ D₂
x₃ ∈ D₃

R1: x₁ = x₁     (IGUALDAD 1)
R2: x₁ = x₂     (IGUALDAD 2)
R3: x₂ ≠ x₂     (DISEQUALITY 1)
R4: x₁ ≠ x₃     (DISEQUALITY 2)
R5: x1 ≠ 4      (DISEQUALITY 3)

```

Aplicando las reglas:

- R1 (IGUALDAD 1): x₁ mantiene su dominio D₁ ya que x₁ = x₁ es siempre verdadero.
- R2 (IGUALDAD 2): x₁ y x₂ deben tener valores en la intersección de D₁ y D₂
D₁ ∩ D₂ = {2, 3}
Nuevo D₁ = {2, 3}
Nuevo D₂ = {2, 3}
- R3 (DISEQUALITY 1): x₂ ≠ x₂ resulta en dominio vacío para x₂
Nuevo D₂ = ∅
- R4 (DISEQUALITY 2): x₁ y x₃ deben tener valores diferentes
D₁ = {2, 3}
D₃ = {1, 3}
- R5 (DISEQUALITY 3): x1 no puede ser 4
D1 - {4} = {2, 3}

Este CSP no es arcoconsistente porque:

- La restricción R3 (x₂ ≠ x₂) resulta en un dominio vacío, lo que hace que el CSP sea insatisfacible.
- Existe una contradicción entre R2 y R3, ya que R2 requiere que x₁ = x₂, pero R3 hace que x₂ tenga un dominio vacío.

# Restricciones booleanos

EQU 1: x = y, x = 1 → y = 1
EQU 2: x = y, y = 1 → x = 1
EQU 3: x = y, x = 0 → y = 0
EQU 4: x = y, y = 0 → x = 0

NOT 1: ¬x = y, x = 1 → y = 0
NOT 2: ¬x = y, x = 0 → y = 1
NOT 3: ¬x = y, y = 1 → x = 0
NOT 4: ¬x = y, y = 0 → x = 1

AND 1: x ∧ y = z, x = 1, y = 1 → z = 1
AND 2: x ∧ y = z, x = 1, z = 0 → y = 0
AND 3: x ∧ y = z, y = 1, z = 0 → x = 0
AND 4: x ∧ y = z, x = 0 → z = 0
AND 5: x ∧ y = z, y = 0 → z = 0
AND 6: x ∧ y = z, z = 1 → x = 1, y = 1

OR 1: x ∨ y = z, x = 1 → z = 1
OR 2: x ∨ y = z, x = 0, y = 0 → z = 0
OR 3: x ∨ y = z, x = 0, z = 1 → y = 1
OR 4: x ∨ y = z, y = 0, z = 1 → x = 1
OR 5: x ∨ y = z, y = 1 → z = 1
OR 6: x ∨ y = z, z = 0 → x = 0, y = 0

Aquí hay un ejemplo de CSP con booleanos:

```jsx
Dominio inicial:
x, y, z ∈ {0,1}

Restricciones:
R1: x = y     (EQU)
R2: y ∧ z = x  (AND)
R3: x = 1     (Valor conocido)

```

Aplicando las reglas:

1. Por R3, sabemos que x = 1
2. Usando EQU 1, como x = y y x = 1, entonces y = 1
3. Por R2 (y ∧ z = x) y sabiendo que x = 1, podemos aplicar AND 6: como z ∧ y = 1, entonces y = 1 (que ya sabíamos) y z = 1

Solución final:
x = 1
y = 1
z = 1

Este CSP es arco-consistente y tiene una única solución donde todas las variables son 1. Las reglas de equivalencia (EQU) y AND fueron suficientes para propagar los valores y encontrar la solución.

```jsx
% Use this editor as a MiniZinc scratch book
var bool: i1;
var bool: i2;
var bool: x1;
var bool: y1;
var bool: y2;
var bool: o1;
var bool: z;

predicate xorcito(var bool: a, var bool: b)=
  bool2int(a) + bool2int(b) = 1;
  
  
constraint i1 /\ i2 = y1;
constraint xorcito(i1,i2) = x1;
constraint xorcito(z,x1) = o1;
constraint y1 \/ y2 = true;
constraint bool2int(x1) * bool2int(z) = bool2int(y2);
%constraint y2 = z;
constraint z = false;

solve satisfy;
```

# Restricciones sobre dominios de enteros

- Vamos a trabajar funciones + o -
- Vamos a tener expresiones relacionadas con <, ≤, =, ≠, ≥, >

### Desigualdades simples mejoradas

**Desigualdad simple 1 (SIMPLE DISEQUALITY 1):**

Para la desigualdad entre dos variables con dominios disjuntos:

$\langle x \neq y ; x \in [a..b], y \in [c..d] \rangle$

$\langle ; x \in [a..b], y \in [c..d] \rangle$

Donde $b < c$ o $d < a$ (es decir, los dominios de x e y no tienen intersección).

**Desigualdad simple 2 (SIMPLE DISEQUALITY 2):**

Para la desigualdad cuando $y$ toma el valor mínimo del dominio de $x$:

$\langle x \neq y ; x \in [a..b], y = a \rangle$

$\langle ; x \in [a + 1..b], y = a \rangle$

El dominio de x se ajusta eliminando a como posible valor.

**Desigualdad simple 3 (SIMPLE DISEQUALITY 3):**

Para la desigualdad cuando y toma el valor máximo del dominio de x:

$\langle x \neq y ; x \in [a..b], y = b \rangle$

$\langle ; x \in [a..b - 1], y = b \rangle$

El dominio de x se ajusta eliminando $b$ como posible valor.

## Ejemplo intuitivo

Considera la desigualdad:
3x + 4y − 5z ≤ 7
donde x ∈ [lx..hx], y ∈ [ly..hy], z ∈ [lz..hz].

Podemos reescribir esto como:
x ≤ (7 − 4y + 5z)/3

Cualquier valor de x que satisfaga esta desigualdad también satisface:
x ≤ (7 − 4ly + 5hz)/3  

Se toma ly porque está restando y hz está sumado y buscamos cambiar el valor superior del dominio de x

- Como buscamos soluciones enteras:
x ≤ ⌊(7 − 4ly + 5hz)/3⌋
- Por lo tanto, podemos reducir el dominio [lx..hx] a:
[lx..min(⌊(7 − 4ly + 5hz)/3⌋, hx)]

¡Por supuesto! Veamos un ejemplo más práctico y entretenido:

Imagina que estás organizando una fiesta y tienes esta restricción para el presupuesto:

3x + 4y - 5z ≤ 7, donde:

- x = número de pizzas (x ∈ [0..5])
- y = número de refrescos (y ∈ [1..3])
- z = número de amigos que traen snacks (z ∈ [0..2])

Siguiendo los pasos que vimos:

1. Despejamos x: x ≤ (7 - 4y + 5z)/3
2. Tomamos el peor caso para x (cuando y=1 porque resta, y z=2 porque suma):

x ≤ (7 - 4(1) + 5(2))/3

x ≤ (7 - 4 + 10)/3

x ≤ 13/3

x ≤ 4.33

Como trabajamos con enteros, x ≤ 4

Por lo tanto, ¡aunque tu dominio original permitía hasta 5 pizzas, la restricción te dice que con ese presupuesto solo puedes comprar máximo 4 pizzas! 🍕

# Reglas de la multiplicación

### Multiplicación de conjuntos de enteros

Sean X e Y conjuntos de números enteros. Definimos la multiplicación entre estos conjuntos como:

$X \cdot Y := \{x \cdot y \mid x \in X, y \in Y\}$

Es importante notar que cuando X e Y son intervalos de enteros, su producto X·Y no necesariamente resulta en un intervalo.

Por ejemplo:

$[0..2] \cdot [1..2] = \{0, 1, 2, 4\}$

### Intervalos enteros

Para un conjunto de enteros A, definimos int(A) como:

- El intervalo entero más pequeño que contiene a A, si existe
- El conjunto ℤ de todos los enteros en caso contrario

**Regla de multiplicación básica:**

$\langle x \cdot y = z ; x \in D_x, y \in D_y, z \in D_z \rangle$

Se puede refinar a:

$\langle x \cdot y = z ; x \in D_x, y \in D_y, z \in D_z \cap int(D_x \cdot D_y) \rangle$

**Ejemplo ilustrativo:**

Consideremos la siguiente restricción:

$\langle x \cdot y = z ; x \in [0..2], y \in [1..2], z \in [4..6] \rangle$

Sabemos que:

- El intervalo entero del producto es: $int([0..2] \cdot [1..2]) = [0..4]$
- La intersección con el dominio de z es: $[4..6] \cap [0..4] = [4..4]$

Por lo tanto, la restricción se reduce a:

$\langle x \cdot y = z ; x \in [0..2], y \in [1..2], z \in [4..4] \rangle$

### División de intervalos

La división de intervalos se define como:

$Z/Y = \{x \in Z \mid \exists y \in Y \exists z \in Z \text{ } x \cdot y = z\}$

**Importante:**

- Z e Y son intervalos de enteros
- El resultado Z/Y no necesariamente es un intervalo

**Ejemplo:**

$[3..5]/[-1..2] = \{-5, -4, -3, 2, 3, 4, 5\}$

### Reglas de multiplicación adicionales

**Multiplicación 2:**

La restricción:

$\langle x \cdot y = z ; x \in D_x, y \in D_y, z \in D_z \rangle$

Se puede refinar a:

$\langle x \cdot y = z ; x \in D_x \cap int(D_z/D_y), y \in D_y, z \in D_z \rangle$

**Multiplicación 3:**

De manera similar, la restricción:

$\langle x \cdot y = z ; x \in D_x, y \in D_y, z \in D_z \rangle$

Se puede refinar a:

$\langle x \cdot y = z ; x \in D_x, y \in D_y \cap int(D_z/D_x), z \in D_z \rangle$

**Ejemplo Ilustrativo**

Consideremos la siguiente restricción:

$\langle x \cdot y = z ; x \in [1..20], y \in [9..11], z \in [155..161] \rangle$

Al aplicar la regla **MULTIPLICACIÓN 2** obtenemos:

$\langle x \cdot y = z ; x \in [16..16], y \in [9..11], z \in [155..161] \rangle$

Esto es porque:

- [155..161]/[9..11] = [16..16]
- [1..20] ∩ int([16..16]) = [16..16]

Luego, aplicando la regla **MULTIPLICACIÓN 3** llegamos a:

$\langle x \cdot y = z ; x \in [16..16], y \in [10..10], z \in [155..161] \rangle$

Ya que:

- [155..161]/[16..16] = [10..10]
- [9..11] ∩ int([10..10]) = [10..10]

Finalmente, al aplicar la regla **MULTIPLICACIÓN 1** obtenemos:

$\langle x \cdot y = z ; x \in [16..16], y \in [10..10], z \in [160..160] \rangle$

Porque:

- [16..16] · [10..10] = [160..160]
- [155..161] ∩ int([160..160]) = [160..160]

Un ejemplo práctico para aplicar las reglas de multiplicación en CSP mostrando propagación y el momento en que el sistema se vuelve arcoconsistente:

### Ejemplo práctico: Distribución de productos en cajas

Queremos distribuir productos en cajas asegurándonos de que el volumen total (en cm³) no exceda una capacidad máxima. Las variables son:

- `x`: Número de cajas pequeñas (volumen: 5 cm³ cada una)
- `y`: Número de cajas medianas (volumen: 10 cm³ cada una)
- `z`: Número de cajas grandes (volumen: 20 cm³ cada una)
- `v`: Volumen total (el límite es 100 cm³)

### Dominio inicial:

- `x ∈ [0..10]`
- `y ∈ [0..10]`
- `z ∈ [0..5]`
- `v ∈ [0..100]`

### Restricción:

El volumen total está dado por la ecuación:

`5x + 10y + 20z = v`

### Paso 1: Propagación inicial (Regla de multiplicación 1)

Restricción:

`5x + 10y + 20z = v, x ∈ [0..10], y ∈ [0..10], z ∈ [0..5], v ∈ [0..100]`.

Calculamos el intervalo para `v`:

- Valor mínimo: `5(0) + 10(0) + 20(0) = 0`
- Valor máximo: `5(10) + 10(10) + 20(5) = 200`

Intersección con el dominio inicial de `v`:

`v ∈ [0..100] ∩ [0..200] = [0..100]`

(No hay cambios en este paso).

### Paso 2: Refinar dominios utilizando las reglas de multiplicación

Aplicamos las reglas de propagación para cada variable:

1. Para `x`:
Restricción:
    
    `5x ≤ v`
    
    Despejamos `x`:
    
    `x ≤ v / 5`
    
    Calculamos el intervalo máximo de `x` considerando el dominio actual de `v`:
    
    `x ∈ [0..min(⌊100 / 5⌋, 10)] = [0..10]`
    
    (No hay cambios en este paso).
    
2. Para `y`:
Restricción:
    
    `10y ≤ v`
    
    Despejamos `y`:
    
    `y ≤ v / 10`
    
    Calculamos el intervalo máximo de `y`:
    
    `y ∈ [0..min(⌊100 / 10⌋, 10)] = [0..10]`
    
    (No hay cambios en este paso).
    
3. Para `z`:
Restricción:
    
    `20z ≤ v`
    
    Despejamos `z`:
    
    `z ≤ v / 20`
    
    Calculamos el intervalo máximo de `z`:
    
    `z ∈ [0..min(⌊100 / 20⌋, 5)] = [0..5]`
    
    (No hay cambios en este paso).
    
    En este paso el sistema es arcoconsistente, para cadavalor de x existe un y, z que satisfacen la restricciones
    

### Paso 3:  Búsqueda Asignar valores parciales y continuar propagación

Supongamos que asignamos `x = 10` (el valor máximo posible para `x`). Esto actualiza la restricción:

`5(10) + 10y + 20z = v`

`50 + 10y + 20z = v`

`10y + 20z = v - 50`.

Actualizamos el dominio de `v` considerando el mínimo y máximo posibles para `y` y `z`:

- Valor mínimo de `v`: `50 + 10(0) + 20(0) = 50`
- Valor máximo de `v`: `50 + 10(10) + 20(5) = 200`

Intersección con el dominio actual de `v`:

`v ∈ [50..100]`.

Actualizamos también los dominios de `y` y `z`:

- Para `y`:
    
    `10y ≤ v - 50`
    
    `y ≤ (v - 50) / 10`
    
    `y ∈ [0..min(⌊(100 - 50) / 10⌋, 10)] = [0..5]`.
    
- Para `z`:
    
    `20z ≤ v - 50`
    
    `z ≤ (v - 50) / 20`
    
    `z ∈ [0..min(⌊(100 - 50) / 20⌋, 5)] = [0..2]`.
    

### Paso 4: Verificar consistencia

En este punto, los dominios son:

- `x ∈ [10..10]` (valor fijo).
- `y ∈ [0..5]`.
- `z ∈ [0..2]`.
- `v ∈ [50..100]`.

No hay dominios vacíos y las restricciones se cumplen, por lo que el CSP es arcoconsistente.

### Solución final (ejemplo):

Si asignamos `y = 3` y `z = 2`:

`5(10) + 10(3) + 20(2) = 50 + 30 + 40 = 120`.

Esto excede el límite de `v = 100`, por lo que el sistema sigue ajustándose hasta encontrar combinaciones válidas.

El sistema es arcoconsistente porque no hay contradicciones en los dominios, y las restricciones se cumplen para valores válidos de las variables.

# Resumen

## Resumen

Este documento aborda diversos aspectos de los sistemas de restricción (CSP) y las reglas que se aplican para resolver problemas complejos. Se explican las restricciones de igualdad y desigualdad, las reglas booleanas, las restricciones sobre dominios de enteros, y las reglas de multiplicación y división. Además, se incluyen ejemplos prácticos aplicados a situaciones reales para ilustrar cómo funcionan estos conceptos en la práctica.

### Características

1. **Restricciones de igualdad y desigualdad:** Se presentan reglas formales para manejar dominios de variables bajo estas condiciones.
2. **Restricciones booleanas:** Uso de operadores lógicos (EQU, NOT, AND, OR) para propagar valores y encontrar soluciones consistentes.
3. **Restricciones sobre dominios de enteros:** Métodos para trabajar con desigualdades y ajustarlas a los dominios de las variables.
4. **Reglas de multiplicación y división:** Técnicas para refinar dominios y propagar restricciones en problemas con operaciones aritméticas.

### Ventajas

- Permiten modelar y resolver problemas complejos en diversos campos como logística, optimización y planificación.
- Facilitan la identificación de inconsistencias antes de realizar cálculos innecesarios.
- Los ejemplos prácticos muestran cómo aplicar las reglas para obtener soluciones claras y consistentes.
- Ayudan a reducir el espacio de búsqueda, haciendo más eficiente la resolución de problemas.

### Desventajas

- Los CSP pueden volverse computacionalmente costosos cuando el número de variables y restricciones aumenta.
- En algunos casos, pueden aparecer dominios vacíos, lo que indica que el problema es insatisfacible.
- La comprensión y aplicación de las reglas puede ser desafiante para quienes no están familiarizados con los fundamentos matemáticos y lógicos.

## Mensaje de motivación

Sabemos que el tema de los sistemas de restricción puede parecer complicado, abstracto o incluso poco interesante al principio. Sin embargo, te invitamos a verlo como un desafío emocionante. Las herramientas y conceptos que estás aprendiendo tienen aplicaciones reales y prácticas que pueden marcar una gran diferencia en la resolución de problemas del mundo real. Desde diseñar un videojuego con lógica compleja hasta optimizar la distribución de recursos en una empresa, los conocimientos adquiridos aquí son fundamentales.

Recuerda, aprender algo nuevo siempre es una inversión en ti mismo. Las habilidades que desarrolles hoy te abrirán puertas en el futuro, y cada pequeño paso que tomas te acerca más a ser un experto en este campo. ¡Sigue adelante, confía en tu capacidad para dominar estos conceptos y conviértete en un solucionador de problemas extraordinario!
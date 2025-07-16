# Clase 1. Algoritmos

# Algoritmos

¿Que es un algoritmo?

Es una secuencia de pasos para resolver un problema

---

Parte de un algoritmo

- Entrada: Es un dato o información que ingresa a un algoritmo
- Proceso: Secuencia de pasos para resolver el problema (por ahora es una caja negra)
- Salida. Resultado del algoritmo

---

Entradas

Deben cumplir una **precondición** (una serie de requisitos para que el algoritmo funcione correctamente)

Sumar dos numeros A y B

$A \in \mathbb{R} \wedge B \in \mathbb{R}$

Esto es fundamental para que el **algoritmo funcione correctamente**

Una entrada que cumple la precondición se como **instancia**

---

Proceso

Es la secuencia de pasos para resolver el problema

---

Salida

Es el resultado del algoritmo, y debe cumplir una **poscondición** (Una serie de requisitos para que la salida se correcta)

---

# Clasificación de algoritmos

Algoritmos deterministas

- Siempre nos van a dar el mismo resultado con la misma entrada así lo ejecutemos muchas veces
- Son predecibles

Algoritmos probabilisticos

- No son predecibles pero en promedio nos dan buenos resultados (depende de cómo miremos la solución)
- Son buenos para casos en que los algoritmos deterministas son difíciles de implementar o tienen una gran complejidad computacional (Machine Learning / Deep Learning)

---

Algoritmos probabilistas numéricos

Montecarlo

- Estos algoritmos dan una respuesta que en promedio es correcta (repeticiones)
- Estos algoritmos no garantizan una solución correcta sino aceptable (bajo cierto criterio)
- Ejemplo de la primalidad: Escoja numeros primos entre 2 y n, y haga la verificación, si alguno da como divisor es un número compuesto

---

Las vegas

- Este da una solución correcta o falla
- Modificación de un algoritmo determinista incluyendo en elemento aleatorio (Quicksort con pivote aleatorio)
- Generación de un algoritmo probabilista (n reinas)

---

# Recursividad

¿Que es?

Un problema se puede resolver en terminos de si mismo

---

Partes de la recursividad

- Caso base: Solución es inmediata
- Caso recursivo: Se requiere llamar la función y paulatinamente vamos acercandonos al caso base

Recursividad vs Iterativo

- Aveces es mejor uno o el otro
- Recursividad suele ser mas complejo (espacio) por temas de la pila y en (tiempo) porque asocia varios llamado → Sin embargo esto se puede optimizar (promesa programación dinamica)

# Resumen

Aquí está un resumen completo del contenido sobre algoritmos:

**Definición y Componentes:**

- Un algoritmo es una secuencia de pasos para resolver un problema
- Componentes principales:
    - Entrada: Datos que ingresan al algoritmo
    - Proceso: Secuencia de pasos para resolver el problema
    - Salida: Resultado del algoritmo

**Características importantes:**

- Las entradas deben cumplir una precondición para que el algoritmo funcione correctamente
- La salida debe cumplir una poscondición

**Clasificación de Algoritmos:**

- Deterministas:
    - Dan el mismo resultado con la misma entrada
    - Son predecibles
- Probabilísticos:
    - No son predecibles pero dan buenos resultados en promedio
    - Útiles cuando los algoritmos deterministas son complejos

**Tipos de Algoritmos Probabilísticos:**

- Montecarlo:
    - Dan respuestas correctas en promedio
    - No garantizan solución correcta sino aceptable
- Las Vegas:
    - Dan una solución correcta o fallan
    - Incluyen elementos aleatorios en algoritmos deterministas

**Recursividad:**

- Es resolver un problema en términos de sí mismo
- Tiene dos partes:
    - Caso base: Solución inmediata
    - Caso recursivo: Llamadas a la función que se acercan al caso base
- Comparada con iteración, puede ser más compleja en espacio y tiempo, pero es optimizable
# Clase 10 de Mayo: Teorema de residuo chino y representación números grandes

# Teorema de residuo chino

[ResiduoChino_annotated.pdf](ResiduoChino_annotated.pdf)

El Teorema de Residuo Chino establece que si tenemos un conjunto de enteros positivos m1, m2, ..., mn que son primos relativos dos a dos (es decir, el máximo común divisor de cada par es 1), entonces el sistema de congruencias:

x ≡ a1 (mod m1),

x ≡ a2 (mod m2),

...

x ≡ an (mod mn),

tiene una solución única módulo m, donde m es el producto de todos los mi (m = m1 * m2 * ... * mn). Esto significa que existe un número x tal que 0 ≤ x < m que satisface todas las congruencias, y cualquier otra solución será congruente con x módulo m.

### Ejemplo

Supongamos que tenemos el siguiente sistema de congruencias:

x ≡ 2 (mod 3),

x ≡ 3 (mod 4),

x ≡ 1 (mod 5).

Aquí, los módulos 3, 4 y 5 son primos relativos dos a dos. El valor de m será el producto de los módulos:

m = 3 * 4 * 5 = 60.

Ahora, encontramos la solución. Primero, calculamos los valores de M1, M2 y M3, que son m dividido por cada módulo:

M1 = m / 3 = 20,

M2 = m / 4 = 15,

M3 = m / 5 = 12.

Luego, encontramos los valores inversos de M1, M2 y M3 módulo sus respectivos mi. Esto significa encontrar un número que multiplicado por Mi dé como resultado 1 módulo mi. Por simplicidad, aquí damos los valores directamente:

N1 ≡ 2 (mod 3),

N2 ≡ 3 (mod 4),

N3 ≡ 4(mod).

Se considera Mk = m/mk, para k = 1, 2, ..., n. Esto significa que Mk es el producto de los módulos excepto el módulo mk correspondiente. Dado que mi y mk no tienen factores comunes mayores que 1 cuando i ≠ k, se sigue que el máximo común divisor (mcd) de mk y Mk es igual a 1. Esto implica que no tienen divisores en común, lo que asegura la existencia de un entero yk, el cual es el inverso de Mk módulo mk. Es decir, Mk * yk ≡ 1 (mod mk).

Para construir una solución al sistema de congruencias, se utiliza la suma:

x = a1 * M1 * y1 + a2 * M2 * y2 + ... + an * Mn * yn.

Mostremos que x es una solución del sistema de congruencias. Cuando evaluamos esta expresión módulo mk, observamos que todos los términos de la suma excepto el k-ésimo son congruentes con 0 módulo mk, ya que Mj ≡ 0 (mod mk) para j ≠ k. Por lo tanto, el único término relevante es el k-ésimo, y como Mk * yk ≡ 1 (mod mk), se concluye que:

x ≡ ak * Mk * yk ≡ ak (mod mk),

para k = 1, 2, ..., n. Por lo tanto, x satisface todas las congruencias del sistema.

### Ejemplo práctico

Consideremos el mismo sistema de congruencias:

x ≡ 2 (mod 3),

x ≡ 3 (mod 4),

x ≡ 1 (mod 5).

1. **Cálculo de m**:
    
    El producto de los módulos es:
    
    m = 3 * 4 * 5 = 60.
    
2. **Cálculo de Mk**:
    
    M1 = m / 3 = 20,
    
    M2 = m / 4 = 15,
    
    M3 = m / 5 = 12.
    
3. **Cálculo de los inversos yk**:
    
    Encontramos los valores de yk tal que Mk * yk ≡ 1 (mod mk):
    
    - Para M1 = 20, buscamos y1 tal que 20 * y1 ≡ 1 (mod 3). El valor es y1 = 2.
    - Para M2 = 15, buscamos y2 tal que 15 * y2 ≡ 1 (mod 4). El valor es y2 = 3.
    - Para M3 = 12, buscamos y3 tal que 12 * y3 ≡ 1 (mod 5). El valor es y3 = 4.
4. **Construcción de x**:
    
    Sustituimos los valores en la fórmula:
    
    x = a1 * M1 * y1 + a2 * M2 * y2 + a3 * M3 * y3.
    
    Sustituyendo los valores:
    
    x = (2 * 20 * 2) + (3 * 15 * 3) + (1 * 12 * 4).
    
    Esto da:
    
    x = 80 + 135 + 48 = 263.
    
5. **Reducimos x módulo m**:
    
    x = 263 mod 60 = 23.
    

Por lo tanto, la solución única del sistema es x ≡ 23 (mod 60). Esto significa que cualquier otro número que satisfaga las congruencias será congruente con 23 módulo 60.

# Representación numeros grandes

[NumerosGrandes.pdf](NumerosGrandes.pdf)

La representación única de un entero mediante una n-tupla se basa en el Teorema del Residuo Chino. Este teorema permite descomponer un entero en una serie de residuos respecto a módulos primos relativos dos a dos, lo que garantiza que haya una correspondencia única entre el entero y la n-tupla de residuos.

Supongamos que tenemos enteros primos relativos dos a dos m1, m2, ..., mn, todos mayores o iguales que 2, y sea m su producto, es decir, m = m1 * m2 * ... * mn. Entonces, cualquier entero a en el rango 0 ≤ a < m puede representarse de manera única por una n-tupla que contiene los residuos de las divisiones de a por cada uno de los mi. En otras palabras:

a ≡ (a mod m1, a mod m2, ..., a mod mn).

### Ejemplo práctico

Supongamos que m1 = 3, m2 = 4 y m3 = 5. El producto total de los módulos es:

m = 3 * 4 * 5 = 60.

Consideremos un entero a = 23. Queremos representar a mediante una n-tupla basada en los residuos de las divisiones de a por los módulos dados.

1. **Cálculo de los residuos**:
    - Para m1 = 3: a mod 3 = 23 mod 3 = 2.
    - Para m2 = 4: a mod 4 = 23 mod 4 = 3.
    - Para m3 = 5: a mod 5 = 23 mod 5 = 3.
2. **Representación como n-tupla**:
El entero a = 23 se representa de manera única como la n-tupla (2, 3, 3), ya que estos son los residuos de las divisiones de 23 por 3, 4 y 5.

### Observación

La representación mediante una n-tupla es única porque los módulos m1, m2, ..., mn son primos relativos dos a dos. Esto asegura que cualquier otro entero en el rango 0 ≤ a < m tendrá una n-tupla de residuos distinta. Además, utilizando el Teorema del Residuo Chino, también es posible reconstruir el entero original a partir de su n-tupla de residuos si conocemos los módulos m1, m2, ..., mn.

En resumen, la representación de un entero en términos de una n-tupla no solo es única, sino que también es una forma eficiente de trabajar con números en sistemas modulares. Esta propiedad tiene aplicaciones importantes en áreas como la criptografía, la teoría de números y la informática.

### Representación de números enteros mediante pares ordenados

La representación de números enteros mediante pares ordenados es una forma de expresar cualquier número entero no negativo utilizando los restos de sus divisiones por dos módulos que son primos relativos (es decir, no tienen divisores comunes mayores que 1). Esta representación se basa en el Teorema del Residuo Chino, el cual garantiza que haya una correspondencia única entre cada número en el rango determinado y el par ordenado de residuos.

### Ejemplo

Queremos representar los números enteros no negativos menores que 12 utilizando pares ordenados, donde la primera componente es el resto de la división del número por 3, y la segunda componente es el resto de la división del número por 4.

1. **Cálculo de los restos**:
    
    Para cada número entero entre 0 y 11, calculamos:
    
    - El resto de la división por 3 (para la primera componente).
    - El resto de la división por 4 (para la segunda componente).
2. **Representaciones obtenidas**:
    - 0 es (0, 0), ya que 0 dividido por 3 da resto 0 y 0 dividido por 4 también da resto 0.
    - 1 es (1, 1), ya que 1 dividido por 3 da resto 1 y 1 dividido por 4 también da resto 1.
    - 2 es (2, 2), ya que 2 dividido por 3 da resto 2 y 2 dividido por 4 también da resto 2.
    - 3 es (0, 3), ya que 3 dividido por 3 da resto 0 y 3 dividido por 4 da resto 3.
    - 4 es (1, 0), ya que 4 dividido por 3 da resto 1 y 4 dividido por 4 da resto 0.
    - 5 es (2, 1), ya que 5 dividido por 3 da resto 2 y 5 dividido por 4 da resto 1.
    - 6 es (0, 2), ya que 6 dividido por 3 da resto 0 y 6 dividido por 4 da resto 2.
    - 7 es (1, 3), ya que 7 dividido por 3 da resto 1 y 7 dividido por 4 da resto 3.
    - 8 es (2, 0), ya que 8 dividido por 3 da resto 2 y 8 dividido por 4 da resto 0.
    - 9 es (0, 1), ya que 9 dividido por 3 da resto 0 y 9 dividido por 4 da resto 1.
    - 10 es (1, 2), ya que 10 dividido por 3 da resto 1 y 10 dividido por 4 da resto 2.
    - 11 es (2, 3), ya que 11 dividido por 3 da resto 2 y 11 dividido por 4 da resto 3.

### Resultado

Las representaciones únicas para los números enteros no negativos menores que 12 son las siguientes:

- 0 = (0, 0)
- 1 = (1, 1)
- 2 = (2, 2)
- 3 = (0, 3)
- 4 = (1, 0)
- 5 = (2, 1)
- 6 = (0, 2)
- 7 = (1, 3)
- 8 = (2, 0)
- 9 = (0, 1)
- 10 = (1, 2)
- 11 = (2, 3)

Cada número tiene una representación única como par ordenado (resto mod 3, resto mod 4). Esta propiedad garantiza que podemos reconstruir el número original a partir de su par ordenado utilizando el Teorema del Residuo Chino.

### Observación

El total de combinaciones posibles de pares ordenados es igual al producto de los módulos (en este caso, 3 y 4). Dado que 3 * 4 = 12, hay exactamente 12 pares únicos, uno para cada número del 0 al 11.

### Aritmética computacional con enteros grandes

La aritmética computacional con números enteros grandes puede simplificarse utilizando el Teorema del Residuo Chino, que permite representar un número grande como una n-tupla de residuos. Esto facilita las operaciones aritméticas al trabajar con números más pequeños en lugar de manejar directamente el número grande. El procedimiento básico consiste en seleccionar módulos adecuados y realizar las operaciones de forma componente a componente.

### Procedimiento

1. **Selección de módulos**: Seleccione módulos m1, m2, ..., mn tales que:
    - mi > 2 para todos los módulos.
    - El máximo común divisor (mcd) de cualquier par de módulos mi y mj (con i diferente de j) sea igual a 1.
    - El producto total de los módulos, m = m1 * m2 * ... * mn, sea mayor que el número grande que desea representar o calcular.
2. **Representación como n-tuplas**: Para un entero grande a, calcule los residuos de la división de a por cada módulo mi, lo que da lugar a una n-tupla:
a ≡ (a mod m1, a mod m2, ..., a mod mn).
3. **Operaciones aritméticas**: Las operaciones (como suma, resta, multiplicación) se realizan componente a componente en las n-tuplas. Es decir:
    - Si a ≡ (a1, a2, ..., an) y b ≡ (b1, b2, ..., bn), entonces:
        - La suma es (a1 + b1 mod m1, a2 + b2 mod m2, ..., an + bn mod mn).
        - La resta es (a1 - b1 mod m1, a2 - b2 mod m2, ..., an - bn mod mn).
        - La multiplicación es (a1 * b1 mod m1, a2 * b2 mod m2, ..., an * bn mod mn).
4. **Reconstrucción del número**: Una vez realizadas las operaciones, el número resultante puede reconstruirse utilizando el Teorema del Residuo Chino.

### Ejemplo práctico

Supongamos que queremos calcular la suma de dos números grandes, a = 12345 y b = 67890. Elegimos los módulos m1 = 3, m2 = 5 y m3 = 7, que son primos relativos dos a dos y cuyo producto, m = 3 * 5 * 7 = 105, es mayor que ambos números.

1. **Cálculo de las representaciones**:
    - Para a = 12345:
        - Residuo mod 3: 12345 mod 3 = 0.
        - Residuo mod 5: 12345 mod 5 = 0.
        - Residuo mod 7: 12345 mod 7 = 6.
        - Representación de a: (0, 0, 6).
    - Para b = 67890:
        - Residuo mod 3: 67890 mod 3 = 0.
        - Residuo mod 5: 67890 mod 5 = 0.
        - Residuo mod 7: 67890 mod 7 = 6.
        - Representación de b: (0, 0, 6).
2. **Cálculo de la suma**:
    - Suma componente a componente:
        - Componente 1: (0 + 0) mod 3 = 0.
        - Componente 2: (0 + 0) mod 5 = 0.
        - Componente 3: (6 + 6) mod 7 = 5.
    - Representación de la suma: (0, 0, 5).
3. **Reconstrucción del resultado**:
Usamos el Teorema del Residuo Chino para reconstruir el número original a partir de la n-tupla (0, 0, 5). La solución única módulo 105 corresponde al número 35.

### Ventajas

Este enfoque permite realizar cálculos con números grandes utilizando módulos más pequeños, lo que reduce la complejidad computacional. Es especialmente útil en aplicaciones como la criptografía y el cálculo modular, donde trabajar directamente con números grandes sería ineficiente.

El Teorema del Residuo Chino es una herramienta poderosa para trabajar con enteros grandes mediante representaciones modulares, lo que permite realizar cálculos más eficientes reduciendo el tamaño de los números involucrados. A continuación, se explica el concepto con un ejemplo práctico.

Suponga que realizar operaciones aritméticas con enteros menores que 100 en un procesador es más eficiente que trabajar con números mayores que 100. Utilizando el Teorema del Residuo Chino, podemos reducir casi todas las operaciones aritméticas a números menores que 100 eligiendo módulos que sean primos relativos dos a dos. Por ejemplo, considere los módulos 99, 98, 97 y 95, cuyo producto es:

99 * 98 * 97 * 95 = 89,403,930.

El Teorema del Residuo Chino garantiza que cualquier entero no negativo menor que 89,403,930 puede representarse de forma única mediante una 4-tupla de residuos correspondientes a estos módulos.

### Ejemplo práctico

Supongamos que queremos calcular la suma de dos números grandes, 123,684 y 413,456.

1. **Representación como 4-tuplas**:
    - Para 123,684, calculamos sus residuos módulo 99, 98, 97 y 95:
        - 123,684 mod 99 = 33.
        - 123,684 mod 98 = 8.
        - 123,684 mod 97 = 9.
        - 123,684 mod 95 = 89.
        Por lo tanto, 123,684 se representa como la 4-tupla (33, 8, 9, 89).
    - Para 413,456, calculamos sus residuos módulo 99, 98, 97 y 95:
        - 413,456 mod 99 = 32.
        - 413,456 mod 98 = 92.
        - 413,456 mod 97 = 42.
        - 413,456 mod 95 = 16.
        Por lo tanto, 413,456 se representa como la 4-tupla (32, 92, 42, 16).
2. **Cálculo de la suma**:
En lugar de sumar los números directamente (123,684 + 413,456), sumamos las 4-tuplas componente a componente y reducimos cada resultado módulo el correspondiente módulo:
    - Primera componente: (33 + 32) mod 99 = 65.
    - Segunda componente: (8 + 92) mod 98 = 2.
    - Tercera componente: (9 + 42) mod 97 = 51.
    - Cuarta componente: (89 + 16) mod 95 = 10.
    Por lo tanto, la suma de las 4-tuplas es (65, 2, 51, 10).
3. **Reconstrucción del número original**:
Para calcular el número representado por la 4-tupla (65, 2, 51, 10), debemos resolver el siguiente sistema de congruencias:
    - x ≡ 65 (mod 99),
    - x ≡ 2 (mod 98),
    - x ≡ 51 (mod 97),
    - x ≡ 10 (mod 95).
    
    Este sistema tiene una solución única en el rango 0 ≤ x < 89,403,930. Resolviendo el sistema, encontramos que la solución es:
    
    x = 537,140.
    

Por lo tanto, 123,684 + 413,456 = 537,140.

### Observaciones

1. **Eficiencia**: Todas las operaciones aritméticas principales (suma, resta, multiplicación) se realizan con números menores que 100, lo que es más eficiente computacionalmente.
2. **Recuperación del número original**: Sólo se requiere trabajar con números mayores que 100 al final, cuando se reconstruye el entero original a partir de la tupla de residuos utilizando el Teorema del Residuo Chino.
3. **Construcción de módulos adecuados**: Una forma práctica de construir módulos adecuados para este enfoque es utilizar enteros de la forma 2^k - 1 (donde k es un número positivo en el conjunto de enteros, Z+), ya que estos números suelen ser primos relativos.

En resumen, el Teorema del Residuo Chino proporciona una forma eficiente de manejar números grandes al descomponerlos en residuos módulo números más pequeños. Este enfoque tiene aplicaciones prácticas en áreas como la criptografía, el diseño de procesadores y los cálculos modulares en general.

### Resumen del Documento

El documento aborda dos temas principales relacionados con el Teorema del Residuo Chino y la representación de números grandes. A continuación, se destacan los aspectos más relevantes:

### **1. Teorema del Residuo Chino**

- **Definición**: Permite resolver sistemas de congruencias con módulos primos relativos dos a dos. Garantiza que existe una solución única módulo el producto de los módulos.
- **Pasos principales**:
    1. Calcular el producto de los módulos (`m`).
    2. Dividir `m` por cada módulo para obtener los valores `Mk`.
    3. Calcular los inversos de `Mk` módulo sus respectivos módulos (`yk`).
    4. Construir la solución mediante la fórmula:
        
        ```
        x = a1 * M1 * y1 + a2 * M2 * y2 + ... + an * Mn * yn.
        
        ```
        
- **Ejemplo práctico**: Se resolvió un sistema de congruencias con módulos 3, 4 y 5, obteniendo una solución única: `x ≡ 23 (mod 60)`.

### **2. Representación de Números Grandes**

- **Concepto**: Utiliza el Teorema del Residuo Chino para representar un entero como una n-tupla de residuos respecto a módulos primos relativos.
- **Características**:
    - Garantiza correspondencia única entre el entero y la n-tupla.
    - Ejemplo práctico: Representar el número 23 como `(2, 3, 3)` usando los módulos 3, 4 y 5.
- **Ventajas**:
    - Optimización en cálculos aritméticos.
    - Aplicaciones en criptografía y teoría de números.

### **3. Ejemplos Prácticos**

El documento incluye varios ejemplos detallados que ilustran:

- Resolución de sistemas de congruencias.
- Representación única de números enteros mediante pares ordenados o n-tuplas.
- Uso del Teorema del Residuo Chino para realizar operaciones con enteros grandes de manera más eficiente.

### **4. Aplicaciones**

- **Criptografía**: Facilita el manejo de números grandes mediante descomposición modular.
- **Cálculos computacionales**: Permite trabajar con números pequeños para reducir la complejidad computacional.
- **Reconstrucción de números**: Posibilidad de recuperar el número original a partir de su representación modular.

---

### Tabla Resumen

| Tema | Aspectos Relevantes | Ejemplo Clave |
| --- | --- | --- |
| **Teorema del Residuo Chino** | - Solución única a sistemas de congruencias. | `x ≡ 23 (mod 60)` |
|  | - Fórmula: `x = a1 * M1 * y1 + ... + an * Mn * yn`. |  |
| **Representación de Números** | - Representación única como n-tupla de residuos. | `(2, 3, 3)` para 23 usando 3, 4 y 5. |
|  | - Facilita cálculos aritméticos y optimiza operaciones con números grandes. |  |
| **Aplicaciones** | - Criptografía, teoría de números y cálculos modulares. | Uso de módulos primos relativos. |
| **Ejemplo de Operaciones** | - Suma de números grandes representados modularmente: `(33, 8, 9, 89) + (32, 92, 42, 16)`. | Resultado: `(65, 2, 51, 10)`. |

Este documento es una guía detallada sobre el uso del Teorema del Residuo Chino y sus aplicaciones en representaciones de números y cálculos modulares.
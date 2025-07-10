# Clase 14 de Mayo: Sistemas de congruencias, teorema del residuo chino y sistemas de números

# Solución de sistemas de congruencias

El **Teorema chino del residuo** es una herramienta fundamental en la teoría de números y permite resolver sistemas de congruencias simultáneas cuando los módulos son coprimos (es decir, no tienen factores comunes mayores que 1). A continuación, explicamos el teorema y damos un ejemplo.

### Explicación del teorema

Sea un sistema de congruencias de la forma:

x ≡ a1 (mod m1)

x ≡ a2 (mod m2)

...

x ≡ an (mod mn)

donde m1, m2, ..., mn son enteros positivos coprimos. El teorema establece que hay una solución única módulo **m = m1 * m2 * ... * mn**, y se puede construir explícitamente de la siguiente manera:

1. Calcular **Mk = m / mk**, donde **Mk** es el producto de todos los módulos excepto **mk**.
2. Como los módulos son coprimos, se garantiza que **Mcd(mk, Mk) = 1**, es decir, Mk y mk no tienen factores comunes. Esto asegura que existe un inverso multiplicativo **yk** de **Mk** módulo **mk**, tal que:
    
    Mk * yk ≡ 1 (mod mk).
    
3. Construir la solución general como:
    
    x = a1 * M1 * y1 + a2 * M2 * y2 + ... + an * Mn * yn.
    
    Donde cada término de la suma satisface las restricciones de su respectiva congruencia.
    
4. Finalmente, x es una solución del sistema, y las demás soluciones son congruentes módulo **m**.

### Ejemplo

Resolvamos el siguiente sistema de congruencias:

x ≡ 2 (mod 3)

x ≡ 3 (mod 5)

x ≡ 2 (mod 7)

Primero, calculamos **m = 3 * 5 * 7 = 105**.

1. Para cada módulo, calculamos **Mk**:
    - M1 = 105 / 3 = 35
    - M2 = 105 / 5 = 21
    - M3 = 105 / 7 = 15
2. Encontramos los inversos de **Mk** módulo **mk**:
    - Para M1 = 35 (mod 3), el inverso es y1 = -1, ya que 35 * -1 ≡ 1 (mod 3).
    - Para M2 = 21 (mod 5), el inverso es y2 = 1, ya que 21 * 1 ≡ 1 (mod 5).
    - Para M3 = 15 (mod 7), el inverso es y3 = 1, ya que 15 * 1 ≡ 1 (mod 7).
3. Construimos la solución como:
    
    x = a1 * M1 * y1 + a2 * M2 * y2 + a3 * M3 * y3
    
    x = -1 * 35 * 2 + 3 * 21 * 1 + 2 * 15 * 1
    
    x = 23
    
4. Reducimos módulo 105:
    
    x ≡ 23 (mod 105).
    

Por lo tanto, la solución es **x = 23 (mod 105)**, y todas las demás soluciones son de la forma **x ≡ 23 + 105k**, donde k es un entero.

[2025-05-14-Note-17-19_annotated.pdf](2025-05-14-Note-17-19_annotated.pdf)

# Representación de enteros grandes

### Representación única de un entero mediante una n-tupla

El Teorema chino del residuo permite representar un entero de manera única mediante una n-tupla de residuos, siempre que los módulos involucrados sean primos relativos dos a dos y mayores o iguales que 2. Esto se debe a que el teorema asegura la existencia y unicidad de una solución para sistemas de congruencias con módulos coprimos.

### Teoría

Supongamos que m1, m2, ..., mn son enteros positivos coprimos (es decir, son primos relativos dos a dos) y que m es su producto, es decir:

m = m1 * m2 * ... * mn.

Si tomamos un entero a tal que 0 ≤ a < m, este entero se puede representar de manera única mediante una n-tupla que contiene los residuos de las divisiones de a por cada uno de los módulos mi. En otras palabras, la representación única de a está dada por:

(a mod m1, a mod m2, ..., a mod mn).

El Teorema chino del residuo garantiza que esta representación es única, ya que existe una correspondencia biunívoca entre los enteros en el rango [0, m) y las n-tuplas formadas por los residuos (a mod m1, ..., a mod mn).

### Ejemplo

Supongamos que m1 = 3, m2 = 5, y m3 = 7. Entonces, m = 3 * 5 * 7 = 105. Queremos representar el entero a = 23 mediante una n-tupla utilizando los módulos m1, m2, y m3.

1. Calculamos los residuos:
    - 23 mod 3 = 2
    - 23 mod 5 = 3
    - 23 mod 7 = 2
2. La representación única de 23 mediante una n-tupla es:

(23 mod 3, 23 mod 5, 23 mod 7) = (2, 3, 2).

Por lo tanto, el entero 23 se representa de manera única por la n-tupla (2, 3, 2) utilizando los módulos 3, 5 y 7.

### Aplicación

Este tipo de representación es muy útil en áreas como la criptografía, la teoría de números y la informática, ya que permite trabajar con números grandes de manera más manejable dividiéndolos en componentes más pequeños.

### Aritmética computacional con enteros grandes

La aritmética computacional con enteros grandes se basa en el uso del **Teorema chino del residuo** para dividir un problema complejo en cálculos más pequeños y manejables. Este enfoque utiliza módulos seleccionados cuidadosamente para representar enteros grandes mediante n-tuplas de restos. Los cálculos se realizan componente a componente, y el valor final se reconstruye al resolver un sistema de congruencias.

### Proceso para realizar aritmética con enteros grandes:

1. **Selección de módulos**:
Se eligen módulos m1, m2, ..., mn tales que:
    - mi > 2 para todo i.
    - mcd(mi, mj) = 1 para mi ≠ mj.
    - El producto de los módulos, m = m1 * m2 * ... * mn, debe ser mayor que el resultado buscado.
2. **Representación mediante restos**:
Un entero grande se representa como una n-tupla formada por los restos de la división del número por cada módulo mi. Es decir:
    
    ```
    a ≡ (a mod m1, a mod m2, ..., a mod mn).
    
    ```
    
3. **Operaciones aritméticas**:
Las operaciones como suma, resta y multiplicación se realizan componente a componente sobre las n-tuplas. Para dos enteros grandes a y b representados como:
    
    ```
    a ≡ (a1, a2, ..., an), donde ai = a mod mi,
    b ≡ (b1, b2, ..., bn), donde bi = b mod mi,
    
    ```
    
    las operaciones se realizan módulo mi para cada i:
    
    - Suma: c ≡ (a1 + b1 mod m1, a2 + b2 mod m2, ..., an + bn mod mn).
    - Resta: c ≡ (a1 - b1 mod m1, a2 - b2 mod m2, ..., an - bn mod mn).
    - Multiplicación: c ≡ (a1 * b1 mod m1, a2 * b2 mod m2, ..., an * bn mod mn).
4. **Reconstrucción del resultado**:
Una vez calculados los valores de cada componente, se utiliza el Teorema chino del residuo para recuperar el valor completo del resultado resolviendo un sistema de congruencias:
    
    ```
    x ≡ c1 (mod m1)
    x ≡ c2 (mod m2)
    ...
    x ≡ cn (mod mn).
    
    ```
    

### Propiedades de interés:

1. Este método permite trabajar con enteros más grandes de lo que un computador puede manejar directamente, ya que divide el cálculo en componentes más pequeños.
2. Los cálculos sobre los diferentes módulos pueden realizarse en paralelo, mejorando la eficiencia computacional.

### Ejemplo:

Supongamos que queremos multiplicar dos enteros grandes, 12345 y 67890, utilizando módulos m1 = 3, m2 = 5 y m3 = 7.

1. **Representación mediante restos**:
Calculamos los restos de cada número para los módulos seleccionados:
    - Para 12345:
    Entonces, 12345 ≡ (0, 0, 6).
        
        ```
        12345 mod 3 = 0, 12345 mod 5 = 0, 12345 mod 7 = 6.
        
        ```
        
    - Para 67890:
    Entonces, 67890 ≡ (0, 0, 6).
        
        ```
        67890 mod 3 = 0, 67890 mod 5 = 0, 67890 mod 7 = 6.
        
        ```
        
2. **Multiplicación componente a componente**:
Multiplicamos los valores correspondientes para cada módulo:
    - Para m1 = 3: (0 * 0 mod 3) = 0,
    - Para m2 = 5: (0 * 0 mod 5) = 0,
    - Para m3 = 7: (6 * 6 mod 7) = 1.
    
    Entonces, el resultado parcial es c ≡ (0, 0, 1).
    
3. **Reconstrucción del resultado**:
Resolvemos el sistema de congruencias:
    
    ```
    x ≡ 0 (mod 3)
    x ≡ 0 (mod 5)
    x ≡ 1 (mod 7).
    
    ```
    
    Utilizando el Teorema chino del residuo, encontramos que x ≡ 315 (mod 105).
    

Por lo tanto, el resultado de la multiplicación es **315**.

### Resumen del Documento

El documento aborda el **Teorema chino del residuo**, su explicación, aplicaciones y ejemplos prácticos, junto con su utilidad en la **aritmética computacional con enteros grandes**. Los aspectos más relevantes se destacan a continuación:

### Aspectos principales:

1. **Teorema chino del residuo**:
    - Permite resolver sistemas de congruencias con módulos coprimos.
    - Garantiza una solución única módulo m = m1 * m2 * ... * mn.
    - Se utiliza para representar enteros grandes mediante n-tuplas de residuos.
2. **Pasos principales para resolver sistemas de congruencias**:
    - Cálculo de los valores **Mk** (productos parciales de los módulos).
    - Determinación de los inversos multiplicativos de **Mk**.
    - Construcción de la solución general.
    - Reducción del resultado módulo m.
3. **Ejemplo práctico**:
    - Sistema de congruencias:
        - x ≡ 2 (mod 3)
        - x ≡ 3 (mod 5)
        - x ≡ 2 (mod 7)
    - Solución: x ≡ 23 (mod 105).
4. **Representación única mediante residuos**:
    - Enteros representados como n-tuplas de residuos.
    - Ejemplo: El número 23 se representa como (2, 3, 2) usando los módulos 3, 5 y 7.
5. **Aritmética computacional con enteros grandes**:
    - Uso del Teorema chino del residuo para dividir cálculos complejos en componentes más pequeños.
    - Operaciones como suma, resta y multiplicación se realizan componente a componente.
    - Reconstrucción del resultado utilizando sistemas de congruencias.

### Características del documento:

| Tema | Contenido |
| --- | --- |
| **Teorema chino del residuo** | Explicación detallada y pasos para resolver sistemas de congruencias. |
| **Ejemplo práctico** | Sistema con módulos 3, 5 y 7; resultado: x ≡ 23 (mod 105). |
| **Representación de enteros grandes** | Uso de n-tuplas de residuos para representar enteros de forma única. |
| **Aritmética computacional** | Método para realizar operaciones con enteros grandes de manera eficiente. |
| **Aplicaciones** | Criptografía, teoría de números, informática. |

Este documento es una guía introductoria y práctica sobre el uso del Teorema chino del residuo, con énfasis en su utilidad para cálculos con enteros grandes y en aplicaciones computacionales.

[2025-05-14-Note-17-39_annotated.pdf](2025-05-14-Note-17-39_annotated.pdf)
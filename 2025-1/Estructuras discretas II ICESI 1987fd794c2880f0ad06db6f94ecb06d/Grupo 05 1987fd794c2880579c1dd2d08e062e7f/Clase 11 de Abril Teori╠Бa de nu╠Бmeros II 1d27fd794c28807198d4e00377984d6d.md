# Clase 11 de Abril: Teoría de números II

[Ejemplos iniciales clase](../Grupo%2001%201987fd794c2880938872f773726292df/Clase%2011%20de%20Abril%20Teori%CC%81a%20de%20Nu%CC%81meros%20II%201d27fd794c2880a399d4cef6af4cc4e0/Ejemplos%20iniciales%20clase%201d27fd794c28800ca50beb518267f6f7.md)

# Algoritmo de la división

$a = qd + r$

$q = a | d, d \texttt{ div } a$

17 = 4*4 + 1

-10 = 2(-5) + 0

-11 = 2(-5) + 1

$a \texttt{ mod } m = r \rightarrow a = km + r,  0 \leq r < m$

5 mod 3 = 2,  3*1 + 2 = 5

-5 mod 3 ⇒   -5 = 3(-2) + 1

$mod(a,b) = ( (a \% b) + b) \% b)$

 

```jsx
scala> def mod = (a:Int, b:Int):Int => ( (a % b) + b) % b
def mod: (Int, Int) => Int

scala> mod(5,3)
val res0: Int = 2

scala> mod(-5,3)
val res1: Int = 1
```

# Máximo común divisor

Es el mayor divisor común de dos números enteros a y b

Los divisores de 1340 son: 1, 2, 4, 5, 10, 20, 67, 134, 268, 335, 670, y 1340.

Los divisores de 2465 son: 1, 5, 17, 29, 85, 145, 493, y 2465.

mcm(1340, 2465) es 5

Cuando a y b son números muy grandes ¿Cual es el problema? La lista puede ser muy grande y estimarlos es **computacionalmente costoso**

## Factores primos

Los factores primos de un número son los números primos que, al multiplicarse entre sí, dan como resultado el número original. Para encontrar los factores primos de un número, se realiza una descomposición en factores primos dividiendo el número por los números primos más pequeños hasta que el resultado sea 1.

Por ejemplo, los factores primos de 60 son:

60 = 2 * 2 * 3 * 5

Por lo tanto, los factores primos de 60 son 2, 3 y 5.

Sea a y b dos números enteros positivos. Los factores primos de a son los números primos p1, p2, ..., pn tales que $a = p_1^{e1} * p_2^{e2} * ... * p_n^{en},$ donde e1, e2, ..., en son enteros positivos. De manera similar, los factores primos de b son los números primos q1, q2, ..., qm tales que $b = p_1^{f1} * p_2^{f2} * ... * p_n^{fn}$, donde f1, f2, ..., fm son enteros positivos.

Para estimar el mcm(a,b) vamos a tomar los factores primos y tomaremos el minimo de su exponente

El mcd(a, b) se define como el producto de los factores primos comunes de a y b, tomando el mínimo exponente de cada uno:

$mcd(a, b) = {p_1}^{min(e_1, f_1)} * {p_2}^{min(e_2, f_2)} * ... * {p_k}^{min(e_k, f_k)}$

donde ${p_1, p_2, ..., p_k}$ son los factores primos comunes de a y b, y $e_i y f_i$ son los exponentes correspondientes en la factorización de a y b, respectivamente.

Veamos cómo calcular el mcd(1032, 2043) paso a paso siguiendo la definición:

1. **Descomposición en factores primos de 1032**
    
    Primero descomponemos 1032 en sus factores primos:
    
    - 1032 es divisible por 2: 1032 / 2 = 516
    - 516 es divisible por 2: 516 / 2 = 258
    - 258 es divisible por 2: 258 / 2 = 129
    - 129 ya no es divisible por 2, probamos con el siguiente número primo, 3: 129 / 3 = 43
    - 43 es un número primo.
    
    Por lo tanto, la descomposición en factores primos de 1032 es:
    
    $1032 = 2^{3} * 3^{1} * 43^{1}$
    
2. **Descomposición en factores primos de 2043**
    
    Ahora descomponemos 2043 en sus factores primos:
    
    - 2043 no es divisible por 2, probamos con 3: 2043 / 3 = 681
    - 681 es divisible por 3: 681 / 3 = 227
    - 227 es un número primo.
    
    Por lo tanto, la descomposición en factores primos de 2043 es:
    
    $2043 = 3^{2} * 227^{1}$
    
3. **Identificación de factores comunes**
    
    Los factores primos comunes entre 1032 y 2043 son:
    
    - 3
4. **Aplicación de la fórmula del mcd**
    
    Para calcular el mcd, tomamos los factores primos comunes y elegimos el menor exponente:
    
    - Para el factor 3, el exponente mínimo entre 1032 y 2043 es 1 (porque en 1032 es 3^{1} y en 2043 es $3^{2}$).
    
    Por lo tanto:
    
    $mcd(1032, 2043) = 3^{1}$
    
5. **Resultado final**
    
    El mcd(1032, 2043) es:
    
    3
    

Si dos números a y b, su mcd(a,b) = 1 se conoce **primos relativos**, esto tiene mucha significancia en la algoritmos de encriptación.

# Mínimo común múltiplo

Dados dos números a y b existe un número c que es el menor posible que es divisible por ambos, por ejemplo a = 20 b = 30, mcm(20,30) = 60 

El mcm(a, b) se define como el producto de los factores primos comunes y no comunes de a y b, tomando el máximo exponente de cada uno:

${mcm(a, b) = p_1^{max(e_1, f_1)} * p_2^{max(e_2, f_2)} * ... * p_k^{max(e_k, f_k)}}$

donde ${p_1, p_2, ..., p_k}$ son los factores primos de a y b, y ${e_i} y {f_i}$ son los exponentes correspondientes en la factorización de a y b, respectivamente.

Veamos cómo calcular el mcm(1032, 2043) paso a paso siguiendo la definición:

1. **Descomposición en factores primos de 1032**
    
    Primero descomponemos 1032 en sus factores primos:
    
    - 1032 es divisible por 2: 1032 / 2 = 516
    - 516 es divisible por 2: 516 / 2 = 258
    - 258 es divisible por 2: 258 / 2 = 129
    - 129 ya no es divisible por 2, probamos con el siguiente número primo, 3: 129 / 3 = 43
    - 43 es un número primo.
    
    Por lo tanto, la descomposición en factores primos de 1032 es:
    
    $1032 = 2^3 * 3^1 * 43^1$
    
2. **Descomposición en factores primos de 2043**
    
    Ahora descomponemos 2043 en sus factores primos:
    
    - 2043 no es divisible por 2, probamos con 3: 2043 / 3 = 681
    - 681 es divisible por 3: 681 / 3 = 227
    - 227 es un número primo.
    
    Por lo tanto, la descomposición en factores primos de 2043 es:
    
    $2043 = 3^2 * 227^1$
    
3. **Identificación de factores primos**
    
    Los factores primos de 1032 son: 2, 3, 43
    
    Los factores primos de 2043 son: 3, 227
    
    Los factores primos comunes y no comunes entre 1032 y 2043 son: 2, 3, 43, 227.
    
4. **Aplicación de la fórmula del mcm**
    
    Para calcular el mcm, tomamos los factores primos comunes y no comunes, y elegimos el mayor exponente de cada uno:
    
    - Para el factor 2: aparece solo en 1032 con el exponente 3. Entonces, tomamos 2^3.
    - Para el factor 3: en 1032 aparece como 3^1, y en 2043 aparece como 3^2. Entonces, tomamos 3^2.
    - Para el factor 43: aparece solo en 1032 con el exponente 1. Entonces, tomamos 43^1.
    - Para el factor 227: aparece solo en 2043 con el exponente 1. Entonces, tomamos 227^1.
    
    Multiplicamos todos estos factores con sus mayores exponentes:
    
    $mcm(1032, 2043) = 2^3 * 3^2 * 43^1 * 227^1$
    
5. **Resultado final**
    
    Ahora realizamos las operaciones:
    
    - $2^3 = 8$
    - $3^2 = 9$
    - $43^1 = 43$
    - $227^1 = 227$
    
    Multiplicamos:
    
    8 * 9 = 72
    
    72 * 43 = 3096
    
    3096 * 227 = 702792
    
    Por lo tanto, el mcm(1032, 2043) es:
    
    702792
    

# Congruencia

Se dice que dos números a y b son congruentes modulo m, sii a mod m = b mod m y (a-b) mod m

10, 16 mod 3

10 mod 3 = 1

16 mod 3 = 1

(10 - 16) mod 3 = 0 → -6 mod 3 = 0

(16 - 10) mod 3 = 0 → 6 mod 3 = 0

4,7,10,13,16,19,….3x + 1

Teorema 1: Sean *a* y *b* números enteros, y *m* un entero positivo. Entonces, *a* es congruente con *b* módulo *m* (denotado como *a ≡ b (mod m)*) si, y sólo si, *a mod m = b mod m = r*, donde *r* es el residuo de la división de *a* y *b* entre *m*.

Teorema 2: Sea *m* un entero positivo. Los enteros *a* y *b* son congruentes módulo *m* si, y sólo si, existe un entero *k* tal que *a = b + km*. En otras palabras, la congruencia módulo *m* establece que la diferencia entre *a* y *b* es un múltiplo de *m*. El conjunto de todos los enteros congruentes a un entero *a* módulo *m* se denomina **clase de congruencia módulo *m***.

Teorema 3: Sea *m* un entero positivo. Si *a ≡ b (mod m)* y *c ≡ d (mod m)*, entonces se cumplen las siguientes propiedades:

1. La suma de los números es congruente: *a + c ≡ b + d (mod m)*.
2. El producto de los números es congruente: *a * c ≡ b * d (mod m)*.

![image.png](Clase%2011%20de%20Abril%20Teori%CC%81a%20de%20nu%CC%81meros%20II%201d27fd794c28807198d4e00377984d6d/image.png)

Un ejemplo práctico de aplicación de los teoremas de congruencia en criptografía es el algoritmo RSA, que utiliza propiedades de congruencia para generar claves y cifrar información de manera segura. Veamos un ejemplo específico de la generación de claves RSA:

1. **Seleccionar dos números primos grandes p y q**
    
    Supongamos que p = 61 y q = 53.
    
2. **Calcular n como el producto de p y q**
    
    n = p * q = 61 * 53 = 3233.
    
    Este valor de n será parte de la clave pública y privada.
    
3. **Calcular phi(n)**
    
    phi(n) = (p - 1) * (q - 1) = (61 - 1) * (53 - 1) = 60 * 52 = 3120.
    
    phi(n) es la función de Euler y representa la cantidad de enteros menores que n que son coprimos con n.
    
4. **Elegir un número e tal que 1 < e < phi(n) y e sea coprimo con phi(n)**
    
    Supongamos que elegimos e = 17 (e es un número primo y no tiene factores comunes con 3120).
    
5. **Calcular d como el inverso modular de e módulo phi(n)**
    
    Usamos el Teorema 2 de congruencia:
    
    d * e ≡ 1 (mod phi(n))
    
    Esto significa que d es el entero tal que (d * e) mod 3120 = 1.
    
    Utilizando el algoritmo extendido de Euclides, encontramos que d = 2753.
    
6. **Generar las claves públicas y privadas**
    - La clave pública es (e, n) = (17, 3233).
    - La clave privada es (d, n) = (2753, 3233).

### Ejemplo de cifrado y descifrado con RSA

Supongamos que queremos cifrar el mensaje m = 65:

1. **Cifrado**
    
    Usamos la fórmula:
    
    c ≡ m^e (mod n)
    
    c ≡ 65^17 (mod 3233).
    
    Realizando las operaciones, obtenemos c = 2790.
    
    El mensaje cifrado es 2790.
    
2. **Descifrado**
    
    Usamos la fórmula:
    
    m ≡ c^d (mod n)
    
    m ≡ 2790^2753 (mod 3233).
    
    Realizando las operaciones, obtenemos m = 65.
    
    El mensaje original ha sido recuperado.
    

### Explicación de la relevancia de los teoremas de congruencia

- **Teorema 1**: Garantiza que las operaciones módulo son consistentes, lo que permite trabajar con grandes exponentes en RSA al reducirlos módulo n.
- **Teorema 2**: Asegura que la relación entre e y d se puede expresar como una congruencia, lo cual es clave para calcular el inverso modular.
- **Teorema 3**: Permite que las operaciones de suma y producto en el cifrado y descifrado sean válidas bajo congruencia, asegurando la integridad del esquema criptográfico.

En resumen, RSA se basa en propiedades de congruencia para garantizar que las operaciones de cifrado y descifrado sean correctas y seguras.

# Algoritmo de Euclides

Los divisores de 287 son: 1, 7, 41, 287.

Los divisores de 91 son: 1, 7, 13, 91.

[2025-04-11-Note-17-25_annotated.pdf](Clase%2011%20de%20Abril%20Teori%CC%81a%20de%20nu%CC%81meros%20II%201d27fd794c28807198d4e00377984d6d/2025-04-11-Note-17-25_annotated.pdf)

Ejemplo del Algoritmo de Euclides para a = 20357 y b = 17628:

1. **Primer paso**: Dividimos 20357 (a) entre 17628 (b) y calculamos el residuo.
    - 20357 dividido entre 17628 da un cociente de 1 (porque 20357 / 17628 = 1.154...).
    - Residuo = 20357 - (17628 * 1) = 20357 - 17628 = 2729.
    
    Ahora, reemplazamos a con b y b con el residuo, es decir, a = 17628 y b = 2729.
    
2. **Segundo paso**: Dividimos 17628 (nuevo a) entre 2729 (nuevo b) y calculamos el residuo.
    - 17628 dividido entre 2729 da un cociente de 6 (porque 17628 / 2729 = 6.456...).
    - Residuo = 17628 - (2729 * 6) = 17628 - 16374 = 1254.
    
    Ahora, reemplazamos a con b y b con el residuo, es decir, a = 2729 y b = 1254.
    
3. **Tercer paso**: Dividimos 2729 (nuevo a) entre 1254 (nuevo b) y calculamos el residuo.
    - 2729 dividido entre 1254 da un cociente de 2 (porque 2729 / 1254 = 2.175...).
    - Residuo = 2729 - (1254 * 2) = 2729 - 2508 = 221.
    
    Ahora, reemplazamos a con b y b con el residuo, es decir, a = 1254 y b = 221.
    
4. **Cuarto paso**: Dividimos 1254 (nuevo a) entre 221 (nuevo b) y calculamos el residuo.
    - 1254 dividido entre 221 da un cociente de 5 (porque 1254 / 221 = 5.678...).
    - Residuo = 1254 - (221 * 5) = 1254 - 1105 = 149.
    
    Ahora, reemplazamos a con b y b con el residuo, es decir, a = 221 y b = 149.
    
5. **Quinto paso**: Dividimos 221 (nuevo a) entre 149 (nuevo b) y calculamos el residuo.
    - 221 dividido entre 149 da un cociente de 1 (porque 221 / 149 = 1.482...).
    - Residuo = 221 - (149 * 1) = 221 - 149 = 72.
    
    Ahora, reemplazamos a con b y b con el residuo, es decir, a = 149 y b = 72.
    
6. **Sexto paso**: Dividimos 149 (nuevo a) entre 72 (nuevo b) y calculamos el residuo.
    - 149 dividido entre 72 da un cociente de 2 (porque 149 / 72 = 2.069...).
    - Residuo = 149 - (72 * 2) = 149 - 144 = 5.
    
    Ahora, reemplazamos a con b y b con el residuo, es decir, a = 72 y b = 5.
    
7. **Séptimo paso**: Dividimos 72 (nuevo a) entre 5 (nuevo b) y calculamos el residuo.
    - 72 dividido entre 5 da un cociente de 14 (porque 72 / 5 = 14.4).
    - Residuo = 72 - (5 * 14) = 72 - 70 = 2.
    
    Ahora, reemplazamos a con b y b con el residuo, es decir, a = 5 y b = 2.
    
8. **Octavo paso**: Dividimos 5 (nuevo a) entre 2 (nuevo b) y calculamos el residuo.
    - 5 dividido entre 2 da un cociente de 2 (porque 5 / 2 = 2.5).
    - Residuo = 5 - (2 * 2) = 5 - 4 = 1.
    
    Ahora, reemplazamos a con b y b con el residuo, es decir, a = 2 y b = 1.
    
9. **Noveno paso**: Dividimos 2 (nuevo a) entre 1 (nuevo b) y calculamos el residuo.
    - 2 dividido entre 1 da un cociente de 2 (porque 2 / 1 = 2).
    - Residuo = 2 - (1 * 2) = 2 - 2 = 0.
    
    Ahora, el residuo es 0, lo que significa que hemos terminado. El ultimo valor no nulo de b es el maximo comun divisor.
    

**Resultado final**: El mcd(20357, 17628) es 1.

Dos números relativamente primos son buenos para los algoritmos de criptografía porque tienen la propiedad de que su máximo común divisor (mcd) es igual a 1, lo que significa que no comparten factores primos distintos de 1. Esta propiedad es fundamental en criptografía, especialmente en sistemas como RSA, por las siguientes razones:

1. **Cálculo del inverso modular**: Para muchos algoritmos criptográficos, como RSA, es necesario calcular el inverso modular de un número. Esto solo es posible si el número y el módulo son relativamente primos. Por ejemplo, si elegimos un número e tal que sea relativamente primo con phi(n), entonces podemos encontrar un número d que satisfaga la relación e * d mod phi(n) = 1. Este cálculo es esencial para generar las claves de cifrado y descifrado.
2. **Asegurar la unicidad de clases de congruencia**: Cuando dos números son relativamente primos, las clases de congruencia definidas por ellos son únicas y completas. Esto es útil para cifrar y descifrar mensajes sin ambigüedad, ya que cada mensaje cifrado tiene un único mensaje original asociado.
3. **Seguridad matemática**: Los números relativamente primos garantizan que los cálculos realizados en el sistema criptográfico no se vean comprometidos por factores comunes. Esto aumenta la resistencia del sistema frente a ataques matemáticos, como el análisis de factorización.
4. **Eficiencia en cálculos modulares**: Los algoritmos que dependen de operaciones modulares, como exponenciación modular, funcionan de manera más eficiente y segura cuando trabajan con números relativamente primos, ya que evitan redundancias matemáticas.

En resumen, los números relativamente primos son esenciales en criptografía porque permiten cálculos modulares seguros, aseguran la unicidad en las operaciones de cifrado y descifrado, y garantizan la resistencia del sistema frente a ataques basados en factorización. Esto hace que sean una elección clave para construir algoritmos criptográficos confiables.
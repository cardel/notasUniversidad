# Clase 11 de Abril Teoría de Números II

[Ejemplos iniciales clase](Clase%2011%20de%20Abril%20Teori%CC%81a%20de%20Nu%CC%81meros%20II%201d27fd794c2880a399d4cef6af4cc4e0/Ejemplos%20iniciales%20clase%201d27fd794c28800ca50beb518267f6f7.md)

# División de números enteros

Dado un número entero positivo a vamos tener un d cociente y r, $r, d \in \mathbb{Z}$

$a = dq + r,   a dq = r$

$q \textrm{ div } a = d$

$5 \textrm{ div } 24 = 4$ 

$24 \textrm{ mod } 5 = 4$

24 = 5*4 + 4

## Programación

```scala
def f = (a,d) => ((a % d) + d) % d

scala> f(-15,4)
val res14: Int = 1

scala> f(-133,4)
val res15: Int = 3
```

# Máximo común divisor

Dado dos números enteros a y b, tenemos un valor d cual es divisor de estos d | a y d | b  analogo  d div a y d div b, en el cual es el d máximo

45, 81

45 ⇒ 1, 3, 5, 9, 15

81 ⇒ 1, 3, 9, 27

mcd(45,81) = 9

## Descomposición entre factores primos

Todo número entero a se puede descomponer en factores primos los cuales cumplen que son divisores de este número

$a = p_1^{a}*p_2^{b}*\ldots *p_{n}^{n}$ Donde pi es un número primo

Tenemos que

$b = p_1^{a'}*p_2^{b'}*\ldots *p_{n}^{n'}$

$mcd(a,b) = p_1^{min(a,a')}*p_2^{min(b,b')}*\ldots *p_{n}^{min(n,n')}$

### Ejemplo

$35 = 1^{1}*2⁰*3^{0}*5^{1}*7^{1}$

$27 = 1^1*2⁰*3³$

mcd(35,27) = 1 

Cuando mcd(a,b) = 1 entonces a y b con primos relativos, esto es especialmente útil en criptografia para generación de llaves RSA

### Ejemplo: Cálculo del máximo común divisor (mcd)

Vamos a calcular el máximo común divisor de los números 60 y 48 utilizando el método de descomposición en factores primos.

Paso 1: Descomponer los números en factores primos.

Para 60:

60 = 2^2 * 3^1 * 5^1

Para 48:

48 = 2^4 * 3^1

Paso 2: Identificar los factores primos comunes y tomar los menores exponentes.

Los factores primos comunes son:

- 2: el menor exponente es 2
- 3: el menor exponente es 1

Paso 3: Multiplicar los factores comunes con sus menores exponentes.

mcd(60,48) = 2^2 * 3^1 = 4 * 3 = 12

Por lo tanto, el máximo común divisor de 60 y 48 es 12.

### Ejemplo: Cálculo de un residuo utilizando el operador módulo

Vamos a calcular el residuo de la división de -15 entre 4 utilizando la función f definida en el documento.

Paso 1: Aplicar la fórmula de la función f.

f(a, d) = ((a % d) + d) % d

Paso 2: Sustituir los valores a = -15 y d = 4.

f(-15, 4) = ((-15 % 4) + 4) % 4

Paso 3: Calcular el residuo inicial (-15 % 4).

Cuando dividimos -15 entre 4, el cociente es -4 y el residuo es -3.

Por lo tanto, -15 % 4 = -3.

Paso 4: Sustituir el residuo en la fórmula.

f(-15, 4) = ((-3) + 4) % 4 = 1 % 4

Paso 5: Calcular el resultado final.

1 % 4 = 1

Por lo tanto, el residuo de dividir -15 entre 4 utilizando la función f es 1.

# Mínimo común múltiplo

Dados dos números a y b, el mcm(a,b) = k, tal que a div k y b div k y k es el menor posible

Si descomponemos los números por factores primos vamos a tomar el máximo del exponente (a diferencia de mcd)

### Ejemplo: Cálculo del mínimo común múltiplo (mcm) usando factores primos

Vamos a calcular el mínimo común múltiplo de los números 12 y 18 utilizando el método de descomposición en factores primos.

**Paso 1: Descomponer los números en factores primos.**

Para 12:

12 = 2^2 * 3^1

Para 18:

18 = 2^1 * 3^2

**Paso 2: Identificar los factores primos y tomar los mayores exponentes.**

Tomamos todos los factores primos presentes en las descomposiciones y seleccionamos el mayor exponente para cada factor.

- Para el factor 2: el mayor exponente es 2 (de 2^2 en 12).
- Para el factor 3: el mayor exponente es 2 (de 3^2 en 18).

**Paso 3: Multiplicar los factores con sus mayores exponentes.**

mcm(12, 18) = 2^2 * 3^2 = 4 * 9 = 36

**Resultado:**

El mínimo común múltiplo de 12 y 18 es 36.

# Congruencia modular

Teorema 1: Sean *a* y *b* números enteros, y *m* un entero positivo. Entonces, *a* es congruente con *b* módulo *m* (denotado como *a ≡ b (mod m)*) si, y sólo si, *a mod m = b mod m = r*, donde *r* es el residuo de la división de *a* y *b* entre *m*.

Teorema 2: Sea *m* un entero positivo. Los enteros *a* y *b* son congruentes módulo *m* si, y sólo si, existe un entero *k* tal que *a = b + km*. En otras palabras, la congruencia módulo *m* establece que la diferencia entre *a* y *b* es un múltiplo de *m*. El conjunto de todos los enteros congruentes a un entero *a* módulo *m* se denomina **clase de congruencia módulo *m***.

Teorema 3: Sea *m* un entero positivo. Si *a ≡ b (mod m)* y *c ≡ d (mod m)*, entonces se cumplen las siguientes propiedades:

1. La suma de los números es congruente: *a + c ≡ b + d (mod m)*.
2. El producto de los números es congruente: *a * c ≡ b * d (mod m)*.

4, 10, 16, 22

4 es congruente con 10 modulo 6
4 mod 6 = 4
10 mod 6 = 4
(4 - 10) mod 6 = 0

a = b + km.
10 = 4 + k*6  => 10 = 4 + (1)6
4 = 10 + k*6  => 4 = 10 + (-1)6

a + c ⌘ b + d (mod m) y ac ⌘ bd (mod m).

a = 4  b = 10  c = 16  d = 22
20 es congruente 32 mod 6
(32 - 20) mod 6 = 12 mod 6 = 0 OK
64 es congruente con 220 mod 6 => 156 mod 6 = 0 OK

### Ejemplo práctico: Aplicación de los teoremas de congruencia en criptografía RSA

El sistema RSA utiliza congruencias para garantizar la seguridad en la comunicación cifrada. Aquí hay un ejemplo práctico de cómo los teoremas de congruencia son fundamentales en el proceso de generación y uso de las llaves RSA.

### Generación de las llaves RSA

1. **Seleccionar dos números primos grandes p y q.**
Por ejemplo, p = 61 y q = 53.
2. **Calcular n y phi(n):**
n = p * q = 61 * 53 = 3233
    
    phi(n) = (p - 1) * (q - 1) = (61 - 1) * (53 - 1) = 60 * 52 = 3120
    
3. **Elegir un número e tal que 1 < e < phi(n) y mcd(e, phi(n)) = 1.**
Elegimos e = 17.
4. **Calcular d como el inverso modular de e módulo phi(n):**
d es el número tal que (e * d) ≡ 1 (mod phi(n)).
    
    Usando el algoritmo extendido de Euclides, encontramos que d = 2753.
    
    **Ahora tenemos:**
    
    - Clave pública: (n, e) = (3233, 17)
    - Clave privada: (n, d) = (3233, 2753)

### Cifrado con RSA

Supongamos que queremos cifrar un mensaje m = 123 utilizando la clave pública. Aplicamos el siguiente cálculo:

c ≡ m^e (mod n)

c ≡ 123^17 (mod 3233)

Calculamos c usando congruencias repetidas para simplificar el cálculo. El resultado es c = 855. Este es el mensaje cifrado.

### Descifrado con RSA

El receptor utiliza la clave privada para descifrar el mensaje cifrado c = 855. Aplicamos el siguiente cálculo:

m ≡ c^d (mod n)

m ≡ 855^2753 (mod 3233)eucacion

De nuevo, usamos propiedades de congruencias y exponenciación modular rápida para calcular. El resultado es m = 123, recuperando el mensaje original.

### Conexión con los teoremas de congruencia

1. **Teorema 1:** En el cifrado y descifrado se utiliza la congruencia modular para asegurar que los cálculos se realicen dentro del rango de n. Por ejemplo, c ≡ m^e (mod n) asegura que el resultado cifrado es congruente con m^e módulo n.
2. **Teorema 2:** La relación entre e, d y phi(n) garantiza que (e * d) ≡ 1 (mod phi(n)), lo que permite la descodificación correcta del mensaje cifrado.
3. **Teorema 3:** Las operaciones de suma y producto en congruencias son fundamentales para optimizar los cálculos modulares durante el cifrado y descifrado.

Este ejemplo muestra cómo los teoremas de congruencia modular son esenciales para el funcionamiento de RSA, proporcionando un marco matemático sólido para la criptografía moderna.

# 

# 

[2025-04-11-Note-13-02_annotated.pdf](Clase%2011%20de%20Abril%20Teori%CC%81a%20de%20Nu%CC%81meros%20II%201d27fd794c2880a399d4cef6af4cc4e0/2025-04-11-Note-13-02_annotated.pdf)
# Clase 23 de Mayo: RSA y TAD

Criptografia

- Existe una clave publica que es compartida por el sender y el receiver
- El sistema de codificación de Julio Cesar (p - 3) mod 26

Por ejemplo, aplicando la codificación de Julio Cesar con la función (p - 3) mod 26:

- P -> M
- E -> B
- R -> O
- R -> O
- O -> L

Por lo tanto, "PERRO" se codifica como "MBOOL".

# Algoritmo RSA

El sistema de cifrado RSA fue introducido durante 1976 por tres científicos de MIT
(Rivest, Shamir y Adleman). Se basa en la exponenciación modular, módulo el
producto de dos primos grandes. Pasos en el cifrado y descifrado

1. Generación de claves:
Se escogen dos números primos p y q.
Se calcula n = p × q y ϕ(n) = p − 1 × q − 1 .
Se escoge e tal que 1 < e < ϕ(n) y e es primo relativo con ϕ(n).
Se calcula d tal que d × e ≡ 1 (mod ϕ(n)) el inverso de e modulo ϕ(n).
La clave pública es (n, e) y la clave privada es (n, d).
2. Cifrado:
Representa el mensaje como una secuencia de números separados en bloques
Mi .
Calcula el mensaje cifrado Ci = Mie mód n.
3. Descifrado:
Usa la clave privada (n, d) para calcular el mensaje original Mi = Cid mód n

El sistema de cifrado RSA fue introducido en 1976 por tres científicos del MIT (Rivest, Shamir y Adleman). Se basa en la exponenciación modular, utilizando el producto de dos números primos grandes. A continuación se presentan los pasos del cifrado y descifrado:

1. Generación de claves:
Se eligen dos números primos p y q.
Se calcula n = p × q y ϕ(n) = (p − 1) × (q − 1).
Se selecciona e tal que 1 < e < ϕ(n) y e sea primo relativo con ϕ(n).
Se calcula d tal que d × e ≡ 1 (mod ϕ(n)), siendo d el inverso multiplicativo de e módulo ϕ(n).
La clave pública es (n, e) y la clave privada es (n, d).
2. Cifrado:
Se representa el mensaje como una secuencia de números separados en bloques Mi.
Se calcula el mensaje cifrado Ci = Mi^e mod n.
3. Descifrado:
Se usa la clave privada (n, d) para calcular el mensaje original Mi = Ci^d mod n.

# Ejemplo teorema pequeño de Fernat

Para calcular 2081^(937) mod 2537 utilizando el teorema pequeño de Fermat, seguimos los pasos:

1. Según el teorema pequeño de Fermat, si p es un número primo y a es un número entero que no es divisible por p, entonces a^(p-1) ≡ 1 (mod p).
2. En este caso, el módulo 2537 no es primo, pero se puede descomponer en dos factores primos: 2537 = 43 × 59.
3. Aplicamos el teorema de Fermat para cada uno de los factores primos 43 y 59.
4. Calculemos primero 2081^(937) mod 43:
    - Según el teorema de Fermat, 2081^(42) ≡ 1 (mod 43) (porque 43 - 1 = 42).
    - Reducimos 2081 mod 43: 2081 ≡ 22 (mod 43).
    - Ahora calculamos 22^(937) mod 43.
    - Simplificamos el exponente: 937 mod 42 = 13 (porque 937 ÷ 42 da un residuo de 13).
    - Por lo tanto, 22^(937) mod 43 ≡ 22^(13) mod 43.
    - Calculamos 22^(13) mod 43 paso a paso:
        - 22^2 ≡ 21 (mod 43).
        - 22^4 ≡ 21^2 ≡ 441 ≡ 10 (mod 43).
        - 22^8 ≡ 10^2 ≡ 100 ≡ 14 (mod 43).
        - 22^(13) ≡ 22^8 × 22^4 × 22 ≡ 14 × 10 × 22 ≡ 3080 ≡ 24 (mod 43).
    - Por lo tanto, 2081^(937) mod 43 ≡ 24.
5. Calculemos ahora 2081^(937) mod 59:
    - Según el teorema de Fermat, 2081^(58) ≡ 1 (mod 59) (porque 59 - 1 = 58).
    - Reducimos 2081 mod 59: 2081 ≡ 17 (mod 59).
    - Ahora calculamos 17^(937) mod 59.
    - Simplificamos el exponente: 937 mod 58 = 9 (porque 937 ÷ 58 da un residuo de 9).
    - Por lo tanto, 17^(937) mod 59 ≡ 17^(9) mod 59.
    - Calculamos 17^(9) mod 59 paso a paso:
        - 17^2 ≡ 289 ≡ 53 (mod 59).
        - 17^4 ≡ 53^2 ≡ 2809 ≡ 7 (mod 59).
        - 17^8 ≡ 7^2 ≡ 49 (mod 59).
        - 17^(9) ≡ 17^8 × 17 ≡ 49 × 17 ≡ 833 ≡ 4 (mod 59).
    - Por lo tanto, 2081^(937) mod 59 ≡ 4.
6. Ahora usamos el teorema chino del resto para combinar los resultados mod 43 y mod 59:
    - Tenemos las congruencias:
        - x ≡ 24 (mod 43)
        - x ≡ 4 (mod 59).
    - Usamos el método para resolver sistemas de congruencias:
        - Sea x = 24 + 43k.
        - Sustituimos en la segunda congruencia: 24 + 43k ≡ 4 (mod 59).
        - 43k ≡ -20 (mod 59).
        - 43 ≡ -16 (mod 59), entonces:
        -16k ≡ -20 (mod 59).
        - Multiplicamos ambos lados por el inverso de -16 mod 59, que es 48:
        48 × -16k ≡ 48 × -20 (mod 59).
        k ≡ 16 (mod 59).
        - Sustituimos k = 16 en x = 24 + 43k:
        x = 24 + 43 × 16 = 712.
        - Por lo tanto, x ≡ 712 (mod 2537).

El resultado final es 2081^(937) mod 2537 = 712.

Ejemplo STOP diapositivas

[2025-05-23-Note-12-58_annotated.pdf](2025-05-23-Note-12-58_annotated.pdf)

# TAD

```scala
class Racional(a:Int, b:Int) {
  require(b > 0)
  val num = a / mcd(a,b)
  val dem = b / mcd(a,b)

  private def mcd(a:Int, b:Int):Int = {
    if (b == 0) a else mcd(b,a%b)
  }
  
  def +(r1:Racional):Racional = {
    new Racional(
      this.num * r1.dem + r1.num*this.dem,
      this.dem * r1.dem
      )
  }
  def *(r1:Racional):Racional = {
    new Racional(
      this.num*r1.num,
      this.dem*r1.dem
      )
  }
  override
  def toString():String = {
    s"$num/$dem"
  }
}
```

[2025-05-23-Note-17-43_annotated.pdf](Academico/2025-1/Estructuras%20discretas%20II%20ICESI%201987fd794c2880f0ad06db6f94ecb06d/Grupo%2001%201987fd794c2880938872f773726292df/Clase%2023%20de%20Mayo%20RSA%20y%20TAD%201fc7fd794c28807e8e7dc991e10d5f2d/2025-05-23-Note-17-43_annotated.pdf)
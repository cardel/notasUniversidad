# Clase 23 de Mayo de 2025 Criptografia y RSA

# Cifrado básico

Idea general es codificar un mensaje entre un emisor y un receptor de tal forma sólo ellos dos lo puedan descrifrar

Por ejemplo para el caso de los romanos ellos usaban el sistema de corrimiento (p + k) mod 26

Por ejemplo, usando el sistema de corrimiento (p + k) mod 26 con un valor de k = 3:

Frase original: **mi pasion es programar**

1. Convertimos cada letra a su posición en el alfabeto (a=0, b=1, ..., z=25):
    - m=12, i=8, p=15, a=0, s=18, i=8, o=14, n=13, e=4, s=18, p=15, r=17, o=14, g=6, r=17, a=0, m=12, a=0, r=17.
2. Aplicamos el corrimiento (p + k) mod 26 (k=3):
    - m=(12+3) mod 26 = 15 (p), i=(8+3) mod 26 = 11 (l), p=(15+3) mod 26 = 18 (s), a=(0+3) mod 26 = 3 (d), s=(18+3) mod 26 = 21 (v), i=(8+3) mod 26 = 11 (l), o=(14+3) mod 26 = 17 (r), n=(13+3) mod 26 = 16 (q), e=(4+3) mod 26 = 7 (h), s=(18+3) mod 26 = 21 (v), p=(15+3) mod 26 = 18 (s), r=(17+3) mod 26 = 20 (u), o=(14+3) mod 26 = 17 (r), g=(6+3) mod 26 = 9 (j), r=(17+3) mod 26 = 20 (u), a=(0+3) mod 26 = 3 (d), m=(12+3) mod 26 = 15 (p), a=(0+3) mod 26 = 3 (d), r=(17+3) mod 26 = 20 (u).
3. Convertimos los números nuevamente a letras:
    - Resultado codificado: **plsdvlrqhvsurjudpdududu**

Este es el mensaje codificado usando el sistema (p + k) mod 26 con k=3.

Tipo claves

- Publica Que es compartida y puede ser conocida por todos ← Encriptar
- Privada: ← Desencriptar

---

# Cifrado RSA

1. Generación de claves:
Se escogen dos números primos p y q.
Se calcula n = p × q y φ(n) = (p − 1) × (q − 1).
Se escoge e tal que 1 < e < φ(n) y e es primo relativo con φ(n).
Se calcula d tal que d × e ≡ 1 (mod φ(n)), siendo d el inverso de e módulo φ(n).
La clave pública es (n, e) y la clave privada es (n, d).
2. Cifrado:
Representa el mensaje como una secuencia de números separados en bloques Mi.
Cacalcula el mensaje cifrado Ci = Mi^e mod n.
3. ¿Cómo se transforman los mensajes (cadenas) en sucesiones de bloques de enteros?
4. Se convierte cada letra en un entero de dos dígitos, como en el cifrado Caesar, o usando el número ASCII (por ejemplo, A = 00, B = 01, etc.).
5. Estos enteros se agrupan para formar números más grandes, representados por bloques de letras de tamaño 2N, donde 2N es el mayor entero par tal que 25...25 (con 2N dígitos) no excede n.
6. Después de estos pasos, el mensaje de texto sin formato M se convierte en una secuencia de números enteros m₁, m₂, ..., mₖ para algún entero k. El cifrado procede transformando cada bloque mᵢ en un bloque de texto cifrado cᵢ:

## Ejemplo STOP

[https://es.symbolab.com/solver/step-by-step/1819^{13} mod 2537?or=input](https://es.symbolab.com/solver/step-by-step/1819%5E%7B13%7D%20mod%202537?or=input) 

[2025-05-23-Note-17-15_annotated.pdf](2025-05-23-Note-17-15_annotated.pdf)

Para calcular 2545²⁷⁵³ mod 3233, seguiremos los siguientes pasos utilizando el **Teorema Chino del Resto (CRT)** y el **Pequeño Teorema de Fermat**:

---

### **Paso 1: Factorizar el módulo 3233**

Buscamos dos números primos p y q tales que p × q = 3233:

- 3233 ÷ 53 = 61 (verificamos que 53 × 61 = 3233)

Por lo tanto, **3233 = 53 × 61**, donde 53 y 61 son primos.

---

### **Paso 2: Aplicar el Teorema Chino del Resto (CRT)**

Calcularemos:

2545²⁷⁵³ mod 53 y 2545²⁷⁵³ mod 61

y luego combinaremos los resultados usando CRT.

---

### **Paso 3: Calcular 2545²⁷⁵³ mod 53**

1. **Reducir la base mod 53:**

2545 mod 53 = 2545 − 53 × 48 = 2545 − 2544 = 1.

Por lo tanto, 2545 ≡ 1 mod 53.

1. **Elevar a la potencia 2753:**

1²⁷⁵³ ≡ 1 mod 53.

**Resultado:** 1 mod 53.

---

### **Paso 4: Calcular 2545²⁷⁵³ mod 61**

1. **Reducir la base mod 61:**

2545 mod 61 = 2545 − 61 × 41 = 2545 − 2501 = 44.

Por lo tanto, 2545 ≡ 44 mod 61.

1. **Aplicar el Pequeño Teorema de Fermat:**

44⁶⁰ ≡ 1 mod 61.

Reducimos el exponente 2753 mod 60:

2753 ÷ 60 = 45 × 60 = 2700 ⇒ 2753 − 2700 = 53.

Así, 2753 ≡ 53 mod 60.

1. **Calcular 44⁵³ mod 61:**
- Descomponemos 53 en potencias de 2 (método de exponenciación binaria): 53 = 32 + 16 + 4 + 1.
- Calculamos las potencias sucesivas de 44 mod 61:
44¹ ≡ 44 mod 61,
44² ≡ 44 × 44 = 1936 ≡ 1936 − 31 × 61 = 1936 − 1891 = 45 mod 61,
44⁴ ≡ 45² = 2025 ≡ 2025 − 33 × 61 = 2025 − 2013 = 12 mod 61,
44⁸ ≡ 12² = 144 ≡ 144 − 2 × 61 = 22 mod 61,
44¹⁶ ≡ 22² = 484 ≡ 484 − 7 × 61 = 484 − 427 = 57 mod 61,
44³² ≡ 57² = 3249 ≡ 3249 − 53 × 61 = 3249 − 3233 = 16 mod 61.
- Multiplicamos las potencias correspondientes:
44⁵³ = 44³² × 44¹⁶ × 44⁴ × 44¹ ≡ 16 × 57 × 12 × 44 mod 61.

Calculamos paso a paso:

16 × 57 = 912 ≡ 912 − 14 × 61 = 912 − 854 = 58 mod 61,
58 × 12 = 696 ≡ 696 − 11 × 61 = 696 − 671 = 25 mod 61,
25 × 44 = 1100 ≡ 1100 − 18 × 61 = 1100 − 1098 = 2 mod 61.

**Resultado:** 2 mod 61.

---

### **Paso 5: Combinar los resultados con CRT**

Tenemos el sistema:

x ≡ 1 mod 53,
x ≡ 2 mod 61.

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

[2025-05-23-Note-17-43_annotated.pdf](Academico/Universidad/2025-1/Estructuras%20discretas%20II%20ICESI%201987fd794c2880f0ad06db6f94ecb06d/Grupo%2005%201987fd794c2880579c1dd2d08e062e7f/Clase%2023%20de%20Mayo%20de%202025%20Criptografia%20y%20RSA%201fc7fd794c2880d9bff5d0b43f002b98/2025-05-23-Note-17-43_annotated.pdf)

# Resumen: Fundamentos de Algoritmia

## 1. Introducción
- **Algoritmo**: Secuencia de pasos para resolver un problema.  
  Características: Preciso, definido, finito y con salida.
- **Algoritmia**: Estudio del diseño, análisis e implementación de algoritmos.

---

## 2. Clasificación de Algoritmos
### a) Deterministas
- **Definición**: Siempre producen la misma salida para una entrada dada.  
- **Ejemplo**:  
  ```python
  def EsPar(n):
      return n % 2 == 0
  ```

### b) Probabilistas
- **Definición**: Usan decisiones aleatorias para obtener soluciones (pueden tener errores).  
- **Tipos**:
  - **Monte Carlo**:  
    - Siempre dan respuesta, pero puede ser incorrecta (baja probabilidad).  
    - Ejemplo: Test de primalidad de Miller-Rabin para números grandes.
  - **Las Vegas**:  
    - Nunca dan respuesta incorrecta: o aciertan o fallan.  
    - Ejemplos: QuickSort (éxito siempre), Problema de las 8 reinas (éxito parcial).

### c) Numéricos
- **Definición**: Proporcionan soluciones aproximadas a problemas matemáticos.  
- **Características**: Resultado siempre correcto (con precisión variable).  
- **Ejemplo**: Cálculo de raíces de ecuaciones (e.g., $\cos^2(x) = 0$).

---

## 3. Recursividad
### Conceptos Clave
- **Definición**: Resolver un problema reduciéndolo a instancias más pequeñas del mismo.  
- **Componentes**:
  - **Caso base**: Solución directa sin recursión (ej: `factorial(0) = 1`).  
  - **Caso recursivo**: Llama a la función con subproblemas (ej: `n! = n * (n-1)!`).

### Ejemplos
- **Factorial**:
  ```python
  def factorial(n):
      if n <= 1: 
          return 1
      else: 
          return n * factorial(n-1)
  ```
- **Inversión de cadenas**:
  ```python
  def reverse(s):
      if len(s) <= 1: 
          return s
      else: 
          return reverse(s[1:]) + s[0]
  ```
- **Torres de Hanoi**:
  ```python
  def hanoi(n, origen, destino, auxiliar):
      if n == 1:
          print(f"Mover disco 1 de {origen} a {destino}")
      else:
          hanoi(n-1, origen, auxiliar, destino)
          print(f"Mover disco {n} de {origen} a {destino}")
          hanoi(n-1, auxiliar, destino, origen)
  ```

### Modelo de Ejecución
- **Pila de llamadas (LIFO)**: Almacena parámetros y direcciones de retorno en cada llamada recursiva.  
- **Rastreo**: Ilustra cómo se apilan/desapilan las llamadas (ej: ejecución de `factorial(4)`).

---

## 4. Recursión vs Iteración
| **Aspecto**       | **Recursión**                          | **Iteración**               |
|-------------------|----------------------------------------|-----------------------------|
| Legibilidad       | Alta (solución natural)                | Variable                    |
| Eficiencia        | Baja (uso intensivo de memoria)        | Alta (menos sobrecarga)     |
| Casos de uso      | Problemas con subestructuras (ej: árboles) | Bucles simples           |
| **Trade-off**     | Legibilidad vs. Eficiencia             |                             |

---

## 5. Conclusiones Clave
- Los algoritmos **probabilistas** son esenciales para problemas complejos (ej: criptografía).  
- La **recursividad** simplifica problemas divisibles, pero requiere gestión de la pila.  
- Elección entre recursión/iteración depende del equilibrio claridad-eficiencia.  


## Ejemplo torres de hanoi

## Torres de Hanoi: Explicación con Ejemplos  
Las **Torres de Hanoi** es un rompecabezas matemático que ilustra conceptos de recursión. Consiste en **3 torres** (A, B, C) y **n discos** de diferentes tamaños. El objetivo es mover todos los discos desde la torre **A** (origen) a la torre **C** (destino), siguiendo dos reglas:  
1. Solo puedes mover **un disco a la vez** (el de arriba de una torre).  
2. **Nunca** coloques un disco más grande sobre uno más pequeño.  

La solución se basa en **recursión**: resolver un problema de tamaño **n** requiere resolver primero el problema de tamaño **n-1**.  

---

### Fórmula Recursiva  
El número mínimo de movimientos para **n discos** es:  
$T(n) = 2 \cdot T(n-1) + 1$  
con caso base:  
$T(1) = 1$  

Solución general:  
$T(n) = 2^n - 1$  

---

### Ejemplo para **n = 2**  
Discos:  
- Disco 1 (pequeño)  
- Disco 2 (grande)  

**Pasos:**  
1. Mover disco 1 de **A** a **B** (torre auxiliar).  
   - Estado: A=[2], B=[1], C=[]  
2. Mover disco 2 de **A** a **C** (destino).  
   - Estado: A=[], B=[1], C=[2]  
3. Mover disco 1 de **B** a **C**.  
   - Estado: A=[], B=[], C=[1,2]  

**Total de movimientos:** $T(2) = 2 \cdot T(1) + 1 = 2 \cdot 1 + 1 = 3$  

---

### Ejemplo para **n = 3**  
Discos:  
- Disco 1 (pequeño), Disco 2 (mediano), Disco 3 (grande)  

**Pasos:**  
1. **Resolver para n-1=2 discos** desde **A→B** (usando C como auxiliar):  
   - Mover disco 1: **A→C**  
   - Mover disco 2: **A→B**  
   - Mover disco 1: **C→B**  
   - Estado: A=[3], B=[1,2], C=[]  
2. Mover disco 3 de **A→C** (destino).  
   - Estado: A=[], B=[1,2], C=[3]  
3. **Resolver para n-1=2 discos** desde **B→C** (usando A como auxiliar):  
   - Mover disco 1: **B→A**  
   - Mover disco 2: **B→C**  
   - Mover disco 1: **A→C**  
   - Estado: A=[], B=[], C=[1,2,3]  

**Total de movimientos:** $T(3) = 2 \cdot T(2) + 1 = 2 \cdot 3 + 1 = 7$  

---

### Patrón Recursivo  
- **Para n discos:**  
  1. Mover **n-1 discos** a la torre auxiliar (usando recursión).  
  2. Mover el **disco n** (el más grande) al destino.  
  3. Mover los **n-1 discos** de la auxiliar al destino (usando recursión).  

Esta estructura muestra por qué $T(n) = 2 \cdot T(n-1) + 1$:  
- Los dos pasos recursivos ($T(n-1)$ cada uno) más un movimiento del disco base.  

**Generalización:**  
| n | T(n) | Fórmula       |  
|---|------|---------------|  
| 1 | 1    | $2^1 - 1 = 1$ |  
| 2 | 3   | $2^2 - 1 = 3$ |  
| 3 | 7    | $2^3 - 1 = 7$ |  
| 4 | 15   | $2^4 - 1 = 15$|  

¡El algoritmo garantiza la solución óptima en $2^n - 1$ movimientos!
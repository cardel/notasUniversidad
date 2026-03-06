# Ejercicio 2: Inducción

Demostrar que $7^n - 1$ es múltiplo de 6 para todo $n \in \mathbb{N}$.

**Planteamiento**: $7^n - 1 = c \cdot 6$, donde $c \in \mathbb{N}$.

---

## Demostración por inducción matemática

### 1. Paso base ($n = 1$)
$7^1 - 1 = c \cdot 6$  
$6 = c \cdot 6 \implies c = 1$  
Por lo tanto, $7^1 - 1 = 6$, que es múltiplo de 6. ✅

### 2. Paso inductivo
- **Hipótesis inductiva** $P(k)$: Suponemos que $7^k - 1 = c_1 \cdot 6$ para algún $c_1 \in \mathbb{N}$.
- **Tesis inductiva** $P(k+1)$: Queremos demostrar que $7^{k+1} - 1 = c_2 \cdot 6$ para algún $c_2 \in \mathbb{N}$.

**Desarrollo**:

Partimos de $P(k)$:  
$7^k - 1 = c_1 \cdot 6$

Multiplicamos ambos lados por 7:  
$7 \cdot 7^k - 7 = 7 \cdot c_1 \cdot 6$  
$7^{k+1} - 7 = 7c_1 \cdot 6$

Llamemos $c_3 = 7c_1$ (que es entero, pues $c_1$ lo es):  
$7^{k+1} - 7 = c_3 \cdot 6$

Reescribimos $-7$ como $-6 - 1$:  
$7^{k+1} - 6 - 1 = c_3 \cdot 6$

Pasamos el $-6$ al lado derecho:  
$7^{k+1} - 1 = c_3 \cdot 6 + 6$

Factorizamos 6:  
$7^{k+1} - 1 = 6(c_3 + 1)$

Definiendo $c_2 = c_3 + 1$ (que es entero), obtenemos:  
$7^{k+1} - 1 = c_2 \cdot 6$

Esto es exactamente $P(k+1)$. ✅

---

## Explicación conceptual de los pasos

1. **Paso base**: Se verifica la propiedad para el caso inicial ($n=1$). Esto ancla la inducción.
2. **Hipótesis inductiva**: Se asume que la propiedad es cierta para un $k$ arbitrario ($P(k)$). Esta suposición es lícita porque no se está afirmando que sea cierta para todo $n$, solo para un $k$ fijo.
3. **Paso inductivo**: Usando $P(k)$, se manipula algebraicamente la expresión para $n=k+1$ hasta mostrar que también cumple la propiedad. La clave aquí fue:
   - Multiplicar por 7 para obtener $7^{k+1}$.
   - Ajustar la expresión sumando/restando términos para recuperar la forma $7^{k+1} - 1$.
   - Factorizar el 6 para mostrar que el resultado es claramente un múltiplo de 6.

---

## Tabla de resumen de conceptos

| Concepto | Descripción | Aplicación en este ejercicio |
|----------|-------------|-----------------------------|
| **Inducción matemática** | Método para demostrar proposiciones sobre números naturales. | Demostrar que $7^n - 1$ es múltiplo de 6 para todo $n \in \mathbb{N}$. |
| **Paso base** | Verificación de la proposición para el valor inicial del dominio. | Se comprobó que $7^1 - 1 = 6$ es múltiplo de 6. |
| **Hipótesis inductiva** | Suposición de que la proposición es cierta para un $k$ arbitrario. | Se asumió $7^k - 1 = c_1 \cdot 6$ para algún entero $c_1$. |
| **Paso inductivo** | Demostración de que si $P(k)$ es cierta, entonces $P(k+1)$ también lo es. | Se manipuló algebraicamente $7^k - 1$ para obtener $7^{k+1} - 1$ como múltiplo de 6. |
| **Múltiplo de un número** | Un número $a$ es múltiplo de $b$ si existe $c$ entero tal que $a = c \cdot b$. | $7^n - 1 = c \cdot 6$ para algún $c \in \mathbb{N}$. |
| **Manipulación algebraica** | Uso de operaciones algebraicas para transformar expresiones. | Multiplicar por 7, reescribir $-7$ como $-6-1$, factorizar. |
| **Factorización** | Expresar una suma como producto. | $c_3 \cdot 6 + 6 = 6(c_3 + 1)$. |

---

## Comentarios adicionales

1. **Estructura de la demostración**: Toda demostración por inducción debe contener explícitamente: (a) enunciado de la proposición, (b) paso base, (c) hipótesis inductiva, (d) paso inductivo, y (e) conclusión.

2. **Elección del caso base**: En este ejercicio, $n=1$ es natural porque la propiedad se pide para todos los números naturales. Si se pidiera para $n \geq 0$, el caso base sería $n=0$ ($7^0 - 1 = 0$, que es múltiplo de 6).

3. **Generalización**: Este ejercicio es un caso particular del teorema: $a^n - b^n$ es divisible por $a - b$ para $a \neq b$. Aquí, $a=7$, $b=1$, luego $a-b=6$.

4. **Importancia de la hipótesis inductiva**: La clave del paso inductivo fue usar explícitamente $7^k - 1 = c_1 \cdot 6$. Sin esta igualdad, no se podría haber construido la demostración.

5. **Verificación de la validez**: Después de la demostración, se puede verificar para algunos valores:
   - $n=2$: $7^2 - 1 = 49 - 1 = 48 = 8 \cdot 6$
   - $n=3$: $7^3 - 1 = 343 - 1 = 342 = 57 \cdot 6$

6. **Aplicaciones en teoría de números**: Este tipo de demostraciones son fundamentales en aritmética modular, donde $7^n \equiv 1 \pmod{6}$ para todo $n \geq 1$.

7. **Errores comunes a evitar**:
   - No justificar por qué $c_1, c_2, c_3$ son enteros.
   - Olvidar el paso base.
   - Asumir lo que se quiere demostrar en el paso inductivo (circularidad).
   - No mostrar claramente cómo se pasa de $P(k)$ a $P(k+1)$.
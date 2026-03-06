# Inducción matemática

Es un método para demostrar teoremas o fórmulas, que consta de dos pasos:

1. **Paso base** $P(1)$: se verifica para el primer elemento o valor (no necesariamente con $n = 1$).
2. **Paso inductivo**: partiendo de $P(k)$ se demuestra que $P(k+1)$ es válido.

---

## Ejemplo: Demostrar $2^n > n$ para $n \in \mathbb{N}$

**Paso base** $n = 1$ (dado que trabajamos en $\mathbb{N}$):

$$2^1 > 1$$
Esto es correcto.

**Paso inductivo**: suponemos $P(k)$ y demostramos $P(k+1)$.

Partiendo de $2^k > k$ debemos llegar a $2^{k+1} > k+1$.

Tomamos $P(k)$ y sumamos 1 a ambos lados, con el objetivo de tener $k+1$ en uno de los lados.

Para demostrar esto, planteamos $c > b > a$:

1. $2^k > k$ (esto es $P(k)$). El problema es que no se puede llegar directamente a $P(k+1)$ usando solo operaciones algebraicas simples.
2. Mi objetivo es $2^{k+1} > k+1$. Aquí tengo $a = k+1$ y $c = 2^{k+1}$.
3. Primer paso: sumamos 1 a ambos lados de $P(k)$:  
   $2^k + 1 > k+1$.  
   Defino $b = 2^k + 1$.
4. Ahora postulo: $2^k + 1 < 2^{k+1}$.  
   Haciendo álgebra:  
   $2^{k+1} = 2 \cdot 2^k$, entonces la desigualdad queda:  
   $2^k + 1 < 2 \cdot 2^k = 2^k + 2^k$.  
   Restando $2^k$ en ambos lados: $1 < 2^k$.  
   Dado que $k \geq 1$ (por el caso base), $2^k \geq 2$, luego $1 < 2^k$ es verdadero.  
   Por lo tanto, he demostrado $2^k + 1 < 2^{k+1}$.
5. Entonces tenemos: $k+1 < 2^k + 1 < 2^{k+1}$.  
   Por transitividad, $k+1 < 2^{k+1}$, que es exactamente $P(k+1)$.

---

### Estrategia alternativa

1. Multiplicamos ambos lados de $P(k)$ por 2:  
   $2^{k+1} > 2k$.
2. Ahora debemos demostrar $2k > k+1$.  
   Esto equivale a $k + k > k + 1$, y restando $k$ en ambos lados: $k > 1$.  
   Para $k \geq 2$ esto es cierto.  
   Como el caso base ya cubre $n=1$, y el paso inductivo funciona para $k \geq 2$, la demostración es válida.

La estrategia consiste en encontrar un valor intermedio que permita conectar ambas desigualdades.

---

## Tabla de resumen de conceptos

| Concepto | Descripción | Observación / Ejemplo |
|----------|-------------|----------------------|
| **Inducción matemática** | Método de demostración para proposiciones sobre números naturales (o conjuntos bien ordenados). | Consta de paso base y paso inductivo. |
| **Paso base** | Verificación de la proposición para el primer valor del dominio (ej. $n=1$). | En $2^n > n$, se prueba $2^1 > 1$. |
| **Paso inductivo** | Suponer $P(k)$ cierto (hipótesis inductiva) y demostrar $P(k+1)$. | Se usa la hipótesis $2^k > k$ para probar $2^{k+1} > k+1$. |
| **Hipótesis inductiva** | Suposición de que la proposición es cierta para un valor $k$ arbitrario. | No se asume que sea cierta para todo $n$, solo para un $k$ fijo. |
| **Transitividad en desigualdades** | Si $a < b$ y $b < c$, entonces $a < c$. | Usada para conectar $k+1 < 2^k+1$ y $2^k+1 < 2^{k+1}$. |
| **Estrategia de valor intermedio** | Introducir una expresión $b$ tal que $a < b < c$ para probar $a < c$. | Se usó $b = 2^k + 1$ para vincular $k+1$ y $2^{k+1}$. |
| **Caso base no necesariamente $n=1$** | El inicio puede ser otro valor (ej. $n=0$, $n=2$) según el enunciado. | En este ejemplo se usó $n=1$ porque la propiedad se pide para naturales positivos. |

---

## Comentarios adicionales

1. **Dominio de la inducción**: La inducción matemática se aplica sobre conjuntos bien ordenados, típicamente $\mathbb{N}$, pero puede adaptarse a otros conjuntos numerables si existe un “primer elemento” y una noción de “siguiente”.
2. **Inducción fuerte (o completa)**: En algunos problemas es necesario suponer $P(1), P(2), \dots, P(k)$ para demostrar $P(k+1)$. Esto es más potente que la inducción simple.
3. **Errores comunes**:
   - Olvidar el paso base.
   - Asumir que $P(k)$ es cierto para todo $k$ en el paso inductivo (circularidad).
   - No justificar adecuadamente el vínculo entre $P(k)$ y $P(k+1)$.
4. **Aplicaciones en computación**: La inducción es fundamental para demostrar correctitud de algoritmos recursivos, propiedades de estructuras de datos (como árboles) y en teoría de lenguajes formales (propiedades de cadenas).
5. **Relación con recursión**: El paso base corresponde al caso base de una función recursiva; el paso inductivo, a la llamada recursiva que reduce el problema a una instancia más pequeña.
6. **Verificación del paso inductivo**: Es crucial asegurar que la demostración de $P(k+1)$ a partir de $P(k)$ es válida para **todo** $k$ mayor o igual al caso base.
# Método del árbol de recursión para resolver ecuaciones de recurrencia

## 1. Concepto previo: propiedades de árboles $m$-arios

Un **árbol $m$-ario completo** de altura $h$ tiene las siguientes propiedades (Rosen, Sección 11.1):

- **Número de nodos en el nivel $i$:** $m^i$ (para $0 \leq i \leq h$).
- **Número de hojas:** $m^h$.
- **Número total de nodos:** $\displaystyle\sum_{i=0}^{h} m^i = \frac{m^{h+1}-1}{m-1}$ (serie geométrica finita).

Estas propiedades son fundamentales para el método del árbol de recursión, ya que la estructura del árbol refleja directamente la estructura de la recurrencia.

### Conexión con recurrencias

Si un algoritmo genera $a$ subproblemas en cada llamada recursiva con factor de reducción $b$, el árbol de recursión es un árbol $a$-ario donde:

- La **altura** es $h = \log_b n$ (porque $n/b^h = 1$).
- El número de **hojas** es $a^h = a^{\log_b n} = n^{\log_b a}$.

### Identidad útil: $a^{\log_b n} = n^{\log_b a}$

**Demostración:** sea $k = \log_b n$, es decir, $n = b^k$. Entonces:

$$a^{\log_b n} = a^k$$

Por otro lado:

$$n^{\log_b a} = (b^k)^{\log_b a} = b^{k \cdot \log_b a} = (b^{\log_b a})^k = a^k$$

Ambas expresiones son iguales a $a^k$. $\blacksquare$

Esta identidad conecta el número de hojas del árbol de recursión ($a^{\log_b n}$) con una potencia de $n$, lo cual facilita expresar la complejidad en notación asintótica. Es especialmente importante porque permite determinar si las hojas dominan el costo total o si lo hace la raíz.

## 2. Idea del método del árbol de recursión

El método del árbol de recursión (Cormen, Sección 4.4) consiste en representar la recurrencia como un **árbol** donde:

- Cada **nodo** representa el costo $f(n)$ de una instancia del problema (sin contar las llamadas recursivas).
- Los **hijos** de un nodo representan las llamadas recursivas generadas.
- Las **hojas** corresponden al caso base.

El costo total de la recurrencia es la **suma de los costos de todos los niveles** del árbol, incluyendo las hojas.

### Procedimiento

1. **Dibujar el árbol** expandiendo 2 o 3 niveles para visualizar la estructura.
2. **Calcular el costo por nivel** (sumando los costos de todos los nodos en ese nivel).
3. **Determinar la altura** $h$ del árbol (el nivel en el cual se alcanza el caso base).
4. **Contar el número de hojas** y su costo total.
5. **Sumar** los costos de todos los niveles internos más el costo de las hojas.

### Conceptos teóricos involucrados

- **Altura del árbol:** $h = \log_b n$ para recurrencias con factor de reducción $n/b$.
- **Hojas:** $a^h = a^{\log_b n} = n^{\log_b a}$ en un árbol $a$-ario.
- **Suma por niveles:** la suma total de los costos por nivel forma una serie geométrica $\sum_{i=0}^{h} c_i$, cuyo comportamiento depende de la razón entre niveles sucesivos.

La ventaja principal de este método sobre la iteración algebraica es su carácter **visual e intuitivo**: el árbol permite ver de un vistazo dónde se concentra el costo. Su limitación es que solo proporciona una _intuición_ o _conjetura_; para una demostración formal se requiere el método de sustitución (inducción matemática).

## 3. Ejemplo de clase: $T(n) = 2T(n/2) + n^2$

### Enunciado

Resolver $T(n) = 2T(n/2) + n^2$, con $T(1) = 1$.

### Construcción del árbol

El árbol es **binario** ($a = 2$). En cada nivel, el tamaño del problema se reduce a la mitad.

```
Nivel 0:                    n²                         → costo: n²
                          /    \
Nivel 1:            (n/2)²    (n/2)²                   → costo: 2·(n/2)² = n²/2
                    /   \      /   \
Nivel 2:       (n/4)² (n/4)² (n/4)² (n/4)²            → costo: 4·(n/4)² = n²/4
                 ⋮       ⋮      ⋮       ⋮
Nivel h:        1  1  1  1  ...  1  1  1  1            → costo: n · Θ(1) = Θ(n)
```

### Costo por nivel

|Nivel|Nodos|Costo por nodo|Costo del nivel|
|---|---|---|---|
|0|1|$n^2$|$n^2$|
|1|2|$(n/2)^2 = n^2/4$|$2 \cdot n^2/4 = n^2/2$|
|2|4|$(n/4)^2 = n^2/16$|$4 \cdot n^2/16 = n^2/4$|
|$i$|$2^i$|$(n/2^i)^2$|$2^i \cdot n^2/4^i = n^2/2^i$|

La razón entre niveles sucesivos es $\frac{n^2/2^{i+1}}{n^2/2^i} = 1/2$, lo que confirma que se trata de una serie geométrica con razón $r = 1/2 < 1$.

### Altura del árbol

Se llega al caso base cuando $n/2^i = 1$, es decir, $i = \log_2 n$. La altura del árbol es $h = \log_2 n$.

### Número de hojas

Es un árbol binario de altura $h = \log_2 n$, por lo que el número de hojas es $2^{\log_2 n} = n$. Cada hoja tiene costo $T(1) = 1$, así que el costo total de las hojas es $\Theta(n)$.

### Costo total

$$T(n) = \sum_{i=0}^{\log_2 n - 1} \frac{n^2}{2^i} + \Theta(n) = n^2 \sum_{i=0}^{\log_2 n - 1} \left(\frac{1}{2}\right)^i + \Theta(n)$$

Como $1/2 < 1$, la serie geométrica converge:

$$\sum_{i=0}^{\log_2 n - 1} \left(\frac{1}{2}\right)^i < \sum_{i=0}^{\infty} \left(\frac{1}{2}\right)^i = 2$$

$$T(n) \leq 2n^2 + \Theta(n)$$

$$\boxed{T(n) = \Theta(n^2)}$$

**Interpretación:** el nivel 0 (la raíz) domina la suma. El costo se reduce geométricamente con razón $1/2$ en cada nivel, por lo que los niveles inferiores aportan cada vez menos. Este es un ejemplo del caso donde $f(n)$ domina (caso 3 del teorema maestro).

## 4. Ejemplo de clase: $T(n) = 3T(n/4) + cn^2$

### Enunciado (Cormen, Sección 4.4)

Resolver $T(n) = 3T(n/4) + cn^2$, con $T(1) = \Theta(1)$.

### Construcción del árbol

El árbol es **3-ario** ($a = 3$): cada nodo genera 3 hijos con tamaño $n/4$.

```
Nivel 0:                       cn²                       → costo: cn²
                          /     |     \
Nivel 1:          c(n/4)²   c(n/4)²   c(n/4)²           → costo: 3·cn²/16 = (3/16)cn²
                 / | \      / | \      / | \
Nivel 2:       9 nodos de costo c(n/16)² cada uno        → costo: (3/16)²cn²
                   ⋮           ⋮           ⋮
Nivel h:     n^(log₄3) hojas de costo Θ(1) cada una
```

### Costo por nivel

|Nivel|Nodos|Costo por nodo|Costo del nivel|
|---|---|---|---|
|0|$1$|$cn^2$|$cn^2$|
|1|$3$|$c(n/4)^2 = cn^2/16$|$\frac{3}{16}cn^2$|
|2|$9$|$c(n/16)^2 = cn^2/256$|$\left(\frac{3}{16}\right)^2 cn^2$|
|$i$|$3^i$|$c(n/4^i)^2$|$\left(\frac{3}{16}\right)^i cn^2$|

La razón entre niveles sucesivos es $3/16 < 1$, lo que indica una serie geométrica convergente.

### Altura y hojas

**Altura:** $n/4^i = 1 \implies i = \log_4 n$.

**Hojas:** $3^{\log_4 n} = n^{\log_4 3} \approx n^{0.79}$.

Costo de las hojas: $\Theta(n^{\log_4 3})$.

### Costo total

$$T(n) = cn^2 \sum_{i=0}^{\log_4 n - 1} \left(\frac{3}{16}\right)^i + \Theta(n^{\log_4 3})$$

Como $3/16 < 1$, la serie geométrica converge:

$$\sum_{i=0}^{\infty} \left(\frac{3}{16}\right)^i = \frac{16}{13}$$

$$T(n) \leq \frac{16}{13} cn^2 + \Theta(n^{\log_4 3})$$

$$\boxed{T(n) = \Theta(n^2)}$$

La raíz domina; las hojas aportan un orden inferior ($n^{0.79} \ll n^2$).

## 5. Ejemplo de clase: $T(n) = 2T(n/2) + n$

### Enunciado

Resolver $T(n) = 2T(n/2) + n$, con $T(1) = \Theta(1)$.

### Costo por nivel

|Nivel|Nodos|Costo por nodo|Costo del nivel|
|---|---|---|---|
|0|1|$n$|$n$|
|1|2|$n/2$|$n$|
|2|4|$n/4$|$n$|
|$i$|$2^i$|$n/2^i$|$n$|

**Observación clave:** cada nivel aporta **exactamente** $n$. La razón es $a/b = 2/2 = 1$, por lo que el crecimiento del número de nodos compensa exactamente la reducción del costo por nodo.

### Análisis

**Altura:** $h = \log_2 n$.

**Hojas:** $2^{\log_2 n} = n$, cada una con costo $\Theta(1)$.

**Costo total:**

$$T(n) = \underbrace{n \cdot \log_2 n}_{\text{niveles internos}} + \underbrace{\Theta(n)}_{\text{hojas}}$$

$$\boxed{T(n) = \Theta(n \log n)}$$

Esta es exactamente la recurrencia del algoritmo _Merge Sort_. La operación de mezcla (_merge_) cuesta $\Theta(n)$ y se realiza en cada nivel del árbol, dando $\Theta(n \log n)$ en total.

## 6. Ejemplo de clase: $T(n) = T(n/3) + T(2n/3) + n$ (árbol desbalanceado)

### Enunciado

Resolver $T(n) = T(n/3) + T(2n/3) + n$. Dar una cota superior e inferior.

### Observación importante

El árbol **no** es balanceado: la rama izquierda reduce por $1/3$ y la derecha por $2/3$. Por lo tanto, las ramas tienen distinta profundidad. Esta recurrencia no tiene la forma estándar $T(n) = aT(n/b) + f(n)$ porque los subproblemas tienen tamaños distintos, por lo que el método maestro no aplica directamente.

### Estructura del árbol

```
Nivel 0:                         n                       → costo: n
                              /     \
Nivel 1:                  n/3       2n/3                  → costo: n/3 + 2n/3 = n
                         /   \      /    \
Nivel 2:             n/9   2n/9  2n/9   4n/9              → costo: n
                      ⋮       ⋮     ⋮       ⋮
```

### Costo por nivel y alturas

**Costo por nivel:** cada nivel suma **exactamente** $n$, ya que la suma de todos los nodos de cada nivel es $n/3 + 2n/3 = n$ en el nivel 1, y esta propiedad se conserva en cada nivel completo (los nodos se subdividen pero sus tamaños siempre suman $n$).

**Rama más corta:** reduce por $1/3$ en cada paso.

$$n/3^i = 1 \implies i = \log_3 n$$

**Rama más larga:** reduce por $2/3$ en cada paso.

$$n \cdot (2/3)^i = 1 \implies i = \log_{3/2} n$$

### Cotas

- **Cota inferior:** al menos $\log_3 n$ niveles completos aportan $n$ cada uno, por lo que $T(n) = \Omega(n \log n)$.
- **Cota superior:** a lo sumo $\log_{3/2} n$ niveles aportan $\leq n$ cada uno, por lo que $T(n) = O(n \log n)$.

$$\boxed{T(n) = \Theta(n \log n)}$$

Dado que tanto la cota inferior como la superior son $n \log n$ (con distintas bases logarítmicas, que difieren solo por un factor constante), la complejidad es $\Theta(n \log n)$. Este resultado muestra que incluso para árboles desbalanceados, el análisis por niveles puede dar una cota ajustada.

## 7. Ejemplo adicional: $T(n) = 4T(n/2) + n^2$

Este ejemplo no aparece en la clase; se incluye como ejercicio resuelto para ilustrar un caso donde todos los niveles aportan el mismo costo (razón $a/b^c = 1$) con $f(n) = n^2$.

### Enunciado

Resolver $T(n) = 4T(n/2) + n^2$, con $T(1) = \Theta(1)$.

### Construcción del árbol

El árbol es **4-ario** ($a = 4$), con factor de reducción $b = 2$.

### Costo por nivel

|Nivel|Nodos|Costo por nodo|Costo del nivel|
|---|---|---|---|
|0|1|$n^2$|$n^2$|
|1|4|$(n/2)^2 = n^2/4$|$4 \cdot n^2/4 = n^2$|
|2|16|$(n/4)^2 = n^2/16$|$16 \cdot n^2/16 = n^2$|
|$i$|$4^i$|$(n/2^i)^2 = n^2/4^i$|$4^i \cdot n^2/4^i = n^2$|

**Observación clave:** cada nivel aporta exactamente $n^2$. La razón es $a/b^2 = 4/4 = 1$ (aquí $f(n) = n^2$ y el exponente relevante es $c = 2$).

### Análisis

**Altura:** $h = \log_2 n$.

**Hojas:** $4^{\log_2 n} = n^{\log_2 4} = n^2$, cada una con costo $\Theta(1)$.

**Costo total:**

$$T(n) = n^2 \cdot \log_2 n + \Theta(n^2)$$

$$\boxed{T(n) = \Theta(n^2 \log n)}$$

Este caso corresponde al caso 2 del teorema maestro: $f(n) = \Theta(n^{\log_b a}) = \Theta(n^2)$, por lo que $T(n) = \Theta(n^2 \log n)$. Todos los niveles aportan igualmente, y es el número de niveles ($\log n$) lo que determina el factor adicional.

## 8. Relación entre los métodos

El método del árbol de recursión y el método de iteración son dos perspectivas complementarias del mismo proceso:

- El **método de iteración** trabaja algebraicamente, expandiendo la recurrencia y manipulando sumatorias.
- El **método del árbol** trabaja visualmente, dibujando la estructura y sumando por niveles.

Ambos producen la misma sumatoria. La diferencia es que el árbol hace explícita la estructura (número de nodos por nivel, costo por nodo, altura, hojas), lo cual facilita identificar si el costo está dominado por la raíz, las hojas o se distribuye uniformemente.

En la práctica, se usa el **árbol** o la **iteración** para obtener una conjetura, y luego el **método de sustitución** (inducción matemática) para demostrarla formalmente. El **método maestro** es un atajo directo cuando la recurrencia tiene la forma estándar $T(n) = aT(n/b) + f(n)$.

## 9. Tabla de resumen

|Concepto|Descripción|
|---|---|
|**Árbol de recursión**|Representación visual de una recurrencia donde cada nodo muestra el costo $f(\cdot)$ de una instancia y los hijos representan las llamadas recursivas.|
|**Árbol $m$-ario**|Árbol donde cada nodo interno tiene exactamente $m$ hijos. Un árbol $a$-ario de altura $h$ tiene $a^h$ hojas y $\frac{a^{h+1}-1}{a-1}$ nodos totales.|
|**Altura del árbol**|$h = \log_b n$, donde $b$ es el factor de reducción. Es el número de niveles desde la raíz hasta las hojas.|
|**Número de hojas**|$a^{\log_b n} = n^{\log_b a}$, donde $a$ es el factor de ramificación. Determina el costo del caso base.|
|**Costo por nivel**|En el nivel $i$, hay $a^i$ nodos y cada uno tiene costo $f(n/b^i)$. El costo total del nivel $i$ es $a^i \cdot f(n/b^i)$.|
|**Razón entre niveles**|Determina si la serie de costos por nivel converge (raíz domina), es constante (contribución uniforme) o diverge (hojas dominan).|
|**Raíz domina**|Ocurre cuando la razón entre niveles es $< 1$. El costo total es $\Theta(f(n))$. Corresponde al caso 3 del teorema maestro.|
|**Contribución uniforme**|Ocurre cuando la razón entre niveles es $= 1$. El costo total es $\Theta(f(n) \cdot \log_b n)$. Corresponde al caso 2 del teorema maestro.|
|**Hojas dominan**|Ocurre cuando la razón entre niveles es $> 1$. El costo total es $\Theta(n^{\log_b a})$. Corresponde al caso 1 del teorema maestro.|
|**Árbol desbalanceado**|Cuando los subproblemas tienen tamaños distintos (e.g., $n/3$ y $2n/3$), las ramas tienen alturas diferentes. Se analiza con la rama más corta (cota inferior) y la más larga (cota superior).|
|**Ventaja del método**|Intuitivo y visual; permite identificar rápidamente dónde se concentra el costo.|
|**Limitación del método**|Solo proporciona una conjetura (intuición). Para una demostración rigurosa se necesita el método de sustitución.|
|**Identidad $a^{\log_b n} = n^{\log_b a}$**|Permite expresar el número de hojas como potencia de $n$. Fundamental para la notación asintótica del costo de las hojas.|
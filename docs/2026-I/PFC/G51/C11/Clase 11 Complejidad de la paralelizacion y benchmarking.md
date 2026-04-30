# Conceptos

1. Trabajo $W(e)$: el número total de operaciones que se deben realizar. Independiente de la paralelización.
2. Profundidad $D(e)$: el tiempo que toma, aquí sí importa la paralelización.

Para trabajar en arreglos, $W$ viene siendo en orden $O(n)$ y $D$ en tiempo $O(\log(n))$ en paralelización ilimitada.

# Tiempo total $T_p$

Teniendo en cuenta el trabajo $W$ y la profundidad $D$:

$$
T_P = \frac{W(e)}{P} + D(e)
$$

Nos da que el tiempo es:

$$
T_P = O\left(\frac{f(n)}{P}\right) + O(\log(f(n)))
$$

En paralelización ilimitada domina $\log$, y con pocos procesadores o en entradas grandes domina $f(n)$.

## Speed up

1. $T_1$: tiempo secuencial.
2. $T_p$: tiempo con $p$ procesadores.

$$
S_P = \frac{T_1}{T_P}
$$

# Ley de Amdahl

Supongamos que tenemos una parte secuencial $f$ y una parte que se puede paralelizar $1-f$:

$$
T_P = \frac{1}{f + \frac{1-f}{P}}
$$

Si suponemos que hay paralelización infinita, $T_\infty = \frac{1}{f}$, que es el límite teórico.

# Tabla de resumen

| Concepto | Símbolo | Definición | Comentarios adicionales |
|----------|---------|------------|-------------------------|
| Trabajo | $W(e)$ | Número total de operaciones a realizar | Independiente de la cantidad de procesadores |
| Profundidad | $D(e)$ | Tiempo mínimo con paralelización ilimitada | Depende de la estructura del algoritmo |
| Tiempo total | $T_p$ | Tiempo de ejecución con $p$ procesadores | $T_P = \frac{W(e)}{P} + D(e)$ |
| Speed up | $S_P$ | Aceleración al usar $p$ procesadores | $S_P = \frac{T_1}{T_P}$ |
| Ley de Amdahl | $T_P$ | Límite teórico de aceleración | $T_\infty = \frac{1}{f}$ con $f$ fracción secuencial |

**Comentarios adicionales:**
- La Ley de Amdahl establece que incluso con infinitos procesadores, el speed up está limitado por la parte secuencial del algoritmo.
- En la práctica, la comunicación entre procesadores y la sincronización añaden overhead que no se considera en estos modelos teóricos.
- La relación trabajo-profundidad es fundamental para determinar si un algoritmo es eficientemente paralelizable.


# Temas

1. [Benchmarking](Benchmarking.md)
2. [Ejemplo Benchmarking](Ejemplo%20Benchmarking.md)
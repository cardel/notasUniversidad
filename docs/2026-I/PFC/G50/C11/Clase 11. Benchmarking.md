# Sobre la complejidad de programas paralelos

1. EL trabajo realizado por un programa sea paralelo o no $W(e)$ es siempre el mismo (hay que hacer todas las tareas), en el caso de paralelo $W(e) + c$, donde $c$ es el costo de dividir (parallel/task) y unir (join)
2. El trabajo realizado por un programa paralelizado (con paralelismo ilimitado) $D(e)$ donde $D(e) = \texttt{max}(D(e_1),D(e_2),D(e_3),\ldots,D(e_n) + c$ la tarea que más se demore más el costo de dividr y unir.
3. En comparativa:
	1. $D(e)$ en secuencial $O(f(n))$
	2. $D(e)$ en paralelo ilimitado $D(log(f(n)))$ asumiendo la ruta critica en el arbol de tareas

# Ley de Ahmdal

Ley ahmdal, suponemos una parte secuencial $f$ y otra paralela $1-f$

$$
S_p = \frac{1}{f - \frac{1-f}{P}}
$$

En el caso de el paralelismo sea ilimitado

$$
S_p = \frac{1}{f}
$$

# Calculo del Speedup

Sea $T_1$ el tiempo paralelo y $T_P$ el tiempo $p$ tareas, entonces

$$
S_P = \frac{T_1}{T_P}
$$
# Benchmarking

Nuestro objetivo es medir el tiempo (ganancia al paralelizar)

1. Medir el problema en secuencial
2. Medir el prooblema en paralelo variando el número de hilos (numero de hilos, umbral o por profundidad)

## Consideraciones

1. La JVM tiene un calentamiento es necesario esperar antes de medir
2. Hay procesos como GC, Cache, etc que alteran el tiempo de medición

Por lo tanto debe usted esperar a que termine el proceso de calentamiento y tomar varias mediciones tomando el promedio

# Temas

1. [Scalameter](Scalameter.md)
2. [Ejemplo Scalameter](Ejemplo%20scalemeter.md)
# Ley ahmdal

Es una regla que nos permite conocer la limitaciones de la paralelización. Hay varias suposiciones:

1. No tomamos en cuenta la latencia de cache.
2. Hay una parte que no podemos paralelizar
3. Hay una parte que podemos paralelizar

La **Ley de Amdahl** se formula de la siguiente manera:

$$
S = \frac{1}{(1 - P) + \frac{P}{N}}
$$

Donde:
- $S$ es la mejora de velocidad (speedup).
- $P$ es la fracción paralelizable del programa (0 ≤ P ≤ 1).
- $N$ es el número de procesadores o hilos.

La parte no paralelizable es $(1 - P)$.

# Paralelización sin limites
$$
S = \frac{1}{(1 - P)}
$$
Por ejemplo, si puedo parelelizar el 60% de un programa, ¿Cuanta acelaración tengo?

$$
S = \frac{1}{0.4} = 2.5
$$
A pesar de que tengo recursos infinitos tengo una limitación en la velocidad que puedo obtener paralelizar, es limitación de diseño de software.
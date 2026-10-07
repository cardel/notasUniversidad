# Apéndice B. Solución del parcial 1 · Estructuras de Datos

Las dos preguntas abiertas del parcial del 25 de septiembre, con la solución
completa y el puntaje de cada parte. Son las mismas en las versiones A, B y C.

La parte de opción múltiple vale 60 de los 100 puntos y estas dos, 20 cada una.

---

## 16. Cota con testigos — 20 puntos

El programa del enunciado:

```c
int mezcla(int n) {
    int t = 0;
    int i = 0;
    int j = 0;
    while (i < n) {
        t = t + 1;
        i = i + 1;
    }
    i = 0;
    while (i < n) {
        j = 0;
        while (j < i) {
            t = t + 1;
            j = j + 1;
        }
        i = i + 1;
    }
    return t;
}
```

$T(n)$ es el número de veces que se ejecuta `t = t + 1`, para $n \geq 1$.

### i. $T(n)$ como suma de las dos partes — 6 puntos

El primer ciclo recorre $i$ desde 0 hasta $n-1$ y ejecuta `t = t + 1` una vez
por vuelta. El segundo lo hace una vez por cada vuelta del ciclo interno, que
para un $i$ fijo recorre $j$ desde 0 hasta $i-1$.

$$
T(n) \;=\; \sum_{i=0}^{n-1} 1 \;+\; \sum_{i=0}^{n-1} \sum_{j=0}^{i-1} 1
$$

El primer sumando es el ciclo simple y el segundo, el anidado.

### ii. La expresión cerrada — 4 puntos

La primera sumatoria suma $n$ veces el 1, de donde $\sum_{i=0}^{n-1} 1 = n$.
En la segunda, la sumatoria interna vale $i$ porque suma $i$ veces el 1, así
que queda $\sum_{i=0}^{n-1} i$, y esa es la suma de los primeros $n-1$
naturales:

$$
\sum_{i=0}^{n-1} i \;=\; \frac{(n-1)\,n}{2}
$$

Reemplazando y sacando denominador común:

$$
T(n) \;=\; n + \frac{n(n-1)}{2}
      \;=\; \frac{2n + n^2 - n}{2}
      \;=\; \frac{n^2 + n}{2}
$$

### iii. $T(n) \in O(n^2)$ — 10 puntos

**Teorema.** $T(n) = \dfrac{n^2+n}{2} \in O(n^2)$.

**Demostración.** Se procede de forma directa: se acota el sumando de primer
grado por uno de segundo grado y se exhiben los testigos.

**Desarrollo.** La definición exige encontrar $c > 0$ y $k \geq 0$ tales que
$T(n) \leq c\,n^2$ para todo $n \geq k$. Se separan los dos sumandos:

$$
T(n) \;=\; \frac{n^2+n}{2} \;=\; \frac{n^2}{2} + \frac{n}{2}
$$

Sea $n \geq 1$. Multiplicando los dos lados de $n \geq 1$ por $n$, que es
positivo y por lo tanto no invierte la desigualdad, se obtiene $n^2 \geq n$.
Dividiendo entre 2, que también es positivo:

$$
\frac{n}{2} \;\leq\; \frac{n^2}{2}
$$

Esa desigualdad acota el segundo sumando. Reemplazándola en la suma:

$$
T(n) \;=\; \frac{n^2}{2} + \frac{n}{2}
     \;\leq\; \frac{n^2}{2} + \frac{n^2}{2}
     \;=\; n^2
$$

**Conclusión.** Para todo $n \geq 1$ se cumple $T(n) \leq 1 \cdot n^2$. Por lo
tanto, se puede concluir que $T(n) \in O(n^2)$ con testigos $c = 1$ y $k = 1$.

Cualquier pareja con $c \geq 1$ y $k \geq 1$ sostiene la demostración, siempre
que el desarrollo justifique la desigualdad que la produce.

---

## 17. Una función contra el contrato de Cola — 20 puntos

Escribir `Elemento maximo(Cola &c)`, que devuelve el mayor elemento de la cola
y la deja exactamente como estaba, usando solo `encolar`, `desencolar`,
`frente`, `tamano` y `vacia`.

### i. La precondición — 3 puntos

Una cola vacía no tiene mayor elemento, y además `frente()` exige que haya al
menos uno. La precondición va escrita antes de la función:

```cpp
// exige !c.vacia()
```

### ii. La función — 10 puntos

```cpp
// exige !c.vacia()
Elemento maximo(Cola &c) {
  int n = c.tamano();
  Elemento mayor = c.frente();
  int i = 0;
  while (i < n) {
    Elemento actual = c.frente();
    if (actual > mayor) {
      mayor = actual;
    }
    c.desencolar();
    c.encolar(actual);
    i = i + 1;
  }
  return mayor;
}
```

Cada vuelta saca el frente y lo vuelve a encolar al final, de modo que la cola
rota un lugar. Después de $n$ vueltas todos los elementos pasaron por el frente
exactamente una vez y volvieron en el mismo orden relativo: la cola queda como
estaba. La variable `mayor` arranca en el frente, que existe por la
precondición, y se actualiza cada vez que aparece uno más grande.

Sobre $\langle 4, 9, 2, 7 \rangle$ devuelve 9 y la cola queda en
$\langle 4, 9, 2, 7 \rangle$.

### iii. Por qué el ciclo se controla con el tamaño — 4 puntos

Cada vuelta desencola uno y encola uno, así que `c.tamano()` vale $n$ al
empezar, al terminar y en todo momento intermedio. El tamaño nunca cambia.

Con `while (!c.vacia())` la condición sería cierta siempre y el ciclo no
terminaría: la cola nunca se vacía porque lo que sale vuelve a entrar. Leer $n$
antes de empezar fija cuántas rotaciones hacen falta para devolver la cola a su
estado original, que es exactamente $n$.

### iv. Costo — 3 puntos

El ciclo da $n$ vueltas y cada una hace una cantidad fija de operaciones del
contrato. Si `encolar`, `desencolar` y `frente` cuestan $\Theta(1)$ —como en la
cola sobre arreglo circular y en la enlazada con puntero al último— entonces:

| | |
|---|---|
| Tiempo | $\Theta(n)$ |
| Espacio aparte de la cola | $\Theta(1)$: `n`, `mayor`, `actual` e `i` |

No se usa ninguna cola auxiliar: la propia rotación es lo que preserva el
contenido. Sobre una implementación donde las operaciones del contrato costaran
$\Theta(n)$, la misma función quedaría en $\Theta(n^2)$.

---

## Código

- [mezcla.c](./codigo/mezcla.c) — el programa de la pregunta 16 contra la
  expresión cerrada, para $n = 1$ a $10$ y para $n = 100$.
- [maximo.cpp](./codigo/maximo.cpp) — la función de la 17, con los casos de un
  solo elemento y de elementos repetidos.
- [cola_nodos.h](./codigo/cola_nodos.h) — la cola enlazada sobre la que corre,
  la misma de
  [El TAD Cola por dentro](../C18/Clase%2018.%20El%20TAD%20Cola%20por%20dentro.md).

Se compilan con `gcc -Wall -Wextra` y `g++ -Wall -Wextra`.

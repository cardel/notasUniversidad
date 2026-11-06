# UVa 336, A Node Too Far

Enunciado y envío, con cuenta de vjudge: <https://vjudge.net/problem/UVA-336>

## Enunciado resumido

Cada mensaje de una red lleva un campo TTL. La estación que lo recibe le resta uno y lo reenvía solo si el resultado no es cero, de modo que el mensaje llega a los nodos que están a distancia menor o igual al TTL. La entrada trae varias redes. Cada una empieza con el número de conexiones, seguido de esos pares de nodos, que son enteros positivos, con un máximo de 30 nodos por red. Después vienen consultas de la forma `nodo TTL`, terminadas en `0 0`. Un número de conexiones igual a cero termina la entrada. Por consulta se imprime `Case k: x nodes not reachable from node s with TTL = t.`, donde `k` sigue contando de una red a la siguiente.

## Consejo

El parámetro es el TTL, un tope de pasos sobre una red de $V \le 30$ nodos y $E$ conexiones. El algoritmo funciona porque el recorrido en amplitud visita los nodos por distancia creciente: la primera vez que toca un nodo, `dist` ya es la distancia mínima, así que basta con no expandir los que llegaron a distancia TTL. La trampa está en los números de los nodos. Pueden ser cualquier entero positivo, y por eso hace falta un diccionario de número a índice. Además, el PDF no descarta que una consulta nombre un nodo ausente de la red; en ese caso ningún nodo es alcanzable y la respuesta es el total de la red.

## Idea

Se construye la lista de adyacencia y se corre un recorrido en amplitud por consulta, con una cola y un arreglo de distancias que arranca en $-1$. La respuesta es el total de nodos menos los alcanzados. El nodo de partida cuenta como alcanzado, incluso con TTL 0.

Con varios orígenes solo cambia el arranque: todos entran a la cola con distancia 0 antes del ciclo.

## Cómo leer la entrada en C++

```cpp
int conexiones;
int caso = 0;
while (scanf("%d", &conexiones) == 1 && conexiones != 0) {
  for (int i = 0; i < conexiones; i++) {
    int a, b;
    scanf("%d %d", &a, &b);
    /* aquí va el diccionario de número a índice */
  }
  int nodo, ttl;
  while (scanf("%d %d", &nodo, &ttl) == 2 && (nodo != 0 || ttl != 0)) {
    caso = caso + 1;
    /* aquí va el recorrido en amplitud */
  }
}
```

Los pares vienen varios por línea, y las consultas también. `scanf("%d", ...)` se salta los espacios y los saltos de línea por igual, de modo que no hace falta leer por líneas. El ciclo de consultas se detiene cuando los dos valores son cero: `35 0` es una consulta válida.

## Código explicado

- `indiceDe` traduce el número del nodo a un índice entre 0 y $V - 1$, y al crear uno nuevo añade su lista vacía a `adj`. Es `map` en C++ y `dict` en Python.
- `bfs` devuelve cuántos nodos alcanzó. La condición `dist[u] < ttl` deja en la cola los nodos a distancia TTL sin expandirlos.
- `main` pregunta si el nodo está antes de llamar a `bfs`: con `count` en C++ y con `in` en Python.

## Complejidad

$O(V + E)$ por consulta para el recorrido, con $V \le 30$ y $E \le 435$. Cada búsqueda en el diccionario cuesta $O(\log V)$ en C++ y $O(1)$ en promedio en Python.

## Trampas

Las cifras salen de correr una variante equivocada de la solución.

- Expandir con `dist[u] <= ttl` da 1, 0, 5, 0, 1, 0 en la muestra, en lugar de 5, 1, 8, 5, 3, 1.
- Reiniciar `caso` en cada red numera la muestra 1, 2, 1, 2, 3, 4, en lugar de 1 a 6.
- Consultar `indice[nodo]` sin revisar en C++ crea la clave y lee fuera de `adj`, sin que el programa falle: en los casos 6 y 7 de `2.in` imprime 0 y 1, en lugar de 2 y 2. En Python la misma línea corta con `KeyError`.
- La frase de salida no tiene singular: la muestra escribe `1 nodes`.

## Casos

- `1.in`: la muestra del enunciado.
- `2.in`: una sola conexión, TTL 0, TTL mayor que cualquier distancia, nodo ausente, el mayor entero de 32 bits como número de nodo y como TTL, una red con dos componentes, un camino y un triángulo.
- `3.in`: tres redes de 30 nodos con números al azar. Son la red completa, con 435 conexiones; un camino consultado con todos los TTL de 0 a 30 desde un extremo y con tres desde el centro; y dos componentes de 15 nodos cada una.

Las salidas de `2.in` y `3.in` las escribió un programa aparte con Floyd-Warshall, sin cola ni diccionario, y las soluciones se compararon después contra ellas. El programa también coincidió con las dos soluciones en 300 entradas al azar.

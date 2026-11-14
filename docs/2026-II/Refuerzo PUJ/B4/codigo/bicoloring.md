# UVa 10004, Bicoloring

Enunciado y envío: <https://vjudge.net/problem/UVA-10004>. La página pide cuenta para ver el enunciado.

## Enunciado resumido

Se da un grafo no dirigido y conexo, sin lazos, con $n$ nodos ($1 < n < 200$) numerados desde 0. Hay que decidir si se pueden pintar los nodos con dos colores de modo que ninguna arista una dos nodos del mismo color. Cada caso trae $n$, el número de aristas $l$ y las $l$ aristas; la entrada termina con $n = 0$. Se imprime `BICOLORABLE.` o `NOT BICOLORABLE.`

## La idea

Es el problema de dos colores. Pintado el nodo 0, el color de cada vecino queda forzado: el contrario. El recorrido en profundidad lleva el color además de la marca de visitado y anota si alguna arista une dos nodos iguales. Como el grafo es conexo, un solo recorrido desde 0 pinta todos los nodos.

## Cómo leer la entrada en C++

```cpp
int n;
scanf("%d", &n);
while (n != 0) {
  int l;
  scanf("%d", &l);
  vector<vector<int> > adj(n);
  for (int i = 0; i < l; i++) {
    int a, b;
    scanf("%d %d", &a, &b);
    adj[a].push_back(b);
    adj[b].push_back(a);
  }
  // aquí va el coloreo desde 0
  scanf("%d", &n);
}
```

Cada arista entra en las dos listas, porque el grafo no es dirigido.

## Trampas

- Los colores y las listas se crean de nuevo en cada caso.
- Las dos salidas llevan punto final.
- Si el grafo no fuera conexo, arrancar solo desde 0 dejaría nodos sin pintar; aquí el enunciado lo descarta.

## Complejidad

$O(n + l)$ por caso: cada nodo se pinta una vez y cada arista se mira desde sus dos extremos.

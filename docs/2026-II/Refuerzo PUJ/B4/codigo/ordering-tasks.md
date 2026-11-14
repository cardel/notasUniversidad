# UVa 10305, Ordering Tasks

Enunciado y envío: <https://vjudge.net/problem/UVA-10305>. La página pide cuenta para ver el enunciado.

## Enunciado resumido

Hay $n$ tareas ($1 \le n \le 100$), numeradas de 1 a $n$, y $m$ relaciones `i j`: la tarea `i` va antes que la `j`. Se imprime, en una línea, un orden en que se pueden hacer todas. La entrada trae varios casos y termina con `0 0`. El juez acepta cualquier orden correcto.

## La idea

Es el orden topológico con el algoritmo de Kahn. Se cuenta cuántas relaciones llegan a cada tarea, su grado de entrada, y se ponen en una cola las que no tienen ninguna. Al sacar una tarea se imprime y se baja en uno el grado de las que dependen de ella; la que llega a cero entra a la cola. El grado se cuenta mientras se leen los datos: con cada relación `i j` se suma 1 a `entrada[j]`.

Con la muestra, la cola arranca con 1 y 4 y la salida es `1 4 2 5 3`, la misma del enunciado.

## Cómo leer la entrada en C++

```cpp
int n, m;
scanf("%d %d", &n, &m);
while (n != 0 || m != 0) {
  vector<vector<int> > adj(n + 1);
  vector<int> entrada(n + 1, 0);
  for (int i = 0; i < m; i++) {
    int a, b;
    scanf("%d %d", &a, &b);
    adj[a].push_back(b);
    entrada[b] = entrada[b] + 1;
  }
  // aquí va Kahn
  scanf("%d %d", &n, &m);
}
```

## Trampas

- Las tareas se numeran desde 1: los vectores llevan $n + 1$ posiciones.
- Puede haber $m = 0$ con $n > 0$: todas las tareas entran a la cola al empezar.
- Los números de una línea van separados por un espacio, sin espacio al final.

## Complejidad

$O(n + m)$ por caso: cada tarea entra y sale de la cola una vez y cada relación se mira una vez.

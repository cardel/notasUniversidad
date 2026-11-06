# UVa 11686, Pick up sticks

Enunciado y envío, con cuenta de vjudge: <https://vjudge.net/problem/UVA-11686>

## Enunciado resumido

Hay $n$ palitos numerados de 1 a $n$ y $m$ pares `a b`, cada uno con el significado de que `a` está encima de `b` en algún punto, con $1 \le n, m \le 1\,000\,000$. Un palito se recoge solo cuando ya se recogieron todos los que tiene encima. Por caso se imprime un orden de recogida, un palito por línea, o `IMPOSSIBLE` si no existe ninguno. La entrada termina en `0 0`.

El enunciado acepta cualquier orden correcto, así que la salida no es única. Los `.out` guardan el orden que imprimen estas soluciones. Otra solución puede dar uno distinto y estar bien, y para ella `diff` no sirve: hay que comprobar que cada arista $a \to b$ tenga a `a` antes que a `b`.

## Consejo

El parámetro es $n + m$, y la profundidad de la recursión puede llegar a $n$. El algoritmo funciona por dos propiedades del recorrido en profundidad. Cuando un nodo termina, todo lo que sale de él ya terminó, de modo que el inverso del orden de terminación respeta todas las aristas. Y hay ciclo exactamente cuando una arista llega a un nodo del camino actual. La trampa es doble: con solo dos estados, un nodo ya terminado parece un ciclo, y una cadena de un millón de palitos revienta la pila de llamadas de la versión recursiva.

## Idea

Cada nodo pasa por tres estados: sin visitar, en el camino actual y terminado. El estado que importa es el del medio. Una arista hacia un nodo en camino cierra un ciclo, porque desde ese nodo ya se había bajado hasta el actual. Una arista hacia un nodo terminado no cierra nada por sí sola: ese nodo ya revisó todo lo que sale de él, y si pudiera volver al actual, la arista de regreso ya se habría detectado.

En sentido contrario, si hay un ciclo, sea $x$ su primer nodo visitado. Antes de que $x$ termine, el recorrido baja por el ciclo hasta el nodo anterior a $x$, cuya arista encuentra a $x$ todavía en camino.

## Cómo leer la entrada en C++

```cpp
int n, m;
while (scanf("%d %d", &n, &m) == 2 && (n != 0 || m != 0)) {
  vector<vector<int> > adj(n + 1);
  for (int i = 0; i < m; i++) {
    int a, b;
    scanf("%d %d", &a, &b);
    adj[a].push_back(b);
  }
  /* aquí va el recorrido en profundidad */
}
```

Las aristas se leen todas antes de recorrer, incluso si ya se ve un ciclo en las primeras: las que queden sin leer se tomarían como el caso siguiente. Los palitos se numeran desde 1, y por eso `adj` tiene $n + 1$ listas.

## Código explicado

- `dfs` marca el nodo en camino, revisa sus aristas y lo marca terminado. `hayCiclo` se enciende y el recorrido sigue hasta el final, de modo que la función conserva un solo punto de salida.
- `orden` recibe cada nodo al terminar, y `main` lo imprime del último al primero.
- `main` llama a `dfs` desde todo nodo sin visitar, porque el grafo puede tener varias componentes.
- `pick-up-sticks-pila.cpp` hace lo mismo con un `vector` como pila. `siguiente[u]` recuerda cuál arista de `u` toca revisar, el dato que en la recursiva guarda la variable `i` de cada llamada. Imprime los mismos órdenes que la recursiva.
- `pick-up-sticks.py` sube el límite de recursión con `sys.setrecursionlimit`, porque en Python el valor por omisión corta la cadena de `3.in`.

## Medición con el tope

`genera-tope.py` escribe la cadena de un millón de palitos, sola o cerrada en ciclo. Se corrió con `g++ -O2`, salida a `/dev/null` y `ulimit -s` de 8192 KB. Los tiempos son la mediana de tres corridas en C++ y el promedio de dos en Python.

| Programa | Cadena | Cadena cerrada en ciclo | Un millón de aristas al azar, sin ciclo |
|---|---|---|---|
| C++ recursiva | revienta a los 0,46 s | revienta a los 0,47 s | 0,48 s |
| C++ con pila explícita | 0,24 s | 0,19 s | 0,54 s |
| Python 3.14 | 1,43 s | 1,32 s | 1,78 s |
| Python 3.8 | revienta a los 1,74 s | revienta a los 1,72 s | 2,11 s |

En la cadena, la versión con pila ocupó 80 MB y Python 3.14 ocupó 482 MB. La recursiva de C++ pasó con 86 851 nodos de profundidad y reventó con 87 826. Python 3.8, con el mismo límite de recursión, pasó con 10 515 y reventó con 10 968.

Al juez se envía `pick-up-sticks-pila.cpp`, porque la recursiva de C++ no sobrevive a una cadena de 87 826 nodos con esa pila y el enunciado admite un millón. La recursiva queda para explicar el algoritmo. El de Python tampoco se envía: el juez corre una versión vieja de Python 3, y en Python 3.8 la recursión revienta mucho antes del tope, aunque en Python 3.14 alcance.

## Complejidad

$\Theta(n + m)$ por caso en las tres soluciones. La memoria adicional del recorrido es $\Theta(n)$, en la pila de llamadas o en el `vector`.

## Trampas

Las cifras salen de correr una variante equivocada de la solución, salvo la del palito solo, que sale del enunciado.

- Con dos estados, en `2.in` salen `IMPOSSIBLE` los casos 2, 3 y 4, que tienen aristas repetidas, un nodo terminado alcanzado desde otra raíz y un rombo.
- Sin invertir `orden`, la muestra da 3, 2, 1, en lugar de 1, 2, 3.
- Arrancar solo desde el palito 1 deja nodos por fuera: el caso 3 de `2.in` imprime solo 1, en lugar de 3, 2, 1.
- Un par `a a` es un ciclo de longitud uno. Como $m \ge 1$, con $n = 1$ la respuesta siempre es `IMPOSSIBLE`.
- Crear `siguiente` dentro de la `dfs` con pila cuesta $\Theta(n)$ por raíz. En la entrada al azar, con muchas raíces, esa variante compilada sin `-O2` seguía corriendo tras 305 s, frente a 1,07 s de la versión que lo crea una vez por caso.

## Casos

- `1.in`: la muestra del enunciado, con orden único.
- `2.in`: palito solo con su lazo, arista repetida, orden descendente, rombo, palitos sueltos, ciclo de dos, ciclo que no toca al palito 1 y lazo al final de un camino.
- `3.in`: una cadena de 30 000 palitos y la misma cerrada en ciclo. El tope real se queda fuera del repositorio porque ocupa 13,8 MB; lo genera `genera-tope.py`.

Un programa aparte revisa cada salida contra la entrada. Para cada caso decide con el algoritmo de Kahn si existe un orden. Si la salida da un orden, comprueba que sea una permutación y que respete todas las aristas. Si dice `IMPOSSIBLE`, exhibe un ciclo cuyas aristas están todas en la entrada. Pasó sobre los casos 1, 2 y 3, sobre las tres entradas del tope y sobre 200 entradas al azar, donde además coincidieron las tres soluciones.

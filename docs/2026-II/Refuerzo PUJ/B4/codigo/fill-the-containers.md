# UVa 11413, Fill the Containers

Enunciado y envío, con cuenta de vjudge: <https://vjudge.net/problem/UVA-11413>

## Enunciado resumido

Una banda trae $n \leq 1000$ recipientes de capacidad $c \leq 10^6$, llenos, que se vacían en orden en $m \leq 10^6$ contenedores. Cada recipiente va entero a un solo contenedor, y cada contenedor recibe un tramo seguido de la banda. Se escogen las capacidades de los contenedores y se pide la menor capacidad posible del más grande. Hay varios casos hasta el fin del archivo.

## Consejo

El parámetro es la capacidad $t$ del contenedor más grande. Lo que hace funcionar la bisección es la monotonía: si $t$ alcanza, $t + 1$ también. La trampa está en los rangos: $m$ puede pasar de $n$, así que la decisión pregunta si usa a lo más $m$ contenedores, y la cota inferior es el recipiente más grande, porque ninguno se divide.

## La función

$$\varphi(t): \text{¿bastan } m \text{ contenedores de capacidad } t\text{?}$$

Se responde de una pasada: se llena el contenedor actual mientras quepa el recipiente siguiente y se abre otro cuando no cabe. Llenar cada contenedor al máximo nunca obliga a usar uno más, y por eso esta forma de repartir da el menor número de contenedores para cada $t$.

## Idea

Bisección sobre $t$ en $[\max_i c_i,\ S]$, con $S$ la suma de los recipientes. Con $t = S$ todo cabe en un contenedor. El invariante del ciclo es que ningún $t$ por debajo de `lo` alcanza y que `hi` sí alcanza.

## Cómo leer la entrada en C++

```cpp
int n, m;
while (scanf("%d %d", &n, &m) == 2) {
  vector<int> c(n);
  for (int i = 0; i < n; i++) {
    scanf("%d", &c[i]);
  }
}
```

Comparar contra dos detecta el fin del archivo.

## Código explicado

- `alcanza(c, m, t)` es $\varphi$. Empieza con un contenedor abierto y vacío.
- `menorCapacidad` hace la bisección con el intervalo cerrado: cuando `medio` alcanza puede ser la respuesta y se queda en `hi`; cuando no alcanza se descarta con `medio + 1`.
- La suma llega a $10^9$ y cabe en un `int`, y `lo + (hi - lo) / 2` evita sumar dos valores grandes.

## Complejidad

Cada decisión da $n$ pasos y la bisección corre $O(\log S)$ veces: $O(n \log S)$ por caso, sin importar $m$.

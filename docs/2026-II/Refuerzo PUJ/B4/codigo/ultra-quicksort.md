# UVa 10810, Ultra-QuickSort

Enunciado y envío: <https://vjudge.net/problem/UVA-10810>

## Enunciado resumido

Dada una sucesión de $n$ enteros distintos, se pide cuántos intercambios de elementos vecinos hacen falta para dejarla ordenada de menor a mayor. La entrada trae varios casos; cada uno empieza con $n < 500\,000$ y sigue con los $n$ valores, uno por línea. Un caso con $n = 0$ cierra la entrada.

## Lo que de verdad se pide

Un intercambio de vecinos arregla exactamente una pareja fuera de orden, así que el número de intercambios es el número de parejas $(i, j)$ con $i < j$ y $a_i > a_j$. Contarlas una por una cuesta $\Theta(n^2)$, que con medio millón de elementos no termina.

## El planteamiento recursivo

Las parejas fuera de orden del arreglo $a[ini..fin)$ se reparten en tres grupos que no se pisan:

1. las que tienen sus dos elementos en la mitad izquierda,
2. las que los tienen en la mitad derecha,
3. las que tienen uno en cada mitad.

Los dos primeros grupos son el mismo problema sobre la mitad del tamaño, y ahí está la recursión. El tercero es lo que hay que saber combinar, y se cuenta gratis mientras se mezclan las dos mitades ya ordenadas: cuando sale un elemento de la derecha, todos los que quedan pendientes en la izquierda son mayores que él, así que aporta tantas parejas como elementos le falten a la izquierda.

Que las mitades queden ordenadas permite contar el tercer grupo en una sola pasada. Hay $\log_2 n$ niveles de llamadas y en cada uno la mezcla mueve los $n$ elementos una vez, de modo que el total es $\Theta(n \log n)$.

El caso base es un tramo de un elemento o vacío, que no tiene ninguna pareja.

## Cómo leer la entrada en C++

```cpp
int n;
while (scanf("%d", &n) == 1 && n != 0) {
  vector<int> a(n), aux(n);
  for (int i = 0; i < n; i++) {
    scanf("%d", &a[i]);
  }
}
```

El auxiliar se reserva una vez por caso y se reutiliza en todas las mezclas, en vez de crear uno nuevo en cada llamada.

## Código explicado

- `contar(a, aux, ini, fin)` trabaja por índices sobre el mismo arreglo, sin copiar tramos. Devuelve las inversiones del tramo y lo deja ordenado.
- `mezclar` es la combinación. La copia al auxiliar se admite porque ese paso ya paga $\Theta(n)$ de todas formas.
- El contador va en `long long`: con medio millón de elementos, el máximo es del orden de $10^{11}$ y no cabe en 32 bits.

## Complejidad

$\Theta(n \log n)$ por caso. Medido con $n = 499\,999$: la versión de C++ tarda 0,20 s y la de Python 5,1 s, así que al juez se envía la de C++.

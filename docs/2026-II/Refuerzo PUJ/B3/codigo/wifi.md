# UVa 11516, WiFi

Enunciado y envío: <https://vjudge.net/problem/UVA-11516>. La página pide cuenta para ver el enunciado.

## Enunciado resumido

Una calle recta tiene $m$ casas, cada una en el número que es su distancia en metros desde el comienzo de la calle. Se compran $n$ puntos de acceso y se ponen en cualquier punto. Se pide la menor distancia máxima posible entre una casa y su punto de acceso más cercano, con un decimal. La entrada trae el número de casos; cada caso trae $n$ y $m$, y después una casa por línea, sin ordenar. Hay a lo sumo 100 000 casas y los números no pasan de un millón.

## La función

Buscar la mejor ubicación de las antenas directamente obliga a probar posiciones reales. La pregunta que sí se contesta de una pasada es otra:

$$\varphi(a): \text{¿alcanzan } n \text{ antenas si cada una cubre un tramo de } a \text{ metros?}$$

Con las casas ordenadas se toma la primera sin cubrir, se le pone el comienzo de un tramo y ese tramo cubre hasta $\text{casa} + a$. Se repite y se cuentan las antenas. Eso cuesta $\Theta(m)$.

$\varphi$ es monótona: si con tramos de $a$ metros alcanzan, con tramos más largos también, porque cada antena cubre más.

Se busca sobre el ancho $a$, que es el doble de la distancia, y no sobre la distancia. Las casas están en posiciones enteras, así que el mejor ancho es entero y la bisección no necesita números reales. La respuesta es $a/2$ y termina en `.0` o en `.5`.

## Idea

Bisección sobre $a$ en $[0,\ \text{última casa} - \text{primera casa}]$: con ancho cero cada casa distinta pide su antena, y con el largo de la calle basta una.

## Cómo leer la entrada en C++

```cpp
int casos;
scanf("%d", &casos);
for (int caso = 0; caso < casos; caso++) {
  int n, m;
  scanf("%d %d", &n, &m);
  vector<int> casas(m);
  for (int i = 0; i < m; i++) {
    scanf("%d", &casas[i]);
  }
}
```

Las casas llegan una por línea y sin ordenar. Se ordenan con `sort` antes de la bisección.

## Trampas

- Las casas no vienen ordenadas.
- Puede haber más antenas que casas: la respuesta es `0.0`.
- La salida lleva exactamente un decimal.

## Complejidad

$\Theta(m \log m)$ por caso: ordenar cuesta $m \log m$ y la bisección da unas veinte vueltas de $\Theta(m)$, porque el ancho no pasa de un millón.

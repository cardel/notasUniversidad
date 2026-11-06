# UVa 12032, The Monkey and the Oiled Bamboo

Enunciado y envío: <https://vjudge.net/problem/UVA-12032>

## Enunciado resumido

Una escalera tiene $n$ peldaños a alturas $r_1 < r_2 < \dots < r_n$ medidas desde el suelo. Se sube de peldaño en peldaño, sin saltarse ninguno. Se arranca con un factor de fuerza $k$: ningún salto puede medir más de $k$ pies, y cada vez que uno mide exactamente $k$, el factor baja en uno. Se pide el menor $k$ con el que se llega al último peldaño. La entrada trae el número de casos, y cada caso la cantidad de peldaños y sus alturas.

## La función

Encontrar el mínimo directamente obliga a razonar sobre todos los saltos a la vez. La pregunta que sí se contesta de una pasada es la otra:

$$\varphi(k): \text{¿se llega al último peldaño empezando con fuerza } k?$$

Se simula la subida: se lleva la fuerza actual, cada salto se compara contra ella, y el que la iguala la gasta en uno. Eso cuesta $\Theta(n)$.

$\varphi$ es monótona: si con $k$ se llega, con $k+1$ también, porque en todo momento la fuerza disponible es mayor o igual y ningún salto que cabía deja de caber. Entonces los valores de $k$ se parten en dos tramos, los que fallan y los que sirven, y lo que se busca es el borde.

Los límites salen del enunciado. Por debajo, $k$ tiene que ser al menos el salto más grande, porque ese salto hay que darlo. Por arriba, con $k = \max_i s_i + n$ sobra: cada salto baja la fuerza a lo sumo en uno, así que nunca cae por debajo del salto más grande.

## Idea

Bisección sobre $k$ en $[\max s_i,\ \max s_i + n]$, con $\varphi$ como función de decisión. Se mantiene el intervalo medio abierto: `lo` es el primer candidato que podría servir y `hi` el primero que seguro sirve, y el ciclo termina cuando se juntan.

## Cómo leer la entrada en C++

```cpp
int casos;
scanf("%d", &casos);
for (int caso = 1; caso <= casos; caso++) {
  int n;
  scanf("%d", &n);
  vector<int> alturas(n);
  for (int i = 0; i < n; i++) {
    scanf("%d", &alturas[i]);
  }
}
```

Las alturas vienen en una sola línea separadas por espacios, pero `scanf("%d", ...)` se salta los espacios y los saltos de línea por igual, así que el mismo ciclo sirve sin importar cómo estén repartidas.

## Código explicado

- `alcanza(saltos, k)` es $\varphi$. Recorre los saltos con la fuerza actual y devuelve si se llegó. No corta el ciclo cuando falla: deja la bandera en falso y sigue, que es lo mismo y cumple la regla de un solo `return`.
- El primer salto es desde el suelo, así que la lista de saltos arranca con $r_1$.
- `minimaFuerza` hace la bisección. La invariante del ciclo es que la respuesta está en $[lo, hi]$.

## Complejidad

$\Theta(n \log(\max s_i + n))$ por caso: cada vuelta de la bisección cuesta una pasada por los saltos, y hay logarítmicas vueltas en el rango de $k$.

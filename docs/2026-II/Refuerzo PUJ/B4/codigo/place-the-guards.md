# UVa 11080, Place the Guards

Enunciado y envío: <https://vjudge.net/problem/UVA-11080>. La página pide cuenta para ver el enunciado.

## Enunciado resumido

Hay $v$ cruces ($1 \le v \le 200$) y $e$ calles ($0 \le e \le 10000$), cada calle entre dos cruces. Un guardia en un cruce vigila ese cruce y las calles y cruces vecinos. Todo cruce y toda calle deben quedar vigilados, y ninguna calle puede tener guardias en sus dos extremos. Se pide el menor número de guardias, o `-1` si no se puede. La entrada trae el número de casos y, en cada uno, $v$, $e$ y las calles.

## La idea

Cada calle tiene exactamente un extremo con guardia: al menos uno, para que quede vigilada, y no los dos. En un pedazo del grafo eso es pintar con dos colores y poner los guardias en uno de ellos. Se pinta cada pedazo, se cuentan los nodos de cada color y se suma el color menos usado. Si un pedazo no se puede pintar con dos colores, la respuesta es `-1`.

## Cómo leer la entrada en C++

```cpp
int casos;
scanf("%d", &casos);
for (int caso = 1; caso <= casos; caso++) {
  int v, e;
  scanf("%d %d", &v, &e);
  vector<vector<int> > adj(v);
  for (int i = 0; i < e; i++) {
    int f, t;
    scanf("%d %d", &f, &t);
    adj[f].push_back(t);
    adj[t].push_back(f);
  }
  // aquí va el coloreo de cada pedazo
}
```

## Trampas

- El grafo puede venir en varios pedazos: el coloreo arranca desde cada cruce que siga sin color.
- Un cruce sin calles necesita su propio guardia: su pedazo aporta 1, no 0.
- Basta un pedazo que choque para que la respuesta sea `-1`.

## Complejidad

$O(v + e)$ por caso: cada cruce se pinta una vez y cada calle se mira desde sus dos extremos.

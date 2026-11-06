# UVa 1203, Argus

Enunciado y envío, con cuenta de vjudge: <https://vjudge.net/problem/UVA-1203>

## Enunciado resumido

Cada instrucción `Register num P` registra una consulta con número `num` y periodo $P$, ambos entre 1 y 3000. La consulta responde a los $P$ segundos de registrarse y después cada $P$ segundos, y todas se registran en el mismo instante. Se piden los números de las primeras $K$ respuestas, con $K \leq 10\,000$ y a lo más 1000 instrucciones. Si dos consultas responden en el mismo instante, sale primero la de número menor. El registro termina en una línea con `#`, y $K$ viene en la línea siguiente.

## Consejo

El parámetro es $K$, cuántas respuestas se piden, sobre $q$ consultas. Lo que hace funcionar la cola es que en cada momento solo importa la próxima respuesta de cada consulta, así que basta un par por consulta. La trampa está en el arranque: la primera respuesta llega a los $P$ segundos, de modo que el par inicial es $(P, \mathit{num})$ y no $(0, \mathit{num})$.

## Idea

La cola de prioridad guarda el instante de la próxima respuesta y el número de la consulta. Sale el par menor, se imprime su número y la consulta vuelve a entrar con el instante aumentado en su periodo. Los pares se comparan por el primer elemento y, si empatan, por el segundo, y ese orden es justo el desempate que pide el enunciado.

## Cómo leer la entrada en C++

```cpp
char palabra[10];
int num, p;
while (scanf("%s", palabra) == 1 && palabra[0] != '#') {
  scanf("%d %d", &num, &p);
}
int k;
scanf("%d", &k);
```

`palabra` recibe `Register` o `#`. Si fue `#`, los dos enteros no se leen y el ciclo termina.

## Código explicado

- `periodo` guarda el periodo de cada número: en Python, un diccionario; en C++, un arreglo de 3001 casillas, porque los números llegan hasta 3000.
- En C++ la cola lleva `greater`, porque `priority_queue` saca el mayor si no se le indica otra cosa. En Python `heapq` ya saca el menor.
- El instante cabe en un `int`: a lo sumo vale $3000 \times 10\,000 = 3 \times 10^7$.

## Complejidad

Con $q$ consultas la cola nunca pasa de $q$ pares, porque cada extracción trae una inserción. Son $q$ inserciones y $K$ vueltas con una extracción y una inserción: $O((q + K) \log q)$.

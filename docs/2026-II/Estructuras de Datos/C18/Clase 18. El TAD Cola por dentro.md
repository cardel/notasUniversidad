# Clase 18. El TAD Cola por dentro

Viernes 9 de octubre de 2026, de 14:00 a 17:00.

La cola que el curso viene usando vive en un arreglo que da la vuelta: al
desencolar no mueve nada, adelanta `inicio`, y al encolar escribe en
`(inicio + n) % CAPACIDAD`, de modo que las casillas que quedan atrás se
reutilizan. Las dos operaciones son $\Theta(1)$ y el precio es el techo fijo.
Esta sesión la construye sobre el TAD Lista, y ahí aparece lo que la pila no
mostraba: una cola entra por un extremo y sale por el otro, así que necesita
los dos baratos a la vez. De las cuatro combinaciones de lista y extremo, solo
una lo logra, y es la que guarda un puntero al último.

Al terminar, el objetivo es poder explicar por qué el residuo hace circular al
arreglo, mostrar que ninguna lista de un solo extremo barato sirve para una
cola, construirla sobre la lista con puntero al último y directamente sobre
nodos con las tres operaciones en $\Theta(1)$, y decidir cuál implementación
conviene según se conozca o no el número máximo de elementos.

## Diapositivas

![](clase18.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Ejercicios interactivos

Cinco actividades que se trabajan en el navegador, una por tema de la sesión,
en la [página de ejercicios interactivos](./Ejercicios.md). Los programas no
son los de la sesión: mismo tema, valores nuevos.

## Código de la sesión

- [cola.h](codigo/cola.h) — la cola sobre el TAD Lista, con el frente en la
  posición 0 y el final en el último.
- [cola_nodos.h](codigo/cola_nodos.h) — la cola directa sobre nodos, guardando
  cabeza y último.
- [cola_uso.cpp](codigo/cola_uso.cpp) — el mismo programa sobre las dos,
  incluido el caso de vaciarse y volver a servir.
- [lista_cola.h](codigo/lista_cola.h) — la lista enlazada con puntero al
  último que queda debajo.
- [extremos_cola.cpp](codigo/extremos_cola.cpp) — las cuatro combinaciones de
  lista y extremo, contando elementos tocados.

Se compilan con `g++ -Wall -Wextra`. Las dos colas se compilan escogiendo la
cabecera:

```
g++ -Wall -Wextra -DCABECERA='"cola.h"' cola_uso.cpp -o sobre_lista
g++ -Wall -Wextra -DCABECERA='"cola_nodos.h"' cola_uso.cpp -o sobre_nodos
```

## Para el juez

*UVa 540 — Team Queue*, <https://onlinejudge.org/external/5/540.pdf>. Envío en
<https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=481>.

Una fila donde cada quien se pone detrás del último de su equipo. Con 200 000
órdenes, una cola que cueste $\Theta(n)$ por operación no entra en el tiempo:
las dos tienen que ser $\Theta(1)$.

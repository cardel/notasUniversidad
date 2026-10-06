# Clase 17. El TAD Pila por dentro

Miércoles 7 de octubre de 2026, de 17:00 a 19:00.

La pila que el curso viene usando guarda los elementos en un arreglo con el
tope en la casilla `n`. Apilar y desapilar son $\Theta(1)$, y el precio es el
de siempre: `CAPACIDAD` se fija al compilar y el elemento que no cabe detiene
el programa. Esta sesión la construye de nuevo sobre el TAD Lista, usándolo por
un solo extremo, y mide algo que no se ve en el contrato: el costo de `apilar`
no es una propiedad de la pila, sino de la lista que se escoja debajo y del
extremo que se nombre tope. Con el arreglo debajo, el tope al frente cuesta
$\Theta(n)$; con la enlazada, $\Theta(1)$. Las dos estructuras son el espejo
una de la otra.

Al terminar, el objetivo es poder construir la pila sobre el TAD Lista
escogiendo el extremo que sirve, explicar por qué el mismo diseño cuesta
$\Theta(1)$ o $\Theta(n)$ según lo que haya debajo, escribirla también
directamente sobre nodos, y dar el costo en tiempo y en espacio de las tres
operaciones en cada combinación.

## Diapositivas

![](clase17.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Ejercicios interactivos

Cinco actividades que se trabajan en el navegador, una por tema de la sesión,
en la [página de ejercicios interactivos](./Ejercicios.md). Los programas no
son los de la sesión: mismo tema, valores nuevos.

## Código de la sesión

- [pila.h](codigo/pila.h) — la pila sobre el TAD Lista: seis llamadas, ningún
  puntero a la vista.
- [pila_nodos.h](codigo/pila_nodos.h) — la pila directa sobre nodos, con la
  cima en la cabeza de la cadena.
- [pila_uso.cpp](codigo/pila_uso.cpp) — el mismo programa sobre las dos; se
  compila una vez con cada cabecera.
- [lista.h](codigo/lista.h) — la lista enlazada que queda debajo.
- [extremos.cpp](codigo/extremos.cpp) — qué cuesta poner el tope en cada
  extremo según la lista de abajo, contando elementos tocados.
- [techo.cpp](codigo/techo.cpp) — hasta dónde aguanta cada una y cuánta
  memoria ocupan los nodos.

Se compilan con `g++ -Wall -Wextra`. Las dos pilas se compilan escogiendo la
cabecera:

```
g++ -Wall -Wextra -DCABECERA='"pila.h"' pila_uso.cpp -o sobre_lista
g++ -Wall -Wextra -DCABECERA='"pila_nodos.h"' pila_uso.cpp -o sobre_nodos
```

## Para el juez

*UVa 732 — Anagrams by Stack*, <https://onlinejudge.org/external/7/732.pdf>.
Envío en
<https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=673>.

Todas las secuencias de meter y sacar que convierten una palabra en otra. Se
prueban las dos jugadas posibles en cada paso y se deshace la que no lleve a
nada, así que apilar y desapilar se hacen y se deshacen miles de veces: tienen
que ser baratas.

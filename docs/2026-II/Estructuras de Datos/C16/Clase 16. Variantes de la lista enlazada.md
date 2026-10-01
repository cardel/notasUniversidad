# Clase 16. Variantes de la lista enlazada

Viernes 2 de octubre de 2026, de 14:00 a 17:00.

La lista enlazada con la que se construyó el TAD guarda en cada nodo el dato y
la dirección del siguiente. Con eso insertar al frente cuesta dos escrituras,
pero borrar un nodo que ya se tiene localizado obliga a recorrer la lista
entera buscando quién lo apunta, y llegar a la posición $p$ cuesta $p$ pasos
sin excepción. Esta sesión agrega un campo, cierra la cadena sobre sí misma y
guarda un contador, y mide qué compra cada una de las tres decisiones y qué
cobra a cambio. Después usa la estructura para lo que mejor hace: ordenar
partiendo, ordenando cada mitad y mezclando.

Al terminar, el objetivo es poder construir la lista doblemente enlazada y la
circular diciendo qué operación baja de costo en cada una; explicar por qué
caminar por el lado más corto parte el trabajo a la mitad sin mover la cota
$\Theta(n)$; ordenar una lista enlazada con merge sort y escribir la
recurrencia $T(n) = 2T(n/2) + \Theta(n)$ que da $\Theta(n \log n)$; y decir
por qué la mezcla sobre nodos ocupa $\Theta(1)$ de espacio aparte mientras
sobre un arreglo ocupa $\Theta(n)$.

## Diapositivas

![](clase16.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Ejercicios interactivos

Cinco actividades que se trabajan en el navegador, una por tema de la sesión,
en la [página de ejercicios interactivos](./Ejercicios.md). Los programas no
son los de la sesión: mismo tema, valores nuevos.

## Código de la sesión

- [doble.h](codigo/doble.h) — la lista doblemente enlazada, con el
  `desenlazar` que saca un nodo en $\Theta(1)$ porque no necesita buscar al
  anterior.
- [doble_uso.cpp](codigo/doble_uso.cpp) — el mismo contrato corriendo sobre
  ella.
- [circular.h](codigo/circular.h) — la circular doble: sin `NULL` en ningún
  enlace, `cabeza->anterior` es el último e `insertar` pasa de cuatro casos a
  dos.
- [circular_rapida.h](codigo/circular_rapida.h) — la misma, con el contador
  que permite llegar a la posición por el lado más corto.
- [circular_uso.cpp](codigo/circular_uso.cpp) — se compila una vez con cada
  cabecera y las dos responden igual.
- [pasos.cpp](codigo/pasos.cpp) — cuántos pasos cuesta llegar a cada posición
  por los dos caminos, con los totales para 10, 100 y 1000 elementos.
- [merge.cpp](codigo/merge.cpp) — merge sort sobre la lista: `partir` con el
  puntero lento y el rápido, `mezclar` empalmando nodos y `ordenar`.
- [comparar.cpp](codigo/comparar.cpp) — insertion sort y merge sort sobre la
  misma entrada, contando comparaciones.

Se compilan con `g++ -Wall -Wextra`. Los dos de la lista circular se compilan
escogiendo la cabecera:

```
g++ -Wall -Wextra -DCABECERA='"circular.h"' circular_uso.cpp -o circular
g++ -Wall -Wextra -DCABECERA='"circular_rapida.h"' circular_uso.cpp -o rapida
```

## Para el juez

*UVa 11462 — Age Sort*, <https://onlinejudge.org/external/114/11462.pdf>.
Envío en
<https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=2457>.

Dos millones de edades entre 1 y 100 para imprimir en orden. Merge sort entra
en el tiempo, pero el cuello de botella está en la lectura, no en el
ordenamiento. Y la cota sobre los valores —no sobre la cantidad— permite algo
mejor que comparar.

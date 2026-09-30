# Clase 15. La lista enlazada

Miércoles 30 de septiembre de 2026, de 17:00 a 19:00.

La lista que el curso viene usando guarda los elementos en casillas
consecutivas de un arreglo. Eso hace que `obtener` sea una suma, y que
`insertar(0, e)` mueva todos los elementos que ya están: con cien adentro,
cien asignaciones. Encima, `CAPACIDAD` se fija al compilar y el elemento que
no cabe detiene el programa. Esta sesión construye la otra implementación del
mismo contrato: cada elemento en su propio nodo, con la dirección del
siguiente, reservado con `new` y devuelto con `delete`. Insertar al frente
pasa a ser dos escrituras de puntero, y llegar a la posición `p` pasa a
costar `p` pasos. Con el arreglo que ya se tenía se ve además el primer
algoritmo de ordenamiento, insertion sort.

Al terminar, el objetivo es poder construir el TAD Lista con nodos
enlazados, explicar por qué `insertar` al frente baja a $\Theta(1)$ mientras
`obtener` sube a $\Theta(p)$, reconocer los dos errores que destruyen una
lista enlazada —empalmar en el orden equivocado y liberar un nodo todavía
enlazado—, y ordenar un arreglo con insertion sort escribiendo su invariante
y acotando lo que cuesta en tiempo y en espacio.

## Diapositivas

![](clase15.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Ejercicios interactivos

Seis actividades que se trabajan en el navegador, una por tema de la sesión,
en la [página de ejercicios interactivos](./Ejercicios.md). Los programas no
son los de la sesión: mismo tema, valores nuevos.

## Código de la sesión

- [nodo.cpp](codigo/nodo.cpp) — tres nodos enlazados a mano, el recorrido
  que sigue la cadena hasta `NULL` y la liberación que guarda el siguiente
  antes de borrar.
- [lista.h](codigo/lista.h) — el TAD Lista con nodos: `insertar`,
  `eliminar`, `obtener`, `asignar`, `agregar`, el destructor y el
  `nodoEn` privado que comparten las operaciones.
- [lista_uso.cpp](codigo/lista_uso.cpp) — el mismo programa que corría
  sobre la implementación con arreglo, sin cambiar una línea.
- [lista_cola.h](codigo/lista_cola.h) — la misma lista con un puntero al
  último nodo: `agregar` en $\Theta(1)$ y los dos casos que gana
  `eliminar`.
- [lista_cola_uso.cpp](codigo/lista_cola_uso.cpp) — las comprobaciones de
  los bordes: borrar el último y vaciar la lista.
- [frente.cpp](codigo/frente.cpp) — insertar al frente $n$ veces en cada
  estructura, contando lo que mueve cada una.
- [insertion.cpp](codigo/insertion.cpp) — insertion sort con el contador de
  corrimientos, sobre una entrada mezclada, una ordenada y una al revés.
- [contar_mayores.cpp](codigo/contar_mayores.cpp) — el recorrido con
  `obtener` del ejercicio en parejas, el que cuesta $\Theta(n^2)$ sobre la
  enlazada.

Se compilan con `g++ -Wall -Wextra`.

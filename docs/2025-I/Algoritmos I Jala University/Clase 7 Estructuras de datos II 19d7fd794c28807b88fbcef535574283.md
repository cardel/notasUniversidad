# Clase 7: Estructuras de datos II

# Colas de prioridad

Cola pero organizada de acuerdo a la prioridad de ser atendido, va primero siempre el que debe ser atendido con mayor urgencia

**Análogia**: Cuando llega un adulto mayor o una embarazada a una fila

- El elemento del tope de la cola es el que tiene la mayor prioridad
- Las operaciones que tenemos son las mismas que una cola
    - Encolar
    - Desencolar
- Esta estructura no se utiliza para búsquedas aleatorias

# Listas enlazadas

Una lista enlazada es una colección de nodos conectados entre sí utilizando punteros

- Raiz: puntero al primer elemento
- Un elemento consta punteros (ant y sig) y un valor en específico

---

Tipos de listas

- Listas simplemente enlazadas: anterior y valor.
- Listas doblemente enlazadas: anterior, siguiente y valor
- Listas simplemente enlazadas circulares. El siguiente ultimo elemento apunta al primero
- Listas doblemente enlazadas circulares: anterior del primero apunta al último y el siguiente del último apunta al primero

## Listas simplemente enlazadas

Caracteristicas

- Nodo raiz que un punto al primer elemento
- Cada nodo tiene un campo de información (valor) y un puntero al siguiente

---

Operaciones

- Recorrido: Empezar por la raiz, luego por el siguiente del nodo y así sucesivamente hasta encontrar el punto a null (ultimo)
- Búsqueda: Es análoga al recorrido, pero paramos si encontramos un valor deseado
- Inserción
    - Insertar de primero: Modificar la raiz y que el elemento apunte al que estaba de primero
    - Insertar al final: Modificar el puntero del ultimo y el nuevo elemento apunta a null
    - Insertar cuando esta vacía: Que la raiz apunta al primero
    - Insertar en medio de dos nodos: Anterior apunta al nuevo y el nuevo apunta al actual
- Eliminación: Modificar el puntero del anterior hacia el siguiente del actual, en caso de que sea el primero a eliminar la raíz apunta al siguiente de este elemento

---

Apuntes

- Ventajas: Facil de implementar, memoria dinamica y operaciones en la cabeza cuestan O(1)
- Desventajas: Acceso lento O(n)

## Listas simples circulares

Implementación

- Existe un nodo llamado cabeza que no tiene un valor, este va ser nuestra raíz, el primero es el siguiente de él
- Cuando la lista está vacía y se inserta un nodo, se crea la cabeza y el nuevo nodo como su siguiente
- Cuando vamos a eliminar un elemento de una lista que solo tiene la cabeza y el nodo, esta pasar ser null
- En otros aspectos es igual que las listas simplemente enlazadas

## Listas doblemente enlazadas

Caracteristicas

- Inicio: Primer elemento
- Fin: Apunta al ultimo elemento
- Nodo: anterior, siguiente, valor

---

Operaciones

- Inserción
    - Si la lista esta vacia, tanto inicio como fin apuntan al nuevo elemento
    - Si se inserta de primero, inicio va a apuntar a nuevo, el siguiente de nuevo va apuntar al que estaba de primero y el que estaba de primero anterior apunta a este nuevo
    - Si se inserta al final, el fin va apuntar a este nuevo. Anterior del nuevo apunta al que estaba de ultimo y el siguiente del que estaba de ultimo apunta a este nuevo.
    - En otro caso, tenemos anterior, actual, el siguiente del anterior apunta al nuevo, el anterior del actual apunta al nuevo. El anterior del nuevo apunta al anterior y el siguiente del nuevo apunta al actual.
- Recorrido: Puede hacerse de izquierda a derecha o viceversa
- Busqueda es igual que en simplemente enlazada
- Eliminación: Ajustes de los punteros en caso que se elimine el primero o el ultimo. Ajustar los punteros del anterior y del siguiente al actual.
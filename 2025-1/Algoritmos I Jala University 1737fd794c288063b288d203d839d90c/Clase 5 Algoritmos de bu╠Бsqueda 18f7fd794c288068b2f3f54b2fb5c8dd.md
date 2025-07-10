# Clase 5 Algoritmos de búsqueda

¿Que es búsqueda?

- Es una operación para encontrar uno o más elementos dentro de una estructura de datos (conjunto)
- Tiene diferentes aplicaciones: búsqueda de información en bases de datos, elección de decisiones en algoritmos de IA, explorar una recomendación de un producto

# Búsqueda lineal

Recorre el arreglo desde el inicio hasta el final y pregunta a cada uno de los elementos si es el que estamos buscando

- Mejor caso: O(1) el primer elemento es el que ando buscando
- Peor caso: O(n) el elemento no está o bien el ultimo
- Caso promedio: El elemento está en la posición n/2 ⇒ O(n)

---

# Búsqueda binaria

El arreglo está inicialmente ordenado y se pregunta por el elemento de la mitad, si el elemento a buscar es menor al que estamos buscando, entonces se busca en la parte izquierda, si es mayor en la parte derecha y si es igual se retorna el valor del indice

- La complejidad esta descrita por la ecuación

$$
T(n) = T(\frac{n}{2})+O(1)
$$

- O(1) sucede cuando tenemos que el elemento en la mitad (return mid) o bien no se encuentra (return -1)
- T(n/2) es que escogemos la parte izquierda o la parte derecha
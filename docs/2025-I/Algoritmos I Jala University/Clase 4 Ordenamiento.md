# Clase 4: Ordenamiento

# Ordenamiento

Cual es la tarea de ordenar

- Ubicar los elementos de un conjunto (tabla de BD, un arreglo, cualquier colección) en sus posiciones de acuerdo a algún criterio
- Elementos numericos: Ordenamiento ascendente (menor a mayor) o descendente (mayor a menor)
- Lexicografico (la codificación ASCII) se evalúa del primer caracter hacia el último, en caso de palabra de diferente tamaño que sean iguales se opta por indicar que la “menor” es la más corta

---

Aplicaciones

- Optimizar las búsquedas en diferentes ambitos
- Caso de dos iguales: Bruta O(n^2) por ordenar y luego buscar O(nlog(n))

# Algoritmos de ordenamiento

Bubble sort

- La idea del bubble sort es iterar los elementos cada vez y dejar el máximo en el fondo (en la última posición), el procedimiento se repite hasta que llegamos al tope O(n^2)

---

Counting Sort

- Llevar el conteo del número de elementos por el indice
- Irlos ubicando de acuerdo al conteo
- PERO: Condición números enteros positivos, max = k = O(n)
- Si se cumplen las condiciones la complejidad es O(n)

---

Insertion sort

- Arrancamos con el primer elemento suponiendo que es un arreglo ordenado
- Insertamos el segundo y dejamos ordenado
- Repetimos de la misma manera hasta el terminar el proceso
- Mejor caso O(n) arreglo ordenano
- Caso promedio (recorre de las mitad de las veces) O(n²)
- Peor caso: Ordenado inversamente O(n^2)

---

Mergesort

- Partimos por mitades siempre
- Llegamos hasta el caso trivial (arreglo de un elemento)
- La ganancia es que siempre pegamos (conquistamos) dos arreglos ordenados, obtener un arreglo ordenado a partir de ellos vale O(n)
- O(nlog(n))
- Es bueno en complejidad pero requiere estructuras de datos adicionales

---

Quicksort

- Partimos en base a un pivote
- Hacemos intercambios para que la izquierda del pivote queden menores o iguales y a la derecha queden mayores
- La ganancia está en que el pivote SIEMPRE va a quedar en la posición de su ordenamiento
- mejor caso: Arreglo que se parte por mitades O(nlog(n))
- caso promedio 1/4 y 3/4 O(nlog(n))
- Peor caso:  partición n-1 y 1, esto nos da O(n^2)
- Es el más utilizado porque se utilizan técnicas estadísticas para que el pivote produzca una buena partición (vegas tipo II)
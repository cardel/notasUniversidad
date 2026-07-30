# Descripción
Es un algoritmo de divide y vencerás
- Se selecciona un pivote (puede ser el primer elemento, el ultimo, uno aleatorio, un promedio, etc)
- Se busca de izquierda (inicio) a derecha (final)
	- Un elemento que sea mayor que el pivote
	- Un elemento que sea menor que el pivote
	- Se intercambian
	- Se repite este proceso hasta que se llega al final de la división (indice final)
- Se intercambia el pivote con el último del arreglo de la izquierda
- Tener presente que cuando el arreglo tiene tamaño 1 es caso trivial (caso base) es decir está ordenado
**Importante:** Después de este proceso el pivote queda en su posición final (ordenado) a esto se le conoce como ordenamiento parcial (ganancia del algoritmo)

## Esquema particiones

```mermaid
flowchart TD
    A[Inicio: 45,20,25,1,13,81,29,42,31,2,4,4,5,7,18] --> B["Pivote = 45 (primer elemento)"]
    B --> C["Recorrer izquierda a derecha:
    - Buscar > pivote (81)
    - Buscar < pivote (20)
    - Intercambiar"]
    C --> D[20,45,25,1,13,81,29,42,31,2,4,4,5,7,18]
    D --> E["Continuar recorrido:
    - Siguiente > pivote (81 ya marcado)
    - Siguiente < pivote (25)
    - Intercambiar"]
    E --> F[20,25,45,1,13,81,29,42,31,2,4,4,5,7,18]
    F --> G["... proceso continúa ..."]
    G --> H[20,25,1,13,29,42,31,2,4,4,5,7,18,45,81]
    H --> I["Pivote 45 en posición final"]
    I --> J["Dividir en subarreglos:
    - Izquierda: 20,25,1,13,29,42,31,2,4,4,5,7,18
    - Derecha: 81"]
    J --> K["Repetir proceso para cada subarreglo"]
```

## Ejemplo general

```mermaid
graph TD

A[Inicio: 20, 25, 1, 13, 81, 29, 42, 31, 2, 4, 4, 5, 7, 18] --> B[Particion con pivote 20 - Menores: 18, 1, 13, 7, 2, 4, 4, 5 - Mayores: 29, 42, 31, 81, 25]

B --> C1[Izquierda de 20 - pivote 18 - Menores: 1, 5, 13, 7, 2, 4, 4]
C1 --> D1[Izquierda de 18 - pivote 1 - Mayores: 5, 13, 7, 2, 4, 4]
D1 --> E1[Derecha de 1 - pivote 5 - Menores: 4, 2, 4 - Mayores: 13, 7]
E1 --> F1[Izquierda de 5 - pivote 4 - Menores: 2 - Mayores: 4]
E1 --> G1[Derecha de 5 - pivote 13 - Menores: 7]
C1 --> H1[Derecha de 18 vacia]

B --> C2[Derecha de 20 - pivote 29 - Menores: 25 - Mayores: 42, 31, 81]
C2 --> D2[Derecha de 29 - pivote 42 - Menores: 31 - Mayores: 81]

```

# Notas sobre complejidad

- El pivote debe ser cercano a la mediana (no es lo que promedio) para que queden dos arreglos de tamaño n/2, dando la misma complejidad del algoritmo merge sort O(nlog(n)) La mediana es el elemento que ordenando va en la mitad.
- El pero es caso es cuando nos quedan dos particiones
	- Una con n-1 elementos
	- Otra un elemento
	- $$T(n) = T(n-1) + O(n)$$
	- Resolver esto nos da $O(n^2)$
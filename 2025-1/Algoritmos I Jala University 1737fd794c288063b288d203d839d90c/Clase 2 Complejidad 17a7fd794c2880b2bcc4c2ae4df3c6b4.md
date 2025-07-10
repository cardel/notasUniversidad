# Clase 2 Complejidad

# Caracteristicas del problema

Cuales caracteristicas

- Entradas: Dominio (unos datos válidos)
- Proceso (que se hace con ellas)
- Tipos de problemas: Optimización (buscar la mejor solución), Solución/Busqueda (hallar un valor), Ordenamiento, etc

---

Dominio del problema

Caracteristicas de los datos (entrada) del problema

- Números enteros: pequeños
- Números enteros: grandes
- Números decimales
- Cadenas de texto
- Booleanos
- Estructuras de datos (arreglos, listas, etc)
- Objetos

Este dominio nos va a indicar **cuáles tipos de datos en nuestro lenguaje son los más apropiados para resolver el problema.**

---

Tamaño del problema 

Indican que tan grande es la instancia (entrada válida) debemos procesar

- En el caso de un arreglo es el número de elementos
- En el caso de un arreglo o un arreglo bidimensional es el número de filas por el número de columnas

Vamos a utilizar la variable n para representar este tamaño (en la mayoría de casos)

---

Funciones matemáticas

- La(s) entrada(s) pertenecen al dominio (instancias, cumplen alguna condición, por ejemplo ser números enteros)
- La salida f(x) cumple con alguna condición de pertenencia al codominio (los valores que tenemos de salida)
- Las funciones en un computador pueden recibir tipos de datos adicionales a los numericos

---

Secuencias y sumatorias

- Secuencia es un conjunto ordenado de números que cumplen cierta condición
    - Aritmetica, donde la diferencia es la misma 3,5,7,9,11,13,…
    - Geometrica, donde la división entre un elemento y su anterior da el mismo valor 2,4,8,16,32,64, ….
    
    Aquí hay ejemplos de ambos tipos de secuencias:
    
    **Secuencia Aritmética**: 3, 5, 7, 9, 11, 13, ... - donde la diferencia entre cada número consecutivo es siempre la misma (en este caso, 2)
    
    **Secuencia Geométrica**: 2, 4, 8, 16, 32, 64, ... - donde la división entre un elemento y su anterior siempre da el mismo valor (en este caso, 2)
    
    - Series: Suma de los elementos de las secuencias
    

# Complejidad temporal y la complejidad espacial

Complejidad temporal (Es el más critico)

Tiempo que se tarda un algoritmo en resolver un problema

---

Complejidad espacial

El espacio en memoria (RAM, disco duro, red, etc) que requiere un algoritmo para resolver un problema

## Cálculo de complejidad

- Las operaciones basicas como sumas, asignaciones, etc toman 0(1)
- En los ciclos tomar en cuenta que se debe preguntar la condición de saida, por ello tomará uno más
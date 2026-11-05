# Ejercicios · Refuerzo PUJ 7 de noviembre

Actividades para trabajar en el navegador los temas de la
[sesión del 7 de noviembre](./7%20de%20noviembre.%20Recursi%C3%B3n,%20colas%20y%20diccionarios.md).

## Recursión sobre un árbol

### [movil](../../../actividades/ayg-puj/recursion/movil.html){ target=_blank rel=noopener }

UVa 839: seguir la función recursiva lectura por lectura, con el móvil
dibujado a la izquierda y la pila de llamadas a la derecha. En cada barra se
elige el caso, y en cada retorno se escribe el peso y si está en equilibrio.

### [llamadas](../../../actividades/estructuras-de-datos/recursion-arboles/llamadas.html){ target=_blank rel=noopener }

`contarPares` sobre un árbol de cinco nodos: lo que devuelve cada llamada, la
pila marco por marco y cuántos marcos conviven.

### [costos de un recorrido](../../../actividades/estructuras-de-datos/recursion-arboles/costos.html){ target=_blank rel=noopener }

Llamadas, altura y marcos en árboles llenos y degenerados, y cuántos marcos
caben en una pila de 1 MB.

### [columnas](../../../actividades/estructuras-de-datos/recorridos-arbol/columnas.html){ target=_blank rel=noopener }

Un árbol que llega en preorden con $-1$ en cada vacío, leído número por número,
y la suma de los datos de cada columna. Es la forma de la entrada de UVa 699.

## Pilas y colas

### [disciplinas](../../../actividades/estructuras-de-datos/tad-lista-pila-cola/disciplinas.html){ target=_blank rel=noopener }

Seis situaciones, entre ellas una impresora compartida: decir qué disciplina
de atención le sirve a cada una.

### [con una cola](../../../actividades/estructuras-de-datos/ejercicios-tad-lista-pila-cola/cola.html){ target=_blank rel=noopener }

Tres situaciones donde importa el orden de llegada. La primera es una baraja
que descarta una carta y pasa la siguiente al fondo, como en UVa 10935.

### [con una pila](../../../actividades/estructuras-de-datos/ejercicios-tad-lista-pila-cola/pila.html){ target=_blank rel=noopener }

Dos problemas donde importa lo último que llegó.

### [dos clases](../../../actividades/estructuras-de-datos/contenedores-list-deque-stack-queue/dosclases.html){ target=_blank rel=noopener }

Una mesa de ayuda que atiende primero los bloqueos y después las consultas:
qué se imprime y qué cuesta una fila única contra dos colas.

### [vaciar por el frente](../../../actividades/estructuras-de-datos/contenedores-list-deque-stack-queue/vaciar.html){ target=_blank rel=noopener }

Tiempos medidos de sacar $n$ elementos por el frente de un `vector`, un `deque`
y una `list`, primero con la predicción y después con las cifras.

## Diccionarios y conjuntos

### [palabras](../../../actividades/estructuras-de-datos/contenedor-map/palabras.html){ target=_blank rel=noopener }

Un `map` de palabras fila por fila y su recorrido en orden alfabético.

### [combinacion](../../../actividades/estructuras-de-datos/contenedor-map/combinacion.html){ target=_blank rel=noopener }

Cursos ordenados y pegados en una clave, y cuántos estudiantes ganan cuando hay
empate. Es la idea de UVa 11286.

### [tabla hash o map](../../../actividades/estructuras-de-datos/contenedor-map/elegir.html){ target=_blank rel=noopener }

Cuántas comparaciones hace el `map` y qué estructura conviene en cuatro
situaciones.

### [buscar en una tabla hash](../../../actividades/estructuras-de-datos/tabla-hash/buscar.html){ target=_blank rel=noopener }

Cuántas comparaciones hace cada búsqueda con encadenamiento y qué puntero
cambia al eliminar.

### [el hash de una cadena](../../../actividades/estructuras-de-datos/tabla-hash/cadenas.html){ target=_blank rel=noopener }

La suma de los códigos y el polinomio en base 31 sobre `mar` y `ram`: la suma
no ve el orden, y toda palabra choca con sus anagramas.

### [qué contenedor](../../../actividades/estructuras-de-datos/contenedor-set/elegir.html){ target=_blank rel=noopener }

Cinco situaciones para escoger entre `set`, `map`, `unordered_map` y un vector
ordenado.

## Costo

### [tamano](../../../actividades/estructuras-de-datos/ejercicios-complejidad/tamano.html){ target=_blank rel=noopener }

Ocho soluciones de juez, entre ellas la de UVa 839: decir de qué variable
depende el tamaño, cuántas veces corre cada ciclo o llamada, el total en $O$ y
si alcanza contra los límites del enunciado.

## Invariantes de ciclo

### [sumar](../../../actividades/ayg-puj/recursion/sumar.html){ target=_blank rel=noopener }

La suma de un arreglo: predecir qué devuelve, mirar la traza de estados y
encontrar los invariantes $I_0$ e $I_1$, que se demuestran con
inicialización, estabilidad y terminación.

### [credito](../../../actividades/ayg-puj/invariantes/credito.html){ target=_blank rel=noopener }

UVa 11078: los invariantes del mayor y de `mejor`, con el mayor llamado
`maximo`. Al elegir un candidato errado, la traza marca en rojo el chequeo
donde falla.

### [mayores](../../../actividades/ayg-puj/invariantes/mayores.html){ target=_blank rel=noopener }

El mayor y el segundo mayor en un recorrido: ninguno de los dos invariantes se
demuestra por separado, y un arreglo con todos los valores iguales decide cómo
escribir el del segundo.

### [tramo](../../../actividades/ayg-puj/invariantes/tramo.html){ target=_blank rel=noopener }

UVa 507 sin el desempate: los invariantes de `suma` y de `mejor`. Trae la
respuesta del ejercicio en papel, así que va después de intentarlo.

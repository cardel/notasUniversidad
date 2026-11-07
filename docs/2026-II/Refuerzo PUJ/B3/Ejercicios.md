# Ejercicios · Refuerzo PUJ 7 de noviembre

Actividades para trabajar en el navegador los temas de la
[sesión del 7 de noviembre](./7%20de%20noviembre.%20Bisecci%C3%B3n%20y%20recorridos%20en%20grafos.md).
Las actividades de `tope`, `palitos` y la escalera corren el código de los tres
problemas que se resuelven en clase.

## Cómo se plantea la solución

### [repartir textos entre empleados](../../../actividades/ayg-puj/busqueda-binaria/turnos.html){ target=_blank rel=noopener }

Bisección sobre la respuesta: preguntas de planteamiento, y después se mueven `lo` y `hi` sobre la fila de textos hasta 1700.

### [una rejilla con zonas prohibidas](../../../actividades/ayg-puj/grafos-implicitos/zonas.html){ target=_blank rel=noopener }

Se marcan las zonas con la distancia euclidiana y se avanza el frente de la cola sobre el tablero, decidiendo qué vecinas entran.

### [dos colores](../../../actividades/ayg-puj/representaciones-y-recorridos/colores.html){ target=_blank rel=noopener }

Se escoge el color de cada nodo con la pila de llamadas a la vista, hasta ver el choque en el triángulo y el pedazo que queda sin mirar.

## Recorrido en amplitud con tope de pasos

### [el recorrido con tope de pasos](../../../actividades/ayg-puj/representaciones-y-recorridos/tope.html){ target=_blank rel=noopener }

UVa 336, el problema de la hora 2, sobre las dos redes de la muestra. Se predice
cuántos nodos quedan por fuera y después corre el código de la sesión, con la cola y
las distancias a la vista. Una tarjeta aplica a la misma consulta tres errores:
expandir un nodo a distancia TTL, marcar al sacar de la cola y consultar un nodo
ausente.

### [amplitud](../../../actividades/ayg-puj/representaciones-y-recorridos/amplitud.html){ target=_blank rel=noopener }

El vértice más lejano del arranque, con un color por capa: por qué la primera vez que
la búsqueda toca a alguien es siempre por el camino más corto.

## Recorrido en profundidad y ciclos

### [los tres estados y los ciclos](../../../actividades/ayg-puj/orden-topologico-dfs-low/palitos.html){ target=_blank rel=noopener }

UVa 11686, el problema de la hora 3. En cada arista se decide si cierra un ciclo, con
el diamante y con un grafo que tiene uno, y una respuesta equivocada explica qué
mirar. Después corre la función `dfs` de la sesión, y una tabla muestra en qué grafos
responde mal quien lleva solo dos estados.

### [topodfs](../../../actividades/ayg-puj/orden-topologico-dfs-low/topodfs.html){ target=_blank rel=noopener }

El orden topológico con la profundidad, en sus formas recursiva y con pila explícita,
sobre otros cuatro grafos.

## Bisección: encontrar la función

### [la escalera y el factor de fuerza](../../../actividades/ayg-puj/busqueda-binaria/escalera.html){ target=_blank rel=noopener }

UVa 12032, el problema de la hora 1. Se predice la fuerza mínima mirando la
escalera y después corre el código de la sesión, las dos funciones: la que
simula la subida, que es la función de decisión, y la que la bisecta. Cuatro
escaleras, entre ellas una donde la respuesta no es el salto más grande.

### [buscar](../../../actividades/ayg-puj/busqueda-binaria/buscar.html){ target=_blank rel=noopener }

La búsqueda binaria sobre un arreglo ordenado, división por división, con las
posiciones descartadas tachándose. Es la mecánica que después se aplica sobre
una función de decisión en vez de sobre un arreglo.

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

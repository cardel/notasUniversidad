# Ejercicios · Refuerzo PUJ B2

Diez actividades para trabajar en el navegador lo que se vio en el
[bloque 2](./Bloque%202.%20Conteo%20y%20recursi%C3%B3n.md). Las seis primeras
cuentan línea a línea: ciclos que dependen del anterior, un índice que se
duplica, un caso que depende de los datos, bloques en secuencia y el triple
ciclo de UVa 12149. Las dos siguientes siguen la recursión de UVa 839 y de
UVa 11173 llamada por llamada, con la pila a la vista. Las dos últimas van con
la hora de lógica: el costo de una recurrencia sumado por niveles y la
demostración de que una suma es correcta.

## Conteo de operaciones

### [triangulo](../../../actividades/estructuras-de-datos/ciclos-dependientes-sumatorias/triangulo.html){ target=_blank rel=noopener }

El ciclo interno va de 0 a $i - 1$, así que su cuerpo corre 0, 1, 2, …
veces. Se predice el conteo, se ejecuta paso a paso y la escalera de casillas
lleva a $n(n-1)/2$ con el truco de Gauss.

### [suma_parejas](../../../actividades/estructuras-de-datos/ciclos-dependientes-sumatorias/suma_parejas.html){ target=_blank rel=noopener }

Aquí $j$ arranca en $i$ y recorre las parejas con $i \le j$: el número de
vueltas baja de $n$ a 1 en lugar de subir. La escalera queda al revés y el
total es $n(n+1)/2$.

### [potencias](../../../actividades/estructuras-de-datos/ciclos-dependientes-sumatorias/potencias.html){ target=_blank rel=noopener }

El índice se duplica en cada vuelta. Con $n$ de 10 a 1000 se ve que
multiplicar $n$ por 10 suma tres o cuatro vueltas, y el conteo queda en
$\lfloor \log_2 n \rfloor + 1$.

### [todos_positivos](../../../actividades/estructuras-de-datos/ejercicios-complejidad/todos_positivos.html){ target=_blank rel=noopener }

La función corta apenas encuentra un valor que no es positivo. Cambiando el
signo de las casillas se ve que un mismo $n$ cuesta distinto según los datos,
y la tabla separa el mejor caso del peor.

### [combinado](../../../actividades/estructuras-de-datos/ejercicios-complejidad/combinado.html){ target=_blank rel=noopener }

Tres bloques seguidos: buscar el mayor, contar las parejas que lo superan y
duplicar hasta llegar a $n$. Los conteos se suman, y con $n$ grande el bloque
cuadrático deja atrás a los otros dos.

### [feynman](../../../actividades/estructuras-de-datos/ciclos-dependientes-sumatorias/feynman.html){ target=_blank rel=noopener }

UVa 12149: contar a mano, lado por lado, dónde cabe cada cuadrado en una
cuadrícula de $N \times N$, y después las vueltas de cada línea del triple
ciclo. El cambio de variable lleva a $\sum k^2 = N(N+1)(2N+1)/6$.

## Recursión

### [movil](../../../actividades/ayg-puj/recursion/movil.html){ target=_blank rel=noopener }

UVa 839: el móvil se dibuja a medida que la función lo lee, con la pila de
llamadas al lado. En cada lectura se decide si es caso base o recursivo, y en
cada retorno se escribe el peso y si está en equilibrio.

### [grey](../../../actividades/ayg-puj/recursion/grey.html){ target=_blank rel=noopener }

UVa 11173: bajar por las mitades del rango $[ini, fin)$ escribiendo en cada
nivel el bit, el nuevo rango y la posición reflejada. La lista completa de
$2^n$ códigos aparece solo al final, para comprobar.

## Lógica

### [arbol](../../../actividades/ayg-puj/recurrencias/arbol.html){ target=_blank rel=noopener }

Para $T(n) = T(n-1) + c$, $T(n) = T(n/2) + c$ o $T(n) = 2T(n/2) + cn$, se
llena nivel por nivel cuántos nodos hay y cuánto trabaja cada uno. El total
se compara con la sustitución y termina en su clase $\Theta$.

### [sumar](../../../actividades/ayg-puj/recursion/sumar.html){ target=_blank rel=noopener }

La suma de un arreglo con un ciclo: en la traza de estados se buscan las dos
propiedades que ninguna vuelta rompe y con ellas se arma la demostración de
correctitud. Sirve para comparar con la inducción sobre la versión recursiva.

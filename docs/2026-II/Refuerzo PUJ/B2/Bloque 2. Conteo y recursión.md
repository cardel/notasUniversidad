# Bloque 2 · Refuerzo PUJ

**Conteo y recursión.** Tres horas de programación: contar línea a línea
cuántas veces corre cada instrucción, la recursión con su árbol de llamadas y
la recursión por índices con su costo. La hora de lógica demuestra por
inducción las fórmulas del conteo y la correctitud de una función recursiva, y
resuelve las recurrencias del costo.

## Diapositivas

### Programación

![](./Programacion.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

### Lógica

![](./Logica.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Problemas en clase

### Hora 5. UVa 12149, Feynman

- Enunciado: <https://onlinejudge.org/external/121/12149.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=3301>

Se pide cuántos cuadrados distintos hay en una cuadrícula de $N \times N$,
con $N \le 100$ y un 0 que cierra la entrada. Un cuadrado de lado $\ell$ queda
fijo por su esquina de arriba a la izquierda, que cabe en $N - \ell + 1$ filas
y en otras tantas columnas. El triple ciclo sobre el lado, la fila y la
columna de la esquina corre su cuerpo una vez por cuadrado, así que contar sus
vueltas es resolver el problema: congelando el lado y sumando,
$\sum_{m=1}^{N} m^2 = N(N+1)(2N+1)/6$, que con $N = 8$ da el 204 de la
muestra. La trampa está en los bordes del ciclo: si la esquina llega solo
hasta $N - \ell$, con $N = 8$ salen 140.

### Hora 6. UVa 839, Not so Mobile

- Enunciado: <https://onlinejudge.org/external/8/839.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=780>

Cada barra llega en una línea `Wl Dl Wr Dr`, y un peso 0 indica que de ese
extremo cuelga un submóvil descrito en las líneas siguientes, primero el
izquierdo y luego el derecho. El extremo con objeto es el caso base y el de
peso 0 el caso recursivo: la función lee una barra, se llama una vez por cada
submóvil y devuelve el peso total y si todo lo que cuelga está en equilibrio.
El árbol de llamadas es el mismo móvil. La trampa es dejar de leer cuando ya
se sabe que la respuesta es `NO`: las líneas que quedan se leerían como el
caso siguiente. Tampoco basta con revisar la barra de arriba, y la línea en
blanco va entre casos, no después del último.

### Hora 7. UVa 11173, Grey Codes

- Enunciado: <https://onlinejudge.org/external/111/11173.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=2114>

Se pide el número en la posición $k$ del código de Gray reflejado de $n$
bits, con $n \le 30$ y hasta 250 000 casos. Construir la lista son $2^n$
números por caso. La recursión trabaja sobre el rango de posiciones
$[ini, fin)$: si $k$ cae en la mitad de arriba el bit es 0 y se sigue en esa
mitad; si cae en la de abajo el bit es 1 y se sigue en la de arriba con la
posición reflejada $ini + fin - 1 - k$. El costo es $T(m) = T(m/2) + c$, que con
$m = 2^n$ son $n + 1$ llamadas por caso. La trampa es restar la mitad
en lugar de reflejar: así la función devuelve $k$ tal cual. Las posiciones
empiezan en 0.

## Lógica

Las sumatorias del conteo, $\sum 1 = n$, $\sum i = n(n+1)/2$ y $\sum i^2$,
demostradas por inducción, con una fórmula falsa cuyo paso funciona y cuya
base falla. Después, la correctitud de una función recursiva por inducción
sobre el tamaño del rango $m = fin - ini$, y la inducción fuerte cuando las
llamadas reciben $\lfloor m/2 \rfloor$ y $\lceil m/2 \rceil$. Al final, plantear
$T(n)$ por casos del código y resolver $T(n) = T(n-1) + c$,
$T(n) = T(n/2) + c$ y $T(n) = 2T(n/2) + cn$ por sustitución repetida y con el
árbol de recursión, para comprobar luego la solución por inducción. La
recurrencia de UVa 839, $T(n) = T(a) + T(b) + c$ con $a + b = n - 1$, da $cn$
sea cual sea la forma del móvil.

## Tarea

Se resuelve antes del bloque 3 y se envía al juez; la revisión abre ese
bloque.

### Base. UVa 10079, Pizza Cutting

- Enunciado: <https://onlinejudge.org/external/100/10079.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1020>

El corte número $n$ cruza a los $n - 1$ anteriores en puntos distintos y por
eso agrega $n$ trozos: $T(n) = T(n-1) + n$ con $T(0) = 1$, que da
$n(n+1)/2 + 1$. Un ciclo que sume hasta $N$ hace hasta $2{,}1 \times 10^8$
vueltas por consulta; la fórmula responde en $O(1)$. El resultado pasa de
32 bits, $N = 0$ da 1 y la entrada termina con cualquier número negativo.

### Intermedio. UVa 913, Joana and the Odd Numbers

- Enunciado: <https://onlinejudge.org/external/9/913.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=854>

La fila con $N$ números es la $k = (N+1)/2$, y hasta su final hay
$1 + 3 + \cdots + (2k-1) = k^2$ impares escritos, así que el último es
$L = 2k^2 - 1$ y los tres últimos suman $3L - 6$. Con $N = 3$ da 15, como en
la muestra. La respuesta llega a unos $1{,}5 \times 10^{18}$: en C++ el
producto $k \cdot k$ se hace en `long long` desde el principio.

### Exigente. UVa 620, Cellular Structure

- Enunciado: <https://onlinejudge.org/external/6/620.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=561>

Una cadena sana es `A`, una sana seguida de `AB`, o `B` seguida de una sana y
de `A`. La función recibe la cadena con sus dos límites y mira los extremos:
la última letra decide qué forma se intenta, así que cada nivel hace a lo más
una llamada y $T(n) = T(n-2) + c$ queda lineal. Copiar la subcadena en cada
llamada lleva el total a $\Theta(n^2)$. El interior nunca es vacío: `AB` y `BA`
son mutantes, mientras que `BAA` es mutagénica.

## Para seguir

- [Soluciones de los seis problemas](./Soluciones.md), con la idea, la
  complejidad y el código en Python y C++.
- [Ejercicios interactivos](./Ejercicios.md) sobre el conteo de ciclos, el
  árbol de llamadas y el costo de una recurrencia.

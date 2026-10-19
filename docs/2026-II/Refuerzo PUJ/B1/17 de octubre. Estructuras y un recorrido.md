# 17 de octubre · Refuerzo PUJ

**Arreglos y matrices.** Tres horas de programación sobre recorridos de
arreglos y matrices, y una de lógica sobre proposiciones y predicados.

## Diapositivas

### Programación

![](./Programacion.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

### Lógica

![](./Logica.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Sesiones

- [Sesión 1. Estructuras, costos y UVa 11078](./Notas.%20Estructuras,%20costos%20y%20UVa%2011078.md):
  la lectura de la entrada, el costo de cada operación, cómo están hechas las
  estructuras de la biblioteca estándar, el máximo que se arrastra y UVa 11078
  en un recorrido.
- [programacion-anotada.pdf](./programacion-anotada.pdf){ target=_blank rel=noopener }:
  el deck de programación con lo escrito durante la sesión y tres hojas de
  tablero.
- [Videos de la sesión](https://www.youtube.com/playlist?list=PLKsjj1jEesqU){ target=_blank rel=noopener },
  en la lista de reproducción del refuerzo.

## Problemas en clase

### UVa 11078, Open Credit System

- Enunciado: <https://onlinejudge.org/external/110/11078.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=2019>

Se busca el mayor valor de $a_i - a_j$ con $i < j$, donde el índice menor es
el estudiante más antiguo. El parámetro es la posición $j$: para cada una, la
mejor resta usa el máximo de $a_0, \ldots, a_{j-1}$, y ese máximo se actualiza
al avanzar. Basta un recorrido; el doble ciclo revisa unos $5 \times 10^9$
pares en un caso con $n = 100\,000$, y la entrada trae varios. La trampa está
en la muestra: con una secuencia creciente la respuesta es $-1$, así que el
máximo arranca en la primera resta y no en 0.

## El mejor tramo y las matrices con acumulados

El mejor tramo de un arreglo y las matrices con acumulados se resuelven en la
[sesión del 24 de octubre](../B2/24%20de%20octubre.%20Tramos,%20matrices,%20recursi%C3%B3n%20e%20invariantes.md), con el costo de cada solución. Aquí quedan los dos
problemas con su consejo.

### UVa 507, Jill Rides Again

- Enunciado: <https://onlinejudge.org/external/5/507.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=448>

Cada ruta trae $s - 1$ valores, uno por tramo entre paradas, y se pide el
tramo continuo de mayor suma. El parámetro es el valor donde termina el tramo.
El mejor que acaba ahí extiende al que acababa en el anterior, salvo cuando
esa suma ya es negativa: entonces conviene empezar de nuevo. Se reinicia con
suma negativa y no con cero, porque un prefijo de suma cero alarga el tramo
sin cambiar su valor, y el enunciado desempata por el tramo más largo. Las
paradas se numeran desde 1, así que el tramo que va del valor $i$ al $j$ se
imprime entre las paradas $i$ y $j+1$. Si la mejor suma no es positiva, la
salida es `Route r has no nice parts`.

### UVa 108, Maximum Sum

- Enunciado: <https://onlinejudge.org/external/1/108.pdf>
- Envío: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=44>

La matriz es de $N \times N$, con $N \le 100$, y se pide el subrectángulo de
mayor suma. Probar cada rectángulo con acumulados en dos dimensiones cuesta
$O(N^4)$. Lo que baja el costo es fijar la fila de arriba y la de abajo: con
ellas fijas, la suma de cada columna entre las dos forma un arreglo de $N$
valores, y el mejor rectángulo con esas filas es el mejor tramo de ese
arreglo, el problema de UVa 507. El total queda en $O(N^3)$. Los $N^2$
números llegan repartidos en líneas cualesquiera, así que se leen de corrido;
y si todo es negativo la respuesta es negativa, porque el rectángulo tiene al
menos una celda.

## Lógica

Proposiciones y conectivos, la implicación con su recíproca y su
contrarrecíproca, y cuantificadores con su dominio y el rango de los índices.
El ejercicio de la hora es traducir propiedades a fórmula: que todos los
elementos del arreglo son positivos, que el arreglo está ordenado, que un
valor aparece en un rango. Con eso se lee la definición que Árboles y Grafos
usa desde el comienzo: $f \in O(g)$ cuando existen $c > 0$ y $k \geq 0$
tales que $f(n) \leq c\,g(n)$ para todo $n \geq k$.

## Tarea

La tarea de estos temas es la de la [sesión del 24 de octubre](../B2/24%20de%20octubre.%20Tramos,%20matrices,%20recursi%C3%B3n%20e%20invariantes.md#tarea): UVa 100, 10189
y 620.

## Para seguir

- [Soluciones](./Soluciones.md) de UVa 11078, 507 y 108, y de UVa 100, 10189
  y 10920, con la idea, la complejidad y el código en Python y C++.
- [Ejercicios interactivos](./Ejercicios.md) sobre recorridos, acumulados y
  el costo de cada operación.

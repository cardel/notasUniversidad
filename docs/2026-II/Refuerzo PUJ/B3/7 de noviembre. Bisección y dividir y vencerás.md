# 7 de noviembre · Refuerzo PUJ

**Bisección y dividir y vencerás.** Las tres horas de programación apoyan los
temas prácticos del parcial 1 de Árboles y Grafos. La primera es cómo se
encuentra la función de decisión, con el punto 1 del parcial como ejemplo
trabajado y UVa 12032 como ejercicio; la segunda, qué hacer cuando la función
ya viene escrita, con UVa 10341; la tercera, cómo se plantea dividir y vencerás
y de dónde sale la recursión, con UVa 10810. En la hora de lógica se plantean
los invariantes de ciclo de UVa 11078 y queda en papel el ejercicio de UVa 507.

La sesión empieza con la revisión de la
[tarea del 24 de octubre](../B2/24%20de%20octubre.%20Tramos,%20matrices,%20recursi%C3%B3n%20e%20invariantes.md#tarea).

## Diapositivas

### Programación

![](./Programacion.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

### Lógica

![](./Logica.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

### Soluciones de programación

Las soluciones de UVa 12032, UVa 10341 y UVa 10810.

![](./Soluciones-programacion.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

### Soluciones de lógica

La traza, los invariantes y los tres pasos del ejercicio de UVa 507.

![](./Soluciones-logica.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Archivos de lectura

Cada problema de clase tiene un programa que lee la entrada e imprime lo que
leyó, sin resolver nada. Están en la carpeta
[codigo](https://github.com/cardel/notasUniversidad/tree/master/docs/2026-II/Refuerzo%20PUJ/B3/codigo)
de esta sesión:

| Problema | Python | C++ |
|---|---|---|
| UVa 12032 | [lectura_12032.py](./codigo/lectura_12032.py) | [lectura_12032.cpp](./codigo/lectura_12032.cpp) |
| UVa 10341 | [lectura_10341.py](./codigo/lectura_10341.py) | [lectura_10341.cpp](./codigo/lectura_10341.cpp) |
| UVa 10810 | [lectura_10810.py](./codigo/lectura_10810.py) | [lectura_10810.cpp](./codigo/lectura_10810.cpp) |

Se copia la muestra del enunciado en `1.in` y su salida en `1.out`, y se corre
el archivo de lectura para ver en qué orden llega la entrada. Después se
cambian sus impresiones por la solución y se compara contra la muestra:

```text
g++ -std=c++17 -Wall -Wextra lectura_12032.cpp -o solucion
./solucion < 1.in > salida.out
diff salida.out 1.out

python3 lectura_12032.py < 1.in > salida.out
diff salida.out 1.out
```

Si `diff` no imprime nada, las dos salidas coinciden y el programa ya se puede
enviar al juez. El juez corre una versión antigua de Python 3, así que la
salida se arma con `print` y `%`, como en los archivos de lectura.

## Problemas en clase

Cada problema cierra con su costo: de qué depende el tamaño de la entrada,
cuántas veces corre cada ciclo y el total en $O$ frente a los límites del
enunciado.

### Hora 1. UVa 12032, The Monkey and the Oiled Bamboo

- Enunciado y envío: <https://vjudge.net/problem/UVA-12032>
- Actividad: [la escalera y el factor de fuerza](../../../actividades/ayg-puj/busqueda-binaria/escalera.html){ target=_blank rel=noopener }

Una escalera tiene $n$ peldaños a alturas $r_1 < \dots < r_n$ y se sube de uno
en uno. Se arranca con un factor de fuerza $k$: ningún salto puede medir más de
$k$, y el salto que mide exactamente $k$ baja el factor en uno. Se pide el menor
$k$ con el que se llega arriba.

Buscar el mínimo directamente obliga a razonar sobre todos los saltos a la vez.
La pregunta que sí se contesta de una pasada es la otra, *¿se llega arriba
empezando con fuerza $k$?*, y se responde simulando la subida. Es monótona,
porque con $k+1$ ningún salto que cabía deja de caber, así que los candidatos
quedan partidos en dos tramos y lo que se busca es el borde. Los límites son el
salto más grande, que hay que dar, y ese mismo más $n$, porque cada salto baja
la fuerza a lo sumo en uno.

Costo: cada vuelta de la bisección recorre los saltos una vez, y hay
logarítmicas vueltas en el rango de $k$, de modo que es
$\Theta(n \log(\max s_i + n))$ por caso.

### Hora 2. UVa 10341, Solve It

- Enunciado y envío: <https://vjudge.net/problem/UVA-10341>
- Actividad: [resolver un problema de juez](../../../actividades/ayg-puj/busqueda-binaria/resolver.html){ target=_blank rel=noopener }

Dados seis enteros con $0 \leq p, r \leq 20$ y $-20 \leq q, s, t \leq 0$, se
busca $x$ en $[0,1]$ con
$p e^{-x} + q \sin x + r \cos x + s \tan x + t x^2 + u = 0$, con cuatro
decimales, o `No solution` si no hay.

Aquí la función viene dada y lo que queda es comprobarle dos cosas. La monotonía
sale de derivar: cada sumando de
$f'(x) = -p e^{-x} + q \cos x - r \sin x + s \sec^2 x + 2tx$ es menor o igual
que cero en $[0,1]$ por los rangos del enunciado, así que $f$ no crece y hay a
lo sumo una raíz. Y los extremos deciden si existe: hay raíz exactamente cuando
$f(0) \geq 0 \geq f(1)$. Esa es la trampa, porque sin esa comprobación el ciclo
igual termina y devuelve un número que no es raíz de nada. Cien vueltas dejan el
intervalo en $2^{-100}$ del original.

Costo: cien evaluaciones por caso, o sea constante; con hasta 2100 líneas de
entrada el total es lineal en la cantidad de casos.

### Hora 3. UVa 10810, Ultra-QuickSort

- Enunciado y envío: <https://vjudge.net/problem/UVA-10810>
- Actividad: [contar parejas fuera de orden](../../../actividades/ayg-puj/recursion/inversiones.html){ target=_blank rel=noopener }

Dada una lista de $n < 500\,000$ enteros distintos, se pide cuántos
intercambios de elementos vecinos hacen falta para dejarla ordenada. Como cada
intercambio arregla exactamente una pareja fuera de orden, lo que se pide es el
número de parejas $(i,j)$ con $i<j$ y $a_i > a_j$, y contarlas una por una
cuesta $\Theta(n^2)$.

Las parejas de un tramo se reparten en tres clases: las dos puntas en la mitad
izquierda, las dos en la derecha, y una en cada mitad. Las dos primeras son el
mismo problema sobre la mitad del tamaño, y ahí está la recursión; el caso base
es un tramo de un elemento. La tercera se cuenta mientras se mezclan las dos
mitades ya ordenadas: cuando sale un elemento de la derecha, todos los que
siguen pendientes en la izquierda son mayores que él. Que las mitades queden
ordenadas es lo que permite contar esa clase en una sola pasada.

Costo: $T(n) = 2T(n/2) + \Theta(n)$, o sea $\Theta(n \log n)$. El contador va
en `long long`, porque en el peor caso la respuesta llega al orden de $10^{11}$.
Medido con $n = 499\,999$, la versión de C++ tarda 0,20 s y la de Python 5,1 s,
así que al juez se envía la de C++.

## Lógica

El ciclo de partida es el de
UVa 11078, Open Credit System (<https://vjudge.net/problem/UVA-11078>).
Recibe $a[0..n-1]$ con $n \geq 2$ y devuelve
$\max\{a[s] - a[t] : 0 \leq s < t < n\}$:

```python
def mayor_diferencia(a):
    mayor = a[0]
    mejor = a[0] - a[1]
    j = 1
    while j < len(a):
        if mayor - a[j] > mejor:
            mejor = mayor - a[j]
        if a[j] > mayor:
            mayor = a[j]
        j = j + 1
    return mejor
```

Un invariante es una fórmula sobre las variables del ciclo, verdadera cada vez
que se evalúa la condición del `while`. Se escribe con cuantificador, índices y
rango, y se demuestra en tres pasos. La inicialización pide que valga en el
primer chequeo; la estabilidad, que si vale en un chequeo y la condición se
cumple, valga en el siguiente; la terminación, que el ciclo acabe y que el
invariante con la condición falsa dé lo que se quería. Los dos primeros son una
inducción sobre el número de chequeos.

El invariante de `mayor` dice que su valor está en el tramo $a[0..j)$ y que
nadie del tramo lo supera:

$$
\begin{aligned}
I_0 &:\; 1 \leq j \leq n \\
I_1 &:\; \exists t\, (0 \leq t < j \wedge a[t] = \mathit{mayor}) \wedge \forall t\, (0 \leq t < j \to a[t] \leq \mathit{mayor})
\end{aligned}
$$

Para `mejor`, el primer candidato es la mayor diferencia entre las parejas del
tramo, y falla en la inicialización: con $j = 1$ el tramo no tiene ninguna
pareja. Las parejas que `mejor` ya tuvo en cuenta incluyen la de su valor
inicial:

$$
P_j = \{(0, 1)\} \cup \{(s, t) : 0 \leq s < t < j\}
$$

$$
I_2 :\; \exists (s, t) \in P_j\, (a[s] - a[t] = \mathit{mejor}) \wedge \forall (s, t) \in P_j\, (a[s] - a[t] \leq \mathit{mejor})
$$

La estabilidad de $I_2$ usa $I_1$. En la vuelta $j$, las parejas nuevas son las
que terminan en $t = j$, y la mayor de ellas vale `mayor - a[j]` porque `mayor`
todavía es el máximo de $a[0..j)$; por eso el `if` de `mejor` va antes que el de
`mayor`. Al salir, $j = n$ y, como $n \geq 2$, la pareja $(0, 1)$ ya está en el
rango $0 \leq s < t < n$, así que $P_n$ son todas las parejas y `mejor` es la
salida pedida.

### Ejercicio en papel: UVa 507 sin el desempate

UVa 507, Jill Rides Again (<https://vjudge.net/problem/UVA-507>), sin
el desempate por longitud y por inicio. La entrada es $v[0..n-1]$, las calles
de la ruta, y la salida es la mayor suma de un tramo de calles seguidas, o 0 si
ninguno es positivo:

```python
def mejor_tramo(v):
    suma = 0
    mejor = 0
    k = 0
    while k < len(v):
        suma = suma + v[k]
        if suma > mejor:
            mejor = suma
        if suma < 0:
            suma = 0
        k = k + 1
    return mejor
```

Sea $S(i, j) = \sum_{t=i}^{j-1} v[t]$, con $S(i, i) = 0$, e
$I_0 :\; 0 \leq k \leq n$. Se pide:

1. Llenar la traza con $v = [2, -3, 4, -1, 2, -6]$. Cada fila es un chequeo del
   `while`, antes de ejecutar la vuelta; en la primera, con $k = 0$, las dos
   variables valen 0.
2. Escribir $I_1$, sobre `suma`, con $\exists$, $\forall$ y rango.
3. Escribir $I_2$, sobre `mejor`, de la misma forma.
4. Demostrar inicialización, estabilidad y terminación.

Donde las dos columnas de la traza difieren, `suma` no es lo mejor de lo
recorrido: conviene mirar dónde terminan sus tramos. Cada fórmula se prueba
primero con $k = 0$, el chequeo donde cayó el candidato de UVa 11078. En la
estabilidad cada `if` va por casos, y uno usa el invariante del otro.

La solución está en
[Soluciones-logica.pdf](./Soluciones-logica.pdf){ target=_blank rel=noopener }.

## Tarea

Se resuelve antes del 14 de noviembre y se envía al juez; la revisión abre
esa sesión. Cada solución va con su costo.

### Base. UVa 10935, Throwing cards away I

- Enunciado y envío: <https://vjudge.net/problem/UVA-10935>

Mientras queden al menos dos cartas, se bota la de arriba y la siguiente pasa
al fondo. El parámetro es $n$, el número de cartas. Cada ronda solo toca los
dos extremos del mazo, y una cola saca arriba y pone abajo en tiempo constante.
Las cartas botadas van separadas por coma y espacio, así que la primera se
escribe distinto de las demás. La trampa es $n = 1$: no se bota ninguna carta,
y la primera línea es `Discarded cards:` sin espacio después de los dos puntos.

### Intermedio. UVa 11286, Conformity

- Enunciado y envío: <https://vjudge.net/problem/UVA-11286>

El parámetro es $n$, el número de estudiantes, con $n \le 10\,000$ y cinco
cursos cada uno. Una combinación no depende del orden: al ordenar los cinco
cursos, dos estudiantes con la misma combinación producen la misma clave de un
diccionario. La trampa está en la pregunta, que pide el total de estudiantes:
si varias combinaciones empatan en la mayor popularidad, se suman todas.

### Exigente. UVa 699, The Falling Leaves

- Enunciado y envío: <https://vjudge.net/problem/UVA-699>

El parámetro es $t$, el número de nodos. La entrada ya viene en preorden, y la
columna de un hijo solo depende de la de su padre: la función lee el subárbol
mientras suma en la columna $x$ y baja a $x - 1$ y $x + 1$, sin construir el
árbol. Las columnas pueden ser negativas. La trampa es de formato: un árbol
puede seguir en la línea siguiente, como el segundo de la muestra, y la línea
en blanco va también después del último caso.

## Para seguir

- [Soluciones](./Soluciones.md) de UVa 12032, UVa 10341 y UVa 10810 y de los
  tres problemas de la tarea, con la idea, la complejidad y el código en Python
  y C++.
- [Ejercicios interactivos](./Ejercicios.md) sobre bisección, dividir y
  vencerás, costo e invariantes.

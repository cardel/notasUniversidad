# Ejercicios

Clase 1 — introducción a la programación paralela, ley de Amdahl y localidad
de caché (8 y 10 de septiembre). Los tres primeros se trabajan en el
navegador, sin instalar nada. Los de papel vienen después y no toman más de
media hora: sirven para fijar las cuentas antes de medir en la máquina.

## [Ley de Amdahl](widgets/amdahl.html){ target=_blank rel=noopener }

Dos perillas: qué fracción del programa se puede repartir y entre cuántos
núcleos. La página calcula el tiempo, el speedup y la eficiencia, y dibuja en
qué se va cada uno.

Lo que conviene mirar es la última columna de la tabla, la que compara cada
fila con la anterior. Ahí se ve que duplicar la máquina no duplica la
velocidad, y que la distancia entre lo que se gana y lo que se paga crece
rápido. Al final hay dos preguntas: de dónde sale el techo y, al revés,
cuánto habría que paralelizar para ir diez veces más rápido.

## [Localidad temporal y espacial](widgets/localidad.html){ target=_blank rel=noopener }

La misma matriz recorrida por filas y por columnas. Los dos leen los mismos
elementos y hacen el mismo número de accesos; lo único distinto es el orden.
Cada acceso queda clasificado en tres: acierto espacial si el dato llegó de
vecino en la línea recién traída, acierto temporal si estaba porque se cargó
antes y todavía sigue ahí, y fallo si hubo que ir por él.

Con n = 8 y cuatro líneas de caché, el recorrido por filas da 8 fallos y 56
aciertos espaciales, y ninguno temporal: vive del vecino. Suba la caché a ocho
líneas y pase a columnas sin tocar nada más. Los fallos caen de 64 a 8, los
aciertos espaciales siguen en cero y aparecen 56 temporales. Son dos maneras
distintas de no ir a memoria, y un mismo código puede tener una sin la otra.

La perilla de pasadas es la que deja ver la temporal: en la segunda vuelta, o
el dato sigue en la caché o toca traerlo otra vez.

## [False sharing](widgets/falso.html){ target=_blank rel=noopener }

Cuatro hilos, cada uno escribiendo en su propia posición de un arreglo. El
resultado siempre es correcto y el programa puede ser lento igual.

Hay dos perillas y las cuatro combinaciones importan. La tabla del final
guarda la sorpresa: sin relleno y con las escrituras por bloques el costo es
el mismo que con relleno. Compartir la línea no basta para que duela; hace
falta que dos núcleos se turnen para escribirla.

## Sobre speedup y eficiencia

Un programa se midió en una máquina de 16 núcleos y dio estos tiempos:

| Núcleos | 1 | 2 | 4 | 8 | 16 |
|---|---|---|---|---|---|
| Tiempo (s) | 120 | 66 | 39 | 25,5 | 18,75 |

1. Calcule el speedup y la eficiencia para cada número de núcleos.
2. La eficiencia baja en cada paso. ¿A partir de cuántos núcleos deja de
   valer la pena, si cada núcleo cuesta lo mismo?
3. Despeje la fracción paralelizable $p$ que explica el tiempo con 8 núcleos.
   Compruebe que el mismo $p$ predice las otras cuatro medidas.
4. Con ese $p$, ¿cuál es el mejor tiempo alcanzable aunque la máquina tuviera
   mil núcleos?
5. Alguien reporta un speedup de 17 con 16 núcleos. Antes de creerlo o
   descartarlo, diga qué habría que revisar de la medición.

## Sobre lo que no se reparte

1. En este fragmento, ¿cuál de los tres ciclos se puede repartir entre hilos
   y cuál no?

    ```c
    for (int i = 0; i < N; i++) v[i] = i;
    for (int i = 0; i < N; i++) v[i] = fibonacci(i);
    for (int i = 0; i < N; i++) printf(" %d ", v[i]);
    ```

2. Del ciclo que sí se reparte: los `fibonacci(i)` no cuestan lo mismo. ¿Qué
   pasa si se le dan a cada hilo `N/4` índices consecutivos? Proponga un
   reparto mejor.
3. Un programa lee un archivo de 2 GB y calcula un promedio. Se paraleliza el
   cálculo y el tiempo no baja. ¿Dónde está el límite y qué mediría para
   confirmarlo?
4. Escriba un caso donde agregar hilos empeore el tiempo, no solo deje de
   mejorarlo.

## Sobre la localidad

Una matriz de $1000 \times 1000$ de `double`, guardada por filas. Un
`double` ocupa 8 bytes y una línea de caché son 64.

1. ¿Cuántas líneas ocupa una fila completa? ¿Y una columna completa?
2. La caché L1 de datos tiene 32 KB. ¿Cabe una fila entera? ¿Cabe lo que
   necesita el recorrido por columnas para no repetir trabajo?
3. Estime cuántos fallos genera cada recorrido sobre la matriz completa.
4. La transposición de una matriz lee por filas y escribe por columnas, o al
   revés: uno de los dos accesos va a estar mal siempre. ¿Cómo lo arreglaría
   sin cambiar el resultado?
5. Un programa recorre diez veces seguidas un vector de 1 MB, y la caché L2
   tiene 256 KB. ¿Cuántas de las diez pasadas encuentran los datos ya
   cargados? ¿Y si el vector midiera 100 KB? Diga cuál de las dos localidades
   decide en cada caso.
6. La multiplicación clásica de matrices recorre una de las dos por columnas;
   la versión por bloques parte las tres en cuadros que caben en la caché.
   ¿Cuál localidad mejora cada cambio: pasar de columnas a filas, y partir en
   bloques?
7. Escriba un fragmento con localidad espacial buena y temporal nula, y otro
   al revés. Ninguno de los dos puede ser un recorrido de matriz.

## Sobre el false sharing

1. Cuatro hilos acumulan en `long sumas[4]` y el programa va más lento que la
   versión secuencial. Explique por qué, sin usar la palabra *carrera*.
2. Proponga dos correcciones distintas y diga cuál prefiere y por qué.
3. ¿Por qué un detector de condiciones de carrera no reporta nada aquí?
4. Con ocho hilos en vez de cuatro y `long sumas[8]`, ¿mejora, empeora o da
   igual? Justifique con el tamaño de la línea.

## Para comprobar en la máquina

Las dos versiones del acumulador, la que comparte línea y la que no, están en
el repositorio del ejercicio de la sesión. Compile con
`g++ -std=c++17 -O2 -pthread` y mida las dos con `perf stat`. Compare el
tiempo y, sobre todo, el contador de fallos de caché: es ahí donde la
diferencia se explica sola.

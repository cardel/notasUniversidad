# Ejercicios

Clase 1 — introducción a la programación paralela, ley de Amdahl y localidad
de caché (8 y 10 de septiembre). Los apartados van en el orden de la clase.
Los que se abren en el navegador no piden instalar nada; los de papel no toman
más de media hora y sirven para fijar las cuentas antes de medir en la
máquina.

## Introducción a los sistemas de cómputo paralelo

### Lo que parece secuencial y no lo es

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

## Recursos compartidos

### [Localidad temporal y espacial](widgets/localidad.html){ target=_blank rel=noopener }

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

### Cuentas sobre la localidad

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

## Dependencias

### [Cuatro tareas y un orden que respetar](widgets/dependencias.html){ target=_blank rel=noopener }

Cuatro tareas de distinto tamaño, y dos de ellas no pueden empezar hasta que
otra termine. Se elige cuántos procesadores hay y la página arma el reparto,
dibuja quién corre dónde y dice en cuánto termina todo.

Lo que hay que buscar es el momento en que agregar procesadores deja de
cambiar algo. Con uno el tiempo es 17, que es todo el trabajo junto. Con dos
baja a 11, y ahí se queda: con cuatro y con ocho sigue siendo 11. El culpable
está a la vista en el dibujo, en forma de huecos donde hay procesador libre y
ninguna tarea puede arrancar.

La casilla de tareas partibles es la que rompe el estancamiento. Con ocho
procesadores y las tareas repartibles el tiempo cae a 2,125, que es el trabajo
total dividido entre ocho.

### Sobre el reparto

1. La cadena más larga es A→C y vale 11. ¿Cuántos procesadores hacen falta
   para llegar a ese 11, y qué gana el que sobra?
2. Si A durara 4 en vez de 8, ¿cuál sería la cadena más larga y en cuánto
   terminaría con dos procesadores?
3. Agregue una quinta tarea E que dure 6 y no dependa de nadie. ¿Cambia el
   tiempo con dos procesadores? ¿Y con cuatro?
4. El reparto de la página toma siempre la tarea más larga de las que ya
   pueden empezar. Construya un caso de cuatro tareas donde esa regla dé un
   tiempo peor que elegir la más corta.

## Speedup, eficiencia y la ley de Amdahl

### [Ley de Amdahl](widgets/amdahl.html){ target=_blank rel=noopener }

Dos perillas: qué fracción del programa se puede repartir y entre cuántos
núcleos. La página calcula el tiempo, el speedup y la eficiencia, y dibuja en
qué se va cada uno.

Lo que conviene mirar es la última columna de la tabla, la que compara cada
fila con la anterior. Ahí se ve que duplicar la máquina no duplica la
velocidad, y que la distancia entre lo que se gana y lo que se paga crece
rápido. Al final hay dos preguntas: de dónde sale el techo y, al revés,
cuánto habría que paralelizar para ir diez veces más rápido.

### Cuentas sobre speedup y eficiencia

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

### [False sharing](widgets/falso.html){ target=_blank rel=noopener }

Cuatro hilos, cada uno escribiendo en su propia posición de un arreglo. El
resultado siempre es correcto y el programa puede ser lento igual.

Hay dos perillas y las cuatro combinaciones importan. La tabla del final
guarda la sorpresa: sin relleno y con las escrituras por bloques el costo es
el mismo que con relleno. Compartir la línea no basta para que duela; hace
falta que dos núcleos se turnen para escribirla.

### Cuentas sobre el false sharing

1. Cuatro hilos acumulan en `long sumas[4]` y el programa va más lento que la
   versión secuencial. Explique por qué, sin usar la palabra *carrera*.
2. Proponga dos correcciones distintas y diga cuál prefiere y por qué.
3. ¿Por qué un detector de condiciones de carrera no reporta nada aquí?
4. Con ocho hilos en vez de cuatro y `long sumas[8]`, ¿mejora, empeora o da
   igual? Justifique con el tamaño de la línea.

### Para comprobar en la máquina

Las dos versiones del acumulador, la que comparte línea y la que no, están en
el repositorio del ejercicio de la sesión. Compile con
`g++ -std=c++17 -O2 -pthread` y mida las dos con `perf stat`. Compare el
tiempo y, sobre todo, el contador de fallos de caché: es ahí donde la
diferencia se explica sola.

## Contexto histórico

### [Los muros](widgets/walls.html){ target=_blank rel=noopener }

Dos números explican por qué la frecuencia dejó de subir. El primero es el
consumo: como para subir la frecuencia hay que subir también el voltaje, el
gasto crece con el cubo, y desde 3 GHz y 80 W el presupuesto térmico de 130 W
se agota en 3,53 GHz. Duplicar la frecuencia no duplica el consumo, lo
multiplica por ocho.

El segundo es la distancia con la memoria. Con el procesador ganando 52 % al
año y la DRAM 7 %, en 1990 la diferencia ya era de 33 veces y en 2005 pasaba
de seis mil. Mueva el año y mire cómo se separan las dos columnas.

### Sobre los muros

1. Con la regla del cubo, ¿cuánto consumiría un chip de 8 GHz partiendo de
   3 GHz y 80 W? ¿Cuántos chips de 3 GHz caben en ese mismo presupuesto?
2. La respuesta anterior es el argumento a favor de poner varios núcleos
   lentos en vez de uno rápido. ¿Qué le exige esa decisión al programador que
   antes no le exigía nada?
3. Un procesador de 2005 no espera seis mil ciclos en cada acceso a memoria.
   ¿Qué se lo evita, y qué relación tiene con el recorrido por filas contra el
   recorrido por columnas?
4. El paralelismo a nivel de instrucción también se estancó: sacarle más
   instrucciones por ciclo a un solo hilo dejó de rendir. Diga dos razones por
   las que un procesador no puede ejecutar veinte instrucciones de un hilo a
   la vez.

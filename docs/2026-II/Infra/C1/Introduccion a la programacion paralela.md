# Introducción a la programación paralela

Lo que se vio en la primera sesión: por qué hay que repartir el trabajo, qué
lo impide, y por qué el reloj del procesador dejó de subir. Las diapositivas
están en el Campus Virtual; aquí quedan las cuentas, las mediciones y el
código que se corrió en clase.

## Repartir no es hacer menos trabajo

Un computador de escritorio corriente trae hoy seis u ocho núcleos, y cada
núcleo dos hilos de ejecución. Eso ya no es una máquina especial: es la que
hay. Un programa escrito en serie usa uno de esos hilos y deja los demás
quietos.

La primera confusión que conviene quitarse de encima es creer que paralelizar
reduce el trabajo. No lo reduce. Las mismas sumas hay que hacerlas, los mismos
datos hay que leerlos. Lo que cambia es **cuándo** se hacen: en vez de uno tras
otro, varios a la vez. Lo que se acorta es el camino más largo desde que
empieza el programa hasta que termina, y a eso se le llama el *span*.

!!! note "La trampa serial"
    Pensar que repartir el trabajo lo disminuye. El trabajo total es una
    constante del problema; lo que se puede mover es el tiempo que uno tiene
    que esperar a que termine.

Con dieciocho tareas ejecutadas una tras otra hay que esperar dieciocho
unidades de tiempo. Repartidas bien, el mismo trabajo cabe en seis. Nadie hizo
menos: se hicieron cosas al tiempo.

### El orden deja de estar garantizado

En un programa secuencial las instrucciones ocurren en el orden en que están
escritas. Al repartirlas, ese orden se pierde, y con él la garantía de que dos
ejecuciones del mismo programa den lo mismo.

El caso más corto que muestra el problema: una tarea le suma 3 a un número y
otra lo multiplica por 2. Si el número vale 5 y suma primero, queda 16. Si
multiplica primero, queda 13. Las dos tareas son correctas; lo que falta es
decidir el orden.

Un programa paralelo bien escrito da el mismo resultado sin importar cuántas
veces se corra ni en qué orden alcancen a ejecutarse las tareas. Conseguirlo es
la mayor parte del trabajo.

## Dónde vive un dato

Entre el procesador y la memoria hay una escalera. Esto es lo que reporta una
máquina concreta, un Ryzen 5 3600 con 32 GB de RAM:

| Nivel | Tamaño | De quién es |
|---|---|---|
| L1 de datos | 32 KB | de cada hilo |
| L2 | 512 KB | de cada núcleo |
| L3 | 32 MB, en dos bloques de 16 | del complejo de núcleos |
| RAM | 32 GB | de toda la máquina |

Se lee con `lstopo` o con `lscpu -C`. Los saltos entre niveles son enormes: de
32 GB a 32 MB hay un factor de mil, y de 32 MB a 32 KB otro factor de mil.
Todo lo que el programa toque tiene que pasar por ese embudo.

La pregunta obvia es por qué no hacer cachés grandes. Porque la memoria caché
es de lo más caro que lleva un computador: es SRAM, seis transistores por bit,
contra uno y un condensador de la DRAM. Una caché de 32 GB no es que sea
inconveniente, es que no se puede pagar.

### Las dos localidades

Como no cabe todo, hay que apostar a qué se va a necesitar. El hardware apuesta
sobre dos observaciones del comportamiento de los programas reales.

!!! note "Localidad temporal"
    Si un programa accede a una posición de memoria, es probable que vuelva a
    ella pronto. Los ciclos, los contadores y los acumuladores son eso: unas
    pocas posiciones tocadas muchas veces en un intervalo corto. La caché la
    aprovecha **conservando** el dato.

En `for (i = 0; i < 100; i++) suma += a[i];` la variable `suma` se lee y se
escribe cien veces. Tenerla en la caché ahorra doscientos viajes a memoria.

!!! note "Localidad espacial"
    Si un programa accede a una posición, es probable que enseguida acceda a
    una vecina. Recorrer un arreglo es el ejemplo puro. Por eso la caché no
    trae el dato suelto sino **la línea completa**: pedir uno arrastra a sus
    vecinos. A eso se le dice prefetch.

Son independientes. Un recorrido de arreglo tiene espacial de sobra y ninguna
temporal, porque cada elemento se lee una vez. Un vector corto recorrido diez
veces es el caso contrario.

### Lo que cuesta fallar

Con `h` la fracción de accesos que encuentran el dato en la caché, el tiempo
promedio de acceso es

$$T_{prom} = h \cdot T_c + (1-h) \cdot T_m$$

donde $T_c$ es el tiempo de la caché y $T_m$ el de la memoria principal. Como
$T_m$ es mucho mayor que $T_c$, el término que manda es el segundo aunque
$1-h$ sea pequeño. Bajar la tasa de fallo del 10 % al 1 % cambia el tiempo de
un programa mucho más de lo que sugiere la diferencia entre esos dos números.

## Una matriz no es un cuadrado

Los arreglos de dos dimensiones no existen en memoria. Lo que hay es una tira
lineal, y la convención de que cada tantos elementos empieza una fila. Con mil
columnas, el elemento `[i][j]` vive en la posición `i * 1000 + j`.

```c
int *arr = malloc(filas * cols * sizeof(int));
arr[i * cols + j] = i * j;      /* equivale a arr[i][j] = i * j */
```

Esa aritmética decide todo lo que sigue. Recorrer por filas avanza de a uno por
la tira: 0, 1, 2, 3. Recorrer por columnas salta de mil en mil: 0, 1000, 2000.
Los dos recorridos escriben exactamente las mismas posiciones; el orden es lo
único distinto.

### El experimento

Los dos programas están en [`codigo/`](codigo/README.md) y se diferencian en el
orden de los dos ciclos, nada más.

```bash
gcc -g -o arr_filas arr_filas.c
gcc -g -o arr_columnas arr_columnas.c

valgrind --tool=cachegrind --cache-sim=yes --cachegrind-out-file=filas.out ./arr_filas
valgrind --tool=cachegrind --cache-sim=yes --cachegrind-out-file=columnas.out ./arr_columnas

cg_annotate --auto=yes columnas.out
```

Dos banderas que sin ellas el experimento no sale. La primera es `-g` al
compilar: sin información de depuración, `cg_annotate` no puede decir a qué
línea del fuente corresponde cada fallo y el reporte queda inservible. La
segunda es `--cache-sim=yes`: desde Valgrind 3.25 cachegrind no simula la caché
por omisión y solo cuenta instrucciones.

Lo que devuelve, sobre una matriz de 1000 × 1000 enteros:

| | Por filas | Por columnas |
|---|---:|---:|
| Instrucciones | 16 160 926 | 16 160 940 |
| Accesos a datos | 10 052 911 | 10 052 919 |
| Fallos en L1 de datos | 64 326 | 1 001 821 |
| Tasa de fallo en escritura | 6,2 % | **98,7 %** |

Las instrucciones son las mismas hasta la última decena, y los accesos a datos
también. Lo único que cambia es cuántos de esos accesos encuentran el dato.

### La línea que lo explica

`cg_annotate` reparte los fallos línea por línea del fuente. Sobre la misma
instrucción de asignación, en los dos programas:

| Recorrido | Escrituras | Fallos de escritura en L1 |
|---|---:|---:|
| Por filas | 1 000 000 | 62 500 |
| Por columnas | 1 000 000 | 999 999 |

Un `int` ocupa 4 bytes y una línea de caché son 64, así que en cada línea caben
dieciséis. Por filas se paga un fallo y se aprovechan las dieciséis escrituras
siguientes: un millón dividido entre dieciséis da exactamente 62 500. Por
columnas cada escritura cae en una línea distinta, la anterior ya fue
desalojada, y falla el millón entero.

La razón entre los dos números es 16,0. No es una coincidencia ni una constante
de la máquina: es cuántos enteros caben en una línea.

## Las dos localidades por separado

El [ejercicio de localidad](Ejercicios.md) permite verlas actuar una sin la
otra, que es difícil de conseguir midiendo un programa real.

Con una matriz de 8 × 8, líneas de ocho elementos y una caché de cuatro líneas,
el recorrido por filas da 8 fallos y 56 aciertos, **todos espaciales**. Cada
línea traída sirve para los ocho elementos que trae y después no se vuelve a
ella: no hay reuso, no hay localidad temporal, y los aciertos temporales quedan
en cero. La matriz completa no cabe en cuatro líneas, así que no hay nada que
conservar.

Ahora se sube la caché a ocho líneas y se recorre por columnas. Sin tocar el
orden de los accesos, los fallos caen de 64 a 8. Los aciertos espaciales siguen
en cero, porque el acceso siguiente nunca es el vecino. Lo que apareció fueron
56 aciertos **temporales**: ahora las líneas alcanzan a quedarse, y cuando el
recorrido vuelve a la fila de arriba para la columna siguiente, la línea todavía
está.

!!! tip "Lo que distingue una de otra"
    La espacial precarga las posiciones que vienen después. La temporal
    conserva lo que ya se trajo. Un mismo código puede tener una sin la otra, y
    el widget deja ponerlas en cero por turnos para comprobarlo.

## Cuando el orden no se puede romper

Hay trabajo que no se reparte porque unas partes necesitan el resultado de
otras. Con cuatro tareas donde B y C esperan a que A termine, y D es
independiente, el tiempo no baja de lo que dure la cadena más larga por muchos
procesadores que se pongan.

Construir una casa es el ejemplo que se usó en clase: con cinco maestros de
obra y sin planos no se avanza un metro, y los planos no se hacen entre cinco.
Hay pasos que admiten manos de más y pasos que no.

## Speedup, eficiencia y el techo

Con $T(1)$ el tiempo de la mejor versión secuencial y $T(n)$ el tiempo con $n$
procesadores:

$$S(n) = \frac{T(1)}{T(n)} \qquad E(n) = \frac{S(n)}{n}$$

El caso ideal es $S(n) = n$ y $E(n) = 1$, y no se da nunca.

!!! warning "Contra qué se mide"
    $T(1)$ es el tiempo del **mejor programa secuencial**, no el de la versión
    paralela corriendo con un solo hilo. Medir contra esta última infla el
    speedup, porque le carga al secuencial el costo de crear hilos y
    sincronizarlos, que no necesita.

Si una fracción $p$ del tiempo se puede repartir y el resto no, el tiempo con
$s$ procesadores queda

$$T(s) = (1-p) + \frac{p}{s} \qquad\Longrightarrow\qquad S(s) = \frac{1}{(1-p) + \frac{p}{s}}$$

Con infinitos procesadores el término $p/s$ desaparece y queda solo la parte que
no se reparte. Ese es el techo:

$$S_{max} = \frac{1}{1-p}$$

| Parte paralelizable | Speedup con 8 núcleos | Techo |
|---:|---:|---:|
| 50 % | 1,78 | 2 |
| 75 % | 2,91 | 4 |
| 90 % | 4,71 | 10 |
| 95 % | 5,93 | 20 |
| 99 % | 7,48 | 100 |

Un programa paralelizable al 90 % no pasa de diez veces más rápido, tenga los
núcleos que tenga. Y con ese mismo 90 %, pasar de 8 núcleos a 16 lleva el
speedup de 4,71 a 6,40: el doble de máquina para un 36 % más de velocidad.

Lo que decide no es cuántos procesadores hay, es qué fracción del programa
admite repartirse.

### Ni siquiera ese techo se alcanza

La ley supone que la parte paralela se reparte sin costo. Al medir aparece lo
que cuesta:

- **Arranque y sincronización.** Crear hilos, repartir el trabajo y esperar en
  las barreras toma tiempo que el secuencial no paga.
- **Contención.** Un mutex, un contador compartido o una sección crítica
  vuelven a serializar lo que se acababa de repartir.
- **Ancho de banda de memoria.** Varios núcleos leyendo a la vez saturan el bus
  antes de saturar la CPU.
- **Desbalanceo.** El reparto termina cuando termina el hilo más cargado, no
  cuando termina el promedio.
- **Entrada y salida.** Leer un archivo o esperar la red no se acelera poniendo
  más núcleos.

## False sharing

La caché no mueve variables, mueve líneas de 64 bytes. Si dos hilos escriben
variables **distintas** que caen en la misma línea, cada escritura invalida la
copia que tiene el otro núcleo, y la línea viaja de ida y vuelta entre los dos.

```cpp
long sumas[4];              // 32 bytes: los cuatro en una sola linea

void trabajador(int id) {   // cada hilo escribe en su propia posicion
  for (long i = 0; i < N; i++)
    sumas[id] += f(i);      // y aun asi invalida la del vecino
}
```

Aquí no hay condición de carrera. Cada hilo escribe en su posición, nadie pisa
el dato de nadie y el resultado es correcto. El programa simplemente es lento,
y un detector de carreras no reporta nada.

### Compartir línea no basta

El [ejercicio de false sharing](Ejercicios.md) tiene dos perillas, el relleno y
el orden de las escrituras, y las cuatro combinaciones importan. Con cuatro
acumuladores pegados y las escrituras intercaladas, cinco rondas cuestan veinte
viajes de línea. Las otras tres combinaciones cuestan cuatro.

O sea que separar los acumuladores arregla el problema, pero escribir por
bloques también: si cada hilo termina lo suyo antes de que empiece el
siguiente, la línea viaja una vez por hilo.

!!! tip "La condición completa"
    Compartir línea es necesario para que duela, pero no suficiente. Lo que
    cuesta es que dos núcleos **se turnen** para escribir la misma línea.

Las dos correcciones habituales salen de ahí: alinear cada acumulador a 64 bytes
para que no compartan línea, o acumular en una variable local (que vive en un
registro) y escribir al arreglo una sola vez al terminar.

## Por qué hubo que aprender todo esto

Nada de esto haría falta si los procesadores siguieran duplicando su velocidad
solos. Dejaron de hacerlo, y por tres razones distintas.

### El muro del consumo

Un chip consume según su capacitancia, el cuadrado del voltaje y la frecuencia.
Para subir la frecuencia hay que subir también el voltaje, más o menos en la
misma proporción, así que el consumo termina creciendo con el **cubo** de la
frecuencia.

Partiendo de 3 GHz y 80 W, un chip de 10 GHz pediría cerca de 3000 W, contra
los 130 W que se pueden disipar. El presupuesto se agota alrededor de los
3,6 GHz, que es justo donde los relojes se quedaron a comienzos de los 2000.

### El muro de la memoria

El argumento es de 1994 y sigue en pie. Entre el 20 % y el 30 % de las
instrucciones de un programa acceden a memoria; tomando el número bajo, una de
cada cinco. Si un acceso a memoria tarda más que las cinco instrucciones que lo
rodean, el rendimiento del sistema deja de depender del procesador y pasa a
depender de la memoria.

Suponiendo una tasa de fallo del 1 %, un nivel siguiente cuatro veces más lento,
DRAM mejorando un 7 % anual y procesadores un 80 %, el número de ciclos que
cuesta un acceso promedio salía en 1,52 para el año 2000, 8,25 para 2005 y 98,8
para 2010. La conclusión de entonces era que el muro estaba a menos de una
década. Llegó.

Y no hay salida fácil: una caché más grande o más inteligente no alcanza,
porque el problema es el ancho de banda, y precargar tampoco, porque ya se está
usando todo el que hay.

### El muro del paralelismo interno

El hardware ya ejecuta en paralelo por su cuenta las instrucciones que son
independientes. Lo hace con ejecución especulativa —calcular las dos ramas de un
`if` antes de saber cuál se toma— y con segmentación.

La segmentación es la lavadora: mientras una carga se seca, la siguiente ya se
está lavando. Un procesador parte cada instrucción en etapas —buscar la
instrucción, decodificarla, buscar los operandos, ejecutar, guardar— y mantiene
una instrucción distinta en cada etapa.

Ese paralelismo llegó a su límite. Alargar la segmentación deja de rendir, y
predecir mejor las ramas también.

### Lo que quedó

- La velocidad de un programa no puede depender de que suba el reloj.
- El paralelismo que el hardware saca solo ya se agotó.
- Hay que escribir programas explícitamente paralelos, y que además reduzcan
  sus accesos a memoria.

La industria respondió poniendo más núcleos, y con eso le trasladó el trabajo
al programador: un procesador de ocho núcleos no acelera nada por sí solo.

## Lo que sigue

Los patrones de paralelización, que son las formas conocidas de repartir un
problema, y la diferencia entre descomponer por datos y descomponer por tareas.

El ejemplo que quedó planteado: sumar dos vectores es paralelizable, porque
`a[i] = b[i] + c[i]` no depende de ninguna otra posición. En cambio un ciclo
donde cada elemento se calcula a partir del anterior no se reparte sin cambiar
el resultado, y esa dependencia a veces no está en la función sino en cómo se
la invoca.

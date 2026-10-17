# Herramientas de profiling en Linux

Lo que se vio en la sesión: cómo mirar un programa desde afuera cuando ya está
corriendo, qué parte de su tiempo se va dentro del núcleo, cuántos fallos de
caché cuesta un recorrido mal puesto y cuál de esas dos cosas explica el tiempo
que se pierde. Las diapositivas están en el Campus Virtual; aquí quedan las órdenes,
las trazas que devolvieron y las mediciones.

## Dos programas que hacen la misma cuenta

Dos versiones suman los 10.000 por 10.000 enteros de una matriz. Las dos
imprimen `999900000000` y la única diferencia son tres caracteres en un índice:

```cpp
// bueno.cpp, por filas
for (int i = 0; i < SIZE; i++)
    for (int j = 0; j < SIZE; j++)
        suma += matriz[i][j];

// malo.cpp, por columnas
for (int i = 0; i < SIZE; i++)
    for (int j = 0; j < SIZE; j++)
        suma += matriz[j][i];
```

| Medición | `./bueno` | `./malo` |
|---|---:|---:|
| Instrucciones ejecutadas | 3.504.983.954 | 3.504.984.293 |
| Ciclos de CPU | 1.177.787.894 | 2.796.626.915 |
| Tiempo transcurrido | 0,43538 s | 0,79385 s |

El procesador ejecuta el mismo trabajo y gasta casi el doble de ciclos en
hacerlo. Un cronómetro dice cuánto tardó, no por qué, y responder esa pregunta
obliga a mirar dentro del sistema operativo y dentro del procesador.

## Las cuatro familias de perfiladores

Es la misma clasificación de la sesión de profiling en Python, con las
herramientas equivalentes del lado de C++ y del sistema operativo:

| Categoría | En Python | En C++ y Linux | Cómo trabaja |
|---|---|---|---|
| Temporizadores | `time`, `timeit` | `chrono` | Miden tiempo transcurrido |
| Deterministas | `cProfile` | `callgrind` | Instrumentan el código y registran cada evento |
| Estadísticos | `pyinstrument` | `perf` | Muestreo periódico |
| Monitores del sistema | no aplica | `top`, `htop`, `ps` | Observan el proceso desde afuera |

La cuarta fila es la que no tenía equivalente en Python: no mide código, mide
procesos. Ahí está la diferencia de fondo de la sesión. En Python el instrumento
vive dentro del programa, que se lanza desde el perfilador; las tres
herramientas de esta sesión se aplican sobre un PID o sobre un ejecutable, así que
sirven en producción, sobre un servidor que lleva tres días corriendo y sobre un
binario que compiló alguien más.

Alrededor del 20 % del código produce el 80 % de los problemas de rendimiento, y
el ciclo es siempre el mismo: medir, localizar el cuello de botella, optimizar y
volver a medir, porque al quitar uno aparece el siguiente.

## El proceso visto desde afuera: `top`, `htop` y `ps`

`top` muestra en tiempo real los procesos activos y su consumo. Las cinco
primeras líneas son el estado de la máquina completa:

```bash
top
```

```text
top - 10:35:35 up  3:18,  1 user,  load average: 1,19, 1,28, 1,17
Tasks: 349 total, 1 running, 347 sleep, 0 d-sleep, 0 stopped, 1 zombie
%Cpu(s):  8,9 us,  1,3 sy,  0,0 ni, 88,8 id,  0,1 wa,  0,6 hi,  0,3 si,  0,0 st
MiB Mem :  15800,0 total,   2953,6 free,   4322,3 used,   9047,1 buff/cache
MiB Swap:  12000,7 total,  12000,7 free,      0,0 used.  11477,7 avail Mem

    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
  30576 cardel    20   0 1409,7g 861704 198936 S 103,7   5,3  17:04.11 vivaldi-bin
   3090 cardel    20   0   49,2g 681644 430060 S  15,0   4,2  22:45.41 vivaldi-bin
  10046 cardel    20   0 7613408 621756 404188 S  11,3   3,8  17:38.47 obs
   1721 cardel     9 -11  199548  43500  12336 S   2,7   0,3   5:02.19 pipewire-pulse
```

El promedio de carga a 1, 5 y 15 minutos se lee contra el número de núcleos:
igual al número de núcleos es uso pleno, por encima hay procesos esperando
turno, y las tres cifras juntas dan la tendencia. `1,19 1,28 1,17` es carga
estable; `5,00 2,00 1,00` es carga que acaba de dispararse. En `%Cpu(s)`, un
`wa` grande con `us` pequeño dice que la CPU espera al disco, y agregar hilos
ahí no mueve nada.

De las columnas de la lista, tres se confunden entre sí. `VIRT` es todo el
espacio de direcciones que el proceso puede tocar, incluidas las librerías
compartidas y la memoria reservada y nunca usada; `RES` es la RAM que ocupa de
verdad; `SHR` es la parte de `RES` que comparte con otros. Ese `vivaldi-bin` con
`1409,7g` de `VIRT` usa 861 MB reales, y diagnosticar consumo de memoria por
`VIRT` lleva siempre a la conclusión equivocada.

Los estados que aparecen en la columna `S`:

| Estado | Código | Significado |
|---|---|---|
| Running | `R` | Ejecutándose en una CPU |
| Sleep | `S` | Esperando un evento o una operación de entrada y salida |
| D-sleep | `D` | Sueño profundo, no interrumpible, casi siempre por disco |
| Stopped | `T` | Pausado por una señal `SIGSTOP` |
| Zombie | `Z` | Terminó, y su entrada sigue en la tabla de procesos |

El zombie ya liberó su memoria: lo que queda es su código de salida esperando a
que el padre lo recoja. Uno solo ocupa una entrada de la tabla; miles la agotan
y el sistema deja de poder crear procesos nuevos.

`PR` es la prioridad con que el planificador atiende al proceso y `NI` el ajuste
que el usuario pide sobre ella, entre -20 y 19, con 0 por omisión. En la salida
anterior `pipewire-pulse` tiene `NI = -11` y `PR = 9`, porque es audio y una
interrupción se oye. Pedir más prioridad requiere privilegios; pedir menos, no.

Para mirar un proceso concreto, `top -p 27847`; para los de un usuario,
`top -u cardel`. Y en modo batch imprime una captura y termina, con lo que se
deja llamar desde un script:

```bash
top -b -p 1668 -n 1
```

```text
    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
   1668 cardel    20   0  234944  10180   8812 S   0,0   0,1   1:46.69 xdg-desktop-por
```

`htop` da la misma información con colores, barras por núcleo, navegación con
teclas y árbol de procesos, que es lo que `top` no trae: un programa con
`multiprocessing` aparece como un padre con sus hijos colgando y se ve de una
vez cuántos trabajadores se crearon. `btop`, `glances` y `nmon` agregan red,
disco y temperaturas; `glances` expone las métricas por una API web.

`ps` captura una instantánea en vez de refrescar, y por eso es la que sirve en
scripts:

```bash
ps a | head -n 5
```

```text
    PID TTY      STAT   TIME COMMAND
   1420 tty2     Ssl+   0:00 /usr/bin/start-hyprland
   1474 tty2     Sl+   13:02 Hyprland --watchdog-fd 4
   1510 tty2     S+     0:00 /bin/sh -c /usr/bin/lxqt-policykit-agent >/dev/null
   1514 tty2     Sl+    0:00 /usr/bin/lxqt-policykit-agent
```

La columna `STAT` es el estado más una serie de banderas: `l` es proceso
multihilo, `s` líder de sesión y `+` en primer plano de su terminal. `Hyprland`
aparece como `Sl+`, y esa `l` es el primer dato antes de ir a contar los hilos.

### El programa paralelo visto desde afuera

Para observar un programa paralelo hace falta uno que dure. El de la sesión
reserva la matriz de 10.000 por 10.000 y la suma tantas veces como se le pida,
repartiendo las filas entre los hilos de OpenMP. Se lanza en una terminal y se
mira desde otra:

```bash
# Terminal 1: el programa trabajando
./paralelo 900

# Terminal 2: -b modo batch, -n1 una captura, -o %CPU ordena por uso de CPU
top -b -n1 -o %CPU | head -n 11
```

```text
top - 20:12:20 up 45 min,  1 user,  load average: 3,48, 3,41, 3,28
Tasks: 475 total, 3 running, 471 sleep, 0 d-sleep, 0 stopped, 1 zombie
%Cpu(s): 91,9 us,  5,1 sy,  0,0 ni,  1,7 id,  0,0 wa,  1,0 hi,  0,3 si,  0,0 st
MiB Mem :  31992,5 total,   7793,2 free,  10810,8 used,  14960,1 buff/cache
MiB Swap:  12288,0 total,  12288,0 free,      0,0 used.  21181,7 avail Mem

    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
 102237 cardel    20   0  488792 395268   4084 R 919,1   1,2   1:21.05 paralelo
    893 root      20   0 2301316 124004  61384 S  51,8   0,4   0:31.82 dockerd
```

El `919,1` de la columna `%CPU` se cuenta sobre un núcleo, no sobre la máquina.
Esta tiene doce núcleos lógicos, así que el techo es 1200 y `paralelo` ocupa el
equivalente a 9,2 de ellos; un programa secuencial no pasa de 100. El
encabezado lo confirma por otro lado, con `91,9 us` y apenas `1,7 id`. La `RES`
de 395 MB es la matriz: cien millones de enteros de cuatro bytes.

`ps` responde en una línea cuántos hilos tiene y cuánta CPU acumula:

```bash
ps -o user,pid,thcount,pcpu,pmem,cputime,cmd -p 102237
```

```text
USER         PID THCNT %CPU %MEM     TIME CMD
cardel    102237    12  981  1.2 00:01:21 ./paralelo 900
```

Doce hilos y 981 % de CPU. Un `THCNT` de 1 en este punto diría que la directiva
`omp parallel for` no se aplicó y que el binario se compiló sin `-fopenmp`, por
más que el código diga lo contrario. Esa comprobación va antes de perfilar
cualquier programa paralelo.

La bandera `-T` abre el proceso y da una fila por hilo:

```bash
ps -o pid,tid,psr,pcpu,comm -T -p 102237
```

```text
    PID     TID PSR %CPU COMMAND
 102237  102237   5 86.4 paralelo
 102237  102239   5 79.6 paralelo
 102237  102240   6 83.4 paralelo
 102237  102241  11 84.8 paralelo
 102237  102242   4 81.2 paralelo
 102237  102243   2 85.2 paralelo
 102237  102244   1 84.8 paralelo
 102237  102245   8 82.2 paralelo
 102237  102246  10 84.5 paralelo
 102237  102247   0 82.3 paralelo
 102237  102248  10 83.8 paralelo
 102237  102249   3 83.8 paralelo
```

`TID` es el identificador del hilo, y el primero coincide con el `PID` porque es
el hilo principal: los otros once los creó OpenMP. `PSR` es el núcleo donde el
planificador tenía ese hilo en el instante de la consulta. Los doce van entre
79,6 % y 86,4 %, que es el reparto que se espera de un `parallel for` sobre
filas del mismo tamaño; uno en 100 % y once en 10 % diría que el trabajo quedó
mal repartido.

Los `PSR` de esa captura son 5, 5, 6, 11, 4, 2, 1, 8, 10, 0, 10 y 3: los núcleos
7 y 9 están libres mientras otros dos cargan con dos hilos cada uno. El
planificador mueve los hilos y la consulta es la foto de un instante, así que
repetirla da otro reparto. Fijar un hilo a un núcleo es cosa de `taskset` o de
las variables de afinidad de OpenMP.

## El costo completo del proceso: `/usr/bin/time -v`

El `time` que responde al escribirlo suelto es una palabra reservada del
intérprete y da tres tiempos. El programa `/usr/bin/time`, escrito con la ruta
completa, es otro: con `-v` imprime las veintitrés líneas que el núcleo lleva
contabilizadas del proceso, repartidas en tiempos, tamaño en memoria, fallos de
página, cambios de contexto y actividad de entrada y salida. Nada de eso exige
recompilar.

```bash
/usr/bin/time -v ./bueno
```

```text
999900000000
	Command being timed: "./bueno"
	User time (seconds): 0.59
	System time (seconds): 0.19
	Percent of CPU this job got: 98%
	Elapsed (wall clock) time (h:mm:ss or m:ss): 0:00.79
	Maximum resident set size (kbytes): 394368
	Major (requiring I/O) page faults: 0
	Minor (reclaiming a frame) page faults: 97870
	Voluntary context switches: 1
	Involuntary context switches: 84
	Page size (bytes): 4096
	Exit status: 0
```

El mismo reporte sobre las dos versiones, línea por línea:

| Línea del reporte | `./bueno` | `./malo` |
|---|---:|---:|
| `User time` | 0,59 s | 0,81 s |
| `System time` | 0,19 s | 0,19 s |
| `Maximum resident set size` | 394.368 kB | 394.780 kB |
| `Minor page faults` | 97.870 | 97.870 |
| `Major page faults` | 0 | 0 |

Los dos procesos ocupan 394 MB, provocan exactamente 97.870 fallos de página
menores y ninguno mayor, y gastan el mismo tiempo de sistema. Lo único que se
mueve es el tiempo de usuario, y ahí `time` ya no alcanza.

Un fallo de página **menor** se resuelve dentro de la memoria física: la página
ya está en RAM y al núcleo le falta anotarla en la tabla del proceso, que es lo
que pasa la primera vez que se escribe en memoria recién reservada. Los 97.870
son la matriz apareciendo: 394 MB en páginas de 4 kB dan unas 96.000 páginas. Un
fallo **mayor** obliga a leer del disco y cuesta cinco órdenes de magnitud más;
un programa con fallos mayores distintos de cero está yendo a *swap*, y eso es
un problema de otra naturaleza.

## Contar llamadas al sistema con `strace -c`

`strace` sigue las llamadas que el proceso le hace al núcleo: abrir un archivo,
escribir, reservar memoria, crear un hilo. Con `-c` no imprime la traza completa
sino un resumen contado y ordenado por tiempo. Mide en la frontera entre el
programa y el núcleo, que es un sitio distinto del que miran `perf` y Valgrind.

```bash
strace -c ./bueno
```

```text
999900000000
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
 98,35    0,008408           3      2503           brk
  1,01    0,000086          14         6           mprotect
  0,16    0,000014           0        22           mmap
  0,11    0,000009           1         5           close
  0,08    0,000007           3         2           getrandom
------ ----------- ----------- --------- --------- ----------------
100,00    0,008549           3      2567         1 total
```

El programa tarda 0,79 segundos y de esos solo 8,5 milisegundos ocurren dentro
del núcleo: todo el tiempo se va en espacio de usuario. `strace` descarta una
causa y manda la investigación a otra herramienta, y descartar también es un
resultado. Las 2.503 llamadas a `brk`, que mueve el límite superior del *heap*,
salen de las 10.000 llamadas a `new int[SIZE]`: la librería de reserva agrupa
esas peticiones de 40 kB y pide al núcleo un bloque grande cada cierto número.

### Cuando sí encuentra el cuello de botella

Dos programas escriben las mismas 200.000 líneas en el mismo archivo. El primero
llama a `write` por cada línea; el segundo deja que la librería acumule en un
búfer:

```cpp
// lento.cpp
int fd = open("salida.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
char linea[32];
for (int i = 0; i < 200000; i++) {
  int n = snprintf(linea, sizeof(linea), "%d\n", i);
  write(fd, linea, n);
}

// rapido.cpp
FILE *f = fopen("salida.txt", "w");
for (int i = 0; i < 200000; i++) {
  fprintf(f, "%d\n", i);
}
```

```bash
strace -c ./lento
```

```text
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
 99,94    0,855684           4    200000           write
  0,03    0,000231          10        22           mmap
  0,01    0,000066          11         6           mprotect
------ ----------- ----------- --------- --------- ----------------
100,00    0,792353           3    200067         1 total
```

```bash
strace -c ./rapido
```

```text
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
100,00    0,000526           1       315           write
  0,00    0,000000           0        22           mmap
  0,00    0,000000           0         6           mprotect
------ ----------- ----------- --------- --------- ----------------
100,00    0,000822           2       383         1 total
```

| Medición | `./lento` | `./rapido` | Razón |
|---|---:|---:|---:|
| Llamadas a `write` | 200.000 | 315 | 635 × |
| Tiempo dentro del núcleo que cuenta `strace` | 0,792 s | 0,000822 s | 964 × |
| Tiempo de reloj sin `strace` | 0,12 s | 0,01 s | 12 × |

Cada `write` cruza la frontera, y escribir 32 bytes cuesta lo mismo que escribir
8.192: el precio no está en los datos sino en el cambio de modo y en la vuelta
al planificador. `fprintf` llena un búfer de 4 kB y solo entonces llama al
núcleo, y por eso 200.000 líneas caben en 315 llamadas. El mismo patrón aparece
cuando varios hilos escriben resultados a disco o a red línea por línea: los
hilos quedan serializados en la llamada al sistema y la aceleración se estanca
sin que la CPU aparezca ocupada.

Esto puede aparecer en el parcial, en la forma en que se planteó en clase: hay un
programa que tarda demasiado y hay que mostrar que el cuello de botella es la
escritura a disco. La respuesta es contar las llamadas al sistema.

## La caché simulada: Valgrind

Antes de leer un contador de fallos conviene tener presente contra qué se
mide. La caché no es una sola: L1 es la más pequeña y rápida y le pertenece a
cada hilo de hardware, L2 es por núcleo y L3 la comparten todos los núcleos del
procesador. Un fallo de L1 no llega a memoria si el dato está en L2 o en L3, y
además el procesador trae por adelantado lo que supone que sigue, de modo que
un recorrido ordenado encuentra en los niveles intermedios lo que todavía no
pidió. Por eso los contadores se leen en pareja: los fallos del primer nivel
dicen cuántas veces no estaba donde se buscó primero, y los del último, cuántas
veces hubo que ir hasta la RAM.

Valgrind es una herramienta de análisis dinámico para C y C++, y su componente
`callgrind` analiza las llamadas a funciones y el comportamiento de la caché. El
código instrumentado corre hasta diez veces más lento, así que no sirve para
medir tiempos absolutos sino para comparar patrones de acceso. Se compila
siempre con `-g`, que es lo que permite atribuir cada fallo a una función y a una
línea:

```bash
g++ -g -o bueno -Wall -Wextra Bueno.cpp
valgrind --tool=callgrind --dump-instr=yes \
    --simulate-cache=yes --collect-jumps=yes ./bueno
```

```text
==54691== Callgrind, a call-graph generating cache profiler
==54691== Command: ./bueno
[...]
999900000000
==54691== Events    : Ir Dr Dw I1mr D1mr D1mw ILmr DLmr DLmw
==54691== I   refs:      3,504,816,314
==54691== D   refs:      1,901,594,260  (1,501,108,221 rd + 400,486,039 wr)
==54691== D1  misses:       12,653,756  (    6,366,206 rd +   6,287,550 wr)
==54691== LLd misses:       12,518,925  (    6,262,120 rd +   6,256,805 wr)
==54691== D1  miss rate:           0.7% (          0.4%   +         1.6%  )
==54691== LLd miss rate:           0.7% (          0.4%   +         1.6%  )
```

| Opción | Función |
|---|---|
| `--tool=callgrind` | Usar el perfilador de llamadas |
| `--dump-instr=yes` | Volcar información de instrucciones |
| `--simulate-cache=yes` | Simular el comportamiento de la caché |
| `--collect-jumps=yes` | Evaluar los saltos del código |

Cada corrida deja un `callgrind.out.<pid>`, con lo que dos corridas dejan dos
archivos y no se pisan. Las métricas se nombran por nivel y por tipo de acceso:
`D1mr` y `D1mw` son los fallos de la caché L1 de datos en lectura y en
escritura, `DLmr` y `DLmw` los del último nivel, y la `I` delante señala la
caché de instrucciones. Esa separación entre lectura y escritura es la que
delata el problema.

El resumen que deja cada corrida en la terminal, puesto en una tabla:

| Contador | `./bueno` | `./malo` | Razón |
|---|---:|---:|---:|
| `I refs` (instrucciones) | 3.504.816.314 | 3.504.816.328 | 1,0 × |
| `D refs` (accesos a datos) | 1.901.594.260 | 1.901.594.268 | 1,0 × |
| `D1 misses` | 12.653.756 | 118.909.812 | 9,4 × |
| de lectura (`rd`) | 6.366.206 | 112.622.262 | 17,7 × |
| de escritura (`wr`) | 6.287.550 | 6.287.550 | 1,0 × |
| `LLd misses` | 12.518.925 | 104.365.640 | 8,3 × |
| `D1 miss rate` | 0,7 % | 6,3 % | 9,0 × |

Los fallos de escritura coinciden hasta el último dígito porque las dos
versiones inicializan la matriz igual: el `main` recorre por filas en los dos
archivos. La única diferencia está en `sumaMatriz`, que solo lee, y por eso el
desastre aparece completo en la columna de lectura. Una tasa de 6,3 % suena baja
hasta que se multiplica: 112 millones de fallos, cada uno esperando a la memoria
principal unos 200 ciclos. Las tasas de caché se leen siempre junto al número
absoluto de accesos.

### La tabla sin interfaz: `callgrind_annotate`

`callgrind_annotate` lee el mismo archivo que abre KCachegrind y escribe el
reporte en la terminal, que es lo que sirve en un servidor por SSH, en un
contenedor o en la máquina de la sala:

```bash
callgrind_annotate --threshold=95 callgrind.out.57031
```

```text
I1 cache: 32768 B, 64 B, 8-way associative
D1 cache: 32768 B, 64 B, 8-way associative
LL cache: 33554432 B, 64 B, direct-mapped
Events recorded:  Ir Dr Dw I1mr D1mr D1mw ILmr DLmr DLmw

Ir                     Dr                   D1mr                 file:function
1,800,240,044 (51.36%) 800,080,014 (53.30%)          3 ( 0.00%)  Malo.cpp:main
1,700,090,012 (48.51%) 700,040,005 (46.63%) 112,509,996 (99.90%) Malo.cpp:sumaMatriz(int**)
```

El 99,90 % de los fallos de lectura ocurre dentro de `sumaMatriz`, aunque esa
función aporta el 48,51 % de las instrucciones. Y el reporte baja un nivel más,
hasta anotar el fuente línea por línea:

```text
-- Auto-annotated source: Malo.cpp
Ir                     Dr                   D1mr                 DLmr
            3 ( 0.00%)           0                    .                    .           long sumaMatriz(int **matriz) {
            1 ( 0.00%)           0                    .                    .             long suma = 0;
       40,005 ( 0.00%)      20,002 ( 0.00%)           0                    .             for (int i = 0; i < SIZE; i++) {
  400,050,000 (11.41%) 200,020,000 (13.32%)           .                    .               for (int j = 0; j < SIZE; j++) {
1,300,000,000 (37.09%) 500,000,000 (33.31%) 112,509,996 (99.90%) 98,099,653 (99.99%)        suma += matriz[j][i];
```

| Función | `D1mr` en `./bueno` | `D1mr` en `./malo` |
|---|---:|---:|
| `main` (inicializa) | 3 | 3 |
| `sumaMatriz` (recorre) | 6.253.939 | 112.509.996 |

El reporte señala `suma += matriz[j][i];` y no el ciclo que la rodea. Ese nivel
de detalle es lo que justifica pagar el sobrecosto de la instrumentación: con
`perf` se sabe qué función cuesta, y con esta anotación cuál de sus líneas.

### KCachegrind y `cachegrind`

KCachegrind abre el mismo archivo con interfaz: a la izquierda el perfil plano,
con una fila por función, y a la derecha los eventos de la función seleccionada
con sus llamadores y llamados. Reporta `Incl.`, el costo de la función más el de
sus llamadas hijas; `Self`, el costo exclusivo; `Called`, cuántas veces se
invocó; y una columna por cada evento de caché. En la pestaña de eventos, cada
porcentaje es la parte de ese evento que le corresponde a la función
seleccionada, no la tasa de fallo del programa: un 99,90 en `D1mr` quiere decir
que casi todos los fallos de lectura del programa ocurren dentro de esa función.

`cachegrind` hace la mitad del trabajo de `callgrind`: simula la caché sin
reconstruir el grafo de llamadas, cuesta menos y entrega la cuenta global de
accesos y fallos por nivel. En Valgrind 3.25 la simulación viene apagada, y sin
la bandera la corrida imprime una sola línea con el conteo de instrucciones:

```bash
valgrind --tool=cachegrind --cache-sim=yes ./bueno
```

```text
==53035== Cachegrind, a high-precision tracing profiler
==53035== Command: ./bueno
--53035-- warning: L3 cache found, using its data for the LL simulation.
999900000000
==53035== I refs:        3,504,827,550
==53035== I1  misses:            2,044
==53035== LLi misses:            1,985
==53035== D refs:        1,901,594,260  (1,801,137,907 rd   + 100,456,353 wr)
==53035== D1  misses:       12,653,756  (    6,366,974 rd   +   6,286,782 wr)
==53035== LLd misses:       12,518,925  (    6,262,871 rd   +   6,256,054 wr)
==53035== D1  miss rate:           0.7% (          0.4%     +         6.3%  )
==53035== LL misses:        12,520,910  (    6,264,856 rd   +   6,256,054 wr)
==53035== LL miss rate:            0.2% (          0.1%     +         6.2%  )
```

| Línea del resumen | `./bueno` | `./malo` |
|---|---:|---:|
| `I refs` | 3.504.827.550 | 3.504.827.564 |
| `I1 miss rate` | 0,00 % | 0,00 % |
| `D refs` | 1.901.594.260 | 1.901.594.268 |
| `D1 misses` | 12.653.756 | 118.909.812 |
| `D1 miss rate` | 0,7 % | 6,3 % |
| `LL misses` | 12.520.910 | 104.367.625 |
| `LL miss rate` | 0,2 % | 1,9 % |

`I1 misses` vale 2.044 en las dos corridas y la tasa redondea a 0,00 %: el ciclo
interno cabe de sobra en la caché de instrucciones, así que el código no es el
problema, lo son los datos que ese código pide. En `./malo`, de los 118,9
millones de fallos de L1 hay 104,3 millones que tampoco encuentran el dato en el
último nivel y terminan en memoria principal, el 88 % de los fallos: la matriz
de 400 MB no cabe en los 32 MB del último nivel, y recorrerla por columnas hace
que ninguna línea siga viva cuando vuelva a hacer falta.

El encabezado del reporte anota la jerarquía que simuló: `D1` de 32 kB con
líneas de 64 bytes y ocho vías, `LL` de 32 MB con líneas de 64 bytes. Valgrind
la lee de la CPU de la máquina, así que los números cambian al correr el mismo
binario en otro procesador.

### Perfilar una porción

Perfilar un programa grande entero cuesta tiempo y casi nunca hace falta. Las
macros de `callgrind.h` delimitan qué se instrumenta:

```cpp
#include <valgrind/callgrind.h>

int main() {
    inicializar_datos();  // no se perfila

    CALLGRIND_START_INSTRUMENTATION;
    CALLGRIND_TOGGLE_COLLECT;
    funcion_sospechosa();  // se perfila
    CALLGRIND_TOGGLE_COLLECT;
    CALLGRIND_STOP_INSTRUMENTATION;

    procesar_resultados(); // no se perfila
}
```

```bash
valgrind --tool=callgrind --dump-instr=yes --simulate-cache=yes \
    --collect-jumps=yes --collect-atstart=no --instr-atstart=no ./programa
```

```text
==25467== I   refs:      1,700,090,015
==25467== D   refs:        900,060,011  (700,040,006 rd + 200,020,005 wr)
==25467== D1  misses:        6,253,943  (  6,253,942 rd +           1 wr)
==25467== LLd misses:        6,253,943  (  6,253,942 rd +           1 wr)
==25467== D1  miss rate:           0.7% (        0.9%   +         0.0%  )
```

La cuenta cae a 1.700.090.015 instrucciones, las de la función acotada, y los
fallos quedan en 6.253.942 de lectura y uno de escritura: la reserva y la
inicialización de la matriz ya no entran en la medición. Así se aísla la función
sospechosa y se comparan versiones sin pagar el sobrecosto de instrumentar la
carga de datos.

## Los contadores del procesador: `perf`

`perf` es una herramienta del núcleo de Linux que lee los contadores de
rendimiento del hardware: registros de la CPU que cuentan ciclos, instrucciones,
fallos de caché y predicciones erróneas de salto. Valgrind simula la caché en
software, instrumenta cada acceso y produce una traza completa a cambio de diez
veces el tiempo; `perf` lee los contadores reales y trabaja por muestreo,
interrumpiendo el programa cada cierto número de eventos para anotar dónde
estaba. El sobrecosto es despreciable, así que sirve incluso en producción.

Leer esos contadores pide privilegios, y es la razón por la que la herramienta
falla en la sala:

```bash
sysctl kernel.perf_event_paranoid
```

```text
kernel.perf_event_paranoid = 2
```

Con el parámetro en 2 o menos se mide un programa propio, que es el caso de toda
la sesión. Pedir los contadores de la máquina entera responde otra cosa:

```bash
perf stat -a -e cycles,instructions sleep 1
```

```text
perf_event_paranoid setting is 2:
  -1: Allow use of (almost) all events by all users
      Ignore mlock limit after perf_event_mlock_kb without CAP_IPC_LOCK
>= 0: Disallow raw and ftrace function tracepoint access
>= 1: Disallow CPU event access
>= 2: Disallow kernel profiling
```

La propia salida lista qué habilita cada valor: la máquina entera pide 1 o menos.
Se baja con `sudo sysctl -w kernel.perf_event_paranoid=1`, y el cambio se pierde
al reiniciar salvo que quede escrito en `/etc/sysctl.conf`.

El catálogo de eventos depende del modelo de CPU. El de la máquina de las
mediciones trae 614 eventos y solo tres tocan la caché L1 de datos con nombre
genérico:

```bash
perf list | grep -A1 dcache
```

```text
  l1-dcache-load-misses
       [Level 1 data cache read misses. Unit: cpu]
  l1-dcache-loads
       [Level 1 data cache read accesses. Unit: cpu]
  l1-dcache-prefetches
       [Level 1 data cache prefetch accesses. Unit: cpu]
```

El tercero cuenta las líneas que el procesador trajo antes de que nadie las
pidiera. Ese captador anticipado es el que hace funcionar el recorrido por
filas. El resto de la lista son los eventos propios del modelo, con nombres que
no viajan a otra máquina, y un script de medición escrito contra ellos queda
amarrado al procesador donde se escribió. El sufijo `:u`, como en `cycles:u`,
filtra los eventos de espacio de usuario y deja fuera el tiempo dentro del
núcleo, el planificador y los manejadores de interrupción.

### `perf stat` sobre un proceso que ya está corriendo

El programa paralelo sigue trabajando en la otra terminal, y `perf` se engancha
a su PID:

```bash
perf stat -p 102237 sleep 5
```

```text
 Performance counter stats for process id '102237':

                 0      context-switches:u        #  0,0 cs/sec  cs_per_second
                 0      cpu-migrations:u          #  0,0 migrations/sec  migrations_per_second
                 0      page-faults:u             #  0,0 faults/sec  page_faults_per_second
         51.361,10 msec task-clock:u              #  10,2 CPUs  CPUs_utilized
         3.688.576      branch-misses:u           #  0,0 %  branch_miss_rate          (50,03%)
    36.032.967.962      branches:u                #  701,6 M/sec  branch_frequency     (66,71%)
   197.325.259.436      cpu-cycles:u              #  3,8 GHz  cycles_frequency         (66,71%)
   175.840.655.774      instructions:u            #  0,9 instructions  insn_per_cycle  (66,70%)
     5.079.247.275      stalled-cycles-frontend:u #  0,03 frontend_cycles_idle         (66,68%)

       5,006738898 seconds time elapsed
```

El `sleep 5` no se está midiendo: `perf` necesita un comando que marque el final
de la medición, y con `-p` los contadores se leen del proceso indicado. Cinco
segundos y lo suelta, con el proceso siguiendo su marcha.

Los 51.361 milisegundos de `task-clock` en 5,006 segundos de reloj dan las
`10,2 CPUs`: el proceso consumió diez veces más tiempo de CPU que tiempo
transcurrido porque estaba en diez núcleos a la vez. Medido desde afuera y sin
tocar el fuente, ese número comprueba que la paralelización funciona.

| Métrica | Qué indica |
|---|---|
| `task-clock` | Tiempo que la CPU ejecutó instrucciones del proceso |
| `instructions` entre `cycles` | IPC: por encima de 1 va bien, por debajo el procesador espera |
| `context-switches` | Cambios de contexto; muchos señalan contención |
| `cpu-migrations` | Proceso movido entre núcleos, con la caché caliente invalidada |
| `branch-misses` | Predicciones de salto fallidas; por encima del 5 % se revisa la lógica |

El IPC es el primer número que se mira. Aquí vale 0,9 en un ciclo que solo
acumula enteros: la aritmética no es lo que cuesta, el procesador pasa la mayor
parte de los ciclos esperando datos. Optimizar las operaciones de ese programa
no cambiaría nada; lo que hay que arreglar es el acceso a memoria.

Los porcentajes entre paréntesis miden otra cosa: el tiempo que ese contador
estuvo activo. La CPU tiene menos registros de contadores que eventos pedidos,
así que el núcleo los rota y después escala las cifras, y con nueve eventos y
seis registros cada uno alcanza dos tercios del tiempo. Pedir pocos eventos a la
vez evita el reparto.

### Los fallos de caché, en el hardware

De vuelta a los dos programas del comienzo, con `--repeat 10` para que promedie
diez corridas y reporte la desviación:

```bash
perf stat --repeat 10 -e cycles:u -e instructions:u \
    -e l1-dcache-loads:u -e l1-dcache-load-misses:u ./bueno
```

```text
 Performance counter stats for './bueno' (10 runs):

     1.177.787.894      cycles:u                        ( +-  0,15% )
     3.504.983.954      instructions:u                  ( +-  0,00% )
     1.108.892.990      l1-dcache-loads:u               ( +-  0,00% )
        13.219.995      l1-dcache-load-misses:u         ( +-  0,14% )

           0,43538 +- 0,00164 seconds time elapsed  ( +-  0,38% )
```

| Evento | `./bueno` | `./malo` | Razón |
|---|---:|---:|---:|
| `instructions:u` | 3.504.983.954 | 3.504.984.293 | 1,0 × |
| `l1-dcache-loads:u` | 1.108.892.990 | 1.111.367.503 | 1,0 × |
| `l1-dcache-load-misses:u` | 13.219.995 | 120.227.697 | 9,1 × |
| `cycles:u` | 1.177.787.894 | 2.796.626.915 | 2,4 × |
| Tiempo transcurrido | 0,43538 s | 0,79385 s | 1,8 × |

Trece millones de fallos sobre mil cien millones de lecturas es una tasa cercana
al 1,2 %: la caché sirve casi todo. El recorrido por columnas pide las mismas
lecturas y falla en casi el 11 % de ellas. Las dos primeras filas son idénticas,
la tercera explica las dos últimas, y el patrón de acceso a memoria es lo que
duplica el tiempo.

Los eventos genéricos `cache-references` y `cache-misses` miran el último nivel:
cuántos accesos llegaron hasta allí y cuántos siguieron de largo hacia la
memoria principal.

```bash
perf stat --repeat 10 -e cache-references,cache-misses,instructions,cycles ./malo
```

```text
 Performance counter stats for './malo' (10 runs):

       397.645.281      cache-references:u        ( +-  0,17% )
       108.341.596      cache-misses:u            ( +-  0,02% )
     3.504.981.715      instructions:u            ( +-  0,00% )
     3.211.385.373      cycles:u                  ( +-  1,10% )

       1,044781297 +- 0,013348942 seconds time elapsed  ( +-  1,28% )
```

| Evento | `./bueno` | `./malo` | Razón |
|---|---:|---:|---:|
| `instructions` | 3.504.981.209 | 3.504.981.715 | 1,0 × |
| `cache-references` | 20.315.439 | 397.645.281 | 19,6 × |
| `cache-misses` | 260.870 | 108.341.596 | 415 × |
| `cycles` | 2.001.530.252 | 3.211.385.373 | 1,6 × |
| Tiempo transcurrido | 0,7301 s | 1,0448 s | 1,4 × |

Cuatrocientas quince veces. La cuenta de instrucciones coincide en las siete
primeras cifras, así que el procesador ejecuta el mismo trabajo. Lo que cambia
es que en `./bueno` el captador anticipado acierta y casi nada llega al último
nivel, mientras en `./malo` cada salto de columna pide una línea que nadie
predijo y que ya no está en ningún nivel de caché.

### Grabar y analizar: `perf record` y `perf report`

`perf stat` da totales. `perf record` guarda muestras en un archivo `perf.data`
y `perf report` las analiza después, función por función. La opción `-F 99` fija
la frecuencia de muestreo en 99 Hz, y `-g` captura la pila de llamadas en cada
muestra:

```bash
perf record -g -e cycles:u -e instructions:u \
    -e l1-dcache-loads:u -e l1-dcache-load-misses:u -F 99 ./bueno
```

```text
999900000000
[ perf record: Woken up 2 times to write data ]
[ perf record: Captured and wrote 0,031 MB perf.data (276 samples) ]
```

Sobre `./malo` el mismo comando captura 397 muestras. A 99 Hz, más muestras es
más tiempo vivo, y el tamaño del archivo ya contrasta antes de abrir el reporte.
Subir la frecuencia da más resolución a cambio de un archivo mayor y de más
sobrecosto; 1.000 Hz es lo que se usa cuando hace falta ver una función que dura
milisegundos. El `perf.data` es binario: abrirlo con `cat` o con `head` muestra
basura, y lo que lo lee es `perf report` o `perf script`.

Sin `-g` se sabe qué función es costosa; con `-g` se sabe además por qué camino
de llamadas se llegó a ella, lo que importa cuando una función de librería se
llama desde cinco sitios distintos y solo uno la está llamando un millón de
veces. Esa pila es también la base de los *flame graphs*.

```bash
perf report --stdio     # sin interfaz interactiva
perf report --sort=dso  # agrupado por librería compartida
```

```text
# Samples: 202  of event 'cpu/cycles/Pu'
# Event count (approx.): 2006790974
#
# Children      Self  Command  Shared Object         Symbol
# ........  ........  .......  ....................  ...............................
#
    99.97%     0.00%  malo     malo                  [.] _start
            |
            ---_start
               __libc_start_main
```

| Columna | Significado |
|---|---|
| `Overhead`, `Self` | Porcentaje de muestras dentro de esa función |
| `Children` | Porcentaje incluyendo las funciones hijas |
| `Shared Object` | Binario o librería donde vive el símbolo |
| `[.]` y `[k]` | Código de usuario y código del núcleo |

Si el binario se compiló sin `-g` o se le quitaron los símbolos, el reporte queda
en hexadecimal: `perf report` necesita símbolos para traducir una dirección a un
nombre de función. Compilar con `-g`, no aplicar `strip` e instalar los paquetes
de símbolos de las librerías del sistema resuelve la mayoría de los casos.

## El perfil en el navegador

El Firefox Profiler visualiza los datos de `perf` en el navegador usando el
formato Gecko, con *flame graphs* interactivos, zoom sobre un intervalo y
filtrado por proceso y por hilo:

```bash
perf record -g -F 99 ./malo
perf script report gecko
```

```text
Staring Firefox Profiler on your default browser...
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
Opening in existing browser session.
127.0.0.1 - - [26/Mar/2026 12:05:22] "GET /gecko_profile.json HTTP/1.1" 200 -
[ perf gecko: Captured and wrote into gecko_profile.json ]
```

Quedan dos cosas: el servidor en el puerto 8000, que sirve el perfil mientras la
terminal siga abierta, y el archivo `gecko_profile.json`, que se guarda y se
carga después en <https://profiler.firefox.com> desde otra máquina. El ancho de
cada barra del *flame graph* es la proporción de muestras en esa función y el
apilamiento vertical es la cadena de llamadas, así que una meseta ancha en la
mitad del gráfico señala dónde se va el tiempo sin leer una tabla de cien filas.

En clase la demostración se hizo dos veces. La primera grabación salió sin `-g`
y sin pedir evento, y el visor abrió el árbol de llamadas con `main` y
`sumaMatriz` pero sin el detalle que se buscaba. La segunda, con
`perf record -e cache-misses`, se leyó con `perf report`, que atribuyó cerca del
94 % de los fallos a `sumaMatriz` y alrededor del 5 % a `main`. Dos cosas quedan
de ahí: las banderas de la grabación deciden qué se puede preguntar después, y el
reporte en texto contesta preguntas que el visor no.

Grabar la máquina entera vuelve al asunto de los permisos:

```bash
perf record -a -g -F 99 sleep 60
```

```text
Error:
Failure to open event 'cpu/cycles/Pu' on PMU 'cpu' which will be removed.
Access to performance monitoring and observability operations is limited.
Consider adjusting /proc/sys/kernel/perf_event_paranoid setting to open
access to performance monitoring and observability operations for processes
without CAP_PERFMON, CAP_SYS_PTRACE or CAP_SYS_ADMIN Linux capability.
```

El mensaje dice dónde se ajusta. Sobre un proceso propio, con
`perf record -g -p <pid> sleep 10`, no hace falta tocar nada.

## La misma diferencia, medida de cuatro formas

El mismo par de programas, los mismos tres caracteres de diferencia, cuatro
instrumentos:

| Herramienta | Lo que compara | `malo` sobre `bueno` |
|---|---|---:|
| `/usr/bin/time -v` | Tiempo de usuario | 1,4 × |
| `cachegrind` | `D1 misses` simulados | 9,4 × |
| `callgrind` | `D1mr` de `sumaMatriz` | 18,0 × |
| `perf` | `cache-misses` reales | 415 × |

Ninguna de las cuatro es la medida verdadera. El perfilador estadístico tiene
el margen de su muestreo, y el determinista cuenta cada evento pero mete
sobrecosto, que a su vez cambia lo que mide: un cocinero trabaja distinto con
alguien anotándole cada movimiento. Dentro de una máquina virtual o de un
contenedor, además, `perf` depende de que el anfitrión exponga los contadores
del procesador, y lo corriente es que no lo haga.

Las razones no coinciden porque no miden lo mismo. Valgrind simula un modelo de
caché sin captador anticipado y cuenta accesos de primer nivel; `perf` lee el
hardware, donde el captador ya escondió casi todos los fallos de `./bueno` y
ninguno de los de `./malo`. Cuanto más abajo se mide, más grande se ve la
diferencia, y el tiempo de reloj, arriba del todo, es el que menos se mueve. Al
reportar una mejora conviene decir con qué se midió.

## El orden de trabajo

| Paso | Herramienta | Qué se pregunta |
|---|---|---|
| 1. Visión general | `top`, `htop`, `ps` | Quién consume CPU y memoria, cuántos hilos hay |
| 2. Patrón de caché | Valgrind | Localidad, tasa de fallo, qué línea del fuente |
| 3. Contadores | `perf` | IPC real, ciclos, fallos en el hardware |

1. Perfilar antes de optimizar, sin suponer dónde está el cuello de botella.
2. Ejecutar varias veces y mirar la desviación que reporta `perf stat --repeat N`.
3. Compilar con `-g` en los dos casos: Valgrind lo necesita para atribuir el
   fallo a una línea y `perf report` para mostrar nombres en vez de direcciones.
   Para `perf`, medir además sobre código optimizado con `-O2` y sin `strip`.
4. Valgrind para diagnosticar el patrón de caché, `perf` para medir el impacto
   real en tiempo.
5. Mirar la separación entre lectura y escritura: una tasa alta de fallo de
   escritura apunta al orden de los índices, no al algoritmo.
6. Verificar el número de hilos con `ps -o thcount` antes de perfilar un
   programa paralelo.

| Característica | `top` y `ps` | Valgrind | `perf` |
|---|---|---|---|
| Lenguajes | cualquiera | C y C++ | cualquiera |
| Sobrecosto | nulo | alto, diez veces | mínimo |
| Caché | no | simulada | real, contadores |
| Lectura y escritura por separado | no | sí | según el evento |
| Nivel de detalle | proceso | función y línea | función |
| Sobre un proceso vivo | sí | no | sí |
| Visualización | terminal | KCachegrind | Firefox Profiler |

## Lecturas

- Manual de callgrind: <https://valgrind.org/docs/manual/cl-manual.html>
- Wiki de `perf`: <https://perfwiki.github.io/main/>
- Documentación del Firefox Profiler: <https://profiler.firefox.com/docs/>
- En la propia máquina: `man top`, `man ps`, `man perf-stat`, `man perf-record`.

## Lo que quedó pendiente

El ejercicio del Campus Virtual quedó para la casa: el campus no abrió al final
de la sesión. Son cuatro pasos sobre el código de la sesión: habilitar la bandera
de paralelismo, perfilar con `perf`, revisar la caché con `cachegrind` y escribir
una versión rápida explicando por qué lo es. No hay que programar nada nuevo: se
ejecuta, se observa lo que devuelve cada herramienta y se escribe la conclusión. La documentación del ejercicio
cubre `ps`, `top`, `htop`, Valgrind y `perf`, y las herramientas están
instaladas en los computadores de la sala.

Las corridas de `callgrind`, `cachegrind` y KCachegrind se mostraron sobre
trazas preparadas, porque instrumentar la matriz entera en vivo se lleva la
clase. Correrlas con el código de la sesión es la forma de ver la diferencia
entre el reporte que sale en segundos y el que tarda minutos. La instrumentación
por porciones quedó nombrada en el mismo punto, con las macros a la vista y sin
corrida. Grafana y Prometheus quedaron mencionados al pasar, como las
herramientas con que se monitorea un clúster.

Las [actividades del navegador](../../../actividades/infra/profiling-linux/index.md) siguen el orden de los temas de
la sesión: los dos programas que hacen la misma cuenta, el programa paralelo
visto desde afuera, las llamadas al sistema contadas una por una, los fallos de
caché de Valgrind, los contadores del procesador y la misma diferencia medida de
cuatro formas.

El [código de la sesión](./codigo/README.md) está completo, con el `Makefile`,
las órdenes de perfilado de cada programa y lo que imprimió cada una.

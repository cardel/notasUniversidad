# Código de la sesión

Siete programas en C++ para perfilar desde afuera. Ninguno enseña un algoritmo
nuevo: todos son la excusa para que una herramienta tenga algo que medir. Las dos
versiones de la suma de la matriz se diferencian en tres caracteres, y las dos
que escriben a disco se diferencian en quién pone el búfer.

| Archivo | Qué muestra |
|---|---|
| `programa.cpp` | Suma de una matriz de 10.000 por 10.000 recorrida por filas; es la base para `valgrind` y `callgrind` |
| `Bueno.cpp` | La misma suma con `matriz[i][j]`, acceso contiguo |
| `Malo.cpp` | La misma suma con `matriz[j][i]`, que salta a otra fila en cada acceso |
| `programa_secciones.cpp` | La misma suma con las macros de `callgrind.h`, para instrumentar solo una porción |
| `paralelo.cpp` | Suma con OpenMP repetida N veces; dura lo bastante para verla en `top` y en `ps` |
| `lento.cpp` | 200.000 líneas escritas con una llamada `write` por línea |
| `rapido.cpp` | Las mismas líneas con `fprintf`, que acumula en un búfer |

## Compilar y correr

El `Makefile` compila los siete con `-g -Wall -Wextra`, agrega `-O2` a los dos
que escriben a disco y `-fopenmp` al paralelo. El `-g` no es opcional aquí: es
lo que permite a Valgrind y a `perf` nombrar la función y la línea en vez de
imprimir direcciones.

```bash
make
```

```text
g++ -g -Wall -Wextra -o programa programa.cpp
g++ -g -Wall -Wextra -o bueno Bueno.cpp
g++ -g -Wall -Wextra -o malo Malo.cpp
g++ -g -Wall -Wextra -O2 -o lento lento.cpp
g++ -g -Wall -Wextra -O2 -o rapido rapido.cpp
g++ -g -Wall -Wextra -O2 -fopenmp -o paralelo paralelo.cpp
g++ -g -Wall -Wextra -o programa_secciones programa_secciones.cpp
```

```bash
./bueno
./malo
```

```text
999900000000
999900000000
```

Las dos versiones imprimen el mismo total, que es el punto de partida de la
sesión. `programa` y `programa_secciones` imprimen lo mismo.

`make limpiar` borra los ejecutables y el `salida.txt` que dejan `lento` y
`rapido`. `programa_secciones` necesita las cabeceras de Valgrind
(`valgrind/callgrind.h`), que vienen en el paquete de desarrollo.

## Las órdenes de perfilado

Una orden por herramienta, con la línea de la traza que contesta la pregunta.
Las trazas completas están en los apuntes de la sesión.

El programa paralelo corre en una terminal con `./paralelo 900` y se consulta
desde otra:

```bash
top -b -n1 -o %CPU | head -n 11
```

```text
 102237 cardel    20   0  488792 395268   4084 R 919,1   1,2   1:21.05 paralelo
```

```bash
ps -o user,pid,thcount,pcpu,pmem,cputime,cmd -p 102237
ps -o pid,tid,psr,pcpu,comm -T -p 102237
```

```text
USER         PID THCNT %CPU %MEM     TIME CMD
cardel    102237    12  981  1.2 00:01:21 ./paralelo 900
```

El costo que el núcleo lleva contabilizado del proceso:

```bash
/usr/bin/time -v ./bueno
```

```text
	User time (seconds): 0.59
	Minor (reclaiming a frame) page faults: 97870
```

Las llamadas al sistema de los dos que escriben a disco:

```bash
strace -c ./lento
```

```text
 99,94    0,855684           4    200000           write
```

La caché simulada, primero el total y después la función y la línea:

```bash
valgrind --tool=callgrind --dump-instr=yes \
    --simulate-cache=yes --collect-jumps=yes ./malo
```

```text
==57031== D1  misses:      118,909,812  (  112,622,262 rd +   6,287,550 wr)
```

```bash
callgrind_annotate --threshold=95 callgrind.out.57031
```

```text
1,700,090,012 (48.51%) 700,040,005 (46.63%) 112,509,996 (99.90%) Malo.cpp:sumaMatriz(int**)
```

Para `programa_secciones` van además `--collect-atstart=no` y
`--instr-atstart=no`, que dejan fuera de la medición la reserva y la
inicialización de la matriz. Con `--tool=cachegrind --cache-sim=yes` se obtiene
la cuenta por nivel sin el grafo de llamadas.

Los contadores del hardware:

```bash
perf stat --repeat 10 -e cycles:u -e instructions:u \
    -e l1-dcache-loads:u -e l1-dcache-load-misses:u ./malo
```

```text
       120.227.697      l1-dcache-load-misses:u         ( +-  0,02% )
```

```bash
perf record -g -F 99 ./malo
```

```text
[ perf record: Woken up 1 times to write data ]
[ perf record: Captured and wrote 0,020 MB perf.data (202 samples) ]
```

El reporte se lee con `perf report --stdio`, y `perf script report gecko` levanta
el visor en el navegador.

## Lo que imprimió cada uno

Las cifras son las de la máquina de las mediciones de la sesión, doce hilos
lógicos. En otra máquina los tiempos cambian; lo que se repite es el orden entre
programas y el conteo de llamadas al sistema.

| Programa | Salida | Medición |
|---|---|---|
| `programa` | `999900000000` | 2.567 llamadas al sistema, 2.503 de ellas `brk` |
| `bueno` | `999900000000` | 0,43538 s, 13.219.995 fallos de L1 de lectura |
| `malo` | `999900000000` | 0,79385 s, 120.227.697 fallos de L1 de lectura |
| `programa_secciones` | `999900000000` | 1.700.090.015 instrucciones en la porción instrumentada |
| `lento` | `salida.txt` con 200.000 líneas | 200.000 llamadas a `write` |
| `rapido` | `salida.txt` con 200.000 líneas | 315 llamadas a `write` |
| `paralelo` | seis por repetición | 919,1 % de CPU en `top`, doce hilos en `ps` |

`paralelo` acumula el residuo de la suma entre siete, así que imprime seis por
cada repetición: `./paralelo 20` responde `120`. El número de repeticiones es el
margen que se le da a la consulta desde la otra terminal, de modo que conviene
pedirle muchas y mirar el proceso mientras trabaja.

Los dos programas que escriben a disco producen archivos idénticos. La
diferencia está completa en el conteo de `strace -c`: 200.000 llamadas contra
315, que son las que caben en un búfer de 4 kB. Esa es la reproducción más
estable de toda la sesión, porque el número de llamadas al sistema no depende de
la máquina.

`bueno` y `malo` ejecutan las mismas 3.504.983.954 instrucciones y piden las
mismas 1.108.892.990 lecturas a la caché L1. Lo que las separa son los fallos de
esas lecturas, nueve veces más en el recorrido por columnas, y los ciclos que la
CPU gasta esperando a la memoria. La diferencia de tiempo se queda alrededor del
80 %; medida en fallos del último nivel con `perf`, llega a 415 veces.

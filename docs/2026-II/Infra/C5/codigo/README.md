# Código de la sesión

Siete programas en C++ con OpenMP. Todos se compilan con `-fopenmp`; sin esa
bandera el compilador descarta las directivas y produce un binario de un solo
hilo, que es justamente lo que comprueba el primero.

| Archivo | Qué muestra |
|---|---|
| `equipo.cpp` | Un saludo por hilo, compilado con la bandera y sin ella |
| `hilos.cpp` | `omp_get_max_threads()` frente a `omp_get_num_threads()` |
| `entorno.cpp` | Lo que `OMP_NUM_THREADS`, `OMP_DYNAMIC` y `OMP_SCHEDULE` le dicen a la biblioteca |
| `anidado.cpp` | Una región paralela dentro de otra, con un nivel y con dos |
| `carrera.cpp` | La suma sin `reduction` y lo que reporta ThreadSanitizer |
| `asociativa.cpp` | Por qué la misma suma da distinto al repartirla y con `-ffast-math` |
| `escalado.cpp` | La integral que calcula pi, para el barrido de hilos |

## Compilar y correr

```bash
g++ -std=c++17 -fopenmp -O2 equipo.cpp -o equipo
OMP_NUM_THREADS=4 ./equipo
```

```text
compilado con OpenMP
  hola desde el hilo 1 de 4
  hola desde el hilo 0 de 4
  hola desde el hilo 3 de 4
  hola desde el hilo 2 de 4
```

El mismo archivo sin `-fopenmp` imprime una sola línea y el hilo 0 de 1. El
orden de los saludos cambia en cada corrida.

## Lo que imprime cada uno

```text
./entorno                    max_threads 12 · dynamic 0 · schedule dynamic, trozo 1
OMP_NUM_THREADS=4 ./entorno  max_threads 4
./anidado                    equipos internos de 1 hilo
OMP_MAX_ACTIVE_LEVELS=2      equipos internos de 3 hilos
./carrera                    suma 1562487500, 937487500, 2187487500 en tres corridas
./asociativa                 secuencial 16.695311365857272 · paralela 16.695311365859137
./escalado                   1 hilo 2028,5 ms · 2 hilos 737,4 ms · 6 hilos 245,9 ms · 12 hilos 246,0 ms
```

Las corridas se hicieron limitando el programa a doce hilos lógicos, que es la
máquina de las mediciones de la sesión. En otra máquina los tiempos cambian; lo
que se repite es la forma: el tiempo baja casi a la mitad mientras hay núcleos
libres y deja de bajar cuando los hilos empiezan a compartir núcleo.

`carrera.cpp` da un resultado distinto cada vez, y ninguno es el correcto
(4 999 950 000). Conviene correrlo varias veces: una carrera de datos que
aparece a veces se caza repitiendo. Para verla señalada con archivo y línea:

```bash
g++ -std=c++17 -fopenmp -fsanitize=thread -g -O1 carrera.cpp -o carrera
OMP_NUM_THREADS=4 ./carrera
```

## Depurar los hilos

`ordenes.gdb` trae la secuencia que se usó en clase sobre `escalado.cpp`:
detener el programa, listar los hilos, entrar en uno y mirar sus variables.

```bash
g++ -std=c++17 -fopenmp -g -O0 escalado.cpp -o escalado
OMP_NUM_THREADS=4 gdb -batch -x ordenes.gdb ./escalado
```

El `-g` es el que deja los símbolos y el `-O0` el que impide que el optimizador
borre las variables locales. Con `-O2` el depurador se detiene donde debe, pero
`print suma` responde que el valor fue optimizado.

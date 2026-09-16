# Código de la sesión

Los ocho programas que se corrieron o se leyeron en clase, uno por
estrategia. Cada carpeta trae su `Makefile`: `make` compila con `-O2`,
ejecuta y deja el programa listo para volver a correr.

| Carpeta | Estrategia |
|---|---|
| `01-descomposicion-de-datos` | Partir los datos en trozos disjuntos: la suma con `std::thread` |
| `02-descomposicion-de-tareas` | Repartir trabajos distintos sobre los mismos datos |
| `02b-divide-y-venceras` | Mergesort con corte por profundidad y por tamaño mínimo |
| `03-granularidad` | Cuánto trabajo debe tener una tarea para que repartir valga la pena |
| `04-balanceo-de-carga` | Reparto fijo contra reparto por demanda con carga desigual |
| `05-tbb-parallel-for-reduce` | Delegar el reparto en Intel TBB |
| `06-dependencias-y-scan` | La suma de prefijos en dos pasadas |
| `07-pipeline` | Tres etapas encadenadas y colas entre ellas |

## Compilar

```bash
sudo apt install build-essential libtbb-dev   # TBB solo hace falta para el 05
cd 01-descomposicion-de-datos && make
```

Todos usan `-std=c++17 -O2` y `-pthread`; el de TBB enlaza con `-ltbb`. Si
se compila a mano sin `-O2`, como se hizo en clase con el primero, los
tiempos cambian de naturaleza: la suma queda limitada por el procesador en
vez de por la memoria y escala mucho mejor con los hilos. Es el mismo
programa; lo que cambió es cuánto trabajo le cuesta cada elemento.

## Lo que se cambió en vivo

Sobre `suma.cpp` se probaron tres cosas que no están en el archivo:

- `N = 10000` en lugar de doscientos millones, con el reloj en
  `nanoseconds`. La fila de ocho hilos pasa a ser la más lenta: crear los
  hilos cuesta más que sumar mil doscientos números.
- Acumular sobre `salida` dentro del ciclo en vez de sobre la local `s`. Con
  doscientos millones, la fila de dos hilos gana un dígito: false sharing
  sobre el vector de parciales.
- Volver a doscientos millones y a milisegundos, que es como está el archivo.

En `02b-divide-y-venceras`, `taskset -c 0-3 ./mergesort` reproduce la
condición de las diapositivas, cuatro núcleos. En `06-dependencias-y-scan`,
quitar la función `peso` y acumular `v[i]` directo muestra la versión en dos
pasadas perdiendo: cuando el programa solo mueve memoria, la segunda pasada
cuesta más de lo que ahorra el reparto.

# Código de la sesión

Los programas que se corrieron en clase, más el archivo en C que se escribió
en vivo para explicar qué hay debajo de una lista.

| Archivo | Qué muestra |
|---|---|
| `llenar_matriz.py` | Las dos maneras de llenar una matriz: ciclos de Python contra el método del arreglo |
| `relojes.py` | `perf_counter` contra `process_time` sobre el mismo fragmento |
| `fib_profile.py` | `fib(35)` bajo `cProfile`, con y sin memoización |
| `montecarlo.py` | Estimación de pi perfilada con Pyinstrument, con `uniform` y con `random` |
| `encaje_simd.py` | Cinco patrones sobre el mismo arreglo, y cuál aprovecha los carriles |
| `listas_vs_numpy.py` | Cuatro formas de sumar los mismos números, y el envolvente de NumPy |
| `arreglo.c` | `arr[i]` como azúcar sintáctico de `*(arr + i)` |

## El ambiente

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Los programas de perfilado no necesitan nada más; `arreglo.c` se compila con
`gcc -Wall -o arreglo arreglo.c`.

## Correr

```bash
python llenar_matriz.py 2000     # el tamaño es opcional; el de la sesión es 10000
python relojes.py
python fib_profile.py
python montecarlo.py uniform     # y después: python montecarlo.py random
python encaje_simd.py
python listas_vs_numpy.py        # el tamaño también es opcional
```

Los tiempos de cada máquina son distintos; lo que se repite son las
proporciones. En la máquina donde se preparó esta sesión, `fib(35)` sin
memoización hace 29 860 712 llamadas y con memoización 45, la misma cifra que
salió en clase, porque el número de llamadas no depende de la máquina.

`llenar_matriz.py` con 10 000 reserva 800 MB por cada matriz y los ciclos
anidados recorren cien millones de posiciones: conviene empezar con un tamaño
menor y subirlo. Lo mismo con `listas_vs_numpy.py`, donde una lista de cien
millones de enteros de Python no cabe en cualquier máquina.

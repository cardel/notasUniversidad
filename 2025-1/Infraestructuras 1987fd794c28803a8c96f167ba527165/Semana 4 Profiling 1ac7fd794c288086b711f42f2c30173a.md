# Semana 4. Profiling

# Profiling

[Notas_annotated.pdf](Academico/Universidad/2025-1/Infraestructuras%201987fd794c28803a8c96f167ba527165/Semana%204%20Profiling%201ac7fd794c288086b711f42f2c30173a/Notas_annotated.pdf)

# Instalación ambientes Python

```bash
python -m venv ambiente
source ambiente/bin/activate
pip install numpy pyinstrument
```

# Herramientas de profiling

## time

```python
import time
import numpy
import matplotlib.pyplot as plt

def ordenar(arr):
    arr.sort()
    return arr

def main():
    t = []
    x = [1000,5000,10000,20000,50000,100000,200000,500000,1000000]
    for n in x:
        arr = numpy.random.rand(n)
        start = time.time()
        ordenar(arr)
        end = time.time()
        t.append(end - start)
        print("Tiempo de ejecución: ", end - start)
    plt.figure(dpi=300)
    plt.plot(x, t, 'o-')
    plt.xlabel('Tamaño del arreglo')
    plt.ylabel('Tiempo de ejecución (s)')
    plt.title('Tiempo de ejecución de la función ordenar')
    plt.grid()
    plt.savefig('tiempo1.png')

if __name__ == "__main__":
    main()

```

## timeit

```python
import timeit
import numpy
import matplotlib.pyplot as plt

def ordenar(arr):
    arr.sort()
    return arr

def main():
    t = []
    x = [1000,5000,10000,20000,50000,100000,200000,500000,1000000]
    for n in x:
        arr = numpy.random.rand(n)
        iterations = 100
        total_time = timeit.timeit(lambda: ordenar(arr), number=iterations)
        avg_time = total_time / iterations
        t.append(avg_time)
        print("Tiempo de ejecución: ", avg_time)
    plt.figure(dpi=300)
    plt.plot(x, t, 'o-')
    plt.xlabel('Tamaño del arreglo')
    plt.ylabel('Tiempo de ejecución (s)')
    plt.title('Tiempo de ejecución de la función ordenar')
    plt.grid()
    plt.savefig('tiempo2.png')

if __name__ == "__main__":
    main()

```

## cprofile

```python
from cProfile import Profile
from pstats import Stats, SortKey
import numpy as np

def ordenar(arr):
    arr.sort()
    return arr

def main():
    t = []
    x = [1000,5000,10000,20000,50000,100000,200000,500000,1000000]
    for n in x:
        with Profile() as p:
            arr = np.random.rand(n)
            ordenar(arr)
        file_name = f"profile_{n}.prof"
        Stats(p).strip_dirs().sort_stats(SortKey.CALLS).dump_stats(file_name)
    k = Stats("profile_1000000.prof")
    k.strip_dirs().print_stats()

if __name__ == "__main__":
    main()
```

## pyinstrument

```python
from pyinstrument import Profiler
import numpy as np

def ordenar(arr):
    arr.sort()
    return arr

def main():
    t = []
    x = [1000,5000,10000,20000,50000,100000,200000,500000,1000000]
    for n in x:
        with Profiler(interval = 0.1) as p:
            arr = np.random.rand(n)
            ordenar(arr)
        print(p.output_text(unicode=True, color=True))
        #p.open_in_browser()

if __name__ == "__main__":
    main()
```
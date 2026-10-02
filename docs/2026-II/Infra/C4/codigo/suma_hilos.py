"""La suma de cien millones de enteros repartida entre hilos.

Cada hilo recibe un tramo [ini, fin) de la lista. El reparto es correcto y
los hilos corren de verdad, pero el tiempo no mejora: el bloqueo global del
intérprete deja ejecutar código de Python a un hilo a la vez.
"""
import sys
import threading
import time

SIZE = int(sys.argv[1]) if len(sys.argv) > 1 else 100_000_000
lista = [2] * SIZE


def sumar(lst, ini, fin):
    s = 0
    for i in range(ini, fin):
        s += lst[i]
    return s


def con_hilos(num_hilos):
    hilos = []
    ini, fin = 0, SIZE // num_hilos
    for _ in range(num_hilos):
        t = threading.Thread(target=sumar, args=(lista, ini, fin))
        t.start()
        ini = fin
        fin += SIZE // num_hilos
        hilos.append(t)
    for t in hilos:
        t.join()


if __name__ == "__main__":
    t0 = time.perf_counter()
    sumar(lista, 0, SIZE)
    base = time.perf_counter() - t0
    print(f"secuencial      {base:6.2f} s")
    for num_hilos in [2, 4, 6, 8, 10, 12, 14, 16]:
        t0 = time.perf_counter()
        con_hilos(num_hilos)
        t = time.perf_counter() - t0
        print(f"{num_hilos:2d} hilos        {t:6.2f} s   {base / t:4.2f}x")

"""Tres maneras de llevarle doscientos mil enteros a otro proceso.

Con Array la memoria es la misma y no viaja nada. Con Pipe y con Queue cada
objeto se serializa con pickle, viaja por un canal del sistema operativo y se
reconstruye al otro lado; eso es lo que se paga.
"""
import multiprocessing as mp
import time

N = 200_000


def por_array(compartido):
    total = 0
    for i in range(N):
        total += compartido[i]


def emisor_pipe(conexion, datos):
    for x in datos:
        conexion.send(x)
    conexion.send(None)                # centinela: aquí se acabó
    conexion.close()


def receptor_pipe(conexion):
    total = 0
    while True:
        x = conexion.recv()
        if x is None:
            break
        total += x


def emisor_cola(cola, datos):
    for x in datos:
        cola.put(x)
    cola.put(None)


def receptor_cola(cola):
    total = 0
    while True:
        x = cola.get()
        if x is None:
            break
        total += x


if __name__ == "__main__":
    datos = list(range(N))

    compartido = mp.Array("q", datos, lock=False)
    t0 = time.perf_counter()
    p = mp.Process(target=por_array, args=(compartido,))
    p.start(); p.join()
    print(f"memoria compartida  {time.perf_counter() - t0:5.2f} s")

    izq, der = mp.Pipe()
    t0 = time.perf_counter()
    e = mp.Process(target=emisor_pipe, args=(der, datos))
    r = mp.Process(target=receptor_pipe, args=(izq,))
    e.start(); r.start(); e.join(); r.join()
    print(f"Pipe                {time.perf_counter() - t0:5.2f} s")

    cola = mp.Queue()
    t0 = time.perf_counter()
    e = mp.Process(target=emisor_cola, args=(cola, datos))
    r = mp.Process(target=receptor_cola, args=(cola,))
    e.start(); r.start(); e.join(); r.join()
    print(f"Queue               {time.perf_counter() - t0:5.2f} s")

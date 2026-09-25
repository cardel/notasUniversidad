"""Los dos relojes del módulo time sobre el mismo fragmento.

perf_counter mide el reloj de pared, incluida la espera; process_time mide
el tiempo de procesador que consumió el proceso. La diferencia entre los dos
es el tiempo que el programa pasó esperando sin gastar CPU.
"""
import time


def trabajo():
    return sum(i * i for i in range(2_000_000))


def espera():
    time.sleep(0.5)


if __name__ == "__main__":
    pared0, cpu0 = time.perf_counter(), time.process_time()
    trabajo()
    espera()
    pared1, cpu1 = time.perf_counter(), time.process_time()
    print(f"reloj de pared  {pared1 - pared0:6.3f} s")
    print(f"tiempo de CPU   {cpu1 - cpu0:6.3f} s")
    print(f"esperando       {(pared1 - pared0) - (cpu1 - cpu0):6.3f} s")
    print(f"time.time()     {time.time():.0f} segundos desde el 1 de enero de 1970")

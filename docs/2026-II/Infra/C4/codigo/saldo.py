"""La actualización perdida: dos hilos abonando sobre el mismo saldo.

Aumentar un saldo son tres pasos —leer, sumar uno, escribir— y entre el
primero y el tercero el valor leído vive dentro del hilo. Si el otro escribe
en ese intervalo, su abono queda tapado.
"""
import dis
import sys
import threading

VECES = 200_000
saldo = 0


def consultar():
    return saldo


def guardar(valor):
    global saldo
    saldo = valor


def abonar_con_funciones(cerrojo):
    for _ in range(VECES):
        if cerrojo is None:
            guardar(consultar() + 1)
        else:
            with cerrojo:
                guardar(consultar() + 1)


def corrida(cerrojo):
    global saldo
    saldo = 0
    hilos = [threading.Thread(target=abonar_con_funciones, args=(cerrojo,))
             for _ in range(2)]
    for t in hilos:
        t.start()
    for t in hilos:
        t.join()
    return saldo


if __name__ == "__main__":
    intervalo = sys.getswitchinterval()
    sys.setswitchinterval(1e-6)        # el intérprete alterna mucho más seguido
    esperado = 2 * VECES
    for etiqueta, cerrojo in (("sin cerrojo", None), ("con cerrojo", threading.Lock())):
        obtenido = corrida(cerrojo)
        print(f"{etiqueta}: esperado {esperado}   obtenido {obtenido:7d}   "
              f"perdidas {esperado - obtenido:7d}")
    sys.setswitchinterval(intervalo)

    print("\nlo que el intérprete hace con saldo += 1:")
    dis.dis(compile("saldo += 1", "<ejemplo>", "exec"))

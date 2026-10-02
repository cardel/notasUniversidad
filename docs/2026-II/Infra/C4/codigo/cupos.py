"""Doscientos hilos peleando por cien cupos.

Entre comprobar que queda cupo y descontarlo pasa un instante, y en ese
instante otros hilos comprueban lo mismo. Sin cerrojo entran más de cien y
el contador termina en negativo; con cerrojo las dos operaciones quedan
pegadas y la cuenta cuadra.
"""
import threading
import time

HILOS = 200
CUPOS = 100


def inscribir(estado, nombre, cerrojo):
    if cerrojo is None:
        if estado["cupos"] > 0:
            time.sleep(0.001)          # el instante entre mirar y descontar
            estado["cupos"] -= 1
            estado["inscritos"].append(nombre)
    else:
        with cerrojo:
            if estado["cupos"] > 0:
                time.sleep(0.001)
                estado["cupos"] -= 1
                estado["inscritos"].append(nombre)


def corrida(cerrojo):
    estado = {"cupos": CUPOS, "inscritos": []}
    hilos = [threading.Thread(target=inscribir, args=(estado, f"e{i}", cerrojo))
             for i in range(HILOS)]
    for t in hilos:
        t.start()
    for t in hilos:
        t.join()
    return estado


if __name__ == "__main__":
    for etiqueta, cerrojo in (("sin cerrojo", None), ("con cerrojo", threading.Lock())):
        e = corrida(cerrojo)
        print(f"{etiqueta}: cupos {e['cupos']:4d}   inscritos {len(e['inscritos']):4d}")

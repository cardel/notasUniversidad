"""Estimación de pi por Monte Carlo, perfilada con Pyinstrument.

Se tiran puntos al azar dentro de un cuadrado de lado 2 con un círculo de
radio 1 inscrito. La proporción de puntos que cae dentro del círculo tiende
a pi/4, así que multiplicada por cuatro estima pi.

Con `uniform` el punto se arma con random.uniform(-1, 1); con `random`, con
random.random(), que está implementada en C. El árbol de Pyinstrument dice
cuánto cuesta esa diferencia.
"""
import sys
from random import random, uniform

from pyinstrument import Profiler

N = 2_000_000


def punto_uniform():
    return complex(uniform(-1, 1), uniform(-1, 1))


def punto_random():
    return complex(random(), random())


def dentro(p):
    return abs(p) < 1.0


def estimar_pi(punto, n):
    aciertos = sum(1 for _ in range(n) if dentro(punto()))
    return 4.0 * aciertos / n


if __name__ == "__main__":
    version = sys.argv[1] if len(sys.argv) > 1 else "uniform"
    punto = punto_uniform if version == "uniform" else punto_random
    perfilador = Profiler(interval=0.001)
    perfilador.start()
    print(f"pi ~ {estimar_pi(punto, N):.4f}")
    perfilador.stop()
    print(perfilador.output_text(unicode=True, color=False, show_all=False))

# Clase 1 - Cuatro formas de sumar la misma lista de 10.000.000 de numeros.
#
# Las cuatro dan exactamente el mismo resultado. Lo que cambia es el tiempo,
# y esa diferencia no viene de la cantidad de sumas (es la misma en las
# cuatro) sino de COMO se llega a cada elemento y de en que capa se ejecuta
# el recorrido.
#
# Para correrlo:  python3 complejidad.py
# Los cuatro "El tiempo de ejecución es" que salen corresponden, en orden,
# a las versiones A, B, C y D marcadas abajo. Tarda unos segundos: ese es
# justamente el punto del ejercicio.

import time
import numpy as np

n = 10000000
lst = [x for x in range(0, n)]   # lista nativa de Python con 0, 1, ..., n-1

# --- Version A: recorrer con indice --------------------------------------
# Cada lst[i] obliga al interprete a resolver la posicion i. Eso se paga
# diez millones de veces.
ini = time.time()
sumA = 0
for i in range(0, n):
    sumA += lst[i]
fin = time.time()
print("El tiempo de ejecución es", fin - ini)

# --- Version B: recorrer con iterador ------------------------------------
# El iterador ya esta parado sobre el elemento y solo avanza al siguiente:
# no vuelve a resolver la posicion. Mismo numero de sumas, menos trabajo
# por suma. Sale mas rapida que A.
ini = time.time()
sumB = 0
for elm in lst:
    sumB += elm
fin = time.time()


print("El tiempo de ejecución es", fin - ini)

# --- Version C: dejar que NumPy sume el arreglo completo ------------------
# arr.sum() baja a la capa de C que hay debajo de NumPy y hace todo el
# recorrido alla, sin regresar al interprete de Python entre elemento y
# elemento. Dos ordenes de magnitud de diferencia frente a A y B.
arr = np.array(lst)
ini = time.time()
sumC = arr.sum()
fin = time.time()


print("El tiempo de ejecución es", fin - ini)


# --- Version D: indexar el arreglo de NumPy (la trampa) ------------------
# Aqui esta el arreglo rapido, pero se recorre con indice desde Python.
# Cada arr[i] cruza la frontera entre C y Python y envuelve el entero en
# un objeto de Python. Termina siendo la PEOR de las cuatro: se pierde la
# ventaja de NumPy y encima se paga la conversion.
# Moraleja: si usa NumPy, no recorra elemento por elemento.
arr = np.array(lst)
ini = time.time()
sumD = 0
for i in range(0, n):
    sumD += arr[i]
fin = time.time()

print("El tiempo de ejecución es", fin - ini)

# Las cuatro sumas coinciden: el resultado es correcto en todos los casos.
# Lo unico que cambio fue el costo de obtenerlo.
print(sumA, sumB, sumC, sumD)

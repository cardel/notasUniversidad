# heapq: un monticulo de minimos guardado en una list.
import heapq

h = []
for k in [30, 12, 45, 7, 21]:
    heapq.heappush(h, k)
    print(h)
print("menor:", h[0])
x = heapq.heappop(h)
print("sale", x, "queda", h)

# el mayor primero: se guardan las claves negadas
m = []
for k in [30, 12, 45, 7, 21]:
    heapq.heappush(m, -k)
print("mayor:", -m[0])

# pedidos: (urgencia negada, turno, nombre); gana la tupla menor
pedidos = []
heapq.heappush(pedidos, (-2, 1, "cafe"))
heapq.heappush(pedidos, (-5, 2, "almuerzo"))
heapq.heappush(pedidos, (-5, 3, "postre"))
heapq.heappush(pedidos, (-1, 4, "agua"))
while len(pedidos) > 0:
    urgencia, turno, nombre = heapq.heappop(pedidos)
    print(-urgencia, turno, nombre)

# de un arreglo cualquiera a monticulo, en tiempo lineal
datos = [9, 4, 7, 1, 8, 2]
heapq.heapify(datos)
print(datos)

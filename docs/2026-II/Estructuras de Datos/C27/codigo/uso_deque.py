# deque como cola de turnos y list como pila.
from collections import deque

turnos = deque()
turnos.append("Ana")      # por la derecha
turnos.append("Luis")
turnos.append("Sara")
print(turnos[0], len(turnos))
atendido = turnos.popleft()
print("atiende a", atendido)
turnos.append("Juan")
turnos.appendleft("Eva")  # tiene cita
print(turnos)

# pila sobre list: la cima es el final
acciones = []
acciones.append("escribir")
acciones.append("borrar")
acciones.append("pegar")
print("tope:", acciones[-1])
while len(acciones) > 0:
    print("deshace", acciones.pop())

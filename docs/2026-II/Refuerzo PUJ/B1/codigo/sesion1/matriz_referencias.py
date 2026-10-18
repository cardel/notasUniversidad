# [[0] * m] * n repite n veces la referencia a una misma fila;
# la comprension crea n filas distintas.
n = 3
m = 4
compartida = [[0] * m] * n
separadas = [[0] * m for _ in range(n)]

compartida[0][0] = 1
separadas[0][0] = 1

print("compartida tras compartida[0][0] = 1:")
for fila in compartida:
    print(fila)
print("separadas tras separadas[0][0] = 1:")
for fila in separadas:
    print(fila)
print("misma fila en compartida:", compartida[0] is compartida[1])
print("misma fila en separadas:", separadas[0] is separadas[1])

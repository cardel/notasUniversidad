# list: el vector de Python, un arreglo de referencias que crece solo.
notas = [38, 45, 29]
notas.append(41)        # como push_back
print(notas, len(notas))
print(notas[2])         # como v[2]
notas[0] = 40
notas.insert(1, 33)     # corre lo que sigue
print(notas)
ultima = notas.pop()    # quita el ultimo
print(ultima, notas)
primera = notas.pop(0)  # corre todos
print(primera, notas)
print(45 in notas, 50 in notas)

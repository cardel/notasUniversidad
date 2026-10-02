"""Lo que el padre ve y lo que no, con procesos.

La primera versión pasa una lista normal: el hijo la llena, el padre la
recibe intacta, porque cada proceso trabaja sobre su copia. La segunda usa
un Array y un Value de memoria compartida, y entonces sí.
"""
import multiprocessing as mp


def cuadrados_en_copia(lista, resultado):
    for idx, num in enumerate(lista):
        resultado[idx] = num * num


def cuadrados_compartidos(lista, resultado, suma):
    for idx, num in enumerate(lista):
        resultado[idx] = num * num
    with suma.get_lock():              # leer, sumar y escribir, sin que nadie se meta
        suma.value += sum(r * r for r in lista)


if __name__ == "__main__":
    datos = [1, 2, 3, 4]

    copia = [0] * len(datos)
    p = mp.Process(target=cuadrados_en_copia, args=(datos, copia))
    p.start()
    p.join()
    print(f"lista normal:        {copia}")

    resultado = mp.Array("q", len(datos))
    suma = mp.Value("q", 0)
    p = mp.Process(target=cuadrados_compartidos, args=(datos, resultado, suma))
    p.start()
    p.join()
    print(f"Array compartido:    {list(resultado)}")
    print(f"Value compartido:    {suma.value}")

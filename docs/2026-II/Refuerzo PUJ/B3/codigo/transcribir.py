def empleados_necesarios(paginas, t):
    # Empleados necesarios si nadie pasa de t páginas.
    empleados = 1
    turno = 0
    for p in paginas:
        if turno + p <= t:
            turno = turno + p
        else:
            empleados = empleados + 1
            turno = p
    return empleados


def transcribir(paginas, k):
    # El menor máximo de páginas por empleado.
    lo = max(paginas)
    hi = sum(paginas)
    while lo < hi:
        medio = (lo + hi) // 2
        if empleados_necesarios(paginas, medio) <= k:
            hi = medio
        else:
            lo = medio + 1
    return lo


def main():
    print(transcribir([100, 200, 300, 400, 500, 600, 700, 800, 900], 3))
    print(transcribir([100, 200, 300, 400, 500, 600, 700, 800, 900], 1))
    print(transcribir([100, 200, 300, 400, 500, 600, 700, 800, 900], 9))
    print(transcribir([100, 200, 300, 400, 500, 600, 700, 800, 900], 12))


if __name__ == "__main__":
    main()

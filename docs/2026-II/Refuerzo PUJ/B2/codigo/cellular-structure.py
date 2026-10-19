import sys

sys.setrecursionlimit(100000)


# 0 mutante, 1 simple, 2 crecido, 3 mutagenico; s[ini..fin] inclusive
def clasificar(s, ini, fin):
    r = 0
    n = fin - ini + 1
    if n == 1 and s[ini] == "A":
        r = 1
    elif n >= 3 and s[fin - 1] == "A" and s[fin] == "B" and clasificar(s, ini, fin - 2) != 0:
        r = 2
    elif n >= 3 and s[ini] == "B" and s[fin] == "A" and clasificar(s, ini + 1, fin - 1) != 0:
        r = 3
    return r


def main():
    datos = sys.stdin.read().split()
    nombres = ["MUTANT", "SIMPLE", "FULLY-GROWN", "MUTAGENIC"]
    casos = int(datos[0])
    t = 1
    while t <= casos and t < len(datos):
        s = datos[t]
        print(nombres[clasificar(s, 0, len(s) - 1)])
        t = t + 1


main()

"""El n-esimo numero de Fibonacci, con un ciclo.

Aqui el estado del ciclo no es un acumulador solo: son dos numeros que se
actualizan juntos en cada vuelta. Los assert escriben los invariantes al
entrar y al salir del cuerpo, que es donde se ve si la estabilidad aguanta.
"""


def fib(k):
    # Definicion recursiva, solo para comprobar
    if k < 2:
        r = k
    else:
        r = fib(k - 1) + fib(k - 2)
    return r


def fibonacci(n):
    a = 0
    b = 1
    i = 0
    while i < n:
        assert 0 <= i <= n
        assert a == fib(i) and b == fib(i + 1)
        siguiente = a + b
        a = b
        b = siguiente
        i = i + 1
        assert 0 <= i <= n
        assert a == fib(i) and b == fib(i + 1)
    return a


def comprobar():
    n = 0
    while n <= 15:
        assert fibonacci(n) == fib(n), n
        n = n + 1
    return n


primeros = []
n = 0
while n < 15:
    primeros.append(fibonacci(n))
    n = n + 1

print("fibonacci(0..14):", primeros)
print("valores comprobados contra la definicion:", comprobar())

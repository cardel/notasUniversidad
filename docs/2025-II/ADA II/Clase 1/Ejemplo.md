# Ejemplo de divide y vencerás con memorización

```python
import time


def fib(n):
    if n <= 1:
        return n
    else:
        return fib(n - 1) + fib(n - 2)


def fibMem(n, mem={0: 0, 1: 1}):
    if n <= 1:
        return n
    elif mem.get(n) is not None:
        return mem[n]
    else:
        mem[n] = fibMem(n - 1, mem) + fibMem(n - 2, mem)
        return mem[n]


if __name__ == "__main__":
    ini = time.time()
    sol = fib(29)
    fin = time.time()
    print("Fib 29 Recursivo", sol, fin - ini)

    ini = time.time()
    sol = fibMem(29)
    fin = time.time()

    print("Fib 29 mem", sol, fin - ini)

    ini = time.time()
    sol = fib(35)
    fin = time.time()
    print("Fib 35 Recursivo", sol, fin - ini)

    ini = time.time()
    sol = fibMem(35)
    fin = time.time()
    print("Fib 35 Mem", sol, fin - ini)
```

## Complejidad computacional de Fibonacci recursivo vs. con memorización

### 1. Fibonacci recursivo puro (`fib(n)`)
**Complejidad:** $O(2^n)$

**Explicación:**
- Cada llamada a `fib(n)` genera **dos llamadas recursivas**: `fib(n-1)` y `fib(n-2)`
- Esto crea un **árbol de recursión binario** donde el número de nodos se duplica en cada nivel
- El número total de operaciones es aproximadamente $2^n$, aunque algunos nodos se repiten
- Es una complejidad **exponencial** que crece extremadamente rápido

### 2. Fibonacci con memorización (`fibMem(n, mem)`)
**Complejidad:** $O(n)$

**Explicación:**
- La memorización **almacena resultados previamente calculados** en un diccionario
- Cada valor de Fibonacci **se calcula exactamente una vez**
- Para calcular `fibMem(n)`, solo necesitas calcular todos los valores desde 0 hasta n
- Esto resulta en **n operaciones** (una por cada número desde 0 hasta n)
- Es una complejidad **lineal** mucho más eficiente

### Comparación práctica (de tu código):
- `fib(29)` vs `fibMem(29)`: La versión recursiva será miles de veces más lenta
- `fib(35)` vs `fibMem(35)`: La diferencia será aún más dramática (la recursiva podría tomar segundos o minutos)

### ¿Por qué esta diferencia?
La memorización **elimina el recálculo redundante**. En la versión recursiva pura, `fib(3)` se calcula múltiples veces, mientras que con memorización se calcula una vez y se reutiliza.

**Conclusión:** La memorización transforma un algoritmo exponencial $O(2^n)$ en uno lineal $O(n)$, haciendo viable calcular números de Fibonacci grandes.
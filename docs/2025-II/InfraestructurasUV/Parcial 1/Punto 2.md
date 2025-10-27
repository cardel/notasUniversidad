# Análisis de caso


Se analiza el comportamiento de la siguiente función recursiva en Python:

```python
def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n - 1)
```

Al ejecutar `factorial(100)` se observa que tarda **10 segundos** y genera más de **10⁶ marcos de llamada**.  
En contraste, al aplicar la decoración con `@lru_cache(maxsize=None)`:

```python
@lru_cache(maxsize=None)
def factorial(n):
  if n == 0:
    return 1
  else:
    return n * factorial(n - 1)
```

la ejecución de `factorial(100)` tarda **0.01 segundos** y produce solo **101 marcos de llamada**.

---

## 1. Ineficiencia del primer código (15 puntos)

### 🔹 Funcionamiento recursivo

Cada vez que se invoca `factorial(n)`, la función:

- Crea un **nuevo marco de pila (stack frame)** con su propio valor de `n`.
    
- Espera el resultado de `factorial(n-1)` antes de continuar.
    
- Multiplica `n` por el resultado devuelto.
    

Por ejemplo:  
$$  
factorial(5) = 5 \times factorial(4)  
$$ 
$$
factorial(4) = 4 \times factorial(3)  
$$ 
… y así hasta llegar a `factorial(0)`.

En total, `factorial(100)` genera **101 llamadas anidadas**, y cada una ocupa un marco en la pila.

### 🔹 Problema de los marcos de pila

Cada llamada recursiva mantiene su estado (variables locales, dirección de retorno, etc.) en memoria.  
En una implementación recursiva profunda:

- El **espacio de pila crece linealmente con `n`**.
    
- Python tiene un límite máximo de profundidad recursiva (~1000 por defecto), por lo que valores mayores causarían un `RecursionError`.
    

Aunque `factorial(100)` no lo supera, sí crea más de **10⁶ marcos temporales** debido a recomputaciones innecesarias durante el proceso (por ejemplo, si la función se llama repetidamente en pruebas o en otro cálculo acumulativo).

### 🔹 Recomputation innecesaria

En esta versión, cada llamada calcula su resultado **desde cero**.  
Si el programa solicita varias veces el mismo factorial (por ejemplo, `factorial(100)`, luego `factorial(99)`, etc.), se recalculan los mismos valores repetidamente sin aprovechar los resultados previos.

Esto genera:

- **Recomputación exponencial** de subproblemas.
    
- **Tiempo de CPU desperdiciado.**
    
- **Uso excesivo de memoria** para almacenar millones de marcos.
    

---

## 2. Eficiencia con `@lru_cache` (15 puntos)

### 🔹 ¿Qué hace `@lru_cache`?

`functools.lru_cache` es un **decorador de memoización**:  
almacena los resultados de llamadas anteriores a la función en una **caché (diccionario interno)**.  
Cuando la función se vuelve a invocar con el mismo argumento, devuelve el resultado **directamente desde la caché**, sin volver a ejecutar el cuerpo de la función.

### 🔹 Efecto en el código factorial

En el caso de `factorial`, cada llamada con un nuevo valor de `n` se calcula **una sola vez**:

- `factorial(0)` → se guarda en caché.
    
- `factorial(1)` usa el de `factorial(0)`, y luego se guarda.
    
- `factorial(2)` usa el de `factorial(1)`, etc.
    

Por tanto, `factorial(100)` realiza exactamente **101 cálculos distintos**, uno por cada valor de `n`, y nunca repite una llamada.

### 🔹 Efecto sobre la pila y el tiempo

- Solo hay **101 marcos de pila activos**, uno por nivel de recursión.
    
- Las llamadas repetidas son **instantáneas** porque se sirven desde memoria caché.
    
- El tiempo de ejecución se reduce de **10 segundos** a **0.01 segundos**.
    
- No hay recomputaciones innecesarias ni crecimiento de memoria no controlado.
    


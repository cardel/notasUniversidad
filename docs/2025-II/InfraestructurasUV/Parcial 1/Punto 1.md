# Resolución de problema

Un analista de datos necesita calcular el **promedio móvil** de una serie numérica muy grande (por ejemplo, mediciones de temperatura cada segundo durante varios días).  

El promedio móvil de una lista de valores se define como el promedio de los últimos $k$ valores, y se usa para suavizar fluctuaciones.

Por ejemplo, para la lista:

$$
A = [3, 1, 7, 0, 4, 1, 6, 3]  
$$

y una ventana $k = 3$, los promedios móviles son:

$$
\left[\frac{3+1+7}{3}, \frac{1+7+0}{3}, \ldots \right] \Rightarrow [3.67, 2.67, \ldots]  
$$

---

## 1. Dependencias (10 puntos)

- El cálculo del promedio móvil en la posición $i$ **no depende de los resultados anteriores**, sino únicamente de los valores originales $(A[i-k+1], \ldots, A[i])$.  
    Por tanto, **no hay dependencia entre los resultados** del promedio móvil: cada posición puede calcularse de manera independiente si se dispone de los valores originales de entrada.
    
- El tipo de paralelismo adecuado es el **paralelismo de datos**, porque el mismo tipo de operación (promedio de ventana) se aplica a diferentes partes del conjunto de datos.

---

## 2. Diseño del paralelismo (15 puntos)

Supongamos que disponemos de $T$ hilos y un arreglo $A$ de longitud $n$.

Cada hilo puede procesar un segmento distinto de índices del arreglo de salida (promedios móviles).  
Sin embargo, hay que tener cuidado con las **ventanas que cruzan los límites entre segmentos**, ya que cada promedio necesita los $k$ elementos anteriores.

### Estrategia:

![](attachments/Pasted%20image%2020251028154344.png)
1. Dividir el rango de índices de salida  $[k-1, n-1]$  en $T$ partes casi iguales.
    
2. A cada hilo se le asigna un rango $[start_i, end_i)$.
    
3. Para evitar errores en los bordes, cada hilo debe tener acceso a  $k-1$ elementos anteriores/posteriores a su rango (copiados o accesibles).
    

### Ejemplo:

Para $n = 8, k = 3, T = 2$:

- Hilo 1 procesa índices `2, 3, 4`  Este evaluara las ventanas 
	- $0,1,2$
	- $1,2,3$
	- $2,3,4$
    
- Hilo 2 procesa índices `5, 6, 7` Este evaluara las ventanas 
	- $3,4,5$
	- $4,5,6$
	- $5,6,7$
    


---

## 3. Implementación  

A continuación se muestra un código conceptual en Python que usa **threads** del módulo `threading` para paralelizar el cálculo del promedio móvil:

```python
import numpy as np
from threading import Thread

def moving_average_segment(A, k, start, end, result, thread_id):
    partial = []
    for i in range(start, end):
        avg = 0
        for j in range(0,k):
            avg += A[i-j]
        avg /=k
        partial.append(avg)
    result[thread_id] = partial

if __name__ == "__main__":
    A = [3, 1, 7, 0, 4, 1, 6, 3]
    k = 3
    T = 2
    n = len(A)


    total_outputs = n - k + 1
    chunk = total_outputs // T

    threads = []
    results = [None] * T

    for t in range(T):
        start = k - 1 + t * chunk
        end = k - 1 + (t + 1) * chunk if t != T - 1 else n

        start = max(start, k - 1)
        th = Thread(target=moving_average_segment, args=(A, k, start, end, results, t))
        threads.append(th)
        th.start()

    for th in threads:
        th.join()

    # Combinar los resultados parciales
    moving_avg = [x for part in results for x in part]
    print("Promedio móvil total:", moving_avg)
```

### Explicación:

- **`moving_average_segment`**: cada hilo calcula promedios móviles en su rango asignado.
    
- **`results`**: lista compartida para almacenar resultados parciales sin conflictos (cada hilo escribe en su propia posición).
    
- **`join()`**: asegura que todos los hilos terminen antes de combinar los resultados.
    
- **Ventajas**: no hay escritura simultánea sobre los mismos índices y cada hilo trabaja sobre datos independientes.
    

---

## 4. Ejemplo de ejecución (5 puntos)

Para:

$$  
A = [3, 1, 7, 0, 4, 1, 6, 3], \quad k = 3, \quad T = 2  
$$

- **Hilo 1** procesa índices `[2, 3, 4]`
    
    - Ventanas:
        
        - (3,1,7) → 3.67
            
        - (1,7,0) → 2.67
            
        - (7,0,4) → 3.67
            
- **Hilo 2** procesa índices `[5, 6, 7]`
    
    - Ventanas:
        
        - (0,4,1) → 1.67
            
        - (4,1,6) → 3.67
            
        - (1,6,3) → 3.33
            

**Resultado combinado:**

$$
[3.67, 2.67, 3.67, 1.67, 3.67, 3.33]  
$$

# Conclusiones de profiling

"Make it work, after make it beautiful so it will be faster" (Haz que funcione, luego hazlo hermoso para que sea más rápido).

Si usted aplica técnicas de código limpio:
1. **Returns únicamente al final de las funciones**: Esto mejora la legibilidad y facilita el razonamiento sobre el flujo del programa.
2. **Evitar el uso de breaks y continues**: Si los tiene que usar, entonces existe una mejor solución estructural.
3. **Elegir adecuadamente los algoritmos y las estructuras de datos**: La selección correcta tiene un impacto mayor en el rendimiento que las micro-optimizaciones.

El profiling nos permite identificar dónde podemos optimizar. Usualmente, los cuellos de botella son las operaciones de acceso a memoria. Ejemplo:

```python
import time

# Creación de una lista con 100 millones de elementos: cada elemento es x²
# Esto consume aproximadamente 800 MB de memoria (8 bytes por float * 100M)
l = [x**2 for x in range(0, 100000000)]

# Método 1: Suma con indexación explícita
sum = 0
inicial = time.perf_counter()  # Inicia medición de tiempo de alta precisión
for i in range(0, len(l)):
    sum += l[i]  # Acceso por índice - más costoso por doble búsqueda
final = time.perf_counter()
print("Acabé suma imperativa con indexación")
print(f"Tiempo: {final - inicial} segundos")

# Método 2: Suma con iteración directa
inicial = time.perf_counter()
sum = 0
for e in l:  # Iterador directo - más eficiente
    sum += e  # Acceso directo al elemento

final = time.perf_counter()

print("Acabé suma iterativa directa")
print(f"Tiempo: {final - inicial} segundos")
```

En este caso, vemos que usar indexación es más costoso que iterar con un iterador directo, porque la indexación implica:
1. Cálculo de la posición en memoria para cada acceso
2. Verificación de límites en cada iteración
3. Posible pérdida de localidad espacial en la caché

Una vez hagas mejoras, debes aplicar de nuevo profiling para evaluar los cambios y verificar que las optimizaciones tengan el efecto deseado.

Evitar usar indexación en librerías como NumPy, dado que por debajo están optimizadas con instrucciones AVX o CUDA (en TensorFlow). La indexación explícita en bucles anula estas optimizaciones y fuerza la conversión de elementos optimizados a objetos Python individuales.

---

## Tabla de resumen

| Concepto | Descripción | Ejemplo/Implementación |
|----------|-------------|------------------------|
| **Profiling** | Análisis del rendimiento de un programa para identificar cuellos de botella y oportunidades de optimización. | Uso de `time.perf_counter()` para medir tiempos de ejecución. |
| **Código limpio** | Prácticas de programación que mejoran la legibilidad, mantenibilidad y, a menudo, el rendimiento. | Returns al final de funciones, evitar `break`/`continue` innecesarios. |
| **Selección algorítmica** | Elección de algoritmos y estructuras de datos apropiadas para el problema, impacto principal en rendimiento. | Usar hash maps ($O(1)$) vs. listas ($O(n)$) para búsquedas frecuentes. |
| **Acceso a memoria** | Operaciones de lectura/escritura en memoria suelen ser el principal cuello de botella en aplicaciones intensivas en datos. | Iteración directa vs. indexación en listas grandes. |
| **Iteración directa** | Acceso a elementos secuencialmente mediante iteradores, más eficiente que indexación en bucles. | `for e in lista:` en lugar de `for i in range(len(lista)): lista[i]`. |
| **Localidad espacial** | Principio de que los datos accedidos próximamente en tiempo tienden a estar próximos en memoria, aprovechando caché. | Iteración secuencial sobre arreglos vs. acceso aleatorio. |
| **Verificación post-optimización** | Re-ejecutar profiling después de optimizar para validar la mejora y evitar regresiones. | Comparar tiempos antes/después de cambiar el algoritmo de acceso. |
| **Optimizaciones de hardware** | Uso de instrucciones específicas del procesador (AVX, CUDA) para operaciones paralelas. | NumPy usa AVX; TensorFlow usa CUDA en GPUs. |
| **Overhead de abstracción** | Costo adicional cuando se interrumpe el flujo optimizado (ej: indexación en NumPy rompe vectorización). | Bucle Python sobre elementos NumPy vs. operación vectorizada completa. |

## Comentarios adicionales

- El principio "Make it work, make it right, make it fast" enfatiza que la corrección y claridad deben preceder a la optimización. La optimización prematura es una causa común de errores y código difícil de mantener.
- Las herramientas de profiling avanzadas (`cProfile`, `line_profiler`, `memory_profiler` en Python) proporcionan información más detallada que simples mediciones de tiempo, incluyendo:
  - Número de llamadas a cada función
  - Tiempo acumulado en cada función
  - Consumo de memoria por línea de código
- En Python, la diferencia entre indexación e iteración directa se debe a que:
  - `for e in lista` usa el iterador interno de Python (`__iter__()`)
  - `for i in range(len(lista)): lista[i]` implica:
    1. Creación de un objeto `range`
    2. Búsqueda del método `__getitem__()` en cada iteración
    3. Verificación de índices
- Para estructuras NumPy, la diferencia es aún más dramática: las operaciones vectorizadas pueden ser 50-100x más rápidas que bucles Python equivalentes.
- Las optimizaciones deben basarse en datos del profiling, no en suposiciones. A veces, cambios que parecen optimizaciones pueden empeorar el rendimiento debido a efectos secundarios en la caché o pipeline del CPU.
- La regla 80/20 aplica en optimización: típicamente, el 80% del tiempo de ejecución se gasta en el 20% del código. El profiling identifica ese 20% crítico.
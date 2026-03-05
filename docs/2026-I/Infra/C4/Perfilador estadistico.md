# Perfilador estadístico

Pyinstrument es un perfilador estadístico que permite tomar muestras periódicas del estado de ejecución de un programa para determinar de forma estadística dónde se encuentran los puntos críticos de rendimiento. A diferencia de los perfiladores determinísticos como `cProfile`, que registran cada llamada a función, los perfiladores estadísticos muestrean el stack de llamadas a intervalos regulares, lo que resulta en un overhead significativamente menor (aproximadamente del 5%).

## Ejemplo: Fibonacci recursivo sin optimización

```python
from pyinstrument import Profiler

def fib(n):
    """
    Implementación recursiva naive de Fibonacci.
    Tiene complejidad exponencial O(2^n) debido a llamadas redundantes.
    """
    if n <= 1:
        return n
    else:
        return fib(n - 1) + fib(n - 2)

# Crear un perfilador con intervalo de muestreo de 0.1 segundos
with Profiler(interval=0.1) as profiler:
    print(fib(35))  # Ejecutar Fibonacci para n=35

# Generar reporte en formato texto con soporte para Unicode y colores
print(profiler.output_text(unicode=True, color=True))
```

El resultado muestra que hay muchos llamados a la función `fib`, confirmando la ineficiencia del enfoque recursivo naive:

![[Pasted image 20260305121539.png]]

## Ejemplo optimizado: Fibonacci con memoización usando LRU Cache

```python
from pyinstrument import Profiler
from functools import lru_cache

@lru_cache(maxsize=None)  # Decorador que implementa memoización automática
def fib(n):
    """
    Implementación de Fibonacci con memoización.
    Almacena resultados previos para evitar recomputación.
    Reduce la complejidad a O(n).
    """
    if n <= 1:
        return n
    else:
        return fib(n - 1) + fib(n - 2)

with Profiler(interval=0.1) as profiler:
    print(fib(35))  # Mismo valor que antes

print(profiler.output_text(unicode=True, color=True))
```

Obtenemos el siguiente resultado:

![[Pasted image 20260305121806.png]]

En este caso, el perfilador no capturó ejecuciones significativas porque el tiempo de muestreo (0.1 segundos) es demasiado grande en comparación con el tiempo de ejecución optimizado. Esto ilustra una limitación de los perfiladores estadísticos: pueden perder funciones que se ejecutan muy rápido.

## Comparación de rendimiento: random vs uniform

Un caso práctico donde el perfilado estadístico es útil es para comparar el rendimiento de diferentes implementaciones de librerías. Por ejemplo, comparando las funciones `random` y `uniform` del módulo `random` de Python:

```python
from random import uniform  # Implementado en Python
from random import random   # Implementado en C
```

### Programa usando `uniform` (implementado en Python):

```bash
13.2 <module>  MonteCarlos.py:1
└─ 13.2 estimate_pi  MonteCarlos.py:5
   ├─ 12.6 <genexpr>  MonteCarlos.py:6
   │  ├─ 8.2 point  MonteCarlos.py:13
   │  │  ├─ 4.2 Random.uniform  random.py:500
   │  │  │  ├─ 2.7 [self]  random.py
   │  │  │  └─ 1.5 Random.random  <built-in>
   │  │  └─ 4.0 [self]  MonteCarlos.py
   │  ├─ 2.6 [self]  MonteCarlos.py
   │  └─ 1.8 hits  MonteCarlos.py:9
   │     ├─ 1.3 [self]  MonteCarlos.py
   │     └─ 0.5 abs  <built-in>
   └─ 0.6 [self]  MonteCarlos.py
```

Observe que `uniform` está consumiendo más de la mitad del tiempo de ejecución de la función (4.2 segundos de 13.2 totales).

### Programa usando `random` (implementado en C):

```bash
8.7 <module>  MonteCarlos.py:1
└─ 8.7 estimate_pi  MonteCarlos.py:5
   ├─ 7.9 <genexpr>  MonteCarlos.py:6
   │  ├─ 3.2 point  MonteCarlos.py:13
   │  │  ├─ 1.9 Random.random  <built-in>
   │  │  └─ 1.3 [self]  MonteCarlos.py
   │  ├─ 2.5 hits  MonteCarlos.py:9
   │  │  ├─ 1.7 [self]  MonteCarlos.py
   │  │  └─ 0.8 abs  <built-in>
   │  └─ 2.2 [self]  MonteCarlos.py
   └─ 0.8 [self]  MonteCarlos.py
```

El tiempo de `random` se redujo de 4.2 segundos a 1.9 segundos, demostrando la ventaja de usar funciones implementadas en C sobre las implementadas en Python puro.

## Conceptos teóricos

**Perfilado estadístico vs. determinístico**:
- **Perfilado estadístico** (muestreo): Toma muestras periódicas del stack de llamadas. Ventaja: bajo overhead (~5%). Desventaja: puede perder funciones rápidas.
- **Perfilado determinístico**: Instrumenta cada llamada a función. Ventaja: información completa. Desventaja: alto overhead (30-45%).

**Teorema del muestreo**: Para capturar funciones que consumen al menos X% del tiempo total con confianza estadística, se necesitan aproximadamente 100/X muestras. Por ejemplo, para capturar funciones que consumen 1% del tiempo, se necesitan ~100 muestras.

**Intervalo de muestreo**: En Pyinstrument, el parámetro `interval` controla la frecuencia de muestreo. Valores más pequeños capturan más detalles pero aumentan el overhead.

**Implementaciones nativas vs. Python**:
- **Funciones en C** (`<built-in>`): Mayor rendimiento, menor overhead
- **Funciones en Python puro**: Más flexibilidad pero menor rendimiento

## Tabla de resumen

| Concepto | Descripción | Ejemplo Pyinstrument | Ventajas/Desventajas |
|----------|-------------|----------------------|----------------------|
| **Muestreo estadístico** | Toma muestras periódicas del stack | `Profiler(interval=0.1)` | Bajo overhead (~5%) |
| **Intervalo de muestreo** | Frecuencia de captura de muestras | `interval=0.1` (100ms) | Menor intervalo = más detalle = más overhead |
| **Overhead** | Impacto en el rendimiento del programa | ~5% vs ~40% de cProfile | Significativamente menor que determinístico |
| **Funciones rápidas** | Funciones que ejecutan en menos del intervalo | No capturadas | Limitación principal |
| **Implementación C** | Funciones nativas compiladas | `<built-in>` en reportes | Mayor rendimiento |
| **Implementación Python** | Funciones en Python puro | `random.py:500` en reportes | Más flexible, menos rápida |
| **Reporte jerárquico** | Visualización de llamadas anidadas | Salida con árbol Unicode | Fácil identificación de cuellos de botella |
| **Colores/Unicode** | Formato de salida visual | `unicode=True, color=True` | Mejor legibilidad |

## Comentarios adicionales

1. **Cuándo usar Pyinstrument**: Ideal para profiling en producción o para programas de larga duración donde el overhead de `cProfile` sería prohibitivo. También útil para obtener una visión general rápida del rendimiento.

2. **Configuración del intervalo**: 
   - Para programas largos: `interval=0.01` (10ms) o mayor
   - Para programas cortos: `interval=0.001` (1ms) o menor
   - Regla práctica: el intervalo debería ser ~1/100 del tiempo total esperado

3. **Interpretación de resultados estadísticos**: Los porcentajes en Pyinstrument son estimaciones basadas en muestras. Para mayor precisión, aumentar el tiempo de ejecución o disminuir el intervalo.

4. **Limitaciones conocidas**:
   - No funciona bien con programas multihilo debido al Global Interpreter Lock (GIL)
   - Puede perder funciones que se ejecutan en menos tiempo que el intervalo
   - El muestreo puede estar sesgado hacia funciones que están activas durante los puntos de muestreo

5. **Alternativas a Pyinstrument**:
   - `py-spy`: Perfilador estadístico que no requiere modificar el código
   - `statprof`: Perfilador estadístico más antiguo pero aún funcional
   - `vmprof`: Especializado para Python con soporte para múltiples VMs

6. **Mejores prácticas**:
   - Ejecutar el programa por tiempo suficiente para obtener muestras significativas
   - Repetir el profiling múltiples veces para confirmar resultados
   - Combinar con perfiladores determinísticos para análisis detallado de funciones específicas
   - Usar diferentes intervalos para validar que los resultados son consistentes

7. **Integración con otras herramientas**: Pyinstrument puede exportar resultados en formatos como JSON, HTML o formato raw para integración con dashboards de monitoreo o análisis posterior.
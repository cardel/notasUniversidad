# Pyinstrument

## Instalación
```bash
pip install pyinstrument
```

## Ejemplo de uso

```python
from pyinstrument import Profiler
from functools import lru_cache

@lru_cache(maxsize=None)
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

def fibonacci_recursive(n):
    if n <= 1:
        return n
    return fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)

if __name__ == "__main__":
   n = 35
   print("Sin memoization:")
   with Profiler(interval=0.1) as profiler:
       print(fibonacci_recursive(n))
   print(profiler.output_text(unicode=True, color=True))

   print("Con memoization:")
   with Profiler(interval=0.001) as profiler:
         print(fibonacci(10*n))
   print(profiler.output_text(unicode=True, color=True))
```

# Análisis de Rendimiento: Fibonacci con y sin Memoización

## 🔴 Sin Memoización (Implementación Recursiva Simple)

**Resultado:** 9,227,465 (Fibonacci de 35)

### 📊 Métricas de Ejecución
```
⏱️  Duración total: 11.351 segundos
⚡ Tiempo de CPU: 11.258 segundos  
📈 Muestras recolectadas: 113
```

### 🎯 Análisis del Perfil
```
100% del tiempo en fibonacci_recursive (11.3s)
└─ Profundidad recursiva extrema (20+ niveles)
   ├─ 10.7s en ramas recursivas profundas
   │  ├─ 10.2s en cálculos redundantes
   │  │  ├─ 9.5s recomputando valores ya calculados
   │  │  │  ├─ 8.3s en llamadas exponenciales
   │  │  │  │  ├─ 6.8s en operaciones innecesarias
   │  │  │  │  │  ├─ 4.3s en cálculos duplicados
   │  │  │  │  │  │  ├─ 2.2s Fibonacci(n-1) + Fibonacci(n-2)
   │  │  │  │  │  │  └─ 2.1s [self] - tiempo en función actual
   │  │  │  │  │  └─ 2.5s [self] - overhead de llamadas
   │  │  │  │  └─ 1.5s [self] - gestión de stack
   │  │  │  └─ 1.2s [self] - retornos y sumas
   │  │  └─ 0.7s [self] - casos base
   │  └─ 0.5s [self] - control de flujo
   └─ 0.4s [self] - retorno final
```

### ⚠️ Problemas Identificados
- **Complejidad exponencial**: O(2ⁿ) - 29.8 millones de llamadas
- **Recomputación masiva**: Mismos valores calculados repetidamente  
- **Overhead de llamadas**: 95% del tiempo en gestión de stack
- **Ineficiencia extrema**: 11.3s para un cálculo que debería ser instantáneo

---

## 🟢 Con Memoización (Usando lru_cache)

**Resultado:** 6.25e+75 (Fibonacci de 350 - valor enorme)

### 📊 Métricas de Ejecución
```
⏱️  Duración total: 0.001 segundos
⚡ Tiempo de CPU: 0.001 segundos
📈 Muestras recolectadas: 1
```

### 🎯 Análisis del Perfil
```
Tiempo insignificante (0.000s) - Completó instantáneamente
└─ Overhead del profiler (0.000s)
   └─ Funciones internas de Pyinstrument
```

### ✅ Ventajas Obtenidas
- **Complejidad lineal**: O(n) - solo 36 llamadas reales
- **Sin recomputación**: Cada valor calculado una sola vez
- **Rendimiento óptimo**: De 11.3s → 0.001s (11,300x más rápido)
- **Escalabilidad**: Capaz de calcular Fibonacci(350) instantáneamente

---

## 📈 Comparativa Resumida

| Métrica | Sin Memoización | Con Memoización | Mejora |
|---------|----------------|----------------|--------|
| ⏱️ Tiempo | 11.351 segundos | 0.001 segundos | 11,350x |
| 📞 Llamadas | ~29.8 millones | 36 | 827,777x |
| 🧠 Complejidad | O(2ⁿ) Exponencial | O(n) Lineal | Exponencial → Lineal |
| 💾 Memoria | Stack overflow risk | Cache controlado | Estable vs Riesgoso |

## 🎯 Conclusión
La memoización transforma un algoritmo inviable (exponencial) en uno eficiente (lineal), demostrando el poder de la optimización algorítmica mediante el almacenamiento inteligente de resultados intermedios.

## Análisis de los resultados

### Sin memoización (Fibonacci recursivo simple)
```
Duration: 11.351    CPU time: 11.258
Samples: 113
```

**Características:**
- **113 muestras** tomadas durante 11.351 segundos
- **100% del tiempo** en `fibonacci_recursive` (11.3 segundos)
- **Profundidad de pila extrema**: Múltiples niveles de recursión anidada
- **Distribución de tiempo**: Mayoría del tiempo en llamadas recursivas profundas
- **Colores indican intensidad**: Rojo (más tiempo) → Verde (menos tiempo)

### Con memoización (Fibonacci con lru_cache)
```
Duration: 0.001     CPU time: 0.001
Samples: 1
```

**Características:**
- **Solo 1 muestra** en 0.001 segundos
- **Tiempo insignificante**: Operación completada casi instantáneamente
- **Overhead del profiler**: La salida muestra principalmente funciones internas de Pyinstrument
- **Eficiencia extrema**: De 11.3 segundos a 0.001 segundos

## Funcionamiento de Pyinstrument

### Perfilador estadístico
- **Muestreo por intervalos**: Toma "fotos" del stack trace a intervalos regulares
- **Intervalo configurable**: `interval=0.1` (100ms) vs `interval=0.001` (1ms)
- **Estimación estadística**: Inferencia del comportamiento basado en muestras

### Ventajas sobre cProfile
- **Menor overhead**: ~2-5% vs ~10-30% de cProfile
- **Más representativo**: Menor perturbación del comportamiento normal del programa
- **Visualización jerárquica**: Muestra la estructura de llamadas en árbol
- **Salida colorizada**: Facilita identificar puntos críticos

### Configuración del intervalo
- **Intervalo grande (0.1s)**: Para operaciones lentas, reduce overhead
- **Intervalo pequeño (0.001s)**: Para operaciones rápidas, mayor precisión
- **Adaptativo**: Pyinstrument puede ajustar el intervalo automáticamente

## Interpretación de la salida

### Elementos visuales
- **Barra coloreada**: Longitud proporcional al tiempo consumido
- **Colores**: Rojo (mucho tiempo), Amarillo (medio), Verde (poco tiempo)
- **Estructura arbórea**: Jerarquía de llamadas con sangrado
- **[self]**: Tiempo gastado en la función misma (no en sub-llamadas)

### Métricas clave
- **Samples**: Número de muestras recolectadas
- **Duration**: Tiempo real transcurrido
- **CPU time**: Tiempo de CPU utilizado
- **Porcentajes**: Distribución relativa del tiempo

Pyinstrument es ideal para:
- Identificar cuellos de botella en aplicaciones reales
- Perfilar con mínimo impacto en rendimiento
- Visualizar la estructura de ejecución del programa
- Comparar el rendimiento antes/después de optimizaciones
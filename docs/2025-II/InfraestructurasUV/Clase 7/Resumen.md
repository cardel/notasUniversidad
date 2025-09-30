En la clase observamos aspectos de paralizacion.

1. Localidad en memoria (diferencia entre recorrer por filas o por columnas)
2. OpenMP: Anotaciones y schedule
# Anotaciones

## Conceptos Fundamentales

### Jerarquía de Memoria y Acceso a Datos
- **Cache como puerta de entrada**: El procesador accede primero a cache, luego a RAM
- **Localidad espacial**: Acceso contiguo mejora rendimiento
- **Row-major order**: En C++, arreglos 2D se almacenan por filas en memoria

### Impacto del Patrón de Acceso
| Acceso por Filas | Acceso por Columnas |
|------------------|---------------------|
| ✅ Memoria contigua | ❌ Saltos en memoria |
| ✅ Pocos cache misses | ❌ Múltiples cache misses |
| ✅ Prefetching efectivo | ❌ Prefetching ineficiente |
| ✅ Alta localidad | ❌ Baja localidad |

## Tabla de Conceptos Clave

| Concepto | Descripción | Impacto en Rendimiento |
|----------|-------------|------------------------|
| **Localidad Espacial** | Acceso a datos contiguos en memoria | Reduce cache misses, mejora prefetching |
| **Falsa Compartición** | Múltiples hilos acceden a misma línea de cache | Invalida cache, aumenta latencia |
| **Cache Miss** | Dato no encontrado en cache, debe cargarse de RAM | Añade 10-100x más latencia |
| **Row-major Order** | Almacenamiento por filas en memoria (C/C++) | Acceso por filas = óptimo |
| **Reducción OpenMP** | Combina resultados parciales de hilos | Evita condiciones de carrera |
| **Schedule Static** | Distribución fija de iteraciones | Overhead mínimo, buen balance uniforme |
| **Schedule Dynamic** | Asignación dinámica con chunks | Mejor load balancing, overhead moderado |
| **Schedule Guided** | Bloques decrecientes | Compromiso overhead/balance |
| **Chunk Size** | Tamaño de bloque para distribución | Pequeño = mejor balance, Grande = menos overhead |

## Directivas OpenMP Principales

| Directiva      | Propósito              | Uso Típico                            |
| -------------- | ---------------------- | ------------------------------------- |
| `parallel for` | Paralelizar loops      | Operaciones independientes            |
| `reduction`    | Combinar resultados    | Sumas, máximos, productos             |
| `schedule`     | Controlar distribución | Optimizar balance de carga            |
| `critical`     | Sección exclusiva      | Acceso seguro a variables compartidas |
| `atomic`       | Operación atómica      | Incrementos simples                   |
| `runtime`      | Schedule configurable  | Pruebas sin recompilar                |

## Optimizaciones Comprobadas

### 1. **Patrón de Acceso Óptimo**
```cpp
// ✅ CORRECTO - Acceso por filas
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        sum += arr[i][j];  // [i][0], [i][1], [i][2]...
    }
}
```

### 2. **Schedule Recomendado**
- **dynamic con chunk pequeño (2-10)**: Mejor balance carga + mínima falsa compartición
- **Resultado**: 49.83 ms vs 66.26 ms (32% mejora)

### 3. **Operaciones Paralelizables vs No Paralelizables**
- **✅ Paralelizables**: Map, filter, reducciones (independientes)
- **❌ No paralelizables**: Prefix sum, Fibonacci (dependencias)

## Conclusiones Prácticas

1. **El cuello de botella es la memoria cache**, no la CPU
2. **Acceso por filas + dynamic scheduling** = combinación óptima
3. **Chunks pequeños** mejoran balance pero aumentan overhead
4. **OpenMP runtime** permite experimentar sin recompilar
5. **Medir siempre** el speedup real considerando overhead




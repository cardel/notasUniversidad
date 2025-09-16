1. Numpy es una librería que internamente crea un equivalente en C++ de código python
2. Utiliza instrucciones AVX para optimizar la ejecución de codigo considerando
	1. Uso de memoria
	2. Uso de instrucciones del procesador


**AVX (Advanced Vector Extensions)** es un conjunto de instrucciones SIMD que permite procesar múltiples datos simultáneamente en un solo ciclo de CPU, ofreciendo aceleración significativa en operaciones matemáticas.

**Ventajas en Python/NumPy:**
- **Aceleración automática**: NumPy utiliza internamente instrucciones AVX para operaciones vectorizadas
- **Paralelismo nativo**: Operaciones como `np.sum()`, `np.dot()` se ejecutan en paralelo
- **Eficiencia memoria**: Mejor uso de caché y ancho de banda
- **Rendimiento cercano a C++**: Con la sintaxis simple de Python

**Por qué evitar indexación en arreglos NumPy:**
```python
# ❌ Ineficiente (Python puro)
suma = 0
for i in range(len(arr)):
    suma += arr[i]  # Conversión a objeto Python

# ✅ Eficiente (AVX interno)
suma = np.sum(arr)  # Operación vectorizada en C++/AVX
```

**Problemas de la indexación manual:**
- Conversión de tipos (NumPy → Python objects)
- Pérdida de paralelismo AVX
- Overhead de interpretación Python
- Acceso secuencial en lugar de vectorizado

**Importancia de saber utilizar estas optimizaciones:**
1. **Rendimiento**: Operaciones 10-100x más rápidas
2. **Escalabilidad**: Aprovecha hardware moderno multicore
3. **Energética**: Menor consumo de recursos
4. **Código limpio**: Operaciones expresivas y concisas

**Mejores prácticas:**
- Usar funciones vectorizadas de NumPy (`np.add`, `np.multiply`)
- Evitar bucles Python con arreglos NumPy
- Utilizar operadores sobrecargados (`+`, `*`, `@`)
- Aprovechar broadcasting en lugar de expansión manual

**Conclusión**: Entender AVX y las optimizaciones subyacentes en NumPy permite escribir código Python de alto rendimiento que rivaliza con lenguajes compilados, manteniendo la simplicidad y productividad de Python.
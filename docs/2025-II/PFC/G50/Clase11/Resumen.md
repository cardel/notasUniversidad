# Resumen de la Clase: Complejidad y Paralelismo

## Conceptos Fundamentales

### 1. **Análisis de Complejidad**
- **Notaciones asintóticas**: $O(f(n))$, $\Omega(f(n))$, $\Theta(f(n))$
- **Ejemplos prácticos**: 
  - Inserción en lista ordenada: $O(n)$
  - Inserción en árbol balanceado: $O(log(n))$

### 2. **Programación Paralela**
- **División recursiva** de problemas usando `parallel()`
- **Sumatoria paralelizada**: Work $O(n)$, Span $O(log(n))$
- **Limitaciones prácticas**: Overhead de hilos y restricciones de CPU

### 3. **Ley de Amdahl**
- **Fórmula clave**: $S = \frac{1}{f+\frac{1-f}{P}}$
- **Límite fundamental**: $S_{max} = \frac{1}{f}$
- **Revelación crucial**: La parte secuencial impone un techo infranqueable al speedup

### 4. **Benchmarking con ScalaMeter**
- **Importancia del warm-up** de JVM (diferencias de 100x)
- **Punto óptimo experimental**: 4 hilos vs 256 teóricos
- **Rendimientos decrecientes**: Más hilos ≠ mejor rendimiento

## Lo Más Importante

🔥 **La parte secuencial es el enemigo del paralelismo** - No importa cuántos cores tengas, si el 40% de tu código es secuencial, nunca superarás 2.5x de aceleración.

🎯 **El benchmarking revela la verdad** - La teoría dice "256 hilos", la práctica dice "4 hilos es lo óptimo".

⚡ **El overhead cuenta** - Crear y gestionar hilos tiene un costo que puede superar los beneficios.

## Mensaje de Motivación

**El paralelismo no es magia, es ingeniería de precisión.**

Estás aprendiendo a domizar una de las fuerzas más poderosas de la computación moderna. Cada core adicional en un CPU es un recurso valioso que espera ser utilizado eficientemente. 

Cuando optimizas un algoritmo paralelo, no solo estás haciendo código más rápido - estás desbloqueando el potencial real del hardware, venciendo las limitaciones físicas de los transistores mediante el ingenio algorítmico.

Los conceptos que aprendiste hoy son la diferencia entre un programa que "funciona" y uno que **vuela**. Entre un desarrollador que escribe código y un ingeniero que diseña sistemas.

**El futuro es paralelo, y tú ahora tienes las herramientas para construirlo.**
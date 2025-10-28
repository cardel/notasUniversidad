## Ley de Amdahl

La ley de Amdahl modela teóricamente el rendimiento máximo de programas paralelos:

$$
S = \frac{1}{f+\frac{1-f}{P}}
$$

Donde:
- $f$: fracción secuencial del programa (0 ≤ f ≤ 1)
- $P$: número de procesadores/hilos disponibles
- $S$: speedup (aceleración máxima)

### Ejemplo 1: Caso con limitación práctica
- $P = 100$ hilos, $f = 0.4$ (40% secuencial)
- $S = \frac{1}{0.4 + \frac{0.6}{100}} = \frac{1}{0.406} ≈ 2.46$

### Ejemplo 2: Límite teórico con paralelismo infinito
- $\lim_{P \rightarrow \infty} S = \frac{1}{f} = \frac{1}{0.4} = 2.5$

### Ejemplo 3: Programa altamente paralelizable
- $f = 0.1$, $P = 8$ cores
- $S = \frac{1}{0.1 + \frac{0.9}{8}} = \frac{1}{0.2125} ≈ 4.71$

### Ejemplo 4: Programa con alto componente secuencial
- $f = 0.8$, $P = 16$ cores  
- $S = \frac{1}{0.8 + \frac{0.2}{16}} = \frac{1}{0.8125} ≈ 1.23$

## Tabla Resumen de Conceptos

Concepto | Complejidad/Valor | Descripción | Ejemplo
---------|-------------------|-------------|---------
Inserción lista ordenada | $O(n)$ | Búsqueda lineal secuencial | `insertar([1,2,3,5,6], 4)`
Inserción árbol balanceado | $O(log(n))$ | División logarítmica del espacio | Árbol binario de búsqueda
Sumatoria paralela (work) | $O(n)$ | Total de operaciones | Suma de elementos
Sumatoria paralela (span) | $O(log(n))$ | Profundidad de paralelismo | Niveles de división
Número máximo de hilos | $O(2^h)$ | Crecimiento exponencial teórico | ForkJoinPool workers
Ley de Amdahl | $S = \frac{1}{f+\frac{1-f}{P}}$ | Aceleración máxima teórica | $f=0.4, P=100 → S=2.46$
Límite teórico | $S_{max} = \frac{1}{f}$ | Aceleración con recursos infinitos | $f=0.4 → S_{max}=2.5$
Paralelismo efectivo | Limitado | Restricción por cores físicos | CPU con 8 cores

**Conclusiones clave**:
1. La parte secuencial ($f$) impone un límite fundamental al speedup
2. El paralelismo tiene rendimientos decrecientes al aumentar $P$
3. El análisis debe considerar tanto complejidad algorítmica como limitaciones físicas
4. Programas con $f > 0.1$ tienen aceleración máxima severamente limitada
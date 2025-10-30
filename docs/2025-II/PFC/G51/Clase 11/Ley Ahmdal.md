# Ley de Amdahl

Vamos a asumir que los programas tienen:

1. **Parte secuencial** que no se puede paralelizar: **$f$**
2. **Parte paralelizable** que corresponde a: **$1-f$**

De acuerdo a esto, la **aceleración**, que es el número de veces que puedo resolver el algoritmo frente a su versión secuencial, está dada por:

$$
\frac{1}{f + \frac{1-f}{P}}
$$

Donde **$P$** es el número de tareas paralelas.

## Ejemplos

**Ejemplo 1:** Si $P = 50$, $f = 0.5$ entonces:

$$
\frac{1}{0.5 + \frac{0.5}{50}} = \frac{1}{0.5 + 0.01} = \frac{1}{0.51} = \frac{100}{51} \approx 1.96
$$

Esto nos dice que el programa teóricamente se acelera **1.96 veces** haciéndolo paralelo en lugar de su versión totalmente secuencial.

**Ejemplo 2:** $P = 200$, $f = 0.2$:

$$
\frac{1}{0.2 + \frac{0.8}{200}} = \frac{1}{0.2 + 0.004} = \frac{1}{0.204} = \frac{1000}{204} \approx 4.9
$$

Que el programa se va a acelerar **4.9 veces** con respecto a su versión secuencial.

## Paralelismo ilimitado

¿Qué pasa si hay **paralelismo ilimitado**? $P \rightarrow \infty$

**Para el primer caso:**

$$
\lim_{P \rightarrow \infty} \frac{1}{0.5 + \frac{0.5}{P}} = \frac{1}{0.5} = 2
$$

**Para el segundo caso:**

$$
\lim_{P \rightarrow \infty} \frac{1}{0.2 + \frac{0.8}{P}} = \frac{1}{0.2} = 5
$$

## Análisis crítico

¿Qué es lo más importante? ¿El **número de hilos** o la **fracción que puedo paralelizar**?

Es **determinante la parte que puedo paralelizar**. Esto quiere decir que no importa la capacidad que tenga si no puedo paralelizar una parte importante de mi algoritmo. Idealmente debería poder **paralelizar todo el algoritmo**.

Además hay que tener en cuenta:

1. Los **procesos que tiene el lenguaje**, por ejemplo en Java el **recolector de basura**
2. La **gestión de hilos** requiere tiempo, es decir agrega **latencia**
3. Tenemos **paralelismo limitado**, dependemos también de la **carga** que tenga el **S.O.** cuando estamos ejecutando el algoritmo.

---

## Tabla de Resumen de Conceptos

| Concepto | Definición | Fórmula/Valor | Importancia |
|----------|------------|---------------|-------------|
| **Ley de Amdahl** | Ley que modela la aceleración máxima de un programa al paralelizarlo | $\frac{1}{f + \frac{1-f}{P}}$ | Fundamental para análisis de paralelismo |
| **Parte secuencial ($f$)** | Fracción del programa que no se puede paralelizar | $0 \leq f \leq 1$ | Factor limitante principal |
| **Parte paralelizable ($1-f$)** | Fracción del programa que se puede ejecutar en paralelo | $1-f$ | Determina el potencial de aceleración |
| **Número de tareas paralelas ($P$)** | Cantidad de procesadores/hilos disponibles | $P \geq 1$ | Factor secundario de aceleración |
| **Aceleración** | Mejora en velocidad respecto a versión secuencial | $\frac{T_{secuencial}}{T_{paralelo}}$ | Métrica de eficiencia |
| **Paralelismo ilimitado** | Caso teórico con infinitos procesadores | $\lim_{P \to \infty} \frac{1}{f + \frac{1-f}{P}} = \frac{1}{f}$ | Límite máximo de aceleración |
| **Factores prácticos limitantes** | Elementos que reducen la aceleración real | Gestión de hilos, SO, GC | Consideraciones importantes en implementación |

**Conceptos importantes destacados:**
- **Ley de Amdahl**
- **Parte secuencial ($f$)**
- **Parte paralelizable ($1-f$)**
- **Aceleración máxima**
- **Paralelismo ilimitado**
- **Factor limitante principal**
- **Consideraciones prácticas**

**Observación clave:** La **fracción secuencial ($f$)** es el **factor más determinante** en la aceleración, más que el número de procesadores disponibles. Incluso con paralelismo infinito, la aceleración máxima está limitada por $\frac{1}{f}$.
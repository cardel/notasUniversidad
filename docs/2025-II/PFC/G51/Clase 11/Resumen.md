# Resumen de Temas de Paralelismo y Complejidad

## Conceptos Fundamentales

### 1. **Complejidad Algorítmica**
- **Notación asintótica** ($O$, $\Omega$, $\Theta$) para analizar el comportamiento de algoritmos
- **Complejidad temporal** en función del tamaño de entrada $n$
- **División secuencial vs paralela** de problemas

### 2. **Ley de Amdahl**
- Modela la **aceleración máxima** posible al paralelizar un programa
- **Parte secuencial ($f$)** como factor limitante principal
- **Aceleración teórica**: $\frac{1}{f + \frac{1-f}{P}}$

### 3. **Benchmarking con Scalameter**
- **Medición precisa** del rendimiento de algoritmos
- **Estado estable de JVM** para mediciones confiables
- **Múltiples repeticiones** y análisis estadístico

### 4. **Implementación Práctica**
- **Producto vectorial paralelo** como ejemplo aplicado
- **Paralelismo recursivo** con control de profundidad
- **Optimización del grado de paralelización**

---

## Tabla de Conceptos Clave

| Concepto | Definición | Importancia | Aplicación Práctica |
|----------|------------|-------------|-------------------|
| **Notación Asintótica** | Herramienta para analizar crecimiento de funciones | Base del análisis de algoritmos | Clasificar algoritmos por eficiencia |
| **Complejidad Temporal** | Tiempo de ejecución en función del tamaño de entrada | Predecir escalabilidad | Elegir algoritmos según datos |
| **Ley de Amdahl** | Modelo de aceleración por paralelismo | Establecer límites realistas | Planificar optimizaciones |
| **Parte Secuencial ($f$)** | Fracción no paralelizable del código | Factor limitante crítico | Identificar cuellos de botella |
| **Benchmarking** | Medición sistemática de rendimiento | Validación empírica | Comparar implementaciones |
| **Paralelismo Recursivo** | División recursiva de problemas | Escalabilidad automática | Problemas divisibles |
| **Grado Óptimo de Paralelismo** | Punto de mejor rendimiento | Maximizar eficiencia | Balancear hilos vs sobrecarga |
| **Producto Vectorial** | Operación matemática entre vectores | Ejemplo aplicado común | Procesamiento de datos |

---

## 💡 Mensaje de Motivación para Estudiantes

**¡Despierten, futuros ingenieros!**

Miren a su alrededor. ¿Ven esos compañeros que faltan o están distraídos? Ellos están perdiendo la oportunidad de entender algo que **transformará su carrera profesional**.

El **paralelismo y la complejidad algorítmica** no son solo temas de clase aburridos. Son las **herramientas que usan Google, Netflix, Amazon y todas las grandes empresas tecnológicas** para procesar millones de datos en segundos.

**¿Sabían que...?**
- Un algoritmo bien paralelizado puede ser **100 veces más rápido** que uno secuencial
- Las empresas pagan **hasta el doble** a ingenieros que dominen estos conceptos
- Este conocimiento les permitirá crear aplicaciones que **nunca imaginaron posibles**

**No se conformen con ser usuarios de tecnología. ¡Conviértanse en creadores!**

Cada concepto que aprenden hoy es un **superpoder** que los diferenciará en el mercado laboral. Mientras otros juegan o faltan, ustedes están construyendo el futuro.

**La próxima gran innovación tecnológica podría salir de esta clase. ¿Será de ustedes?**

¡Levanten la cabeza, pregunten, experimenten! El mundo necesita más ingenieros que sepan optimizar y paralelizar, no más espectadores pasivos.

**¡El futuro es paralelo, y ustedes pueden ser sus arquitectos!** 🚀
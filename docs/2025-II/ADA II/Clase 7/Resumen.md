Trabajamos problemas de optimización lineal

1. Forma de holgura (igualdades) agregando variables de holgura
2. Metodo gráfico: Trazar restricciones y intersectas las areas de ellas en el area de soluciones factibles (acotado, finito), los puntos en esta area (interseccion entre restricciones) son las soluciones factibles, la mejor es elegir la que de mejor en la función objetivo
3. Metodo simplex: Las varibles de holgura (basicas) lo que quiere decir son distintas de cero y las variables de decisión (no basicas) son cero, el primer punto factible es el vector 0
	1. Metodo de holgura: Seleccionamos la variable que entra como el de mayor coeficiente en la funciń objetivo, la variable que sale es en la que esta nos da el menor valor positivo. Se pivotea esta nueva variable basica y se repite el procesoo hasta agotar las variables positivas en la función objetivo
	2. Metodo de tablero: Es similar, pero funciona con el criterio de los coeficiente en la función objetivo son negativos (despeje)
# Resumen: Programación Lineal y Método Simplex

## Conceptos Fundamentales

| Concepto | Descripción | Ejemplo |
|----------|-------------|---------|
| **Función Objetivo** | Función lineal a maximizar/minimizar | $z = 3x_e + 2x_i$ |
| **Restricciones** | Ecuaciones/inecuaciones lineales que limitan las variables | $x_e + 2x_i \leq 6$ |
| **Variables de Decisión** | Variables principales del problema | $x_e, x_i$ |
| **Variables de Holgura** | Variables adicionales para convertir desigualdades en igualdades | $x_1, x_2, x_3, x_4$ |
| **Solución Factible** | Punto que satisface todas las restricciones | $(0,0)$ |
| **Región Factible** | Conjunto de todas las soluciones factibles | Polígono convexo |

## Formas del Problema

| Forma | Características | Ventajas |
|-------|-----------------|----------|
| **Estándar** | Maximización con desigualdades $\leq$ | Fácil interpretación |
| **Holgura** | Igualdades con variables adicionales | Permite aplicar simplex |
| **Canónica** | Forma específica para algoritmos | Estandarización |

## Método Simplex - Proceso

| Paso | Descripción | Ejemplo del Caso |
|------|-------------|------------------|
| 1. **Forma Holgura** | Convertir a igualdades | $x_1 = 6 - x_e - 2x_i$ |
| 2. **Solución Inicial** | Variables no básicas = 0 | $(x_e,x_i)=(0,0)$ |
| 3. **Selección Entrada** | Variable con mayor coeficiente positivo | $x_e$ (coef. 3) |
| 4. **Selección Salida** | Mínima razón positiva | $x_2$ sale |
| 5. **Pivoteo** | Operaciones fila de Gauss-Jordan | Tablero actualizado |
| 6. **Iteración** | Repetir hasta optimalidad | 2 iteraciones |

## Aspectos No Tratados en el Ejemplo

| Tema | Descripción | Aplicación |
|------|-------------|------------|
| **Minimización** | Convertir a maximización multiplicando por -1 | $\min z = \max(-z)$ |
| **Restricciones $\geq$** | Variables de exceso y artificiales | Método de la M Grande |
| **Degeneración** | Múltiples soluciones óptimas | Análisis de sensibilidad |
| **No Acotamiento** | Región factible infinita | Coeficientes en función objetivo |
| **Variables Libres** | Variables sin restricción de signo | Sustitución $x = x^+ - x^-$ |
| **Análisis de Sensibilidad** | Efecto de cambios en parámetros | Rangos de optimalidad |
| **Dualidad** | Problema dual asociado | Interpretación económica |
| **Método de Dos Fases** | Para problemas con variables artificiales | Fase I: factibilidad |

## Tabla Comparativa: Métodos de Solución

| Método | Variables | Aplicación | Ventajas | Limitaciones |
|--------|-----------|------------|----------|--------------|
| **Gráfico** | 2-3 | Visualización | Intuitivo | Solo 2-3 variables |
| **Simplex** | n | General | Eficiente en práctica | Complejidad exponencial |
| **Punto Interior** | n | Grande escala | Complejidad polinomial | Menos intuitivo |

## Resultado Final del Ejemplo

**Solución Óptima:**
- $x_e = \frac{10}{3}$, $x_i = \frac{4}{3}$
- $z = \frac{38}{3}$
- Variables básicas: $x_e, x_i, x_3, x_4$
- Variables no básicas: $x_1, x_2$

**Condición de Optimalidad:** Todos los coeficientes en la función objetivo son no negativos.
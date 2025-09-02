# Recursión en Programación

## 🧠 Concepto Fundamental

La **recursión** es una técnica donde una función se llama a sí misma para resolver un problema dividiéndolo en subproblemas más pequeños.

## 🎯 Estructura de una Función Recursiva

### 1. Caso Base
Condición de parada que proporciona la solución trivial.

### 2. Caso Recursivo
Llamado a la misma función con parámetros modificados que acercan al caso base.

## 📊 Tipos de Recursión

## 📐 Ejemplo factorial

La función factorial se define recursivamente como:

$$
fact(x) = \begin{cases}
   1  & \text{si } x = 0 \\
   x \times fact(x-1) & \text{si } x > 0
\end{cases}
$$


### 🔄 Recursión Lineal
```scala
def factorial(x: Int): Int = {
    if (x == 0) 1
    else x * factorial(x - 1)
}
```

**Proceso de ejecución:**
```
fact(5) → 5 * fact(4)
fact(4) → 4 * fact(3)  
fact(3) → 3 * fact(2)
fact(2) → 2 * fact(1)
fact(1) → 1 * fact(0)
fact(0) → 1

// Luego se resuelven en reversa:
1 * 1 = 1
2 * 1 = 2
3 * 2 = 6
4 * 6 = 24
5 * 24 = 120
```

**Características:**
- Requiere almacenar todos los llamados en la pila (stack)
- Consume más memoria
- Más intuitiva pero menos eficiente

### 🚀 Recursión de Cola (Tail Recursion)
```scala
import scala.annotation.tailrec

@tailrec
final def factT(x: Int, acc: Int = 1): Int = {
    if (x == 0) acc
    else factT(x - 1, x * acc)
}
```

**Proceso de ejecución:**
```
factT(5, 1)
factT(4, 5)
factT(3, 20) 
factT(2, 60)
factT(1, 120)
factT(0, 120) → 120
```

**Características:**
- La llamada recursiva es la última operación
- Scala optimiza eliminando los frames de pila
- Más eficiente en memoria
- Requiere parámetro acumulador


## 💡 Consideraciones Importantes

### Soporte de Lenguajes
- Scala soporta **optimización de tail recursion** con `@tailrec`
- Algunos lenguajes no optimizan tail calls (consulta: [Tail Call Support](https://en.wikipedia.org/wiki/Tail_call#Language_support))

### Buenas Prácticas
1. **Siempre definir caso base** para evitar recursión infinita
2. **Usar `@tailrec`** para verificar y optimizar recursión de cola
3. **Considerar iteración** cuando la recursión sea muy profunda
4. **Documentar** la condición de terminación

## 🎯 Cuándo Usar Cada Tipo

| Tipo | Útil para | Ventajas | Desventajas |
|------|-----------|----------|-------------|
| **Lineal** | Problemas con estructura de árbol | Más intuitiva | Consume más memoria |
| **Cola** | Cálculos secuenciales | Eficiente en memoria | Requiere parámetro acumulador |

## ⚠️ Precauciones

- **Stack Overflow**: La recursión lineal puede causar desbordamiento de pila
- **Complejidad**: Asegurar que cada llamada se acerque al caso base
- **Legibilidad**: Balancear entre elegancia y comprensibilidad

La recursión es una herramienta poderosa que, cuando se usa adecuadamente, puede simplificar significativamente la solución de problemas complejos.
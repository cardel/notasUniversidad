
- Son problemas de divide y vencerás
- Son problemas **optimización** búsqueda de la mejor solución
- Los subproblemas con **INDEPENDIENTES** que no se depende de la solución de problemas analogos P(i,j) en una rama de recursividad, si encuentra otro P(i,j) en otra rama, da el mismo resultado
- Podemos utilizar una estructura de datos para mapear los subproblema **subestructura optima** esta estructura debe mapear todos los subproblemas

# Algunos apuntes

1. Enfoque bottom-up resolver problemas triviales primero y luego sucesivamente los subproblemas hasta llegar el general
2. En la substructura optima primero solucionamos los problemas base y posteriormente a partir de los resultados de subproblemas vamos resolviendo hasta llegar hasta el general


# Enfoques de Programación Dinámica: Top-Down vs Bottom-Up

## Tabla Comparativa

| Aspecto | Top-Down (Memoization) | Bottom-Up (Tabulation) |
|---------|------------------------|------------------------|
| **Dirección** | Problema grande → subproblemas pequeños | Subproblemas pequeños → problema grande |
| **Almacenamiento** | Memoization (cache de resultados) | Tabla prellenada sistemáticamente |
| **Ejecución** | Recursiva con caching | Iterativa |
| **Complejidad espacial** | Puede ser mayor (pila de recursión) | Generalmente más eficiente |
| **Implementación** | Más intuitiva | Más estructurada |

## Estrategia Top-Down (Memoization)

### Descripción
Se resuelve el problema principal recursivamente, almacenando las soluciones de subproblemas en una estructura de memoización para evitar recálculos.

### Ejemplo Práctico: Fibonacci
```python
def fibonacci(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 2:
        return 1
    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)
    return memo[n]
```

### Ventajas
- Más intuitiva y cercana a la definición recursiva natural
- Solo calcula subproblemas necesarios
- Fácil de implementar

### Desventajas
- Overhead de llamadas recursivas
- Puede causar desbordamiento de pila
- Menos eficiente en uso de memoria

### Subestructura Óptima
Cada subproblema se resuelve una vez y se almacena. La solución óptima del problema principal se construye a partir de soluciones óptimas de subproblemas almacenadas.

## Estrategia Bottom-Up

### Descripción
Se resuelven todos los subproblemas más pequeños primero y se almacenan sus soluciones en una tabla, construyendo gradualmente la solución del problema principal.

### Ejemplo Práctico: Fibonacci
```python
def fibonacci(n):
    if n <= 2:
        return 1
    dp = [0] * (n+1)
    dp[1] = dp[2] = 1
    for i in range(3, n+1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
```

### Ventajas
- Sin overhead de recursión
- Más eficiente en uso de memoria
- Mejor rendimiento en general
- No riesgo de desbordamiento de pila

### Desventajas
- Puede calcular subproblemas innecesarios
- Menos intuitiva
- Requiere identificar el orden de resolución

### Subestructura Óptima
Se garantiza que cuando se resuelve un subproblema, todas las soluciones de subproblemas más pequeños ya están disponibles en la tabla, asegurando la optimalidad.
# Punto 1 - Dividir y Conquistar [13 pts.]

## 1. (13 puntos) Considere el siguiente problema:
**Entrada:** Un arreglo $A[0..N)$ de números ordenados ascendentemente y un número $v$.
**Salida:** El número de veces que aparece $v$ en el arreglo $A$.

Implemente una solución a este problema cuya complejidad sea $O(\log N)$. Explique.

## Estrategia de solución
La estrategia se basa en una **búsqueda binaria modificada** para contar ocurrencias en un arreglo ordenado. En lugar de detenerse al encontrar una coincidencia, continúa buscando en ambos subarreglos adyacentes para contar todas las apariciones.

### Algoritmo recursivo:
1. **Caso base:**
   - Si $l > r$: el subarreglo está vacío → retornar 0.
   - Si $l = r$: el subarreglo tiene un solo elemento → retornar 1 si $A[l] = v$, 0 en caso contrario.

2. **Caso recursivo:**
   - Calcular el punto medio $m = \lfloor \frac{l+r}{2} \rfloor$.
   - Si $v < A[m]$: buscar solo en la mitad izquierda, $A[l..m-1]$.
   - Si $v > A[m]$: buscar solo en la mitad derecha, $A[m+1..r]$.
   - Si $v = A[m]$: sumar 1 (por la coincidencia en $m$) y buscar recursivamente en **ambos** subarreglos: izquierda $A[l..m-1]$ y derecha $A[m+1..r]$.

### Análisis de casos:
- **Mejor caso:** $v$ no está en el arreglo o aparece una sola vez. Solo se sigue una rama del árbol de recursión, igual que la búsqueda binaria clásica: $O(\log n)$.
- **Peor caso:** Todos los elementos del arreglo son iguales a $v$. En cada nivel se exploran ambos subarreglos, llevando a la recurrencia $T(n) = 2T(n/2) + O(1)$, que resuelve a $O(n)$.
- **Caso promedio:** Depende de la frecuencia de $v$. Si las repeticiones están dispersas, el comportamiento se aproxima a $O(\log n)$.

## Código implementado con comentarios

```python
def binary_search(A, l, r, v):
    """
    Cuenta las ocurrencias de v en el subarreglo A[l..r] (ordenado ascendentemente).
    Utiliza una búsqueda binaria modificada para explorar ambos lados cuando encuentra v.
    
    Args:
        A: arreglo ordenado de números
        l: índice izquierdo del subarreglo
        r: índice derecho del subarreglo
        v: valor a buscar
    
    Returns:
        Número de veces que v aparece en A[l..r]
    """
    # Caso base: subarreglo vacío (índices cruzados)
    if l > r:
        return 0
    
    # Caso base: subarreglo de un solo elemento
    if l == r:
        return 1 if A[l] == v else 0
    
    # Caso recursivo: calcular punto medio
    m = (l + r) // 2
    
    if v < A[m]:
        # v es menor que el elemento medio → buscar solo en la mitad izquierda
        return binary_search(A, l, m - 1, v)
    elif v > A[m]:
        # v es mayor que el elemento medio → buscar solo en la mitad derecha
        return binary_search(A, m + 1, r, v)
    else:
        # v coincide con A[m] → contar este elemento y buscar en ambos lados
        # (porque puede haber más ocurrencias a izquierda y derecha)
        return 1 + binary_search(A, l, m - 1, v) + binary_search(A, m + 1, r, v)

if __name__ == "__main__":
    # Arreglo de prueba ordenado ascendentemente
    A = [1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3]
    
    # Probar conteo para diferentes valores
    for i in [1, 2, 3, 4]:
        cnt = binary_search(A, 0, len(A) - 1, i)
        print(f"Conteo de {i}: {cnt}")
```

## Conceptos teóricos clave

### 1. Paradigma "Dividir y Conquistar"
Estrategia algorítmica que resuelve un problema dividiéndolo en subproblemas más pequeños del mismo tipo, resolviéndolos recursivamente y combinando sus soluciones.

### 2. Búsqueda binaria clásica
Algoritmo $O(\log n)$ para buscar un elemento en un arreglo ordenado, que compara con el elemento medio y descarta la mitad del espacio de búsqueda en cada paso.

### 3. Búsqueda binaria modificada para conteo
Variante que, al encontrar una coincidencia, no se detiene sino que continúa buscando en ambos subarreglos adyacentes para contar todas las ocurrencias.

### 4. Análisis de complejidad asintótica
- **Notación Big-O:** Describe el límite superior del crecimiento del tiempo de ejecución.
- **Recurrencias:** Ecuaciones que definen funciones en términos de valores más pequeños (ej: $T(n) = 2T(n/2) + O(1)$).

### 5. Casos de análisis algorítmico
- **Mejor caso:** Escenario más favorable para la entrada.
- **Peor caso:** Escenario más desfavorable (garantía de rendimiento).
- **Caso promedio:** Comportamiento esperado para entradas típicas.

## Tabla de resumen de conceptos

| Concepto | Descripción | Complejidad en este problema |
|----------|-------------|------------------------------|
| **Dividir y Conquistar** | Paradigma que divide problemas en subproblemas más pequeños | Base del diseño algorítmico |
| **Búsqueda binaria** | Algoritmo para buscar en arreglos ordenados | $O(\log n)$ en caso óptimo |
| **Búsqueda binaria modificada** | Variante para contar todas las ocurrencias | Mejor caso: $O(\log n)$, Peor caso: $O(n)$ |
| **Análisis de casos** | Evaluación de diferentes escenarios de entrada | Fundamental para entender límites |
| **Recurrencias** | Ecuaciones para analizar algoritmos recursivos | $T(n) = 2T(n/2) + O(1)$ en peor caso |
| **Arreglos ordenados** | Estructura de datos con elementos en orden | Permite búsqueda eficiente |

## Comentarios adicionales

1. **Limitación de la solución presentada:** Aunque el algoritmo aprovecha el orden del arreglo, su complejidad en el peor caso ($O(n)$) no cumple estrictamente con el requisito de $O(\log n)$ para todas las entradas. Para garantizar $O(\log n)$ en todos los casos, se necesitaría una estrategia diferente.

2. **Alternativa con complejidad garantizada $O(\log n)$:** Se pueden usar dos búsquedas binarias:
   - Primera búsqueda: encontrar la **primera** ocurrencia de $v$ (índice izquierdo).
   - Segunda búsqueda: encontrar la **última** ocurrencia de $v$ (índice derecho).
   - Conteo = (último - primero + 1) si $v$ existe, 0 en caso contrario.
   - Cada búsqueda es $O(\log n)$, total $O(\log n)$.

3. **Aplicaciones prácticas:** Este tipo de problemas surgen en sistemas de bases de datos (consultas de frecuencia), análisis de logs, y procesamiento de datos donde se necesita contar ocurrencias en datos ordenados.

4. **Consideraciones de implementación:** 
   - La versión recursiva puede causar desbordamiento de pila para arreglos muy grandes.
   - Una versión iterativa podría ser más eficiente en uso de memoria.
   - Para arreglos con muchas repeticiones, la estrategia de dos búsquedas binarias es superior.

5. **Relación con estructuras de datos:** Este problema ilustra la importancia del preprocesamiento (ordenamiento) para permitir búsquedas eficientes, conectando con temas como índices en bases de datos y estructuras de datos ordenadas (árboles binarios de búsqueda, B-trees).
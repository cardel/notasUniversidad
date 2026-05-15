# Árboles de Fenwick (Fenwick Tree / Binary Indexed Tree)

## ¿Qué son?

Es una representación implícita de una operación en un arreglo. Las particiones son binarias en orden de bits (por potencias de 2). La función $F$ debe ser **asociativa** y **reversible**.

**Conceptos teóricos clave:**
- **Asociatividad**: $(a \circ b) \circ c = a \circ (b \circ c)$, permite combinar resultados parciales en cualquier orden.
- **Reversibilidad**: existe una operación inversa que permite deshacer la combinación (por ejemplo, resta para suma, división para multiplicación).
- **Representación implícita**: el árbol no se almacena explícitamente como estructura de nodos, sino que se codifica en un arreglo usando manipulación de bits.

Tenemos dos funciones, suponiendo indexación desde 0:

1. $g(i) = i \ \& \ (i+1)$ — encuentra el límite inferior del rango que cubre $T[i]$
2. $h(i) = i \ | \ (i+1)$ — encuentra el siguiente índice que debe actualizarse

Para generar el árbol, creamos el arreglo $T$:

$T[i] = [g(i), i]$

- **Creación**: aplicamos $f$ para los elementos entre $[g(i), i]$
- **Query**: $T[i] = T[i] + T[g(i)-1] + \ldots$ paramos cuando $g(i) = 0$. Vamos sumando los rangos parciales usando $g(i)$
- **Update**: Actualizamos $T[i]$ y procedemos con $T(h(i))$ hasta que $h(i) > N$

## Ejemplos

### Query

Es aplicación prefija desde 0 hasta $i$

```
query(6): el bucle sí itera
paso    1       2       3       actual
        6       5       3       T[actual]
        6       6       25      s acumulado
        6       12      37      g(actual)
        6 ≠ 0   4 ≠ 0   0       siguiente
        actual = 5      actual = 3      terminar
```

**Explicación del proceso:**
- `paso 1`: empezamos en `actual = 6`, sumamos `T[6] = 6`, luego `g(6) = 6 & 7 = 6 ≠ 0`, pasamos a `actual = g(6) - 1 = 5`
- `paso 2`: `actual = 5`, sumamos `T[5] = 6`, acumulado = 12, `g(5) = 5 & 6 = 4 ≠ 0`, pasamos a `actual = g(5) - 1 = 3`
- `paso 3`: `actual = 3`, sumamos `T[3] = 25`, acumulado = 37, `g(3) = 3 & 4 = 0`, terminamos

### Update

```
update(2, 1)
paso    1       2       3       —
actual  2       3       7       15
T[actual] tras += 1
        4→5     25→26   46→47   —
h(actual)
        2|3=3   3|4=7   7|8=15  —
siguiente
        actual = 3      actual = 7      actual = 15
        15 ≥ N = 10: terminar
```

**Explicación del proceso:**
- `paso 1`: `actual = 2`, incrementamos `T[2]` de 4 a 5, `h(2) = 2 | 3 = 3`, pasamos a `actual = 3`
- `paso 2`: `actual = 3`, incrementamos `T[3]` de 25 a 26, `h(3) = 3 | 4 = 7`, pasamos a `actual = 7`
- `paso 3`: `actual = 7`, incrementamos `T[7]` de 46 a 47, `h(7) = 7 | 8 = 15`, como `15 ≥ N = 10`, terminamos

### Query en rango

$Query(l, r)$ desde $l$ hasta $r$: $Query(r) - Query(l-1)$

**Nota importante**: Esta fórmula funciona porque la operación es reversible. Para suma, $Query(l, r) = prefix(r) - prefix(l-1)$. Para otras operaciones (como multiplicación), sería $prefix(r) / prefix(l-1)$.

## Tabla de resumen

| Concepto | Descripción | Fórmula clave |
| :--- | :--- | :--- |
| **Estructura** | Arreglo $T$ que almacena sumas de rangos basados en potencias de 2 | $T[i] = f([g(i), i])$ |
| **Función $g(i)$** | Encuentra el inicio del rango cubierto por $T[i]$ | $g(i) = i \ \& \ (i+1)$ |
| **Función $h(i)$** | Encuentra el siguiente índice a actualizar | $h(i) = i \ | \ (i+1)$ |
| **Query prefijo** | Suma desde índice 0 hasta $i$ | Iterar con $g(i)$ hasta llegar a 0 |
| **Update** | Actualiza $T[i]$ y propaga a $T[h(i)]$ | Iterar con $h(i)$ hasta superar $N$ |
| **Query rango** | Consulta entre $l$ y $r$ | $Query(r) - Query(l-1)$ |
| **Complejidad temporal** | Creación, query y update | $O(\log N)$ |
| **Complejidad espacial** | Almacenamiento | $O(N)$ |

**Comentarios adicionales:**
- Los árboles de Fenwick son particularmente útiles cuando se necesitan consultas de rango y actualizaciones puntuales frecuentes.
- La indexación desde 0 es la más común en implementaciones modernas, aunque algunas implementaciones usan indexación desde 1 con fórmulas ligeramente diferentes ($g(i) = i - (i \ \& \ -i)$, $h(i) = i + (i \ \& \ -i)$).
- La operación debe ser reversible para poder realizar consultas de rango arbitrario; si no lo es, solo se pueden hacer consultas de prefijo.
- No confundir con un segment tree: el Fenwick tree es más simple y eficiente en memoria, pero solo soporta operaciones reversibles y no puede manejar actualizaciones de rango fácilmente sin modificaciones adicionales.
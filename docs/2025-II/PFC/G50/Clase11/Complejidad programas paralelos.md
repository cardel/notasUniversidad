# Complejidad de Programas Paralelos

## Análisis de Complejidad en Programas Secuenciales

La complejidad computacional mide la cantidad de operaciones requeridas para resolver un problema en función del tamaño de entrada $n$. Se utilizan tres notaciones asintóticas principales:

- **$O(f(n))$**: Cota superior (peor caso)
- **$\Omega(f(n))$**: Cota inferior (mejor caso)  
- **$\Theta(f(n))$**: Cota ajustada (caso promedio)

### Ejemplos Secuenciales

**Caso 1: Inserción en lista ordenada** - $O(n)$
```scala
def insertar(l:List[Int], e: Int):List[Int] = {
    l match {
        case Nil => e :: Nil
        case x :: xs =>
            if (x > e)
                e :: l
            else
                x :: insertar(xs, e)  // Recorrido lineal
    }
}
```

**Caso 2: Inserción en árbol binario balanceado** - $O(log(n))$
- Altura del árbol: $O(log_2(n))$
- Propiedad logarítmica: $log_a(b) = \frac{log_c(b)}{log_c(a)} = c_{te} \cdot log_c(b)$

## Análisis con Paralelismo

### Sumatoria Paralelizada

La sumatoria $\sum_{i=1}^{n} i$ se puede dividir recursivamente:
$$\sum_{i=1}^{n} i = \sum_{i=1}^{\frac{n}{2}} i + \sum_{i=\frac{n}{2}+1}^{n} i$$

### Implementación Paralela

```scala
def sumaParcial(arr: Array[Int], ini: Int, fin:Int): Int = {
    println(s"Hilo ${Thread.currentThread().getName} procesando desde $ini hasta $fin")
    
    if (fin - ini < limite)
        // Umbral secuencial: O(n) operaciones
        (ini until fin).foldLeft(0)((acc,e) => acc + arr(e))
    else {
        val mit:Int = (ini + fin)/2
        val (s1, s2) = parallel(  // División paralela
            sumaParcial(arr, ini, mit),
            sumaParcial(arr, mit, fin)
        )
        s1 + s2
    }
}
```

### Observaciones del Ejecución

- **Reutilización de hilos**: El ForkJoinPool optimiza el uso de recursos
- **Crecimiento exponencial**: El número potencial de hilos es $O(2^h)$ donde $h$ es la profundidad
- **Limitación práctica**: El paralelismo real está limitado por los cores disponibles

### Análisis de Complejidad Paralela

1. **Componente secuencial**: $O(n)$ operaciones no paralelizables
2. **Componente paralela**: $O(log(n))$ niveles de división
3. **Limitación física**: Paralelismo acotado por recursos de CPU

## Tabla Resumen de Conceptos

Concepto | Complejidad | Descripción | Ejemplo
---------|-------------|-------------|---------
Inserción lista ordenada | $O(n)$ | Búsqueda lineal secuencial | `insertar([1,2,3,5,6], 4)`
Inserción árbol balanceado | $O(log(n))$ | División logarítmica del espacio | Árbol binario de búsqueda
Sumatoria paralela (work) | $O(n)$ | Total de operaciones | Suma de elementos
Sumatoria paralela (span) | $O(log(n))$ | Profundidad de paralelismo | Niveles de división
Número máximo de hilos | $O(2^h)$ | Crecimiento exponencial teórico | ForkJoinPool workers
Paralelismo efectivo | Limitado | Restricción por cores físicos | CPU con 8 cores

**Conclusión clave**: El análisis de programas paralelos debe considerar tanto el trabajo total ($O(n)$) como el span ($O(log(n))$), junto con las limitaciones prácticas del hardware.
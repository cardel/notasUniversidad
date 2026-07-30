# Divide y vencerás
1. Divida hasta el caso base (solución trivial) en el caso de ordenamiento un arreglo de tamaño 1 está ordenado
2. Conquiste resolviendo los subproblemas
3. Combine las soluciones

# Mergesort
1. Divida en mitades n/2
2. Divida hasta que tenga arreglos de tamaño 1 (están ordenados) paso de conquistar es trivial
3. Combine la soluciones. Tienen dos arreglos ordenados y debemos retornar un sólo arreglo ordenado (puede hacer en n paso) O(n) **Ventaja** Porque están ordenados.

![](attachments/ExplicionMergesort.pdf){ type=application/pdf style="min-height:70vh;width:100%"}

## Complejidad
Tenemos que generamos 2 problemas de tamaño n/2 y combinar/conquistar nos cuesta O(n) por lo tanto

$$T(n) = T(\frac{n}{2})+O(n)$$

Al resolver esta ecuación por método de árbol, nos da $O(nlog(n))$

Se porque:
1. Es un arbol binario (dos hijos)
2. La altura de ese árbol de log(n)
3. Cada nivel suma n
4. Por lo tanto nos da nlog(n)

Este algoritmo tiene que en cualquier caso da la misma complejidad, pero, este algoritmo es costoso en memoria al necesitar crear nuevas estructuras de datos a medida de que combina y conquista.
# Recursión de cola

Es una optimización de la recursión en la cual el proceso se comporta de forma iterativa, evitando abrir marcos de pila adicionales (es eficiente en memoria).

## Ejemplo en Scala

```scala
// La anotación @tailrec garantiza en tiempo de compilación que la función es recursiva de cola.
// Si no lo es, el compilador generará un error.
@scala.annotation.tailrec  
final def sumaCuadradosI(lst: List[Int], acc: Int = 0): Int = {  
  // Caso base: cuando la lista está vacía, retorna el acumulador con el resultado final.
  if (lst.isEmpty) acc  
  // Caso recursivo de cola: la llamada recursiva es la última operación.
  // Se actualiza el acumulador con el cuadrado del primer elemento y se pasa el resto de la lista.
  else sumaCuadradosI(lst.tail, acc + lst.head * lst.head)  
}
```

Es muy importante colocar la anotación `@tailrec` porque si la función no es recursiva de cola, la compilación falla, asegurando así la optimización.

El diseño de la recursión de cola recibe como parámetro un acumulador (`acc`) que inicialmente contiene el valor correspondiente al caso base. El caso base retorna el acumulador, y el caso recursivo modifica el acumulador antes de realizar la llamada recursiva.

### Traza de ejecución:
```scala
sumaCuadradosI(List(1, 2, 3, 4), 0)
sumaCuadradosI(List(2, 3, 4), 1)    // acc = 0 + 1*1 = 1
sumaCuadradosI(List(3, 4), 5)       // acc = 1 + 2*2 = 5
sumaCuadradosI(List(4), 14)         // acc = 5 + 3*3 = 14
sumaCuadradosI(List(), 30)          // acc = 14 + 4*4 = 30
30                                   // Caso base: retorna acc = 30
```

Observe que el acumulador va calculando el resultado paulatinamente, y en cada paso la lista se reduce hasta llegar al caso base.

## Conceptos teóricos adicionales

- **Recursión de cola (Tail Recursion)**: Una función es recursiva de cola cuando la llamada recursiva es la última operación que se ejecuta en el caso recursivo. No hay operaciones pendientes después de la llamada.
- **Optimización de llamada de cola (TCO - Tail Call Optimization)**: Técnica del compilador/interprete que reutiliza el marco de pila actual para la llamada recursiva, evitando crecer la pila. En Scala, se activa con `@tailrec`.
- **Acumulador**: Parámetro adicional que lleva el resultado parcial a través de las llamadas recursivas, permitiendo que el caso base retorne el resultado final directamente.
- **Ventaja principal**: Elimina el riesgo de **stack overflow** para recursiones profundas, ya que el consumo de memoria es constante (O(1)) en lugar de lineal (O(n)).

## Tabla de resumen

Concepto | Descripción | Ejemplo/Nota |
| --- | --- | --- |
| **Recursión de cola** | Función recursiva donde la llamada recursiva es la última operación ejecutada. | `sumaCuadradosI` |
| **Anotación @tailrec** | Anotación de Scala que fuerza la verificación en compilación de que la función es recursiva de cola. | Obligatoria para garantizar TCO |
| **Acumulador (acc)** | Parámetro que acumula el resultado parcial a través de las llamadas recursivas. | `acc` inicia en 0 y se actualiza |
| **Optimización de llamada de cola (TCO)** | Técnica que reutiliza el marco de pila, evitando crecimiento lineal de la pila. | Implementada por el compilador Scala |
| **Caso base en recursión de cola** | Retorna directamente el valor del acumulador, sin necesidad de desenrollar la pila. | `if (lst.isEmpty) acc` |
| **Ventaja de memoria** | Consumo de memoria constante (O(1)) vs. lineal (O(n)) en recursión lineal. | Evita stack overflow |

## Comentarios adicionales

- La recursión de cola transforma un proceso recursivo en uno iterativo a nivel de ejecución, manteniendo la elegancia declarativa del código recursivo.
- En Scala, siempre que sea posible, se debe preferir la recursión de cola sobre la recursión lineal para funciones recursivas profundas.
- El patrón común es agregar un parámetro acumulador que se inicializa con el valor neutro de la operación (0 para suma, 1 para producto, etc.).
- No todas las funciones recursivas pueden transformarse fácilmente a recursión de cola; a veces se requiere cambiar el enfoque algorítmico.
- Lenguajes funcionales puros (como Haskell) implementan TCO automáticamente, mientras que en Scala se requiere la anotación explícita `@tailrec`.
- Para algoritmos complejos, la recursión de cola puede hacer que el código sea menos intuitivo; en esos casos, documentar claramente el papel del acumulador es esencial.
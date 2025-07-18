# Clase 12: Paralelismo de tareas

```scala
import common.
import scala.util.Random
import org.scalameter.

def merge(v1: Vector[Int], v2: Vector[Int]): Vector[Int] = {
  val n1 = v1.length
  val n2 = v2.length
  if (n1 == 0) v2 
  else if (n2 == 0) v1
  else if (v1(0) < v2(0)) v1(0) +: merge(v1.slice(1, n1), v2)
  else v2(0) +: merge(v1, v2.slice(1, n2))
}

def mergeSortSeq(v: Vector[Int]): Vector[Int] = {
  val n = v.length
  val m = n/2
  if (n <= 1) v 
  else merge(mergeSortSeq(v.slice(0,m)), mergeSortSeq(v.slice(m, n)))
}

def mergeSortPar(maxProf: Int)(prof: Int)(v: Vector[Int]): Vector[Int] = {
  val n = v.length
  val m = n/2
  if (prof > maxProf) mergeSortSeq(v) 
  else {
    val (v1, v2) = parallel(mergeSortPar(maxProf)(prof+1)(v.slice(0,m)), 
                           mergeSortPar(maxProf)(prof+1)(v.slice(m, n)))
    merge(v1, v2)
  }
}
```

Resultado

```jsx
seq: 8.830642 ms
par4: 3.839996 ms
par8: 3.586142 ms
```

# Operaciones en paralelo

1. El número de hilos
    1. Esta limitado por el hardware
    2. Podemos limitar por profundidad (exponencial) o por umbral (tamaño del arreglo para resolverlo de forma secuencia)
2. Operaciones deben ser asociativas: Puedo determinar el orden en que las agrupo
3. Las listas no son las mejores para paralelizar: no son faciles de dividir por su estructura recursiva (cabeza, cola) en su lugar usar vectores o arreglos
4. Estrategias para parelizar
    1. Profundidad, cada vez que se hace un llamado aumento la profundidad en un arbol binario
    2. Umbral: Si el tamaño de la colección es menor que un valor dado se ejecuta de forma secuencial
    3. Arbol: Se construye una estructura de datos, en la cual el nodo es la parelización y la hoja es la solución del problema

# Map

### Estrategia por umbral

```scala
val umbral = 10000

def mapASegPar[A, B](ent: Array[A],
                     izq: Int, der: Int,
                     f: A => B,
                     sal: Array[B]): Unit = {
  // Escribe en sal(i) para izq <= i <= der-1
  if (der - izq < umbral)
    mapASegSeq(ent, izq, der, f, sal)
  else {
    val mid = izq + (der - izq) / 2
    parallel(
      mapASegPar(ent, izq, mid, f, sal),
      mapASegPar(ent, mid, der, f, sal)
    )
  }
}

val e = Array(2, 3, 4, 5, 6)

```

El concepto de "umbral" en la paralelización se refiere a un límite predefinido que decide cuándo una tarea debe resolverse de manera secuencial en lugar de seguir dividiéndose en sub-tareas paralelas. Este enfoque es útil para evitar el overhead que genera la paralelización en casos donde las tareas son demasiado pequeñas, ya que el costo de coordinar hilos puede superar los beneficios de dividir el trabajo.

En el caso del código presentado, el umbral se utiliza para determinar si el rango de elementos (definido por `izq` y `der`) es suficientemente grande como para justificar la paralelización. Si el rango es menor que el umbral (`der - izq < umbral`), se realiza el cálculo de manera secuencial utilizando la función `mapASegSeq`. Por el contrario, si el rango es mayor, se divide en dos mitades (`mid`) y se procesa cada una de ellas en paralelo utilizando la función `parallel`.

El beneficio principal de esta estrategia es que combina la eficiencia de la paralelización para tareas grandes con el bajo costo de la ejecución secuencial para tareas pequeñas. Esto optimiza el rendimiento general del programa, evitando que los recursos del sistema se desperdicien en la creación y administración de hilos para tareas insignificantes.

### Estrategia por árboles

```scala
sealed abstract class Tree[A] {
  val size: Int
}

case class Leaf[A](a: Array[A]) extends Tree[A] {
  override val size = a.size
}

case class Node[A](l: Tree[A], r: Tree[A]) extends Tree[A] {
  override val size = l.size + r.size
}

def mapTreePar[A: Manifest, B: Manifest](t: Tree[A], f: A => B): Tree[B] = t match {
  case Leaf(a) => {
    val len = a.length
    val b = new Array[B](len)
    var i = 0
    while (i < len) {
      b(i) = f(a(i))
      i = i + 1
    }
    Leaf(b)
  }
  case Node(l, r) => {
    val (lb, rb) = parallel(mapTreePar(l, f), mapTreePar(r, f))
    Node(lb, rb)
  }
}

```

El código presentado utiliza una estructura de datos de árbol (`Tree`) para facilitar la paralelización en el caso de operaciones de mapeo. A continuación, se explican las partes más importantes y cómo benefician la paralelización:

1. **Clase Abstracta `Tree[A]` y Sus Subclases**:
    - `Tree[A]` es una clase abstracta que representa un árbol genérico, donde cada nodo puede ser un nodo interno (`Node`) o una hoja (`Leaf`).
    - `Leaf[A]` representa las hojas del árbol, que contienen un arreglo (`Array[A]`) de elementos. Cada hoja tiene un tamaño (`size`), que es simplemente la cantidad de elementos en el arreglo.
    - `Node[A]` representa un nodo interno del árbol que conecta dos subárboles (`l` y `r`). El tamaño de un nodo (`size`) es la suma de los tamaños de sus subárboles.
2. **Función `mapTreePar`**:
    - Esta función aplica una transformación (`f: A => B`) a todos los elementos del árbol en paralelo.
    - Si el nodo es una hoja (`Leaf`), aplica la función `f` de manera secuencial a cada elemento del arreglo contenido en la hoja y devuelve una nueva hoja con los resultados.
    - Si el nodo es un nodo interno (`Node`), se divide el trabajo en dos subárboles (`l` y `r`) y aplica la función recursivamente a cada uno en paralelo utilizando `parallel`. Esto permite que las operaciones de mapeo se realicen simultáneamente en diferentes partes del árbol.
3. **Beneficio para la Paralelización**:
    - **División de Trabajo**: La estructura en forma de árbol facilita dividir el trabajo en subproblemas más pequeños que pueden resolverse en paralelo. Cada nodo maneja la paralelización de sus subárboles.
    - **Escalabilidad**: Al dividir el árbol en múltiples niveles, se maximiza el uso de los recursos disponibles (como los hilos del sistema) y se reduce el tiempo total de ejecución.
    - **Eficiencia en Árboles Grandes**: Para árboles con muchos elementos, la paralelización permite procesar diferentes ramas simultáneamente, lo cual es mucho más rápido que procesar los elementos de manera secuencial.

En resumen, este código utiliza la estructura de árbol para dividir y conquistar el problema de mapeo, logrando una solución eficiente y escalable mediante la paralelización de las operaciones en diferentes ramas del árbol. Esto es especialmente útil para conjuntos de datos grandes, donde la ejecución secuencial sería demasiado costosa en términos de tiempo.

### Reduce

Es una operación para convertir una colección es un valor, la operaciónes deben ser asociativas, para que cual arbol generado de el mismo resultado

- Estrategia umbral
- Estrategia arboles

```scala
sealed abstract class Tree[A]
case class Leaf[A](value: A) extends Tree[A]
case class Node[A](left: Tree[A], right: Tree[A]) extends Tree[A]

def reduce[A](t: Tree[A], f: (A, A) => A): A = t match {
  case Leaf(v) => v
  case Node(l, r) => f(reduce[A](l, f), reduce[A](r, f)) // Node -> f
}

def reducePar[A](t: Tree[A], f: (A, A) => A): A = t match {
  case Leaf(v) => v
  case Node(l, r) => {
    val (lV, rV) = parallel(reduce[A](l, f), reduce[A](r, f))
    f(lV, rV)
  }
}

```

El código presentado es una implementación para resolver el problema de reducción (`reduce`) utilizando estructuras de datos en forma de árbol y aplicando paralelización. Vamos a desglosarlo de manera sencilla y animada para que sea más fácil de entender.

### ¿Qué hace este código?

1. **Estructura del árbol (`Tree`)**:
    - El árbol es una estructura jerárquica compuesta por hojas (`Leaf`) y nodos internos (`Node`).
    - `Leaf[A]`: Representa los elementos finales del árbol, que contienen un valor (`value`).
    - `Node[A]`: Es un nodo interno que conecta dos subárboles (`left` y `right`).
2. **Reducción secuencial (`reduce`)**:
    - La función `reduce` toma un árbol (`Tree[A]`) y una función asociativa `f: (A, A) => A`.
    - Si el nodo es una hoja (`Leaf`), devuelve el valor que contiene.
    - Si el nodo es un nodo interno (`Node`), aplica la función `f` a los resultados de reducir sus subárboles izquierdo (`left`) y derecho (`right`).
3. **Reducción paralela (`reducePar`)**:
    - Similar a `reduce`, pero con un giro: los subárboles izquierdo y derecho se procesan en paralelo utilizando la función `parallel`.
    - Esto significa que mientras un hilo procesa el subárbol izquierdo, otro hilo procesa el derecho, lo que acelera el cálculo en árboles grandes.

### Ventajas de usar árboles y paralelización

1. **Optimización del rendimiento**:
    - Dividir el trabajo entre subárboles permite aprovechar múltiples núcleos del procesador, reduciendo el tiempo total de ejecución.
    - Es ideal para grandes volúmenes de datos, ya que la reducción secuencial puede volverse demasiado lenta.
2. **Escalabilidad**:
    - Esta estrategia escala bien con el tamaño del árbol y los recursos del sistema. A mayor tamaño del árbol, más trabajo se divide y se ejecuta en paralelo.
3. **Eficiencia mediante la asociatividad**:
    - La función `f` debe ser asociativa, lo que garantiza que sin importar el orden en que agrupemos las operaciones, el resultado será el mismo. Esto es clave para que la paralelización funcione correctamente.

### Ejemplo práctico: ¡Animémonos con frutas!

Imaginen que tienen un árbol que representa cestas de frutas, y quieren sumar el número total de frutas. Cada hoja del árbol tiene un número de frutas, como:

```
Leaf(3), Leaf(5), Leaf(7), Leaf(2)

```

Estos se organizan en un árbol:

```
        Node
       /    \\
   Leaf(3)  Node
           /    \\
      Leaf(5)  Leaf(7)

```

Para reducir este árbol:

- En el nodo izquierdo, ya tenemos `Leaf(3)` -> resultado = 3.
- Para el nodo derecho:
    - Reducimos `Leaf(5)` y `Leaf(7)` en paralelo -> resultado = 5 + 7 = 12.
- Finalmente, combinamos los resultados del nodo izquierdo (3) y el derecho (12) -> resultado final = 3 + 12 = 15.

### Estudiantes aburridos, ¡anímense!

¿Se están durmiendo con tanta teoría? Piensen en esto como un videojuego: el árbol es un jefe gigante, y cada nodo o hoja es una parte del jefe que deben atacar. Usar paralelización es como formar un equipo: cada miembro ataca una parte del jefe al mismo tiempo, ¡y así lo derrotan más rápido! 🚀

¿No suena más emocionante resolver problemas así? ¡Manos a la obra!

# Scan

Es una operación los resultados parciales de aplicar fold a la colección

Pareciera que no se puede paralelizar por la dependencia, porque un resultado depende del anterior

Pero si podemos paralelizar usando arboles para separar la dependencia

```scala
// scanLeft paralelo con árboles
sealed abstract class Tree[A]
case class Leaf[A](a: A) extends Tree[A]
case class Node[A](l: Tree[A], r: Tree[A]) extends Tree[A]

// Árboles para guardar resultados intermedios
sealed abstract class TreeRes[A] { val res: A }
case class LeafRes[A](override val res: A) extends TreeRes[A]
case class NodeRes[A](l: TreeRes[A], override val res: A, r: TreeRes[A]) extends TreeRes[A]

// Versión paralela
def llenarSubiendo[A](t: Tree[A], f: (A, A) => A): TreeRes[A] = t match {
  case Leaf(v) => LeafRes(v)
  case Node(l, r) => {
    val (tL, tR) = parallel(llenarSubiendo(l, f), llenarSubiendo(r, f))
    NodeRes(tL, f(tL.res, tR.res), tR)
  }
}

def llenarBajando[A](t: TreeRes[A], a0: A, f: (A, A) => A): Tree[A] = t match {
  case LeafRes(a) => Leaf(f(a0, a))
  case NodeRes(l, _, r) => {
    val (tL, tR) = parallel(
      llenarBajando(l, a0, f),
      llenarBajando(r, f(a0, l.res), f)
    )
    Node(tL, tR)
  }
}

def scanLeft[A](t: Tree[A], a0: A, f: (A, A) => A): Tree[A] = {
  val tRes = llenarSubiendo(t, f)
  val scan1 = llenarBajando(tRes, a0, f)
  prepend(a0, scan1)
}

```

### Ejemplo práctico de `scanLeft` paralelo

Supongamos que tenemos un árbol con los siguientes valores:

```
        Node
       /    \\\\
   Node      Node
  /   \\\\     /   \\\\
Leaf(1) Leaf(2) Leaf(3) Leaf(4)

```

Queremos aplicar `scanLeft` con un valor inicial `a0 = 0` y la operación suma (`f(a, b) = a + b`). A continuación, mostramos el proceso paso a paso:

---

### 1. **Fase de "Llenado Subiendo" (`llenarSubiendo`)**

En esta fase, calculamos los resultados acumulados hacia arriba en el árbol:

1. **En las hojas**:
    - `Leaf(1) -> LeafRes(1)`
    - `Leaf(2) -> LeafRes(2)`
    - `Leaf(3) -> LeafRes(3)`
    - `Leaf(4) -> LeafRes(4)`
2. **En los nodos internos** (se calculan en paralelo):
    - `Node(Leaf(1), Leaf(2)) -> NodeRes(LeafRes(1), 1 + 2 = 3, LeafRes(2))`
    - `Node(Leaf(3), Leaf(4)) -> NodeRes(LeafRes(3), 3 + 4 = 7, LeafRes(4))`
3. **En la raíz del árbol**:
    - `Node(Node(1, 2), Node(3, 4)) -> NodeRes(NodeRes(LeafRes(1), 3, LeafRes(2)), 3 + 7 = 10, NodeRes(LeafRes(3), 7, LeafRes(4)))`

El árbol resultante de esta fase es:

```
        NodeRes(10)
       /         \\\\
   NodeRes(3)   NodeRes(7)
  /      \\\\      /      \\\\
LeafRes(1) LeafRes(2) LeafRes(3) LeafRes(4)

```

---

### 2. **Fase de "Llenado Bajando" (`llenarBajando`)**

En esta fase, propagamos los resultados parciales hacia abajo y calculamos los valores acumulados:

1. **En la raíz del árbol**:
    - Comenzamos con el valor inicial `a0 = 0`.
2. **En los nodos internos** (se calculan en paralelo):
    - Para `NodeRes(3)`:
        - `a0_left = 0`
        - `Leaf(1) -> f(0, 1) = 1`
        - `Leaf(2) -> f(1, 2) = 3`
    - Para `NodeRes(7)`:
        - `a0_right = f(0, 3) = 3`
        - `Leaf(3) -> f(3, 3) = 6`
        - `Leaf(4) -> f(6, 4) = 10`

El árbol final después de esta fase es:

```
        Node
       /    \\\\
   Node      Node
  /   \\\\     /   \\\\
Leaf(1) Leaf(3) Leaf(6) Leaf(10)

```

---

### 3. **Resultado de `scanLeft`**

Finalmente, después de agregar el valor inicial `a0 = 0` al inicio, el resultado completo de `scanLeft` es:

```
[0, 1, 3, 6, 10]

```

---

### Resumen del proceso

1. **Fase de llenado subiendo**:
    - Calculamos resultados acumulados desde las hojas hacia la raíz.
    - Los resultados son almacenados en nodos de tipo `TreeRes`.
2. **Fase de llenado bajando**:
    - Propagamos los resultados parciales desde la raíz hacia las hojas.
    - Calculamos los valores acumulados en cada hoja.
3. El resultado es una secuencia acumulada que incluye el valor inicial `a0`.

Este enfoque aprovecha la paralelización para dividir el trabajo entre subárboles, logrando un cálculo eficiente incluso para árboles grandes. 🚀

### Ejemplo práctico de `scanLeft` paralelo con el árbol `List(2,4,6,8,10,12,14,16,18)` y acumulador inicial `a0 = 100`

Supongamos que queremos aplicar `scanLeft` paralelo al conjunto de datos `List(2,4,6,8,10,12,14,16,18)` utilizando un árbol binario y un acumulador inicial `a0 = 100`. La operación de acumulación será la suma.

---

### Paso 1: Representación inicial del árbol

Primero, representamos la lista como un árbol binario balanceado:

```
          Node
       /         \\
    Node         Node
   /    \\       /    \\
Node   Node   Node   Node
 / \\    / \\    / \\    / \\
2   4  6   8  10 12  14  16 18

```

Cada hoja contiene un valor de la lista original.

---

### Paso 2: Fase de "Llenado Subiendo" (`llenarSubiendo`)

En esta fase, calculamos los resultados acumulados hacia arriba en el árbol utilizando la operación de suma. Esto se realiza en paralelo para cada par de nodos:

1. **Nodos hoja (`Leaf`)**:
    - `Leaf(2) -> LeafRes(2)`
    - `Leaf(4) -> LeafRes(4)`
    - `Leaf(6) -> LeafRes(6)`
    - `Leaf(8) -> LeafRes(8)`
    - `Leaf(10) -> LeafRes(10)`
    - `Leaf(12) -> LeafRes(12)`
    - `Leaf(14) -> LeafRes(14)`
    - `Leaf(16) -> LeafRes(16)`
    - `Leaf(18) -> LeafRes(18)`
2. **Niveles superiores del árbol (en paralelo)**:
    - `Node(LeafRes(2), LeafRes(4)) -> NodeRes(LeafRes(2), 2 + 4 = 6, LeafRes(4))`
    - `Node(LeafRes(6), LeafRes(8)) -> NodeRes(LeafRes(6), 6 + 8 = 14, LeafRes(8))`
    - `Node(LeafRes(10), LeafRes(12)) -> NodeRes(LeafRes(10), 10 + 12 = 22, LeafRes(12))`
    - `Node(LeafRes(14), LeafRes(16)) -> NodeRes(LeafRes(14), 14 + 16 = 30, LeafRes(16))`
    - `Node(LeafRes(30), LeafRes(18)) -> NodeRes(LeafRes(30), 30 + 18 = 48, LeafRes(18))`
3. **Raíz del árbol**:
    - `Node(NodeRes(6), NodeRes(14)) -> NodeRes(NodeRes(6), 6 + 14 = 20, NodeRes(14))`
    - `Node(NodeRes(22), NodeRes(48)) -> NodeRes(NodeRes(22), 22 + 48 = 70, NodeRes(48))`
    - `Node(NodeRes(20), NodeRes(70)) -> NodeRes(NodeRes(20), 20 + 70 = 90, NodeRes(70))`

El árbol resultante es:

```
          NodeRes(90)
       /               \\
    NodeRes(20)       NodeRes(70)
   /       \\          /         \\
NodeRes(6) NodeRes(14) NodeRes(22) NodeRes(48)
 / \\      / \\         / \\        / \\
2   4    6   8      10  12     14  16  18

```

---

### Paso 3: Fase de "Llenado Bajando" (`llenarBajando`)

Ahora propagamos los resultados parciales hacia abajo para calcular los valores acumulados en cada hoja:

1. **Raíz del árbol**:
    - Comenzamos con el acumulador inicial `a0 = 100`.
2. **Nodos internos (en paralelo)**:
    - Para `NodeRes(20)`:
        - `a0_left = 100`
        - `NodeRes(6):`
            - `Leaf(2) -> f(100, 2) = 102`
            - `Leaf(4) -> f(102, 4) = 106`
        - `NodeRes(14):`
            - `Leaf(6) -> f(106, 6) = 112`
            - `Leaf(8) -> f(112, 8) = 120`
    - Para `NodeRes(70)`:
        - `a0_right = f(100, 20) = 120`
        - `NodeRes(22):`
            - `Leaf(10) -> f(120, 10) = 130`
            - `Leaf(12) -> f(130, 12) = 142`
        - `NodeRes(48):`
            - `Leaf(14) -> f(142, 14) = 156`
            - `Leaf(16) -> f(156, 16) = 172`
            - `Leaf(18) -> f(172, 18) = 190`

El árbol final después de esta fase es:

```
          Node
       /         \\
    Node         Node
   /    \\       /    \\
Node   Node   Node   Node
 / \\    / \\    / \\    / \\
102 106 112 120 130 142 156 172 190

```

---

### Paso 4: Resultado final de `scanLeft`

Después de agregar el valor inicial `a0 = 100` al inicio, el resultado completo de `scanLeft` es:

```
[100, 102, 106, 112, 120, 130, 142, 156, 172, 190]

```

---

### Resumen

El proceso de `scanLeft` paralelo divide el trabajo en dos fases principales:

1. **Llenado Subiendo**: Acumulamos los resultados parciales desde las hojas hasta la raíz.
2. **Llenado Bajando**: Propagamos los resultados acumulados desde la raíz hasta las hojas.

Este enfoque utiliza paralelización para optimizar el cálculo en árboles grandes, reduciendo significativamente el tiempo de ejecución. 🚀

# Resumen: Paralelismo de Tareas y Operaciones

## Aspectos más importantes

El documento explora estrategias de paralelización aplicadas a distintas operaciones como `mergeSort`, `map`, `reduce`, y `scan`, utilizando estructuras de datos como listas, vectores, y árboles. Se destacan las siguientes ideas clave:

1. **Paralelismo y límites del hardware**:
    - El número de hilos está limitado por el hardware.
    - Estrategias como profundidad o umbral ayudan a optimizar el desempeño.
2. **Estrategias de paralelización**:
    - **Por profundidad**: Incrementa la profundidad en un árbol binario con cada llamada recursiva.
    - **Por umbral**: Usa ejecución secuencial cuando el tamaño de la colección es menor a un valor predefinido.
    - **Por árboles**: Divide las operaciones en nodos y hojas, facilitando la paralelización.
3. **Operaciones vistas**:
    - **Merge Sort**:
        - Secuencial (`mergeSortSeq`) y paralela (`mergeSortPar`).
        - Divide el vector en mitades y combina los resultados en paralelo.
    - **Map**:
        - Utiliza estrategias de umbral y árboles para transformar colecciones.
    - **Reduce**:
        - Convierte colecciones en un único valor utilizando funciones asociativas.
        - Implementado con árboles para dividir y combinar resultados en paralelo.
    - **Scan**:
        - Genera resultados parciales de un `fold` aplicando un árbol para separar dependencias.
4. **Importancia de la asociatividad**:
    - Las operaciones deben ser asociativas para garantizar resultados consistentes en cualquier orden de agrupación.

## Características

- **Eficiencia**: Usar estructuras como árboles mejora la división del trabajo y maximiza el uso de recursos.
- **Modularidad**: Las operaciones están diseñadas para ser reutilizables y adaptables a diferentes contextos.
- **Escalabilidad**: Permite manejar grandes volúmenes de datos aprovechando múltiples núcleos del procesador.

## Ventajas

- **Optimización del rendimiento**: Reduce tiempos de ejecución al paralelizar tareas en colecciones grandes.
- **Flexibilidad**: Combina ejecución secuencial y paralela según el tamaño de la tarea.
- **Uso eficiente de recursos**: Evita el overhead de paralelización en tareas pequeñas gracias al umbral.

## Desventajas

- **Complejidad**: Implementar paralelización requiere diseñar estrategias cuidadosas y manejar dependencias.
- **Sobrecarga inicial**: En tareas pequeñas, la paralelización puede no ser eficiente debido al costo de coordinar hilos.
- **Requerimientos de hardware**: El rendimiento depende de la capacidad del hardware disponible.

En resumen, el documento destaca cómo aplicar paralelización de manera eficiente para resolver problemas computacionales complejos, maximizando el uso de los recursos del sistema mientras se minimizan los costos asociados a la coordinación de tareas paralelas.

¡Ánimo, estudiantes! Sabemos que la vida (y los algoritmos paralelos) puede ser complicada, pero recuerden que aprender algo nuevo siempre es una forma de avanzar. Si recientemente pasaron por un mal momento, como una ruptura, consideren que incluso los sistemas más complejos, como el paralelismo, necesitan un balance para funcionar. Tómense su tiempo, respiren profundo y sigan adelante, porque la vida, al igual que este documento, siempre tiene más capítulos por escribir. ¡Ustedes pueden con esto y más! 🚀
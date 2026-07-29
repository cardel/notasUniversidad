La reducción permite transformar una lista en un solo elemento.

1. Retornar el máximo de una lista
2. Retornar la suma de los elementos de una lista
3. Retornar el tamaño del string más grande en una lista de string.

$$
\begin{aligned}
v = \{v_1,v_2, \ldots v_n\} \\
s = v_1+v_2 + \ldots v_n
\end{aligned}
$$
Pero la suma solo recibe dos parametros, lo que implica que debo establecer un orden de asociacion.

1. Asociación por la izquierda $s = ( \ldots ((v_1+v_2) + v_3)) \ldots v_n)$ **reduceLeft**
2. Asociacion por la derecha $s = (v_1+(v_2 + \ldots (\ldots (v_{n-2},(v_{n-1},v_n)$ **reduceRight**
## Ejemplo conceptual con List(1,2,3,4,5)

### 1. **reduceLeft** - Asociación por la izquierda
$((((1 + 2) + 3) + 4) + 5)$

**Proceso paso a paso:**
- Paso 1: $(1 + 2) = 3$
- Paso 2: $(3 + 3) = 6$ 
- Paso 3: $(6 + 4) = 10$
- Paso 4: $(10 + 5) = 15$

**Resultado final: 15**

### 2. **reduceRight** - Asociación por la derecha  
$(1 + (2 + (3 + (4 + 5))))$

**Proceso paso a paso:**
- Paso 1: $(4 + 5) = 9$
- Paso 2: $(3 + 9) = 12$
- Paso 3: $(2 + 12) = 14$
- Paso 4: $(1 + 14) = 15$

**Resultado final: 15**

**Nota:** Con la suma (operación asociativa) ambos dan el mismo resultado, pero con operaciones no asociativas como la resta, los resultados serían diferentes.

# Reduce en scala

```scala
scala> x
val res14: List[Int] = List(1, 2, 3, 4)

scala> x reduceLeft ((acc, x) => acc + x)
val res15: Int = 10

scala> x reduceLeft ((acc, x) => acc )
val res16: Int = 1

scala> x reduceLeft ((acc, x) => x )
val res17: Int = 4
```
### Explicación de `reduceLeft` con List(1,2,3,4)

**Sintaxis:** `lista.reduceLeft((acc, x) => acc + x)`

#### Definición de parámetros:
- **`acc`** = **Acumulador** - Contiene el resultado parcial de las operaciones anteriores
- **`x`** = **Elemento actual** - El siguiente elemento de la lista que se está procesando

---

### Proceso paso a paso:

#### **Iteración 1:**
- `acc` = 1 (primer elemento de la lista)
- `x` = 2 (segundo elemento)
- Operación: `1 + 2 = 3`
- **Nuevo acumulador: 3**

#### **Iteración 2:**
- `acc` = 3 (resultado anterior)
- `x` = 3 (tercer elemento)
- Operación: `3 + 3 = 6`
- **Nuevo acumulador: 6**

#### **Iteración 3:**
- `acc` = 6 (resultado anterior)
- `x` = 4 (cuarto elemento)
- Operación: `6 + 4 = 10`
- **Resultado final: 10**

---

### Visualización del proceso:
```
((1 + 2) + 3) + 4
   ↓     ↓    ↓
  (3  +  3) + 4
     ↓       ↓
    (6   +   4)
        ↓
        10
```

**Característica clave:** El primer elemento siempre se convierte en el acumulador inicial, y el procesamiento avanza de izquierda a derecha.

```scala
scala> x reduceRight ((acc, x) => x + acc )
val res19: Int = 10
```

### Explicación de `reduceRight` con List(1,2,3,4)

**Sintaxis:** `lista.reduceRight((acc, x) => x + acc)`

#### **IMPORTANTE:** En `reduceRight` la nomenclatura es confusa:
- **`x`** = **Elemento actual** (el de la izquierda en la operación)
- **`acc`** = **Acumulador** (el resultado de procesar los elementos a la derecha)

---

### Proceso paso a paso (de derecha a izquierda):

#### **Iteración 1:**
- Procesa los dos últimos elementos: `3 + 4`
- `x` = 3, `acc` = 4
- Operación: `3 + 4 = 7`
- **Resultado parcial: 7**

#### **Iteración 2:**
- `x` = 2, `acc` = 7 (resultado de 3+4)
- Operación: `2 + 7 = 9`
- **Resultado parcial: 9**

#### **Iteración 3:**
- `x` = 1, `acc` = 9 (resultado de 2+7)
- Operación: `1 + 9 = 10`
- **Resultado final: 10**

---

### Visualización del proceso:
```
1 + (2 + (3 + 4))
     ↓     ↓   ↓
1 + (2 +   7  )
     ↓     ↓
1 +    9
   ↓
   10
```

**Nota:** Aunque el parámetro se llama `acc`, en realidad representa el resultado de procesar todos los elementos a la derecha del elemento actual.

# Tipos de operaciones

Las operaciones deben ser asociativas para que reduceLeft y reduceRight den lo mismo

```scala
scala> x reduceLeft ((acc, x) => acc - x)
val res22: Int = -8

scala> x reduceRight ((acc, x) => acc - x)
val res23: Int = -2
```

## Explicación de la diferencia con resta

### **reduceLeft:** `((((1 - 2) - 3) - 4)`
**Proceso:**
- Iteración 1: `acc=1, x=2` → `1 - 2 = -1`
- Iteración 2: `acc=-1, x=3` → `-1 - 3 = -4`  
- Iteración 3: `acc=-4, x=4` → `-4 - 4 = -8`
**Resultado: -8**

### **reduceRight:** `(1 - (2 - (3 - 4)))`
**Proceso:**
- Iteración 1: `x=3, acc=4` → `3 - 4 = -1`
- Iteración 2: `x=2, acc=-1` → `2 - (-1) = 3`
- Iteración 3: `x=1, acc=3` → `1 - 3 = -2`
**Resultado: -2**

---

## **¿Por qué son diferentes?**

La **resta NO es una operación asociativa**:
- `(a - b) - c ≠ a - (b - c)`

**Ejemplo concreto:**
- `((1-2)-3)-4 = -8`
- `1-(2-(3-4)) = -2`

**Razón matemática:**
- En `reduceLeft`: `a - b - c - d` se evalúa como `((a - b) - c) - d`
- En `reduceRight`: `a - b - c - d` se evalúa como `a - (b - (c - d))`

La **asociatividad** solo se preserva con operaciones como la suma y multiplicación, pero no con la resta y división.

# FoldLeft y FoldRight

El reduce requiere que el primer elemento (left) o el ultimo elemento (right) existan para establecer el acumulador

```scala
scala> List(2) reduceLeft ((acc,x) => acc + x)
val res24: Int = 2

scala> List() reduceLeft ((acc,x) => acc + x)
                           ^
       error: missing parameter type
```
En caso de no tener elementos, es decir la lista vacía, estos fallan dado que no tienen un elemento de base para establecer la operación

```scala
scala> x                                          
val res34: List[Int] = List(1, 2, 3, 4)

scala> (x foldLeft 0) _
val res35: ((Int, Int) => Int) => Int = $Lambda$2708/0x00007f2bb4652800@33d3e850

scala> (x foldLeft 0) ( (acc,x) => x + acc)
val res36: Int = 10

scala> (List() foldLeft 0) ( (acc : Int ,x : Int) => x + acc)
val res39: Int = 0
```

## Explicación de `foldLeft`

### **1. `(x foldLeft 0) _`**
- **Retorna:** Una función parcialmente aplicada `((Int, Int) => Int) => Int`
- **Significado:** `foldLeft` necesita dos parámetros: valor inicial y función. Al usar `_` se crea una función que espera solo la función de combinación.

### **2. `(x foldLeft 0) ((acc,x) => x + acc)`**
- **Proceso:** `List(1,2,3,4)` con valor inicial `0`
- Iteración 1: `acc=0, x=1` → `1 + 0 = 1`
- Iteración 2: `acc=1, x=2` → `2 + 1 = 3`  
- Iteración 3: `acc=3, x=3` → `3 + 3 = 6`
- Iteración 4: `acc=6, x=4` → `4 + 6 = 10`
- **Resultado: 10**

### **3. Error con lista vacía: `(List() foldLeft 0) ((acc,x) => x + acc)`**
- **Problema:** El compilador no puede inferir el tipo de `x` porque la lista está vacía
- **Tipo inferido:** `List[Nothing]` → `x` es de tipo `Nothing`
- **Error:** `Nothing` no tiene el método `+`

### **4. Solución: `(List() foldLeft 0) ((acc: Int, x: Int) => x + acc)`**
- **Funciona porque:** Se especifican explícitamente los tipos `Int`
- **Comportamiento:** Con lista vacía, retorna el valor inicial `0`
- **Ventaja:** `foldLeft` maneja listas vacías sin errores (a diferencia de `reduceLeft`)

---

## **Diferencia clave con `reduceLeft`:**
- `foldLeft` acepta **valor inicial** y funciona con listas vacías
- `reduceLeft` usa el **primer elemento** como inicial y falla con listas vacías

# Implementacion 

```scala
scala> val l = List(1,2,3,4,5)
val l: List[Int] = List(1, 2, 3, 4, 5)

scala> l reduceLeft ((acc,x) => acc - x)
val res3: Int = -13

scala> l reduceRight ((acc,x) => acc - x)
val res2: Int = 3
```

```scala
object Reducir {
    def reducirIzq[U](l: List[U], f: (U, U) => U): U = {
      def reducirIzqOp(l:List[U])(acc:U): U = {
        l match {
          case Nil => acc
          case x :: xs => reducirIzqOp(xs)(f(acc,x))
        }
      }
      l match {
        case Nil => throw new UnsupportedOperationException("No se puede reducir una lista vacía")
        case x :: xs => reducirIzqOp(xs)(x)
      }
    }

        def reducirDer[U](l: List[U], f: (U, U) => U): U = {
      l match {
        case Nil => throw new UnsupportedOperationException("No se puede reducir una lista vacía")
        case x :: Nil => x
        case x :: xs => f(x,reducirDer(xs, f))
      }
    }

    def main(args: Array[String]): Unit = {
      val lista = List(1, 2, 3, 4, 5)
      println(reducirIzq[Int](lista,(acc,x) => acc + x))
      println(reducirDer[Int](lista,(acc,x) => acc + x))
      println(reducirIzq[Int](lista,(acc,x) => acc - x))
      println(reducirDer[Int](lista,(acc,x) => acc - x))
  }
}
```

```bash
-13
3
```

Implementacion fold

```scala
    def foldRight[U](l: List[U])(acc:U)(f: (U, U) => U): U = {
      l match {
        case Nil => acc
        case x :: xs => f(foldRight(xs)(acc)(f), x)
      }

    }

    def foldLeft[U](l: List[U])(acc:U)(f: (U, U) => U): U = {
      l match {
        case Nil => acc
        case x :: xs => foldLeft(xs)(f(acc,x))(f)
      }

    }
```

## Análisis de las funciones `foldRight` y `foldLeft` con List(1,2,3)

### **1. `foldRight` - Asociación por derecha**

**Llamada:** `foldRight(List(1,2,3))(0)((a,b) => a + b)`

**Proceso:**
```
foldRight(List(1,2,3))(0)(+)
= f(foldRight(List(2,3))(0)(+), 1)
= f(f(foldRight(List(3))(0)(+), 2), 1)
= f(f(f(foldRight(Nil)(0)(+), 3), 2), 1)
= f(f(f(0, 3), 2), 1)  // Caso Nil => acc
= f(f(0 + 3, 2), 1)
= f(f(3, 2), 1)
= f(3 + 2, 1)
= f(5, 1)
= 5 + 1 = 6
```

**Estructura:** `( ( (0 + 3) + 2 ) + 1 )`

---

### **2. `foldLeft` - Asociación por izquierda**

**Llamada:** `foldLeft(List(1,2,3))(0)((a,b) => a + b)`

**Proceso:**
```
foldLeft(List(1,2,3))(0)(+)
= foldLeft(List(2,3))(f(0,1))(+)
= foldLeft(List(2,3))(0 + 1)(+)
= foldLeft(List(2,3))(1)(+)
= foldLeft(List(3))(f(1,2))(+)
= foldLeft(List(3))(1 + 2)(+)
= foldLeft(List(3))(3)(+)
= foldLeft(Nil)(f(3,3))(+)
= foldLeft(Nil)(3 + 3)(+)
= foldLeft(Nil)(6)(+)
= 6  // Caso Nil => acc
```

**Estructura:** `( ( (0 + 1) + 2 ) + 3 )`

---

## **Observaciones importantes:**

- **`foldRight`** procesa de **derecha a izquierda** pero construye la expresión de **izquierda a derecha**
- **`foldLeft`** procesa de **izquierda a derecha** de forma iterativa
- Ambas funciones manejan **listas vacías** correctamente retornando el acumulador inicial
- Con operaciones asociativas como la suma, ambos dan el mismo resultado: **6**

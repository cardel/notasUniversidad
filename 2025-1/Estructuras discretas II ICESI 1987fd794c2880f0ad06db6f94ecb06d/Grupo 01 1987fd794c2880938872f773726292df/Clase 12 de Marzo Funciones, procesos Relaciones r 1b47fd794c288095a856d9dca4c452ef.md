# Clase 12 de Marzo: Funciones, procesos. Relaciones recurrencia

# Funciones y procesos

Función y proceso

- Función es la forma que la escribirmos, si una función se llama a si misma
- Proceso: Recursivo o iterativo

---

Recursión lineal

1. Todos los llamados se almacenan en la pila
2. Proceso netamente recursivo
3. f() → f() —> caso base (devolvemos)
4. La pila es limitada

```scala

import scala.annotation.tailrec

class SumaLista {

  def sumaRecursionLineal(l:List[Int]):Int = {
    l match {
      case Nil => 0
      case x::xs => x + sumaRecursionLineal(xs)
    }
  }
  @tailrec
  final def sumaRecursionCola(l:List[Int], acc:Int=0):Int = {
    l match {
      case Nil => acc
      case x::xs => sumaRecursionCola(xs, acc+x)
    }
  }
  
  def sumaRecursiva(l:List[Int]): Unit = {
    @tailrec
    def sumaRecursivaAux(l:List[Int], acc:Int):Int = {
      l match {
        case Nil => acc
        case x::xs => sumaRecursivaAux(xs, acc+x)
      }
    }
    sumaRecursivaAux(l, 0)
  }

}

```

## Recursión de arbol

Definición

- Dos o mas llamados
- Los llamados se atienden de izquierda a derecha (recorrido inorden)
- En el caso de fibunnacci hay muchos llamados repetidos (que se pueden abordar con otras tecnicas)
- Usualmente no se aplica optimización de cola

[2025-03-12-Note-12-08_annotated.pdf](2025-03-12-Note-12-08_annotated.pdf)

# Relaciones de recursiones
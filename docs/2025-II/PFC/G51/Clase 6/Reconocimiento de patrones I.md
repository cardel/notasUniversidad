Usualmente para trabajar datos usamos los condicionales, estos depende en como se estructuran los datos y que operaciones tenemos sobre ellos.

Por ejemplo, para listas

1. isEmpty consulto si es vacia
2. Extraje la información con head y tail

Para esto existe el reconocimiento de patrones

1. Identificar la estructura que viene
2. Extraer su información directamente

```scala
// Función principal que calcula la suma de una lista de enteros
// Utiliza recursión de cola para evitar desbordamiento de pila
def sumaM(l:List[Int]):Int = {
  
  // Función auxiliar interna con recursión de cola
  // @tailrec asegura que la recursión sea optimizada por el compilador
  @tailrec
  def sumaR(l:List[Int])(acc:Int):Int = {
    
    // PATTERN MATCHING: Reconocimiento de patrones sobre la lista
    l match {
      
      // Caso base: lista vacía (Nil)
      // Retorna el acumulador que contiene la suma total
      case Nil => acc
      
      // Patrón de descomposición: h (head) representa el primer elemento
      // t (tail) representa el resto de la lista
      // Llama recursivamente con la cola y acumula el valor actual
      case h :: t => sumaR(t)(acc + h)
    }    
  }

  // Inicia la recursión con acumulador en 0
  sumaR(l)(0)
}
```

**Explicación del reconocimiento de patrones:**

El pattern matching (`match/case`) analiza la estructura de la lista:
- `Nil` identifica el caso base (lista vacía)
- `h :: t` descompone la lista en cabeza (primer elemento) y cola (resto)
- Cada caso ejecuta código específico según el patrón que coincide
- La recursión procesa elementos hasta alcanzar el caso base
Ejemplo de sumar los elementos de una lista

```scala
  
  
  def sumaR(l:List[Int]):Int = {  
    if (l.isEmpty) 0  
    else l.head + sumaR(l.tail)  
  }  
  
  @scala.annotation.tailrec  
  final def sumaL(l:List[Int], acc:Int = 0):Int = {  
    if (l.isEmpty) acc  
    else sumaL(l.tail, l.head+acc)  
  }  
  
}
```

En el primer caso el llamado requiere recordar los anteriores ejemplo sumaR(List(1,2,3,4,5)) -> 1 + SumaR(List(2,3,4,5))

En el caso de recursión de cola, el resultado se va acumulando sumaL(List(1,2,3,4,5),0) -> sumaL(List(2,3,4,5),1) --> sumaL(List(3,4,5),3)
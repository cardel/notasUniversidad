object Listas {
 // longitud(l:List[Int]):Int 
  def longitud[T](l:List[T]):Int = {
    @annotation.tailrec
    def aux(l:List[T],acc:Int):Int = {
      if (l.isEmpty) acc
      else {
        aux(l.tail, acc + 1)
      }
    }
    aux(l, 0)
  }

  def longitudRec[T](l:List[T]):Int = {
    @annotation.tailrec
    def aux(l:List[T],acc:Int):Int = {
      l match {
        case Nil => acc
        case _ :: xs => aux(xs, 1 + acc)
      }
    }
    aux(l, 0)
  }

  def main(arr:Array[String]):Unit = {
      val l:List[Int] = List(1,2,3,4,5,6,7)
      println(longitud[Int](l))
      println(longitudRec[Int](l))
      println(longitudRec(List("Hola","Mundo")))
      println(longitudRec(List(1L, 10L, 100L)))
  }
}

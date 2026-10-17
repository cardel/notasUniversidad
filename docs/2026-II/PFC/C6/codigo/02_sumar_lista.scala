object ListasEjemplo {

  def sumarRecursivo(l:List[Int]):Int = {
    @annotation.tailrec
    def aux(l:List[Int], acc:Int):Int = {
      if (l.isEmpty) acc
      else aux(l.tail, acc + l.head)
    }
    aux(l, 0)
  }

  def sumarPatrones(l:List[Int]):Int = {
    @annotation.tailrec
    def aux(l:List[Int], acc:Int):Int = {
      l match {
        case Nil => acc
        case x :: xs => aux(xs, acc + x)
      }
    }
    aux(l, 0)
  }



  def main(arr: Array[String]): Unit = {
      val l = List(1,2,3,4,5)
      println(sumarRecursivo(l))
      println(sumarPatrones(l))
  }
}

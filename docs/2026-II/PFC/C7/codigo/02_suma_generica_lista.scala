import scala.annotation.tailrec

object Suma{

  def sumar[T](l1:List[T], l2:List[T])(f: (T,T)=>T):List[T] = {
    @tailrec
    def aux(l1:List[T], l2:List[T], acc:List[T]):List[T] = {
      (l1,l2) match {
        case (Nil, Nil) => acc
        case (_ , Nil ) => throw new Exception("Tamaño distinto")
        case (Nil, _ ) => throw new Exception("Tamaño distinto")
        case (x::xs, y::ys) => aux(xs, ys, f(x,y) :: acc)
      }
    }
    aux(l1,l2, Nil)
  }

  def main(arr:Array[String]):Unit = {
    val l1 = List(1,2,3,4)
    val l2 = List(2,4,6,8)
    println(sumar[Int](l1,l2)((x:Int, y:Int) => x + y))
    val l3 = List(1L, 2L, 3L, 4L)
    val l4 = List(10L, 20L, 30L, 40L)
    println(sumar[Long](l3,l4)((x:Long, y:Long) => x + y))
  }

}

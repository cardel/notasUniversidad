object Ejemplo {

  def sumar[T](l1:List[T],l2:List[T])(f:(T,T)=>T)(acc:T):T = {
    @scala.annotation.tailrec
    def aux(l1:List[T], l2:List[T], acc:T):T = {
         (l1,l2) match {
           case (Nil, Nil) => acc
           case (_, Nil) => throw new Exception("l1 es mas grande")
           case (Nil, _) => throw new Exception("l2 es mas grande")
           case (x::xs, y::ys) => aux(xs,ys,f(f(acc,x),y))
         }
    }

         aux(l1,l2,acc)
  }

  def main(arr:Array[String]):Unit = {
    val l1 = List(1,2,3)
    val l2 = List(4,5,6)
    println(sumar[Int](l1,l2)((x:Int,y:Int)=>x+y)(0))

    val l3 = List(1L, 10L, 20L)
    val l4 = List(100L, 20L, 30L)

    println(sumar[Long](l3,l4)((x:Long,y:Long)=>x+y)(0L))

    val l5 = List("Hola","Mundo", "Cruel", "Feo")
    val l6 = List("Quiero","Vivir","Sin","Trabajar")
    println(sumar[String](l5,l6)((x:String,y:String)=>x+y)(""))
  }

}

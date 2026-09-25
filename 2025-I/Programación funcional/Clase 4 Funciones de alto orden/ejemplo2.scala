object ejemplo2 {

  def operacion(n:Int)(f:Int=>Int)(g:Int=>Int)(h:(Int,Int)=>Int)(ini:Int):Int = {
    if (n == 0) ini
    else h(f(n), operacion(g(n))(f)(g)(h)(ini)) 
  }

  def main(arg:Array[String]):Unit = {
    println(operacion(10)_)
    println(operacion(10)(x => x)_)
    println(operacion(10)(x => x)(y => y-1)_)
    println(operacion(10)(x => x)(y => y-1)((x,y) => x+y)_)
    println(operacion(10)(x => x)(y => y-1)((x,y) => x+y)(0))
  }
}

object ejemplo1 {
  def sumaNumeros(n:Int):Int = {
    if (n == 0) 0
    else n + sumaNumeros(n-1)
  }

  def sumaCuadrados(n:Int):Int = {
    if (n == 0) 0
    else n*n + sumaCuadrados(n-1)
  }

  def sumaCuadradosDosEnDos(n:Int):Int = {
    if (n == 0) 0
    else n*n + sumaCuadradosDosEnDos(n-2)
  }
  
  def operacionGeneral(n:Int, f:Int=>Int, g:Int=>Int):Int = {
    if (n == 0) 0
    else f(n) + operacionGeneral(g(n), f, g)
      
  }

  def operacionGeneralv2(n:Int, f:Int=>Int, g:Int=>Int, h:(Int,Int)=>Int, ini:Int):Int = {
      if (n == 0) ini
      else h(f(n), operacionGeneralv2(g(n), f, g, h, ini))
        
    }
   

  def main(args: Array[String]): Unit = {
    println("Hola Mundo")
    println(sumaNumeros(10))
    println(operacionGeneral(10, x => x, y => y-1))
    println(operacionGeneralv2(10, x => x*x, y => y-1, (x,y) => x+y, 0))

    println(sumaCuadrados(10))
    println(operacionGeneral(10, x => x*x, y => y-1))
    println(operacionGeneralv2(10, x => x*x, y => y-1, (x,y) => x+y, 0))

    println(sumaCuadradosDosEnDos(10))
    println(operacionGeneral(10, x => x*x, y => y-2))
    println(operacionGeneralv2(10, x => x*x, y => y-2, (x,y) => x+y, 0))

    println(operacionGeneralv2(7, x => x, y => y-1, (x,y) => x*y, 1))
     
      
  }
}

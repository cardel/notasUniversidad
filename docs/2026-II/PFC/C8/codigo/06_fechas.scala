object SolFechas {
  case class Fecha(dia:Int, mes:Int, año:Int)

  def validarFecha(dia:Int, mes:Int, año:Int):Boolean = {
    //Abril, Junio, Sep, Nov  30 dias
    if (mes == 4 || mes == 6 || mes == 9 || mes == 11) {
      dia <= 30
    }
    else {
      //Condicion febrero
      if (mes == 2) {
        if(año % 4 == 0 && (año % 400 == 0 || año % 100 != 0)) {
          dia <= 29
        }
        else{
          dia <= 28
        }
      }
      else{
        true
      }
    } 

  }

  def fechasFor(ini:Int, fin:Int):Seq[Fecha] = {
    for {
      a <- (ini to fin)
      m <- (1 to 12)
      d <- (1 to 31)
      if validarFecha(d,m,a)
    } yield Fecha(d,m,a)
  }

  def fechasMap(ini:Int, fin:Int):Seq[Fecha] = {
     (ini to fin) flatMap { a =>
      (1 to 12) flatMap { m =>
        (1 to 31) filter { d =>
          validarFecha(d,m,a)
        } map { d =>
          Fecha(d,m,a)
        }
      }
    }
  }

  def main(arr:Array[String]):Unit = {
    //println(fechasFor(2020,2026))
    println(fechasFor(1900,1901)) //1900 no es bisiesto
    println(fechasFor(2000,2001)) //2000 es bisiesto

    println(fechasFor(2020,2026) == fechasMap(2020,2026)) 
    println(fechasFor(1900,1901) == fechasMap(1900,1901))
    println(fechasFor(2000,2001) == fechasMap(2000,2001))
  }

}

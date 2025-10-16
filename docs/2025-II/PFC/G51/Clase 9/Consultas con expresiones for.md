El paradigma relacional utiliza elementos del paradigma funcional y el paradigma lógico. Uno de estos elementos son las expresiones for que nos permiten hacer SELECT sobre conjuntos de datos, la diferencia es que tenemos tipamiento fuerte en Scala a comparación del tipado debil que hay en SQL.

```scala
sealed abstract class Empleado(ced:String) {
  val cedula = ced
}

case class EmpleadoEjecutivo(ced:String, num:Int) extends Empleado(ced) {
  val num_empleados = num
}
case class EmpleadoOperativo(ced:String, cod:Int) extends Empleado(ced) {
  val cod_area = cod
}
```

```scala
object Main{
  def main(arr:Array[String]):Unit = {
    // Lista de empleados con diferentes tipos (Ejecutivo y Operativo)
    val lempleados:List[Empleado] = List(
      new EmpleadoEjecutivo("111",20),
      new EmpleadoOperativo("112",10000),
      new EmpleadoEjecutivo("113", 15),
      new EmpleadoOperativo("114", 10000),
      new EmpleadoEjecutivo("115", 10),
      new EmpleadoOperativo("116", 20000),
      new EmpleadoOperativo("117", 20000),
      new EmpleadoEjecutivo("118", 22),
      new EmpleadoOperativo("119", 30000),
      new EmpleadoOperativo("120", 30000),
      new EmpleadoEjecutivo("121", 12),
      new EmpleadoEjecutivo("122", 18),
      new EmpleadoOperativo("123", 10000),
      new EmpleadoEjecutivo("124", 25),
      new EmpleadoOperativo("125", 20000),
      new EmpleadoOperativo("126", 20000),
      new EmpleadoEjecutivo("127", 30),
      new EmpleadoOperativo("128", 30000),
      new EmpleadoEjecutivo("129", 14),
      new EmpleadoOperativo("130", 10000),
      new EmpleadoOperativo("131", 10000),
      new EmpleadoEjecutivo("132", 17)
    )
    
    // CONSULTA 1: Empleados operativos con cod_area = 10000
    // Equivalente SQL: SELECT * FROM Empleado x JOIN EmpleadoOperativo y WHERE y.cod_area = 10000;
    val query1 = for {
      e <- lempleados                    // FROM lempleados (tabla/colección)
      if e.isInstanceOf[EmpleadoOperativo] // WHERE tipo = EmpleadoOperativo (JOIN implícito)
      if e.asInstanceOf[EmpleadoOperativo].cod_area == 10000 // WHERE cod_area = 10000
    } yield e                            // SELECT *
    println(query1)

    // CONSULTA 2: Empleados ejecutivos con más de 20 empleados a cargo  
    // Equivalente SQL: SELECT * FROM Empleado x JOIN EmpleadoEjecutivo y WHERE y.num_empleados > 20;
    val query2 = for {
      e <- lempleados                    // FROM lempleados
      if e.isInstanceOf[EmpleadoEjecutivo] // WHERE tipo = EmpleadoEjecutivo
      if e.asInstanceOf[EmpleadoEjecutivo].num_empleados > 20 // WHERE num_empleados > 20
    } yield e                            // SELECT *
    println(query2)
  }
}
```

**SIMILITUDES CON PARADIGMA RELACIONAL:**
- Expresiones `for` equivalentes a consultas `SELECT` en SQL
- Filtrado con `if` equivalente a cláusulas `WHERE`
- Iteración sobre colección equivalente a `FROM`
- Operaciones de proyección con `yield` similar a `SELECT`

**DIFERENCIAS CON PARADIGMA RELACIONAL:**
- **Tipado fuerte** en Scala vs tipado débil en SQL
- **Polimorfismo** mediante herencia vs tablas separadas en BD relacional
- **Casting explícito** (`asInstanceOf`) necesario vs joins automáticos en SQL
- **Colecciones en memoria** vs tablas en base de datos persistente
- **Verificación en tiempo de compilación** vs verificación en tiempo de ejecución en SQL
- **Sintaxis funcional** con comprensiones vs lenguaje declarativo SQL
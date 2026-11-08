// Consultas sobre colecciones con expresiones for.
// El mismo molde de una consulta relacional: los generadores son el FROM,
// los filtros el WHERE y el yield el SELECT.

object ConsultasFor {

  case class Estudiante(cedula: Int, nombre: String, materias: Vector[Materia])
  case class Materia(codigo: Int, nombre: String)

  def estudiantesPorMateria(
      nombre: String,
      estudiantes: Vector[Estudiante],
      materias: Vector[Materia]
  ): Vector[String] =
    for {
      e <- estudiantes
      m <- materias
      if m.nombre == nombre
      if e.materias.indexOf(m) != -1
    } yield e.nombre

  def listadosPorMaterias(
      estudiantes: Vector[Estudiante],
      materias: Vector[Materia]
  ): Vector[(String, List[String])] =
    (for {
      e <- estudiantes
      m <- materias
      if e.materias.indexOf(m) != -1
    } yield (m.nombre, e.nombre))
      .groupBy(par => par._1)
      .map { case (materia, pares) => (materia, pares.map(_._2).toList) }
      .toVector

  def main(args: Array[String]): Unit = {
    val materias: Vector[Materia] = Vector(
      Materia(1, "Matematicas"), Materia(2, "Fisica"),
      Materia(3, "Quimica"),     Materia(4, "Biologia"),
      Materia(5, "Historia"),    Materia(6, "Geografia"),
      Materia(7, "Ingles"),      Materia(8, "Programacion"),
      Materia(9, "Economia"),    Materia(10, "Arte")
    )

    val estudiantes: Vector[Estudiante] = Vector(
      Estudiante(1, "Juan",  materias.slice(0, 3)),
      Estudiante(2, "Maria", materias.slice(3, 6)),
      Estudiante(3, "Pedro", materias.slice(6, 9)),
      Estudiante(4, "Ana",   materias.slice(0, 4))
    )

    println(estudiantesPorMateria("Matematicas", estudiantes, materias))
    println(listadosPorMaterias(estudiantes, materias))
  }
}


Las expresiones for se utilizan para consultas como es el caso de las bases de datos.

## Libro.scala 

```scala
// Definición de una clase sellada Libro como base para la jerarquía
sealed class Libro(titulo: String, autores: List[String]) {
  val tituloX: String = titulo        // Título del libro
  val autoresX: List[String] = autores // Lista de autores del libro
}

// Clase para libros de ficción que extiende Libro
case class LibroFiccion(tema: String, titulo: String, autores: List[String]) 
  extends Libro(titulo, autores)

// Clase para libros románticos que extiende Libro
case class LibroRomantico(horaMuerte: String, titulo: String, autores: List[String]) 
  extends Libro(titulo, autores)
```

## Main.scala 
```scala
object Main {
  def main(arr: Array[String]): Unit = {
    
    // Lista de libros de ejemplo que incluye tanto ficción como románticos
    val libros: List[Libro] = List(
      new LibroFiccion("Viajes", "100 años de soledad", List("Gabriel", "Ronald Reagan")),
      new LibroRomantico("Dies from Cringe", "El paraiso", List("Uribe", "Petro", "Trump")),
      new LibroFiccion("Distopía", "La rebelión de las máquinas", List("Isaac", "María Dolores")),
      new LibroRomantico("Drama", "Amor en tiempos de WiFi", List("Lina", "Kevin", "Juliana")),
      new LibroFiccion("Aventura", "El código perdido", List("Alex", "Samantha")),
      new LibroRomantico("Comedia", "Citas y otras tragedias", List("Carlos", "Camila")),
      new LibroFiccion("Misterio", "El caso del gato invisible", List("Detective Gato", "Doña Rosa")),
      new LibroRomantico("Juvenil", "Corazones en pausa", List("Valentina", "Sebas", "Dr. Vega")),
      new LibroFiccion("Fantasía", "El reino de los cuervos", List("Aiden", "Lyra", "Khal")),
      new LibroRomantico("Histórico", "Cartas desde el exilio", List("Lucía", "Federico")),
      new LibroFiccion("Ciencia ficción", "Neón en Marte", List("Dr. Vega", "Unit X-42"))
    )
    
    println("Todos los libros:")
    println(libros)

    // CONSULTA 1: Libros que contienen la palabra "de" en su título
    // Equivalente SQL: SELECT * FROM libros WHERE titulo LIKE "%de%"
    val query1 = for {
      l <- libros                        // Iterar sobre cada libro
      if (l.tituloX.toLowerCase.contains("de")) // Filtrar títulos que contengan "de"
    } yield l
    
    println("\nLibros con 'de' en el título:")
    println(query1)

    // CONSULTA 2: Autores que han escrito más de un libro
    // Equivalente SQL: SELECT DISTINCT autores FROM libros x JOIN libros y ON x.autores = y.autores WHERE x != y
    val query2 = for {
      l1 <- libros                       // Primer libro
      l2 <- libros                       // Segundo libro (para comparar)
      if l1 != l2                        // Evitar comparar el mismo libro
      a1 <- l1.autoresX                  // Autor del primer libro
      a2 <- l2.autoresX                  // Autor del segundo libro
      if a1 == a2                        // Encontrar autores en común
    } yield a1
    
    println("\nAutores que han escrito más de un libro:")
    println(query2.toSet)                // Convertir a Set para eliminar duplicados
  }
}
```

## Explicación de las expresiones for:

Como se menciona en [[Expresiones for]], estas expresiones se utilizan para consultas similares a las de bases de datos:

- **query1**: Filtra libros cuyo título contiene "de" (case insensitive)
- **query2**: Encuentra autores que aparecen en múltiples libros mediante un join implícito

Las expresiones for en Scala permiten escribir consultas de manera declarativa, similar a SQL pero con la seguridad de tipos del lenguaje.


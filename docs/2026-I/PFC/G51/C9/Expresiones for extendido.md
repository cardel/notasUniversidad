
Las expresiones for se pueden utilizar para hacer consultas a bases de datos representadas como objetos, el operador que se observa en el ejemplo es producto cartesiano

```scala

val m2: Mascota = Mascota(Lucas,Maria)

scala> val m3 = Mascota("Sora","Juan")
val m3: Mascota = Mascota(Sora,Juan)

scala> val arrm = Array(m1,m2,m3)
val arrm: Array[Mascota] = Array(Mascota(Toby,Juan), Mascota(Lucas,Maria), Mascota(Sora,Juan))


scala> for{
     | m1 <- arrm
     | m2 <- arrm
     | if m1 != m2
     | if m1.dueño == m2.dueño
     | } yield m1.dueño
val res5: Array[String] = Array(Juan, Juan)

scala> (for{
     | m1 <- arrm
     | m2 <- arrm
     | if m1 != m2
     | if m1.dueño == m2.dueño
     | } yield m1.dueño).distinct
     
     val res6: Array[String] = Array(Juan)
```

La expresión for combina map, withFilter y flatMap

Cual es la diferencia entre filter y withFilter, filter calcula primero la colección y luego le aplica el filtro, withFilter retorna un generador que da los elementos que cumplen la función a medida que se solicitan.
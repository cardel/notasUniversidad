
# Logicas

En algunas situaciones vamos a necesitar evaluar si todos los elementos de un arreglo o bien al menos uno cumplen un condicion

$$
\forall P(x), \exists P(x)
$$

```scala
scala> Array(1,2,3,4) forall (_ < 5)
val res18: Boolean = true

scala> Array(1,2,3,4) forall (_ < 3)
val res19: Boolean = false

scala> Array(1,2,3,4) exists (_ < 3)
val res20: Boolean = true

scala> Array(1,2,3,4) exists (_ > 5)
val res21: Boolean = false
```

Ejemplo determinar números primos

```scala
// Define una función lambda que verifica si un número es primo
val f = (x : Int) => 
  // Para x, verifica que todos los números en el rango [2, sqrt(x)] 
  // no dividan exactamente a x (o que x sea <= 2)
  (2 to Math.ceil(Math.sqrt(x)).toInt) forall (t => 
    x % t != 0  // x no es divisible por t
    || x <= 2    // o x es 1 o 2 (casos especiales de primos)
  )

// Prueba la función con números del 1 al 20
// Crea una tupla (número, ¿es primo?) para cada número
(1 to 20) map (x => (x, f(x)))
// Resultado: Vector de tuplas donde true = primo, false = no primo
```

# Empaquetamiento

Nos permiten manejar colecciones paralelas

```scala
scala> val temp = Array(10.2, 15.3, 18.9)
val temp: Array[Double] = Array(10.2, 15.3, 18.9)

scala> val ciudades = Array("Bogota", "Medellin", "Cali")
val ciudades: Array[String] = Array(Bogota, Medellin, Cali)

scala> temp zip ciudades
val res34: Array[(Double, String)] = Array((10.2,Bogota), (15.3,Medellin), (18.9,Cali))

scala> (temp zip ciudades).unzip
val res35: (Array[Double], Array[String]) = (Array(10.2, 15.3, 18.9),Array(Bogota, Medellin, Cali))
```




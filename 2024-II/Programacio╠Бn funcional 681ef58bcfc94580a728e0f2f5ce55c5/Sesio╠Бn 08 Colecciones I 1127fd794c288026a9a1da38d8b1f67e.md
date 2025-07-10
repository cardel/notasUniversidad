# Sesión 08: Colecciones I

# Tipos

---

Secuenciales

Son aquellas colecciones que se acceden con indice numéricos 0,…,n-1

Tienen un orden, hay un primer elemento, segundo elemento, n-esimo elemento

Vectores y arreglo

---

Iterables / no secuenciales

Son aquellas que se acceden de forma iterativa

- Sin llave de acceso: Conjunto
- Con llave: Map (tablas hash), la llave es cualquier tipo String, Tupla, Int, etc

Este tipo de colecciones no tienen un orden dado, no hay primer elemento.

# Colecciones

Vectores

Son arreglos de tamaño dinámico y que son mutables

Vector es un clase que no está pensada en casting

---

Rangos

Representan una sucesión de números

```scala
1 to 3 // 1,2,3
1 until 3 // 1,2
2 to 8 by 2 //2,4,6,8
```

---

Arreglos

Son similares a los vectores pero se pueden convertir facilmente a otras colecciones

---

Cadenas

Colecciones de caracteres y son inmutables

# Expresiones for

¿Que son?

Nos permite integrar las operaciones map, flatMap y filter

```scala
for {
	//Generadores
	i <-
	j <-
	k <-
	//Filtros
	if ...
	if ...
	if ...
} yield ... //Creamos la secuencia
```
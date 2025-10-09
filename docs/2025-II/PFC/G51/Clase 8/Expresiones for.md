Podemos unir rangos (generador), map, flatMap y el filter en un solo paso, a través de las expresiones for

```scala
for {
	//generador
	//filtro
} yield //map
```

Para el ejemplo anterior

```scala
scala> m
val res26: Int = 100

scala> for {
     i <- 1 to m
     j <- 1 to m
     k <- 1 to m
     if j%i == 0
     if k%j == 0
     if (2 to Math.ceil(Math.sqrt(k)).toInt) forall (x => k % x != 0 || k <= 2)
     }
     yield (i,j,k)
val res27: IndexedSeq[(Int, Int, Int)] = Vector((1,1,1), (1,1,2), (1,1,3), (1,1,5), (1,1,7), (1,1,11), (1,1,13), (1,1,17), (1,1,19), (1,1,23), (1,1,29), (1,1,31), (1,1,37), (1,1,41), (1,1,43), (1,1,47), (1,1,53), (1,1,59), (1,1,61), (1,1,67), (1,1,71), (1,1,73), (1,1,79), (1,1,83), (1,1,89), (1,1,97), (1,2,2), (1,3,3), (1,5,5), (1,7,7), (1,11,11), (1,13,13), (1,17,17), (1,19,19), (1,23,23), (1,29,29), (1,31,31), (1,37,37), (1,41,41), (1,43,43), (1,47,47), (1,53,53), (1,59,59), (1,61,61), (1,67,67), (1,71,71), (1,73,73), (1,79,79), (1,83,83), (1,89,89), (1,97,97), (2,2,2), (3,3,3), (5,5,5), (7,7,7), (11,11,11), (13,13,13), (17,17,17), (19,19,19), (23,23,23), (29,29,29), (31,31,31), (37,37,37), (41,41,41), (43,43,43), (47,47,47), (53,53,53), (59,59,59), (61,61,61...
```

La estructura del codigo es la siguiente

```scala
for {
     // Generadores: crea todas las combinaciones posibles de i, j, k desde 1 hasta m
     i <- 1 to m
     j <- 1 to m  
     k <- 1 to m
     
     // Filtro 1: j debe ser divisible por i (j es múltiplo de i)
     if j%i == 0
     
     // Filtro 2: k debe ser divisible por j (k es múltiplo de j)
     if k%j == 0
     
     // Filtro 3: k debe ser un número primo
     // Verifica que ningún número entre 2 y sqrt(k) divida exactamente a k
     if (2 to Math.ceil(Math.sqrt(k)).toInt) forall (x => k % x != 0 || k <= 2)
     }
     // Map: para cada combinación que pasa los filtros, retorna la tupla (i, j, k)
     yield (i,j,k)
```
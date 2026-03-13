# Como vamos

Segundo corte

1. Tipos de recursion
	1. Lineal: Abre marcos pila por cada llamado
	2. Cola: Que se puede optimizar, recomendacion la anotación @tailrec esta optimizada en memoria
	3. Arbol: Mas de un llamado recursivo y es dificil de volver de cola (si hay una versión iterativa del algoritmo se puede hacer de cola)
2. Recursión estructural (programación) sobre la estructura listas
	1. Caso base Lista vacia
	2. Caso recursivo: operacion head (suma, cons, etc) y el llamado recursivo con tail
```scala
	   def sumaList(l:List[Int]):Int = {
		   @scala.annotation.tailrec
		   def sumaListAux(l:List[Int], acc:Int = 0):Int = {
			   if (l.isEmpty) acc
			   else sumaListAux(l.tail, l.head + acc)
		   }
	   }
```
3. Inducción matematica: demostrar teoremas
	1. Paso base P(1), el primer elemento del conjunto de validos
	2. Paso inductivo a partir de P(k) demostrar P(k+1) el siguiente elemento, aveces podemos tambien aplicarlo para P(k-1)
# Temas

1. Inducción estructural: Estructuras de datos
2. Inducción generalizada: Cuando tenemos teoremas de más de un variable (introducción)

# Contenido

1. [Definición recursiva de datos](Definición%20recursiva%20de%20datos.md)
2. [Inducción estructural](Inducción%20estructural.md)





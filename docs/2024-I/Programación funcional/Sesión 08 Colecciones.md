# Sesión 08 Colecciones

Expresiones for

```scala
for {
	l1 -> x
	l2 -> y //l2 viene siendo un for interno
	//l1 join l2
	if l1 ...1 //where
	//Subconsultas
}
yield x  //Select
```

Esto nos permite combinar map, flatmap, filter y withFilter para generar colecciones bajo cierto criterio, siendo más expresivos (más facil de entender) internamente scala optimiza esta expresion. Esto es equivalente a una consulta SQL

---

Evaluación perezosa

- Flujos: Streams que son secuencia que se van calculando
- Evaluación perezosa: Calculamos la estructura hasta donde necesitamos

```scala
def naturales(n:Int=0):LazyList[Int] = {
	LazyList.cons(n, naturales(n+1))
}
//Tecnicamente una recursión infinita
//Pero se nos calcula a NECESIDAD
val g = naturales()
g(10) //Calcula los 11 primeros
g(5) //No necesita calcular
```
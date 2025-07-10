# Sesión 10: Colecciones II

# Consultas for

¿Que son?

Integran

- map
- filter
- generación de colecciones

Por ejemplo podemos recorrer una lista, elevarla al cuadrado, dejar los numeros pares y generar una lista resultante

```scala
for {
	l <- 1 to n
	if l*l % 2 == 0
} yield l*l
```

---

Para que se utilizan

1. Para recorrer colecciones y aplicarle operaciones
2. Podemos integrar una o más colecciones utilizando algun criterio de filtrando
3. Podemos generar colecciones combinando diferentes fuentes
4. Es el precursor de SQL

# Evaluación perezosa

¿Que es?

Calculamos hasta donde se nos piden

Es util para evitar calculos innecesarios

Podemos tener calculos infinitos sin problema, ya que sólo utilizamos lo que requerimos

```scala
LazyList
lazy val
```

---

Ejemplo implementacion

```scala
def salvaje(n:Int):LazyList[Int] = {
	n #:: salvaje(n+1)
}
```
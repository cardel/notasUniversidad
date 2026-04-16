
# Como vamos

Hasta el momento hemos visto las funciones de alto orden

1. map: Transforma los datos aplicando una función
2. filter: Retorna los elementos que cumplen un condición
3. reduce: Combina los datos aplicando una función

Podemos trabajar multiples colecciones utilizando el flatMap, que es un map pero tambien aplana la colección, dado que trabajar con multiples colecciones genera colecciones dentro de colecciones

Una forma de abstraer este tipo de operaciones con un expresión for

```scala
for {
	g1 <- generador...
	g2 <- generador ...
	...
	gn <- generador
	if condicion
	if condicion
} yield (.....)
```

Las expresiones for son más sencilla de leer y mantener

# Temas

1. [Generalizacion de las expresiones For](Generalizacion%20de%20las%20expresiones%20For.md)
2. [Maps](Maps.md)
Nos van a permitir combinar, los generadores (rangos), con los map/flatmap (transformaciones) y los filtros (filter, exists o forall)
Permite mantener una expresividad de las operaciones, de tal manera sea faciles de entender.

```scala
for {
	//generador (rango)
	//filtro
} yield //expresion
```

En el caso del ejemplo anterior (i,j,k) i es par, j es impar y k es primo

```scala
for {
     x <- 1 to M
     y <- 1 to M
     z <- 1 to M
     if x % 2 == 0 && y % 2 != 0
     if (2 to Math.ceil(Math.sqrt(z)).toInt).toList forall (t => z % t != 0)
      } yield (x,y,z)
```

El código utiliza una expresión `for` para generar tripletas `(x,y,z)` que cumplen condiciones específicas:

**Estructura:**
- **Generadores:** `x <- 1 to M`, `y <- 1 to M`, `z <- 1 to M` (crea el producto cartesiano de tres rangos)
- **Filtros:** 
  - `if x % 2 == 0 && y % 2 != 0` (x debe ser par, y debe ser impar)
  - `if (2 to Math.ceil(Math.sqrt(z)).toInt).toList forall (t => z % t != 0)` (z debe ser primo)
- **Yield:** `(x,y,z)` (retorna la tripleta que cumple las condiciones)

**Equivalencia con flatMap/filter:**
```scala
(1 to M).flatMap(x => 
  (1 to M).flatMap(y => 
    (1 to M).filter(z => 
      x % 2 == 0 && y % 2 != 0 && 
      (2 to Math.ceil(Math.sqrt(z)).toInt).toList.forall(t => z % t != 0)
    ).map(z => (x,y,z))
  )
)
```

**Funcionalidad:** Genera todas las combinaciones donde x es par, y es impar y z es primo dentro del rango 1 a M.```


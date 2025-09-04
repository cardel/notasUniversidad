# Funciones de alto orden

Las funciones de alto orden son aquellas que pueden:
- Recibir funciones como parámetros
- Retornar funciones como resultado

En Scala, las funciones son **valores de primera clase**, lo que significa que pueden ser manipuladas como cualquier otro valor (asignadas a variables, pasadas como argumentos, retornadas desde otras funciones).

## Función que recibe una función como parámetro

```scala
// Definición de una función de alto orden que recibe una función 'f'
// f: (Int, Int) => Int - función que toma dos enteros y devuelve un entero
// x, y: parámetros enteros que se pasarán a la función f
def funcion(f: (Int, Int) => Int, x: Int, y: Int): Int = {
    f(x, y)  // Se invoca la función recibida con los parámetros x e y
}
```

## Función que retorna una función

```scala
// Función que toma una función 'f' y dos enteros, y retorna una nueva función
def funcionB(f: (Int, Int) => Int, a: Int, b: Int): (Int, Int) => Int = {
    // Retorna una función anónima (lambda) que captura los valores a, b y f
    (m: Int, n: Int) => f(a + n, b + m)
}
```

## Las funciones como valores

```scala
// Definición de funciones básicas
def suma(a: Int, b: Int): Int = a + b
def resta(a: Int, b: Int): Int = a - b

// Las funciones pueden ser referenciadas como valores
val funcionSuma: (Int, Int) => Int = suma _
val funcionResta: (Int, Int) => Int = resta _

// Uso de la función de alto orden con diferentes funciones
funcion(suma, 2, 3)      // Resultado: 5
funcion(resta, 2, 3)     // Resultado: -1
funcion(_ + _, 5, 3)     // Resultado: 8 (usando función anónima)
funcion(_ * _, 4, 5)     // Resultado: 20 (multiplicación anónima)
```

## Ejemplo de función que retorna función

```scala
// Crear una función que suma un valor fijo
def crearSumador(fijo: Int): (Int) => Int = {
    (x: Int) => x + fijo  // Retorna una función que suma 'fijo' a su argumento
}

val sumar5 = crearSumador(5)    // Función que suma 5
val sumar10 = crearSumador(10)  // Función que suma 10

sumar5(3)   // Resultado: 8
sumar10(3)  // Resultado: 13
```

## Operaciones con funciones

```scala
// Composición de funciones
def doble(x: Int): Int = x * 2
def cuadrado(x: Int): Int = x * x

val dobleYCuadrado: Int => Int = (x: Int) => cuadrado(doble(x))
val cuadradoYDoble: Int => Int = (x: Int) => doble(cuadrado(x))

dobleYCuadrado(3)  // (3*2)^2 = 36
cuadradoYDoble(3)  // (3^2)*2 = 18
```

La característica esencial es que las funciones son **valores** cuya única operación disponible es **evaluarlas o invocarlas**. Esto permite un alto grado de abstracción y reutilización de código.
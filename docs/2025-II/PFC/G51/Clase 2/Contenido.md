# Introducción

1. Caracteristicas de la programación funcional: Requerimientos para programar en este paradigma: valores inmutables (ligaduras o nombres), funciones como ciudadanos de primera clase (valores), funciones de alto orden (funcion que recibe una o más funciones o retorna una función), reconocimiento de patrones, abstracción funcional y expresiones for
2. Elementos de programación funcional: Evaluación por valor, evaluación por nombre y alcance léxico (bloques)

# Recursos

1. [Caracteristicas de la programación funcional](Caracteristicas%20de%20la%20programación%20funcional.md)
2. [Evaluacion por valor](Evaluacion%20por%20valor.md)
3. [Evaluacion por nombre](Evaluacion%20por%20nombre.md)
4. [Bloques de código](Bloques%20de%20código.md)

# Resumen de Temas de Programación Funcional

## Tabla de Temas Principales

| Tema                                           | Descripción                                                            | Ejemplos                                         |
| ---------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------ |
| **Fundamentos PF**                             | Paradigma basado en funciones matemáticas, inmutabilidad y expresiones | `val x = 5`, funciones puras                     |
| **Inmutabilidad**                              | Valores que no cambian durante la ejecución                            | `val nombre = "Juan"`, `val lista = List(1,2,3)` |
| **Funciones como ciudadanos de primera clase** | Funciones pueden pasarse como parámetros y retornarse                  | `def operar(f: Int => Int, x: Int) = f(x)`       |
| **Evaluación por Valor**                       | Evalúa argumentos antes de llamar la función                           | `def suma(a: Int, b: Int) = a + b`               |
| **Evaluación por Nombre**                      | Evalúa argumentos solo cuando se usan                                  | `def demo(x: => Int) = x * 2`                    |
| **Alcance Léxico**                             | Las variables se resuelven en el contexto donde se definen             | Bloques anidados con mismo nombre                |
| **Composición Funcional**                      | Combinar funciones para crear nuevas funcionalidades                   | `map`, `filter`, `reduce`                        |
| **Recursión**                                  | Resolver problemas mediante llamadas a sí mismo                        | Factorial, Fibonacci recursivo                   |

## Tabla Comparativa de Conceptos

| Concepto | Evaluación por Valor | Evaluación por Nombre |
|----------|---------------------|----------------------|
| **Momento evaluación** | Antes de llamar función | Cuando se utiliza el parámetro |
| **Número evaluaciones** | Una vez por parámetro | Cada vez que se usa |
| **Rendimiento** | Mejor si parámetros se usan múltiples veces | Mejor si parámetros no se usan |
| **Ejemplo sintaxis** | `def f(a: Int)` | `def f(a: => Int)` |
| **Comportamiento errores** | Error en compilación/evaluación | Error solo si se usa el parámetro |
| **Uso memoria** | Almacena valores evaluados | Almacena expresiones sin evaluar |

## Diferencias Clave entre val y def

| Aspecto | `val` (Evaluación por Valor) | `def` (Evaluación por Nombre) |
|---------|-----------------------------|------------------------------|
| **Evaluación** | Inmediata al declarar | Diferida hasta el uso |
| **Referencias circulares** | Valor por defecto (0) | Stack overflow |
| **Naturaleza** | Variable inmutable | Método/expresión |
| **Rendimiento** | Una evaluación, múltiples usos | Evaluación en cada uso |
| **Uso recomendado** | Valores constantes | Expresiones costosas o condicionales |

## Lenguajes y Soporte PF

| Lenguaje | Soporte PF | Características |
|----------|------------|-----------------|
| **Scala** | Alto | Multiparadigma, funciones de alto orden |
| **Haskell** | Puro | Evaluación perezosa, tipado fuerte |
| **Clojure** | Alto | Inmutabilidad, macros |
| **Python** | Moderado | Lambdas, funciones de orden superior |
| **Java** | Bajo | Streams (limitado) |

# Ejercicios
```scala
def operacion(x:Double, y:Double): Double ={
       f(x,y) + g(x,y)
}

  

def f(x:Double, y:Double): Double = {
      2*x
}

  

def g(x:Double, y:Double):Double = {
     3*x + 4*y
}

val x:Double = 12.3
val y:Double = 14.4

operacion(x,y)
```

Valor
1. Operacion(12.3, y)
2. Operacion(12.3, 14.4)
3. f(x,y) + g(x,y)
4. f(12.3, y) + g(x,y)
5.  y.
6.  x. g
7. f(12.3, 14.4) + g(12.3,14.4)
8. 2*x  + g(12.3,14.4)
9. 2*12.3 + g(12.3,14.4)
10. 24.6 + g(12.3,14.4)
11. 24.6 + 3*x + 4*y
12. 24.6 + 3*12.3 + 4*y
13. 24.6 + 36.9 + 4*y
14. 24.6 + 36.9 + 4*14.4
15. 24.6 + 36.9 + 57.6
16. 61.5 + 57.6
17. 119.1
Nombre
18. f(x,y) + g(x,y)
19. 2*x + g(x,y)
20. 2*12.3 + g(x,y)
21. 24.6 + g(x,y)
22. 24.6 + 3*x + 4*y
23. 24.6 + 3*12.3 + 4*y
24. 24.6 + 36.9 + 4*y
25. 24.6 + 36.9 + 4*14.4
26. 24.6 + 36.9 + 57.6
27. 61.6 + 57.6
28. 119.1
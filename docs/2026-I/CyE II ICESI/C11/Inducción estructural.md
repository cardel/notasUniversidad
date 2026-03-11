# Inducción estructural

## Caso de las listas

**Paso base:** `nil` (lista vacía).  
**Paso inductivo:** `h :: t`, donde `h` es la cabeza y `t` es la cola.

## Demostración de la suma de una lista

```scala
def sumaL(l: List[Int]): Int = {
    // Caso base: si la lista está vacía, la suma es 0
    if (l.isEmpty) 0
    // Caso inductivo: suma la cabeza con la suma recursiva de la cola
    else l.head + sumaL(l.tail) // h + P(t)
}
```

### Demostración por inducción estructural

Sea **P(l)** la propiedad: "`sumaL(l)` devuelve la suma de todos los elementos de `l`".

- **Paso base:** `P(nil) = 0`. Se cumple porque la suma de una lista vacía es 0.
- **Paso inductivo:** `h :: t`.  
  Suponemos que `P(t)` es cierto (hipótesis inductiva).  
  Entonces:
  ```
  P(h :: t) = h + P(t)
  ```
  Por definición de `sumaL`, `sumaL(h :: t) = h + sumaL(t) = h + P(t)`.  
  Por lo tanto, `P(h :: t)` se cumple.

### Ejemplo

```
List(4, 5, 6, 7) = 4 :: List(5, 6, 7)

4 + Suma(List(5, 6, 7)) = Suma(List(4, 5, 6, 7))
```

## Conceptos teóricos clave

La **inducción estructural** es una técnica de demostración utilizada para probar propiedades sobre estructuras definidas recursivamente (como listas, árboles, expresiones).  
- **Paso base:** se demuestra la propiedad para el caso más simple (estructura vacía o atómica).  
- **Paso inductivo:** se asume que la propiedad se cumple para las subestructuras (hipótesis inductiva) y se demuestra para la estructura compuesta.

En el caso de listas en Scala:
- `Nil` representa la lista vacía.
- `::` (cons) construye una lista a partir de un elemento (cabeza) y otra lista (cola).
- La recursión estructural sigue la definición inductiva de la lista.

## Tabla de resumen

| Concepto | Descripción | Ejemplo en Scala |
|----------|-------------|------------------|
| **Inducción estructural** | Método de demostración para estructuras recursivas. | Demostrar `sumaL(l)` suma correctamente. |
| **Paso base** | Caso mínimo (estructura vacía). | `P(Nil) = 0`. |
| **Paso inductivo** | Caso compuesto, asumiendo la propiedad para subestructuras. | `P(h :: t) = h + P(t)`. |
| **Lista (definición inductiva)** | `Nil` o `h :: t`. | `List(4,5,6,7) = 4 :: List(5,6,7)`. |
| **Recursión estructural** | Función que sigue la definición inductiva de la estructura. | `sumaL` llama a `sumaL(tail)` en el caso recursivo. |

## Comentarios adicionales

- La inducción estructural es fundamental en lenguajes funcionales para diseñar y verificar algoritmos recursivos.
- En Scala, `List` es una estructura algebraica (ADT) que se presta naturalmente a este tipo de razonamiento.
- La corrección de funciones como `sumaL` se garantiza mediante la demostración inductiva, asegurando que todos los casos (base e inductivo) están correctamente definidos.
- Este enfoque se extiende a otras estructuras (árboles, grafos) y propiedades (ordenamiento, transformación).
# Funciones de Alto Orden: Análisis Técnico

## Definición y Características

Las funciones de alto orden son aquellas que cumplen al menos una de las siguientes propiedades:
1. **Reciben funciones como parámetros**
2. **Retornan funciones como resultado**

## Análisis del Código Proporcionado

### Ejemplo 1: Función que Retorna Función

```scala
def f(g: (Int, Int, Int) => (Int, Int) => Int, a: Int, b: Int): Int => Int = {
    (x: Int) => g(a, b, a + b)(x, x + a)
}
```

**Explicación:**
- `f` es función de alto orden que recibe una función `g` y dos enteros
- `g` tiene tipo: `(Int, Int, Int) => (Int, Int) => Int` (función que recibe 3 enteros y retorna función)
- La función retornada aplica `g` con parámetros `(a, b, a+b)` y luego aplica el resultado a `(x, x+a)`

**Ejecución paso a paso:**
```scala
f((a: Int, b: Int, c: Int) => (x: Int, y: Int) => a + b + c + x + y, 5, 4)(20)
// 1. g = (5, 4, 9) => función que suma 5+4+9+x+y
// 2. g(5,4,9) retorna: (x,y) => 18 + x + y
// 3. Se aplica con (20, 25): 18 + 20 + 25 = 63
```

### Ejemplo 2: Currificación

```scala
def f(a: Int)(b: Int)(c: Int)(d: Int): Int = {
    a + b + c + d
}

// Aplicación parcial:
f(5)_        // fijar a=5, retorna función (b)(c)(d)
f(5)(4)_     // fijar a=5, b=4, retorna función (c)(d)  
f(5)(4)(3)_  // fijar a=5, b=4, c=3, retorna función (d)
f(5)(4)(3)(2) // aplicación completa: 5+4+3+2 = 14
```

### Ejemplo 3: Shadowing (Ocultamiento de Variables)

```scala
val f = (x: Int, y: Int) => (x: Int, z: Int) => x + y + z

f(4, 3)        // Retorna: (x: Int, z: Int) => x + 3 + z (y=3 se preserva)
f(4, 3)(5, 6)  // Aplica: 5 + 3 + 6 = 14
```

## Propiedades y Análisis Comparativo

### 1. Preservación de Contexto (Closures)
Las funciones internas mantienen acceso a las variables del ámbito externo donde fueron definidas, incluso después de que la función externa haya terminado su ejecución.

**Analogía con programación imperativa:** Similar al concepto de variables globales, pero con scope controlado y sin efectos colaterales no deseados.

### 2. Ocultamiento de Variables (Shadowing)
Cuando una función interna define parámetros con el mismo nombre que variables del ámbito externo, la variable interna **oculta** a la externa.

**Diferencia con programación imperativa:**
- **Funcional:** El shadowing es lexical y no modifica la variable original
- **Imperativo:** La reasignación modifica el valor original, causando efectos colaterales

### 3. Currificación y Aplicación Parcial
Permite la creación especializada de funciones mediante la fijación parcial de parámetros.

**Ventaja sobre programación imperativa:** Mayor reutilización de código sin necesidad de duplicar funciones con diferentes firmas.

### 4. Composición Funcional
Las funciones de alto orden facilitan la construcción de operaciones complejas mediante la combinación de funciones simples.

## Conclusión Técnica

Las funciones de alto orden proporcionan:
- **Abstracción superior** sobre patrones de computación
- **Composicionalidad** mediante combinación funcional
- **Preservación de estado** controlada mediante closures
- **Modularidad** mediante aplicación parcial y currificación

El shadowing demuestra cómo el sistema de scoping funcional previene efectos colaterales no deseados, a diferencia de la programación imperativa donde la modificación de variables puede tener alcances impredecibles.
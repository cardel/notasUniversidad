Racional $\frac{a}{b}, a \in \mathbb{N}, b \in \mathbb{Z} -  \{0\}$
 
¿Cual es el problema de representarlo con los double o float?

1. 1/2 = 0.5
2. 1/4 = 0.25
3. 1/3 = 0.3333333..... error de truncamiento
No podemos representar todos los reales en el computador, porque son infinito, lo que se hace es hacer una aproximación al numero que puedo representar. 0.333333333334

# Ejemplo

Vectores 2D, $(a,b), a \wedge b \in \mathbb{R}$ 

1. Vectores están normalizados 0 y 1 $||(a,b)||$ = $\frac{(a,b)}{\sqrt{a^2+ b^2 }}$
2. Operaciones
	1. Suma $(a,b)+(c,d) = (a+c,b+d)$
	2. Resta $(a,b)-(c,d) = (a-c, b-d)$
	3. Producto punto $(a,b)x(c,d) = a*b+b*d$
	4. Producto escalar $(a,b)*c = (a*c, b*c)$
La implementación se hace a través de una clase

```scala
  class Vector2D(a:Double, b:Double) {
    require(a != 0 || b != 0, "Zero vector is not allowed")
    val x = a/norm(a,b)
  val y = b/norm(a,b)
  
  private def norm(m:Double, n:Double):Double = Math.sqrt(m*m+n*n)

  def +(v:Vector2D):Vector2D = {
    new Vector2D(
      this.x + v.x,
      this.y + v.y
  )
  }
  def -(v:Vector2D):Vector2D = {
    new Vector2D(
      this.x - v.x,
      this.y - v.y
  )
  }

  def **(v:Vector2D):Double = {
    this.x * v.x + this.y * v.y
  }

  def *(v:Double):Vector2D = {
    new Vector2D(
      this.x * v,
      this.y * v
    )
  }

  override
  def toString():String = "(" + x + "," + y + ")"
}
```
Este código define una clase `Vector2D` que representa vectores bidimensionales normalizados (de magnitud 1). 

**Abstracción:** La clase encapsula el concepto matemático de vector unitario, ocultando los detalles de implementación como el cálculo de la norma. Expone una interfaz pública con operaciones vectoriales familiares: suma (`+`), resta (`-`), producto escalar (`**`), y multiplicación por escalar (`*`).

**Datos:** Los campos `x` e `y` son inmutables (`val`) y representan las componentes normalizadas del vector. El constructor valida que no se cree un vector cero mediante `require`, garantizando la consistencia de los datos. La normalización se realiza internamente en el constructor, asegurando que todos los objetos `Vector2D` tengan norma unitaria.

**Operaciones:** Los métodos definen operaciones algebraicas sobre vectores:
- `+` y `-` devuelven nuevos vectores normalizados
- `**` calcula el producto escalar (retorna Double)
- `*` permite multiplicar por un escalar (retorna Vector2D)

**Inmutabilidad:** La clase es inmutable - todas las operaciones devuelven nuevas instancias en lugar de modificar el estado existente.

**Representación textual:** El método `toString` proporciona una representación legible del vector en formato coordenado.

```scala
object Main {
  def main(args: Array[String]): Unit = 
  {
    val v1 = new Vector2D(3,4)
    val v2 = new Vector2D(5,6)
    println(v1)
    println(v1.+(v2))
    println(v1.-(v2))
    println(v1.*(5))
    println(v1.**(v2))

    println(v1 + v2)
    println(v1 - v2)
    println(v1 * 5)
    println(v1 ** v2)
// 5 --> int(5
// (5,2) = new Vector2D(5,2)
// (3,8) + (5,2) --> new Vector2D(3,8) +new Vector2D(5,2)
   println(new Vector2D(0,0))
  }
}
```
El código demuestra el uso de la clase `Vector2D` con operaciones en notación infija y punto.

**Notación infija:** Scala permite llamar métodos de un parámetro (segundo this implicito) usando notación infija (`v1 + v2` en lugar de `v1.+(v2)`). Esto proporciona una sintaxis más natural y matemática para operaciones binarias, haciendo el código más legible y expresivo.

**Parámetro implícito `this`:** En los métodos de instancia, `this` actúa como receptor implícito de las operaciones. Cuando se escribe `v1 + v2`, internamente se resuelve como `v1.+(v2)` donde `this` dentro del método `+` referencia a `v1`.

**Azúcar sintáctico:** La capacidad de construir vectores con `new Vector2D(1,2)` permite trabajar con datos abstractos (vectores) de manera lógica, sin preocuparse por los detalles de normalización interna. El programador piensa en términos de "crear un vector (3,4)" mientras la clase se encarga automáticamente de convertirlo en su forma unitaria.

**Ventajas demostradas:**
- Expresividad matemática natural con operadores infijos
- Encapsulación completa: el usuario no necesita conocer el proceso de normalización
- Consistencia garantizada: todos los vectores tienen norma 1 automáticamente
- Interfaz intuitiva que sigue convenciones matemáticas estándar

**Error final:** La última línea `println(new Vector2D(0,0))` lanzará una excepción debido al `require` que prohibe vectores cero, demostrando la validación de datos incorporada en la abstracción.
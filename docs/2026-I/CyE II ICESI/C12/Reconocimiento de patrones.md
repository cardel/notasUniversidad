# Reconocimiento de patrones

El reconocimiento de patrones es una herramienta que provee la programación funcional para validar que un dato cumple una condición, evitando tener que asignar valores y validar condiciones en varias líneas de código.

## Ejemplo inicial sin reconocimiento de patrones

```scala
def sumaPares(l:List[Int]):Int = {
	if (l.isEmpty) 0
	else{
		if (l.head % 2 == 0) l.head+sumaPares(l.tail)
		else sumaPares(l.tail)
	}
}
```

## Ejemplo con reconocimiento de patrones básico

```scala
def sumaPares(l:List[Int]):Int = {
	l match {
		case Nil => 0  // Patrón para lista vacía
		case h :: t => {  // Patrón para descomponer lista en cabeza (h) y cola (t)
			if (h % 2 == 0) h + sumaPares(t)
			else sumaPares(t)
		}
		case _ => throw new Exception("Debe ingresar una lista")  // Patrón comodín para cualquier otro caso
	}
}
```

## Ejemplo con guardias (guards) en patrones

```scala
def sumaPares(l:List[Int]):Int = {
	l match {
		case Nil => 0  // Lista vacía
		case h :: t  if (h % 2) == 0 =>  h + sumaPares(t)  // Patrón con condición (guardia)
		case h :: t => sumaPares(t)  // Lista no vacía sin condición específica
		// Nota: El caso comodín (_) se ha eliminado porque los patrones anteriores cubren todas las posibilidades
	}
}
```

## Patrones comunes para listas

En el caso de listas, generalmente necesitamos capturar dos situaciones:

1. **Nil** - Lista vacía
2. **h :: t** - Lista no vacía, con cabeza (h) y cola (t)

Sin embargo, somos libres de capturar varios patrones más específicos:

1. **List()** - Lista vacía (equivalente a Nil)
2. **List(x)** - Lista con un elemento
3. **x :: Nil** - Lista con un elemento (equivalente a List(x))
4. **List(x,y)** - Lista con dos elementos
5. **x :: y :: Nil** - Lista con dos elementos (equivalente a List(x,y))

## Patrones para tuplas

Para tuplas como (x,y) o (1,2):

```scala
tupla match {
	case (0,0) => "respuesta"  // Tupla específica (0,0)
	case (1,1) => "respuesta"  // Tupla específica (1,1)
	case (x,0) => "respuesta"  // Tupla donde el segundo elemento es 0
	// ... otros casos
	case _ => "respuesta por defecto"  // Cualquier otra tupla
}
```

## Ventajas del reconocimiento de patrones

1. **Evita asignaciones explícitas**: `h :: t` es equivalente a:
   ```scala
   val h = l.head
   val t = l.tail
   ```
   Pero más conciso y seguro (evita errores con listas vacías).

2. **Facilita la programación**: Reduce la verbosidad del código y mejora la legibilidad.

3. **Útil con esquemas polimórficos en clases**:
   ```scala
   abstract class Animal(nombre:String, edad:Int)
   class Mamifero(tipo:String, num_patas:Int) extends Animal(nombre:String, edad:Int)
   class Reptil(color:String) extends Animal(nombre:String, edad:Int)
   ```
   
   Puedo hacer lo siguiente:
   ```scala
   obj match {
   	case Mamifero(tipo, edad) => ...  // Patrón para objetos de tipo Mamifero
   	case Reptil(color) => ...  // Patrón para objetos de tipo Reptil
   }
   ```

## Conceptos teóricos importantes

**Reconocimiento de patrones (pattern matching)** es una característica fundamental de los lenguajes funcionales que permite descomponer estructuras de datos de forma segura y declarativa. A diferencia de la programación imperativa donde se accede a los componentes de una estructura mediante métodos o propiedades (como `.head` o `.tail`), el pattern matching verifica primero la forma de la estructura y luego extrae sus componentes.

**Patrones comunes**:
- **Patrones constantes**: Coinciden con valores específicos (`Nil`, `0`, `"texto"`)
- **Patrones de variable**: Capturan valores en variables (`x`, `h`, `t`)
- **Patrones de constructor**: Descomponen estructuras (`h :: t`, `Mamifero(tipo, edad)`)
- **Patrones comodín**: Coinciden con cualquier valor (`_`)
- **Patrones con guardias**: Agregan condiciones a los patrones (`case h :: t if h % 2 == 0`)

**Exhaustividad**: El compilador de Scala puede verificar si los casos del pattern matching cubren todas las posibilidades, ayudando a prevenir errores en tiempo de ejecución.

## Tabla de resumen

| Concepto | Descripción | Ejemplo |
|----------|-------------|---------|
| **Pattern Matching** | Mecanismo para descomponer y validar estructuras de datos | `valor match { case patrón => resultado }` |
| **Patrón Nil** | Representa lista vacía en Scala | `case Nil => "lista vacía"` |
| **Patrón :: (cons)** | Descompone lista en cabeza y cola | `case h :: t => procesar(h, t)` |
| **Patrón comodín** | Coincide con cualquier valor | `case _ => "valor por defecto"` |
| **Guardias** | Condiciones adicionales en patrones | `case x if x > 0 => "positivo"` |
| **Patrones de tupla** | Descomposición de tuplas | `case (x, y) => x + y` |
| **Patrones de case class** | Descomposición de objetos case class | `case Persona(nombre, edad) => ...` |
| **Exhaustividad** | Propiedad que asegura cubrir todos los casos posibles | Verificación en tiempo de compilación |

## Comentarios adicionales

- El pattern matching en Scala es más poderoso que las sentencias `switch` de otros lenguajes, ya que permite descomponer estructuras complejas y no solo comparar valores simples.
- Los patrones se evalúan en orden, por lo que los casos más específicos deben ir antes que los más generales.
- El pattern matching es fundamental para el manejo seguro de opciones (`Option`, `Some`, `None`) en Scala. No usar esto, no es funcional
- En programación funcional, el pattern matching se prefiere sobre el uso de `if-else` anidados para mejorar la claridad y mantenibilidad del código.
- Los patrones pueden anidarse, permitiendo descomposiciones complejas en una sola expresión.
- El compilador de Scala puede optimizar el pattern matching, convirtiéndolo en tablas de salto eficientes en tiempo de ejecución.
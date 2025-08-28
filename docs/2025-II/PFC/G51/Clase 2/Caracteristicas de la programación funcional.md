La programación funcional se basa en la interacción entre funciones, una función recibe cero o más parametros, realiza un proceso y retorna un valor.

**Importante** Toda expresión retorna un valor, no existen operaciones que retornen valores nulos o sencillamente no tengan retorno.

Por esta razón no existen variables, si no ligaduras o nombres, estas no puede cambiar durante la ejecución del programa.

En general en PF, vamos a tener los siguientes conceptos:
1. La programación está orientada a las funciones, vamos a pensar las soluciones a los problemas bajo este enfoque y considerar que las funciones pueden recibir otras funciones (composición) o bien retorna funciones
2. Vamos a ver diferentes estrategias para resolver problemas en PF:
	1. Técnicas de abstracción funcional
	2. Reconocimiento de patrones o expresiones foro
	3. Uso de funciones de alto orden: map, filter, reduce
	4. Uso principalmente de **recursión**
# Lenguajes

Muchos lenguajes de programación soportan el paradigma funcional, sin embargo, solamente algunos de ellos lo soportan en su forma pura.

- Python: Soporta, lambda, funciones de alto orden, pero no soporte recursión cola (nativa) o no tiene reconocimiento de patrones funcional
- Java: Cierto soporte, a través de los streams
```java
import java.util.LinkedList;
public class Ejemplo {
  public static void main(String[] args) {
    LinkedList<Integer> listica = new LinkedList<Integer>();
    listica.add(2);
    listica.add(3);
    System.out.println(listica);
    int suma = 0;
    for(Integer elm: listica) {
      suma+=elm;
    }
    System.out.println(suma);
    System.out.println(listica.stream().mapToInt(Integer::intValue).sum());
  }
}
```
- Al menos hasta la versión 21 no se soporta paso de funciones como parametro o retorna funciones, tampoco hay reconocimiento de patrones ni expresiones for.

# Lenguajes de PF

- Clojure
- Elixir*
- Earlang* <-- Es un lenguaje PF enfocado a recursos Cloud, en este lenguaje se pueden montar recursos utilizando virtualización (contenedores o máquinas virtuales)
- Haskell*
(*) se utilizan en entorno de Cloud
- Scala: Funciona sobre Java (librería) y proporciona un entorno para programación multiparadigma, permite programación funcional pura

```scala
// Definición de una clase en Scala
class Pollito(nombre:String, peso:Double) {  // Constructor primario con parámetros inmutables
  def emitirSonido():String = "piopio"       // Método sin parámetros que retorna String

  def decirGroseria(enemigo:String):String = {  // Método con parámetro y bloque de código
    val mensaje = s"pio pio pio pio ${enemigo}" // Interpolación de strings (feature funcional)
    mensaje                                    // Última expresión es el valor de retorno
  }
}
```

```scala
// Object crea una clase estática/singleton (patrón funcional común)
object Main{
  // Método main - punto de entrada del programa
  def main(args: Array[String]): Unit = {     // Unit ≈ void en otros lenguajes
    val objPollito:Pollito = new Pollito("Piolin", 2)  // Inmutabilidad (val) - concepto funcional
    println(objPollito)                        // Llama automáticamente toString()
    println(objPollito.emitirSonido())         // Invocación de método
    println(objPollito.decirGroseria("Silvestre")) // Paso de parámetro por valor
  }
}
```

**Elementos de programación funcional presentes:**
- **Inmutabilidad**: Uso de `val` en lugar de `var` para variables
- **Funciones como ciudadanos de primera clase**: Métodos son valores
- **Expresiones sobre statements**: Cada bloque evalúa a un valor
- **Transparencia referencial**: `emitirSonido()` siempre retorna "piopio"
- **Composición**: Métodos se pueden componer con `println(obj.emitirSonido())`

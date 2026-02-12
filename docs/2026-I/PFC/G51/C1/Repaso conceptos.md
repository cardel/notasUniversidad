# Programación orientada a objetos

1. Una clase es una plantilla que especifica atributos y métodos.
2. Un objeto es una instancia de una clase. Instanciar es darle valores a los atributos de una clase.
3. Las clases tienen relaciones entre sí:
   4. Herencia
   5. Uso
   6. Composición
7. Polimorfismo: Un método puede tener diferente comportamiento. Ejemplo: un método `hacerSonido` en `Mamifero`, que es heredado por `Perro` (que hace "guau") y por `Gato` (que hace "miau").

# Ejercicio

En Java:

1. Programe una función que genere todos los números entre n y m, n <= m, que cumplan a³ + b³ = c³ y debe retornar una estructura que tenga todas las tuplas (a, b, c) que cumplen esto.
2. Genere un programa que me dé la lista de la serie de Fibonacci desde 0 hasta n. Recursivo.

```java
import java.util.Vector;

public class Perrito {

  // Método que busca tripletas (a, b, c) en el rango [n, m] que cumplan a³ + b³ = c³
  public Vector< Vector <Integer> > listaNumeros(int n, int m){
    Vector <Vector <Integer> > sal = new Vector< Vector <Integer> >();
    
    // Tres bucles anidados para probar todas las combinaciones de a, b, c en el rango
    for(int a = n; a <= m; a++){
      for(int b = n; b <= m; b++){
        for(int c = n; c <= m; c++){
          // Verifica la condición a³ + b³ = c³
          if(a*a*a + b*b*b == c*c*c){
            Vector<Integer> item = new Vector<Integer>();
            item.add(a);
            item.add(b);
            item.add(c);
            sal.add(item);
          }
        }
      }
    }
    return sal;
  }

  public static void main(String[] args) {
    Perrito objPerrito = new Perrito();
    // Llama al método con rango 1 a 10000 e imprime el resultado
    System.out.println(objPerrito.listaNumeros(1,10000));
  }
}
```

**Nota importante sobre este código:** El Último Teorema de Fermat establece que no existen enteros positivos a, b, c que satisfagan aⁿ + bⁿ = cⁿ para n > 2. Para n = 3, no hay soluciones en enteros positivos, por lo que este método siempre retornará un vector vacío para rangos de números positivos.

```java
import java.util.Arrays;

public class Pelusa {

  // Método recursivo para calcular el n-ésimo número de Fibonacci
  public int fibunnacci(int n){
    if (n <= 1) {
      return n;
    }
    else{
      return fibunnacci(n-1) + fibunnacci(n-2);
    }
  }

  // Método que genera un arreglo con la serie de Fibonacci desde 0 hasta n
  public int[] listaFibunnaci(int n){
    int arr[] = new int[n+1];
    for(int i = 0; i <= n; i++){
      arr[i] = fibunnacci(i);
    }
    return arr;
  }

  public static void main(String[] args) {
    Pelusa objPelusa = new Pelusa();
    // Genera e imprime los primeros 11 números de Fibonacci (0 a 10)
    System.out.println(Arrays.toString(objPelusa.listaFibunnaci(10)));
  }
}
```

**Nota sobre eficiencia:** La implementación recursiva de Fibonacci tiene complejidad exponencial O(2ⁿ). Para valores grandes de n, es ineficiente. Una alternativa más eficiente sería usar programación dinámica (iterativa) o memoización.

## Conceptos teóricos adicionales

### Programación Orientada a Objetos (POO)
- **Encapsulamiento:** Ocultar los detalles internos de una clase y exponer solo una interfaz pública.
- **Abstracción:** Crear modelos simplificados de entidades del mundo real.
- **Clase abstracta:** Clase que no puede ser instanciada directamente y puede contener métodos abstractos (sin implementación).
- **Interfaz:** Contrato que define un conjunto de métodos que una clase debe implementar.

### Programación Funcional vs. Imperativa
- **Inmutabilidad:** En programación funcional, los datos no cambian después de ser creados. En Java, se logra con `final` o usando colecciones inmutables.
- **Funciones puras:** Funciones que siempre devuelven el mismo resultado para los mismos argumentos y no tienen efectos secundarios.
- **Recursión de cola:** Optimización donde la llamada recursiva es la última operación en la función, permitiendo que algunos compiladores optimicen el uso de la pila.

### Corrección de nomenclatura
- "Fibunnacci" debería escribirse como "Fibonacci" (nombre correcto del matemático Leonardo de Pisa, conocido como Fibonacci).
- La serie de Fibonacci comienza con F₀ = 0, F₁ = 1, y cada término subsiguiente es la suma de los dos anteriores.

## Tabla de resumen de conceptos

Concepto | Descripción | Ejemplo/Nota
--- | --- | ---
Clase | Plantilla que define atributos y métodos para crear objetos | `public class Perrito`
Objeto | Instancia concreta de una clase con valores específicos | `Perrito objPerrito = new Perrito()`
Herencia | Mecanismo donde una clase adquiere propiedades de otra clase | `class Perro extends Animal`
Polimorfismo | Capacidad de un método para comportarse de diferentes formas según el objeto | `animal.hacerSonido()` produce diferentes sonidos
Encapsulamiento | Ocultamiento de detalles internos de implementación | Usar modificadores `private` para atributos
Vector (Java) | Colección dinámica similar a ArrayList pero sincronizada (thread-safe) | `Vector<Integer> item = new Vector<>()`
Recursión | Técnica donde una función se llama a sí misma para resolver un problema | Método `fibunnacci` que se llama recursivamente
Programación funcional | Paradigma basado en funciones puras, inmutabilidad y recursión | Contrasta con el estilo imperativo de Java
Último Teorema de Fermat | No existen enteros positivos a, b, c que cumplan aⁿ + bⁿ = cⁿ para n > 2 | Explica por qué `listaNumeros` retorna vacío para n=3
Complejidad algorítmica | Medida de eficiencia de un algoritmo en tiempo y espacio | Fibonacci recursivo: O(2ⁿ); Fibonacci iterativo: O(n)

## Comentarios adicionales

1. **Sobre el ejercicio de a³ + b³ = c³:** Aunque el código es correcto sintácticamente, matemáticamente no encontrará soluciones para enteros positivos debido al Último Teorema de Fermat (demostrado por Andrew Wiles en 1994). Para n = 3, la única solución trivial es a = 0, b = c (o b = 0, a = c), pero con el rango comenzando en 1, no se encuentran soluciones.

2. **Mejoras al código de Fibonacci:**
   - Implementación iterativa más eficiente:
   ```java
   public int fibonacciIterativo(int n) {
       if (n <= 1) return n;
       int a = 0, b = 1;
       for (int i = 2; i <= n; i++) {
           int temp = a + b;
           a = b;
           b = temp;
       }
       return b;
   }
   ```
   - Uso de memoización para la versión recursiva:
   ```java
   private int[] memo = new int[100];
   public int fibonacciMemo(int n) {
       if (n <= 1) return n;
       if (memo[n] != 0) return memo[n];
       memo[n] = fibonacciMemo(n-1) + fibonacciMemo(n-2);
       return memo[n];
   }
   ```

3. **Transición a Scala:** Como se menciona en [[Introduccion a Scala]], Scala combina programación orientada a objetos y funcional. Los mismos ejercicios en Scala serían más concisos y aprovecharían la inmutabilidad, pattern matching y funciones de orden superior.

4. **Buenas prácticas en Java:**
   - Usar `List<Integer>` en lugar de `Vector<Integer>` para mayor flexibilidad (a menos que se necesite sincronización).
   - Considerar el uso de `record` (Java 14+) para representar tuplas de datos inmutables.
   - Documentar el código con Javadoc para mejorar la mantenibilidad.

5. **Relación con el contexto de Scala:** Estos ejercicios en Java ilustran el enfoque imperativo y orientado a objetos, que contrasta con el enfoque funcional que se explorará en Scala, donde se enfatizará la inmutabilidad, la recursión y las funciones como ciudadanos de primera clase.
# Repaso

Para el curso se deben presentar los conceptos de:

1. **Programación orientada a objetos**
	1. **Clase**: Es una plantilla o modelo para crear objetos que define atributos y métodos
	2. **Objeto**: Es una instancia de una clase, con valores específicos asignados a sus atributos
	3. **Relaciones entre clases**: Herencia, uso (asociación) y composición (agregación)
	4. **Polimorfismo**: Es cuando un método puede tener diferente comportamiento según el tipo del objeto que lo invoca, generalmente mediante herencia y sobrescritura de métodos

2. **Lenguajes de programación**: 
	- **Tipos primitivos**: int, bool, char, long, short, byte, double, float
	- **Tipos compuestos**: string, list, array, vector, map, etc.
	- **Abstracciones (clases envolventes)**: Integer, Long, Double, etc. - objetos que encapsulan tipos primitivos y proporcionan métodos adicionales

3. **Estructuras de control**
	1. Condicional: if, if-else, if-else if
	2. Iterativas: for, while, do-while (aunque en este contexto se menciona que no se usarán)
	3. Switch/case: estructura de selección múltiple (se menciona que no se usará en este contexto)

4. **Variables y valores**: declaración de tipos y asignación de valores

# Conceptos teóricos adicionales

**Programación Orientada a Objetos (POO)**: Paradigma de programación que organiza el código en "objetos" que contienen datos (atributos) y comportamientos (métodos). Los cuatro pilares fundamentales son: encapsulación, abstracción, herencia y polimorfismo.

**Recursión**: Técnica donde una función se llama a sí misma para resolver un problema dividiéndolo en subproblemas más pequeños. Requiere un caso base que detenga la recursión.

**Algoritmos de verificación de números primos**: Un número primo es aquel que solo es divisible por 1 y por sí mismo. La optimización común es verificar divisores solo hasta la raíz cuadrada del número.

**Complejidad algorítmica**: Consideración importante al diseñar algoritmos, especialmente para funciones recursivas como el factorial, que tiene complejidad O(n).

# Ejemplo

1. Deseo generar un arreglo de tipo `long` que contenga los factoriales entre 0 y n. Esta función recibe como argumento a n.

2. Deseo generar un arreglo de tipo `int` que tenga los números primos entre n y m, donde n ≤ m, usando recursión.

```java
import java.util.Arrays;
import java.util.Vector;

public class Cosita{

  // Método recursivo para calcular el factorial de un número
  // Caso base: factorial(0) = 1
  // Caso recursivo: factorial(n) = n * factorial(n-1)
  public long factorial(int n){
    if (n == 0) {
      return 1L;  // Caso base: factorial de 0 es 1
    }
    else{
      return n * factorial(n-1);  // Llamada recursiva
    }
  } 
  
  // Método que genera un arreglo con los factoriales desde 0 hasta n
  public long[] listaFactoriales(int n){
    long sal[] = new long[n+1];  // Crear arreglo de tamaño n+1 (incluye factorial de 0)
    for(int i = 0; i < sal.length; i++){
      sal[i] = factorial(i);  // Calcular factorial para cada índice
    }
    return sal;
  }
  
  // Método para verificar si un número es primo
  public boolean esPrimo(int n){
    boolean divisores = false;  // Bandera para indicar si se encontraron divisores
    
    // Optimización: solo verificar divisores hasta la raíz cuadrada de n
    for(int i = 2; i <= Math.ceil(Math.sqrt(n)); i++){
      if (n % i == 0) {  // Si n es divisible por i
        divisores = true;  // Se encontró un divisor
        break;  // Salir del bucle temprano
      }
    }
    
    // Operador ternario: si n es 2, retorna true, sino retorna el negativo de divisores
    return (n == 2) ? true : !divisores;
  }
  
  // Método que genera una lista de números primos entre n y m (inclusive)
  public Vector<Integer> listaPrimos(int n, int m){
    Vector<Integer> sal = new Vector<Integer>();  // Crear Vector para almacenar resultados
    
    // Iterar desde n hasta m (inclusive)
    for(int i = n; i <= m; i++){
      if(esPrimo(i)){  // Verificar si el número actual es primo
        sal.add(i);  // Agregar a la lista si es primo
      }
    }
    return sal;
  } 

  // Método principal para probar la funcionalidad
  public static void main(String[] args) {
    Cosita objCosita = new Cosita();  // Crear instancia de la clase
    
    // Prueba 1: Lista de factoriales
    System.out.println(Arrays.toString(objCosita.listaFactoriales(10)));
    
    // Prueba 2: Verificación de números primos individuales
    System.out.println(objCosita.esPrimo(10));  // false (10 no es primo)
    System.out.println(objCosita.esPrimo(97));  // true (97 es primo)
    System.out.println(objCosita.esPrimo(13));  // true (13 es primo)
    System.out.println(objCosita.esPrimo(11));  // true (11 es primo)
    
    // Prueba 3: Lista de primos en diferentes rangos
    System.out.println(objCosita.listaPrimos(1000, 2000));  // Primos entre 1000 y 2000
    System.out.println(objCosita.listaPrimos(2, 100));     // Primos entre 2 y 100
  }
}
```

# Tabla de resumen de conceptos

Concepto | Descripción | Ejemplo en código
--- | --- | ---
Clase | Plantilla para crear objetos que define atributos y métodos | `public class Cosita`
Objeto | Instancia de una clase con valores específicos | `Cosita objCosita = new Cosita()`
Herencia | Relación "es-un" entre clases (no mostrada en ejemplo) | -
Polimorfismo | Mismo método con diferente comportamiento según el objeto | -
Tipos primitivos | Tipos de datos básicos del lenguaje | `int`, `long`, `boolean`
Tipos compuestos | Estructuras que agrupan múltiples valores | `long[]`, `Vector<Integer>`
Recursión | Función que se llama a sí misma | `factorial()` se llama recursivamente
Estructura condicional | Ejecuta código según una condición | `if (n == 0)`
Estructura iterativa | Repite código mientras se cumpla condición | `for(int i = 0; i < sal.length; i++)`
Método | Función definida dentro de una clase | `public long factorial(int n)`
Arreglo (Array) | Colección de elementos del mismo tipo | `long sal[] = new long[n+1]`
Vector | Colección dinámica similar a ArrayList | `Vector<Integer> sal = new Vector<Integer>()`

# Comentarios adicionales

1. **Optimización del algoritmo de números primos**: El método `esPrimo` está correctamente optimizado al verificar divisores solo hasta la raíz cuadrada del número, lo que reduce significativamente la complejidad computacional de O(n) a O(√n).

2. **Consideraciones sobre recursión**: La función `factorial` utiliza recursión, lo cual es elegante pero puede causar desbordamiento de pila (StackOverflowError) para valores grandes de n. Una implementación iterativa sería más eficiente en memoria.

3. **Uso de Vector vs ArrayList**: En el código se utiliza `Vector`, que es una clase sincronizada (thread-safe) de Java. Para aplicaciones de un solo hilo, `ArrayList` sería más eficiente. `Vector` es una clase legacy que se mantiene por compatibilidad.

4. **Manejo de números grandes**: El factorial crece muy rápidamente, por lo que incluso con tipo `long` se producirá desbordamiento para n > 20. Para valores mayores, se necesitaría usar `BigInteger`.

5. **Caso especial en verificación de primos**: El método `esPrimo` maneja correctamente el caso de n=2, pero podría tener problemas con números menores que 2 (0, 1 y números negativos), los cuales no son primos por definición.

6. **Eficiencia en `listaPrimos`**: El método podría optimizarse further implementando la criba de Eratóstenes para rangos grandes, especialmente cuando se buscan primos en intervalos extensos como entre 1000 y 2000.

7. **Buenas prácticas de programación**: El código muestra buena estructuración con métodos específicos para tareas concretas, lo que facilita la reutilización y el mantenimiento.
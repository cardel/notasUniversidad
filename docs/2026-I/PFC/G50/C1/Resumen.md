
# Resumen

1. Hicimos un repaso de los conceptos de programación imperativa, orientada o objetos a través de un ejemplo en Java
2. Una pequeña instrucción a Scala con los conceptos de programación funcional y solucionando un ejemplo con el enfoque del curso
	1. No usar variables mutables (var)
	2. No usar estructuras iterativas (for, while)
	3. No utilizar asignación (porque son inmutables)
	4. Usar recursión para resolver los problemas
	5. Usar funciones de alto orden (funciones que reciben funciones o retorna funciones)

# Resumen x2

Para el curso se deben presentar los conceptos de:

1. **Programación orientada a objetos (POO)**
   2. **Clase**: Es una plantilla o modelo para crear objetos que define atributos (datos) y métodos (comportamientos)
   3. **Objeto**: Es una instancia concreta de una clase, con valores específicos asignados a sus atributos
   4. **Relaciones entre clases**: 
       - **Herencia**: Relación "es-un" donde una clase deriva de otra
       - **Uso/Asociación**: Una clase utiliza objetos de otra clase
       - **Composición/Agregación**: Una clase contiene objetos de otra clase como parte de su estructura
   5. **Polimorfismo**: Capacidad de que un método pueda tener diferentes implementaciones según el tipo del objeto que lo invoca, generalmente mediante herencia y sobrescritura de métodos

6. **Lenguajes de programación**: 
   - **Tipos primitivos**: Representan valores simples (int, boolean, char, long, short, byte, double, float)
   - **Tipos compuestos/Referencia**: Estructuras que agrupan múltiples valores o referencias a objetos (String, List, Array, Vector, Map, etc.)
   - **Clases envolventes (Wrapper classes)**: Integer, Long, Double, etc. - Permiten tratar tipos primitivos como objetos y proporcionan métodos útiles

3. **Estructuras de control**
   4. **Condicionales**: if, if-else, if-else if para ejecución condicional
   5. **Iterativas/Loops**: for, while, do-while para repetición de código (aunque se menciona que while no se usará en este contexto)
   6. **Switch/case**: Para selección múltiple basada en valores discretos (no se usará según el contexto)

7. **Variables y valores**: Declaración de tipos, asignación de valores, ámbito (scope) y tiempo de vida

# Conceptos teóricos fundamentales adicionales

**Abstracción**: Proceso de ocultar los detalles complejos y mostrar solo las características esenciales de un objeto. En POO, se logra mediante clases abstractas e interfaces.

**Encapsulamiento**: Mecanismo que restringe el acceso directo a algunos componentes de un objeto, protegiendo la integridad de los datos mediante el uso de modificadores de acceso (public, private, protected).

**Recursión**: Técnica algorítmica donde una función se llama a sí misma para resolver problemas que pueden descomponerse en subproblemas más pequeños del mismo tipo. Requiere:
   - Caso base: Condición de terminación que detiene la recursión
   - Caso recursivo: Llamada a la función con un problema reducido

**Números primos**: Números enteros mayores que 1 que solo son divisibles por 1 y por sí mismos. El algoritmo presentado utiliza una optimización clave: solo verificar divisores hasta la raíz cuadrada del número, reduciendo la complejidad de O(n) a O(√n).

**Complejidad temporal y espacial**: Medidas fundamentales para evaluar la eficiencia de algoritmos:
   - Factorial recursivo: O(n) temporal, O(n) espacial (debido a la pila de llamadas)
   - Verificación de primos: O(√n) temporal, O(1) espacial



# Tabla de resumen de conceptos vistos

Concepto | Descripción | Ejemplo/Notas
--- | --- | ---
Clase | Plantilla que define atributos y métodos para crear objetos | `public class Cosita`
Objeto | Instancia concreta de una clase con estado y comportamiento | `Cosita calculadora = new Cosita()`
Atributos | Variables que almacenan el estado de un objeto | (No mostrados explícitamente)
Métodos | Funciones que definen el comportamiento de un objeto | `factorial()`, `esPrimo()`
Herencia | Mecanismo para derivar nuevas clases de clases existentes | No implementado en ejemplo
Polimorfismo | Capacidad de objetos de responder de manera diferente al mismo mensaje | No implementado en ejemplo
Encapsulamiento | Ocultamiento de detalles internos mediante modificadores de acceso | Todos los métodos son `public`
Tipos primitivos | Tipos de datos básicos con almacenamiento por valor | `int`, `long`, `boolean`
Tipos referencia | Variables que almacenan referencias a objetos | `long[]`, `Vector<Integer>`
Recursión | Técnica donde función se llama a sí misma | `factorial()` llama a `factorial(n-1)`
Caso base | Condición que detiene la recursión | `if (n == 0) return 1L`
Arreglos (Arrays) | Estructura de tamaño fijo para elementos del mismo tipo | `long salida[] = new long[n+1]`
Colecciones | Estructuras dinámicas para grupos de objetos | `Vector<Integer>` es sincronizada
Estructuras de control | Construcciones que determinan flujo de ejecución | `if`, `for`, `return`
Algoritmo de primos | Método para identificar números divisibles solo por 1 y sí mismos | Optimizado verificando hasta √n
Complejidad algorítmica | Medida de recursos requeridos por un algoritmo | Factorial: O(n), Primos: O(√n)

# Comentarios adicionales y mejores prácticas

## 1. Consideraciones sobre la implementación recursiva del factorial
- **Ventaja**: Código conciso y matemáticamente elegante
- **Desventaja**: Para valores grandes de n (> 10,000-15,000 dependiendo de la configuración de la pila), puede causar `StackOverflowError`
- **Alternativa**: Implementación iterativa que sería más eficiente en memoria:
  ```java
  public long factorialIterativo(int n) {
    long resultado = 1L;
    for (int i = 2; i <= n; i++) {
      resultado *= i;
    }
    return resultado;
  }
  ```

## 2. Optimizaciones adicionales para la verificación de primos
- **Criba de Eratóstenes**: Más eficiente para generar múltiples números primos en un rango
- **Memoización**: Almacenar resultados previamente calculados para números frecuentemente consultados
- **Test de primalidad probabilístico**: Para números muy grandes (Miller-Rabin, Solovay-Strassen)

## 3. Uso de `Vector` vs. alternativas modernas
- `Vector` está sincronizado (thread-safe), lo que añade sobrecarga innecesaria en aplicaciones de un solo hilo
- `ArrayList` es generalmente preferido por mejor rendimiento
- Para programación concurrente, considerar `CopyOnWriteArrayList` o colecciones de `java.util.concurrent`

## 4. Manejo de números grandes
- El factorial de 20 (2,432,902,008,176,640,000) ya está cerca del límite de `long` (9,223,372,036,854,775,807)
- Para n > 20, usar `BigInteger` que no tiene límite práctico de tamaño
- Ejemplo con `BigInteger`:
  ```java
  import java.math.BigInteger;
  
  public BigInteger factorialBig(int n) {
    BigInteger resultado = BigInteger.ONE;
    for (int i = 2; i <= n; i++) {
      resultado = resultado.multiply(BigInteger.valueOf(i));
    }
    return resultado;
  }
  ```

## 5. Validación de entrada
- Los métodos deberían validar parámetros (ej: n no negativo para factorial)
- Manejar casos límite adecuadamente (números negativos, rangos inválidos)
- Considerar lanzar excepciones descriptivas para entradas inválidas

## 6. Pruebas unitarias
- Implementar pruebas JUnit para verificar corrección en casos de borde
- Probar con valores extremos y casos especiales
- Medir rendimiento para identificar cuellos de botella

## 7. Principios de diseño aplicables
- **Responsabilidad única**: Cada método tiene una tarea específica
- **DRY (Don't Repeat Yourself)**: Evitar duplicación de lógica
- **KISS (Keep It Simple, Stupid)**: Soluciones simples suelen ser más mantenibles

Este repaso cubre los fundamentos esenciales para el curso, proporcionando una base sólida en conceptos de programación que serán expandidos con temas más avanzados durante el semestre.
TAD se conoce tipo abstracto de dato, es una representación de un conjunto de datos en la cual el programador no ve los detalles de la implementación.

```java
public class Ejemplo {

  public static void main(String[] args) {
    int numeroA = Integer.MAX_VALUE;
    int numeroB = Integer.MIN_VALUE;
    System.out.println(numeroA);
    System.out.println(numeroB);
    System.out.println(++numeroA);
    System.out.println(--numeroB);

  }
}
```
Al ejecutar encontramos 
```bash
2147483647 # numeroA
-2147483648 # numeroB
-2147483648 # ++numeroA 
2147483647 # --numeroB
``` 
Esto es una limitación ya que no podemos representar números mas grandes ni mas pequeños
Ventaja, esto funciona a nivel CPU las operaciones son eficientes

```python
>>> a = 12312312321321031293210391203921039213091230912903120930219309
>>> a
12312312321321031293210391203921039213091230912903120930219309
>>> a+1
12312312321321031293210391203921039213091230912903120930219310
>>> a-1
12312312321321031293210391203921039213091230912903120930219308
>>> type(a)
<class 'int'>
>>> a.__radd__(2)
12312312321321031293210391203921039213091230912903120930219311
```

¿Porque vale la pena complicarse en Python representado los números como objetos?

No tenemos desbordamiento

Pero, no es eficiente

# Conclusion

1. Los numeros en Java/C++ tiene un tamaño en bits, lo que puede producir desbordamiento si nos pasamos del tamaño. Pero, son rapidos de operar porque son operaciones CPU
2. Los numeros en Python/Ruby son objetos, no tienen problema de desborde, pero, son ineficiente porque se requieren muchas operaciones para usarlos.
Es una cola que no sigue el esquema FIFO, si no que los elementos se ordenan de acuerdo a una prioridad, la prioridad puede ser:

- De menor a mayor
- De mayor a menor

La cola colocará en su cabeza el elemento de mayor prioridad, si se inserta un elemento este se organizará de acuerdo a su prioridad

- Internamente las colas de prioridad se maneja como árboles binarios
- Las operaciones de búsqueda e inserción cuestan $O(log(n))$
- El caso de búsqueda puede requerir tiempo $O(n)$
- Son más difíciles de implementar que otras estructuras lineales

# Ejemplo en Java
Esto es usando la colección utils, es de tomar en cuenta que se les puede solicitar la implementación

```java
import java.util.PriorityQueue;

public class EjemploCola {

  public static void main(String[] args) {
        // Priority Queue Min Type
        PriorityQueue<Integer> p = new PriorityQueue<>();

        // Add elements to the queue
        p.add(3);
        p.add(10);
        p.add(7);
        p.add(2);
        p.add(1);
        p.add(11);

        // Print the head of the Queue
        while(!p.isEmpty()) {

          System.out.println("Head of Queue: " + p.poll());  

        }
  }

}
```
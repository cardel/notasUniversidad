# Introducción
Son estructuras de datos bajo enfoque FIFO, primero en entrar primero en salir

# Operaciones
- enqueue Insertar un elemento al final de la cola
- dequeue Eliminar el primer elemento de la cola
- peek ver el primer elemento de la cola

# Implementación
```java
public class Cola {
	private int frente;
	private int finalCola;
	private int arreglo[];
	private int tam;
	private int capacidad;

	Cola(int capacidad) {
		this.frente = 0;
		this.finalCola = -1;
		this.arreglo = new int[capacidad];
		this.tam = 0;
		this.capacidad = capacidad;
	}
	public boolean estaVacia() {
	
		return this.tam == 0;
	}

	public boolean estaLlena() {
		return this.tam;
	}

	public void enqueue(int elm) {
		if (estaLlena()) {
			// Lanzar un excepcion de overflow
		}
		this.finalCola = (this.finalCola + 1) % this.capacidad;
		this.arreglo[this.finalCola] = elm;
		this.tam++;
	}

	public int dequeue(int elm) {
		if (estaVacia()) {
			// Lanzar un excepcion de underflow
		}
		int elem = this.arreglo[this.frente];
		this.frente = (this.frente + 1) % this.capacidad;
		this.tam--;
	
		return elem;
	}

	public int peek() {
		if (estaVacia()) {
			// Lanzar un excepcion de underflow
		}	
		int elem = this.arreglo[this.frente];
		return elem;	
	}
}
```

# Ejemplos

![](attachments/Pasted%20image%2020250811170818.png)

![](attachments/Pasted%20image%2020250811170828.png)

# Complejidad computacional
Todas las operaciones dependen de los indices frente y finalCola, esto implica que no nos interesa el tamaño de la cola, por lo tanto la complejidad es $O(1)$ 


# Ventajas y desventajas
## Ventajas
- Implementación sencilla
- Operaciones en tiempo constante
- Gestión eficiente de recursos ideal para tareas que requieren un orden de llegada, por ejemplo colas de impresión.
- Uso de algoritmos en grafos como BFS

## Desventajas
- Acceso es limitado (solo un elemento a la vez)
- Problemas de overflow y underflow dada la capacidad limitada
- Uso ineficiente de memoria en el caso de que se tenga un arreglo grande y pocos elementos
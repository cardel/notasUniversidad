# Introducción
Son estructuras de datos en las cuales se apilan los elementos, esto nos da un enfoque LIFO (Ultimo en entrar es el primero en salir) solo podemos acceder al ultimo elemento que insertamos.

- **push** Agrega un elemento en el tope
- **pop** Elimina un elemento del tope de la pila
- **peek** Ver el elemento del tope de la pila

# Consideraciones

1. **overflow** Cuando se intenta colocar un elemento con la operación push en una pila llena
2. **underflow** Cuando se intenta sacar un elemento con la operación pop en una pila vacía
```java
public class Pila {
	private int capacidad; // Saber el numero maximo de elementos
	private int arreglo[];
	private int top;

	Pila(int capacidad) {
		this.capacidad = -1;
		this.arreglo = new int[capacidad];
	}

	public boolean estaLleno() {
		return top == capacidad - 1;
	}

	public boolean estaVacio() {
		return top == -1;
	}

	public void push(int elm) {
		if estaLleno() {
			//Lanzar una excepcion
		}
		this.top =+ 1;
		arreglo[top] = ele;
		//esto es lo mismo que arreglo[++top]
	}

	public void pop() {
		if estaVacio() {
			//Lanzar una excepcion
		}
		int dato = arreglo[top];
		top -= 1;
		return dato;
	}


	public int peek() {
		return arreglo[top];
	}
}

```

# Complejidad de operaciones

En todos los casos es $O(1)$ porque no importa el tamaño de la pila

# Ventajas y desventajas

## Ventajas

1. Implementacion sencilla.
2. Acceso rápido
3. Son buenas gestionando memoria y estados


## Desventajkas

- Acceso limitado: Solo puedo acceder al elemento top
- Tamaño fijo
- Desbordamiento (overflow) y subdesbordamiento (underflow)
- No suelen ser eficiente en memor
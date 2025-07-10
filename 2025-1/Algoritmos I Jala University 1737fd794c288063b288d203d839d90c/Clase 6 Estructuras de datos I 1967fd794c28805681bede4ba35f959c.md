# Clase 6: Estructuras de datos I

# ¿Que son estructuras de datos?

¿Para que se usan?

- Almacenar, modificar y eliminar información
- Organizar la información
- Es una herramienta fundamental para la solución de problemas a través de la programación

---

¿Que tipos de operaciones tenemos alli?

- Insertar
- Buscar
- Eliminar
- Modificar

---

Tipos de estructuras

- Mutables o inmutables: Mutables permiten modificar la información
- Secuenciales: Índice que permite ubicar los elementos (0,1,2,3…)
- Llave: Es una clave que permite ubicar un elemento a partir de un cálculo
- No secuenciales: Árboles y los montículos
- Operaciones: inplace: Modifican la estructura directamente, valor: Retornan una nueva estructura

```python
lista = ["a","b","c"]

lista.append("d")
print(lista) #Operación inplace

conjuntoA = {"a","b","c"}
conjuntoB = {"d","e","f"}
c = conjuntoA.union(conjuntoB) #Operación por valor
print(c)
print(conjuntoA)
```

# Pilas

¿Que son?

- Estructuras tipo LIFO (Ultimo en entrar primero en salir)
- Sólo podemos acceder al primer elemento (último que ha sido insertado)

---

¿Que operaciones tiene?

- PUSH Inserta un elemento a la pila
- POP Elimina un elemento de la pla
- PEEK Permite visualizar el primer elemento de la pila

---

Posibles errores

- Underflow: Es cuando se intenta hacer POP a una pila vacía
- Overflow: Es cuando se intenta hacer PUSH a una pila llena

---

Implementación

1. Tenemos que tomar en cuenta la capacidad, el arreglo que almacena la información y el valor del tope
2. El tope vale -1 inicialmente, significa que está vacia
3. Cuando el tope vale capacidad - 1 la pila está llena
4. PUSH: Insertar, POP: Eliminar, PEEK consultar tener en cuenta que se genera una excepción cuando se genera un overflow o un underflow

---

Ventajas

- Costo de la operaciones O(1) **no depende del tamaño de la pila**
- La implementación es sencilla
- La pila puede ser dinámica usando listas enlazadas
- Reversibilidad: Podemos hacer reversión de las operaciones PUSH se revierte con un POP (viceversa)
- Si hay tamaño fijo controlar los errores

# Colas

¿Que son?

- Estructuras tipo FIFO (primero en entrar primero en salir)
- Es análogo a una cola de un banco, concierto, etc

---

¿Que operaciones tiene?

1. Enqueue: Inserta un elemento al final de la cola
2. Dequeue: Elimina un elemento (retorna) primero de la cola
3. Peek: Retornar el primer elemento

---

Implementación

- Capacidad de la cola
- Arreglo que representa la cola
- Frente: ubicación del primer elemento
- Final de la cola: Ubicación donde debe ir el nuevo elemento
- La cola es un arreglo circular, después del ultimo elemento sigue el primero.

---

Metodos

- estaVacia() tam == 0
- estaLlena() tam == cap
- Overflow intentar insertar si esta llena
- Underflow intentar eliminar si está vacía

---

Ventajas

- Implementación sencilla
- Operaciones O(1)
- Diferentes aplicaciones: Secuencia de tareas, operaciones reversibles, algoritmo BFS

---

Desventajas

- Solo podemos acceder al primer elemento
- Problemas en tamaño fijo de desbordamiento y subdebordamiento
- En caso de que se tenga una cola muy grande para pocos datos hay un desperdicio de memoria

# Resumen

Este es un resumen sobre estructuras de datos y sus tipos principales:

**Estructuras de datos - Conceptos básicos:**

- Se usan para almacenar, modificar y eliminar información
- Son fundamentales para resolver problemas mediante programación

**Tipos de estructuras:**

- Mutables o inmutables
- Secuenciales (usando índices)
- Por llave (usando claves)
- No secuenciales (árboles y montículos)

**Pilas (LIFO):**

- El último elemento en entrar es el primero en salir
- Operaciones principales: PUSH (insertar), POP (eliminar) y PEEK (visualizar)

**Colas (FIFO):**

- El primer elemento en entrar es el primero en salir
- Operaciones principales: Enqueue (insertar), Dequeue (eliminar) y Peek (consultar)

**Ventajas de estas estructuras:**

- Operaciones con costo O(1)
- Implementación sencilla
- Múltiples aplicaciones prácticas
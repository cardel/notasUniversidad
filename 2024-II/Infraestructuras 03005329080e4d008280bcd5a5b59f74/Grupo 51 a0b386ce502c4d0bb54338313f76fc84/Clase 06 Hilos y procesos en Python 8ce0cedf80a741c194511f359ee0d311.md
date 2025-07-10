# Clase 06 Hilos y procesos en Python

# Multihreading

¿Que es?

El hilo es la unidad fundamental de un proceso que se puede ser ejecutada por la CPU

Es una secuencia de instrucciones

Un hilo es un subconjunto de un proceso

---

Partes de un hilo

1. ID Identificador
2. Puntero de pila: Sección de la pila que pertenece al hilo (Contexto)
3. Contador de programa: Ubicación en memoria de la siguiente instrucción a ejecutar
4. Estado del hilo: running, ready, wait, initialize, closed
5. Conjunto de registro del hilo (Data en el procesador)
6. Puntero al proceso padre (Un puntero al proceso padre (donde fue lanzado) del hilo)

---

Multhreading

- Ejecutar varios hilos dentro de un CPU
- Cuando un procesador varia entre hilos debe un hacer un cambio de contexto (Valores en los registros)

---

Thread pool

1. Es una colección de hilos para ser lanzandos de forma recurrente
2. Contamos con un Threadpoolexceutor para lanzar los trabajos
3. Este se encarga de gestionar los hilos

# Multiprocessing

¿Que es?

Es la capacidad de un sistemas de tener más de un procesador

Las aplicaciones se pueden dividir en rutinas más pequelas que se ejecutan en procesos independientes

- Multiprocesador: Una board con más de un CPU
- MUltinucleo: Varios nucleos dentro de la mism CPU

---

Datos entre los procesos

- Cada proceso tiene su propio CONTEXTO
- Un contexto es el conjunto de variables

---

Memoria compartida

- Las librerías nos ofrecen colecciones de datos sincronizadas
- Estas colecciones son COMPARTIDAS entre procesos

# Servidor de procesos

¿Que es un servidor de procesos?

1. Cuando inicia python inicia un servidor de procesos
2. Este se encarga de lanzar los otros procesos
3. El modulo multiprocessing propociona Manager nos permite controlar los procesos
4. Ventajas:
    1. Soporta tipos de datos
    2. Puede ser compartidas entre procesos
5. Desventajas:
    1. Latencia (son más lentos)

---

Pipe

Sockets para el intercambio de información (de cualquier tipo)

---

Queue

Cola de objetos
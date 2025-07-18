# Sesión 06: Procesos e hilos

---

# Introducción

¿Que es un hilo?

- Unidad más pequeña de ejecución que puede ser realizar por SO
- Un hilo es conjunto de instrucciones
- Un hilo es un subconjunto de un proceso
- Un hilo en un SO
    - ID
    - Puntero a la pila
    - Contador de programa
    - Estado del hilo: Running, sleep,, waiting, startating or terminated

---

¿Que es multithreading?

- Capacidad de una CPU de ejecutar varios hilos al tiempo
- Cuando hay una sola CPU se realiza un proceso conocido como cambio de contexto
- Python nos ofrece la librería threading

---

ThreadPool

Es una colección de hilos y que pueden reutilizarse. El modulo concurrent.features ofrece la posibilidad de gestionar un thread pool.

---

# Multiprocessing

¿Que es?

- Capacidad de un sistema de manejar más de un CPU
- Las aplicaciones multiprocessing se dividen en rutinas más pequeñas
- El sistema operativo asigna estas rutinas a diferentes CPU
- Ejemplos:
    - Multiprocesador: Computadora con más de un CPU
    - Procesador multinucleo: procesdor con dos o más Unidades Procesamiento

---

Independencia de memoria

Cada proceso tiene su espacio de memoria, lo que implica que se deben implementar mecanismos para compartir información entre procesos.

---

Compartir memoria

Elementos que sean sincronizados, nos lo ofrece la misma librería (s)

---

Proceso servidor

- Cuando inicia un programa inicia un proceso servidor
- Los procesos se conectan al servidor para crear nuevos procesos
- Puede manejar objetos y valores, compartiendolo con otros proesos usando proxies
- Ventajas:
    - Soportan tipos de objetos arbitarios
    - Los datos pueden ser comparrtidos en diferente computadores a través de la red
- Desventajas:
    - Son más lentos que usar memoria compartida

---

Pipe y Queue en multiprocessing

- Queue (Cola) Se pueden encolar muchos objetos, y en el proceso se van extrayendo.
- Pipe: Funciona como una interfaz de intercambio de mensajes (Socket)
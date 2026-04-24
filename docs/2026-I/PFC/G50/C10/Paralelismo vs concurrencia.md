
# Que es paralelismo

Distribuir la carga entre varias unidades computo (CPUs) enfocado a mejorar la velocidad (speedup)


# Que es concurrencia

Es la estructuración de un programa para permitir varias partes del código se puedan hacer forma paralela, sin embargo, no requiere paralelismo (varias CPUS) dado que puede usar la gestion de procesos del sistema operativo para aprovechar los momentos en que el CPU esta inactiva. Enfoque: Diseño


# Tipos de paralelismo

1. Bits: CPU
2. Insrucciones: Pipeline, una instruccion tiene unas etapas Capturar operando, calcular operando, aplicar operando y guardar resultado (resumen), podemos aprovechar que mientras a una instruccion se le captura el operando, a otra le podemos calcular el operando.
3. Tareas: Conjunto de instrucciones (nuestro foco)

# Proceso

Un proceso es unidad de ejecución gestionada por el sistema operativo, cada proceso tiene su espacio de memoria independiente. Si algun programa intenta acceder a la memoria del otro se genera **segmentation fault** generado por el sistema operativo (Kernel)

# Hilo

Es un conjunto de instrucciones que se pueden  ejecutar en paralelo, un proceso tiene uno o más hilos. Los hilos comparten memoria (heap: espacio de memoria donde estan lo objetos), cada hilo tiene su propia pila de ejecución (variables locales)

## Scala

Contamos con la clase Thread para lanzar hilos

- Metodo start() arranca un hilo
- Metodo join() espera hasta que el hilo termine, es decir integrarlo al hilo principal de ejecución.
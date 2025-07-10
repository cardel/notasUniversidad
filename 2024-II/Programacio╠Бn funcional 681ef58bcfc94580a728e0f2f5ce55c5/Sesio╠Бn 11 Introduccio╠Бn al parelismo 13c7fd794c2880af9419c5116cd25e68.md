# Sesión 11: Introducción al parelismo

# Introducción

Que es paralelismo / Computación paralela

- Capacidad de ejecutar varias tareas al tiempo
- Que el paralelismo depende de la capacidad del sistema (CPU e Hilos por hardware)
- Realmente la parelización es una gestión de tareas
- El objetivo de parelizar es **acelerar**

---

Tipos de parelismo

- Paralelismo a nivel de bits: CPU (hardware)
- Paralelismo a nivel de instrucción: CPU (Software)
- Paralelismo a nivel de tareas: S.O ←-Nuestro foco

Hilo y proceso

- Proceso: Es una instancia de ejecución de un programa en la cual la memoria es independiente (aislada)
- Hilo: Es una ejecución de instrucciones sobre un mismo proceso que comparten la memoria del programa pero tiene cada una su propia pila de ejecución

---

Aspectos de desarrollo de software enfocado a parelismo

- No todas las tareas se pueden parelizar
- Desarrollar concurrente es más complejo porque requiere cambiar la forma de programar y pensar en la sincronización de lo procesos
- La parelización no garantiza **determinismo**

---

Limitaciones de la parelización

1. El hardware es **limitado**
2. Los procesos tienen secuencias atómicas, no se puede dividir (reducir) y se deben ejecutar en orden secuencial
3. La gestión de hilos requiere tiempo y recursos

---

Parelelismo vs concurrencia

1. Paralelismo: Es programar pensando en la eficiencia
2. Concurrencia: Es programar pensando en la modularidad, estructura, arquitectura, etc etc

# Abstracciones parallel y task

Abstracción parallel

Es una encapsulación del manejo de procesos mediante hilos (2 o 4), esta abstracción se encarga de la gestión de los hilos y sencilamente nos devuelve un resultado en forma tupla (2 o 4)

Internamente las tareas tienen un orden de finalización (tareas que esperan a otras) esto ayuda en la sincronización

---

Abtracción task

Nos permite lanzar procesos en paralelo de forma independiente

Debemos controlar la ejecución con task y finalmente unir los resultados con join

---

Enfoque de paralelizar

Dividir las estructuras de datos en factores de potencia de 2, por ejemplo para el caso de la norma, cuando hicimos 4 hilos

1. 0 a n/4
2. n/4 a n/2
3. n/2 a 3n/4
4. 3n/4 a n
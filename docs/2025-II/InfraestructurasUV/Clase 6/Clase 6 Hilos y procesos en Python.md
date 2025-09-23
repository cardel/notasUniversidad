# Objetivos 

1. Entender la diferencia entre hilo y proceso
2. Entender cómo implementar hilos en Python
3. Entender cómo implementar procesos en Python

# Temas
1. [Hilos y procesos](Hilos%20y%20procesos.md)
2. [Threading en Python](Threading%20en%20Python.md)
3. [Multiproceso en Python I](Multiproceso%20en%20Python%20I.md)
4. [Multiproceso en Python II](Multiproceso%20en%20Python%20II.md)

# Resumen

El dia de hoy vimos la diferencia entre hilo y proceso, el hilo tiene la ventaja de que tiene memoria compartida, pero tiene problemas por la optimización de python GIL y el tema de condiciones de carrera lo que implica usar estrategias como la sincronización. Los procesos en cambio, tienen memoria independiente y funcionan de forma independiente, pero tienen el problema de que las variables no son compartidas para esto usamos datos de la misma libreria (Array y Value) para poder compartir información.
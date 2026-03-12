# Multiprocessing

Los hilos tienen el problema del GIL (Global Interpreter Lock), que evita que se ejecuten en CPUs diferentes, por lo que no tenemos paralelismo real.

Los procesos son independientes en memoria y pueden ejecutarse en diferentes CPUs, permitiendo paralelismo real.

```python
import multiprocessing

# Crear un proceso que ejecutará la función 'funcion' con los argumentos dados
p1 = multiprocessing.Process(target=funcion, args=(arg1, arg2, ..., argn))

# Iniciar la ejecución del proceso
p1.start()

# Esperar a que el proceso termine antes de continuar
p1.join()
```

La sintaxis es prácticamente igual que en `Thread`.

## Problema de independencia en memoria

Cada vez que se lanza un proceso, este tiene su propio contexto global. Es decir, si tenemos variables globales, estas se copian y las operaciones que hacemos con ellas no se ven reflejadas en el programa principal.

Podemos resolverlo con memoria compartida o mecanismos de comunicación.

## Memoria compartida

### Array y Value

Multiprocessing nos ofrece dos tipos: `Array` y `Value`.

```python
# Crear un arreglo compartido de tipo entero ('i'), double ('d') o long ('l')
multiprocessing.Array(tipo, tamaño)

# Crear un valor compartido de un tipo específico
multiprocessing.Value(tipo)
```

Podemos declarar arreglos (`Array`) o valores (`Value`) que van a estar en memoria compartida y serán accesibles por todos los procesos que se lancen. Esto evita que se copien cada vez que se ejecuta un proceso.

Sin embargo, tiene una limitación: solamente podemos usar `Array` o `Value`. Si necesitamos otro tipo de estructura, con este mecanismo no es posible.

### Manager (Session Manager)

El Manager es un proceso servidor (otro proceso) que mantiene objetos de Python compartidos. Es un proxy que permite acceder a memoria compartida, soporta cualquier tipo de dato en Python, pero es más lento que `Array` o `Value`.

```python
with multiprocessing.Manager() as manager:
    # Crear una lista compartida administrada por el Manager
    datos = manager.list([...datos...])
    dato = <valor>
    
    # Pasar los datos compartidos al proceso
    p1 = multiprocessing.Process(target=funcion, args=(..., datos, ..., dato))
```

`datos` está en el proceso proxy y, por lo tanto, todos los procesos pueden acceder a él y modificarlo.

---

## Tabla de resumen

Concepto | Descripción | Ventajas | Desventajas |
| --- | --- | --- | --- |
| **GIL (Global Interpreter Lock)** | Mecanismo en CPython que permite solo un hilo a la vez ejecutar bytecode, evitando paralelismo real en hilos. | Simplifica la gestión de memoria y evita condiciones de carrera en estructuras internas. | Impide el paralelismo real en programas multihilo. |
| **Procesos** | Unidades de ejecución independientes con su propio espacio de memoria. | Paralelismo real, aislamiento de memoria, mayor estabilidad. | Mayor overhead en creación y comunicación, consumo de más recursos. |
| **Memoria compartida (Array/Value)** | Mecanismo para compartir datos entre procesos usando estructuras de bajo nivel (`Array`, `Value`). | Más rápido que Manager, adecuado para datos simples. | Solo soporta tipos básicos (enteros, flotantes, caracteres). |
| **Manager** | Proceso servidor que actúa como proxy para compartir objetos Python entre procesos. | Soporta cualquier tipo de objeto Python (listas, diccionarios, etc.). | Más lento que memoria compartida directa, overhead adicional. |
| **Comunicación entre procesos** | Mecanismos como colas (`Queue`), pipes o memoria compartida para intercambiar datos. | Flexibilidad en la comunicación, sincronización posible. | Complejidad adicional, riesgo de deadlocks si no se maneja bien. |

---

## Comentarios adicionales

- El uso de `multiprocessing` es esencial en Python para tareas intensivas en CPU, ya que evade el GIL.
- La elección entre `Array`/`Value` y `Manager` depende del tipo de datos y los requisitos de rendimiento.
- La sincronización (ej. con `Lock`, `Semaphore`) sigue siendo necesaria en memoria compartida para evitar condiciones de carrera.
- Considerar el overhead de la creación de procesos: para tareas pequeñas, el costo puede superar el beneficio.
- Alternativas modernas como `concurrent.futures.ProcessPoolExecutor` ofrecen una interfaz de alto nivel para el multiprocesamiento.
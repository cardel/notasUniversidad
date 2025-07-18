# Semana 5. Multithreading y multiproceso

# Hilo y proceso

Proceso

- Es un conjunto de variables, instrucciones y contexto que maneja un programa
- Un proceso puede tener uno o más hilos

---

Hilosx

- Es la unidad de ejecución más pequeña que tiene un programa
- Un hilo se puede lanzar desde un hilo padre (es el hilo principal del programa)

# Hilos en Python

Thread

- Permite lanzar uno o más hilos (definidos) para ejecutar funciones
- Los hilos de iniciar con start()
- Y se deben integrar al hilo principal join() (hilo padre)

```python
"""
Carlos A Delgado S.
Este programa muestra unos ejemplos usando threading en python
11 de Marzo de 2025
"""

import threading
import time

def sumarLista(ini, fin):
    suma = 0
    for i in range(ini, fin):
        suma += 1

if __name__ == "__main__":
    time1 = time.time()
    t = sumarLista(0, 1000000)
    time2 = time.time()
    print("Tiempo de ejecución secuencial: ", time2 - time1)

    time1 = time.time()
    t1 = threading.Thread(target=sumarLista, args=(0, 250000))
    t2 = threading.Thread(target=sumarLista, args=(250000, 500000))
    t3 = threading.Thread(target=sumarLista, args=(500000, 750000))
    t4 = threading.Thread(target=sumarLista, args=(750000, 1000000))
    t1.start()
    t2.start()
    t3.start()
    t4.start()
    t1.join()
    t2.join()
    t3.join()
    t4.join()
    time2 = time.time()
    print("Tiempo de ejecución paralelo: ", time2 - time1)
```

---

Threadpool

- Permite especificar cuantos hilos vamos a lanzar maximo (max_workers)
- Gestiona el inicio y la unión de los hilos al principal

```python
"""
Carlos A Delgado S.
Este programa muestra unos ejemplos usando threading en python
11 de Marzo de 2025
"""

import concurrent.futures
import time

def sumarLista(ini, fin):
    suma = 0
    for i in range(ini, fin):
        suma += 1

if __name__ == "__main__":
    pool = concurrent.futures.ThreadPoolExecutor(max_workers=8)
    time1 = time.time()
    sumarLista(0, 1000000)
    time2 = time.time()
    print("Tiempo de ejecución secuencial: ", time2 - time1)

    # Ejercución paralela
    time1 = time.time()
    pool.submit(sumarLista, 0, 250000)
    pool.submit(sumarLista, 250000, 500000)
    pool.submit(sumarLista, 500000, 750000)
    pool.submit(sumarLista, 750000, 1000000)
    time2 = time.time()
    print("Tiempo de ejecución paralelo: ", time2 - time1)
```

---

# Procesadores

- Multiprocesador:Dos o más procesadores en la misma computadora
- Multinucleo: Más de un CPU en el mismo chip de procesador (Comunes)

---

# Multiprocessing

Procesos

- Son independientes entre sí
- Los gestiona el SO

```python
"""
Carlos A Delgado
11 de Marzo de 2025
Ejemplo multiples procesos
"""

import multiprocessing

def esPrimo(n):
    if n < 2:
        return False
    for i in range(2, n):
        if n % i == 0:
            return False
    return True

def generarPrimos(rango):
    ini = rango[0]
    fin = rango[1]
    primos = []
    for i in range(ini, fin):
        if esPrimo(i):
            primos.append(i)
    return primos

if __name__ == "__main__":
    primos = generarPrimos((2, 100000))
    print(primos)
    pool = multiprocessing.Pool()
    primos = pool.map(
        generarPrimos, [(2, 25000), (25000, 50000), (50000, 75000), (75000, 100000)]
    )
    print(primos)
```

# Memoria compartida

Problema

Los procesos son independientes entre sí, no se pueden tener valores compartidos

Sin embargo, multiprocessing maneja un espacio que se llama memoria compartida

- Valor
- Arreglo

```python
"""
Carlos A Delgado
11 de Marzo de 2025
Ejemplo de memoria compartida con multiprocessing
"""

import multiprocessing

def elevar_cuadrado(lista, ini, fin):
    for i in range(ini, fin):
        lista[i] = 30

if __name__ == "__main__":
    lista = multiprocessing.Array("i", range(10000000))
    p1 = multiprocessing.Process(target=elevar_cuadrado, args=(lista, 0, 2500000))
    p2 = multiprocessing.Process(target=elevar_cuadrado, args=(lista, 2500000, 5000000))
    p3 = multiprocessing.Process(target=elevar_cuadrado, args=(lista, 5000000, 7500000))
    p4 = multiprocessing.Process(
        target=elevar_cuadrado, args=(lista, 7500000, 10000000)
    )
    p1.start()
    p2.start()
    p3.start()
    p4.start()
    p1.join()
    p2.join()
    p3.join()
    p4.join()
    print(lista[-100:])
```

# Mecanismos de comunicación entre procesos

Manager

- Puede enviar objetos o grupos de objetos
- Es una variable compartida por todos los procesos

---

Queue

- Un proceso puede encolar varios datos (independientes)
- Otros proceso los puede desencolar o bien encolar
- Tener presente la sincronización de los procesos (debe existir un orden determinista en el manejo de la cola)

---

pipe

- Sockets
- Procesos que envian mensajes los cuales se encolan
- Procesos que reciben los mensajes
- Tener en cuenta cerrar la conexión al terminar de enviar los mensajes
- La sincronización es más complicada
- Potencialmente dead lock (abrazo de la muerte)

# Ejemplos memoria compartida

## manager

```python
"""
Carlos A Delgado
11 de Marzo de 2025
Ejemplo de compartir memoria entre procesos usando el Manager
"""

import multiprocessing

class Alegria:
    def __init__(self, manager):
        self.alegria = manager.Value("i", 0)
        self.triteza = manager.Value("i", 0)

    def estoyalegre(self):
        self.alegria.value += 1
        self.triteza.value -= 1

    def estoytriste(self):
        self.triteza.value += 1
        self.alegria.value -= 1

    def __str__(self):
        return f"Alegria: {self.alegria} Tristeza: {self.triteza}"

def aumentarAlegria(listaAlegria):
    for al in listaAlegria:
        al.estoyalegre()

def aumentarTristeza(listaAlegria):
    for al in listaAlegria:
        al.estoytriste()

if __name__ == "__main__":
    with multiprocessing.Manager() as manager:
        alegria = manager.list([Alegria(manager) for _ in range(3)])
        p1 = multiprocessing.Process(target=aumentarAlegria, args=(alegria,))
        p2 = multiprocessing.Process(target=aumentarTristeza, args=(alegria,))
        p3 = multiprocessing.Process(target=aumentarAlegria, args=(alegria,))
        p1.start()
        p2.start()
        p3.start()
        p1.join()
        p2.join()
        p3.join()
        print(list(map(str, alegria)))
```

## Ejemplo queue

```python
"""
Carlos A Delgado
11 de Marzo de 2025
Ejemplo de compartir memoria entre procesos usando el Queue
"""

import multiprocessing

def elevar_cuadrado(q):
    for _ in range(q.qsize()):
        num = q.get()
        q.put(num * num)

def sumar_valor(q, v):
    for _ in range(q.qsize()):
        num = q.get()
        q.put(num + v)

if __name__ == "__main__":
    q = multiprocessing.Queue()
    for i in range(10):
        q.put(i)
    p1 = multiprocessing.Process(target=elevar_cuadrado, args=(q,))
    p2 = multiprocessing.Process(target=sumar_valor, args=(q, 10))
    p1.start()
    p1.join()
    # Damos un orden p1 y p2
    p2.start()
    p2.join()
    while q.qsize() > 0:
        print(q.get())
```

## Usando pipe

```python
import multiprocessing

def elevar_cuadrado(conn):
    """Recibe un número, calcula su cuadrado y lo envía de vuelta."""
    while True:
        if conn.poll():  # Verifica si hay datos disponibles
            try:
                num = conn.recv()
                conn.send(num * num)
            except EOFError:
                break
        else:
            break
    conn.close()  # Cerrar la conexión

def sumar_valor(conn, v):
    """Recibe un número, suma 'v' y lo envía de vuelta."""
    while True:
        if conn.poll():
            try:
                num = conn.recv()
                conn.send(num + v)
            except EOFError:
                break
        else:
            break
    conn.close()  # Cerrar la conexión

if __name__ == "__main__":
    # Crear pipes para la comunicación entre procesos
    parent_conn1, child_conn1 = multiprocessing.Pipe()
    parent_conn2, child_conn2 = multiprocessing.Pipe()

    # Crear y ejecutar los procesos
    p1 = multiprocessing.Process(target=elevar_cuadrado, args=(child_conn1,))
    p2 = multiprocessing.Process(target=sumar_valor, args=(child_conn2, 10))

    p1.start()
    p2.start()

    # Enviar valores iniciales al primer proceso
    for i in range(10):
        parent_conn1.send(i)

    # Cerrar el extremo de escritura de parent_conn1
    parent_conn1.close()

    # Recibir los resultados del primer proceso y enviarlos al segundo
    for _ in range(10):
        resultado_cuadrado = parent_conn1.recv()
        parent_conn2.send(resultado_cuadrado)

    # Cerrar el extremo de escritura de parent_conn2
    parent_conn2.close()

    # Recibir los resultados finales del segundo proceso
    resultados_finales = []
    for _ in range(10):
        resultados_finales.append(parent_conn2.recv())

    # Esperar a que los procesos terminen
    p1.join()
    p2.join()

    # Imprimir los resultados finales
    print("Resultados finales:", resultados_finales)
```
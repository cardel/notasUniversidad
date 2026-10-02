# Hilos y procesos en Python

Lo que se vio en la cuarta sesión: por qué los hilos de Python no aceleran un
cálculo, qué lo impide, qué se gana cambiándolos por procesos y qué
cuesta esa decisión. Las diapositivas están en el Campus Virtual; aquí quedan
las cuentas, las mediciones y el código que se corrió en clase.

## Dos cosas que se parecen y no son iguales

Un **proceso** es una instancia de un programa en ejecución: su código, sus
datos y su contexto. Dos procesos no se ven entre sí; cada uno tiene su propio
espacio de memoria, y lo que uno escriba no existe para el otro.

Un **hilo** vive dentro de un proceso y tiene lo mínimo para ejecutar: un
identificador, un puntero de pila, un contador de programa, su estado y sus
registros. Lo demás lo comparte con los otros hilos del mismo proceso, y eso
incluye la memoria.

| | Hilos | Procesos |
|---|---|---|
| Memoria | Compartida | Aislada |
| Costo de crear | Bajo | Alto |
| Comunicación | Variables comunes | Hay que serializar y enviar |
| Intérprete de Python | Uno solo para todos | Uno por proceso |
| Para qué sirven | Entrada y salida | Cálculo |

Esa última fila es la regla práctica de la sesión: **tareas de entrada y
salida, hilos; tareas de cálculo, procesos.** El resto de la clase es la
explicación de por qué.

## El GIL, que lo explica todo

El **GIL**, *Global Interpreter Lock*, es un candado que protege las
estructuras internas del intérprete. Solo un hilo puede estar ejecutando
bytecode de Python a la vez, y el intérprete lo va soltando y entregando cada
pocos milisegundos.

!!! note "Dos imágenes de la misma cosa"
    Un profesor atendiendo sustentaciones: puede haber veinte estudiantes
    listos, pero el profesor atiende a uno a la vez. Para atender a dos de
    verdad hace falta otro profesor, que es lo que son los procesos. O un baño
    público con una sola puerta: por mucha fila que haya, entra uno.

El GIL no es del hardware ni de la máquina; es de CPython. Otras
implementaciones no lo tienen, como Jython, que corre sobre la máquina virtual
de Java, y desde Python 3.13 existe una compilación experimental sin GIL. No
es todavía la que viene por defecto, y la dificultad de quitarlo es
precisamente que ese contexto global que el GIL protege es lo que hace
que el intérprete funcione.

Para entrada y salida los hilos sí sirven, porque el GIL se suelta mientras un
hilo espera: descargar cincuenta páginas o leer doscientos archivos se
reparte bien. Para sumar una lista o multiplicar matrices en Python puro, no:
ahí el GIL nunca se suelta por voluntad propia y los hilos se estorban.

## Lanzar un hilo

```python
import threading

t1 = threading.Thread(target=funcion, args=(arg1, arg2))
t1.start()      # lanzar
t2.start()
t1.join()       # esperar a que termine
t2.join()
total = r1 + r2 # recoger los resultados
```

`target` es la función que va a correr y `args` sus argumentos. `start` la
lanza y `join` espera a que termine.

!!! note "Dónde va el join"
    Después de lanzar todos los hilos, no pegado a cada uno. Con
    `t.start()` seguido de `t.join()` dentro del mismo ciclo, el segundo hilo
    no arranca hasta que el primero acabó: el programa vuelve a ser
    secuencial, con el costo de crear hilos encima.

El resultado de cada hilo sale por una variable que la función principal pueda
ver: global o pasada por argumento. Y el orden en que terminan no está
garantizado. El ejemplo de clase fueron dos funciones, una que imprime el
cuadrado de un número y otra el cubo: casi siempre sale primero el cuadrado,
pero nada lo asegura.

## La suma que no mejora

Cien millones de enteros, repartidos entre hilos. Cada hilo recibe un tramo y
suma lo suyo:

```python
size = 100_000_000
l = [2] * size

def sumar(lst, ini, fin):
    s = 0
    for i in range(ini, fin):
        s += lst[i]
    return s
```

El reparto se hace con división entera, para que los índices no salgan con
decimales. Con dos hilos, el primero toma $[0, 10^8/2)$ y el segundo
$[10^8/2, 10^8)$. Con ocho, el primero toma $[0, 10^8/8)$, el segundo
$[10^8/8, 10^8/4)$, el tercero $[10^8/4, 3 \cdot 10^8/8)$, y así:

```python
ini, fin = 0, size // num_hilos
for _ in range(num_hilos):
    t = threading.Thread(target=sumar, args=(l, ini, fin))
    t.start()
    ini = fin
    fin += size // num_hilos
    hilos.append(t)
for t in hilos:
    t.join()
```

Los tiempos del barrido de 2 a 16 hilos:

| Hilos | Tiempo | Contra el secuencial |
|---:|---:|---:|
| 1 (secuencial) | 5,05 s | — |
| 2 | 6,27 s | 0,81× |
| 4 | 7,04 s | 0,72× |
| 6 | 6,23 s | 0,81× |
| 8 | 6,23 s | 0,81× |

Todas las filas con hilos son **peores** que la secuencial. El reparto está
bien hecho y los hilos corren; lo que pasa es que ninguno puede ejecutar
bytecode mientras otro lo hace, así que el trabajo sigue siendo de a uno y
encima se paga crear los hilos y esperar el turno del GIL. Un solo núcleo
trabajando y los demás mirando.

## La misma suma, con NumPy

El cambio es de dos líneas: la lista pasa a ser un arreglo de NumPy y el ciclo
de índices, un `sum()` sobre el segmento.

```python
import numpy as np
l = np.ones(size) * 2

def sumar(lst, ini, fin):
    return lst[ini:fin].sum()   # suma vectorizada del segmento
```

| Hilos | 1 | 2 | 4 | 8 | 16 |
|---|---:|---:|---:|---:|---:|
| Tiempo | 0,045 s | 0,027 s | 0,029 s | 0,025 s | 0,024 s |

Dos cosas cambiaron a la vez. La primera es la escala: de cinco segundos a
cuarenta y cinco milisegundos, porque `lst[ini:fin].sum()` no ejecuta bytecode
de Python sino una rutina compilada en C que recorre memoria contigua con las
instrucciones vectoriales de la sesión anterior. El `slice` es lo que abre esa
puerta: tomar una rebanada es una operación vectorizada, muy distinta de sacar
un valor a la vez.

La segunda es que ahora los hilos **sí** ayudan, aunque poco: esa rutina de C
suelta el GIL mientras trabaja, así que los hilos avanzan de verdad a la vez.
La ganancia se estanca rápido porque el cuello de botella se corrió de sitio:
ya no es el GIL, es el ancho de banda de memoria. Varios hilos leyendo a
la vez saturan el bus, que es el mismo techo de la primera sesión.

!!! note "Lo que no se debe hacer"
    Escribir `for i in range(ini, fin): s += lst[i]` sobre el arreglo de
    NumPy. Sería más lento que con la lista, porque cada indexación convierte
    un valor de NumPy en un objeto de Python. Con NumPy se opera sobre el
    arreglo completo o sobre rebanadas, nunca elemento por elemento.

## Delegar la administración: ThreadPoolExecutor

En vez de crear, lanzar y unir cada hilo a mano, se le entrega el trabajo a un
grupo de hilos y él decide cuándo arranca y termina cada uno.

```python
from concurrent.futures import ThreadPoolExecutor

with ThreadPoolExecutor(max_workers=4) as pool:
    futuro = pool.submit(sumar, lista, ini, fin)
```

El `with` espera a que todos terminen antes de seguir, así que no hace falta
el `join`. Con la misma suma y `max_workers` de 2 a 12 los tiempos salen
parecidos a los de `Thread`: el GIL sigue ahí, y el pool solo cambia quién
administra los hilos.

## Cuando dos hilos tocan lo mismo

### Los cupos que quedan en negativo

Doscientos hilos inscribiéndose en un curso con cien cupos. Cada hilo mira si
queda cupo, y si queda, descuenta uno y se agrega a la lista:

```python
if cupos > 0:
    # entre esta línea y la siguiente alcanzan a pasar otros hilos
    cupos -= 1
    inscritos.append(nombre)
```

Dos corridas de la sesión terminaron con **−18 y −17 cupos**, y con 118 y 117
inscritos donde cabían cien. Entre comprobar y descontar hay un instante, y en
ese instante varios hilos comprueban lo mismo y todos pasan: se llama
comprobar-y-luego-actuar, y es una condición de carrera.

El arreglo es un cerrojo que deje las dos operaciones pegadas:

```python
from threading import Lock
cerrojo = Lock()

with cerrojo:
    if cupos > 0:
        cupos -= 1
        inscritos.append(nombre)
```

Con eso la corrida termina en cupos = 0 e inscritos = 100, siempre. Lo que va
dentro del `with` es la sección crítica: el tramo que solo puede recorrer un
hilo a la vez.

### La actualización perdida

El mismo problema en su forma más pequeña. Dos hilos abonan doscientas mil
veces cada uno sobre el mismo saldo; el total debería ser cuatrocientos mil.

Aumentar un contador son tres pasos: leer, sumar uno, escribir. Si los dos
hilos leen 100, los dos escriben 101, y el saldo quedó en 101 donde debía
quedar en 102. Un abono desapareció sin que nadie salte un ciclo.

!!! note "Dos pintando la misma pared"
    Uno pinta de azul y el otro de rosa, al tiempo y sobre la misma pared.
    Ninguno se saltó su trabajo: los dos gastaron su pintura. Lo que se perdió
    es la mitad del resultado.

En el intérprete ese `saldo += 1` se descompone en cuatro instrucciones:
cargar la variable, cargar la constante, sumar y guardar. El cambio de hilo
puede caer en cualquiera de ellas.

```text
LOAD_NAME    saldo
LOAD_CONST   1
BINARY_OP    +
STORE_NAME   saldo
```

Aquí hay una trampa que la clase mostró en vivo. Escrito como `saldo += 1`
sobre una variable global, el programa a veces da los cuatrocientos mil
exactos, y eso **no es garantía de nada**: el GIL no hace atómicas las
operaciones sobre variables, solo protege al intérprete. Escrito como
`guardar(consultar() + 1)`, con dos funciones de por medio, las pérdidas
aparecen de inmediato, porque entre la lectura y la escritura hay más puntos
donde el intérprete puede cambiar de hilo.

Para que el fenómeno se vea siempre, en la prueba se baja el intervalo de
conmutación con `sys.setswitchinterval(1e-6)`, que hace que el intérprete
alterne mucho más seguido, y se repite la corrida diez veces: una carrera que
aparece a veces se caza repitiendo, no ejecutando una sola vez.

### Las otras primitivas

El cerrojo no es lo único. Un **semáforo** cuenta cupos y sirve para limitar
cuántos hilos entran a la vez, por ejemplo a un grupo de conexiones. Un
**evento** deja a varios hilos esperando con `wait()` hasta que otro avisa que
ya hay datos. Y el otro riesgo que viene con los cerrojos es el
**interbloqueo**: dos hilos esperando cada uno lo que el otro tiene, y ninguno
suelta. La forma de evitarlo es tomar siempre los cerrojos en el mismo orden.

## Procesos: la salida al GIL

Si el problema es que todos los hilos comparten un intérprete, la salida es
tener varios intérpretes. Cada proceso trae el suyo, con su propio GIL y su
propia memoria, y el sistema operativo los reparte entre los núcleos.

```python
import multiprocessing as mp

p = mp.Process(target=sumar, args=(lista, ini, fin))
p.start()
p.join()
```

Ahora el tiempo sí baja al agregar procesos, pero solo hasta cierto punto.
La máquina de la clase tiene seis núcleos físicos; pasando de ocho procesos el
tiempo vuelve a subir, porque hay más candidatos que núcleos y el sistema los
turna, y cada turno cuesta un cambio de contexto. **Más procesos que núcleos
no es más rápido.**

Medir esto con `perf` deja ver algo que un solo reloj esconde: la misma tarea
reportó 1,7 s de tiempo de procesador y 0,54 s de tiempo real. No es
contradicción, es el reparto: el trabajo se repartió entre varios núcleos, así
que la suma de lo que gastó cada uno es mayor que lo que esperó quien lanzó el
programa.

`multiprocessing.Pool` hace con procesos lo que `ThreadPoolExecutor` con
hilos, y los tiempos salen parecidos a crear los procesos a mano.

## Lo que el padre no ve

El precio de aislar la memoria aparece de inmediato:

```python
def cuadrados(lista, resultado):
    for idx, num in enumerate(lista):
        resultado[idx] = num * num

p = mp.Process(target=cuadrados, args=(datos, resultado))
p.start(); p.join()
print(resultado)        # sigue en ceros
```

El hijo llenó su copia. El padre tiene la suya, intacta. Al arrancar un
proceso los argumentos se copian, no se comparten: es paso por valor, y para
copiarlos hay que serializarlos con `pickle`, convertirlos en bytes, mandarlos
y reconstruirlos al otro lado. Con objetos grandes eso cuesta, y hay cosas que
no se pueden mandar: un archivo abierto, un socket, una conexión a una base de
datos.

### Cómo arranca un proceso

| Método | Qué hace | Dónde es el de por defecto |
|---|---|---|
| `fork` | El hijo es una copia del padre | Linux hasta Python 3.13 |
| `spawn` | Arranca un intérprete nuevo que importa el módulo | Windows y macOS |
| `forkserver` | Un proceso servidor limpio va produciendo los hijos | Linux desde Python 3.14 |

Se consultan y se cambian con `mp.get_start_method()` y
`mp.set_start_method()`. Con `spawn` y `forkserver` el módulo se importa de
nuevo en cada hijo, y de ahí sale una regla que en Linux con `fork` nunca
hacía falta:

!!! note "Por qué el `if __name__ == \"__main__\"`"
    Sin esa guarda, todo lo que esté en el cuerpo del módulo se vuelve a
    ejecutar en cada hijo, incluida la línea que lanza procesos. El padre lanza
    hijos, cada hijo lanza hijos, y así hasta llenar la memoria.

## Compartir de verdad

### `Array` y `Value`

Memoria que todos los procesos ven, con tipos simples: entero, `double`,
`long`.

```python
resultado = mp.Array("q", len(datos))   # arreglo compartido
suma = mp.Value("q", 0)                 # un solo valor compartido
```

El reparto por índice es lo que hace que esto funcione sin más: con
`enumerate` cada proceso conoce la posición que le toca y escribe solo ahí.
Con dos procesos sobre cuatro elementos, el primero escribe las posiciones 0
y 1 y el segundo las 2 y 3. Como los procesos terminan en desorden, el índice
es lo que mantiene cada resultado en su sitio.

!!! note "Compartir no es sincronizar"
    Que la memoria sea común no evita la condición de carrera, y aquí no hay
    GIL que ayude de rebote, porque cada proceso tiene el suyo. `Array` y
    `Value` traen un cerrojo interno que hace indivisible **cada acceso**,
    pero no la secuencia leer-sumar-escribir: `total.value += parcial` siguen
    siendo tres pasos.

De ahí los dos remedios, y conviene saber cuál aplica. Si cada proceso escribe
en su propia región, no hace falta nada más: no hay dos escrituras sobre la
misma posición. Si todos acumulan sobre una misma variable, hay que proteger
la actualización con un cerrojo, como el `with suma.get_lock()`.

### `shared_memory`

Para arreglos grandes, un bloque de memoria con nombre que cada proceso abre
e interpreta como quiera, sin copiar nada. Se crea, se usa y se libera:

```python
bloque = mp.shared_memory.SharedMemory(create=True, size=n)
# ... el hijo se conecta por nombre: SharedMemory(name=bloque.name)
bloque.close()
bloque.unlink()      # esto es lo que de verdad lo borra
```

Es la misma disciplina de `malloc` y `free`: reservar, usar, liberar. Si no se
libera, el bloque queda ocupado aunque el programa haya terminado, y la
máquina va teniendo cada vez menos espacio.

### `Manager`

Levanta un proceso servidor que guarda objetos de Python (listas,
diccionarios) y les da a los demás un proxy. Es lo más cómodo y lo más lento:
cada operación sobre el proxy es un viaje al servidor con serialización de ida
y vuelta, así que con millones de accesos no sirve. A cambio, los procesos
pueden estar en máquinas distintas.

## Hablar en vez de compartir

### `Queue`

Una fila FIFO donde varios procesos ponen con `put` y varios sacan con `get`.
Lo que entra es una **copia**: la cola no comparte el dato, lo serializa, lo
manda y lo reconstruye.

!!! note "La bolsa"
    En la cola se mete una copia de lo que uno quiere compartir, y quien
    necesite consultar va sacando de la bolsa en el orden en que quedaron.

Dos comportamientos que hay que tener presentes. `get` sobre una cola vacía
**bloquea** hasta que llegue algo, y `put` sobre una cola llena espera a que
se libere un espacio; para no esperar para siempre se les pone un `timeout`,
que lanza un error al vencerse. Y `empty()` puede mentir: si otro proceso está
en mitad de un `put`, la cola responde que está vacía y no lo está.

La forma de terminar un consumidor es un **centinela**: un elemento que
significa «se acabó», que el productor pone al final y el consumidor reconoce
para salir del ciclo. Sin eso, el consumidor se queda esperando un dato que no
va a llegar.

### `Pipe`

Un canal entre exactamente dos procesos, con un extremo en cada uno:

```python
izq, der = mp.Pipe()
der.send("hola"); der.send("fin"); der.close()
# del otro lado: izq.recv() hasta que llegue "fin"
```

`send` y `recv` escriben y leen; `recv` bloquea si no hay nada, y para eso
está `poll()`, que pregunta si hay mensaje sin quedarse esperando. Las reglas
para no colgarse son tres: mandar la marca de fin, capturar el error, y cerrar
el extremo que no se usa.

### Lo que cuesta cada uno

Doscientos mil enteros, llevados de un proceso a otro:

| Mecanismo | Tiempo |
|---|---:|
| Memoria compartida (`Array`) | 1,10 s |
| `Pipe` | 1,38 s |
| `Queue` | 1,68 s |

La diferencia es la serialización. Con memoria compartida no viaja nada: los
dos procesos miran el mismo bloque. Con `Pipe` y con `Queue` cada entero se
convierte en bytes, pasa por un canal del sistema operativo y se reconstruye
al otro lado.

## Cómo elegir

| Situación | Qué usar |
|---|---|
| Esperar disco, red o una consulta | Hilos |
| Cálculo que satura el procesador | Procesos |
| Muchos datos entre procesos | Memoria compartida (`Array`, `shared_memory`) |
| Objetos de Python entre varios productores y consumidores | `Queue` |
| Dos procesos conversando | `Pipe` |
| Estructuras cómodas y poco tráfico | `Manager` |

Y la pregunta que va antes de todas: si la tarea en secuencial tarda del orden
de milisegundos, se deja secuencial. Crear procesos cuesta, y lanzarlos para
repartir un trabajo que ya era corto solo empeora el tiempo.

Esto aparece en sitios concretos. Un servidor web de Python como Gunicorn
levanta varios procesos trabajadores para atender peticiones al tiempo. Una
simulación de Monte Carlo —como la estimación de pi de la sesión anterior— se
reparte bien porque las repeticiones son independientes entre sí, que es
justamente la condición para poder repartirlas.

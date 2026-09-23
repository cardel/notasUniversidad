# Profiling en Python e instrucciones AVX

Lo que se vio en la tercera sesión: dónde se va el tiempo de un programa en
Python, con qué herramienta se averigua cada cosa, y qué hacer cuando el
ciclo de Python es justamente el problema. Las diapositivas están en el
Campus Virtual; aquí quedan las cuentas, las mediciones y el código que se
corrió en clase.

## Dos programas que se leen igual

Una matriz de 10 000 × 10 000 enteros, todos en 5. Dos maneras de llenarla:

```python
for i in range(filas):
    for j in range(columnas):
        matriz[i, j] = 5    # 15,39 s

matriz.fill(5)              # 0,10 s
```

Las dos son $O(n^2)$ y las dos producen el mismo arreglo. Entre una y otra
hay un factor cercano a 150, y nada en el texto del programa lo anuncia: la
única forma de saberlo es medir.

La diferencia está en quién hace el trabajo. La segunda baja a la capa de C
de NumPy y llena la memoria de corrido; la primera paga el intérprete de
Python cien millones de veces, y en Python cada número es un objeto, no un
valor suelto.

Perfilar es recolectar y analizar métricas de un programa en ejecución para
encontrar los puntos críticos, en tres frentes: gasto de memoria, tiempo de
ejecución y uso de recursos del sistema. La sesión se queda en los dos
primeros. El punto crítico no siempre está en el código propio: puede ser una
API remota lenta, un disco lento o la red de la universidad, y perfilar
también sirve para saber de quién es el problema.

### Antes de optimizar, tres preguntas

La primera es si el código es correcto, porque optimizar un programa que
entrega mal el resultado no arregla nada. La segunda es si está escrito de
forma que otro pueda leerlo y modificarlo: un programa rápido que nadie
entiende no se puede mantener. La tercera es dónde está el cuello de botella,
y esa es la que responden las herramientas de esta sesión.

!!! note "Hazlo funcionar, hazlo correcto, hazlo rápido"
    En ese orden, y la observación de Joe Armstrong es que cuando uno hace lo
    que hay que hacer, el 90 % de las veces el resultado ya es bonito y
    rápido. Elegir bien el algoritmo y la estructura de datos pesa más que
    cualquier micro-optimización posterior.

El principio de Pareto aplicado al código dice que optimizando el 20 % se
obtiene el 80 % del beneficio, y la regla 90-10 que un programa típico gasta
el 90 % del tiempo en el 10 % del código. Las herramientas de perfilado
sirven para encontrar ese 10 %.

### El techo lo pone Amdahl

La misma ley de la primera sesión, ahora sobre una optimización en vez de una
paralelización: si una función se lleva el 70 % del tiempo y se hace el doble
de rápida, el programa no queda el doble de rápido.

Con un programa de 20 s del que 14 s son acelerables: esos 14 pasan a 7, los
6 restantes no se mueven, y el total va de 20 s a 13 s. La relación es
20 / 13 = 1,54. Lo que no se toca fija el techo, y con aceleración infinita
sobre esa parte el máximo sería 1 / (1 - 0,7) = 3,3.

De ahí sale el criterio para no optimizar: un script que corre una vez y se
archiva, o uno que tarda cuatro minutos mientras uno se toma un café, no
justifica el trabajo. Si optimizar cuesta más que ejecutar, no se optimiza.
Es la misma cuenta de la deuda técnica: antes de pagarla hay que ver qué se
gana.

## El ambiente: `venv` y `requirements.txt`

En las salas no se pueden instalar bibliotecas en el sistema, y eso no es un
obstáculo: un ambiente virtual parte del Python instalado y arma un entorno
propio donde sí se instala lo que haga falta.

```bash
python3 -m venv venv          # crear
source venv/bin/activate      # activar: el nombre aparece entre paréntesis
pip install numpy pyinstrument
pip freeze > requirements.txt # dejar registro de qué versión es cada cosa
```

Las bibliotecas quedan aisladas del sistema operativo; la versión del
intérprete, no. Y el archivo de dependencias es el que hace que el programa
vuelva a correr en otra máquina: dice qué biblioteca y en qué versión.

Eso importa por una razón que se ve más adelante en el curso, cuando el
programa se empaqueta en un contenedor. El enfoque de infraestructura no es
llevar todo a la última versión: es hacer que funcione con las versiones con
las que se construyó. Si un proyecto corre con Python 3.9 y ciertas versiones
de sus bibliotecas, el trabajo es proveer ese ambiente, no actualizarlo. Por
eso los bancos siguen con COBOL, que no es un lenguaje congelado hace sesenta
años sino uno con sesenta años de revisiones encima, y en procesos críticos
eso pesa más que la novedad.

En la industria se usan herramientas como Conda o Micromamba, que automatizan
la detección de dependencias en conflicto. Para el curso basta con `venv`.

## Medir: `time` y `timeit`

Hay dos actividades distintas. El *benchmarking* mide cuánto tarda un
fragmento; el perfilado dice en qué se gasta el tiempo. `time` y `timeit`
hacen lo primero.

El módulo `time` trae cuatro relojes, y los dos que importan aquí miden
cosas distintas:

| Función | Qué mide |
|---|---|
| `perf_counter` | Reloj de pared, con la mayor resolución disponible |
| `process_time` | Tiempo de procesador del proceso, sin contar esperas |
| `monotonic` | Reloj que nunca retrocede, para intervalos |
| `time` | Segundos desde el 1 de enero de 1970 |

La diferencia entre los dos primeros es la que delata una espera. Un programa
que tarda veinte minutos de reloj y consume cinco de procesador pasó quince
esperando algo: un archivo, una consulta, la red.

El problema de `time` es que entrega una sola medición por ejecución, y esa
medición trae el ruido del estado de la caché y de lo que esté haciendo la
máquina. `timeit` repite el fragmento muchas veces, apaga el recolector de
basura mientras mide, usa el temporizador de mayor resolución y separa la
preparación con el argumento `setup`.

```python
import timeit
total = timeit.timeit(lambda: fib(30), number=100)
print(total / 100)            # el promedio se saca a mano
```

`timeit` devuelve el total, no el promedio, y la razón tiene que ver con los
números en punto flotante. Un `double` no puede representar todos los
reales: la máquina es finita, así que guarda el más cercano e introduce un
error de truncamiento que se propaga al operar. Dividiendo una sola vez al
final, ese error se paga una vez y no cien.

!!! note "Los bancos no calculan en pesos"
    Calculan en centavos, con enteros, por esta misma razón. Un banco con
    veinte millones de clientes y un error de un centavo por cliente y por
    segundo pierde doscientos mil pesos por segundo. La regla para
    cualquier cálculo financiero es trabajar en la unidad entera mínima y
    dividir solo para mostrar.

## Dónde se va el tiempo: `cProfile`

`cProfile` es un perfilador determinista: registra cada llamada a función.
Viene en la biblioteca estándar, está implementado en C y su reporte trae,
por función, cuántas veces se llamó (`ncalls`), el tiempo propio sin contar
las llamadas que hace (`tottime`) y el acumulado que sí las cuenta
(`cumtime`).

El encabezado distingue dos cuentas que conviene no confundir. Las **llamadas
totales** son todas las invocaciones, incluidas las de la recursión. Las
**llamadas primitivas** son las que entran a la función desde fuera de ella:
una función recursiva invocada una vez desde el programa principal aporta una
sola llamada primitiva, sin importar cuántos niveles baje.

Sobre `fib(35)` sin memoización:

```text
9227465
   29860712 function calls (10 primitive calls) in 4.957 seconds
```

Diez llamadas primitivas contra casi treinta millones de llamadas totales:
todo el trabajo está dentro de una sola recursión que recalcula los mismos
valores una y otra vez. La cota es $O(2^n)$, aunque el número exacto crece
como $\varphi^n$ con la razón áurea, y por eso da veintinueve millones y no
treinta y cuatro mil millones.

La corrección es memoizar: guardar cada resultado la primera vez que se
calcula y devolverlo cuando lo vuelvan a pedir. `functools.lru_cache` lo hace
sobre una tabla hash, y basta una línea encima de la función:

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)
```

El arroba es un decorador: una función que recibe otra función y le cambia el
comportamiento, como las anotaciones de Java. Aquí lo que agrega es memoria.
El resultado:

```text
9227465
         45 function calls (10 primitive calls) in 0.000 seconds
```

De veintinueve millones de llamadas a cuarenta y cinco. El algoritmo pasó de
exponencial a lineal sin tocar la recursión. La caché guarda por los
argumentos de la llamada, así que estos tienen que ser hashables: con un
número funciona, con una lista o un diccionario como argumento no.

### El perfilador cobra su parte

Registrar cada llamada cuesta: `cProfile` agrega del 30 al 45 % al tiempo de
ejecución, y en programas con muchas llamadas cortas mucho más. Sobre
`fib(35)` el sobrecosto es de más de un segundo.

Ese costo no se reparte parejo: pesa más sobre funciones pequeñas llamadas
muchas veces, que son justamente las que uno quiere juzgar. Sirve para
comparar funciones dentro de la misma corrida, no para reportar el tiempo
real de un programa. Y no va en producción: allí solo agrega tiempo de
ejecución. Su lugar es el banco de pruebas, cuando alguien reporta que algo
tarda y hay que decir dónde.

## Muestrear en vez de registrar: Pyinstrument

Pyinstrument es un perfilador estadístico: en vez de anotar cada llamada,
cada cierto intervalo guarda la pila de llamadas y después reconstruye el
árbol. El sobrecosto baja a cerca del 5 %, y a cambio se pierde el conteo
exacto de llamadas.

Para ver con confianza una función que consume el x % del tiempo hacen falta
del orden de 100/x muestras, suponiendo que el programa se comporta parejo. Lo
que dura menos que el intervalo no aparece. Por eso la
herramienta no sirve para programas muy cortos, ni para programas erráticos,
donde el muestreo puede caer siempre en el mismo sitio: ahí `cProfile` dice
más.

El ejemplo de la sesión es la estimación de pi por Monte Carlo. Se tiran
puntos al azar en un cuadrado con un círculo inscrito, y la proporción de los
que caen dentro del círculo tiende a pi/4; entre más puntos, mejor la
estimación.

```text
13.2 <module>  MonteCarlos.py:1
└─ 13.2 estimate_pi  MonteCarlos.py:5
   ├─ 12.6 <genexpr>  MonteCarlos.py:6
   │  ├─ 8.2 point  MonteCarlos.py:13
   │  │  ├─ 4.2 Random.uniform  random.py:500
   │  │  │  ├─ 2.7 [self]  random.py
   │  │  │  └─ 1.5 Random.random  <built-in>
   │  │  └─ 4.0 [self]  MonteCarlos.py
```

De 13,2 s totales, `Random.uniform` se lleva 4,2 s, y de esos 2,7 s son
`[self]`: trabajo de la propia función, escrita en Python. Solo 1,5 s bajan a
`Random.random`, que está en C. `uniform(0, 1)` escala un número aleatorio a
un rango, y ese escalado se paga en el intérprete.

Cambiar `uniform` por `random` es una línea, y el programa pasa de 13,2 s a
8,7 s. El nodo que costaba 4,2 s pasa a costar 1,9 s y desaparece el `[self]`
de `random.py`. Un tercio del tiempo, por cambiar de función.

| Nodo | Con `uniform` | Con `random` |
|---|---:|---:|
| Total del programa | 13,2 s | 8,7 s |
| `point` | 8,2 s | 3,2 s |
| `Random.uniform` | 4,2 s | — |
| `Random.random` | 1,5 s | 1,9 s |

Ese es el tipo de decisión que el perfil hace visible y que leyendo el código
no se ve: las dos versiones hacen lo mismo y se leen igual de bien.

### Cuál usar para qué

| | `time` | `timeit` | `cProfile` | Pyinstrument |
|---|---|---|---|---|
| Responde | cuánto | cuánto, con repeticiones | dónde, por función | dónde, por rama |
| Técnica | cronómetro | cronómetro repetido | instrumentación | muestreo |
| Sobrecosto | mínimo | mínimo | 30–45 % o más | ~5 % |
| Granularidad | el fragmento | el fragmento | cada función | lo que alcance el muestreo |

Sobre el mismo programa, uno que busca para cada punto de una nube de dos mil
el vecino más cercano y antes espera medio segundo simulando un sensor, las
dos herramientas dicen cosas distintas. `cProfile` cuenta que `distancia` se
llamó cuatro millones de veces y lista noventa y cinco funciones;
Pyinstrument muestra el árbol, dónde está el medio segundo de espera y qué
rama pesa, pero no dice cuántas veces se llamó nada.

El precio también difiere: sin perfilador el programa tarda 1,382 s de reloj
y 0,870 s de CPU; con `cProfile`, 3,024 s; con Pyinstrument, 2,990 s. Que el
perfilador estadístico cueste casi lo mismo tiene explicación: para decidir
cada milisegundo si guarda la pila instala un enganche que se dispara en cada
llamada, y con cuatro millones de llamadas diminutas ese enganche pesa tanto
como instrumentarlas todas. Con la misma nube y la llamada por par eliminada,
el programa hace 6 232 llamadas y los dos perfiladores desaparecen dentro del
ruido de la medición.

### Dos decisiones que salieron del perfil

La primera fue sacar la llamada a `distancia` del ciclo interno y comparar
directamente: cuatro millones de llamadas se vuelven unos pocos miles.

La segunda es de cálculo numérico. Para comparar distancias no hace falta la
raíz cuadrada: si una distancia es mayor que otra, su cuadrado también lo es,
y las distancias nunca son negativas. Comparando cuadrados desaparece la raíz
y, con ella, buena parte del trabajo en punto flotante. En cálculo numérico
las operaciones con `double` son caras y arrastran error; cuando se pueda,
conviene trabajar con enteros.

El flujo de trabajo completo es corto: verificar que el programa es correcto,
medir para tener el punto de comparación, perfilar para encontrar el cuello
de botella, optimizar ese 10 % crítico, y volver a perfilar para comprobar
que el cuello se movió.

## Cuando el ciclo de Python es el problema

### Qué guarda una lista

En C, un arreglo es una reserva de memoria y `arr[i]` es azúcar sintáctico de
`*(arr + i)`: llegar a un elemento es sumar un desplazamiento a una
dirección, y cuesta lo mismo sea cual sea el índice. Los arreglos
bidimensionales no existen; son unidimensionales con la aritmética adentro.

```c
int *arr = malloc(1000 * sizeof(int));
for (int i = 0; i < 1000; i++) {
  *(arr + i) = 10;   // idéntico a arr[i] = 10;
}
```

Una lista de Python es un arreglo por debajo, con capacidad reservada y un
contador de cuántos elementos tiene. De ahí sale que `append` cueste $O(1)$:
escribe en la primera posición libre y mueve el contador. Insertar al
principio, en cambio, corre todos los elementos: cuesta $O(n)$, y un ciclo
que inserta al principio se vuelve $O(n^2)$ sin que nada lo anuncie. Invertir
una lista poniendo el último al principio funciona y es de las formas más
caras de hacerlo.

Lo caro de Python no es llegar al elemento, que también es $O(1)$. Lo caro es
lo que hay en cada posición: la lista guarda punteros a objetos, y cada
número es un objeto con su envoltura. Un arreglo de NumPy guarda los valores
contiguos, del mismo tipo y del mismo tamaño, tal como el arreglo de C.

Eso tiene una consecuencia que sorprende:

```python
>>> a = np.full(10, 1)
>>> type(a[0])
<class 'numpy.int64'>     # no es un int de Python
>>> np.int64(2**62) * 4
0                         # desborda, como en C
>>> 2**62 * 4
18446744073709551616      # el entero de Python no tiene tope
```

El elemento que devuelve NumPy es una envoltura de un valor de C de 64 bits,
con el desbordamiento de C incluido. El entero de Python no desborda porque
no es un entero de máquina.

Y otra que muerde más seguido:

```python
>>> matriz = [[]] * 10     # diez referencias a la MISMA lista
>>> matriz[0].append(2)
>>> matriz
[[2], [2], [2], [2], [2], [2], [2], [2], [2], [2]]
```

Como los objetos se guardan por referencia, las diez posiciones apuntan al
mismo objeto. Con valores inmutables, en cambio, asignar en una posición sí
la cambia solo a ella.

### Cuatro formas de sumar lo mismo

Con diez millones de números, en la máquina de la sesión:

| Forma | Tiempo |
|---|---:|
| Lista, recorriéndola con `for x in xs` | 551 ms |
| Lista, indexando con `xs[i]` | 852 ms |
| Arreglo de NumPy, indexando desde Python | 2 197 ms |
| `np.sum` sobre el arreglo | 13 ms |

Indexar cuesta más que recorrer porque hay que calcular la posición,
verificar los límites y se pierde la localidad espacial, el mismo efecto del
recorrido de una matriz por columnas de la primera sesión. Y el arreglo de
NumPy indexado desde Python es lo peor de los dos mundos: todo lo anterior
más la conversión de cada `int64` a un objeto de Python, que después hay que
volver a desenvolver.

!!! note "La regla que deja NumPy"
    Si aparece un `for` recorriendo un arreglo de NumPy, casi siempre existe
    una función vectorizada que hace lo mismo entre diez y cien veces más
    rápido. Preferir `np.sum`, `np.dot`, los operadores, las funciones
    matemáticas vectorizadas, el *slicing* y el *broadcasting*; evitar los
    ciclos, la indexación elemento por elemento y sacar los datos a listas.

## Instrucciones AVX

AVX, *Advanced Vector Extensions*, son instrucciones SIMD: una sola
instrucción sobre varios datos. En vez de sumar un par de números por
instrucción, el procesador carga varios en un registro ancho y los opera de
una vez.

| Registro | `float32` | `float64` |
|---|---:|---:|
| 128 bits (SSE) | 4 | 2 |
| 256 bits (AVX/AVX2) | 8 | 4 |
| 512 bits (AVX-512) | 16 | 8 |

La cuenta que sale de ahí: sumar un arreglo de cinco millones de `float64`
con un registro de 256 bits, que carga cuatro dobles, necesita 1 250 000
instrucciones en vez de cinco millones. AVX es la familia de x86; ARM tiene
NEON y SVE, y por eso la portabilidad la resuelve la biblioteca, no el
programa: NumPy escoge la ruta según lo que reporte el procesador.

Para que los elementos puedan viajar juntos en un registro hacen falta cuatro
condiciones: que sea **la misma operación** para todos, que los elementos
sean **independientes** entre sí, que el **acceso a memoria sea contiguo y
regular**, y que **no haya bifurcaciones** que dependan del dato dentro del
ciclo.

Cinco patrones sobre el mismo arreglo de cinco millones de `float64`, en la
máquina del deck:

| Patrón | Tiempo | Factor | Condición que rompe |
|---|---:|---:|---|
| Contiguo, `a * 2.5 + 1.0` | 11,8 ms | 1× | Ninguna |
| Índices dispersos, `a[idx]` | 63,6 ms | 5,4× | Acceso regular |
| `np.where(a > 0.5, ...)` | 21,2 ms | 1,8× | Ninguna: la máscara reemplaza el salto |
| `if` dentro de un ciclo | 1 578,3 ms | 134× | Bifurcación por dato |
| Recurrencia `s[i] = 0.99*s[i-1] + a[i]` | 1 681,6 ms | 142× | Independencia |

Los dos últimos quedan en el mismo orden de magnitud, y por motivos
distintos. El `if` en bucle rompe la bifurcación, pero lo que lo hace
catastrófico es el costo del intérprete recorriendo cinco millones de
posiciones; `np.where` hace la misma decisión con una máscara vectorizada y
cuesta 1,8×. La recurrencia sí es imposible de vectorizar: cada paso necesita
el anterior, como la suma de prefijos de la sesión anterior.

El acceso disperso no rompe nada de la lógica, solo el orden: leer las
posiciones salteadas deja de aprovechar la línea de caché y los elementos no
llegan juntos.

## Del registro a la GPU

Un registro AVX reparte una instrucción entre ocho carriles. Una GPU lleva
eso al extremo con miles de carriles, con una diferencia: cada grupo tiene su
propio contador de programa, por eso el modelo se llama SIMT. Cuando los
carriles de un grupo toman caminos distintos, el grupo ejecuta los dos y la
mitad queda esperando.

La GPU tiene memoria propia y mucho más ancho de banda que la CPU, pero los
datos hay que llevarlos y traerlos por el bus PCIe, y ese viaje no hace
ningún cálculo. La pregunta es cuántas operaciones se hacen por cada byte que
viaja:

| Operación | Bytes | Operaciones | Op/byte | ¿Se mueve? |
|---|---:|---:|---:|:---:|
| `a * 2.5 + 1.0` sobre 5 M `float64` | 80 MB | 10 Mflop | 0,125 | No |
| Producto de matrices 4000 × 4000 `float32` | 192 MB | 128 Gflop | 667 | Sí |

La primera fila: cinco millones de `float64` son 40 MB de ida y 40 de vuelta;
a 12 GB/s el viaje solo cuesta 6,7 ms, y NumPy en la CPU resuelve la
operación completa en 11,8 ms. No compensa. La segunda: tres matrices de
4000 × 4000 en `float32` son 3 × 16 M × 4 B = 192 MB, y el producto hace
$2n^3$ = 128 Gflop, unas 667 operaciones por byte. Ahí sí.

Entre una fila y otra hay un factor de más de cinco mil en operaciones por
byte, y el corte está cerca de diez. De ahí la práctica habitual: subir los
datos una vez, encadenar sobre ellos todas las operaciones que se pueda, y
bajar solo el resultado. Cada ida y vuelta intermedia se come la ganancia.

Desde Python el puente son CuPy y PyTorch, que replican la interfaz de NumPy
y despachan a CUDA, el controlador de las tarjetas NVIDIA.

!!! note "Los perfiladores de esta sesión no sirven para la GPU"
    La llamada retorna apenas encola el trabajo, antes de que la GPU lo
    termine, así que `cProfile` y Pyinstrument le atribuyen microsegundos a
    una operación que tardó milisegundos. Hay que sincronizar antes de
    detener el cronómetro, con `torch.cuda.synchronize()` o
    `cp.cuda.runtime.deviceSynchronize()`, o medir con las herramientas del
    fabricante.

Y por debajo de todo esto está lo mismo: NumPy no implementa álgebra lineal
por su cuenta, delega en BLAS, LAPACK o MKL, que están escritas en C y
Fortran y compiladas con las instrucciones vectoriales del procesador. Por
eso Python sirve para cálculo numérico pese a ser lento: la sintaxis es de
Python y el trabajo es de C.

## Lo que sigue

Todo lo que se cargó al arrancar el intérprete vive en un contexto global
—los `builtins`, los módulos importados— y ese contexto compartido es el que
impide que dos hilos de Python ejecuten código del intérprete a la vez. Ese
candado tiene nombre y es el tema de la sesión siguiente, junto con la
diferencia entre repartir en hilos y repartir en procesos.

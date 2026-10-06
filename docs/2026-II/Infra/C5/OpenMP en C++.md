# OpenMP en C++

Lo que se vio en la sesión: cómo repartir un ciclo entre hilos escribiendo una
línea, qué protege cada directiva, cuánto cobra, y cómo comprobar que el
programa de verdad usó los hilos que uno pidió. Las diapositivas están en el
Campus Virtual; aquí quedan las cuentas, las mediciones y el código que se
corrió.

## El recorrido manda sobre el número de hilos

Dos ciclos que escriben la misma matriz de 10 000 por 10 000 y solo se
diferencian en cuál índice va por fuera:

```cpp
// A, por filas
for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++)
        arr[i][j] = i + j;

// B, por columnas
for (int j = 0; j < n; j++)
    for (int i = 0; i < n; i++)
        arr[i][j] = i + j;
```

| Recorrido | Tiempo |
|---|---:|
| A, por filas | 6,7 s |
| B, por columnas | 126,7 s |

Casi diecinueve veces, sin tocar un solo hilo. La memoria no entrega enteros sueltos:
entrega líneas de 64 bytes. Un `int` ocupa 4, así que en cada línea caben
**16 enteros**. El recorrido A pide `arr[0][0]`, falla, trae la línea y acierta
en los quince accesos siguientes; vuelve a fallar en el dieciseisavo. El
recorrido B salta 40 000 bytes entre un acceso y el siguiente: cada uno cae en
una línea distinta y los dieciséis enteros que se trajeron se desperdician.

| Paso | A, por filas | Caché | B, por columnas | Salto | Caché |
|---|---|---|---|---:|---|
| 1 | `arr[0][0]` | fallo | `arr[0][0]` | 0 B | fallo |
| 2 | `arr[0][1]` | acierto | `arr[1][0]` | 40 000 B | fallo |
| 16 | `arr[0][15]` | acierto | `arr[15][0]` | 600 000 B | fallo |
| 17 | `arr[0][16]` | fallo | `arr[16][0]` | 640 000 B | fallo |

Esa es la cuenta que conviene tener a mano: 64 ÷ 4 = 16. Con `double`, de 8
bytes, serían 8 por línea.

## Falsa compartición

La línea también es la unidad con que el hardware mantiene la coherencia entre
núcleos. Dos hilos que escriben posiciones distintas del mismo arreglo (uno
`arr[0]` a `arr[7]`, el otro `arr[8]` a `arr[15]`) caen en la misma línea de 64
bytes. Cada escritura de uno invalida la copia del otro, y los dos se pasan la
línea de un lado a otro sin compartir un solo dato.

No da resultados malos, da lentitud: un programa paralelo que corre más lento
que el secuencial sin que nadie toque la misma variable. Se evita dando a cada
hilo un bloque contiguo grande, acumulando en una variable local y combinando al
final, o separando los acumuladores a una línea completa de distancia.

## Una directiva, no una biblioteca

OpenMP se escribe como anotaciones sobre el código que ya existe:

```cpp
#pragma omp parallel for reduction(+ : c)
for (int i = 0; i < n; i++)
    c += a[i] * b[i];
```

Un compilador que no sepa de OpenMP descarta la `#pragma` y deja el ciclo
secuencial. El mismo archivo produce las dos versiones según la bandera:

```bash
g++ -O2 -Wall -Wextra equipo.cpp -o secuencial           # un hilo
g++ -O2 -Wall -Wextra -fopenmp equipo.cpp -o paralelo    # equipo de hilos
```

De ahí salen dos ventajas: no hay dos copias del programa que mantener
sincronizadas, y donde no haya soporte el código sigue compilando y dando el
mismo resultado, solo que más lento.

`-Wall -Wextra` van siempre. En paralelismo los errores caros son los que el
compilador señala y nadie lee: una variable sin usar que delata un `private` mal
puesto, un índice con signo distinto, una `#pragma` que no aplica a la línea que
sigue.

## Cuántos hilos arrancan

El equipo arranca por defecto con tantos hilos como hilos lógicos tenga la
máquina. En la del salón, seis núcleos físicos con dos hilos cada uno:

```bash
./entorno
```

```text
omp_get_max_threads() = 12
omp_get_dynamic()     = 0
omp_get_schedule()    = dynamic, trozo 1
```

Se cambia por variable de entorno, que es lo más usado, o desde el programa con
`omp_set_num_threads(4)`. Hay dos preguntas distintas que se confunden:
`omp_get_max_threads()` responde cuántos hilos usaría la próxima región y se
puede llamar desde código secuencial; `omp_get_num_threads()` responde cuántos
hay en la región donde se ejecuta la llamada, y fuera de una región vale 1
siempre.

`OMP_DYNAMIC=true` autoriza a la biblioteca a usar menos hilos de los pedidos si
la máquina está cargada, y entonces dos corridas idénticas dan tiempos
distintos. Para medir se deja en `false`.

## Las directivas de la sesión

```cpp
#pragma omp parallel { ... }        // región paralela
#pragma omp parallel for            // reparte las iteraciones del ciclo
#pragma omp parallel for reduction(<op> : <variable>)
```

**Variables.** Qué ve cada hilo lo deciden tres cláusulas:

| Cláusula | ¿Copia por hilo? | ¿Valor al entrar? | ¿Se ve afuera? |
|---|---|---|---|
| `shared` | no | el de afuera | sí |
| `private` | sí | sin inicializar | no |
| `firstprivate` | sí | el de afuera | no |

El error común es leer una variable `private` suponiendo que trae el valor que
tenía antes de la región. No lo trae: llega sin inicializar. Para eso está
`firstprivate`.

**Carreras de datos.** Tres mecanismos, de menor a mayor costo:

| Mecanismo | Cuándo aplica | Costo |
|---|---|---|
| `reduction` | acumular con un operador asociativo | el menor: sin bloqueos dentro del ciclo |
| `atomic` | una sola lectura y escritura sobre un escalar | bajo, lo resuelve el hardware |
| `critical` | varias instrucciones que van juntas | alto: serializa el bloque entero |

Un `critical` dentro de un ciclo caliente puede dejar el programa más lento que
la versión secuencial, porque los hilos hacen fila en cada iteración.

**Tareas y sincronización.** `sections` reparte tareas distintas entre hilos:
procesar audio, video y subtítulos a la vez. `barrier` hace que todos esperen,
`single` deja que uno cualquiera ejecute un bloque y `master` que lo haga el
principal.

**Reparto de iteraciones.** `schedule` elige cómo se reparten, y con carga
desigual la diferencia se nota:

| Política | Tiempo |
|---|---:|
| `static` | 57,05 ms |
| `dynamic, 2` | 49,83 ms |
| `guided` | 58,93 ms |
| `dynamic, 1000` | 66,26 ms |

Carga uniforme, `static`, que no cuesta nada decidir. Carga variable,
`dynamic`, que entrega trabajo a quien se desocupa. Y el tamaño del trozo
importa: con 1000 los últimos hilos se quedan con un bloque enorme mientras los
demás esperan.

**Ciclos anidados.** El anidamiento viene apagado: una región dentro de otra
corre con un equipo de un hilo. Se habilita con `OMP_MAX_ACTIVE_LEVELS=2`, pero
con doce núcleos un equipo externo de doce que abre doce cada uno pide 144
hilos a una máquina que puede correr doce. Lo habitual es `collapse(2)`, que
funde los dos ciclos y reparte el producto entre un solo equipo.

## La reducción de una matriz, medida

Sumar los 10⁸ elementos de una matriz de 10 000 por 10 000:

| Versión | Tiempo |
|---|---:|
| Sin OpenMP | 237,78 ms |
| OpenMP, recorrido por filas | 47,72 ms |
| OpenMP, recorrido por columnas | 140,24 ms |

La versión paralela por columnas es tres veces más lenta que la paralela por
filas. Los hilos no arreglan el patrón de acceso: lo multiplican.

## Dos errores que dejan el programa mudo

Vectores de 10⁸ elementos, cuatro hilos:

| Escritura | Resultado | Tiempo |
|---|---:|---:|
| `#pragma omp parallel for reduction(+ : suma)` | 10 000 000 000 | 31 ms |
| `#pragma omp parallel reduction(+ : suma)` | 40 000 000 000 | 120 ms |
| `#pragma parallel reduce(suma : +)` | 10 000 000 000 | 73 ms |

El primero es el correcto. El segundo olvidó el `for`: cada hilo recorre el
ciclo completo, el resultado sale multiplicado por cuatro y el programa hace
cuatro veces el trabajo. El tercero invirtió la sintaxis, el compilador no
reconoce la directiva y la descarta en silencio: el resultado es correcto y el
tiempo es el del secuencial.

Ninguno de los dos falla ni avisa por su cuenta. Lo que los delata es revisar el
valor y compilar con `-Wall -Wextra`. El segundo es el que más caro sale: el
resultado está bien y nadie sospecha, hasta que alguien cronometra.

## Tres formas de hacer lo mismo

| | `std::thread` | TBB | OpenMP |
|---|---|---|---|
| Líneas para el ejemplo | 14 | 12 | 3 |
| Control sobre los hilos | total | escaso | por cláusulas |
| Balance de carga | manual | automático | `schedule` |
| Reutiliza los hilos | no | sí | sí |
| Dependencias | solo el estándar | biblioteca externa | la bandera |
| Volver a secuencial | reescribir | reescribir | quitar la bandera |

Sobre un vector de un millón, cuatro hilos, el mejor de veinte repeticiones:

| Enfoque | Tiempo |
|---|---:|
| Secuencial | 0,13 ms |
| `std::thread` | 0,21 ms |
| TBB `parallel_reduce` | 0,09 ms |
| OpenMP | 0,13 ms |

`std::thread` resulta más lento que el secuencial porque crea y destruye
cuatro hilos en cada llamada. El costo se ve mejor repitiendo mil veces el mismo ciclo:
OpenMP tarda 24 ms y `std::thread` 116 ms, cinco veces más. OpenMP mantiene el
equipo vivo entre regiones, y de ahí sale la recomendación de agrupar el trabajo
en pocas regiones grandes en vez de abrir una por ciclo.

## Hasta dónde sube

La integral de 4/(1+x²) entre 0 y 1 con mil millones de rectángulos: puro
cálculo, sin tráfico de memoria que lo frene.

| Hilos | Tiempo | Aceleración | Eficiencia |
|---:|---:|---:|---:|
| 1 | 1 253,6 ms | 1,00 | 100 % |
| 2 | 637,7 ms | 1,97 | 98 % |
| 4 | 346,8 ms | 3,61 | 90 % |
| 6 | 252,6 ms | 4,96 | 83 % |
| 9 | 227,5 ms | 5,51 | 61 % |
| 12 | 256,1 ms | 4,89 | 41 % |

Hasta seis hilos cada uno tiene su núcleo y la eficiencia se sostiene en 83 %.
Del séptimo en adelante dos hilos comparten núcleo y la misma unidad de punto
flotante: el tiempo sigue bajando un poco hasta nueve y después sube. El codo de
la curva está donde se acaban los núcleos físicos, no donde se acaban los hilos
lógicos. Conviene medirlo antes de prometer una aceleración.

La fórmula de Karp-Flatt estima qué fracción del programa es secuencial a partir
de la aceleración observada: entre 1,7 % y 4,2 % hasta seis hilos, que es el
código secuencial de verdad, y 13,2 % con doce, que ya no es código sino
hardware compartido.

Y el techo lo pone Amdahl: con un 10 % secuencial, pasar de doce a sesenta y
cuatro hilos gana un 54 % y el límite está en diez, por muchos núcleos que se
compren.

## Comprobar que hubo paralelismo

El barrido de uno a doce hilos sobre un binario compilado *sin* `-fopenmp` da
doce tiempos iguales, alrededor de 1 290 ms. Eso no marca el límite de la
máquina: marca que falta la bandera.

El valor de pi coincide hasta el décimo decimal entre corridas, pero los últimos
bits cambian. La suma en punto flotante no es asociativa, y repartirla entre
hilos cambia el orden en que se acumula:

```text
secuencial = 16.695311365857272
paralela   = 16.695311365859137
diferencia = 1.87e-12
```

Con `-ffast-math` el compilador se autoriza a reordenar también la versión
secuencial. En un cálculo que se compara contra un valor de referencia, esa
bandera no va.

## Mirar los hilos por dentro

Con el programa corriendo, `Ctrl+C` lo detiene y el depurador muestra el equipo
completo:

```bash
g++ -std=c++17 -fopenmp -g -O0 -Wall -Wextra escalado.cpp -o escalado
OMP_NUM_THREADS=4 gdb ./escalado
```

```text
(gdb) info threads
  Id   Target Id                        Frame
* 1    Thread ... (LWP 9828) "escalado" _Z8integrarv._omp_fn.0 () at escalado.cpp:14
  2    Thread ... (LWP 9831) "escalado" _Z8integrarv._omp_fn.0 () at escalado.cpp:14
  3    Thread ... (LWP 9832) "escalado" _Z8integrarv._omp_fn.0 () at escalado.cpp:14
  4    Thread ... (LWP 9833) "escalado" _Z8integrarv._omp_fn.0 () at escalado.cpp:14
(gdb) thread 3
(gdb) print i
$1 = 500000000
(gdb) print suma
$2 = 0
```

Tres cosas se leen ahí. La función se llama `_omp_fn.0` porque el compilador
extrae el cuerpo del ciclo paralelo a una función aparte, y es esa la que
ejecutan los hilos. El `i` del tercer hilo vale 500 millones: con mil millones
de iteraciones repartidas en cuatro tramos de 250 millones, a ese le tocó el
tercero, que arranca en la mitad del recorrido. Y `suma` vale 0 porque cada hilo
tiene su copia privada de la reducción: el total existe al cerrar la región, no
antes.

El `-g` es el que deja los símbolos y el `-O0` el que impide que el optimizador
borre las variables; con `-O2`, `print suma` responde que el valor fue
optimizado.

Para las carreras que no se manifiestan en cada corrida está ThreadSanitizer,
que instrumenta cada acceso a memoria y señala archivo, línea y hilo de las dos
operaciones en conflicto:

```bash
g++ -std=c++17 -fopenmp -fsanitize=thread -g -O1 -Wall -Wextra carrera.cpp -o carrera
OMP_NUM_THREADS=4 ./carrera
```

```text
WARNING: ThreadSanitizer: data race (pid=22434)
  Write of size 8 at 0x7ffea2fdd5a0 by thread T2:
    #0 main._omp_fn.0 carrera.cpp:9
  Previous read of size 8 at 0x7ffea2fdd5a0 by main thread:
    #0 main._omp_fn.0 carrera.cpp:7
SUMMARY: ThreadSanitizer: data race carrera.cpp:9 in main._omp_fn.0
```

El programa corre entre cinco y quince veces más lento, así que se usa sobre
entradas pequeñas.

Los contadores del procesador cuentan la otra mitad de la historia. Sobre la
integral, con un hilo y con doce:

| Contador | 1 hilo | 12 hilos |
|---|---:|---:|
| Tiempo transcurrido | 3,803 s | 0,850 s |
| CPU consumida (`task-clock`) | 3 802 ms | 7 078 ms |
| Instrucciones | 36,00 × 10⁹ | 36,09 × 10⁹ |
| Ciclos | 15,06 × 10⁹ | 25,71 × 10⁹ |
| Instrucciones por ciclo | 2,39 | 1,40 |

Las instrucciones son casi las mismas; los ciclos suben un 71 %. Cada
instrucción tarda más porque dos hilos comparten las unidades del núcleo. El
usuario ve bajar el tiempo de 3,8 a 0,85 segundos; la máquina paga casi el doble
de CPU. En un servidor con varios programas encima, esa segunda cifra es la que
decide.

El perfilado con `perf` se trabaja completo en la sesión de herramientas de
profiling en Linux.

## Los apuntes del tablero

La hoja de la sesión, tal como quedó: los dos recorridos de la matriz con la
cuenta de la línea de caché, el producto punto con la reducción marcada, la
lista de directivas en el orden en que fueron saliendo y las banderas de aviso
que se agregaron a la orden de compilación.

![](attachments/2026-10-06-Note-16-10.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Lo que quedó pendiente

Los ejercicios prácticos de OpenMP quedaron para la casa: reparto, `schedule`,
histograma, carrera de datos y `sections`. Están en el Campus Virtual, traen
`Makefile` y se compilan con `make`.

Las [actividades del navegador](./Ejercicios.md) siguen el orden de la sesión.
En clase se alcanzaron las primeras: el orden del recorrido, cuántos hilos
arrancan, la suma que se pierde y qué entra y qué sale de la región. Las que
siguen —el reparto de iteraciones, las tres escrituras de la misma reducción, el
mismo ciclo en tres bibliotecas, el codo de la curva y cómo comprobar que hubo
paralelismo— conviene hacerlas antes de la práctica.

El [código de la sesión](./codigo/README.md) está completo, con las órdenes de
compilación y lo que imprime cada programa.

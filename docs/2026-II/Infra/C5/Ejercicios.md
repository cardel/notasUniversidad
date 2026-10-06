# Ejercicios

Clase 5 — OpenMP en C++ (6 y 8 de octubre). Los apartados van en el orden de la
clase y todos se resuelven en el navegador. Cada uno parte de una medición de
la sesión y la deja mover: antes de ver un número hay que escribirlo, y cada
respuesta equivocada dice por qué no.

## Repaso: memoria caché y paralelismo

### [El orden del recorrido](widgets/recorrido.html){ target=_blank rel=noopener }

Dos ciclos llenan la misma matriz de 10.000 × 10.000. Lo único distinto es
cuál índice recorre el ciclo interno, ninguno usa hilos, y entre los dos hay dos
minutos de diferencia. Escriba cuántos accesos aprovecha cada línea de caché,
recorra los primeros diecisiete y destape el factor. Cierra con cuatro hilos
que escriben en enteros vecinos y terminan más lentos que la versión
secuencial.

## ¿Qué es OpenMP?

### [Cuántos hilos arranca de verdad](widgets/hilos.html){ target=_blank rel=noopener }

¿Doce hilos o cuatro? Depende de tres formas de pedirlo, y una manda sobre
las otras dos.
Prediga qué responde `omp_get_num_threads()` fuera de una región, combine la
variable de ambiente, la función y la cláusula para ver cuál gana, y mire por qué
`nproc` dice doce donde hay seis núcleos.

## Directivas principales

### [La suma que se pierde](widgets/proteger.html){ target=_blank rel=noopener }

Dos hilos suman 5 y 7 sobre la misma variable y el resultado queda en 7.
Recorra la traza instante por instante con tres intercalados distintos y
después decida entre `critical`, `atomic` y `reduction` para un ciclo que
acumula: las tres dan el resultado correcto, y una serializa el bloque, otra
sincroniza en cada vuelta y la tercera combina una sola vez al final.

### [Qué entra y qué sale de la región](widgets/variables.html){ target=_blank rel=noopener }

Una variable vale 10 antes del `parallel`. Con `private` cada hilo recibe una
copia sin inicializar, y ahí está el error que más se repite: esa copia no
hereda el 10. Con `firstprivate` sí lo hereda, y con `shared` todos escriben la
misma variable. Las tres, lado a lado, y cuatro situaciones para decidir cuál
pide cada caso.

### [Cómo se reparten las iteraciones](widgets/reparto.html){ target=_blank rel=noopener }

Doce iteraciones, tres hilos y cuatro maneras de repartirlas: `static`,
`static` por turnos, `dynamic` y `guided`, primero con carga pareja y después
con carga creciente. Prediga qué iteración
le toca de primera al tercer hilo y después compare las cuatro políticas con
los tiempos medidos. Al final, los 144 hilos que pediría una región anidada y
qué hace `collapse` en su lugar.

## Ejemplo completo: reducción

### [Tres escrituras de la misma reducción](widgets/reduccion.html){ target=_blank rel=noopener }

Las tres compilan. Una da el resultado correcto en 31 ms y otra lo multiplica
por el número de hilos; la tercera también acierta el número, pero corre
secuencial y solo el reloj lo delata. Prediga qué imprime la del medio y vea qué
delata a cada error, incluida la versión de la matriz que recorre por columnas.

## Comparación: std::thread, TBB y OpenMP

### [El mismo ciclo, tres bibliotecas](widgets/enfoques.html){ target=_blank rel=noopener }

Catorce líneas, doce y tres para el mismo problema. Con un millón de enteros,
la versión de `std::thread` tarda más que la secuencial: escriba cuánto antes de
verlo. Después, mil repeticiones del mismo ciclo muestran de
dónde sale esa diferencia, y tres situaciones piden escoger biblioteca.

## Depurar y verificar

### [Depurar un programa de OpenMP](widgets/depurar.html){ target=_blank rel=noopener }

Una sesión de `gdb` sobre la integral de pi con cuatro hilos y un reporte de
ThreadSanitizer sobre una suma sin `reduction`. Prediga el valor de `i` en
cada hilo detenido, por qué `print suma` responde 0 y qué pasa con `-O2`, y
después lea el reporte para decir qué dos accesos chocan y qué cláusula los
separa.

## Buenas prácticas y optimización

### [El codo de la curva](widgets/escalado.html){ target=_blank rel=noopener }

La integral de pi con mil millones de rectángulos, medida de uno a doce hilos.
Prediga con cuántos hilos se alcanza el mejor tiempo, que no es con doce.
Después destape la aceleración y la eficiencia, y mire lo que estima Karp-Flatt:
pasados los seis núcleos físicos, media máquina cobra sin producir. La última
carta trae la ley de Amdahl con dos perillas.

### [Comprobar que de verdad hubo paralelismo](widgets/comprobar.html){ target=_blank rel=noopener }

El mismo binario con uno y con doce hilos da el mismo tiempo. Escriba la
relación entre los dos, descubra qué faltó al compilar, y lea `perf stat` para
saber cuántos núcleos ocupó una corrida: el reloj bajó cuatro veces y el tiempo
de CPU casi se duplicó.

## Ejercicio práctico

El ejercicio de esta semana, con sus verificaciones en GitHub Actions, es
[infra-openmp-secuencial-y-paralelo](https://github.com/EjerciciosClasesCardel/infra-openmp-secuencial-y-paralelo){ target=_blank rel=noopener }:
el producto de Hadamard con `reduction`, `schedule` sobre tareas desiguales, el
histograma con `atomic`, `critical` y reducción de arreglo, y `sections` frente
a una sola pasada.

# Ejercicios interactivos

Nueve ejercicios para recorrer en el navegador, tres por cada tema de la
sesión y en su mismo orden. La mecánica es la de siempre: prediga antes de
ejecutar, avance paso a paso y busque qué se conserva mientras todo lo demás
cambia.

Lo que se conserva en esta sesión es **el valor**: las tres versiones del
factorial dan lo mismo. Lo que cambia es el proceso que generan, y ese proceso
se mide con dos números que se confunden todo el tiempo, cuántas vueltas da y
cuánto deja esperando. Los nueve ejercicios son maneras de separar esos dos
números.

## Funciones frente a procesos

### [contar](widgets/contar.html){ target=_blank rel=noopener }

`factorial(n)` con la pila dibujada: una caja por multiplicación que espera.
La predicción pide cuántas multiplicaciones hará; la respuesta es `n`, y el
contador del `else` la confirma en la bajada. Lo que hay que mirar es el paso
en que la pila llega a su punto más alto, porque ahí también hay `n` cajas: en
esta función tiempo y espacio coinciden, y por eso es fácil confundirlos.

### [reducir](widgets/reducir.html){ target=_blank rel=noopener }

El modelo de sustitución sobre una función recursiva, un reemplazo por vuelta
con el trozo que cambia resaltado. La expresión crece mientras baja y encoge
mientras sube, y la subida siempre resuelve la operación más interna, que es
la única con dos valores. Compare `factorial(3)` con `factorialAlFinal(3)`: el
`*` está en lados distintos y el proceso es el mismo. `sumaLineal(2, 5)` deja
además ver los `pred` reduciéndose antes de entrar, por valor.

### [agotar](widgets/agotar.html){ target=_blank rel=noopener }

Cuatro llamadas con `n = 100000`, y una sola pregunta para cada una: ¿qué se
acaba, el tiempo, el espacio o nada? Dos revientan la pila, una gira sin fin y
una termina. Lo que las separa no es cuántas vueltas dan sino qué dejan
esperando alrededor de la llamada. Los cuatro resultados son de correr el
código; el que termina devuelve `0` por desborde del `Int`, que es otro
problema.

## Recursión lineal e iteración

### [pendientes](widgets/pendientes.html){ target=_blank rel=noopener }

`factorial` y `fact` corriendo lado a lado sobre la misma entrada, cada una
con su pila de marcos dibujada debajo. A la izquierda cada llamada apila un
marco nuevo y ninguno se cierra hasta que el de abajo devuelve: en el punto
más hondo hay `n + 1` abiertos al tiempo. A la derecha la caja es una sola y
cambia de contenido, porque cada llamada reemplaza a la anterior. El tercer
preset hace lo mismo con `sumaLineal` y `sumaIter`, que es el ejercicio de la
sesión.

### [acumulador](widgets/acumulador.html){ target=_blank rel=noopener }

La traza de `factIter` como tabla, una fila por llamada. Se llena la columna
`prod` de memoria y después se ve la ejecución llenarla. La regla que hay que
descubrir es que el `prod` de una fila es `cont × prod` de la fila de arriba:
el resultado se arma antes de llamar y viaja como argumento, y por eso al
volver no queda nada por hacer.

### [cola](widgets/cola.html){ target=_blank rel=noopener }

Cinco versiones de `factIter`. Las cinco dan `720` para `n = 6`; para
`n = 100000` solo dos terminan. Hay que marcar cuáles siguen siendo de cola.
Tres la rompen sin que se note —sumar y restar lo mismo, multiplicar después
de volver, envolver la llamada en `math.max`— y una parece romperla y no: un
`val` calculado antes de llamar. Es el ejercicio más exigente de la sesión.

## Recursión de árbol

### [árbol](widgets/arbol.html){ target=_blank rel=noopener }

`producto(i, j)` parte el rango por la mitad y el proceso deja de ser una fila.
Cada llamada da dos pasos, uno al entrar y otro al salir, y al lado del árbol
va la pila con los marcos abiertos en ese instante. Hay dos predicciones y
dan números distintos: las llamadas en total, `2n − 1`, y los marcos abiertos
al mismo tiempo como máximo, que son los niveles del árbol. Lo que hay que
mirar es la pila bajando a uno cuando termina la rama izquierda, antes de
subir por la derecha: siete llamadas y nunca más de tres abiertas.

### [cuentas](widgets/cuentas.html){ target=_blank rel=noopener }

La tabla que cierra la sesión, vacía: para un `n` dado, llamadas y hondura de
`factorial`, `fact` y `factArbol`. Seis casillas que se llenan de memoria y se
comprueban contra la simulación. Las tres son funciones recursivas y solo una
genera un proceso iterativo.

### [caso base](widgets/casobase.html){ target=_blank rel=noopener }

Cuatro versiones de `producto` que difieren solo en los casos base. Una es la
de la sesión; de las otras tres, una no termina, una termina con el valor
equivocado, y una da `24` para `producto(1, 5)` igual que la correcta y aun así
está mal. Esa última se delata en `producto(3, 3)`, un caso que el programa
grande no visita nunca.

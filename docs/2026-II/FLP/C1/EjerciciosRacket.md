# Ejercicios de Racket

El lenguaje del curso, practicado antes de que aparezca el primer intérprete.
El repaso de Racket es material de lectura, y estas tres actividades son la
parte que no se aprende leyendo: escribir procedimientos, correrlos y ver qué
responden. Todo pasa en el navegador, sin instalar nada.

Son cinco actividades y veintiocho procedimientos por escribir. Se pueden hacer
en cualquier momento y conviene tenerlas resueltas antes de la sesión sobre
[inducción y recursión](./Ejercicios.md){ target=_blank rel=noopener }, que
supone resuelto lo que aquí se practica.

## [notación prefija y definiciones](widgets/prefija.html){ target=_blank rel=noopener }

Cinco procedimientos sin recursión, para que la mano se acostumbre a que el
operador vaya adelante. El promedio de tres números obliga a decidir qué
operación queda en el paréntesis de afuera; la conversión de grados encadena
tres. Después aparecen `and` para juntar dos comparaciones, `cond` para tres
casos que se excluyen y `let*` para nombrar los resultados intermedios de una
cuenta que reparte segundos en horas y minutos.

En el camino salen dos convenciones de nombres que el curso usa todo el
semestre: el signo de interrogación al final de lo que devuelve un booleano y
la flecha en medio de lo que convierte. Y sale la comilla, que es lo que
separa un símbolo del nombre de una variable.

## [condicionales: if y cond](widgets/condicionales.html){ target=_blank rel=noopener }

Cinco decisiones. Las dos primeras son el mismo problema, el mayor de tres
números, escrito con `if` anidado y después con `cond`, que es la forma de ver
qué aplana el segundo y qué cuesta el primero.

Las otras tres son los casos donde una de las dos formas es la que
corresponde: un `if` metido en mitad de una resta, porque produce un valor y
cabe donde vaya un número; una clasificación por rangos donde cada cláusula
hereda lo que descartaron las anteriores; y una pregunta por la forma del
dato, donde la lista vacía también responde que sí a `list?` y el orden
decide si queda bien clasificada.

## [recursión lineal y recursión de cola](widgets/recursion.html){ target=_blank rel=noopener }

Seis procedimientos donde la misma cuenta se escribe de las dos maneras. La
suma hasta `n` primero deja la suma esperando a que la llamada vuelva, y
después lleva el total adelantado en un acumulador. La diferencia no se queda
en el estilo: una de las pruebas suma hasta cincuenta mil y la versión lineal
no la pasa.

Siguen el factorial, que cambia la operación y con ella el valor con que
arranca el acumulador; el largo de una lista, donde lo que se agota ya no es
un número; invertir una lista, que sale volteada sola porque se construye
mientras se baja; y Fibonacci con dos acumuladores, que es lo que convierte un
cálculo impracticable en uno inmediato.

## [ligaduras locales: let, let* y letrec](widgets/ligaduras.html){ target=_blank rel=noopener }

Seis procedimientos con nombres que solo viven dentro de una expresión. Las
tres formas se escriben casi igual y se diferencian en una sola cosa: en qué
ambiente se evalúan las expresiones que calculan los valores.

Empieza por el caso que solo `let` resuelve, correr tres valores una posición
sin perder ninguno, porque las tres derechas miran los valores originales.
Sigue con la cadena que obliga a `let*`, donde el promedio necesita la
cantidad y la suma ya calculadas, y con dos `let` anidados, que es lo que
`let*` hace por debajo.

Los tres últimos son de `letrec`. Uno pide escoger la palabra que permite que
un procedimiento local se llame a sí mismo; otro esconde un acumulador para
que no aparezca en la interfaz; el último define dos procedimientos que se
nombran mutuamente. Esa forma es la que reaparece al implementar `letrec` en
el intérprete del curso.

## [listas simbólicas y procedimientos como valores](widgets/simbolicas.html){ target=_blank rel=noopener }

Seis procedimientos sobre listas de símbolos. Buscar uno, quedarse con los que
son símbolos, quitar los repetidos usando el procedimiento de búsqueda ya
escrito, y aplanar una lista anidada, que necesita recursión sobre el primer
elemento y sobre el resto al mismo tiempo.

Los dos últimos reciben otro procedimiento como argumento y con eso quedan
escritos `mapea` y `filtra`, que no vienen con el evaluador de la página. Pasar
un procedimiento como un dato cualquiera es lo que más adelante permite guardar
una clausura en un ambiente.

## Cómo funciona cada actividad

Se llena el esqueleto donde dice `???`, se presiona **Probar** y las pruebas
dicen qué pasó. Cuando una falla, el mensaje dice qué llamada se cayó, qué dio
y qué debía dar, y los tropiezos más frecuentes traen además su explicación.
Al final de cada página hay una consola libre para tantear cualquier otra cosa.

El evaluador de la página entiende `define`, `lambda`, `if`, `cond`, `let`,
`let*`, `letrec`, `and`, `or` y las primitivas de listas y aritmética,
incluidas todas las combinaciones de `car` y `cdr` hasta cuatro niveles, de
`caar` a `cddddr`. No tiene `define-datatype` ni `cases`, ni `map`, ni
`filter`: por eso dos de los retos consisten en escribirlos. Lo que se entrega en el curso se escribe y se corre
en DrRacket.

# Ejercicios interactivos

Clase 2 — estrategias para representar datos: TAD y ambientes (15 de
septiembre). Cada enlace abre una actividad que se trabaja directo en el
navegador, sin instalar nada. Los ejemplos no son los de la sesión: mismo
tema, ronda nueva.

Van en el orden en que la sesión ve los temas, dos por tema: una de analizar
y una de escribir código. En las de analizar cada respuesta muestra su razón,
se acierte o no; en las de código, las pruebas dicen qué pasó y los tropiezos
frecuentes traen su explicación.

## El cliente conoce la representación

### [¿Sobrevive el cliente?](widgets/cliente.html){ target=_blank rel=noopener }

Quince fragmentos de código que usan un TAD, el natural y el ambiente, y una
sola pregunta por fragmento: si la representación cambia, ¿sigue funcionando?
La respuesta no depende de qué hace el cliente sino de por dónde toca el dato.
Hay uno que pasa con las tres representaciones de la sesión y aun así se
rompe, porque apuesta a una propiedad que la especificación nunca prometió.

### [Arreglar el cliente](widgets/arreglar.html){ target=_blank rel=noopener }

Cuatro clientes que metían la mano en la representación —`es-uno?` comparaba
contra `(#t)`, `doble` multiplicaba, `mayor?` medía longitudes—, para
reescribirlos con la interfaz. La representación del esqueleto es la anidada,
que ninguno de los cuatro suponía: la versión vieja no pasa las pruebas y la
nueva sí. Al cierre, `natural->numero`, que es cómo un cliente cuenta sin
mirar.

## Abstracción de datos

### [El cliente una sola vez](widgets/cola.html){ target=_blank rel=noopener }

Un TAD cola con cinco operaciones y tres clientes que solo pueden usarlas:
contar los elementos, listarlos del frente al final y encontrar el último.
Después la misma cola en otra representación, con dos listas, y los tres
clientes se pegan tal cual. Con la primera representación devolver el dato
pasa las pruebas; con la segunda ya no, y ahí queda claro quién había hecho
trampa.

### [¿Cumple el contrato?](widgets/contrato.html){ target=_blank rel=noopener }

Un TAD conjunto especificado con cinco ecuaciones y candidatas para
implementar cada operación, primero con listas y después con procedimientos.
Tres `insert` distintos cumplen y son tres representaciones legítimas; un
`remove` que quita solo la primera aparición cumple con un `insert` y no con
otro, y ahí está el punto: las operaciones se prueban juntas, porque el
contrato habla de cómo se comportan entre sí.

## Tres representaciones del mismo TAD

### [¿Cuánto vale este dato?](widgets/valor.html){ target=_blank rel=noopener }

Un mismo valor de Racket leído bajo cinco representaciones del natural, tres
de la sesión y dos que no aparecen en ella. Primero cuánto vale `(1 2)` en
cada una; después si se puede saber sin conocer la representación, y qué pasa
con un dato que la definición nunca produce; por último el acarreo y el
préstamo, que son lo que mantiene a `succ` y `pred` dentro del contrato.

### [Bignum en base 10](widgets/bignum.html){ target=_blank rel=noopener }

La representación bignum con el dígito menos significativo adelante. `succ`
con acarreo, `pred` con préstamo y con el cuidado de no dejar un cero al
final, las dos conversiones con los números de Racket, y al cierre un
`multiplica` que solo usa `suma`, `is-zero?` y `pred`: produce `(4 4 1)` sin
un solo `car`, porque todo el trabajo con dígitos lo hizo `succ`.

## El TAD ambiente: la interfaz

### [Predecir apply-env](widgets/ambiente.html){ target=_blank rel=noopener }

Una cadena de cuatro ligaduras, dos del mismo nombre, y preguntas sobre qué
devuelve la búsqueda: qué gana cuando un nombre está dos veces, qué pasa al
quitar el eslabón de afuera, y por qué extender no modifica el ambiente que
ya existía. El segundo bloque pide escribir la misma cadena con `let` anidados,
que es lo que un ambiente representa.

### [Clientes del ambiente](widgets/env-clientes.html){ target=_blank rel=noopener }

La representación con listas y su interfaz vienen dadas, con un ambiente
donde `m` está ligada tres veces. Cinco procedimientos que recorren la cadena
solo por la interfaz: `ligada?` responde sin fallar, `nombres` lista los
eslabones con sus repeticiones, `cuantas-veces` cuenta, `valores-de` saca las
ligaduras que `apply-env` oculta, y `env->lista` construye la vista completa
sin saber que por dentro ya era una lista.

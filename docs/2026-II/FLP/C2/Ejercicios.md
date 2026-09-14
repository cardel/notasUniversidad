# Ejercicios interactivos

Clase 2 — estrategias para representar datos: TAD y ambientes (15 de
septiembre). Cada enlace abre una actividad que se trabaja directo en el
navegador, sin instalar nada. Los ejemplos no son los de la sesión: mismo
tema, ronda nueva.

Van en el orden en que la sesión ve los temas. Tres son de analizar y una de
escribir código; en las de analizar cada respuesta muestra su razón, se
acierte o no.

## El cliente conoce la representación

### [¿Sobrevive el cliente?](widgets/cliente.html){ target=_blank rel=noopener }

Quince fragmentos de código que usan un TAD, el natural y el ambiente, y una
sola pregunta por fragmento: si la representación cambia, ¿sigue funcionando?
La respuesta no depende de qué hace el cliente sino de por dónde toca el dato.
Hay uno que pasa con las tres representaciones de la sesión y aun así se
rompe, porque apuesta a una propiedad que la especificación nunca prometió.

## Abstracción de datos

### [El cliente una sola vez](widgets/cola.html){ target=_blank rel=noopener }

Un TAD cola con cinco operaciones y tres clientes que solo pueden usarlas:
contar los elementos, listarlos del frente al final y encontrar el último.
Después la misma cola en otra representación, con dos listas, y los tres
clientes se pegan tal cual. Con la primera representación devolver el dato
pasa las pruebas; con la segunda ya no, y ahí queda claro quién había hecho
trampa.

## Tres representaciones del mismo TAD

### [¿Cuánto vale este dato?](widgets/valor.html){ target=_blank rel=noopener }

Un mismo valor de Racket leído bajo cinco representaciones del natural, tres
de la sesión y dos que no aparecen en ella. Primero cuánto vale `(1 2)` en
cada una; después si se puede saber sin conocer la representación, y qué pasa
con un dato que la definición nunca produce; por último el acarreo y el
préstamo, que son lo que mantiene a `succ` y `pred` dentro del contrato.

## El TAD ambiente: la interfaz

### [Predecir apply-env](widgets/ambiente.html){ target=_blank rel=noopener }

Una cadena de cuatro ligaduras, dos del mismo nombre, y preguntas sobre qué
devuelve la búsqueda: qué gana cuando un nombre está dos veces, qué pasa al
quitar el eslabón de afuera, y por qué extender no modifica el ambiente que
ya existía. El segundo bloque pide escribir la misma cadena con `let` anidados,
que es lo que un ambiente representa.

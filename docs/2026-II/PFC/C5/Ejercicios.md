# Ejercicios · PFC C5

Diez ejercicios para recorrer en el navegador, organizados por los temas de la
sesión y en su mismo orden. Como en las sesiones anteriores, ninguno muestra
nada antes de que usted produzca algo: hay tablas que se llenan de memoria,
reducciones en las que se elige el paso siguiente y salidas desde las que hay
que deducir qué código las produjo. Los valores contra los que se comprueba
todo salieron de correr el código de la sesión.

Lo que se conserva aquí es **la forma del dato**: `ConjEnt` y `Expr` están
definidos por sus alternativas, y toda función que los recorra tiene un caso
por cada una. Lo que cambia es dónde se escribe esa función: dentro de la
clase, como método que cada subclase implementa, o fuera, con un `match` que
descompone el valor.

## Herencia y clases abstractas

### [despacho](./widgets/despacho.html){ target=_blank rel=noopener }

`pertenece` está declarado en la clase abstracta y escrito dos veces, una en
`Vacio` y otra en `NoVacio`. La tabla pide, por cada nodo que visita la
búsqueda, cuál de las dos corre. No se decide al escribir el código sino al
ejecutarlo, según el objeto que recibe la llamada, y la búsqueda de algo que
no está termina siempre en la misma: la de `Vacio`.

### [compartir](./widgets/compartir.html){ target=_blank rel=noopener }

`insertar` no modifica el árbol: devuelve otro. La predicción es cuántos nodos
se construyen de verdad y cuántos quedan compartidos con el original. Se
reconstruye el camino de la raíz al sitio nuevo y nada más, que es lo que
hace barato tener los dos árboles a la vez.

## Traits

### [mezclar](./widgets/mezclar.html){ target=_blank rel=noopener }

Cinco declaraciones de clase sobre `Plano` y `Movible`: cuáles compilan y
cuáles no. Un trait puede traer miembros sin implementar, que la clase debe
completar, y miembros ya escritos, que la clase hereda. La diferencia entre
redefinir con `override` y sin él la decide el compilador, y su mensaje está
copiado tal cual en la retroalimentación.

## Sealed y case classes

### [mismoConjunto](./widgets/mismoConjunto.html){ target=_blank rel=noopener }

El mismo conjunto escrito con `class` y con `case class`, lado a lado, y
cuatro líneas que predecir en cada versión. Dos salidas cambian y son las que
importan: qué imprime el objeto y qué contesta `==` entre dos conjuntos
construidos igual.

### [exhaustividad](./widgets/exhaustividad.html){ target=_blank rel=noopener }

Un `match` al que le falta un caso, con la jerarquía `sealed` y sin ella.
Cuatro combinaciones entre lo que dice el compilador y lo que pasa al
ejecutar. `sealed` es lo que le permite al compilador saber cuántas formas
tiene el tipo, y con eso avisar antes en vez de fallar después.

## Reconocimiento de patrones

### [orden](./widgets/orden.html){ target=_blank rel=noopener }

Seis entradas para `describir`, con tres trampas: el cero, un decimal y la
lista vacía. Después se intercambian dos casos de sitio y hay que decir qué
cambia. Los patrones se prueban de arriba abajo y gana el primero que casa,
así que uno general escrito antes tapa a uno específico.

### [recorrido](./widgets/recorrido.html){ target=_blank rel=noopener }

`listaEnteros` sobre el árbol de siete nodos de la sesión: llenar el orden en
que cada nodo aporta su elemento y predecir la lista antes de verla. El orden
del resultado sale del orden en que se escriben las tres partes del caso
`NoVacio`.

## Expresiones aritméticas

### [evaluar](./widgets/evaluar.html){ target=_blank rel=noopener }

La reducción de `eval` sobre una expresión de tres niveles, eligiendo en cada
paso entre tres expresiones. Los distractores son los errores que se cometen
de verdad: resolver la rama derecha antes que la izquierda, o aplicar al caso
la operación del vecino.

### [mismoTexto](./widgets/mismoTexto.html){ target=_blank rel=noopener }

El más exigente de la sesión. Dos árboles distintos que `mostrar` imprime
exactamente igual, `1 + 2 * 3`, y que valen 9 y 7. Hay que descubrir cuál da
cuál, y después ver que `mostrarConParentesis` sí los separa. Un texto sin
paréntesis no alcanza para recuperar el árbol: la precedencia que el lector
supone no está escrita en ninguna parte.

### [simplificar](./widgets/simplificar.html){ target=_blank rel=noopener }

El ejercicio de cierre de la sesión, como tabla que se llena de las hojas
hacia la raíz. La pregunta final es por qué una sola pasada de las reglas no
deja la expresión simplificada del todo.

# Ejercicios interactivos

Clase 9 — paso de parámetros por referencia y repaso de POO (4 de
septiembre). Cada enlace abre una actividad que se trabaja directo en el
navegador, con los dibujos de memoria de la clase al frente.

## [trazas](widgets/trazas.html){ target=_blank rel=noopener }

El mismo programa tres veces, y solo cambia la firma de la función:
`int a`, `int *a`, `int &a`. En cada versión se predice la línea final,
con un puntero del llamador metido en la historia para separar lo que
hizo la función de lo que hizo `main`.

Cada distractor tiene su explicación: confundir la copia con la celda
original, olvidar quién escribe el valor retornado o correr el aumento
antes de tiempo reciben cada uno su pista. Al acertar las tres versiones
se abre la tabla que las compara.

## [objetos](widgets/objetos.html){ target=_blank rel=noopener }

La clase `Estudiante` de la sesión: el promedio con dos notas, un premio
que viaja por copia y otro por referencia, la puerta que cierra
`private` y el promedio de un objeto sin notas.

Los aciertos destapan lo que la corrida real muestra —incluidos el error
textual del compilador y el `-nan` de la división 0/0— y el cierre deja
planteado el contrato que retoma la abstracción de datos.

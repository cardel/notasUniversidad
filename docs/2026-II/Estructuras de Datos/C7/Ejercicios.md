# Ejercicios interactivos

Clase 7 — manejo de memoria en C (28 de agosto). Cada enlace abre una
actividad que se trabaja directo en el navegador: prediga antes de ejecutar
y recorra el código paso a paso viendo cómo cambia cada variable.

## [punteros](widgets/punteros.html){ target=_blank rel=noopener }

La primera traza con un puntero: dos variables, un p que se muda de una a
otra, y un *p que escribe donde apunte en ese momento. ¿Qué imprime el
programa?

Escriba su predicción de los dos valores finales, ejecute paso a paso con
los chips al frente y confirme con la traza en tabla en qué línea cambió
cada variable. La pregunta de cierre apunta al momento del desvío.

## [dos_punteros](widgets/dos_punteros.html){ target=_blank rel=noopener }

Dos asignaciones que se parecen mucho y hacen cosas distintas: una copia un
valor entre celdas, la otra copia una dirección entre punteros. El ejercicio
de la clase, con a, b, p y q en los chips.

Prediga los valores finales de a y b, siga la ejecución y ubique la línea
exacta en que b quedó fuera del juego.

## [errores](widgets/errores.html){ target=_blank rel=noopener }

Un fragmento que pasa gcc -Wall -Wextra sin una sola queja y aun así rompe
dos de las tres reglas del contrato con el montículo.

Haga clic en la línea donde nace cada error: las líneas inocentes se
defienden y explican por qué lo son. Con los dos encontrados se destapa la
versión corregida.

# Ejercicios interactivos

Clase 9 — paso de parámetros por referencia y repaso de POO (4 de
septiembre). Cada enlace abre una actividad que se trabaja directo en el
navegador. Los programas no son los de la sesión: mismo tema, ronda
nueva.

## [trazas](widgets/trazas.html){ target=_blank rel=noopener }

Una función y su `main`, tres veces; solo cambia la firma del segundo
parámetro: `int b`, `int *b`, `int &b`. En cada versión se predice la
línea final, con un puntero del llamador metido en la historia para que
no todo cambio venga de la función.

Cada distractor tiene su pista: confundir la copia con la celda
original, correr la resta antes de tiempo o perder el valor retornado.
Al acertar las tres versiones se abre la tabla que las compara.

## [objetos](widgets/objetos.html){ target=_blank rel=noopener }

Una clase `Cuenta` cuyas operaciones validan antes de escribir: el saldo
tras una consignación rechazada, un cobro que viaja por copia y otro por
referencia, la puerta que cierra `private` y el retiro que no ocurre.

Los aciertos destapan lo que la corrida real muestra —incluido el error
textual del compilador— y el cierre deja planteada la pregunta que
retoma la abstracción de datos: qué promete cada operación y cómo avisa
cuando no puede cumplir.

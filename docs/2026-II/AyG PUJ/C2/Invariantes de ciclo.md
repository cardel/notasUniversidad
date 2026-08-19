# Invariantes de ciclo

**Grupo B — viernes 21 de agosto de 2026.**

!!! info "Nota en preparación"
    El texto de esta nota se publica después de la clase. Los
    [ejercicios interactivos](#ejercicios-interactivos) ya están
    disponibles y se pueden trabajar desde ya.

## La pregunta de apertura

<!-- ¿Qué calcula computa(2, 3)? Traza a mano, tabla de estados (i, res)
     y la observación que abre la clase: res = a·(i − 1) se conserva en
     todas las filas. -->

## Computación iterativa

<!-- Estados S0 → S1 → … → Sj; el invariante como la condición que todos
     los estados cumplen; el esquema general del ciclo
     (S ← S0; mientras S no sea final: S ← transformar(S)). -->

## Especificación de un algoritmo iterativo

<!-- Los siete elementos: entrada, salida, idea, estados (con el
     invariante), estado inicial, estado final y transformación.
     Ejemplos: factorial y la raíz cuadrada por promedios. Dónde vive
     cada pieza en el código. -->

## Correctitud y el método de los cuatro pasos

<!-- {Q} A {R} (CLRS, sección 2.1, pp. 18–20); los cuatro pasos:
     inicialización, invarianza, éxito y terminación. Nota: CLRS trae
     tres propiedades; el curso separa el éxito de la terminación.
     La demostración se escribe con el molde del curso: teorema,
     demostración, desarrollo y conclusión. -->

## Dos demostraciones completas

<!-- factorial (guiada) y computa, cada una con los cuatro pasos y su
     conclusión explícita. El error productivo: ¿y si n = −1? La
     precondición sostiene el paso de terminación. -->

## Ejercicios

<!-- computa3 (suma de cubos), opera (suma de potencias) y burbuja
     (invariantes de los dos ciclos), con pistas. -->

## Ejercicios interactivos

Dos ejercicios en el navegador siguen el camino completo de la clase: ver
el patrón en la traza, nombrarlo como invariante y armar la demostración
paso a paso. Están en la [página de ejercicios
interactivos](Ejercicios.md#invariantes-de-ciclo):

- [computa](widgets/computa.html){ target=_blank rel=noopener } — descubra
  qué calcula el ciclo, encuentre la relación que ninguna vuelta rompe y
  complete los cuatro pasos respondiendo una pregunta por paso.
- [factorial](widgets/factorial.html){ target=_blank rel=noopener } — el
  mismo recorrido con menos ayuda, y un experimento final: romper la
  precondición con `factorial(-1)` y ver por qué el ciclo no termina.

## Referencias

<!-- CLRS, sección 2.1, pp. 18–20; C. Rocha, Diseño y Análisis de
     Algoritmos. -->

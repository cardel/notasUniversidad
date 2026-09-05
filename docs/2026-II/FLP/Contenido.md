# Fundamentos de Interpretación y Compilación de Lenguajes de Programación

Universidad del Valle, sede Tuluá · Escuela de Ingeniería de Sistemas y
Computación · Agosto – Diciembre de 2026

Este sitio guarda **lo que se hizo en clase**: notas, intérpretes y ejemplos
trabajados. El cronograma, el material de lectura previa, los quices, las
entregas y las notas están en el Campus Virtual.

## Horario

| Grupo | Día | Hora | Salón |
|---|---|---|---|
| 50 | Martes | 8:00 a. m. – 12:00 m. | Sede Príncipe, salón 7 |

Cada sesión son cuatro horas: las dos primeras son de exposición y las dos
siguientes se dedican a resolver un ejercicio en Racket, que se entrega
antes de salir.

## Notas de clase

Se publican después de cada sesión.

### Corte 1

*Aún no hay clases publicadas.*

### Corte 2

*Aún no hay clases publicadas.*

## Actividades interactivas

Se trabajan en el navegador, sin instalar nada. Cada sesión deja la suya, y
quedan disponibles después para volver sobre el tema.

1. [Clase 1. Inducción y recursión — 8 de septiembre](C1/Ejercicios.md)
   — decidir qué entra en un conjunto definido por reglas, qué llamada
   recursiva autoriza la gramática, y escribir cuatro procedimientos que
   corren en la misma página.

## Ejercicios de clase

Cada sesión tiene su repositorio. Se resuelve haciendo un fork, y la entrega
es la dirección del fork con el identificador del último commit, que se
reporta en el Campus Virtual antes de terminar la clase.

*Aún no hay ejercicios publicados.*

## Clases en video

Las grabaciones de cada sesión están en la lista de reproducción del curso, en
orden cronológico: la sesión más reciente queda al final y la lista se va
llenando a medida que avanza el semestre. Cada sesión se parte en varios
videos cortos, para volver a un tema puntual sin recorrer la clase entera. El
reproductor de abajo va sobre la lista completa; la barra que lo encabeza la
abre en YouTube, en una pestaña nueva.

<div class="yt-lista">
  <a class="yt-lista__barra" href="https://www.youtube.com/playlist?list=PLRsTnxN7mJNA" target="_blank" rel="noopener">
    <span class="yt-lista__titulo">Lista de reproducción del curso</span>
    <span class="yt-lista__accion">Abrir en YouTube ↗</span>
  </a>
  <iframe
    src="https://www.youtube-nocookie.com/embed/videoseries?list=PLRsTnxN7mJNA"
    title="FLP 2026-II"
    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen>
  </iframe>
</div>

## Reglas del código

Todo el código del curso se escribe en `#lang eopl`. Las representaciones de
sintaxis abstracta y de valores se declaran con `define-datatype`, y el
análisis por casos se hace con `cases`, nunca destructurando a mano con
`car` y `cdr`. Se resuelve con recursión estructural, sin `set!` salvo en
los capítulos donde la asignación es el tema.

Una regla que se aplica a todos los intérpretes del curso: al evaluar un
`if-exp` se calcula el valor de la prueba, se verifica que sea booleano y
solo entonces se escoge la rama. Nunca se delega en el `if` de Racket sobre
el resultado de `value-of`.

## Referencias

- Friedman y Wand. *Essentials of Programming Languages*, 3.ª edición. MIT
  Press, 2008.
- Sebesta. *Concepts of Programming Languages*. Pearson.
- Pierce. *Types and Programming Languages*. MIT Press, 2002.
- The Racket Reference y The Racket Guide.

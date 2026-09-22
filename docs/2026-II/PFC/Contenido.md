# Fundamentos de Programación Funcional y Concurrente

Universidad del Valle, sede Tuluá · Escuela de Ingeniería de Sistemas y
Computación · Agosto – Diciembre de 2026

Este sitio guarda **lo que se hizo en clase**: notas, ejemplos trabajados y
código. El cronograma, el material de lectura previa, las entregas y las
notas están en el Campus Virtual. Los dos grupos ven la misma clase, así que
estas notas son comunes a ambos.

## Horario

| Grupo | Día | Hora |
|---|---|---|
| 50 | Jueves | 7:00 a. m. – 10:00 a. m. |
| 51 | Jueves | 2:00 p. m. – 5:00 p. m. |

Cada sesión son tres horas: la primera hora y media es de exposición y el
resto se dedica a resolver un ejercicio en clase, que se entrega antes de
salir.

## Notas de clase

Se publican después de cada sesión.

### Corte 1

1. [Clase 1. Principios y elementos de programación funcional — 10 de septiembre](C1/Clase%201.%20Principios%20y%20elementos%20de%20programaci%C3%B3n%20funcional.md)
   — paradigmas y el esquema de von Neumann, las funciones como valores, el
   modelo de sustitución, composición con `andThen` y `compose`, cinco formas
   de definir una función, evaluación por valor frente a por nombre, `val`
   frente a `def`, el `if` como expresión, cortocircuito de `&&`, y bloques y
   alcance léxico. Incluye el código escrito en clase.
2. [Clase 2. Funciones y los procesos que generan — 17 de septiembre](C2/Clase%202.%20Funciones%20y%20los%20procesos%20que%20generan.md)
   — función frente a proceso, la pila de llamadas y el `StackOverflowError`,
   recursión lineal, recursión de cola con acumulador y `@tailrec`, recursión
   de árbol con Fibonacci y con el producto por mitades, y las condiciones de
   entrega del Taller 1. Incluye el código escrito en clase.

### Corte 2

*Aún no hay clases publicadas.*

## Clases en video

Las grabaciones de cada sesión están en la lista de reproducción del curso,
en orden cronológico: la sesión más reciente queda al final y la lista se va
llenando a medida que avanza el semestre. Es una sola lista para los dos
grupos, y cada sesión se parte en varios videos cortos, para volver a un
tema puntual sin recorrer la clase entera. El reproductor de abajo va sobre
la lista completa; la barra que lo encabeza la abre en YouTube, en una
pestaña nueva.

<div class="yt-lista">
  <a class="yt-lista__barra" href="https://www.youtube.com/playlist?list=PLZ7nhAy0MtkA" target="_blank" rel="noopener">
    <span class="yt-lista__titulo">Lista de reproducción del curso</span>
    <span class="yt-lista__accion">Abrir en YouTube ↗</span>
  </a>
  <iframe
    src="https://www.youtube-nocookie.com/embed/videoseries?list=PLZ7nhAy0MtkA"
    title="Programación funcional y concurrente 2026-II"
    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen>
  </iframe>
</div>

## Ejercicios de apoyo

Ejercicios interactivos para recorrer en el navegador, uno por tema. No se
entregan ni tienen nota: sirven para llegar a clase con la mecánica ya vista
y para volver sobre ella cuando algo no cuadre. Se publican antes de cada
clase.

Las clases se numeran por orden dictado. La primera corresponde a la sesión
03 del campus, porque las dos primeras semanas del semestre fueron jornada de
reuniones docentes y jornada de reflexión.

| Clase | Tema | Ejercicios |
|---:|---|---|
| 1 | Principios y elementos de programación | [sustituir y evaluación](C1/Ejercicios.md) |
| 2 | Funciones y los procesos que generan | [nueve ejercicios, tres por tema](C2/Ejercicios.md) |
| 3 | Funciones de alto orden | [doce ejercicios: tablas, pasos y trazas por revisar](C3/Ejercicios.md) |

## Ejercicios de clase

Cada sesión tiene su repositorio. Se resuelve haciendo un fork, y la entrega
es la dirección del fork con el identificador del último commit, que se
reporta en el Campus Virtual antes de terminar la clase.

| Sesión | Ejercicio |
|---:|---|
| 1 | [Scala, Gradle y pruebas](https://github.com/EjerciciosClasesCardel/pfc-ejercicio-01-introduccion-scala) |
| 2 | [Recursión de cola: sumatorias con acumulador](https://github.com/EjerciciosClasesCardel/pfc-ejercicio-02-recursion-de-cola) |
| 3 | [Currificación: suma4, reducirC y composición](https://github.com/EjerciciosClasesCardel/pfc-ejercicio-04-currificacion) |
| 4 | [Funciones y datos I: clases, invariantes y operadores](https://github.com/EjerciciosClasesCardel/pfc-ejercicio-05-numeros-complejos) |
| 5 | [Funciones y datos II: figuras, patrones y expresiones](https://github.com/EjerciciosClasesCardel/pfc-ejercicio-06-reconocimiento-de-patrones) |
| 6 | [Listas I: if/else, match, inserción, aplanar y corridas](https://github.com/EjerciciosClasesCardel/pfc-ejercicio-07-operaciones-sobre-listas) |
| 6 | [Listas II: tuplas, merge sort y alto orden](https://github.com/EjerciciosClasesCardel/pfc-ejercicio-08-merge-sort) |
| 7 | [Colecciones I: secuencias, flatMap, for y conjuntos](https://github.com/EjerciciosClasesCardel/pfc-ejercicio-09-expresiones-for) |
| 8 | [Colecciones II: índice, frecuencias, flujos y criba](https://github.com/EjerciciosClasesCardel/pfc-ejercicio-10-maps-y-evaluacion-perezosa) |
| 9 | [Principios de concurrencia: intercalaciones, carrera y medida](https://github.com/EjerciciosClasesCardel/pfc-ejercicio-11-condiciones-de-carrera) |
| 10 | [Abstracciones: parallel, umbral, task y Monte Carlo](https://github.com/EjerciciosClasesCardel/pfc-ejercicio-12-parallel-y-task) |
| 11 | [Complejidad: reduce paralelo, Amdahl y ScalaMeter](https://github.com/EjerciciosClasesCardel/pfc-ejercicio-13-benchmark-scalameter) |
| 12 | [Paralelismo de tareas y de datos](https://github.com/EjerciciosClasesCardel/pfc-ejercicio-14-divide-y-venceras-paralelo) |

## Talleres

Se entregan como fork del repositorio del taller, uno por grupo, y la entrega
es la dirección del fork con el hash del último commit, registrada en el
Campus Virtual antes del cierre. El enunciado completo, con la rúbrica, es el
PDF del campus; el repositorio trae el proyecto configurado, las pruebas y los
ejemplos de los informes.

| Taller | Tema | Cierre |
|---:|---|---|
| 1 | [Cifrados clásicos con recursión](https://github.com/EjerciciosClasesCardel/pfc-taller-1-cifrados-clasicos) | jueves 8 de octubre, 23:59 |

## Reglas del código

Todo el código del curso se escribe en estilo funcional: sin `var`, sin
`while`, sin `return` y sin estado que cambie. Se resuelve con `val`,
recursión, composición de funciones y funciones de alto orden.

## Referencias

- Odersky, Spoon y Venners. *Programming in Scala*, 3.ª edición. Artima, 2016.
- Abelson y Sussman. *Structure and Interpretation of Computer Programs*.

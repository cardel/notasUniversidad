# Proyecto del curso

En grupos de **hasta tres estudiantes**. Vale el 30 % del curso: el
avance 10 y la entrega final con sustentación 20.

| Entrega | Cierre |
|---|---|
| Avance | viernes 30 de octubre de 2026 |
| Final | lunes 16 de noviembre de 2026, 23:59 |
| Sustentaciones | 18 y 25 de noviembre |

## Enunciado

![](20262-estr-proyecto.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Cómo se trabaja

El proyecto vive en GitHub, un repositorio por grupo. El repositorio
base es
<https://github.com/EjerciciosClasesCardel/estr-2026-2-proyecto>:

1. Un integrante le hace **fork**.
2. En **Settings › Collaborators** agrega a los demás integrantes, para
   que cada uno confirme con su propia cuenta.
3. Llenan el `README.md` con el nombre, el código, el correo
   institucional y el usuario de GitHub de los integrantes, y el
   escenario escogido. Si falta ese archivo o alguno de esos datos, la
   entrega pierde el 20 % de la nota.

Se califica el último commit anterior a la hora de cierre de cada
entrega, así que la historia de commits cuenta doble: dice si hubo
avance —un repositorio con un solo commit el día del cierre no lo
muestra— y dice quién hizo qué. Todos los criterios son del grupo salvo
la sustentación, que se pregunta a cada integrante y se califica por
separado.

## Los cuatro escenarios

Escoja uno. Cada escenario compara dos estructuras que resuelven el
mismo problema con costos distintos; la primera se escribe desde cero,
sin delegar en la biblioteca estándar.

| | Escenario | Desde cero | Contra |
|---|---|---|---|
| A | Inventario de una tienda | lista enlazada | `vector` |
| B | Frecuencias de palabras de un texto | tabla hash con encadenamiento | `map` |
| C | Turnos de una clínica | cola circular | cola de prioridad |
| D | Índice de títulos | árbol binario de búsqueda | `set` |

Los escenarios C y D usan estructuras que se ven después del avance: en
el avance van el modelado y la primera estructura, y la segunda llega
con la entrega final.

## Qué se entrega

**Avance.** Informe corto de 3 a 5 páginas con el escenario descrito en
sus propias palabras, lo que guarda la estructura y las operaciones que
necesita, la justificación de la estructura escogida con sus costos
esperados y qué piensa medir; la estructura escrita desde cero con sus
operaciones funcionando; al menos tres casos de prueba funcionales y
uno límite; y la bitácora fechada.

**Final.** Las dos estructuras con la misma interfaz; el análisis
formal de complejidad en tiempo y en espacio, en cuatro partes y con
testigos; los experimentos con al menos cinco tamaños de entrada,
reportados en tabla y gráfica y contrastados contra el análisis; el
informe final con sus diagramas y citas; y la sustentación de diez
minutos.

El detalle de cada criterio y su puntaje está en el PDF del enunciado.

## Reglas del repositorio

Las mismas del curso de Fundamentos de Lenguajes de Programación, y se
califican:

1. **Solo archivos de texto plano**: `.c`, `.cpp`, `.h`, `.md`, `.in`,
   `.out`, `.csv` y el `Makefile`. Nada de comprimidos ni binarios
   —`.pdf`, `.docx`, `.xlsx`, ejecutables, imágenes—.
2. El `README.md` lleva el **nombre, el código y el correo
   institucional** de cada integrante; si falta, la entrega pierde el
   20 %.
3. Las **primeras líneas de cada archivo de código** llevan los autores.
4. Los **informes van en Markdown** dentro de `docs/`:
   `informe-avance.md` e `informe-final.md`.
5. La **notación matemática** en LaTeX dentro del Markdown, con `$...$`
   y `$$...$$`: las cotas, los testigos y los invariantes van así.
6. **Todos los diagramas en Mermaid**, incluida la gráfica de los
   tiempos medidos, que usa `xychart-beta`.

Guías de GitHub:
[Markdown](https://docs.github.com/es/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax),
[matemáticas](https://docs.github.com/es/get-started/writing-on-github/working-with-advanced-formatting/writing-mathematical-expressions),
[Mermaid](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams).

El repositorio base ya trae la estructura y las plantillas de los dos
informes en `docs/`.

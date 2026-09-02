# Ejercicios

Todos se resuelven con el método de siempre: especificación, invariantes, y
los tres pasos. Lo que cambia de uno a otro es la forma del estado.

Estos ejercicios entran en el material del parcial.

## Con un ciclo

1. **Los récords.** Construya la lista de las posiciones $j$ donde $A[j]$ es
   mayor que todos los anteriores. Necesita un acumulador y una lista:
   escriba un invariante para cada uno y demuestre los tres pasos. Sobre
   $[3, 1, 4, 1, 5, 9, 2, 6]$ la respuesta es $[0, 2, 4, 5]$.

2. **Invertir un número.** Dado $n \geq 0$, devuelva el número con sus
   dígitos al revés. El dato del parámetro se consume en cada vuelta; el
   invariante tiene que relacionar lo consumido con lo construido. La pista
   está en el ejercicio de contar dígitos: si $n$ pierde un dígito por
   vuelta, ¿qué relación se mantiene entre lo que queda de $n$ y lo que
   lleva el resultado?

3. **La suma de los dígitos.** Igual que el anterior, pero acumulando en un
   número en vez de construir uno nuevo. ¿Qué cambia en el invariante?

## Con dos ciclos

4. **Ordenamiento por inserción** (CLRS, Sección 2.1, p. 18). El ciclo
   interno corre elementos hacia la derecha en lugar de solo mirar: su
   invariante habla de dónde quedó cada uno, no solo de dónde está el
   mínimo. Demuéstrelo como lema y después escriba el externo sobre esa
   conclusión.

5. **Contar inversiones.** Cuente los pares $(a, b)$ con $a < b$ y
   $A[a] > A[b]$, con dos ciclos. El invariante del interno cuenta las
   inversiones que empiezan en $a$; el del externo acumula las de
   $A[0..a)$. Sobre $[2, 4, 1, 3, 5]$ hay tres.

6. **El máximo de cada fila.** Dada una matriz de $F$ filas por $C$
   columnas, devuelva la lista con el máximo de cada fila. Junta las dos
   cosas de la clase: dos ciclos y una lista que crece.

## Con búsqueda binaria

7. Escriba `mayor_menor_o_igual` con su propio ciclo, sin llamar a las otras
   dos, y dé sus invariantes.

8. ¿Qué devuelve `primera_posicion_mayor_o_igual` sobre un arreglo vacío?
   Sígalo con los invariantes en la mano en vez de correrlo.

9. Un arreglo ordenado de $N$ enteros distintos guarda una permutación de
   $0$ a $N-1$ a la que le falta un número. Encuéntrelo en $O(\lg N)$.
   ¿Cuál es el predicado monótono?

## Para comprobar

Los cuatro programas de la clase traen los invariantes escritos como
`assert`. Al resolver estos ejercicios conviene hacer lo mismo: escribir el
invariante dos veces, al entrar y al salir del cuerpo, y correr el programa
sobre casos pequeños. Un `assert` que revienta señala dónde está mal el
invariante, aunque el programa entregue la respuesta correcta por
casualidad.

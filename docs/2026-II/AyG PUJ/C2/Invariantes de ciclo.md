# Invariantes de ciclo

**Grupo B — viernes 21 de agosto de 2026.**

!!! info "Nota en preparación"
    El texto de esta nota se publica después de la clase. Los
    [ejercicios interactivos](#ejercicios-interactivos) ya están
    disponibles y se pueden trabajar desde ya.

## La especificación de un problema

<!-- Entrada (precondiciones) y salida (poscondiciones); instancia de un
     problema; un algoritmo es correcto si calcula el resultado correcto
     para todas las instancias. Las dos técnicas: inducción estructural
     (recursivos, divide y conquista) e invariantes de ciclo (iterativos).
     Ejemplos de especificación: factorial (N ∈ ℕ → N!), búsqueda en
     arreglo arbitrario (∃ p ∈ [0..N). A[p] = v), la variante que devuelve
     p o −1, y la búsqueda en arreglo ordenado (precondición extra). -->

## Invariantes de ciclo

<!-- sumarArreglo con líneas numeradas; la cadena de estados (i, ac) y su
     generalización (i, Σ_{j=0}^{i-1} A[j]); definición de invariante; la
     pareja I₀ (cotas del índice) e I₁ (acumulador); el método:
     inicialización, estabilidad y el cierre (al terminar, los invariantes
     deben suministrar información sobre el objetivo del algoritmo).
     Nota CLRS pp. 18–20: su «mantenimiento» es la estabilidad. -->

## La demostración completa: el factorial

<!-- fact con i = 1 y condición i <= N; estados (1,1) → … → (N+1, N!);
     I₀: 1 ≤ i ≤ N+1, I₁: ans = (i−1)!. Teorema 1 (los invariantes se
     cumplen), demostración: inicialización (líneas 1–2, 0! = 1),
     estabilidad (iteración arbitraria i = j, líneas 4–5), Finalmente
     (termina con i = N+1, ans = N!). Teorema 2: fact(N) produce N!;
     demostración trivial a partir de I₀ e I₁. El experimento fact(−1):
     fuera de la precondición no hay promesa. -->

## Segundo ejemplo: búsqueda en un arreglo

<!-- solve en C++ con la traza A = [8,1,4,2,5,6,7,10], v = 5;
     I₀: 0 ≤ i ≤ N, I₁: ans = ∃ p ∈ [0..i). A[p] = v; inicialización con
     el rango vacío [0..0); estabilidad por casos (A[j] = v / A[j] ≠ v);
     Finalmente: i = N entrega la poscondición. -->

## Ejercicios

<!-- 1. Demostración completa de sumarArreglo. 2. La búsqueda que
     devuelve p o −1: algoritmo e invariantes. 3. La búsqueda en arreglo
     ordenado: ¿solve aprovecha la precondición? (teaser de búsqueda
     binaria). -->

## Ejercicios interactivos

Dos ejercicios en el navegador siguen el camino completo de la clase: ver
el patrón en la traza, nombrarlo como la pareja de invariantes I₀ e I₁ y
armar la demostración por inicialización y estabilidad. Están en la
[página de ejercicios interactivos](Ejercicios.md#invariantes-de-ciclo):

- [sumar](widgets/sumar.html){ target=_blank rel=noopener } — el primer
  ciclo de la clase: descubra qué se conserva en la traza de
  `sumarArreglo`, nombre I₀ e I₁ y complete la demostración del Teorema 1
  hasta el Teorema 2.
- [factorial](widgets/factorial.html){ target=_blank rel=noopener } — el
  mismo recorrido con menos ayuda y la condición `i <= N`, que cambia las
  cotas. Cierra con el experimento de `fact(-1)`: fuera de la precondición
  no hay promesa.

## Referencias

<!-- CLRS, sección 2.1, pp. 18–20 (su mantenimiento = la estabilidad del
     curso); C. Rocha, Diseño y Análisis de Algoritmos. -->

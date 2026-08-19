# Divide y vencerás

**Grupo A — viernes 21 de agosto de 2026.**

!!! info "Nota en preparación"
    El texto de esta nota se publica después de la clase. Los
    [ejercicios interactivos](#ejercicios-interactivos) ya están
    disponibles y se pueden trabajar desde ya.

## Repaso: invariantes de ciclo

<!-- Lo esencial de la sesión del miércoles: especificación (entrada y
     salida), la pareja de invariantes I₀ (cotas) e I₁ (acumulador), y la
     demostración por inicialización y estabilidad con el cierre, usando
     fact (i = 1, condición i <= N, I₁: ans = (i−1)!) como ejemplo:
     Teorema 1, inicialización, estabilidad, Finalmente, Teorema 2. -->

## Un problema para partir en dos

<!-- El máximo de un arreglo: la solución iterativa con su invariante, y
     la pregunta que cambia el enfoque: ¿y si conociera el máximo de cada
     mitad? Cada mitad es el mismo problema, más pequeño. -->

## El esquema divide y vencerás

<!-- Dividir, conquistar y combinar (CLRS, sección 2.3.1); el caso base;
     la recurrencia T(n) = a·T(n/b) + f(n) y sus tres parámetros. Para el
     máximo: a = 2, b = 2, f(n) = Θ(1). -->

## El máximo, ahora recursivo

<!-- La implementación con ini/fin, los tres momentos en el código, la
     recurrencia T(n) = 2·T(n/2) + Θ(1) y la pregunta honesta: ¿ganamos
     algo? Aquí no (sigue en O(n)) — el valor está en el molde. -->

## Ordenamiento por mezcla

<!-- La pregunta clave (¿qué tan difícil es juntar dos mitades ya
     ordenadas?); mezclar con su invariante — así prueba CLRS su Merge
     (pp. 31–33) —; la traza copia por copia; el algoritmo completo; el
     árbol de llamadas; el análisis por niveles: cada nivel mueve n y hay
     lg n + 1 niveles, T(n) ∈ Θ(n·lg n); la tabla n² contra n·lg n. -->

## Errores comunes

<!-- Caso base ausente, partición que no reduce, sobras sin copiar en la
     mezcla, y la f(n) equivocada en la recurrencia. -->

## Ejercicios

<!-- Suma de un arreglo por divide y vencerás; contar apariciones de x;
     potencia con b^n = (b^(n/2))²; demostrar inicialización y estabilidad
     de los invariantes I₀ e I₁ del primer ciclo de mezclar (estabilidad
     por casos). -->

## Ejercicios interactivos

Dos ejercicios en el navegador acompañan la sesión, en la [página de
ejercicios interactivos](Ejercicios.md#divide-y-venceras):

- [mezclar](widgets/mezclar.html){ target=_blank rel=noopener } — ejecute
  la mezcla copia por copia, proponga los invariantes I₀ e I₁ de su primer
  ciclo y certifíquelos por inicialización y estabilidad, como en el
  repaso.
- [ordenar](widgets/ordenar.html){ target=_blank rel=noopener } — baje
  partiendo la lista hasta el caso base, súbala mezclando y descubra en la
  tabla de niveles de dónde sale el n·lg n.

## Referencias

<!-- CLRS, secciones 2.3.1–2.3.2, pp. 30–37, y capítulo 4; Kleinberg y
     Tardos, capítulo 5; C. Rocha, Diseño y Análisis de Algoritmos. -->

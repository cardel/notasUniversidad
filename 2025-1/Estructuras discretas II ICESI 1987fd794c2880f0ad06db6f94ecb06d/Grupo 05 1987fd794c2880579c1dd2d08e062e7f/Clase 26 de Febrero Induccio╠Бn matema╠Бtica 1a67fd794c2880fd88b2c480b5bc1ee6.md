# Clase 26 de Febrero: Inducción matemática

[NotasClase_annotated.pdf](Clase%2026%20de%20Febrero%20Induccio%CC%81n%20matema%CC%81tica%201a67fd794c2880fd88b2c480b5bc1ee6/NotasClase_annotated.pdf)

# Inducción matemática

¿Que es?

Técnica para demostrar teoremas, postulado, código, etc

---

¿Como funciona?

Trabaja bajo el postulado $\forall n P(n)$

- Caso base (valor trivial) n = 1 o n = 0 (puede variar)
- Caso inductivo

$$
P(k) \rightarrow P(k+1)
$$

---

Consejos

- Para P(k+1) intente buscar el caso P(k) para llegar a una igualdad

---

Ejemplo

Voy a demostrar por inducción matemática que n < 2^n para todo n ≥ 1.

1. Caso base (n = 1):

Comprobamos P(1): 1 < 2^1 = 2 ✓

1. Hipótesis inductiva:

Supongamos que P(k) es cierto para algún k ≥ 1, es decir:

k < 2^k

1. Paso inductivo:

Debemos probar P(k+1), es decir, que (k+1) < 2^(k+1)

Partiendo de la hipótesis inductiva:

k < 2^k

Sumamos 1 a ambos lados:

k + 1 < 2^k + 1

Como 2^k ≥ 2 para todo k ≥ 1, entonces:

2^k + 1 < 2^k + 2^k = 2 * 2^k = 2^(k+1)

Por lo tanto:

k + 1 < 2^k + 1 < 2^(k+1)

Así queda demostrado que si P(k) es cierto, entonces P(k+1) también lo es.

1. Conclusión:

Por el principio de inducción matemática, hemos probado que n < 2^n es cierto para todo n ≥ 1.

---

# Resumen

La inducción matemática es una técnica para demostrar teoremasque funciona bajo el postulado ∀n P(n)y consta de:

- Caso base: se demuestra para n = 0 o n = 1, caso trivial
- Caso inductivo: se prueba que P(k) → P(k+1)

El ejemplo presentado demuestra que n < 2^n para todo n ≥ 1, siguiendo estos pasos:

- Verificación del caso base (n=1)
- Hipótesis inductiva asumiendo P(k) como verdadero
- Paso inductivo probando P(k+1)
- Conclusión final demostrando que la propiedad se cumple para todo n ≥ 1
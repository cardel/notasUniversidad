# UVa 10341, Solve It

Enunciado y envío: <https://vjudge.net/problem/UVA-10341>

## Enunciado resumido

Dados seis enteros $p, q, r, s, t, u$ con $0 \leq p, r \leq 20$ y $-20 \leq q, s, t \leq 0$, se busca $x$ en $[0, 1]$ que cumpla

$$p e^{-x} + q \sin x + r \cos x + s \tan x + t x^2 + u = 0,$$

con cuatro decimales, o la palabra `No solution` si no hay. La entrada trae un caso por línea hasta el fin del archivo.

## La función

Aquí la función viene dada por el enunciado, así que el trabajo no es inventarla sino mirarle dos cosas.

La primera es la monotonía. Derivando,

$$f'(x) = -p e^{-x} + q \cos x - r \sin x + s \sec^2 x + 2 t x,$$

y en $[0,1]$ cada sumando es menor o igual que cero por los rangos que da el enunciado: $p \geq 0$, $q \leq 0$ con $\cos x \geq 0$, $r \geq 0$ con $\sin x \geq 0$, $s \leq 0$ y $t \leq 0$. Entonces $f$ no crece, y por eso hay a lo sumo una raíz.

La segunda son los límites, que el enunciado fija en $0$ y $1$. Como $f$ no crece, hay raíz en el intervalo exactamente cuando $f(0) \geq 0 \geq f(1)$. Si $f(0) < 0$ la función ya empieza por debajo, y si $f(1) > 0$ nunca baja lo suficiente: los dos casos son `No solution`.

## Idea

Comprobados los extremos, bisección sobre $x$: en cada vuelta se evalúa el punto medio y se conserva la mitad donde la función cambia de signo. Cien vueltas dejan el intervalo en $2^{-100}$, mucho más fino que los cuatro decimales que se piden, y evitan discutir con qué tolerancia parar.

## Cómo leer la entrada en C++

```cpp
int p, q, r, s, t, u;
while (scanf("%d %d %d %d %d %d", &p, &q, &r, &s, &t, &u) == 6) {
  /* resolver este caso */
}
```

`scanf` devuelve cuántos valores logró leer, así que comparar contra seis es la forma de detectar el fin del archivo sin saber de antemano cuántos casos hay.

## Código explicado

- `f` evalúa el lado izquierdo. En C++ está en `<cmath>` y en Python en `math`.
- La comparación de los extremos decide antes de buscar; sin ella la bisección devolvería un número cualquiera.
- El ciclo de cien vueltas no necesita condición de parada por tolerancia, y el resultado se imprime con `%.4f`.

## Complejidad

$\Theta(100)$ evaluaciones por caso, o sea constante. Con hasta 2100 líneas de entrada el total es lineal en la cantidad de casos.

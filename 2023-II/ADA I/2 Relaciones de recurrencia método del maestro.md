# 2. Relaciones de recurrencia método del maestro

Ecuación

$$
T(n) = aT(\frac{n}{b})+f(n)
$$

## Criterio

$$
n^{log_b(a)}
$$

## Caso 1

$$
\texttt{si} f(n) \texttt{ es } O(n^{log_b(a) - \epsilon}), \epsilon > 0, T(n) =\Theta(n^{log_b(a)})
$$

## Caso 2

$$
\texttt{si } f(n) \texttt{ es } \Theta(n^{log_b(a)}) , T(n) =\Theta(log(n)n^{log_b(a)})
$$

## Caso 3

$$
\texttt{si } f(n) \texttt{ es } \Omega(n^{log_b(a)}+\epsilon), \epsilon > 0, T(n) = \Theta(f(n))
$$

$$
a*f(\frac{n}{b}) \leq c*f(n), c \in (0,1)
$$

| Pregunta | Acción |
| --- | --- |
| ¿Como resuelvo una ecuación con el método del maestro? | Si la ecuación tiene forma T(n) = aT(n/b) + f(n) buscar el caso en que aplica,  |
| ¿Como encuentro el caso? | Verificar las condiciones con respecto a la cota, por ejemplo si f(n) es O(n^{log_b(a) - e)  dando los valores convenientes a e > 0, si la condición es VERDADERA procedemos a resolver |
| ¿Que pasa si no entra en ningún caso? | si no aplica en ninguno de los 3 casos, sencillamente no se puede solucionar con esté metodo |
# 1. Relaciones de recurrencia método de arbol

### Date: September 28, 2023

### Topic: Relaciones de recurrencia método de arbol

### Recall

¿Como se plantea el arbol?

### Notes

- La ecuación tiene aT(n/b) + f(n)
- Raiz: f(n) que tiene a hijos que son T(n/b)

![Untitled-2023-09-28-0852.png](1%20Relaciones%20de%20recurrencia%20me%CC%81todo%20de%20arbol%20753f86daf1374e37b82f52aef18ad21e/Untitled-2023-09-28-0852.png)

¿Como se expande el arból?

- La ecuación tiene aT(n/b) + f(n)
- Reemplazo n por n/b en la ecuación y sencillamente reemplazo en el arbol el nodo T(n/b)
- 

![Untitled-2023-09-28-0852(1).png](1%20Relaciones%20de%20recurrencia%20me%CC%81todo%20de%20arbol%20753f86daf1374e37b82f52aef18ad21e/Untitled-2023-09-28-0852(1).png)

¿Hasta cuando expando el arbol?

¿Como estimo la suma por nivel?

¿Como da la suma de las hojas T(1)?

¿Como se plantea la suma de los vertices internos?

- CUando llego a T(1)

$$
T(\frac{n}{b^i}) = T(1) \rightarrow 
\frac{n}{b^i} = 1 \rightarrow i = log_b(n)
$$

- La suma por nivel

$$
f(\frac{n}{b^i})*a^i
$$

$$
a^{log_b(n)}*T(1)
$$

$$
\sum \limits_{i=0}^{log_b(n)-1} a^i*f(\frac{n}{b^i})
$$

- La ecuación tiene aT(n/b) + f(n)
- Reemplazo n por n/b en la ecuación y sencillamente reemplazo en el arbol el nodo T(n/b)
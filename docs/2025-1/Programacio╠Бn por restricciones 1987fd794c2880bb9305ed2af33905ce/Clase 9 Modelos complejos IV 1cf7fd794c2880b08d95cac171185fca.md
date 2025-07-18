# Clase 9 Modelos complejos IV

# Restricciones reificadas

Tipos de restricciones

1. Restricciones primarias: Se deben satisfacer
2. Restricciones secundarias: Se pueden o no satisfacer

Trabajar con restricciones secundarias

1. Se busca maximizar el número de restricciones que se cumplen

```prolog
int: Satisfaction;
%Esta variable depende del número de restricciones reificadas que se cumplen
constraint Satisfaction = sum(bool2int(Reificadas));
solve maximize Satisfaction;
```

# Estrategias de búsqueda

¿Que es una estrategia de búsqueda?

Es la forma en que se crean nuevos CSP despues haber propagado las restricciones, ejemplo

$x \in [0,10]$

1. $x = 0$
2. $x \in [1,10]$

¿Que tipos de estrategias hay?

1. int-search para problemas de enteros
2. float-search para problemas de flotantes
3. set-search con conjuntos
4. bool-search Para problemas binarios

---

Como se incluye

Mediante anotaciones

```prolog
solve :: estrategia(parametros) satisfy;
solve :: estrategia(parametros) minimize f;

%Parametros [variables de decisión] estrategia de busqueda
%   forma de elegir la variable , tipo de busqueda
```

---

Tipos de estrategias

- `anti_first_fail`: Elegir la variable con el dominio más grande.
- `dom_w_deg`: Elegir la variable con el dominio más grande, dividido por el número de restricciones asociadas, ponderado por la frecuencia con que han causado fallos.
- `first_fail`: Elegir la variable con el dominio más pequeño.
- `impact`: Elegir la variable con el mayor impacto durante la búsqueda.
- `input_order`: Buscar las variables en el orden dado.
- `largest`: Elegir la variable con el valor más grande en su dominio.
- `max_regret`: Elegir la variable con la mayor diferencia entre los dos valores más pequeños de su dominio.
- `most_constrained`: Elegir la variable con el dominio más pequeño, desempatando con el número de restricciones asociadas.
- `occurrence`: Elegir la variable con el mayor número de restricciones asociadas.
- `smallest`: Elegir la variable con el valor más pequeño en su dominio.

---

Forma de elegir la variable

- `annotation indomain`: Asignar valores en orden ascendente.
- `annotation indomain_interval`: Si el dominio consiste en varios intervalos contiguos, reducir el dominio al primer intervalo. De lo contrario, dividir el dominio en dos.
- `annotation indomain_max`: Asignar el valor más grande del dominio.
- `annotation indomain_median`: Asignar el valor medio del dominio, o el menor de los dos valores medios en caso de un número par de elementos en el dominio.
- `annotation indomain_middle`: Asignar el valor del dominio más cercano al promedio de sus límites actuales.
- `annotation indomain_min`: Asignar el valor más pequeño del dominio.
- `annotation indomain_random`: Asignar un valor aleatorio del dominio.
- `annotation indomain_reverse_split`: Dividir el dominio, excluyendo primero la mitad inferior.
- `annotation indomain_split`: Dividir el dominio, excluyendo primero la mitad superior.
- `annotation indomain_split_random`: Dividir el dominio, seleccionando al azar qué mitad excluir primero.
- `annotation outdomain_max`: Excluir el valor más grande del dominio.
- `annotation outdomain_median`: Excluir el valor medio del dominio.
- `annotation outdomain_min`: Excluir el valor más pequeño del dominio.
- `annotation outdomain_random`: Excluir un valor aleatorio del dominio.

---

Estategia de exploración: complete (búsqueda exhaustiva)

# Restart

### Anotaciones de reinicio

Estas anotaciones y funciones proporcionan los bloques fundamentales para implementar metaheurísticas activadas en reinicios y búsquedas gobernadas mediante el uso de valores internos y funcionalidades del solucionador.

- `annotation restart_constant(int: scale)`: Reiniciar después de un número constante de nodos definido por `scale`.
- `annotation restart_geometric(float: base, int: scale)`: Reiniciar con una secuencia geométrica con los parámetros `base` y `scale`.
- `annotation restart_linear(int: scale)`: Reiniciar con una secuencia lineal escalada por `scale`.
- `annotation restart_luby(int: scale)`: Reiniciar con una secuencia de Luby escalada por `scale`.
- `annotation restart_none`: No reiniciar.

## Recomendaciones sobre reinicios

Nota que la búsqueda con reinicios no tiene mucho sentido si la estrategia de búsqueda subyacente no realiza algo diferente cada vez que comienza desde el principio. Por ejemplo:

```prolog
solve :: int_search(q, input_order, indomain_min);
:: restart_linear(1000)
satisfy;

```

... cada reinicio simplemente repetirá la misma búsqueda que el intento anterior.

La forma más sencilla de asegurarse de que algo sea diferente en cada reinicio es usar alguna forma de aleatorización, ya sea en la elección de la variable o del valor. Por ejemplo:

```prolog
solve :: int_search(q, first_fail, indomain_random);
:: restart_linear(1000)
satisfy;

```

... Alternativamente, algunas estrategias de selección de variables utilizan información recolectada de búsquedas previas y, por lo tanto, generan un comportamiento diferente. Por ejemplo, usando `dom_w_deg`:

```prolog
solve :: int_search(q, dom_w_deg, indomain_random);
:: restart_linear(1000)
satisfy;

```

# Resumen

Se explican restricciones primarias y secundarias, estrategias de búsqueda en CSP como int-search y bool-search, tipos de estrategias como first_fail y dom_w_deg, y anotaciones para reinicios como restart_linear y restart_random, destacando la importancia de aleatorización para búsquedas efectivas.
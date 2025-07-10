# Clase 4: Generalidades de CSP II

[http://www.sabiofutbol.com/sabio/sabioBasico/](http://www.sabiofutbol.com/sabio/sabioBasico/)

# Reglas de propagación

¿Que son?

Son reglas de inferencia que podemos aplicar para **acotar dominios** para reducir el espacio búsqueda

---

Ejemplo: Multplicación

$$
x \in D_x \\ y \in D_y \\ z \in D_z \\ x . y = z \\ z \in Dz \cap [Dx.Dy]  \\ x \in D_x \cap int(D_z/D_y) \\ y \in D_y \cap int(D_z/D_x)
$$

[Notas1_annotated.pdf](Academico/Universidad/2025-1/Programacio╠Бn%20por%20restricciones%201987fd794c2880bb9305ed2af33905ce/Clase%204%20Generalidades%20de%20CSP%20II%201ac7fd794c2880b1a4f8f420bd4f13a4/Notas1_annotated.pdf)

```
% Use this editor as a MiniZinc scratch book
var 1..20: x;
var 9..11: y;
var 155..161: z;

constraint x*y = z;
solve satisfy;

output["z = ",show(z), " y = ", show(y), " x = ",show(x)]; 
```

```
%var 1..1000000000: m1;
%var 1..1000000: m2;
%var 1..1000000000: m3;
var 1..1000: x;
var 1..1000: y;
var 1..1000: z;

%constraint m1+m2-m3 = 0;
%constraint m1 = x*x*x;
%constraint m2 = y*y;
%constraint m3 = z*z*z;
constraint x*x*x+y*y-z*z*z = 0;
solve maximize 2*x*y - z;

output[
  " x = ", show(x),
  " y = ", show(y),
  " z = ", show(z)]
```

# Ejemplo de propagación

```
%definir las variables
var 1..10: x;
var 5..20: y;

constraint x+y <=15;
```

## Por defecto

Variable más limitada primero cogiendo el minimo

```
solve satisfy;
```

[split2.pdf](split2.pdf)

## Método de bisección

```
solve::int_search([x,y],first_fail,indomain_split) satisfy; 
```

[splitbi.pdf](splitbi.pdf)

## Por orden de entrada, valor mínimo

```
solve :: int_search([x,y],input_order,indomain_min) satisfy;
```

[split3.pdf](split3.pdf)

## Orden de entrada, valor máximo

```
solve :: int_search([x,y],input_order,indomain_max) satisfy;
```

[split4.pdf](split4.pdf)

# Por la variable que tiene el valor más pequeño

```
solve :: int_search([x,y],smallest,indomain_max) satisfy;
%solve :: int_search([x,y],smallest,indomain_max) satisfy;
```

[split5.pdf](split5.pdf)

[https://docs.minizinc.dev/en/stable/mzn_search.html#search-annotations](https://docs.minizinc.dev/en/stable/mzn_search.html#search-annotations)

# Resumen

Aquí hay un resumen de la programación con restricciones basado en los apuntes:

## Generalidades de CSP (Constraint Satisfaction Problems)

1. **Reglas de propagación**: Son reglas de inferencia aplicadas para acotar dominios y reducir el espacio de búsqueda.
2. **Ejemplo matemático**: En operaciones como multiplicación (x·y=z), se pueden establecer restricciones para limitar los dominios de las variables:

- z ∈ Dz ∩ [Dx·Dy]
- x ∈ Dx ∩ int(Dz/Dy)
- y ∈ Dy ∩ int(Dz/Dx)
1. **Implementación en MiniZinc**: Los ejemplos de código muestran cómo definir variables con dominios específicos y establecer restricciones entre ellas.

## Estrategias de búsqueda

Los apuntes muestran diferentes estrategias de búsqueda para resolver problemas de satisfacción de restricciones:

- **Por defecto**: Variable más limitada primero, tomando el valor mínimo
- **Método de bisección**: Divide el dominio en mitades (int_search con indomain_split)
- **Por orden de entrada**: Con valor mínimo (indomain_min)o valor máximo (indomain_max)
- **Por la variable con valor más pequeño**: Usando smallest como estrategia

Cada estrategia está ilustrada con ejemplos de código y resultados visuales (en los PDF referenciados), mostrando diferentes formas de explorar el espacio de soluciones.

En resumen, la programación con restricciones permite modelar problemas definiendo variables, sus dominios y las restricciones entre ellas, para luego aplicar diferentes estrategias de búsqueda para encontrar soluciones que satisfagan todas las restricciones.
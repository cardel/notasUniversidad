# Clase 8: Modelos complejos III

# Condicionales

Condicionales en modelos

- Control de flujo en el caso de funciones o predicados
- Podemos aplicar restricciones condicionales

```prolog
%Expresiones condicionales
int: r = if y != 0 then x div y else 0 endif

%Restricciones condicionales
var int: x ;
if value > min then 
	constraint x < min
else
	constraint x>= min
endif
```

# Simetrias

¿Que problema plantean las simetrias?

Las soluciones pueden ser combinatorias, es decir, diferentes ordenaciones de la **misma solución.** Encontrar estas soluciones implicación exploracion, lo que es costoso.

Es conveniente aplicar simetrias, forzando un ordenamiento de la salida especifico, se se sabe que otras soluciones derivan de intercambiar los elementos de solución.

---

```prolog
%Caso de pitagoras c*c = a*a + b*b
int: n;
var 1..n: a;
var 1..n: b;
var 1..n: c;

constraint a*a+b*b = c*c;
constraint a <= b; %Restricción de simetria

solve satisfy;

output[
  show(a)," ",show(b)," ",show(c)
 ];
```

Sin restricciones de simetria

[arbol1.pdf](arbol1.pdf)

Con restricciones de simetria

[arbol2.pdf](arbol2.pdf)

```prolog
%Grocery
var int: R = 711;
var 1..711: A;
var 1..711: B;
var 1..711: C;
var 1..711: D;

constraint A+B+C+D = R;
constraint A*B*C*D = R*100*100*100;

%Rompemos la simetria
constraint A<=B;
constraint B<=C;
constraint C<=D;

solve satisfy;

output[
  show(A), " ", show(B), " ", show(C), " ", show(D)," ",show(A+B+C+D), " ",show(A*B*C*D),];
```

Sin restricciones de simetría

[grocery1.pdf](grocery1.pdf)

Con restricciones de simetría

[grocery2.pdf](grocery2.pdf)

```prolog

include "globals.mzn"; 
array[1..3] of var 0..9:  maria_boys;
array[1..3] of var 0..9:  maria_girls;

array[1..3] of var 0..9:  clara_boys;
array[1..3] of var 0..9:  clara_girls;

constraint
  % all different ages (in each family)
  all_different(maria_boys ++ maria_girls) 
  /\
  all_different(clara_boys ++ clara_girls) 

  /\ % youngest is a girl
  minimum(clara_girls[1], clara_boys ++ clara_girls)
  /\
  minimum(maria_girls[1], maria_boys ++ maria_girls)
  /\ % clara has a newborn girl
  clara_girls[1] = 0

  /\ % sums
  sum(clara_boys) = sum(clara_girls)
  /\
  sum(maria_boys) = sum(maria_girls)

  /\ % sum of squares
  sum(i in 1..3) (clara_boys[i]*clara_boys[i]) = sum(i in 1..3) (clara_girls[i]*clara_girls[i])
  /\
  sum(i in 1..3) (maria_boys[i]*maria_boys[i]) = sum(i in 1..3) (maria_girls[i]*maria_girls[i])

  /\ % sum of all is 60
  sum(maria_boys ++ maria_girls ++ clara_boys ++ clara_girls) = 60

  /\ % symmetry breaking
  increasing(maria_boys) /\ increasing(maria_girls)
  /\
  increasing(clara_boys) /\ increasing(clara_girls)
;

% solve satisfy;
solve :: int_search(maria_boys ++ maria_girls ++ clara_boys ++ clara_girls, first_fail, indomain_min, complete) satisfy;

output ["Maria family : girls: ", show(maria_girls), "  boys: ", show(maria_boys), "\n",
  "Clara family: girls: ", show(clara_girls), "  boys: ", show(clara_boys), "\n"];
```

Sin restricciones de simetria

![image.png](Academico/Universidad/2025-1/Programacio╠Бn%20por%20restricciones%201987fd794c2880bb9305ed2af33905ce/Clase%208%20Modelos%20complejos%20III%201c87fd794c288037a995d32fd80e88e8/image.png)

Con restricciones de simetría

![image.png](Academico/Universidad/2025-1/Programacio╠Бn%20por%20restricciones%201987fd794c2880bb9305ed2af33905ce/Clase%208%20Modelos%20complejos%20III%201c87fd794c288037a995d32fd80e88e8/image%201.png)

# Restricciones reificadas

¿Que son?

Si una constraint es falso, el modelo es **insatisfactible**

Una restricción reificada es tomar el valor de una restricción y asignarlo a una variable booleana

```prolog
var int: x;
var int: y;
var bool: b;
constraint b <-> (x < y);
%b toma el valor de la restricción, si es falso no falla
```

---

Como expresar una restricción reificada

```prolog
var int: x;
var int: y;
array of var int a;
var bool: b;
var bool: c;
constraint b <-> (x < y);
constraint c = alldifferent(a);
constraint bool2int(b)+bool2int(c) >= 1;
constraint b \/ c;
%Debe cumplirse al menos una restricción

```

```prolog
include "fzn_reif.mzn"

var bool: b ;
constraint all_different_reif(x,b) ;
```

# Ejercicio restricciones reificadas

![image.png](Academico/Universidad/2025-1/Programacio╠Бn%20por%20restricciones%201987fd794c2880bb9305ed2af33905ce/Clase%208%20Modelos%20complejos%20III%201c87fd794c288037a995d32fd80e88e8/image%202.png)

```prolog
var 1..100: x1;
var 1..100: x2;
var 1..100: x3;
var 1..100: x4;

var bool: A;
var bool: B;
var bool: C;

constraint A = (7*x1+3*x2+4*x3+2*x4 <= 6);
constraint B = (2*x1+5*x2+x3+5*x4 <= 4);
constraint C = (x1-2*x2+x3-x4 = 0);

%Solo una de las restricciones es satisfecha
%constraint bool2int(A)+bool2int(B)+bool2int(C) = 1;

%A lo sumo se cumplen dos restricciones
%constraint bool2int(A)+bool2int(B)+bool2int(C) <= 2;

%Al menos se deben cumplir dos restricciones
%constraint bool2int(A)+bool2int(B)+bool2int(C) >= 2;

%Si restricciones 3 es satisfecha entonces la 2 se satisface
%constraint C <-> B; %Forma 1
%constraint C = B; %Forma 2
%constraint bool2int(C)+bool2int(B) = 2 \/ bool2int(C)+bool2int(B) = 0; %Forma 3

%La restriccion 1 o 3 debe ser satisfecha, pero no las dos
%constraint bool2int(B)+bool2int(C) = 1;

%Se cumple (1 y 3) o (2 y 3) pero no ambas
%constraint bool2int(A /\ C) + bool2int(B /\ C) = 1;

solve satisfy;

```
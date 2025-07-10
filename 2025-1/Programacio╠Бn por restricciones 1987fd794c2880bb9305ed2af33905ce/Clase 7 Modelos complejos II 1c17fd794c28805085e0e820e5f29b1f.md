# Clase 7: Modelos complejos II

---

# Funciones

Funciones en Minizinc

- Posibilidad tener segmentos de código que se reutilizan
- Las funciones pueden ser calculos en este caso son constantes int, float, string, array, boolean, etc
- Las función de variables de decisión, en este caso se declaran con var
- Podemos usar bloques locales dentro de las funciones, con let {declaciones, restriccion} in expresion

---

```jsx
% Ejemplo de predicados y funciones

function var int: doubleOf(var int: x) = 2*x;

var int: y;

constraint doubleOf(y) <= 8;
constraint y >= 0;

solve maximize doubleOf(y);

output["y= ", show(y)];
```

```jsx
% Ejemplo de predicados y funciones

function var int: doubleOf(var int: x) =
  let {
       var int: p = 2*x;
       constraint x>=0;
       }
  in p;

var int: y;
var int: z;
%constraint y>=0;
constraint doubleOf(y) <= 8;
constraint doubleOf(3*z) <= 12;
solve maximize doubleOf(y)+doubleOf(z);

output["y= ", show(y),
       " z = ", show(z) ];
```

```jsx
%Ejemplo minimizar distancia entre dos puntos
include "alldifferent.mzn";
var int: x0;
var int: y0;
var int: x1;
var int: y1;

function var float: distancia(var int:x0, var int:y0, var int:x1, var int:y1) =
  let {
      var int: d1 = x1*x1-x0*x0;
      var int: d2 = y1*y1-y0*y0;
      constraint x0 >= 0;
      constraint x1 >= 0;
      constraint y0 >= 0;
      constraint y1 >= 0;
      constraint alldifferent([x0,x1]);
      constraint alldifferent([y0,y1]);
      }
      in d1 + d2;
      
constraint distancia(x0,y0,x1,y1) <= 10.0;
constraint x1 >= 3;
solve minimize x0+y0;
output[
  show(x0), " ", show(y0), " | ", show(x1), " ", show(y1)];
```

# Predicados

Que son

- Son funciones, pero que retornan booleano (no es necesario especificar)
- Son utiles para aplicar restricciones
- Están optimizados ya que son estrictamente booleanos

```jsx
%Ejemplo con predicados

include "alldifferent.mzn";

predicate pares(var int: x) =
  let
    {
      var int: p = x;
      constraint p > 0;
    } in p mod 2 = 0;
    
array[1..3] of var int: arr;

constraint forall(i in 1..3)(pares(arr[i]));
constraint alldifferent(arr);
constraint forall(i in 1..2)(arr[i] < arr[i+1]);
  
solve satisfy;

output[show(arr)];
      
```
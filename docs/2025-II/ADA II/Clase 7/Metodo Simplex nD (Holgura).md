```
3xe + 2xi

xe + 2xi <= 6
2xe + xi <= 8
-xe + xi <= 1
xi <= 2
xe,xi >= 0
```

La forma holgura son igualdades, para hacer esto vamos a incluir unas variables que vamos a llamar de holgura, para convertirlas en igualdades

La forma de holgura cuando tenemos restricciones <= consiste en agregar una variable de holgura adicional por cada restriccion la cual resta la ecuació n


```
3xe + 2xi

xe + 2xi + x1 = 6
2xe + xi + x2 = 8
-xe + xi + x3 = 1
xi + x4 = 2
xe,xi >= 0
x1,x2,x3,x4 >= 0
```

Transformamos a la forma de holgura

```
3xe + 2xi

x1 = 6 - xe - 2xi
x2 = 8 - 2xe - xi
x3 = 1 + xe - xi
x4 = 2 - xi
xe,xi >= 0
x1,x2,x3,x4 >= 0
```

Esto se le conoce como la forma de holgura
- Variables básicas (son aquellas distintas de 0) x1,x2,x3,x4
- Variables no basicas (son iguales a 0) xe, xi

 Solución inicial (xe,xi) = (0,0)
 x1 = 6, x2 = 8, x3 = 1, x4 = 2

# Iteración de simplex

1. Vamos a seleccionar una variable que va entrar a la base (va ser distinta que 0)
2. Vamos a seleccionar la variable en que la función objetivo su coeficiente es positivo y es el mayor (promesa de buscar el optimo de forma local)
3. Una vez se haga, vamos a evaluar que valor toma xe si volvemos 0 una de las variables basicas (no basica) y seleccionamos el menor valor positivo (para evitar que se nos vuelva no factible), ya que si escogemos un mayor valor se nos viola una de las restricciones

```
3xe + 2xi
//Entra xe
x1 = 6 - xe - 2xi --> x1 = 0, xe = 6
x2 = 8 - 2xe - xi --> x2 = 0, xe = 4
x3 = 1 + xe - xi --> x3 = 0, xe = -1 (NO FACTIBLE)
x4 = 2 - xi, x4 = 0, 0 = 2 (Inconsistente)
xe,xi >= 0
x1,x2,x3,x4 >= 0
```
Sale de la base x2 entra xe, tenemos que pivotear xe, solo una ecuacion xe = <...> en terminos de las variables no básicas

```
z = 12 + 1xi/2 - 3x2/2 

x1 = 2 - 3xi/2 + x2/2
xe = 4 - xi/2 - x2/2 
x3 = 5 - 3xi/2 - x2/2
x4 = 2 - xi
xe,xi >= 0
x1,x2,x3,x4 >= 0
```
Esto significa que xe está pivoteado
1. Hay un termino xe = no basicas
2. No hay xe en las otras ecuaciones

Segunda iteracion

```
z = 12 + 1xi/2 - 3x2/2 

x1 = 2 - 3xi/2 + x2/2
xe = 4 - xi/2 - x2/2 
x3 = 5 - 3xi/2 - x2/2
x4 = 2 - xi
xe,xi >= 0
x1,x2,x3,x4 >= 0
``` 
El coeficiente positivo mas alto xi (entrar a la base)

```
z = 12 + 1xi/2 - 3x2/2 

x1 = 2 - 3xi/2 + x2/2 , x1 = 0, xi = 4/3
xe = 4 - xi/2 - x2/2 , xe = 0, xi = 8 = 24/3
x3 = 5 - 3xi/2 - x2/2, x3 = 0, xi = 10/3
x4 = 2 - xi, x4 = 0, xi = 2 = 6/3
xe,xi >= 0
x1,x2,x3,x4 >= 0
``` 
Sale x1 (vuelve 0) y entra xi (distinta de 0), tenemos que pivotear a xi

```
z = 38/3 - 4x2/3 - x1/3  

xi = 4/3 + x2/3 - 2x1/3
xe = 10/3 - 2x2/3 - x1/3  
x3 = 3 - x2 + x1  
x4 = 2/3 - x2/3 + 2x1/3
xe,xi >= 0
x1,x2,x3,x4 >= 0
``` 
Resulta que no hay mas coeficiente positivos, por lo tanto el método no puede mejorar más la función objetivo, entonces **TERMINA**

Solución

(xe,xi,x1,x2,x3,x4)
- Variables basicas (xe,xi,x3,x4)
- Variables no basicas (x1,x2)

(10/3,4/3,0,0,3,2/3)
Esta es la solución optima. f(X) = 38/3

Sin embargo, esto tiene una limitación que a medida que aumentan las variables de decisión y las restricciones las ecuaciones se vuelven más dificiles de reemplazar.




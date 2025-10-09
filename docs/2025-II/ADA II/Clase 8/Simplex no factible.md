Algunos problemas lineales la solución basica inicial no es factible. Las variables de decisión valen 0

```
max z = 2x - y

2x - y <= 2
x - 5y <= -4
x,y >= 0
```

Forma de holgura

```
max z = 2x - y

2x - y + a = 2
x - 5y + b = -4
x,y >= 0
```
Forma de holgura
```
max z = 2x - y

2x - y + a = 2
x - 5y + b = -4
x,y >= 0
```

Tablero

```
max z - 2x  + y = 0

2x - y + a = 2
x - 5y + b = -4
x,y,a,b >= 0
```
Tablero simplex

| VB  | z   | x   | y   | a   | b   | LD  |
| --- | --- | --- | --- | --- | --- | --- |
| z   | 1   | -2  | 1   | 0   | 0   | 0   |
| a   | 0   | 2   | -1  | 1   | 0   | 2   |
| b   | 0   | 1   | -5  | 0   | 1   | -4  |

b me esta dando -4, esto no es factible

Para resolver esto vamos a utilizar una nueva variable, esta se va incluir en las restricciones y la idea va ser que esta variable nos de 0. Esto se conoce una variable artificial

```
max z = -M

a = 2 - 2x + y + M
b = -4 - x + 5y + M 
x,y,a,b,M >= 0
```

Este metodo simplex se conoce como Metodo de Simplex flexible, vamos a admitir inicialamente una solución no factible. Ahora si M da distinto que 0 al resolver, **el problema no tiene solución**

Ahora vamos a despejar M en la ecuación que nos esta dando problemas

```
max z = -M

a = 2 - 2x + y + M
M = 4 + x -5y + b

x,y,a,b,M >= 0
```

Como M es una V.B debo eliminarla de las otras ecuaciones

```
max z = -4 - x + 5y - b

a = 6 -x - 4y + b
M = 4 + x -5y + b

x,y,a,b,M >= 0
```
Seleccionar variable que entra $y$ 

```
max z = -4 - x + 5y - b

a = 6 -x - 4y + b,   0 = 6 -4y, y = 6/4 = 3/2 = 15/10 
M = 4 + x -5y + b,   0 = 4 -5y, y = 4/5 = 8/10

x,y,a,b,M >= 0
```

Por lo tanto entra $y$ sale $M$

```
max z = -M

a = 14/5 - 9x/5 + b/5 + 4M/5
y = 4/5 + x/5 + b/5 - M/5

x,y,a,b,M >= 0
```

¿Puede entrar M a la base?No, por lo tanto ha terminado

V.b = a, y
V.nb = M, x,b Su valor es 0

- Z = 0
- a = 14/5
- y = 4/5

Dado que z es 0, el sistema tiene solución

Tomamos el problema que tenemos

```
max z = -M

a = 14/5 - 9x/5 + b/5 + 4M/5
y = 4/5 + x/5 + b/5 - M/5

x,y,a,b,M >= 0
```

Tomamos la función objetivo del problema inicial y elimino la variable artificial que he agregado.


```
max z = 2x - y

a = 14/5 - 9x/5 + b/5 
y = 4/5 + x/5 + b/5

x,y,a,b >= 0
```

Observe que y es una V.B y aparece en la función objetivo, por lo tanto debo reemplazarla. Porque recordar las variables basicas están en terminos de las no básicas

```
max z = 2x - (4/5 + x/5 + b/5)

a = 14/5 - 9x/5 + b/5
y = 4/5 + x/5 + b/5

x,y,a,b >= 0
```

Haciendo el algebra

```
max z = 9x/5 - 4/5 - b/5
a = 14/5 - 9x/5 + b/5
y = 4/5 + x/5 + b/5

x,y,a,b >= 0
```
¿Variable que entra a la base? x

```
max z = 9x/5 - 4/5 - b/5
a = 14/5 - 9x/5 + b/5,  0 = 14/5 - 9x/5 
                        x = 14/9

y = 4/5 + x/5 + b/5,  0 = 4/5 + x/5, x = -4

x,y,a,b >= 0
```
Sale la base a

```
max z = 10/5  - a 
x = 14/9  + b/9 - 5a/9
y = 10/9 - a/9 + 2b/9
x,y,a,b >= 0
```
¿Se puede continuar?

Solución x = 14/9 y = 10/9 z = 10/5


```
var float: x;
var float: y;

constraint 2*x - y <= 2;
constraint x - 5*y <= -4;
constraint x >= 0;
constraint y >= 0;

solve maximize 2*x - y;
```

# Resumen

1. Si nos da una solución no factible se debe agregar variable artificial por cada variable no factible
2. Estas variables se suman en las restricciones
3. Y tratamos minimizar la suma de ellas, es decir maximizar -1 por la suma de ellas
4. El sistema es factible cuando la función de maximización da 0
5. Posteriormente reemplazamos por la función objetivo del sistema original
6. Pivoteamos si es necesario (que las variables basicas solo pueden aparecen en una ecuación vb = no basicas)
7. Resolvemos el sistema
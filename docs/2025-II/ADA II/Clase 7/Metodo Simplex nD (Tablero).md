El método de reemplazo y pivoteo tiene el problema de que llega a un punto en es que dificil reemplazar las variables, para esto vamos a tener una tablero que nos va especificar las ecuaciones en términos de una matriz, y vamos aplicar Gauss-Jordan para pivotear las variables.

```
z = 3xe + 2xi

x1 = 6 - xe - 2xi
x2 = 8 - 2xe - xi
x3 = 1 + xe - xi
x4 = 2 - xi
xe,xi >= 0
x1,x2,x3,x4 >= 0
```
Vamos despejar las ecuacions términos de sus valores constantes
```
0 = -3xe - 2xi + z

6 = xe + 2xi + x1
8 = 2xe + xi + x2
1 = -xe + xi + x3
2 = xi + x4
xe,xi >= 0
x1,x2,x3,x4 >= 0
```


| Base  | $x_e$ | $x_i$ | $x_1$ | $x_2$ | $x_3$ | $x_4$ | $z$ | LD  |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- | --- | --- |
| $z$   | -3    | -2    | 0     | 0     | 0     | 0     | 1   | 0   |
| $x_1$ | 1     | 2     | 1     | 0     | 0     | 0     | 0   | 6   |
| $x_2$ | 2     | 1     | 0     | 1     | 0     | 0     | 0   | 8   |
| $x_3$ | -1    | 1     | 0     | 0     | 1     | 0     | 0   | 1   |
| $x_4$ | 0     | 1     | 0     | 0     | 0     | 1     | 0   | 2   |

Selección de la variable que entra es la menor negativa, iteramos hasta que todas las variables en la función objetivo tengan coeficiente positivo.

Entra xe

| Base  | $x_e$ | $x_i$ | $x_1$ | $x_2$ | $x_3$ | $x_4$ | $z$ | LD  |                                |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- | --- | --- | ------------------------------ |
| $z$   | -3    | -2    | 0     | 0     | 0     | 0     | 1   | 0   |                                |
| $x_1$ | 1     | 2     | 1     | 0     | 0     | 0     | 0   | 6   | x1 = 0, xe = 6                 |
| $x_2$ | 2     | 1     | 0     | 1     | 0     | 0     | 0   | 8   | x2 = 0, xe = 4                 |
| $x_3$ | -1    | 1     | 0     | 0     | 1     | 0     | 0   | 1   | x3 = 0, xe = -1 (No factible)  |
| $x_4$ | 0     | 1     | 0     | 0     | 0     | 1     | 0   | 2   | x4 = 0,  0 = 2 (inconsistente) |
Sale de la base x2

| Base  | $x_e$ | $x_i$ | $x_1$ | $x_2$ | $x_3$ | $x_4$ | $z$ | LD  |                           |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- | --- | --- | ------------------------- |
| $z$   | -3    | -2    | 0     | 0     | 0     | 0     | 1   | 0   |                           |
| $x_1$ | 1     | 2     | 1     | 0     | 0     | 0     | 0   | 6   |                           |
| $x_e$ | 1     | 1/2   | 0     | 1/2   | 0     | 0     | 0   | 4   | dividimos la fila entre 2 |
| $x_3$ | -1    | 1     | 0     | 0     | 1     | 0     | 0   | 1   |                           |
| $x_4$ | 0     | 1     | 0     | 0     | 0     | 1     | 0   | 2   |                           |
Operando queda

| Base  | $x_e$ | $x_i$ | $x_1$ | $x_2$ | $x_3$ | $x_4$ | $z$ | LD  |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- | --- | --- |
| $z$   | 0     | -1/2  | 0     | 3/2   | 0     | 0     | 1   | 12  |
| $x_1$ | 0     | 3/2   | 1     | -1/2  | 0     | 0     | 0   | 2   |
| $x_e$ | 1     | 1/2   | 0     | 1/2   | 0     | 0     | 0   | 4   |
| $x_3$ | 0     | 3/2   | 0     | 1/2   | 1     | 0     | 0   | 5   |
| $x_4$ | 0     | 1     | 0     | 0     | 0     | 1     | 0   | 2   |

1. Variable que entra a la base: xi
2. Variable que sale de la base: 

| Base  | $x_e$ | $x_i$ | $x_1$ | $x_2$ | $x_3$ | $x_4$ | $z$ | LD  |                   |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- | --- | --- | ----------------- |
| $z$   | 0     | -1/2  | 0     | 3/2   | 0     | 0     | 1   | 12  |                   |
| $x_1$ | 0     | 3/2   | 1     | -1/2  | 0     | 0     | 0   | 2   | x1 = 0, xi = 4/3  |
| $x_e$ | 1     | 1/2   | 0     | 1/2   | 0     | 0     | 0   | 4   | xe = 0, xi = 24/3 |
| $x_3$ | 0     | 3/2   | 0     | 1/2   | 1     | 0     | 0   | 5   | x3 = 0, xi = 10/3 |
| $x_4$ | 0     | 1     | 0     | 0     | 0     | 1     | 0   | 2   | x4 = 0, xi = 6/3  |
Sale de la base x1.

| Base  | $x_e$ | $x_i$ | $x_1$ | $x_2$ | $x_3$ | $x_4$ | $z$ | LD   | Operación               |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- | --- | ---- | ----------------------- |
| $z$   | 0     | 0     | 1/3   | 4/3   | 0     | 0     | 1   | 38/3 | Fila z + (1/2)×Fila xi  |
| $x_i$ | 0     | 1     | 2/3   | -1/3  | 0     | 0     | 0   | 4/3  | Fila x1 × (2/3)         |
| $x_e$ | 1     | 0     | -1/3  | 2/3   | 0     | 0     | 0   | 10/3 | Fila xe - (1/2)×Fila xi |
| $x_3$ | 0     | 0     | -1    | 1     | 1     | 0     | 0   | 3    | Fila x3 - (3/2)×Fila xi |
| $x_4$ | 0     | 0     | -2/3  | 1/3   | 0     | 1     | 0   | 2/3  | Fila x4 - Fila xi       |
Dado que todos los coeficiente de la función objetivo son positivos, el método termina.
Observe que nos dio el mismo resultado que el anterior ejemplo.
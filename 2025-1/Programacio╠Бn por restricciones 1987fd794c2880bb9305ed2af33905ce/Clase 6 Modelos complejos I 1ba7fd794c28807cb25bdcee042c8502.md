# Clase 6: Modelos complejos I

# Colecciones

Arrays

Arreglos de enteros, booleanos, variables de decisión o floats

```
array[1..2] of int: costo;
array[1..2, 2..3] of var: sol;

array[1..3,1..2] of float: ejemplo;

ejemplo = [1.2 , 2.0 | 2.0 ,3.0 | 4.2 , 5.3 ];
ejemplo = array2d(1..3, 1..2)([1.2,2.0,2.0,3.0,4.2,5.3])
```

---

Conjuntos

- Secuencia de elementos que no se repiten

```
set of int: HEIGHT = 0..h;
set of var: H;
```

---

Enumeraciones

```
enum Recursos;
enum Colores = {verde, rojo, azul}
```

---

# Generadores

List comprenhesion / set comprenhesion

Sirven para generar listas y conjuntos

![image.png](Academico/2025-1/Programacio╠Бn%20por%20restricciones%201987fd794c2880bb9305ed2af33905ce/Clase%206%20Modelos%20complejos%20I%201ba7fd794c28807cb25bdcee042c8502/image.png)

---

# Funciones de agregación

Que es una función de agregación

Para trabajar con restricciones de tamaño arbritario, nos permiten incluir restricciones de acuerdo a las entradas

MiniZinc provides four aggregation functions for arrays containing Boolean expressions. As we have seen, the first of these, **`forall`**, returns a single constraint which is the logical conjunction of the constraints. The second function, **`exists`**, returns the logical disjunction of the constraints. Thus, **`forall`** enforces that all constraints in the array hold, while **`exists`** ensures that at least one of the constraints holds. The third function, `xorall`, ensures that an odd number of constraints hold. The fourth function, `iffall`, ensures that an even number of constraints holds.

# Ejemplo

![image.png](Academico/2025-1/Programacio╠Бn%20por%20restricciones%201987fd794c2880bb9305ed2af33905ce/Clase%206%20Modelos%20complejos%20I%201ba7fd794c28807cb25bdcee042c8502/image%201.png)

Escoger COIN-BC

```jsx
%Modelo con arreglos
enum food = {bread, butter, cheese, cereal, diet_bar};

array[1..5,1..3] of float: nutrients = [| 0.08, 0.01, 0.55 | 0, 0.9, 0 | 0.25, 0.36, 0 | 0.12, 0.03, 0.75 | 0.08, 0, 0.5 |];
  
array[1..3] of int: req = [550, 600,2000];

array[1..5] of float: costs = [0.25, 0.5, 1.2, 0.6, 1.5];
%Variables de decisión
array[1..5] of var int: prod;
var float: z;

%Restricciones
constraint forall(i in 1..5)(prod[i] >= 0);
constraint forall(i in 1..3)(sum(j in 1..5)(prod[j]*nutrients[j,i]) >= req[i]);
constraint z = sum(i in 1..5)(prod[i]*costs[i]);

solve minimize z;

output[show(food), show(prod), show(z)];
```

```jsx
%Modelo con arreglos y carga
int: num_productos;
int: num_requerimientos;
enum food;

array[1..num_productos,1..num_requerimientos] of float: nutrients;
  
array[1..num_requerimientos] of int: req;

array[1..num_productos] of float: costs;

%Variables de decisión
array[1..num_productos] of var int: prod;
var float: z;

%Restricciones
constraint forall(i in 1..num_productos)(prod[i] >= 0);
constraint forall(i in 1..num_requerimientos)(sum(j in 1..num_productos)(prod[j]*nutrients[j,i]) >= req[i]);
constraint z = sum(i in 1..num_productos)(prod[i]*costs[i]);

solve minimize z;

output[show(food), show(prod), show(z)];
```

```jsx
%archivo de datos (dzn)
num_requerimientos = 3;
num_productos = 5;
food = {bread, butter, cheese, cereal, diet_bar};

nutrients = [| 0.08, 0.01, 0.55 | 0, 0.9, 0 | 0.25, 0.36, 0 | 0.12, 0.03, 0.75 | 0.08, 0, 0.5 |];
  
req = [550, 600,2000];

costs = [0.25, 0.5, 1.2, 0.6, 1.5];

```

Guardar ambos archivos mzn y dzn en el mismo directorio
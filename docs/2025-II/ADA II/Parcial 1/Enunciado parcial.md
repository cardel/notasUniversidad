
## Esta parte vale 50% del examen

### Fritanga don José [50 puntos]

Usted recientemente ha visto el curso de **Complejidad y Optimización**.  
Doña Jacinta, la chismosa del barrio, se ha dado cuenta de esto y le ha contado a don José, el señor que vende fritanga en la esquina.  
Él le ha encomendado usar sus nuevas habilidades para solucionar un problema que tiene su negocio, y usted no se puede negar, ya que él le ha fiado empanadas y papas rellenas en varias ocasiones.  

Don José le comenta que maneja **3 combos** de la siguiente forma:

| **Combo** | **Contenido** | **Precio venta** |
|------------|----------------|------------------|
| Combo popular | 3 empanadas, 1 rellena y 2 jugos de aguacate con limón en leche | 3500 |
| Combo para la niña | 5 empanadas, 2 rellenas, 1 jugo de aguacate con limón en leche | 5000 |
| Combo para los enamorados | 2 empanadas, 3 rellenas y 1 jugo de aguacate con limón en leche | 7000 |

Así mismo, le cuenta que los precios de producción por unidad son:

- Empanada: 400  
- Rellena: 300  
- Jugo: 500  

Don José desea producir los combos de tal forma que **maximice las ganancias de su negocio**, tomando en cuenta lo siguiente:

1. Se tiene un máximo disponible de 500 empanadas.  
2. El máximo disponible de jugos es de 600.  
3. El máximo disponible de rellenas es de 800.  
4. En total se tiene un presupuesto de 200000.

---

## Preguntas

1. **(10 puntos)** Plantee el modelo del problema como problema de optimización lineal en su forma estándar.  
2. **(30 puntos)** Resuelva el modelo usando el método **simplex**. Muestre claramente el proceso realizado.  
3. **(10 puntos)** Explique si se aplica la técnica de **branch and bound**. Si es así, especifique los modelos que se derivan de la solución del problema.  

> Suponga que todas las unidades producidas se venden.

---

## **1. Modelo en forma estándar (10 puntos)**

Definimos las variables de decisión:

- $x_1$: número de **combos populares** a producir.
    
- $x_2$: número de **combos para la niña** a producir.
    
- $x_3$: número de **combos para los enamorados** a producir.
    

Cada combo tiene el siguiente beneficio unitario (precio de venta menos costo de producción):

$$  
\begin{aligned}  
\text{Combo popular: } & 3500 - (3 \cdot 400 + 1 \cdot 300 + 2 \cdot 500) = 1000,\\  
\text{Combo niña: } & 5000 - (5 \cdot 400 + 2 \cdot 300 + 1 \cdot 500) = 1900,\\  
\text{Combo enamorados: } & 7000 - (2 \cdot 400 + 3 \cdot 300 + 1 \cdot 500) = 4800.  
\end{aligned}  
$$

Por tanto, la **función objetivo** es:

$$  
\max Z = 1000x_1 + 1900x_2 + 4800x_3  
$$

Sujeto a las restricciones:

$$  
\begin{aligned}  
3x_1 + 5x_2 + 2x_3 &\le 500 && \text{(empanadas)}\\  
2x_1 + 1x_2 + 1x_3 &\le 600 && \text{(jugos)}\\  
1x_1 + 2x_2 + 3x_3 &\le 800 && \text{(rellenas)}\\  
2500x_1 + 3100x_2 + 2200x_3 &\le 200000 && \text{(presupuesto)}\\  
x_1, x_2, x_3 &\ge 0  
\end{aligned}  
$$

Forma estándar (introduciendo variables de holgura $s_1, s_2, s_3, s_4 \ge 0$):

$$  
\begin{aligned}  
3x_1 + 5x_2 + 2x_3 + s_1 &= 500\\  
2x_1 + 1x_2 + 1x_3 + s_2 &= 600\\  
1x_1 + 2x_2 + 3x_3 + s_3 &= 800\\  
2500x_1 + 3100x_2 + 2200x_3 + s_4 &= 200000 \\
x_1,x_2,x_3,s_1,s_2,s_3 \geq 0
\end{aligned}  
$$ 

## **2. Resolución por el método Simplex (30 puntos)**


|  Base |   $x_1$ |   $x_2$ |   $x_3$ | $s_1$ | $s_2$ | $s_3$ | $s_4$ |    RHS |
| ----: | ------: | ------: | ------: | ----: | ----: | ----: | ----: | -----: |
| $s_1$ |       3 |       5 |       2 |     1 |     0 |     0 |     0 |    500 |
| $s_2$ |       2 |       1 |       1 |     0 |     1 |     0 |     0 |    600 |
| $s_3$ |       1 |       2 |       3 |     0 |     0 |     1 |     0 |    800 |
| $s_4$ |    2500 |    3100 |    2200 |     0 |     0 |     0 |     1 | 200000 |
|   $z$ | $-1000$ | $-1900$ | $-4800$ |     0 |     0 |     0 |     0 |      0 |

---

### Selección de variable entrante y saliente

- Variable entrante: elegir la columna con coeficiente más negativo en la fila $z$ $\Rightarrow$ $x_3$ (coeficiente $-4800$).
    
- Razones $\text{RHS}/\text{columna }x_3$:  

    $$  
    \frac{500}{2}=250,\quad \frac{600}{1}=600,\quad \frac{800}{3}\approx266.666667,\quad \frac{200000}{2200}\approx90.9090909.  
    $$
    
- Mínimo: $90.9090909$ corresponde a la fila de $s_4$. Por tanto **$x_3$ entra** y **$s_4$ sale**. Punto pivote es la entrada $(s_4,x_3)$ con valor $2200$.
    

---

### Operación de pivote

Primero normalizamos la fila pivote ($s_4$) dividiendo por $2200$:

Fila pivote nueva ($R_{piv}$):  

$$  
R_{piv} \leftarrow \frac{1}{2200} R_{s_4}  
$$

Cálculo (cada coeficiente dividido por $2200$):

$$  
\begin{aligned}  
&x_1: \frac{2500}{2200} = 1.136363636364\\  
&x_2: \frac{3100}{2200} = 1.409090909091\\  
&x_3: \frac{2200}{2200} = 1\\  
&s_4: \frac{1}{2200} = 0.000454545455\\  
&\text{RHS}: \frac{200000}{2200} = 90.909090909091  
\end{aligned}  
$$

Ahora eliminamos $x_3$ en las otras filas: $R_i \leftarrow R_i - a_{i3}\cdot R_{piv}$, donde $a_{i3}$ es el coeficiente actual de $x_3$ en la fila $i$.

#### Fila $s_1$:

- Factor $a_{13}=2$.
    
- Nueva fila $s_1$:  

    $$  
    \begin{aligned}  
    x_1 &: 3 - 2\cdot 1.136363636364 = 0.727272727272\\  
    x_2 &: 5 - 2\cdot 1.409090909091 = 2.181818181818\\  
    x_3 &: 2 - 2\cdot 1 = 0\\  
    s_1 &: 1 - 2\cdot 0 = 1\\  
    s_4 &: 0 - 2\cdot 0.000454545455 = -0.000909090909\\  
    \text{RHS} &: 500 - 2\cdot 90.909090909091 = 318.181818181818  
    \end{aligned}  
    $$
    

#### Fila $s_2$:

- Factor $a_{23}=1$.
    
- Nueva fila $s_2$:  

    $$  
    \begin{aligned}  
    x_1 &: 2 - 1\cdot 1.136363636364 = 0.863636363636\\  
    x_2 &: 1 - 1\cdot 1.409090909091 = -0.409090909091\\  
    x_3 &: 1 - 1\cdot 1 = 0\\  
    s_2 &: 1 - 1\cdot 0 = 1\\  
    s_4 &: 0 - 1\cdot 0.000454545455 = -0.000454545455\\  
    \text{RHS} &: 600 - 1\cdot 90.909090909091 = 509.090909090909  
    \end{aligned}  
    $$
    

#### Fila $s_3$:

- Factor $a_{33}=3$.
    
- Nueva fila $s_3$:  

    $$  
    \begin{aligned}  
    x_1 &: 1 - 3\cdot 1.136363636364 = -2.409090909091\\  
    x_2 &: 2 - 3\cdot 1.409090909091 = -2.227272727273\\  
    x_3 &: 3 - 3\cdot 1 = 0\\  
    s_3 &: 1 - 3\cdot 0 = 1\\  
    s_4 &: 0 - 3\cdot 0.000454545455 = -0.001363636364\\  
    \text{RHS} &: 800 - 3\cdot 90.909090909091 = 527.272727272727  
    \end{aligned}  
    $$
    

#### Fila $z$ (fila objetivo):

- Factor $a_{z3} = -4800$ (el valor en la fila $z$ para $x_3$).
    
- Actualizamos con $R_z \leftarrow R_z - a_{z3}\cdot R_{piv} = R_z + 4800\cdot R_{piv}$.
    
- Nueva fila $z$:  

    $$  
    \begin{aligned}  
    x_1 &: -1000 + 4800\cdot 1.136363636364 = 4454.545454545\\  
    x_2 &: -1900 + 4800\cdot 1.409090909091 = 4863.636363636\\  
    x_3 &: -4800 + 4800\cdot 1 = 0\\  
    s_4 &: 0 + 4800\cdot 0.000454545455 = 2.181818181818\\  
    \text{RHS} &: 0 + 4800\cdot 90.909090909091 = 436363.636363636  
    \end{aligned}  
    $$
    

---

### Tabla después del pivote (tabla final)

|Base|$x_1$|$x_2$|$x_3$|$s_1$|$s_2$|$s_3$|$s_4$|RHS|
|--:|--:|--:|--:|--:|--:|--:|--:|--:|
|$s_1$|$0.727273$|$2.181818$|$0$|$1$|$0$|$0$|$-0.000909$|$318.181818$|
|$s_2$|$0.863636$|$-0.409091$|$0$|$0$|$1$|$0$|$-0.000455$|$509.090909$|
|$s_3$|$-2.409091$|$-2.227273$|$0$|$0$|$0$|$1$|$-0.001364$|$527.272727$|
|$x_3$|$1.136364$|$1.409091$|$1$|$0$|$0$|$0$|$0.000455$|$90.909091$|
|$z$|$4454.545455$|$4863.636364$|$0$|$0$|$0$|$0$|$2.181818$|$436363.636364$|

> Observación: en la fila $z$ ya no hay coeficientes negativos en las columnas de variables no básicas ($x_1,x_2,x_3$ están $\ge 0$ en $z$), lo que indica **óptimo** para maximización con el tableau usado (no quedan columnas con entrada negativa en $z$).

---

## Solución óptima (relajada / continua)

De la tabla final leemos la solución básica:

- $x_3 = \dfrac{200000}{2200} = 90.9090909\ldots$
    
- $x_1 = 0$, $x_2 = 0$ (no están en la base)
    
- Las holguras: $s_1 \approx 318.1818,; s_2 \approx 509.0909,; s_3 \approx 527.2727,; s_4 = 0$.
    
- Valor objetivo:  

    $$  
    Z^\ast = 436363.636363\ldots  
    $$
    

## **3. Aplicación de Branch and Bound (10 puntos)**

Si los valores de $x_1, x_2, x_3$ deben ser **enteros**

La solución del LP relajado fue $x_3 = 90.909$, no entera.  
Aplicamos **branch and bound** sobre $x_3$:

1. Nodo raíz: $x_3 = 90.909$, $Z = 436363.64$.
    
2. Se ramifica en:
    
    - Rama 1: $x_3 \le 90$
        
    - Rama 2: $x_3 \ge 91$
        

### **Subproblema 1: Rama izquierda ($x_3 \le 90$)**

$$  
\begin{aligned}  
\text{Maximizar} \quad & Z = 1000x_1 + 1900x_2 + 4800x_3 \\  
\text{sujeto a:} \quad  \\
& 3x_1 + 5x_2 + 2x_3 \le 500 \\
& 2x_1 + x_2 + x_3 \le 600 \\
& x_1 + 2x_2 + 3x_3 \le 800 \\
& 2500x_1 + 3100x_2 + 2200x_3 \le 200000 \\ 
& x_3 \le 90 \\
& x_1, x_2, x_3 \ge 0 \\
& x_1, x_2, x_3 \in \mathbb{Z}  
\end{aligned}  
$$

---

### **Subproblema 2: Rama derecha ($x_3 \ge 91$)**

$$  
\begin{aligned}  
\text{Maximizar} \quad & Z = 1000x_1 + 1900x_2 + 4800x_3 \\
\text{sujeto a:} \quad   \\
& 3x_1 + 5x_2 + 2x_3 \le 500 \\
& 2x_1 + x_2 + x_3 \le 600 \\
& x_1 + 2x_2 + 3x_3 \le 800 \\
& 2500x_1 + 3100x_2 + 2200x_3 \le 200000 \\
& x_3 \ge 91 \\
& x_1, x_2, x_3 \ge 0 \\
& x_1, x_2, x_3 \in \mathbb{Z}  
\end{aligned}  
$$

---

## **4. Código MiniZinc **

Guarda el siguiente archivo como `fritanga.mzn`:

```minizinc
% ---------------------------------------------------------------
% Modelo entero para maximizar la ganancia de Don José
% ---------------------------------------------------------------
% Seleccionar el solver COIN-BC o Gurobi/CPLEX si se dispone.
% ---------------------------------------------------------------

% -----------------------------
% VARIABLES
% -----------------------------
var int: x1;  % Combo popular
var int: x2;  % Combo para la niña
var int: x3;  % Combo para los enamorados

% -----------------------------
% PARÁMETROS
% -----------------------------
int: emp_max = 500;         % Máximo de empanadas
int: jug_max = 600;         % Máximo de jugos
int: rell_max = 800;        % Máximo de rellenas
int: presupuesto = 200000;  % Presupuesto máximo

% -----------------------------
% RESTRICCIONES DE RECURSOS
% -----------------------------
constraint 3*x1 + 5*x2 + 2*x3 <= emp_max;      % Empanadas
constraint 2*x1 + 1*x2 + 1*x3 <= jug_max;      % Jugos
constraint 1*x1 + 2*x2 + 3*x3 <= rell_max;     % Rellenas
constraint 2500*x1 + 3100*x2 + 2200*x3 <= presupuesto; % Costo total

% -----------------------------
% RESTRICCIONES DE NO NEGATIVIDAD
% -----------------------------
constraint x1 >= 0;
constraint x2 >= 0;
constraint x3 >= 0;

% -----------------------------
% FUNCIÓN OBJETIVO
% -----------------------------
% Ganancia por combo:
% Combo popular: 3500 - (3*400 + 1*300 + 2*500) = 1000
% Combo niña: 5000 - (5*400 + 2*300 + 1*500) = 1900
% Combo enamorados: 7000 - (2*400 + 3*300 + 1*500) = 4800
var int: Z = 1000*x1 + 1900*x2 + 4800*x3;

solve maximize Z;

% -----------------------------
% SALIDA
% -----------------------------
output [
  "x1 (Combo popular) = ", show(x1), "\n",
  "x2 (Combo niña) = ", show(x2), "\n",
  "x3 (Combo enamorados) = ", show(x3), "\n",
  "Ganancia total Z = ", show(Z), "\n"
];

```
}
El resultado es

```text
x1 = -0.0
x2 = -0.0
x3 = 90.90909090909092
Z = 436363.6363636364
```

---


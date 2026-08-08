# Clase 4. Ciclos dependientes y sumatorias

Miércoles 12 de agosto de 2026.

El viernes pasado fue festivo, así que la clase 3 quedó abierta en su
ejercicio de cierre: un ciclo adentro de otro donde el interno depende del
externo. Hoy ese ejercicio deja de ser un reto y se convierte en el punto
de partida de un método general, porque la regla ``anidar multiplica'' de
la clase pasada tiene una letra menuda que toca leer con cuidado.

## Diapositivas

![](clase04.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## El ejercicio pendiente

```c title="triangulo.c"
int triangulo(int n) {
    int i = 0;
    int cuenta = 0;
    while (i < n) {
        int j = 0;
        while (j < i) {
            cuenta = cuenta + 1;
            j = j + 1;
        }
        i = i + 1;
    }
    return cuenta;
}
```

La entrada es un entero $n \geq 0$; la salida que interesa es $T(n)$, el
total de instrucciones que la función ejecuta. Antes de contar nada, la
prueba de escritorio con $n = 4$, una fila por cada vuelta del ciclo
externo:

| $i$ | Valores de $j$ | Vueltas del cuerpo interno | `cuenta` |
|---|---|---:|---:|
| 0 | ninguno | 0 | 0 |
| 1 | 0 | 1 | 1 |
| 2 | 0, 1 | 2 | 3 |
| 3 | 0, 1, 2 | 3 | 6 |

`triangulo(4)` devuelve 6. Y ese valor no es decorativo: como el cuerpo
interno solo hace `cuenta = cuenta + 1`, la propia función lleva el
registro de cuántas veces corrió su cuerpo.

## Multiplicar predice 16; la traza dice 6

La clase pasada cerró con la regla de que un ciclo adentro de otro
multiplica. Si se aplica aquí sin mirar más: el externo da $n$ vueltas, el
interno daría $n$ vueltas cada vez, el cuerpo correría $n \cdot n$ veces.
Con $n = 4$ eso predice que `cuenta` termina en 16.

Pero la traza entrega 6.

El problema está en la condición `j < i`. El ciclo interno no hace siempre
lo mismo: con $i = 0$ da cero vueltas, con $i = 3$ da tres. La cantidad de
trabajo de cada pasada depende del índice externo.

!!! warning "Multiplicar exige independencia"

    La regla ``anidar multiplica'' vale solo cuando el ciclo interno da la
    misma cantidad de vueltas en cada pasada del externo, como en
    `suma_productos`, donde la condición era `j < n`. Si las vueltas del
    interno dependen del índice externo, multiplicar cuenta de más.

## Ver el patrón

Si multiplicar no sirve, la traza sí. La columna de vueltas del ciclo
interno crece de uno en uno:

| $i$ | Vueltas del cuerpo interno |
|---|---:|
| 0 | 0 |
| 1 | 1 |
| 2 | 2 |
| 3 | 3 |

$$\texttt{cuenta} = 0 + 1 + 2 + 3 = 6.$$

Con $n = 5$ aparece una fila más y nada cambia de forma:
$0 + 1 + 2 + 3 + 4 = 10$. Con $n = 100$, la suma tiene cien términos y
nadie quiere escribirlos. Hacen falta dos cosas: una notación corta para
la suma y una fórmula que la resuelva.

!!! note "El método: congelar y sumar"

    Para contar un ciclo dependiente: congele el índice externo $i$,
    cuente el ciclo interno como una función de $i$, y sume ese conteo
    sobre todas las vueltas del externo.

Aplicado de una vez: con $i$ congelado, la línea `cuenta = cuenta + 1;`
corre $i$ veces, así que en total corre $0 + 1 + 2 + \cdots + (n-1)$
veces.

## La notación para sumas largas

Esa suma se abrevia con el símbolo $\Sigma$:

$$\sum_{i=0}^{n-1} i = 0 + 1 + 2 + \cdots + (n-1).$$

Abajo van la variable y su valor inicial; arriba, el último valor que
toma; a la derecha, el término que se suma en cada paso. El caso pequeño
es la traza escrita en una línea:

$$\sum_{i=0}^{3} i = 0 + 1 + 2 + 3 = 6.$$

Una suma $\sum_{i=a}^{b}$ tiene $b - a + 1$ términos: los enteros de $a$
a $b$, ambos incluidos. Ese ``ambos incluidos'' es la misma aritmética de
contar posiciones en un arreglo, y se olvida con la misma facilidad.

## Sumar una constante

Si el término no depende de la variable de la suma, sumar es multiplicar
por el número de términos:

$$\sum_{i=a}^{b} k = k \cdot (b - a + 1).$$

Dos casos que aparecen todo el tiempo al contar ciclos:

$$\sum_{i=0}^{n-1} 1 = n \qquad \sum_{i=0}^{n-1} n = n \cdot n = n^{2}.$$

El segundo es la trampa clásica: dentro de la suma, $n$ es una constante,
porque no cambia cuando $i$ avanza. Se suma $n$ veces el valor $n$ y el
resultado es $n^2$, no $n$.

## La suma de Gauss

¿Cuánto vale $1 + 2 + \cdots + 100$, sin sumar los cien términos? El
truco es escribir la suma de ida y de vuelta, alineadas, y sumar por
columnas:

$$
\begin{array}{ccccccccc}
S & = & 1   & + & 2   & + & \cdots & + & 100 \\
S & = & 100 & + & 99  & + & \cdots & + & 1   \\
\hline
2S & = & 101 & + & 101 & + & \cdots & + & 101
\end{array}
$$

Cada columna suma 101 y hay 100 columnas:

$$2S = 100 \cdot 101 = 10100 \qquad S = 5050.$$

El mismo argumento con $m$ en lugar de 100 da la fórmula general:

$$\sum_{i=1}^{m} i = \frac{m(m+1)}{2}.$$

La verificación de rigor con el caso más pequeño: $1 + 2 + 3 = 6$ y
$\frac{3 \cdot 4}{2} = 6$. En las diapositivas está el dibujo que hace la
fórmula evidente: dos escaleras de $1 + 2 + 3 + 4$ encajan en un
rectángulo de $4 \times 5$, así que $2S = 4 \cdot 5$.

En los ciclos, $i$ suele arrancar en 0 y terminar en $n - 1$. Se
sustituye $m = n - 1$ (el 0 no aporta):

$$\sum_{i=0}^{n-1} i = \frac{(n-1)\,n}{2}.$$

Y la pregunta pendiente queda respondida:
$\texttt{cuenta}(100) = \frac{99 \cdot 100}{2} = 4950$.

## Las sumas se separan

Dos reglas más, que permiten desarmar una suma nueva en sumas conocidas:

$$\sum (x_i + y_i) = \sum x_i + \sum y_i \qquad \sum k\,x_i = k \sum x_i.$$

Aplicadas de inmediato a una suma que va a salir en el conteo:

$$\sum_{i=0}^{n-1} (i + 1) = \sum_{i=0}^{n-1} i + \sum_{i=0}^{n-1} 1
= \frac{(n-1)\,n}{2} + n = \frac{n(n+1)}{2}.$$

## El formulario

| Suma | Fórmula cerrada |
|---|---|
| $\sum_{i=a}^{b} k$ | $k(b-a+1)$ |
| $\sum_{i=1}^{m} i$ | $\frac{m(m+1)}{2}$ |
| $\sum_{i=0}^{n-1} i$ | $\frac{(n-1)\,n}{2}$ |
| $\sum_{i=1}^{m} i^2$ | $\frac{m(m+1)(2m+1)}{6}$ |
| $\sum_{i=0}^{n-1} i^2$ | $\frac{(n-1)\,n\,(2n-1)}{6}$ |

Las dos primeras filas se dedujeron en la sesión; las de los cuadrados
quedan de referencia para cuando un conteo las pida, que será pronto.
Todas están en CLRS, apéndice A, sección A.1.

## El conteo completo

Con el formulario listo, `triangulo` línea a línea. Las líneas del ciclo
interno se escriben como sumatorias sobre $i$:

| Línea | Veces |
|---|---:|
| `int i = 0;` | 1 |
| `int cuenta = 0;` | 1 |
| `while (i < n)` | $n + 1$ |
| `    int j = 0;` | $n$ |
| `    while (j < i)` | $\sum_{i=0}^{n-1} (i+1)$ |
| `        cuenta = cuenta + 1;` | $\sum_{i=0}^{n-1} i$ |
| `        j = j + 1;` | $\sum_{i=0}^{n-1} i$ |
| `    i = i + 1;` | $n$ |
| `return cuenta;` | 1 |

Con $i$ congelado el cuerpo interno da $i$ vueltas y su condición se
evalúa $i + 1$ veces: la evaluación que falla también cuenta, igual que
en la clase pasada.

Las sumas ya están cerradas: $\sum (i+1) = \frac{n(n+1)}{2}$ y
$\sum i = \frac{(n-1)\,n}{2}$, la segunda dos veces. El total:

$$
T(n) = 2 + (n+1) + n + \frac{n(n+1)}{2} + 2 \cdot \frac{(n-1)\,n}{2}
+ n + 1 = \frac{3n^{2} + 5n}{2} + 4.
$$

!!! tip "La prueba del caso pequeño"

    Antes de creerle a la fórmula, se cuenta a mano un caso chico. Con
    $n = 2$: dos inicializaciones, tres evaluaciones de la condición
    externa, dos `int j = 0;`, tres evaluaciones de la condición interna
    ($1 + 2$), dos instrucciones del cuerpo interno, dos incrementos de
    $i$ y un `return`: 15. Y la fórmula:
    $T(2) = \frac{12 + 10}{2} + 4 = 15$. Si no cuadra, alguna suma quedó
    mal cerrada; esta comprobación es parte del método, no un adorno.

## El triángulo y el cuadrado

El costo del triángulo, $\frac{3n^2+5n}{2} + 4$, contra el del anidado
completo de la clase pasada, $3n^2 + 4n + 4$:

| $n$ | `triangulo` | Anidado completo |
|---:|---:|---:|
| 10 | 179 | 344 |
| 100 | 15 254 | 30 404 |
| 1000 | 1 502 504 | 3 004 004 |

El triángulo hace la mitad del trabajo, y se ve en el dibujo de las
vueltas: la fila $i$ tiene $i$ celdas encendidas, la mitad de la
cuadrícula de $n \times n$. Pero al multiplicar $n$ por 10 ambos costos
se multiplican por cerca de 100: la dependencia rebaja la constante, no
el ritmo de crecimiento. Los dos son cuadráticos.

## Otras dependencias

### El límite se corre en uno

El mismo ciclo con `j <= i` en lugar de `j < i`:

```c title="contar_incluida.c"
int contar_incluida(int n) {
    int i = 0;
    int cuenta = 0;
    while (i < n) {
        int j = 0;
        while (j <= i) {
            cuenta = cuenta + 1;
            j = j + 1;
        }
        i = i + 1;
    }
    return cuenta;
}
```

Con $i$ congelado, $j$ recorre $0, \ldots, i$: son $i + 1$ vueltas y el
patrón es $1, 2, 3, 4$. El cuerpo corre

$$\sum_{i=0}^{n-1} (i+1) = \frac{n(n+1)}{2}$$

veces, y `contar_incluida(4)` $= 10$. El triángulo ahora incluye la
diagonal: cada fila trae una celda más.

### El ciclo interno arranca en $i$

Sumar los productos de todas las parejas $(i, j)$ con $i \leq j$:

```c title="suma_parejas.c"
int suma_parejas(int datos[], int n) {
    int suma = 0;
    int i = 0;
    while (i < n) {
        int j = i;
        while (j < n) {
            suma = suma + datos[i] * datos[j];
            j = j + 1;
        }
        i = i + 1;
    }
    return suma;
}
```

Con $i$ congelado, $j$ recorre $i, i+1, \ldots, n-1$: son $n - i$
vueltas. Con $n = 6$ el patrón baja en lugar de subir: $6, 5, 4, 3, 2,
1$. La suma se cierra con la linealidad:

$$\sum_{i=0}^{n-1} (n - i) = \sum_{i=0}^{n-1} n - \sum_{i=0}^{n-1} i
= n^{2} - \frac{(n-1)\,n}{2} = \frac{n(n+1)}{2}.$$

El mismo total de `contar_incluida`: es el mismo triángulo mirado desde
el otro lado.

El conteo completo, con la misma tabla de siempre:

| Línea | Veces |
|---|---:|
| `int suma = 0;` | 1 |
| `int i = 0;` | 1 |
| `while (i < n)` | $n + 1$ |
| `    int j = i;` | $n$ |
| `    while (j < n)` | $\sum_{i=0}^{n-1} (n-i+1) = \frac{n(n+1)}{2} + n$ |
| `        suma = suma + datos[i] * datos[j];` | $\frac{n(n+1)}{2}$ |
| `        j = j + 1;` | $\frac{n(n+1)}{2}$ |
| `    i = i + 1;` | $n$ |
| `return suma;` | 1 |

$$T(n) = \frac{3\,n(n+1)}{2} + 4n + 4 = \frac{3n^{2} + 11n}{2} + 4.$$

La prueba del caso pequeño, con $n = 1$: dos inicializaciones, dos
evaluaciones externas, un `int j = i;`, dos evaluaciones internas, dos
instrucciones del cuerpo, un incremento y un `return`: 11. Y
$T(1) = \frac{14}{2} + 4 = 11$.

## Ejercicios

### Ejercicio 1

Complete la tabla línea a línea de `contar_incluida` y escriba $T(n)$.
Las vueltas del cuerpo interno ya quedaron contadas; falta armar la
tabla y sumar la columna. Como referencia para verificar: el resultado
coincide con el de `suma_parejas`, y no es casualidad, porque los dos
triángulos tienen el mismo tamaño.

### Ejercicio 2

El límite interno es el doble del índice externo. ¿Cuántas veces corre
el cuerpo interno? Escriba $T(n)$.

```c title="doble_i.c"
int doble_i(int n) {
    int i = 0;
    int cuenta = 0;
    while (i < n) {
        int j = 0;
        while (j < 2 * i) {
            cuenta = cuenta + 1;
            j = j + 1;
        }
        i = i + 1;
    }
    return cuenta;
}
```

El patrón de las vueltas es $0, 2, 4, 6, \ldots$ y el 2 sale de la suma
por linealidad.

### Ejercicio 3

El externo salta de dos en dos y el interno depende de él. Suponga $n$
par. ¿Cuántas veces corre el cuerpo interno?

```c title="salto_dependiente.c"
int salto_dependiente(int n) {
    int i = 0;
    int cuenta = 0;
    while (i < n) {
        int j = 0;
        while (j < i) {
            cuenta = cuenta + 1;
            j = j + 1;
        }
        i = i + 2;
    }
    return cuenta;
}
```

Solo los valores pares de $i$ aportan. Con $n$ par, $i$ toma los valores
$0, 2, \ldots, n-2$; escriba la suma de esos aportes y saque el 2 como
factor para cerrar con Gauss.

### Ejercicio de cierre

El límite interno es el cuadrado del índice externo. Encuentre $T(n)$.

```c title="cuadrado_interno.c"
int cuadrado_interno(int n) {
    int i = 0;
    int cuenta = 0;
    while (i < n) {
        int j = 0;
        while (j < i * i) {
            cuenta = cuenta + 1;
            j = j + 1;
        }
        i = i + 1;
    }
    return cuenta;
}
```

El formulario de la sesión tiene todo lo necesario.

## Para la próxima sesión

1. Resuelva los ejercicios 1 a 3 y el de cierre con la rutina completa:
   traza pequeña, patrón, sumatoria, fórmula y comprobación.
2. La sesión del viernes es una batería completa de ejercicios; tenga el
   formulario a mano.
3. Compile `contar_incluida.c` y verifique que `contar_incluida(5)`
   devuelve 15, el valor que predice $\frac{n(n+1)}{2}$.

## Código de la clase

Compilación y ejecución:

```bash
gcc -Wall -Wextra archivo.c -o archivo && ./archivo
```

**El ejercicio pendiente**

- [triangulo.c](codigo/triangulo.c)

**Otras dependencias**

- [contar_incluida.c](codigo/contar_incluida.c)
- [suma_parejas.c](codigo/suma_parejas.c)

**Ejercicios**

- [doble_i.c](codigo/doble_i.c)
- [salto_dependiente.c](codigo/salto_dependiente.c)
- [cuadrado_interno.c](codigo/cuadrado_interno.c)

## Referencias

- T. H. Cormen, C. E. Leiserson, R. L. Rivest y C. Stein. *Introduction
  to Algorithms*. 4.ª ed., MIT Press, 2022. Sección 2.2 y apéndice A,
  sección A.1 (*Summation formulas and properties*).
- R. Thareja. *Data Structures Using C*. Oxford University Press, 2018.
  Capítulo 2.

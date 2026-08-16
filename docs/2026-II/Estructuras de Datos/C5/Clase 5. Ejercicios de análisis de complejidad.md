# Clase 5. Ejercicios de análisis de complejidad

Viernes 21 de agosto de 2026.

Con las reglas de conteo de la clase 3 y las sumatorias de la clase 4, el
equipo de herramientas está completo. Esta sesión de tres horas es para
usarlo: nueve ejercicios en parejas, un reto en equipos con tres ciclos
anidados, y al final el vocabulario que resume todo lo visto, la notación
$O$.

## Diapositivas

![](clase05.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## La rutina de trabajo

Todos los ejercicios se atacan igual, con cinco pasos:

1. Entender: ¿qué entra, qué sale?
2. Trazar con un valor pequeño.
3. Tabular las vueltas de cada ciclo.
4. Reconocer el patrón y escribirlo como sumatoria.
5. Cerrar la suma y comprobar contra la traza.

Y el formulario de la clase pasada siempre a mano:

| Suma | Fórmula cerrada |
|---|---|
| $\sum_{i=a}^{b} k$ | $k(b-a+1)$ |
| $\sum_{i=1}^{m} i$ | $\frac{m(m+1)}{2}$ |
| $\sum_{i=0}^{n-1} i$ | $\frac{(n-1)\,n}{2}$ |
| $\sum_{i=0}^{n-1} i^2$ | $\frac{(n-1)\,n\,(2n-1)}{6}$ |

más la linealidad: $\sum (x_i + y_i) = \sum x_i + \sum y_i$ y
$\sum k\,x_i = k \sum x_i$.

## Ciclos simples

### El promedio

```c title="promedio.c"
int promedio(int datos[], int n) {
    int suma = 0;
    int i = 0;
    while (i < n) {
        suma = suma + datos[i];
        i = i + 1;
    }
    return suma / n;
}
```

Un recorrido completo, el esqueleto de siempre:

| Línea | Veces |
|---|---:|
| `int suma = 0;` | 1 |
| `int i = 0;` | 1 |
| `while (i < n)` | $n + 1$ |
| `    suma = suma + datos[i];` | $n$ |
| `    i = i + 1;` | $n$ |
| `return suma / n;` | 1 |

$$T(n) = 3n + 4.$$

### La $k$ que desaparece

```c title="diferencia.c"
int diferencia(int datos[], int n) {
    int pares = 0;
    int impares = 0;
    int i = 0;
    while (i < n) {
        if (datos[i] % 2 == 0) {
            pares = pares + 1;
        }
        if (datos[i] % 2 != 0) {
            impares = impares + 1;
        }
        i = i + 1;
    }
    return pares - impares;
}
```

Hay dos condicionales, así que el reflejo dice ``esto tiene mejor y peor
caso''. El conteo dice otra cosa. Con $k$ valores pares en el arreglo:

| Línea | Veces |
|---|---:|
| Inicializaciones | 3 |
| `while (i < n)` | $n + 1$ |
| `    if (datos[i] % 2 == 0)` | $n$ |
| `        pares = pares + 1;` | $k$ |
| `    if (datos[i] % 2 != 0)` | $n$ |
| `        impares = impares + 1;` | $n - k$ |
| `    i = i + 1;` | $n$ |
| `return pares - impares;` | 1 |

$$T(n) = 3 + (n+1) + n + k + n + (n-k) + n + 1 = 5n + 5.$$

La $k$ se cancela: cada valor es par o impar, así que las dos
asignaciones se reparten las $n$ vueltas entre las dos. Hay
condicionales, pero no hay mejor ni peor caso.

### Mejor y peor caso de verdad

```c title="todos_positivos.c"
int todos_positivos(int datos[], int n) {
    int todos = 1;
    int i = 0;
    while (i < n && todos == 1) {
        if (datos[i] <= 0) {
            todos = 0;
        }
        i = i + 1;
    }
    return todos;
}
```

La condición compuesta corta el recorrido apenas aparece un valor no
positivo, con el mismo patrón de `buscar_corte` de la clase 3. Con
$\{-1, 4, 5\}$ el ciclo muere en la primera vuelta:

| Evaluación | $i$ | ¿$i < n$? | ¿`todos` $= 1$? | Acción |
|---|---|---|---|---|
| 1 | 0 | cierto | cierto | `todos` $= 0$, $i = 1$ |
| 2 | 1 | cierto | falso | sale del ciclo |

- Mejor caso: el primer valor no es positivo. $T = 8$, constante.
- Peor caso: todos los valores son positivos, el recorrido es completo y
  la asignación nunca corre. $T(n) = 3n + 4$, lineal.

Se reporta el peor caso: es la garantía con cualquier entrada.

## El paso cambia

### De dos en dos

```c title="de_dos_en_dos.c"
int de_dos_en_dos(int datos[], int n) {
    int suma = 0;
    int i = 0;
    while (i < n) {
        suma = suma + datos[i];
        i = i + 2;
    }
    return suma;
}
```

| $n$ | Valores de $i$ | Vueltas |
|---:|---|---:|
| 6 | 0, 2, 4 | 3 |
| 7 | 0, 2, 4, 6 | 4 |

Las vueltas son $\lceil n/2 \rceil$, la mitad redondeada hacia arriba, y
$T(n) = 3\lceil n/2 \rceil + 4$. Sigue siendo lineal: la mitad de la
pendiente, el mismo ritmo.

### Bajando

```c title="descendente.c"
int descendente(int n) {
    int suma = 0;
    int i = n;
    while (i > 0) {
        suma = suma + i;
        i = i - 1;
    }
    return suma;
}
```

Con $n = 5$: $i$ toma $5, 4, 3, 2, 1$ y la condición falla con $i = 0$.
Cinco vueltas, seis evaluaciones, $T(n) = 3n + 4$. Bajar de $n$ a 1
cuesta lo mismo que subir de 1 a $n$: lo que importa es cuántos valores
recorre el índice, no hacia dónde va. De paso, `descendente(5)` devuelve
15, la suma de Gauss $\frac{5 \cdot 6}{2}$ del miércoles.

### El paso que crece con $n$

```c title="paso_grande.c"
int paso_grande(int n) {
    int i = 0;
    int cuenta = 0;
    while (i <= n) {
        cuenta = cuenta + 1;
        i = i + n / 5;
    }
    return cuenta;
}
```

Este es el ejercicio con sorpresa de la sesión. Las trazas, con
$n \geq 10$:

| $n$ | Paso $n/5$ | Valores de $i$ | Vueltas |
|---:|---:|---|---:|
| 20 | 4 | 0, 4, 8, 12, 16, 20 | 6 |
| 65 | 13 | 0, 13, 26, 39, 52, 65 | 6 |
| 1000 | 200 | 0, 200, 400, 600, 800, 1000 | 6 |

Seis vueltas con $n = 20$ y seis con $n = 1000$. ¿Siempre seis? Casi:
con $n = 14$ el paso es $14/5 = 2$ por la división entera, y salen ocho
vueltas. El redondeo hacia abajo puede regalar una o dos vueltas más,
pero con $n \geq 10$ nunca pasan de ocho: el paso mide cerca de la
quinta parte de $n$, y en unas cinco o seis zancadas se cruza la meta.

$$T(n) \leq 3 \cdot 8 + 4 = 28 \quad \text{para todo } n \geq 10.$$

El ciclo parece depender de $n$ y su costo es constante.

!!! warning "El caso límite: paso cero"

    Con $n < 5$ la división entera da paso 0, `i` nunca avanza y el
    ciclo no termina. Un paso calculado siempre se revisa preguntando si
    puede valer cero.

### Partir por la mitad

```c title="mitades.c"
int mitades(int n) {
    int i = n;
    int cuenta = 0;
    while (i > 0) {
        cuenta = cuenta + 1;
        i = i / 2;
    }
    return cuenta;
}
```

| $n$ | Valores de $i$ | Vueltas |
|---:|---|---:|
| 20 | 20, 10, 5, 2, 1 | 5 |
| 1000 | 1000, 500, 250, 125, 62, 31, 15, 7, 3, 1 | 10 |

Las mismas vueltas de `potencias` del miércoles: partir por la mitad es
duplicar recorrido al revés, y la cuenta la lleva el mismo logaritmo,

$$\text{vueltas} = \lfloor \log_2 n \rfloor + 1 \qquad
T(n) = 3\lfloor \log_2 n \rfloor + 7.$$

Duplicar $n$ añade una sola vuelta. El patrón reaparecerá cada vez que
un algoritmo descarte la mitad de lo que le queda.

## Ciclos dependientes

### Prefijos

```c title="prefijos.c"
int prefijos(int datos[], int n) {
    int total = 0;
    int i = 0;
    while (i < n) {
        int j = 0;
        while (j <= i) {
            total = total + datos[j];
            j = j + 1;
        }
        i = i + 1;
    }
    return total;
}
```

Con $i$ congelado, $j$ recorre $0, \ldots, i$: el patrón es
$1, 2, 3, \ldots, n$ y el cuerpo corre
$\sum_{i=0}^{n-1} (i+1) = \frac{n(n+1)}{2}$ veces.

| Línea | Veces |
|---|---:|
| `int total = 0;` | 1 |
| `int i = 0;` | 1 |
| `while (i < n)` | $n + 1$ |
| `    int j = 0;` | $n$ |
| `    while (j <= i)` | $\sum_{i=0}^{n-1}(i+2) = \frac{n(n+3)}{2}$ |
| `        total = total + datos[j];` | $\frac{n(n+1)}{2}$ |
| `        j = j + 1;` | $\frac{n(n+1)}{2}$ |
| `    i = i + 1;` | $n$ |
| `return total;` | 1 |

$$T(n) = \frac{3n^{2} + 11n}{2} + 4 \qquad
T(1) = \frac{14}{2} + 4 = 11.\ \checkmark$$

### Parejas estrictas

```c title="parejas_estrictas.c"
int parejas_estrictas(int datos[], int n) {
    int suma = 0;
    int i = 0;
    while (i < n) {
        int j = i + 1;
        while (j < n) {
            suma = suma + datos[i] * datos[j];
            j = j + 1;
        }
        i = i + 1;
    }
    return suma;
}
```

Con $i$ congelado, $j$ recorre $i+1, \ldots, n-1$: son $n - i - 1$
vueltas y el patrón baja, $n-1, n-2, \ldots, 1, 0$.

$$\sum_{i=0}^{n-1} (n - i - 1) = \frac{(n-1)\,n}{2} \qquad
T(n) = \frac{3n^{2} + 5n}{2} + 4.$$

El mismo $T$ de `triangulo` del miércoles: es el mismo triángulo,
desplazado una diagonal.

## El reto: tres ciclos anidados

```c title="tercetos.c"
int tercetos(int n) {
    int cuenta = 0;
    int i = 0;
    while (i < n) {
        int j = 0;
        while (j < i) {
            int k = 0;
            while (k < j) {
                cuenta = cuenta + 1;
                k = k + 1;
            }
            j = j + 1;
        }
        i = i + 1;
    }
    return cuenta;
}
```

Las trazas: `tercetos(4)` $= 4$ y `tercetos(5)` $= 10$. Cada ejecución
del cuerpo corresponde a un trío de índices $k < j < i$: con $n = 4$ hay
4 formas de escoger tres posiciones distintas entre $\{0, 1, 2, 3\}$;
con $n = 5$ hay 10.

Para contar en general, la rutina de siempre con una sorpresa agradable:
al congelar $i$, los dos ciclos de adentro son exactamente
`triangulo(i)`, así que su cuerpo corre $\frac{i(i-1)}{2}$ veces. Lo que
el miércoles era un problema completo hoy es un término de la suma:

$$\texttt{cuenta} = \sum_{i=0}^{n-1} \frac{i(i-1)}{2}.$$

La suma se cierra con linealidad y el formulario, incluida la fila de
los cuadrados que estaba esperando su turno:

$$
\sum_{i=0}^{n-1} \frac{i(i-1)}{2}
= \frac{1}{2}\left(\sum_{i=0}^{n-1} i^{2} - \sum_{i=0}^{n-1} i\right)
= \frac{1}{2}\left(\frac{(n-1)\,n\,(2n-1)}{6} - \frac{(n-1)\,n}{2}\right)
= \frac{n(n-1)(n-2)}{6}.
$$

La prueba de siempre: $n = 4$ da $\frac{4 \cdot 3 \cdot 2}{6} = 4$ y
$n = 5$ da $\frac{5 \cdot 4 \cdot 3}{6} = 10$, igual que las trazas. El
cuerpo crece como $\frac{n^3}{6}$: tres niveles de dependencia producen
un costo cúbico.

## Ponerle nombre al crecimiento

La cosecha de la semana, en una tabla:

| Función | $T$ | Término que manda |
|---|---|---|
| `paso_grande` | a lo sumo 28 | constante |
| `mitades` | $3\lfloor\log_2 n\rfloor + 7$ | $\log_2 n$ |
| `promedio` | $3n + 4$ | $n$ |
| `de_dos_en_dos` | $3\lceil n/2\rceil + 4$ | $n$ |
| `prefijos` | $\frac{3n^2+11n}{2} + 4$ | $n^2$ |
| `tercetos` | cerca de $\frac{n^3}{6}$ | $n^3$ |

Para comparar algoritmos basta el término que manda. La evidencia con
`triangulo` y $n = 1000$: $T(1000) = 1\,502\,504$ mientras que
$\frac{3}{2}n^2 = 1\,500\,000$. El término cuadrático pone el 99.8 % del
costo; el resto de la fórmula es equipaje.

La notación que resume esto se escribe $T(n) \in O(n^2)$ y se lee ``$T$
crece a lo sumo como $n^2$'': quitando constantes y términos menores,
$n^2$ es el techo del ritmo de crecimiento. La definición precisa está
en CLRS, sección 3.1, y llegará con las demostraciones formales del
curso; por ahora el uso es de vocabulario:

| Nombre | Se escribe | Ejemplo de hoy |
|---|---|---|
| Constante | $O(1)$ | `paso_grande` |
| Logarítmico | $O(\log n)$ | `mitades` |
| Lineal | $O(n)$ | `promedio` |
| Cuadrático | $O(n^2)$ | `prefijos` |
| Cúbico | $O(n^3)$ | `tercetos` |

Clasificación de práctica: (a) $7n + 2$, (b) $5$, (c) $\frac{n(n+1)}{2}$,
(d) $2\lfloor\log_2 n\rfloor + 9$. Las respuestas: $O(n)$, $O(1)$,
$O(n^2)$ y $O(\log n)$. En la (c), el producto $n(n+1)$ esconde un
$n^2$: siempre se expande antes de clasificar.

## Todo junto

Para cerrar la práctica, una sola función con todo lo de la semana
adentro: un recorrido lineal con `if`, un ciclo dependiente con otro
`if`, y un índice que se duplica.

```c title="combinado.c"
int combinado(int datos[], int n) {
    int mayor = datos[0];
    int i = 1;
    while (i < n) {
        if (datos[i] > mayor) {
            mayor = datos[i];
        }
        i = i + 1;
    }
    int parejas = 0;
    i = 0;
    while (i < n) {
        int j = i + 1;
        while (j < n) {
            if (datos[i] + datos[j] > mayor) {
                parejas = parejas + 1;
            }
            j = j + 1;
        }
        i = i + 1;
    }
    int pasos = 0;
    int valor = 1;
    while (valor <= n) {
        pasos = pasos + 1;
        valor = valor * 2;
    }
    return parejas + pasos;
}
```

Los tres bloques están en secuencia, así que sus costos se suman, y
cada uno se cuenta con su propia herramienta.

**Bloque 1, el mayor.** El índice arranca en 1, así que la condición se
evalúa $n$ veces; la asignación de adentro corre $k$ veces, con $k$
entre 0 (el primer valor es el mayor) y $n - 1$ (arreglo ascendente).

$$T_1 = 3n + k \qquad \text{peor caso: } T_1 = 4n - 1.$$

**Bloque 2, las parejas.** El mismo triángulo de `parejas_estrictas`,
con un `if` que corre $p$ veces, $0 \leq p \leq \frac{n(n-1)}{2}$. Las
sumas ya se conocen: la condición interna aporta $\frac{n(n+1)}{2}$ y
las líneas del cuerpo $\frac{(n-1)\,n}{2}$ cada una. En el peor caso
(todas las parejas superan al mayor):

$$T_2 = 2n^2 + 2n + 3.$$

**Bloque 3, las duplicaciones.** Es `potencias` del miércoles con otro
nombre, y con el `return` al final:

$$T_3 = 3\lfloor\log_2 n\rfloor + 7.$$

**El total.** En el peor caso,

$$T(n) = (4n - 1) + (2n^2 + 2n + 3) + (3\lfloor\log_2 n\rfloor + 7)
= 2n^2 + 6n + 3\lfloor\log_2 n\rfloor + 9,$$

y en el mejor ($k = 0$ y $p = 0$, por ejemplo con todos los valores
negativos),

$$T(n) = \frac{3n^2 + 11n}{2} + 3\lfloor\log_2 n\rfloor + 10.$$

La prueba de siempre: con $n = 1$ no hay parejas ni vueltas del primer
ciclo, las dos fórmulas coinciden y dan 17; contado a mano bloque por
bloque, $3 + 7 + 7 = 17$.

El veredicto: el mejor y el peor caso difieren en las constantes, pero
los dos son cuadráticos, así que el `if` no cambia el ritmo. El término
que manda, $n^2$, lo pone el bloque 2; el recorrido lineal y el
logaritmo quedan de equipaje. Se reporta el peor caso:
$T(n) \in O(n^2)$.

!!! note "La regla que resume la semana"

    Una función con bloques en secuencia se analiza bloque por bloque,
    cada uno con su herramienta, y el bloque más costoso decide el $O$
    de toda la función.

## Ejercicio de cierre

La condición frena al índice antes de llegar a $n$. Trace con $n = 10$,
$n = 20$ y $n = 50$, proponga el patrón de las vueltas y escriba un
$T(n)$ aproximado.

```c title="frenado.c"
int frenado(int n) {
    int i = 0;
    int cuenta = 0;
    while (i * i < 2 * n) {
        cuenta = cuenta + 1;
        i = i + 1;
    }
    return cuenta;
}
```

## Para practicar en casa

### Propuesto 1

```c title="descendente_tres.c"
int descendente_tres(int n) {
    int cuenta = 0;
    int i = n;
    while (i > 0) {
        cuenta = cuenta + 1;
        i = i - 3;
    }
    return cuenta;
}
```

¿Cuántas vueltas da el ciclo? Escriba $T(n)$. Pista: bajar de tres en
tres cuesta lo mismo que subir de tres en tres, $\lceil n/3 \rceil$
vueltas y $T(n) = 3\lceil n/3 \rceil + 4$. Sigue en $O(n)$.

### Propuesto 2

```c title="doble_salto.c"
int doble_salto(int n) {
    int i = 0;
    int cuenta = 0;
    while (i < n) {
        int j = 0;
        while (j < n) {
            cuenta = cuenta + 1;
            j = j + 1;
        }
        i = i + 2;
    }
    return cuenta;
}
```

Suponga $n$ par. Pista: el interno es independiente, así que multiplica;
solo cambian las vueltas externas. El cuerpo corre
$\frac{n}{2} \cdot n = \frac{n^2}{2}$ veces y
$T(n) = \frac{3n^2 + 4n}{2} + 4$: mitad de constante, mismo $O(n^2)$.

### Propuesto 3

```c title="doble_limite.c"
int doble_limite(int n) {
    int i = 0;
    int cuenta = 0;
    while (i < n) {
        int j = 0;
        while (j <= 2 * i) {
            cuenta = cuenta + 1;
            j = j + 1;
        }
        i = i + 1;
    }
    return cuenta;
}
```

Pista: el cuerpo corre $2i + 1$ veces por vuelta; separe con
linealidad, $\sum (2i+1) = 2\sum i + \sum 1 = n(n-1) + n = n^2$. La suma
de los primeros $n$ impares es un cuadrado perfecto, y
$T(n) = 3n^2 + 4n + 4$, el mismo del anidado completo.

El ejercicio de cierre no trae pista: se resuelve con la rutina de la
sesión.

## Ejercicios interactivos

Cuatro ejercicios de esta sesión (`todos_positivos`, `paso_grande`,
`mitades` y `combinado`) se pueden trabajar en el navegador, con
predicción, ejecución paso a paso y el conteo de cada línea en vivo:
[página de ejercicios interactivos](./Ejercicios.md).

## Código de la clase

Compilación y ejecución:

```bash
gcc -Wall -Wextra archivo.c -o archivo && ./archivo
```

**Ciclos simples**

- [promedio.c](codigo/promedio.c)
- [diferencia.c](codigo/diferencia.c)
- [todos_positivos.c](codigo/todos_positivos.c)

**El paso cambia**

- [de_dos_en_dos.c](codigo/de_dos_en_dos.c)
- [descendente.c](codigo/descendente.c)
- [paso_grande.c](codigo/paso_grande.c)
- [mitades.c](codigo/mitades.c)

**Ciclos dependientes**

- [prefijos.c](codigo/prefijos.c)
- [parejas_estrictas.c](codigo/parejas_estrictas.c)
- [tercetos.c](codigo/tercetos.c)

**Todo junto**

- [combinado.c](codigo/combinado.c)

**Cierre y propuestos**

- [frenado.c](codigo/frenado.c)
- [descendente_tres.c](codigo/descendente_tres.c)
- [doble_salto.c](codigo/doble_salto.c)
- [doble_limite.c](codigo/doble_limite.c)

## Referencias

- T. H. Cormen, C. E. Leiserson, R. L. Rivest y C. Stein. *Introduction
  to Algorithms*. 4.ª ed., MIT Press, 2022. Secciones 2.2 y 3.1;
  apéndice A, sección A.1.
- R. Thareja. *Data Structures Using C*. Oxford University Press, 2018.
  Capítulo 2.

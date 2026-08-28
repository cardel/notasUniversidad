# Apéndice. Resolver recurrencias por expansión

El esquema de divide y vencerás deja siempre una ecuación de recurrencia:

$$T(n) = a \cdot T(n/b) + f(n), \qquad T(1) = \Theta(1).$$

En clase esa ecuación se resolvió dibujando el árbol de llamadas y contando
lo que aporta cada nivel. El árbol es rápido y se ve, pero cuando el
enunciado pide justificar la cota hay que escribir el álgebra, y ahí entra
la **expansión**: sustituir la recurrencia dentro de sí misma hasta que
aparezca el patrón, parar en el caso base y resolver la sumatoria que
quedó. Es el método que quedó desarrollado en el tablero para el máximo, y
aquí están las dos recurrencias del tema escritas paso a paso.

## Los tres movimientos

1. **Sustituir.** Reemplazar $T(n/b)$ por lo que la misma ecuación dice de
   él, y hacerlo dos o tres veces. Nunca simplificar de más: conviene
   dejar las potencias de $b$ a la vista, porque son las que muestran el
   patrón.
2. **Escribir el patrón.** Cuando el argumento llega a $n/b^k$, lo que
   queda es un término recursivo $a^k\,T(n/b^k)$ y una suma de $k$
   términos, uno por cada nivel ya abierto. Esa suma se escribe con
   $\sum$.
3. **Aterrizar en el caso base.** Buscar el $k$ que hace $n/b^k = 1$ y
   reemplazarlo. Ahí la sumatoria se vuelve un número y sale la cota.

Dos herramientas aparecen en casi todas las cuentas. La primera es la suma
geométrica (CLRS, ecuación A.5, p. 1147):

$$\sum_{i=0}^{m} r^{i} = \frac{r^{m+1} - 1}{r - 1}, \qquad r \neq 1.$$

La segunda es la propiedad que intercambia base y exponente en un
logaritmo (CLRS, Sección 3.2):

$$a^{\log_b c} = c^{\log_b a}, \qquad \text{en particular} \quad 2^{\log_2 n} = n.$$

Esa última igualdad es la que convierte el término recursivo en algo
legible, y es el paso donde más se traba la cuenta la primera vez.

Una convención antes de arrancar: dentro de la expansión el $\Theta(1)$ se
escribe como una constante $c$ y el $\Theta(n)$ como $c\,n$. Sumar
símbolos $\Theta$ término a término no está definido; sumar constantes sí,
y al final se vuelve a la notación asintótica. Se supone además que $n$ es
potencia de 2, para que las divisiones caigan exactas. Con pisos y techos
la cuenta se ensucia y el resultado asintótico no cambia (CLRS, Sección
4.6.2, p. 103).

## Caso 1: T(n) = 2 T(n/2) + Θ(1)

Es la recurrencia del **máximo recursivo**: dos mitades, y combinar es una
sola comparación. Se escribe $T(n) = 2\,T(n/2) + c$, con $T(1) = d$.

**Primera sustitución.** La ecuación evaluada en $n/2$ dice
$T(n/2) = 2\,T(n/2^2) + c$. Reemplazando:

$$T(n) = 2\bigl[\,2\,T(n/2^2) + c\,\bigr] + c = 2^2\,T(n/2^2) + 2c + c.$$

**Segunda sustitución.** Ahora $T(n/2^2) = 2\,T(n/2^3) + c$:

$$T(n) = 2^2\bigl[\,2\,T(n/2^3) + c\,\bigr] + 2c + c = 2^3\,T(n/2^3) + 2^2 c + 2c + c.$$

**Tercera sustitución**, para no dejar dudas del patrón:

$$T(n) = 2^4\,T(n/2^4) + 2^3 c + 2^2 c + 2c + c.$$

**El patrón.** Cuando el argumento llega a $n/2^k$, el término recursivo
es $2^k\,T(n/2^k)$ y lo acumulado son las potencias de 2 desde $2^0$ hasta
$2^{k-1}$, una por nivel:

$$T(n) = 2^k\,T\!\left(\frac{n}{2^k}\right) + c\sum_{i=0}^{k-1} 2^{i}.$$

**El caso base.** La expansión para cuando el subproblema mide 1:

$$\frac{n}{2^k} = 1 \iff n = 2^k \iff k = \log_2 n.$$

Reemplazando ese $k$, y usando $2^{\log_2 n} = n$:

$$T(n) = n \cdot T(1) + c\sum_{i=0}^{\log_2 n - 1} 2^{i}
      = n\,d + c\,\frac{2^{\log_2 n} - 1}{2 - 1}
      = n\,d + c\,(n - 1).$$

**El resultado.**

$$T(n) = (c + d)\,n - c \implies T(n) = \Theta(n).$$

El máximo recursivo cuesta lo mismo que el ciclo, y no podía ser de otra
forma: para saber cuál es el mayor hay que mirar todos los elementos al
menos una vez. Lo que se ganó fue la técnica, no la cota.

!!! note "Dónde está el peso"

    En esta cuenta la sumatoria es geométrica de razón 2, así que la
    domina su último término: $2^{\log_2 n - 1} = n/2$. Dicho de otro modo,
    el trabajo está en las **hojas** del árbol —las $n$ llamadas de tamaño
    1— y los niveles de arriba casi no aportan. Por eso la respuesta es
    $n$ y no $\lg n$, aunque los niveles sean $\lg n$.

## Caso 2: T(n) = 2 T(n/2) + Θ(n)

Es la recurrencia del **ordenamiento por mezcla**: las mismas dos mitades,
pero ahora combinar cuesta un recorrido completo. Se escribe
$T(n) = 2\,T(n/2) + c\,n$, con $T(1) = d$.

El cambio parece menor y es el que decide todo.

**Primera sustitución.** La ecuación evaluada en $n/2$ dice
$T(n/2) = 2\,T(n/2^2) + c\,\frac{n}{2}$ —el término no recursivo también
se evalúa en $n/2$, y ese es el detalle que se olvida—. Reemplazando:

$$T(n) = 2\left[\,2\,T(n/2^2) + c\,\frac{n}{2}\,\right] + c\,n
       = 2^2\,T(n/2^2) + c\,n + c\,n.$$

El 2 de afuera y el 2 del denominador se cancelan: el nivel nuevo aporta
$c\,n$, exactamente lo mismo que el anterior.

**Segunda sustitución.**

$$T(n) = 2^2\left[\,2\,T(n/2^3) + c\,\frac{n}{2^2}\,\right] + 2\,c\,n
       = 2^3\,T(n/2^3) + 3\,c\,n.$$

**El patrón.** El término del nivel $i$ es $2^{i} \cdot c\,\dfrac{n}{2^{i}} = c\,n$,
constante, así que la suma no es geométrica sino una simple repetición:

$$T(n) = 2^k\,T\!\left(\frac{n}{2^k}\right) + \sum_{i=0}^{k-1} 2^{i}\,c\,\frac{n}{2^{i}}
       = 2^k\,T\!\left(\frac{n}{2^k}\right) + \sum_{i=0}^{k-1} c\,n
       = 2^k\,T\!\left(\frac{n}{2^k}\right) + k\,c\,n.$$

**El caso base.** Otra vez $n/2^k = 1$, o sea $k = \log_2 n$:

$$T(n) = n\,d + c\,n \log_2 n.$$

**El resultado.**

$$T(n) = c\,n \lg n + d\,n \implies T(n) = \Theta(n \lg n),$$

la cota de los buenos algoritmos de ordenamiento por comparación. La base
del logaritmo no importa: cambiarla multiplica por una constante y la
notación asintótica las ignora.

!!! note "Dónde está el peso, esta vez"

    Aquí ningún nivel domina: los $\lg n + 1$ niveles aportan $c\,n$ cada
    uno. Por eso el logaritmo aparece **multiplicando** en vez de quedarse
    escondido. Comparado con el caso anterior, lo único que cambió fue
    $f(n)$, y con eso la cota pasó de $n$ a $n \lg n$; equivocar $f(n)$ es
    el error que más veces da una respuesta de otro orden.

## Las dos, lado a lado

| | Máximo | Ordenamiento por mezcla |
|---|---|---|
| Recurrencia | $2\,T(n/2) + c$ | $2\,T(n/2) + c\,n$ |
| Término del nivel $i$ | $2^{i}\,c$ | $2^{i}\,c\,\dfrac{n}{2^{i}} = c\,n$ |
| Cómo evoluciona | crece al doble | se queda igual |
| Suma sobre $\lg n$ niveles | $c\,(n-1)$ | $c\,n \lg n$ |
| Cota | $\Theta(n)$ | $\Theta(n \lg n)$ |

Las dos parten en dos mitades y las dos tienen $\lg n$ niveles. Lo único
distinto es cuánto cuesta juntar, y de ahí sale toda la diferencia. Leer
la fila del término del nivel $i$ es la forma rápida de anticipar la
respuesta: si crece, manda el último nivel; si se queda igual, manda el
número de niveles; si decrece, manda el primero.

## Una tercera, para el tema que sigue

$$T(n) = T(n/2) + \Theta(1).$$

Es la de la **búsqueda binaria**: sobrevive una sola mitad y decidir cuál
cuesta una comparación. Con $T(n) = T(n/2) + c$ y $T(1) = d$, la expansión
casi no tiene qué expandir, porque no hay factor multiplicando:

$$T(n) = T(n/2^2) + 2c = T(n/2^3) + 3c = \cdots = T\!\left(\frac{n}{2^k}\right) + k\,c.$$

Con $k = \log_2 n$:

$$T(n) = d + c \log_2 n \implies T(n) = \Theta(\lg n).$$

El término del nivel $i$ es $1^{i} \cdot c = c$, y niveles hay $\lg n$: es
el tercer caso de la lectura de arriba, con el agregado de que aquí el
árbol no se abre, es una sola rama.

## Comprobar la cuenta con el computador

Una recurrencia se puede evaluar exactamente, sin fórmula cerrada, y
compararla contra la que salió de la expansión. Si las dos coinciden para
todas las potencias de 2 hasta un millón, es muy improbable que el álgebra
esté mal:

```python
def maximo_exacto(n):
    # T(n) = 2 T(n/2) + 1, con T(1) = 1
    if n == 1:
        resultado = 1
    else:
        resultado = 2 * maximo_exacto(n // 2) + 1
    return resultado
```

Con $c = d = 1$, la expansión predice $T(n) = 2n - 1$ para el máximo,
$T(n) = n + n\log_2 n$ para el ordenamiento y $T(n) = 1 + \log_2 n$ para
la búsqueda binaria. El programa
[recurrencias.py](codigo/recurrencias.py) evalúa las tres recurrencias
posición por posición y contrasta cada valor contra su fórmula:

```bash
python3 recurrencias.py
```

Imprime la tabla de las tres y verifica los 21 tamaños de $n = 1$ a
$n = 2^{20}$. El último bloque rompe a propósito el invariante de la
cuenta: le aplica al ordenamiento la fórmula del máximo —las dos parten en
dos mitades, así que la confusión es natural— y el `assert` la descarta en
$n = 2$, donde el valor exacto es 4 y la fórmula dice 3.

Vale la advertencia de siempre: que los números coincidan no demuestra la
cota, porque se probaron 21 tamaños y no todos. Pero una fórmula que falla
en $n = 8$ queda descartada en un segundo, y eso ahorra media hora de
álgebra sobre algo que ya era falso.

## Ejercicios

Para cada una: expanda tres veces, escriba el patrón con $\sum$, encuentre
el $k$ que aterriza en el caso base y despeje la cota.

1. $T(n) = T(n/2) + \Theta(n)$. Aparece al partir un arreglo por
   **slices** en vez de por índices en la búsqueda binaria: la partición
   deja de ser gratis. ¿En qué se convierte el $\Theta(\lg n)$?
2. $T(n) = 2\,T(n/2) + \Theta(n)$ pero con $T(1) = \Theta(n)$ —el caso
   base copia el arreglo—. ¿Cambia la cota?
3. $T(n) = 4\,T(n/2) + \Theta(n)$. Aquí la suma sí es geométrica y de
   razón mayor que 2. Compárela con el Caso 1: ¿quién domina ahora?
4. $T(n) = 3\,T(n/3) + \Theta(1)$. Divide en tres partes; el
   procedimiento es idéntico cambiando la base del logaritmo.
5. $T(n) = T(n-1) + \Theta(1)$, con $T(0) = \Theta(1)$. No es de divide y
   vencerás —el subproblema baja de a uno, no a la mitad—, pero la
   expansión funciona igual y explica por qué un ciclo simple es
   $\Theta(n)$.

## Referencias

- T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein. *Introduction to
  Algorithms*, 3.ª ed., MIT Press, 2009. Sección 2.3.2, pp. 34--37 (la
  recurrencia del ordenamiento por mezcla, resuelta por niveles); Capítulo
  4, Sección 4.4, pp. 88--93 (método del árbol de recursión); Sección
  4.6.2, pp. 103--106 (pisos y techos); Apéndice A, ecuación (A.5),
  p. 1147 (suma geométrica).
- J. Erickson. *Algorithms, Etc.*, Capítulo 1 (recursión), donde la
  expansión aparece como «unrolling».

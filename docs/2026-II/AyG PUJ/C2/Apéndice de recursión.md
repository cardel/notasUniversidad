# Apéndice. Recursión: qué pasar en la llamada y dónde parar

Este apéndice nace de una pregunta que llegó por correo, y que se repite
cada semestre con otras palabras: al escribir una función recursiva, ¿qué
datos hay que pasarle a la llamada para que funcione? Y ¿cómo se decide el
caso base, que siempre parece salir a la fuerza?

Las dos preguntas tienen la misma respuesta, y por eso van juntas. Una
función recursiva **promete** algo: dada una entrada que cumple la
precondición, devuelve lo que dice su especificación. La llamada recursiva no
es un truco de sintaxis: es pedirle esa promesa a la misma función, sobre un
problema **más pequeño**. Y el caso base es el problema tan pequeño que la
promesa se cumple sin pedirle nada a nadie. Cuando las dos cosas están
claras, qué pasar y dónde parar dejan de ser adivinanzas.

Primero se descubre eso sobre ejemplos, con la pila de llamadas a la vista.
Al final se formaliza: qué es una función recursiva, por qué termina y cómo
se demuestra que es correcta.

## Sumar hasta $n$ sin ningún ciclo

Escriba una función que reciba un entero $n \geq 0$ y devuelva
$0 + 1 + 2 + \cdots + n$. Sin `while` y sin `for`.

Antes de escribir nada, los primeros valores a mano:

| $n$ | $0$ | $1$ | $2$ | $3$ | $4$ | $5$ |
|---|---|---|---|---|---|---|
| suma hasta $n$ | $0$ | $1$ | $3$ | $6$ | $10$ | $15$ |

¿Cómo sale el $10$ a partir del $6$? Sumándole $4$. ¿Y el $15$ a partir del
$10$? Sumándole $5$. Cada valor sale del anterior con una sola suma:

$$\text{suma}(n) = \text{suma}(n-1) + n.$$

Eso ya es una función que se llama a sí misma. Lo que dice es: *para sumar
hasta $n$, pídale a alguien que sume hasta $n-1$ y agréguele $n$*. Ese alguien
es la misma función.

## El primer intento

```python
def suma_hasta(n):
    resultado = suma_hasta(n - 1) + n
    return resultado
```

Se ejecuta `suma_hasta(3)` y se sigue la pila de llamadas: cada llamada
espera a que la de adentro devuelva algo.

| Llamada | Qué necesita | Qué hace |
|---|---|---|
| `suma_hasta(3)` | `suma_hasta(2)` | llama |
| `suma_hasta(2)` | `suma_hasta(1)` | llama |
| `suma_hasta(1)` | `suma_hasta(0)` | llama |
| `suma_hasta(0)` | `suma_hasta(-1)` | llama |
| `suma_hasta(-1)` | `suma_hasta(-2)` | llama |
| … | … | … |

Nadie devuelve nunca. Cada llamada le pide a otra, y la pila crece hasta
que Python la corta:

```
RecursionError: maximum recursion depth exceeded
```

¿Dónde tendría que haber parado? Mire la tabla: en `suma_hasta(0)`. Sumar
hasta $0$ es $0$, y para saberlo no hace falta llamar a nadie. Ese es el caso
base, y no salió de la nada: salió de preguntar cuál es la instancia más
pequeña del problema y qué vale ahí.

## El segundo intento

```python
def suma_hasta(n):
    # 0 + 1 + ... + n
    if n == 0:
        resultado = 0
    else:
        resultado = suma_hasta(n - 1) + n
    return resultado
```

La misma ejecución, ahora completa. La pila baja hasta el caso base y
después sube, y en la subida cada llamada por fin puede calcular su
resultado:

```
llama  suma_hasta(3)
  llama  suma_hasta(2)
    llama  suma_hasta(1)
      llama  suma_hasta(0)
      devuelve  suma_hasta(0) = 0
    devuelve  suma_hasta(1) = 1
  devuelve  suma_hasta(2) = 3
devuelve  suma_hasta(3) = 6
```

Léalo en dos tiempos. **Bajando**, cada llamada le pasa a la siguiente un
problema más pequeño: $3$, luego $2$, luego $1$, luego $0$. **Subiendo**, cada
llamada recibe la respuesta del problema pequeño y la convierte en la suya:
$0$, luego $0 + 1$, luego $1 + 2$, luego $3 + 3$.

Y una variante al borde: `suma_hasta(0)` entra directo al caso base y
devuelve $0$ sin llamar a nadie. La pila tiene una sola llamada.

## Las dos preguntas, sobre este ejemplo

**Qué pasar en la llamada.** No hay que pasar *los datos correctos* en
abstracto: hay que pasar **el mismo problema, más pequeño**. En `suma_hasta`
el problema es el número $n$, y más pequeño es $n - 1$. La llamada
`suma_hasta(n - 1)` no se elige porque funcione; se elige porque es la
instancia que está un paso más cerca del fondo.

**Dónde parar.** El caso base es la instancia **más pequeña a la que se
puede llegar restando**. Si cada llamada resta $1$ y se arranca en un
$n \geq 0$, se llega a $0$; el caso base es $n = 0$ y su respuesta es lo que
la especificación dice para esa entrada: la suma vacía, que vale $0$.

Las dos preguntas se contestan con el mismo dato: **cuál es el tamaño del
problema y cómo se achica**. En cuanto eso está escrito, la llamada pasa
el tamaño reducido y el caso base es el tamaño mínimo.

### Las cuatro preguntas

Toda función recursiva de este apéndice se escribe contestando, en este
orden:

1. **¿Qué promete la función?** Entrada, precondición, salida. Sin esto no
   se sabe qué pedirle a la llamada recursiva.
2. **¿Cuál es el tamaño del problema y cómo se achica?** Un número que
   decrece con cada llamada: $n$, la cantidad de dígitos, el largo de un
   rango, un exponente.
3. **¿Cuál es la instancia más pequeña y qué responde?** Ese es el caso
   base; su respuesta sale de la promesa, no de la intuición.
4. **¿Cómo se arma la respuesta grande con la respuesta de la más pequeña?**
   Ese es el paso recursivo: se asume que la llamada cumple la promesa y se
   completa lo que falta.

Para `suma_hasta`: promete $0 + \cdots + n$; el tamaño es $n$ y se achica
restando $1$; la más pequeña es $n = 0$ y responde $0$; la grande es la
pequeña más $n$.

## El mismo método, tres veces más

### Contar los dígitos de un número

Promete: cuántos dígitos decimales tiene $n \geq 1$. Tamaño: la cantidad de
dígitos, y se achica con `n // 10`, que quita el último. La instancia más
pequeña: un número de un dígito, $n < 10$, que responde $1$. La grande: los
dígitos de `n // 10`, más uno.

```python
def contar_digitos(n):
    # Cuantos digitos decimales tiene n, con n >= 1
    if n < 10:
        resultado = 1
    else:
        resultado = contar_digitos(n // 10) + 1
    return resultado
```

`contar_digitos(4057)` baja por $4057$, $405$, $40$, $4$; el $4$ es el caso
base y responde $1$; subiendo se suma uno tres veces: $4$.

¿Por qué el caso base es $n < 10$ y no $n == 0$? Una versión con
`if n == 0: resultado = 0` también cuenta bien para todo $n \geq 1$:
el $4$ llama a `contar_digitos(0)`, recibe $0$ y le suma uno. Pruébelo.
La diferencia está en lo que el caso base responde. Con $n < 10$ responde
lo que la promesa dice de un número de un dígito. Con $n == 0$ responde
$0$ para un número que la promesa no cubre, y el conteo sale bien porque la
suma de arriba lo compensa. Cuando la promesa se extienda a $n = 0$, que
tiene un dígito, la primera versión sigue en pie y la segunda devuelve $0$.
El caso base se escoge donde la promesa se cumple, no donde el número se
acaba.

### Sumar un arreglo: el rango se achica, el arreglo no

Aquí está la pregunta del correo en su forma más común. La función recibe un
arreglo; ¿qué se le pasa a la llamada recursiva? ¿Una copia sin el primer
elemento?

No. Se pasa **el mismo arreglo** y un rango más corto. La función promete la
suma de $A[ini..fin]$, y el tamaño del problema es el largo del rango,
$fin - ini + 1$. Se achica moviendo $ini$ una posición a la derecha; la
instancia más pequeña es el rango vacío, $ini > fin$, que suma $0$.

```python
def suma_arreglo(A, ini, fin):
    # A[ini] + ... + A[fin]; el rango vacio suma 0
    if ini > fin:
        resultado = 0
    else:
        resultado = A[ini] + suma_arreglo(A, ini + 1, fin)
    return resultado
```

```
llama  suma_arreglo(A, 0, 2)
  llama  suma_arreglo(A, 1, 2)
    llama  suma_arreglo(A, 2, 2)
      llama  suma_arreglo(A, 3, 2)
      devuelve  0
    devuelve  8
  devuelve  10
devuelve  15
```

con $A = [5, 2, 8]$. Fíjese en que $A$ es el mismo en las cuatro llamadas: lo
que cambia es `ini`. Copiar el arreglo sin el primer elemento daría el mismo
resultado y costaría $\Theta(n)$ por llamada, que es lo que la clase de
dividir y conquistar pidió evitar: cada copia es un recorrido que la
recursión ya iba a hacer.

La llamada externa es `suma_arreglo(A, 0, len(A) - 1)`, y con el arreglo
vacío entra directo al caso base.

### Elevar a una potencia: el tamaño se parte por la mitad

Promete $b^e$ con $e \geq 0$. El tamaño es $e$ y se achica dividiendo por
$2$; la instancia más pequeña es $e = 0$, que responde $1$. La grande: si
$e$ es par, $b^e = (b^{e/2})^2$; si es impar, $b^e = (b^{\lfloor e/2 \rfloor})^2 \cdot b$.

```python
def potencia(b, e):
    # b elevado a e, con e >= 0, partiendo el exponente por la mitad
    if e == 0:
        resultado = 1
    else:
        parcial = potencia(b, e // 2)
        if e % 2 == 0:
            resultado = parcial * parcial
        else:
            resultado = parcial * parcial * b
    return resultado
```

`potencia(2, 10)` baja por $e = 10, 5, 2, 1, 0$: cinco llamadas para un
exponente de diez, y serían unas veinte para un exponente de un millón.
Achicar dividiendo en vez de restando es lo que separa $\Theta(\lg e)$ de
$\Theta(e)$, y el caso base no cambia por eso.

## Los dos errores, vistos en la pila

Casi todo lo que sale mal en una función recursiva es una de estas dos
cosas, y las dos se ven en la traza.

**El caso base no está o no se alcanza.** El primer intento de `suma_hasta`
no lo tenía. Pero también falla uno que sí lo tiene y queda fuera del camino:
si el caso base de `suma_hasta` fuera `n == 1` y se llamara con $n = 0$, la
pila bajaría por $0, -1, -2, \ldots$ sin tocarlo nunca. El caso base tiene
que ser un valor por el que la reducción **pasa**, arrancando desde
cualquier entrada válida.

**La llamada no reduce.** Si en `suma_arreglo` la llamada fuera
`suma_arreglo(A, ini, fin)`, con los mismos índices, cada llamada pediría
exactamente el mismo problema, y la pila crecería sin que nada cambiara de
un nivel al otro. En dividir y conquistar la versión sutil es una partición
que deja una mitad del tamaño original: si `mitad` puede caer en `fin`, la
llamada sobre $[mitad..fin]$ vuelve a ser la llamada sobre $[ini..fin]$.

En los dos casos el síntoma es el mismo, `RecursionError`, y el diagnóstico
también: mirar la traza y preguntar si el tamaño baja en cada nivel y si el
fondo está en su camino.

## Ahora, formalmente

**Definición (función recursiva).** Una función $f$ definida sobre un
conjunto de entradas con una medida de tamaño $n \in \mathbb{N}$ es recursiva
cuando su definición tiene dos clases de casos:

- **casos base**, donde $f$ se calcula directamente, sin usar $f$;
- **casos recursivos**, donde $f$ sobre una entrada de tamaño $n$ se calcula
  usando $f$ sobre entradas de tamaño **estrictamente menor** que $n$.

La palabra que carga todo el peso es *estrictamente*: como los tamaños son
naturales y cada llamada baja al menos uno, ninguna cadena de llamadas
puede ser infinita. Eso es la **terminación**, y sale gratis de la
definición si se cumple. Los dos errores de arriba son, justamente, las dos
formas de no cumplirla: un caso base que la cadena no cruza, y una llamada
que no baja.

**El contrato.** La especificación de una función recursiva es un par
precondición y poscondición, y es lo que la llamada recursiva usa. Para
`suma_arreglo`:

$$\forall\, ini, fin \text{ con } 0 \leq ini \leq fin + 1 \leq N:\quad
\mathtt{suma\_arreglo}(A, ini, fin) = \sum_{k = ini}^{fin} A[k],$$

donde la suma sobre un rango vacío vale $0$. La condición $ini \leq fin + 1$
admite el rango vacío como entrada válida; sin ella el caso base no tendría
precondición que cumplir.

**Teorema.** Para todo arreglo $A[0..N)$ de números y todo par de índices
con $0 \leq ini \leq fin + 1 \leq N$, la invocación `suma_arreglo(A, ini, fin)`
produce $\sum_{k=ini}^{fin} A[k]$.

**Demostración.** Se procede por inducción sobre el tamaño del rango,
$n = fin - ini + 1$, que por la precondición cumple $n \geq 0$.

**Desarrollo.**

*Caso base* ($n = 0$). Entonces $ini = fin + 1$, la condición `ini > fin` es
verdadera y el algoritmo devuelve $0$. La suma sobre el rango vacío es $0$,
que es lo que la especificación pide. ✓

*Caso inductivo* ($n > 0$). La hipótesis de inducción: la invocación es
correcta para todo rango de tamaño menor que $n$. Como $n > 0$ se tiene
$ini \leq fin$, la condición `ini > fin` es falsa y se ejecuta la línea
recursiva. Hay que verificar dos cosas.

Primero, que la llamada está dentro de la hipótesis. La llamada es sobre
$[ini+1..fin]$, cuyo tamaño es $fin - (ini + 1) + 1 = n - 1 < n$; y sus
índices cumplen la precondición, porque $ini + 1 \leq fin + 1 \leq N$. ✓

Segundo, que combinar es correcto. Por la hipótesis,
$\mathtt{suma\_arreglo}(A, ini+1, fin) = \sum_{k=ini+1}^{fin} A[k]$. El
algoritmo devuelve $A[ini]$ más ese valor, y

$$A[ini] + \sum_{k=ini+1}^{fin} A[k] = \sum_{k=ini}^{fin} A[k],$$

que es la poscondición para el rango $[ini..fin]$. ✓

**Conclusión.** Por lo tanto, se puede concluir por inducción sobre el tamaño
del rango que `suma_arreglo(A, ini, fin)` produce $\sum_{k=ini}^{fin} A[k]$
para todo rango válido; en particular `suma_arreglo(A, 0, N-1)` produce la
suma del arreglo completo. $\blacksquare$

Compare con la demostración del máximo recursivo en el
[apéndice de inducción estructural](Apéndice.md#la-induccion-estructural-del-maximo):
es la misma forma, con dos llamadas en vez de una y una partición por la
mitad en vez de un corrimiento de uno. Las dos obligaciones del caso
inductivo son siempre las mismas: que la llamada quede dentro de la
hipótesis, y que la combinación devuelva lo prometido.

!!! note "Las cuatro preguntas y la demostración son la misma cosa"

    La pregunta 1 es el teorema. La pregunta 2 es la medida sobre la que se
    hace la inducción. La pregunta 3 es el caso base de la prueba. La
    pregunta 4 es el caso inductivo. Quien contesta las cuatro al escribir la
    función ya tiene la demostración; solo falta escribirla.

**El costo.** Cada función recursiva deja una recurrencia sobre su tamaño.
`suma_hasta` y `suma_arreglo` hacen trabajo constante y una llamada de
tamaño $n - 1$: $T(n) = T(n-1) + \Theta(1)$, que es $\Theta(n)$.
`contar_digitos` reduce dividiendo por $10$: $T(n) = T(n/10) + \Theta(1)$,
que es $\Theta(\lg n)$. `potencia` lo mismo con $e/2$: $\Theta(\lg e)$. Las
recurrencias con dos llamadas, como la del máximo, se resuelven en
[Recurrencias por expansión](Recurrencias%20por%20expansión.md).

**La pila de Python.** Cada llamada pendiente ocupa un lugar en la pila, y
Python la limita a unas mil llamadas anidadas. `suma_arreglo` sobre un
arreglo de diez mil elementos hace diez mil llamadas anidadas y se cae con
`RecursionError` aunque sea correcta. Cuando la profundidad crece con $n$,
el ciclo es la versión que corre; cuando crece con $\lg n$, como en
`potencia` o en la búsqueda binaria, la recursión cabe de sobra. Es la misma
razón por la que la búsqueda en profundidad sobre cuadrículas grandes se
escribe con pila explícita.

## Ejercicios

Los cinco primeros van de menor a mayor; el último no trae pistas.

1. **La suma de los dígitos.** Escriba `suma_digitos(n)` para $n \geq 0$.
   *Pistas:* el tamaño es la cantidad de dígitos; la instancia más pequeña
   es $n < 10$; la grande es el último dígito, `n % 10`, más la suma de los
   demás.

2. **El máximo de un rango, de uno en uno.** Escriba `maximo(A, ini, fin)`
   con $ini \leq fin$ achicando el rango de a una posición, no por la
   mitad. *Pistas:* la instancia más pequeña es el rango de un elemento;
   la grande compara `A[ini]` con el máximo de $[ini+1..fin]$. Compare
   la profundidad de la pila con la de la versión que parte por la mitad.

3. **Invertir un arreglo en sitio.** Escriba `invertir(A, ini, fin)` que
   deje $A[ini..fin]$ al revés sin crear otro arreglo. *Pistas:* el tamaño
   es el largo del rango y se achica **por los dos lados**; la instancia
   más pequeña es un rango de cero o un elemento, que ya está al revés; la
   grande intercambia los extremos y llama sobre $[ini+1..fin-1]$.

4. **Está o no está.** Escriba `esta(A, ini, fin, v)`, que decida si $v$
   aparece en $A[ini..fin]$, y escriba su contrato con el cuantificador.
   *Pistas:* hay dos casos base, no uno.

5. **La demostración de `contar_digitos`.** Escríbala en las cuatro partes,
   por inducción sobre la cantidad de dígitos. *Pistas:* la medida es
   $\lfloor \log_{10} n \rfloor + 1$; el caso inductivo tiene que
   justificar que `n // 10` tiene exactamente un dígito menos.

6. **Fibonacci de dos maneras.** Escriba `fib(n)` recursiva con la
   definición $fib(n) = fib(n-1) + fib(n-2)$, cuente cuántas llamadas hace
   para $n = 30$ y explique por qué son tantas. Después escriba una versión
   recursiva que haga $\Theta(n)$ llamadas y diga qué cambió en la promesa.

## Comprobar con el computador

El archivo [recursion.py](codigo/recursion.py) trae las cuatro funciones del
apéndice, la del ejercicio 4 y una versión con traza de dos de ellas, que imprime la pila
bajando y subiendo como en las figuras de arriba. Al final contrasta cada
función recursiva contra su versión iterativa: 201 valores de `suma_hasta`,
unos catorce mil de `contar_digitos`, 91 potencias y 104 rangos de arreglo
para `suma_arreglo` y `esta`. Escribir la versión iterativa al lado de la
recursiva y correr las dos sobre los mismos casos es la forma más rápida de
saber si el caso base y la reducción quedaron bien.

## Referencias

- Cormen, Leiserson, Rivest, Stein. *Introduction to Algorithms*, 3.ª ed. MIT
  Press, 2009. Sección 2.3.1 (pp. 30–34), el patrón de dividir y conquistar,
  y Sección 4.1 (pp. 68–74), la recurrencia de un algoritmo recursivo.
- Las páginas de [dividir y conquistar](Divide%20y%20vencerás.md), de
  [inducción estructural](Apéndice.md) y de
  [recurrencias por expansión](Recurrencias%20por%20expansión.md).

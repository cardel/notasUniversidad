# Divide y vencerás

**Grupo A — viernes 21 de agosto de 2026.** Sesión virtual, de 9 a 11.

Este grupo ya trabajó invariantes de ciclo el miércoles con el profesor
titular, así que la sesión tuvo dos partes: un repaso del método completo,
con el factorial y un ejercicio nuevo, y la primera técnica de diseño
recursivo del curso: dividir, conquistar y combinar, con el máximo, el
ordenamiento por mezcla y su recurrencia.

## Diapositivas

Esta versión incluye lo que se anotó durante la clase, en las páginas donde
apareció.

![](clase02-divide.pdf){ type=application/pdf style="min-height:70vh;width:100%" }

## Repaso: la pareja de invariantes

Lo esencial de la clase del miércoles, condensado. Un problema se especifica
con su **entrada** (las precondiciones) y su **salida** (las
poscondiciones); una **instancia** es una entrada que cumple la precondición,
y un algoritmo es **correcto** si calcula el resultado correcto para todas
las instancias. Para los algoritmos iterativos la herramienta es el
**invariante**: una propiedad sobre las variables que debe ser cierta a lo
largo de la ejecución del ciclo. Vienen en pareja porque hay dos cosas que
vigilar:

- $I_0$: las cotas del índice, que puede ser explícito o implícito. Si el
  ciclo es un `for` sobre los elementos, el índice no aparece en el código;
  usted lo asume como un contador de iteraciones que arranca en 0.
- $I_1$: qué lleva el acumulador en función del índice.

Si más variables cambian dentro del ciclo, la numeración continúa: $I_2$,
$I_3$ y las que hagan falta. Y el método para demostrar que se cumplen tiene
tres pasos: **inicialización** (la fórmula es verdadera antes de la primera
iteración), **estabilidad** (si es cierta antes de cualquier iteración, sigue
siéndolo después) y **terminación** (el ciclo termina y los invariantes
entregan información sobre el objetivo del algoritmo).

### El factorial, en acción

```python
def fact(N):
    ans = 1
    i = 1
    while i <= N:
        ans = ans * i
        i = i + 1
    return ans
```

La recomendación de siempre para encontrar los invariantes: arranque con un
valor, $N = 5$, y mire la pareja $(i, \mathtt{ans})$ chequeo por chequeo:

$$(1, 1) \to (2, 1) \to (3, 2) \to (4, 6) \to (5, 24) \to (6, 120)$$

El patrón, generalizado: $I_0: 1 \leq i \leq N+1$ e
$I_1: \mathtt{ans} = (i-1)!$. Se cumple en cada fila, con $0! = 1$ salvando
el arranque, y la cota $N+1$ sale de la condición $i \leq N$: el índice
termina en el valor que la vuelve falsa.

De la demostración, que quedó anotada completa en las diapositivas, dos ideas
para llevarse:

- **La estabilidad es un paso inductivo.** Se asume que $P(j)$ es cierto, los
  invariantes en la iteración $i = j$, y se demuestra $P(j+1)$, la
  siguiente. Es inducción matemática con otro nombre, y por eso la
  iteración que se toma es arbitraria y distinta de la última: de la última
  no hay siguiente que probar. El cálculo va por dos caminos que deben
  coincidir: el código dice $\mathtt{ans} = (j-1)! \cdot j = j!$, y el
  invariante evaluado en $j+1$ dice $((j+1)-1)! = j!$. Coinciden. ✓
- **La terminación es una intersección.** La condición rota da $i > N$; el
  invariante $I_0$ da $i \leq N+1$. El único valor que cumple las dos cosas
  es $i = N+1$, y ese es el valor con el que se evalúa $I_1$:
  $\mathtt{ans} = (N+1-1)! = N!$, la poscondición. Si esa intersección diera
  vacía o diera más de un valor, habría que revisar el algoritmo.

**Teorema 2.** `fact(N)` para cualquier $N \geq 0$ produce $N!$.
*Demostración*: es trivial a partir de la correctitud de $I_0$ e $I_1$
(Teorema 1). $\blacksquare$

### Otro ejercicio: la búsqueda

El segundo repaso fue la búsqueda lineal, con dos novedades. La primera:
`ans` ya no acumula un valor numérico, acumula una *respuesta*, y su
invariante es una fórmula con existencial, restringida al prefijo revisado:

$$I_0:\; 0 \leq i \leq N \qquad\qquad I_1:\; \mathtt{ans} = \exists\, p \in [0..i).\; A[p] = v$$

En la inicialización el existencial se evalúa sobre el rango $[0..0)$, que es
vacío: no puede existir un $p$ ahí, así que la fórmula vale falso, igual que
`ans`. La segunda novedad: la estabilidad se parte **por casos**, según la
posición examinada sea $v$ o no. Ese esquema por casos reaparece hoy mismo en
el ciclo de mezclar.

### La pregunta de la clase: ¿y el invariante del arreglo?

En medio del repaso salió una pregunta que amerita respuesta escrita: si cada
variable lleva su invariante, ¿no debería haber uno para el arreglo $A$?

La respuesta: el invariante habla de **lo que cambia** dentro del ciclo. En
la búsqueda el arreglo solo se lee; no cambia, así que no hace parte del
estado: es parte de la precondición, que es la que promete que llega un
arreglo de números de tamaño $N$. Pero si el algoritmo modificara el arreglo,
una suma acumulada en sitio, un intercambio, cualquier escritura, entonces sí:
el arreglo entra al estado y el invariante tiene que decir qué cumple.

De esa pregunta quedó el [apéndice](Apéndice.md) prometido en clase: tres
ejercicios resueltos donde el arreglo se modifica y hace parte del
invariante, incluido uno con dos ciclos anidados.

### Validar invariantes en el código

Sobre los ejercicios resueltos apareció el truco de los `assert`: el
invariante se escribe tal cual como una afirmación junto a la condición del
ciclo, y si es falso en algún chequeo, el programa revienta ahí mismo y dice
dónde. En Python es un `assert` directo; en Java tocaría lanzar una excepción
cuando la condición no se cumpla. Los archivos de la
[nota de invariantes](Invariantes%20de%20ciclo.md#codigo-de-la-clase) y del
[apéndice](Apéndice.md) están construidos así.

## Un problema para partir en dos

El máximo de un arreglo ya lo sabemos resolver, y certificar:

```python
def maximo_iterativo(lista):
    mayor = lista[0]
    i = 1
    while i < len(lista):
        if lista[i] > mayor:
            mayor = lista[i]
        i = i + 1
    return mayor
```

Un ciclo que recorre las $n$ posiciones, con $I_0: 1 \leq i \leq n$ e $I_1$:
`mayor` es el máximo del prefijo recorrido. La pregunta que cambia el
enfoque: ¿hay otra manera de pensar el problema, sin recorrerlo de izquierda
a derecha?

La hay. Si alguien me dice el máximo de la mitad izquierda y el de la mitad
derecha, el máximo total es el mayor de esos dos. Y cada mitad es *el mismo
problema*, más pequeño: se resuelve igual, partiendo otra vez, hasta llegar a
arreglos de un solo elemento.

## El esquema divide y vencerás

Según CLRS (Sección 2.3.1), un algoritmo de divide y vencerás resuelve un
problema de tamaño $n$ en tres momentos:

1. **Dividir** el problema en subproblemas más pequeños *del mismo tipo*.
2. **Conquistar** cada subproblema resolviéndolo recursivamente; si es tan
   pequeño que resulta trivial, resolverlo directo: ese es el **caso base**.
3. **Combinar** las soluciones parciales en la solución del problema
   original.

Para encontrar el caso base, échele cabeza a la pregunta ¿cuándo la solución
es inmediata? Ordenar un arreglo: el de tamaño 1, porque ya está ordenado. El
máximo: el de tamaño 1, porque es su propio máximo. Hasta ahí se divide.

¿Y la correctitud? Para los algoritmos recursivos la técnica es la
**inducción estructural**: el caso base se verifica directo y el caso
recursivo asume que las llamadas sobre problemas más pequeños son correctas.
Es la pareja de los invariantes, que cubren los iterativos. La escritura
completa de una de estas pruebas, con el molde del curso, está en el
[apéndice](Apéndice.md#la-induccion-estructural-del-maximo).

El costo de un algoritmo de divide y vencerás queda descrito por una
**ecuación de recurrencia**: si el problema de tamaño $n$ se parte en $a$
subproblemas de tamaño $n/b$, y dividir más combinar cuesta $f(n)$,

$$T(n) = a \cdot T(n/b) + f(n),$$

con el caso base costando constante, porque lo trivial cuesta constante. Los
tres parámetros se leen del algoritmo: $a \geq 1$ es cuántos subproblemas se
generan, $b > 1$ es en cuánto se reduce el tamaño por nivel, y $f(n)$ es lo
que cuesta partir y juntar.

## El máximo, ahora recursivo

```python
def maximo(lista, ini, fin):
    # Maximo de lista[ini..fin] partiendo el rango en dos
    if ini == fin:
        resultado = lista[ini]
    else:
        mitad = (ini + fin) // 2
        max_izq = maximo(lista, ini, mitad)
        max_der = maximo(lista, mitad + 1, fin)
        if max_izq >= max_der:
            resultado = max_izq
        else:
            resultado = max_der
    return resultado
```

Los tres momentos, en el código: dividir es calcular `mitad`; conquistar son
las dos llamadas recursivas; combinar es el `if` final; y el caso base es el
rango de un solo elemento. Un detalle que en clase se subrayó: la partición
es **por índices**, nunca cortando la estructura de datos. Partir listas de
verdad, copiando, es costoso; los índices `ini` y `fin` delimitan el rango
sin mover un solo elemento.

¿Cuánto cuesta? Dos mitades, $a = 2$ y $b = 2$, y combinar es una sola
comparación, $f(n) = \Theta(1)$:

$$T(n) = 2\,T(n/2) + \Theta(1) \implies T(n) = O(n).$$

El ciclo también era $O(n)$, así que partir el arreglo no hizo magia, y no
podía hacerla: para hallar el máximo hay que mirar todos los elementos al
menos una vez, ningún orden de visita baja de ahí. Lo que sí ganamos fue el
molde. La ganancia de verdad viene con el siguiente problema.

## El ordenamiento por mezcla

Ordenar un arreglo grande es difícil. Pero suponga que las dos mitades ya
vienen ordenadas: ¿qué tan fácil es juntarlas en una sola lista ordenada?
Bastante, por una propiedad que se ve al ponerlas lado a lado: **el menor de
todos está al frente de una de las dos listas**. Se toma, y se repite. Esa
operación es la mezcla, y sobre ella se construye el ordenamiento.

```python
def mezclar(izq, der):
    # Combina dos listas ordenadas en una lista ordenada
    resultado = []
    i = 0
    j = 0
    while i < len(izq) and j < len(der):
        if izq[i] <= der[j]:
            resultado.append(izq[i])
            i = i + 1
        else:
            resultado.append(der[j])
            j = j + 1
    while i < len(izq):
        resultado.append(izq[i])
        i = i + 1
    while j < len(der):
        resultado.append(der[j])
        j = j + 1
    return resultado
```

La traza de la clase, con `izq = [2, 4, 7]` y `der = [1, 3, 6]`:

| Comparación | Sale | `resultado` |
|:---:|:---:|---|
| $2$ vs $1$ | 1 | `[1]` |
| $2$ vs $3$ | 2 | `[1, 2]` |
| $4$ vs $3$ | 3 | `[1, 2, 3]` |
| $4$ vs $6$ | 4 | `[1, 2, 3, 4]` |
| $7$ vs $6$ | 6 | `[1, 2, 3, 4, 6]` |
| derecha agotada | 7 | `[1, 2, 3, 4, 6, 7]` |

Cuando una lista se agota, los dos `while` finales copian lo que queda de la
otra, que ya viene ordenado y es mayor que todo lo copiado. Cada vuelta copia
exactamente un elemento y ninguno se copia dos veces: mezclar dos listas con
$n$ elementos en total cuesta $\Theta(n)$, y ese dato va a ser la clave del
análisis.

El primer ciclo tiene su pareja de invariantes, como cualquier `while`:

$$I_0:\; 0 \leq i \leq \mathrm{len}(\mathtt{izq}) \;\wedge\; 0 \leq j \leq \mathrm{len}(\mathtt{der})$$

e $I_1$: `resultado` contiene, en orden, los $i + j$ elementos más pequeños
de las dos listas. La estabilidad va por casos según cuál lista aporta el
menor, el mismo esquema de la búsqueda del repaso. Así, con un invariante
cuya estabilidad se revisa por casos, es como CLRS demuestra la correctitud
de su procedimiento Merge (pp. 31--33); la escritura completa queda como
ejercicio.

Con la mezcla resuelta, el ordenamiento es el esquema de divide y vencerás
aplicado sin más:

```python
def ordenar(lista):
    # Ordena por mezcla: divide, conquista y combina
    if len(lista) <= 1:
        resultado = lista
    else:
        mitad = len(lista) // 2
        izq = ordenar(lista[0:mitad])
        der = ordenar(lista[mitad:len(lista)])
        resultado = mezclar(izq, der)
    return resultado
```

Dividir corta por la mitad, conquistar ordena cada mitad con el mismo
procedimiento, combinar mezcla, y el caso base es la lista de cero o un
elemento, que ya está ordenada.

El árbol de llamadas es la figura 2.4 de CLRS, y en clase se dibujó con 16
elementos: partiendo quedan 2 de 8, luego 4 de 4, luego 8 de 2 y finalmente
16 de 1, el caso base. Son 5 niveles. La lectura es de ida y vuelta: **bajar
partiendo, subir mezclando**. Al regreso, cada nivel junta dos arreglos ya
ordenados, que es el escenario donde mezclar brilla.

## ¿Cuánto cuesta ordenar así?

Dos mitades, $a = b = 2$, y combinar es la mezcla, que cuesta $\Theta(n)$:

$$T(n) = 2\,T(n/2) + \Theta(n).$$

Para resolverla, el conteo por niveles del árbol. Un problema de tamaño $n$,
dos de $n/2$, cuatro de $n/4$, y así hasta los de tamaño 1. Cada nivel del
árbol mueve, sumando todos sus pedazos, exactamente $n$ elementos; y niveles
hay $\lg n + 1$. El total:

$$T(n) = n \, (\lg n + 1) \implies T(n) = O(n \lg n),$$

la cota de los buenos algoritmos de ordenamiento. La diferencia en la
práctica es brutal: para un millón de elementos, un algoritmo cuadrático hace
del orden de un billón de operaciones; el ordenamiento por mezcla, unos
veinte millones. Ahí está la ganancia que el máximo no podía dar: la mezcla
aprovecha el trabajo ya hecho por las dos mitades.

### El método del árbol, en general

En clase quedó dibujada la expansión de la recurrencia, que es la manera
sistemática de llegar a ese conteo. Escribiendo $f(n) = c \cdot n$ para no
pelear con la notación:

$$T(n) = 2\,T(n/2) + cn$$

se expande: el nivel 0 aporta $cn$; el nivel 1, dos términos de $c\,n/2$, que
suman $cn$; el nivel 2, cuatro de $c\,n/4$, que suman $cn$; y en general el
nivel $k$ tiene $2^k$ pedazos de tamaño $n/2^k$ que siempre suman $cn$. ¿Hasta
dónde? Hasta el caso base: $n/2^k = 1$, o sea $k = \log_2 n$. Niveles que
suman $cn$ cada uno, por $\log_2 n + 1$ niveles:

$$T(n) = cn\,(\log_2 n + 1) = O(n \lg n).$$

La base del logaritmo no importa, porque cambiar de base es multiplicar por
una constante y la notación asintótica las ignora. En las próximas sesiones
se verán formas más rápidas de resolver recurrencias; por ahora, el árbol es
el método.

## La anatomía de un algoritmo de divide y vencerás

Del cierre de la clase, el molde general que conviene interiorizar. Estos
algoritmos suelen tener dos funciones:

- **La que combina** (`mezclar`): recibe dos o más soluciones parciales que
  ya cumplen la **propiedad de solución** (aquí, venir ordenadas; en el
  máximo, ser el máximo de su parte) y produce una solución del problema
  mayor que cumple la misma propiedad.
- **La que divide y llama** (`ordenar`): trae el caso base con su solución
  trivial, la partición, las llamadas recursivas y la combinación.

A veces la parte de combinar no existe, porque el propio conquistar deja
resuelto el problema; el quicksort, que aparecerá más adelante, es el ejemplo
clásico. Pero la mayoría de los algoritmos de esta familia siguen el molde
completo.

Un anuncio para la próxima clase: cuando un `while` vive adentro de otro,
cada uno lleva su propia pareja de invariantes, la del interno continuando la
numeración ($I_2$, $I_3$). El miércoles se trabaja con calma; el
[apéndice](Apéndice.md#ejemplo-3-dos-ciclos-anidados) ya trae un ejemplo
completo para adelantar.

## Errores comunes

- **Caso base ausente o mal puesto.** La recursión nunca toca fondo y el
  paso de terminación no tiene de dónde agarrarse.
- **Una partición que no reduce.** Si una de las partes puede quedar del
  tamaño original, el algoritmo se cuelga, igual que un ciclo sin
  terminación.
- **Mezclar olvidando los sobrantes.** Cuando una lista se agota, los
  restantes deben copiarse: los dos `while` finales de mezclar no son de
  adorno.
- **Equivocar $f(n)$ en la recurrencia.** La mezcla cuesta $\Theta(n)$, no
  $\Theta(1)$; con la $f(n)$ errada, el análisis entero da otro valor.

## Ejercicios

1. Escriba un algoritmo de divide y vencerás que calcule la **suma** de un
   arreglo. Plantee su recurrencia y estime el costo.
2. Escriba un algoritmo de divide y vencerás que **cuente cuántas veces
   aparece un valor** en un arreglo.
3. Usando $b^n = (b^{n/2})^2$ cuando $n$ es par, diseñe un algoritmo para
   calcular $b^n$. Plantee una recurrencia como $T(n) = T(n/2) + 1$ y expanda
   algunos niveles: ¿a qué cota llega?
4. Para el primer ciclo de `mezclar`: demuestre la inicialización y la
   estabilidad de sus invariantes $I_0$ e $I_1$, y use la terminación para
   concluir que la mezcla es correcta. La estabilidad se parte en dos casos,
   según cuál lista aporta el menor.

## Ejercicios interactivos

Los dos de divide y vencerás se recorrieron en clase y están en la
[página de ejercicios interactivos](Ejercicios.md#divide-y-venceras):

- [mezclar](widgets/mezclar.html){ target=_blank rel=noopener } — ejecute la
  mezcla copia por copia, proponga la pareja de invariantes del primer
  `while` y arme la demostración completa, con la estabilidad por casos.
- [ordenar](widgets/ordenar.html){ target=_blank rel=noopener } — el
  ordenamiento por mezcla dibujado completo: baje partiendo la lista nivel
  por nivel hasta el caso base y súbala mezclando. La tabla acumula el
  trabajo por nivel y ahí aparece el patrón del $n \lg n$; con 16 elementos,
  los 5 niveles del tablero.

Los de invariantes, `sumar` y `factorial`, siguen disponibles para el repaso.

## Lo que queda pendiente

La escritura formal de la inducción estructural quedó anunciada para la clase
del miércoles con el profesor titular, junto con los ciclos anidados. Para
adelantar, el [apéndice](Apéndice.md) trae la prueba del máximo recursivo
escrita completa y un ejercicio de dos ciclos con sus dos parejas de
invariantes. El material de divide y vencerás del profesor en su página,
incluido el del semestre pasado, cubre lo mismo que esta introducción y es la
referencia para el estilo de los parciales.

## Referencias

- T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein. *Introduction to
  Algorithms*, 3.ª ed., MIT Press, 2009. Sección 2.3, pp. 30--37: divide y
  vencerás, el procedimiento Merge con su invariante (pp. 31--33) y la
  figura 2.4 con el árbol del ordenamiento por mezcla.
- C. Rocha. *Diseño y Análisis de Algoritmos*. Está en la biblioteca.

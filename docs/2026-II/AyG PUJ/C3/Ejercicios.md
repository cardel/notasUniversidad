# Ejercicios interactivos

Los dos algoritmos de la sesión, para recorrer en el navegador. La mecánica
es la de siempre: prediga antes de ejecutar, avance paso a paso y busque
qué se conserva mientras todo lo demás cambia. Esa propiedad es la pareja
de invariantes, y una vez la encuentre el ejercicio abre la demostración
completa: inicialización, estabilidad y terminación.

Aquí el acumulador no existe. Lo que hay es una **ventana** que se encoge,
y el invariante interesante dice que encogerla no cambia la respuesta.

## [buscar](widgets/buscar.html){ target=_blank rel=noopener }

La búsqueda binaria sobre un arreglo ordenado. Ejecute división por
división y mire cómo las posiciones descartadas se van tachando: nadie
vuelve a mirarlas. Proponga las cotas de `ini` y `fin`, y lo que la ventana
conserva en cada chequeo.

Dos cartas van más allá de la traza. Una pregunta por qué es seguro
descartar la mitad izquierda cuando $v \geq \mathtt{lista}[mitad]$ —el paso
que podría perder la respuesta y no la pierde—, y otra por el costo, con la
recurrencia $T(n) = T(n/2) + \Theta(1)$ detrás.

Pruebe el preset donde $v = 5$ no está en el arreglo: el algoritmo recorre
lo mismo y termina en una posición cualquiera, que resulta no ser $v$.

## [bisección](widgets/biseccion.html){ target=_blank rel=noopener }

La misma jugada sin arreglo, sobre una función monótona. La barra muestra
qué parte del intervalo original sigue viva, y el pie recuerda en cada
vuelta la desigualdad $f(a) \leq v \leq f(b)$: ese encierro es el
invariante, y es lo único que la bisección no puede perder.

Las tres funciones —$x^3 + x$, $\sqrt{x}$ y $2^x$— piden distinto número de
vueltas, y todas coinciden con
$\lceil \log_2((b-a)/\varepsilon) \rceil$. Al final, dos preguntas que
suelen costar puntos en el juez: qué promete exactamente el valor devuelto
y qué pasa cuando el objetivo queda fuera del rango de $f$.

## [resolver un problema de juez](widgets/resolver.html){ target=_blank rel=noopener }

Un problema que no se vio en clase —**UVa 10341, Solve It**— atacado con el
método
completo, y con las tarjetas cerradas hasta que la anterior queda resuelta:
entender qué trae la entrada, nombrar la función objetivo, **demostrar** que
es monótona término a término, mirar el rango, decidir si la solución existe,
fijar la tolerancia y recién ahí escribir código.

La tarjeta de la monotonía es el corazón: hay que derivar cada uno de los seis
términos y decidir qué hace en $[0, 1]$ con la restricción que el enunciado le
impone al coeficiente. De ahí sale que $f$ **decrece** —al revés que los
ejemplos de la clase—, y esa inversión es justo la que hace fallar a quien
copia la plantilla sin pensar.

Los tres casos del enunciado están cargados, incluido el que responde
`No solution`. La tarjeta del código deja solo el esqueleto: los huecos son
las decisiones de las tarjetas anteriores, y llenarlos es el ejercicio. La
última tarjeta cierra con lo que hay que revisar antes de enviar y con qué
significa cada veredicto que no sea *Accepted*.

- Enunciado: <https://onlinejudge.org/external/103/10341.pdf>
- Enviar: <https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=25&page=submit_problem&problemid=1282>

## De la clase anterior

Los ejercicios de invariantes de ciclo y de divide y vencerás siguen
disponibles en la [página de la clase 2](../C2/Ejercicios.md): `sumar` y
`factorial` para la pareja $I_0$, $I_1$ clásica, y `mezclar` y `ordenar`
para el esquema recursivo.

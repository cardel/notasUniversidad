
# Como vamos

## Matemáticas

1. Relaciones: A hacia B o $A \mathbb{ R } B \subseteq A \times B$ Propiedades Reflexiva, simetrica, antisimetrica y transitiva
2. Relaciones pueden ser orden parcial (Reflexiva, antisimetrica y transitiva), de equivalencia (Reflexivia, simetrica y transitiva)
3. Relaciones n-arias que entre varios conjuntos
	1. Composicion $A o B$ $(a,b) \in A \wedge (b,c) \in B \therefore (a,c) \in AoB$
	2. Potencia de una relación $$ A^n = \begin{cases}
	   A & \texttt{ si }  n = 1  \\
	   A^{n-1} o A & \texttt{en otro caso}
	   \end{cases}
	   $$
	3. Proyección: Seleccionar un subconjunto dentro de una relación n-aria $A = \{a_1,a_2,\ldots,a_n\}$ proyección $\{a_i,a_j,a_k,\ldots\}$
	4. Join $A = \{a_1,a_2,\ldots,a_k, c_1,c_2 \ldots c_m\}, B = \{b_1,b_2,\ldots,b_p, c_1,c_2 \ldots c_m\}$ el join es  $\{a_1,a_2,\ldots,a_k, c_1,c_2 \ldots c_m, b_1,b_2,\ldots,b_p\}$

## Programación.

1. Elementos de PF
	1. Variables inmutables
	2. Recursión como metodo de solución de problemas
	3. No uso elementos de corte flujo: return, break, continue
	4. No uso de elementos iterativos (for o while)
	5. Uso de funciones de alto orden (funciones que reciben funciones o devuelven funciones)
	6. Toda expresión se reduce a un valor
2. Alcance léxico con los brackets {}
```scala
{
	val x = 10	
	val y = 20
	x+y
}
   //Este bloque se reduce a 30
```
El fenomeno de shadowing
```scala
val x = 10
def f(x:Int):Int = x+2

println(f(20)) //22 oculta el valor de x = 10
```

3. Evaluación de expresiones
	1. De izquierda a derecha
	2. CBV: Todos los parametros se evaluan antes de invocar a la función
	3. CBN Se evaluan unicamente cuando se van a utilizar
4. Funciones y procesos
	1. Recursión lineal --> Proceso recursivo (requiere marcos de pila)
	2. Recursión de cola --> Proceso iterativo (Solo un marco de pila)
	3. Recursión de árbol (Requiere más de un llamado recursivo) no es facil de optimizar.
# Tema

Inducción matematica

1. [Inducción matematica](Inducción%20matematica.md)
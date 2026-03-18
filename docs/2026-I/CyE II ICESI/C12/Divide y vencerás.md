# Divide y vencerás

Esta estrategia divide un problema hasta llegar el caso base. Posteriormente resuelve de forma recursiva y luego los combina.

La R.R que da divide y vencerás

$$
T(n) = \begin{cases}
	\Theta(1) & \texttt{ si } & n = 1 \\
	aT(\frac{n}{b})+D(n)+C(n) && \texttt{En otro caso}
	\end{cases}
	$$
Donde 

1. $a$ es el numero de subproblemas
2. $b$ es el tamaño del subproblema
3. $D(n)$ es el costo de dividir
4. $C(n)$ es el costo de combinar
Esta R.R se soluciona por el método del maestro.

Varios apuntes.

1. Usualmente las complejidades incluyen log(n) 
2. La división suele hacerse por indices evitando crear estructuras nuevas
3. En Scala vamos utilizar Tuplas y splitAt para hacer la división
4. Capturamos los datos con pattern matching

ALgunos algoritmos que usan Divide y Vencerás

1. Busqueda binaria
2. MergeSOrt
3. QuickSort
4. Busqueda del maximo
5. Entre otros


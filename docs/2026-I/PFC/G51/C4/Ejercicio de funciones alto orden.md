
La formula general de la distancia entre dos puntos representados como listas es:

$$
\begin{align}
A = \{a_1,a_2,\ldots,a_n\} \\
B = \{b_1,b_2,\ldots,b_n\} \\
\texttt{dist}_{a,b} = \sqrt[p]{(a_1-b_1)^p+(a_2-b_2)^p+\ldots+(a_n-b_n)^p}
\end{align}
$$
Por ejemplo dado A = List(1,2,3) y B = List(2,4,6)

1. p = 2, $\sqrt[2]{(1-2)^2+(2-4)^2+(3-6)^2}$
2. p = 3, $\sqrt[3]{(1-2)^3+(2-4)^3+(3-6)^3}$
3. Y así sucesivamente

Desarrollar un función que haga este proceso directamente, la firma es:


```scala
def calcularDistancia(a:List[Int],b:List[Int],f:(Int,Int)=>Int, g:Int=>Double)
//f tomar a y b los resta y lo eleva a la p
//g toma el valor de la suma y la saca raiz p Math.pow(valor, 1/p) 
```
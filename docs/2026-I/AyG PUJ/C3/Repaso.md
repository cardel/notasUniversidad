# Notación asintótica

## Conceptos

1. Nos ayuda a entender como se comportan los algoritmos a medida que $n$ crece (el tamaño de la entrada)
2. Tres notaciones
	1. $O$ Que la utilizamos para el **peor caso** $f(n)$ sea $O(g(n))$, $0 \leq f(n) \leq c*g(n), n \geq k$ 
	2. $\Omega$ Que la utilizamos para el mejor caso, $f(n)$ es $\Omega(g(n))$ Sii $0 \leq c*g(n) \leq f(n)$ 
	3. $\Theta$ Es cota ajustada $f(n)$ es $\Theta(g(n))$ Sii $f(n)$ es $O(g(n))$ y $\Omega(g(n))$ 
3. El objetivo de las cotas asintótica es describir la complejidad espacial (uso de memoria) o temporal (número de operaciones) que tienen los algortimos **nos ofrecen un marco para comparar los algoritmos**


## Ejemplo 1

Demuestre que $log(n)$ es $O(n)$ para de la hipótesis que $n < 2^n$ 

$log(n) \leq c*n, c >0, n \geq k$

$2^{log(n)} \leq 2^{cn}$
$n \leq 2^{cn}$
$c = 1$
$n \leq 2^n$ 

Aplico este teorema $f(x), f^{-1}(x), f(f^{-1}(x)) = x$
Ejemplo $y = 2x+3, y = \frac{x-3}{2}$


$f(f^{-1}(x)) = 2\frac{x-3}{2} + 3$
$x - 3 + 3 = x$

## Ejemplo 2

Demostrar que $x²+4x + 17$ es $O(x^3)$

$x²+4x+17 \leq c*x^3$

$\lim_{x \rightarrow \infty} x²+4x+17 \leq c*x^3$

$\lim_{x \rightarrow \infty} \frac{x²}{x³}+\frac{4x}{x³}+\frac{17}{x³} \leq \frac{cx³}{x³}$

$0+0+0 \leq c$
$c \geq 0$

$c = 2$
$x²+4x+17 \leq 2x^3$
$2x^3 -x²-4x-17 \geq 0$

Esto aplica para un $k \geq 3$ 
Demostrar que $x^3$ es $O(x²+4x + 17)$

$x³ \leq c*(x²+4x+17)$

Aplicando el limite

$1 \leq 0$

Esto es una contradicción por lo que es **FALSO**










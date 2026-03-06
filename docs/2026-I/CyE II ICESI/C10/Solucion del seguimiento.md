
# Primer y segundo punto

Muestre que la relación $R$ en las cadenas (x,y) tales que tienen longitud de al menos 6, y coinciden en sus primeros dos bits y ultimo bit.

1. (00111111,001100010001)
2. (101111110, 1000000100000)


Propiedad Simetria

Ejemplo (10000001, 10111111) -> (1011111,10000001)

Dado (a,b) que a y b coinciden en sus dos primeros bits y ultimo bit, tenemos que la coincidencia (b,a) tambien coincidera en dos primeros y su ultimo bit.}

Propiedad reflexiva

Para todas las cadenas de tamaño 6 o más, si tomamos dos veces la cadena, esta coincidira en TODOS sus bits, por lo tanto, coinciden en su primer y ultimo bit.

Propiedad transitiva

Si tenemos (a,b) coincidiendo en sus primeros y ultimo bit, y tenemos (b,c) coincidiendo en sus primeros y ultimo bit, a y c tambien tendrá coincidencia en sus primeros y ultimo bit.

Halle un representante

Reflexiva (00000000,00000000)
Simetrica (00000000,000011000) (000011000,00000000)
Transitiva (00000000,000011000) (000011000,001111111110) implica que existe (00000000,001111111110)

Conclusion dado que la relacion es reflexiva, simetrica y transitiva por lo tanto es de equivalencia

# Tercero punto

```scala
def k = 4
def h(k:Int)Int = k-2

def calculo(a:Int, b:Int, c:Int):INt = {
	if (b==0) c
	else calculo(a,b-1,a+c)
}

calculo(k,h(k),0)
```

Evaluacion por valor

```scala
calculo(4,2,0)
calculo(4,1,4)
calculo(4,0,8)
8
```

# Cuarto punto

Diseñe un algoritmo recursivo que calcule el producto de los numeros impares desde 1 hasta n

## Solución en notatión matemática

$$
f(n) = \begin{cases}
     1 & \texttt{ si } n \leq 1 \\
     n*f(n-2) & \texttt{ si } n \% 2 == 1 \\
     f(n-1) & \texttt{en otro caso}
     \end{cases}
$$

El caso base es cuando n es menor a igual que 1, en este caso retornamos 1, que es el neutro en la multiplicación

El caso recursivo tiene dos variantes

1. Si n es par, entonces llamamos la funcion con n-1 para volverlo impar
2. Si n es impar, entonces multiplicamos n por el llamado n-2 para encontrar el siguiente impar.

```scala
def multiplicarImpares(n:Int):Int = {
	if (n<=1) 1
	else{
		if (n%2 == 1) n*f(n-2)
		else f(n-1)
	}
}
```

Ejemplo

```scala
f(10) = f(9)
f(9) = 9*f(7)
f(7) = 7*f(5)
f(5) = 5*f(3)
f(3) = 3*f(1)
f(1) = 1

f(3) = 3*1 = 3
f(5) = 5*3
f(7) = 7*5*3
f(9) = 9*7*5*3
f(10) = 9*7*5*3
```
Un número primo es aquel es divisible por si mismo y por uno

Un número compuesto es aquel que tiene al menos un divisor mayor que uno y menor que n


# Criba de Erastones

Es un método para estimar los números primos

1. Escriba la lista desde 1 hasta n
2. Empiece por 2 elimine todos los multiplos
3. Luego por 3 elimine todo los mmultiplos
4. Luego por 5 eliminet todos los multiplso


# Cota de los compueestos

Si $n$ es compuesto, entonces tiene un divisor que es menor o igual $\sqrt(n)$ 

Sea n = a.b, el peor caso es que a = b por lo tanto $a =  \sqrt(n)$ , si $a$ es primo, listo, si no, $a$ tiene un divsor primo $p \leq  \sqrt(n)\leq n$. 
Si n = a.b, entonces $a \leq sqrt(n)$ o bien $b \leq \sqrt(n)$ entonces si vemos del otro lado sencillamente es intercambiar los valores

Esto que tiene como implicacion que estimar un primo tiene complejidad $O(\sqrt(n))$ 
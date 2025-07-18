# Clases 3: Complejidad recurrencias y estrategias algorítmicas

# Complejidad algoritmos recursivos

Buscar la formula que describe la complejidad

```python
def f(n):
	if n==0:
		return 1
	else:
		return n + f(n-1)
```

$$
T(n) = T(n-1)+O(1), T(0) = O(1)
$$

Reemplazar la formula

T(n) = T(n-1) + O(1)  | T(n-1) = T(n-2) + O(1)

T(n) =  T(n-2) + O(1) + O (1) = T(n-2) +2*O(1)

T(n) = T(n-3) + O(1) + O(1) + O(1) = T(n-3) + 3*O(1)

T(n) = T(n-4) + O(1) + O(1) + O(1) + O(1) = T(n-4) + 4*O(1)

T(n) = T(n-5) + O(1) + O(1) + O(1) + O(1) + O(1) = T(n-5) + 5*O(1)

---

Encontramos la formula general

T(n) = T(n-k) + k*O(1)

---

---

Buscamos el caso base y resolvemos

T(0) = O(1)

T(n) = T(n-n) + nO(1) = T(0) + nO(1) = O(n)

# Metodo de arbol

Forma de representar

Es ir colocando los llamados hasta que llegamos a los casos base, en el ejemplo de fibunnaci, el arbol se fibunnaci(4) se contruye asi:

                          fib(4)
                    /                  \
                fib(3)                fib(2)
              /        \             /      \
          fib(2)      fib(1)     fib(1)   fib(0)
         /      \        |         |        |
     fib(1)    fib(0)    1        1        0
       |         |
       1         0

En este árbol podemos ver cómo cada llamada recursiva genera dos nuevas llamadas hasta llegar a los casos base (fib(1) = 1 y fib(0) = 0).

Sabemos que este es un arbol binario, como propiedad se tiene que hay 2^k nodos en cada nivel, vamos a suponer que el arbol tiene altura de n-1, por lo tanto vamos hacer la sumatoria desde 2^0 hasta 2^(n-1)

# Estrategias algoritmicas

## Fuerza bruta

¿En que consiste?

- Examinar todas las posibilidades y escoger la mejor
- Ventaja: Siempre encuentra la solución
- Desventaja: Son computacionalmente muy costosas

## Soluciones voraces (greedy)

¿Cual es la estrategia?

Tomar soluciones locales (la mejor)

Tomar del pastel el trozo mas grande

- En el caso del problema de arbol de expansión minima es ir tomando las aristas de menor poderación siempre y cuando no se forme un ciclo
- En el caso de las piedras es ir colocar la piedra en el conjunto de tal forma la diferencia sea la menor posible en ese paso

## Divide y vencerás

Pasos

1. Dividir el problema en subproblemas
2. Dividimos hasta llegar a los caso base (soluciones inmediatas) arreglo de tamaño 1, su maximo es el elemento que contiene
3. Resolver recursivamente (tomar las soluciones de los suproblemas y retorna un solución general)

## Resumen

Aquí está el resumen de las tres estrategias algorítmicas:

**1. Algoritmos de Fuerza Bruta:**

- Consiste en examinar todas las posibilidades y escoger la mejor
- Ventaja: Siempre encuentra la solución
- Desventaja: Son computacionalmente muy costosos

**2. Algoritmos Voraces (Greedy):**

- Se basa en tomar soluciones locales (la mejor opción disponible en cada paso)
- Funcionamiento: Por ejemplo, en un árbol de expansión mínima, va tomando las aristas de menor ponderación siempre que no forme un ciclo
- Desventaja: No garantiza una solución óptima
- Los problemas deben mostrar la propiedad de subestructura optima (una solución está compuesta por soluciones optimas a subproblemas)

**3. Divide y Vencerás:**

- Funcionamiento:
- Divide el problema en subproblemas hasta llegar a casos base (conquistar)
- Los subproblemas deben ser independientes
- Resuelve recursivamente y combina las soluciones para conquistar el problema inicial

Ventaja: Funciona bien cuando no hay subproblemas repetidos. Encuentran la solución optima.

Desventaja: Cuando hay subproblemas repetidos, la complejidad se incrementa (programación dinámica). Más dificiles de implementar.
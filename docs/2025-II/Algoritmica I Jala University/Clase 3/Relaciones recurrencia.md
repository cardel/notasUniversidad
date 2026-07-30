# Definiciones
Es una función que se llama a si misma y se usa para estimar la complejidad de funciones recursivas

$$
T(n) = aT(n-1)+bT(n-2)+\ldots
$$

Algoritmos como la suma recursiva
```java
int sumaRecursiva(int n){
	if (n==0) {
		return 1;
		// O(1) es lo que cuesta retornar
	}
	else {
		return n + sumaRecursiva(n-1) 
		// O(1) lo que cuesta la suma
		// T(n-1) es lo que cuesta el llamado
	}
}
```
Hay un llamado con n - 1 hasta que n sea cero
La ecuación estimada para la complejidad

$$
T(n) = T(n-1) + O(1), T(0) = O(1)
$$

Para resolver aplicamos dos métodos, el método de expansión y el método arbol
## Método de expansión
Es ir reemplazando la función y encontrar un patrón el cual pueda resolver por inferencia (estimación) la ecuación directamente o bien por una sumatoria

$$
T(n) = T(n-1)+ O(1)
$$

$$
T(n-1) = T(n-2)+O(1)
$$

$$
T(n-2) = T(n-3) + O(1)
$$

Encontramos un patrón

$$
T(n) =  T(n-2)+O(1)+O(1)
$$

$$
T(n) =  T(n-3)+O(1)+O(1)+O(1)
$$

Ahora voy a aplicar algo de algebra

$$
T(n) =  T(n-3)+3*O(1)
$$

Se observa un patrón

$$
T(n) =  T(n-k)+k*O(1)
$$

El caso inicial es cuando $k = n$

$$
T(n) =  T(n-n)+n*O(1) = T(0)+nO(1)
$$

Vamos a llegar a $O(1)+nO(1) = O(n)$

## Método de árbol
Consiste en expandir la relación de recurrencia de tal forma encontremos un patrón y podamos resolver
![](attachments/ResolverArbol_annotated.pdf){ type=application/pdf style="min-height:70vh;width:100%"}
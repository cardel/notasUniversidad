# Sesión 09: Arreglos multidimensionales

# Arreglos multidimensionales

## Conceptos

¿Que son?

Arreglos que contienen arreglos como ELEMENTOS

Todos los elementos deben ser del mismo tiempo

Debe ser del mismo tamaño

Para esto tenemos filas y columnas

```python
import numpy as np

a = np.zeros((2,3))
print(a)

[
	[0,0,0],
  [0,0,0]
]

a[1][1] #Fila 2 y columna 2
```

---

¿Como los creamos?

```python
import numpy as np

a = np.zeros((5,6)) #Una matriz que tiene 5 filas y 6 columnas, 5*6
b = np.full((4,5), 8, dtype=int)
#Crea una matriz con 4 filas y 5 columnas llena de 8 y forzamos que sean enteros
c = np.array(
	[
		[1,2,3],
		[2,3,4],
		[5,6,7],
		[9,0,1]
	])
	
	#Es una matriz de 4 filas y 3 columnas
```

---

¿Como los recorremos?

```python
#a es un matriz de 4 x 5

for i in range(a.shape[0]): #Filas
	for j in range(a.shape[1]): #Columnas
		.....
```

Enlaces utiles

- [https://www.coursera.org/learn/learning-how-to-learn](https://www.coursera.org/learn/learning-how-to-learn)
- [https://replit.com/learn/100-days-of-python](https://replit.com/learn/100-days-of-python)
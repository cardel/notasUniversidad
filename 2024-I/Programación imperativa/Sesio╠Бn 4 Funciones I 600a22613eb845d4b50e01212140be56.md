# Sesión 4: Funciones I

Función

Es un algoritmo el cual ejecutamos en nuestro programa principal.

- Nos permiten acortar codigo, por ejemplo, necesito calcular la hipotenusa de estos puntos (1,2) (2,3)(4,5) (6,6), solo necesitamos una función

```python
def hipotenusa(a,b):
	return (a**2+b**2)**0.5
```

Esto lo podemos hacer sin necesidad de calcular 4 veces lo mismo

```python
h1 = hipotenusa(1,2)
h2 = hipotenusa(2,3)
h3 = hipotenusa(4,5)
h4 = hipotenusa(6,6)
```

Hacer tareas ESPECIFICAS

---

Funciones en Python

```python
def nombre(arg1,arg2,arg3,arg4):
	#arg1,arg2,arg3,arg4 dentro de la función
	...cuerpo...
	return salida

sal = nombre(1,2,3,5)
"""
arg1 = 1
arg2 = 2
arg3 = 3
arg4 = 5
"""
```
# Sesión 5: 13 de Marzo Funciones II

Alcance de variables

Variables globales

```python
x = 8 #Variable global
def f(..):
	global var #Variable global
```

Variables locales

```python
def funcion(x,y,z):
	#x,y,z variables locales
	h = x+y+z
	#h es local
```

Estas variables sólo se pueden ver en la función

```python
x = 8
def funcion(x,y,z)
   h = x**2
   
funcion(10)
```

¿Que valor toma x para calcular h?

Toma el valor de 10, porque es el MAS CERCANO

Tenemos una variable x que es global y vale 8, y tenemos en función una local x que por el llamado toma el valor de 10, cuando consulto por x dentro de funcion, se obtiene el valor local (PORQUE ES EL MAS CERCANO)
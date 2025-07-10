# Sesión 3: Variables y condicionales

Variables

- Nombre (caracteres en inglés sin espacios)
- Tipo: ¿CUal es la información que contienen? int, float, str y bool
- Valor ¿Que es lo que contiene?

```python
varA = 5 #Variable entera
varB = 4.2 #Variable flotante
varC = "Hola" #Variable str
varD = 'Hola' #Variable str
varE = True #Variable bool

"""

¿Como se declara un variable?

<nombre> = <valor>
"""
```

---

Operaciones relacionales

Nos permiten comparar cantidades numéricas

<,  < =, >, > =, ==, ! = 

```python
5 > 5 #False
5 != 6 #True
5 == 6 #False
5 >= 6 #False
5 <= 6 #True
5 < 6 #True
varA = 9 #Asignación
varA > 10 #False
```

---

Operadores lógicos

- and Es verdadero cuando ambas expresiones son VERDEDERAS
- or Es verdader cuando una de las dos expresiones es VERDADERA
- not Cambia el valor (T → F) (F → T)

---

Condicionales

Nos permite un flujo en la ejecución, si se cumple una condición ejecutamos unas instrucciones y si no se cumple ejecutamos otras

```python
if (a >= 8):
	#..instrucciones
	print("A es mayor o igual que 8")
else:
	print("A es menor que 8")
```

---

Condicionales anidados

Cuando hay más de una pregunta, si se sigue la relaciónes SI … SINO SI … SINO ..SI SINO

```python
categoria = int(input("Ingrese la categoria "))

if categoria == 1:
	comision = totalVentas*0.1
else:
	if categoria == 2:
		comision = totalVentas*0.25
	else:
		if categoria == 3:
			...
		else:
			....

```

---

Condicional anidado de Python

if elif else

```python
categoria = int(input("Ingrese la categoria "))

if categoria == 1:
	comision = totalVentas*0.1
elif categoria == 2:
	comision = totalVentas*0.25
elif categoria == 3:
	...
else:
	print("Categoria no válida")

```
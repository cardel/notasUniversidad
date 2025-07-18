# Sesión 6: Ciclos for

¿Que es un ciclo?

Es una repetición de un conjunto de instrucciones

Por ejemplo necesitamos imprimir los números del 1 hasta el 5000

---

¿Como vemos los ciclos en el pseudocódigo?

```python
para i = 0 hasta n incrementado 1
  .. Instrucciones ..
  .. i=0,1,2,3,4,5,6,...n
  
para i = n hasta 0 decrementado 1
  .. i = n,n-1,n-2, ..,1,0
```

---

Python

```python
for i in range(0,n):
  #Hace 0,1,2,3,..,n-1
  
for k in range(-10,2*n,3):
   #-10,-7,-4,-1,2,5,8, ... 2*n-1
   
for m in range(10*n,-10,-2):
   #10n, 10n-2, 10n-4, 10n-6, ..,
    -9
```

---

For anidado

Es un for  dentro de otro for

```python
for i in range(1,n):
	for j in range(1,n):
	   ....
```

| i | j |
| --- | --- |
| 1 | 1,2,3,..,n-1 |
| 2 | 1,2,3,…,n-1 |
|  |  |
| n-1 | 1,2,3,…,n-1 |

---

Variable acumuladoras

Son aquellas que se van incrementando/cambiando/concatenando a medida que avanza la iteración

```python
acc = ""
for i in range(0,100):
	acc += f" {i} "
```

---

Variables contadoras

Son aquellas que cuentan algo dentro de un ciclo que cumple una condición (usualmente se requiere un if)

```python
cnt = 0
for i in range(0,n+1):
	if i%2==0 or i%3==0:
		cnt += 1
```
# Proyección

Una proyección transforma una tapla de tamaño n en una tupla de tamaño m, es seleccionar algunos campos de la tupla original

Por ejemplo, si tenemos

(a,b,c,d)
(1,2,3,4)
(x,y,z,w)

Y tenemos $P_{1,2}$ 

(a,b)
(1,2)
(x,y)

# Operador de Join

Un join es una operación que permite integrar dos relaciones ambas n-arias

El join $J_p(R,S)$ donde $n$ es el tamaño de R y m es el tamaño de $S$ con $p \leq m$ y $p \leq n$ es una relación de grado $m+n-p$ 

R es la tupla
$(a_1,a_2,a_{n-p},c_1,c_2,\ldots c_p)$

C1,c2,c3, cp son los elementos que están en común con la relación S

S es la tupla
$(b_1,b_2,b_{m-p},c_1,c_2,\ldots c_p)$

C1,c2,c3, cp son los elementos que están en común con la relación R

El join nos var tuplas

$(a_1,a_2,\ldots,a_{n-p},b_2,b_2,b_{m-p},c_1,c_2,\ldots c_p)$

Ejemplo
R = (Nombre, edad, sexo, salario)
S = (Nombre, cargo, salario)

c = Nombre, salario (tamaño 2)

El join entre R y S
(Nombre, edad, sexo, cargo, Salario)



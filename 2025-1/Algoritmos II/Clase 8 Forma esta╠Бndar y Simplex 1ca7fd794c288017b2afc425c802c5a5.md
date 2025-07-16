# Clase 8: Forma estándar y Simplex

# Forma estándar

```
maximize f(x)

subject
c1x1+c2x2 + ... <= b
....
x1,x2, ... , xn >=0
```

Funcion que minimizar

Multiplicar por -1

```
minimize x1+3x2

maximize -x1-3x2
```

Variable irrestricta

```
maximize 5x + 4y

4x - 3y >= 8
8x - 6y <= 6
x >= 0

Reemplazar y = ya-yb

maximize 5x + 4(ya-yb)

4x - 3(ya-yb) >= 8
8x - 6(ya-yb) <= 6
x >= 0, ya >= 0, yb >= 0
```

Restricciones de igualdad

```
maximize 8x - 3y + 4z

5x + 7y - 8z = 3
5x - 3z <= 8
x, y,z >= 0

;;Se transforma
;;Una restricción de igual de pasa a >= y <=

maximize 8x - 3y + 4z

5x + 7y - 8z <= 3
5x + 7y - 8z >= 3
5x - 3z <= 8
x, y,z >= 0
```

Restricción ≥ 

```
maximize 8x - 3y + 4z

5x + 7y - 8z = 3
5x - 3z <= 8
x, y,z >= 0

;;Se transforma
;;Una restricción de igual de pasa a >= y <=

maximize 8x - 3y + 4z

5x + 7y - 8z <= 3
5x + 7y - 8z >= 3
5x - 3z <= 8
x, y,z >= 0

;;Multiplicamos >= por -1
5x + 7y - 8z <= 3
-5x - 7y + 8z <= -3
5x - 3z <= 8
x, y, z >= 0
```

---

# Forma de holgura

Que son variables de holgura

Son variables que agregamos para convertir ≤ en =, estas van contener un valor que permite convertir la desigualdad en una igualdad

```
z =  8x - 3y + 4z

a = 5x + 7y - 8z - 3
b = -5x - 7y + 8z + 3
c = 5x - 3z - 8
x, y, z,a, b, c >= 0
```

# Método simplex

[2025-04-03-Note-15-27_annotated.pdf](Clase%208%20Forma%20esta%CC%81ndar%20y%20Simplex%201ca7fd794c288017b2afc425c802c5a5/2025-04-03-Note-15-27_annotated.pdf)

# Ejercicio

[ejemplo1_annotated.pdf](Clase%208%20Forma%20esta%CC%81ndar%20y%20Simplex%201ca7fd794c288017b2afc425c802c5a5/ejemplo1_annotated.pdf)
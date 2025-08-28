# Evaluaciones de expresiones por valor

En PF las expresiones se evalúan **de izquierda a derecha**  por ejemplo
```scala
f(x,y,z,w)
/*
f(x ....)
f(..y...)
f(....z..)
f(......w)
```

## Evaluación por valor
En evaluación por valor toda expresión se evalua **una sola vez** antes del llamado de las funciones
```scala
def f(a:Int, b:Int, c:Int):Int = a*b+c
def g(x:Int, y:Int):Int = f(x,y,x+y)+f(y,x,x*y)
val x = 10
val y = 12
g(x,y)
```
1. g(10,y)
2. g(10,12)
3. f(x,y,x+y)+f(y,x,x*y)
4. f(10,y,x+y)+f(x,y,x*y)
5.  f(10,12,x+y)+f(x,y,x*y)
6.  f(10,12,10+y)+f(x,y,x*y)
7. f(10,12,10+12)+f(x,y,x*y)
8. f(10,12,22)+f(x,y,x*y)
9. f(10,12,22)+f(10,y,x*y)
10. f(10,12,22)+f(10,12,x*y)
11.  f(10,12,22)+f(10,12,10*y)
12.  f(10,12,22)+f(10,12,10*12)
13.  f(10,12,22)+f(10,12,120)
14. a*b+c + f(10,12,120)
15. 10*b+c + f(10,12,120)
16.  10*12+c + f(10,12,120)
17.  120+c + f(10,12,120)
18.  120+22 + f(10,12,120)
19.  142 + f(10,12,120)
20.  142 +a*b+c
21.  142 +10*b+c
22. 142 +10*12+c
23. 142 +120+c
24. 142 +120+120
25. 142 +240
26. 382

Siempre se evaluan los parámetros antes de invocar la función, los parámetros sólo se evalúan una vez.

**Ejemplo 1:**
```scala
def suma(a: Int, b: Int): Int = a + b
def operacion(x: Int, y: Int): Int = suma(x, y) * suma(y, x)
val a = 5
val b = 3
operacion(a, b)
```

**Evaluación por valor:**
1. operacion(5, b)
2. operacion(5, 3)
3. suma(x, y) * suma(y, x)
4. suma(5, y) * suma(y, x)
5. suma(5, 3) * suma(y, x)
6. (5 + 3) * suma(y, x)
7. 8 * suma(y, x)
8. 8 * suma(3, x)
9. 8 * suma(3, 5)
10. 8 * (3 + 5)
11. 8 * 8
12. 64

**Conteo: 12 pasos**

---

**Ejemplo 2:**
```scala
def cuadruple(n: Int): Int = n * 4
def combinacion(p: Int, q: Int): Int = cuadruple(p) + cuadruple(q)
val x = 2
val y = 4
combinacion(x, y)
```

**Evaluación por valor:**
1. combinacion(2, y)
2. combinacion(2, 4)
3. cuadruple(p) + cuadruple(q)
4. cuadruple(2) + cuadruple(q)
5. (2 * 4) + cuadruple(q)
6. 8 + cuadruple(q)
7. 8 + cuadruple(4)
8. 8 + (4 * 4)
9. 8 + 16
10. 24

**Conteo: 10 pasos**

---

**Ejemplo 3:**
```scala
def producto(a: Int, b: Int): Int = a * b
def formula(m: Int, n: Int): Int = producto(m, n) - producto(n, m)
val num1 = 7
val num2 = 2
formula(num1, num2)
```

**Evaluación por valor:**
1. formula(7, num2)
2. formula(7, 2)
3. producto(m, n) - producto(n, m)
4. producto(7, n) - producto(n, m)
5. producto(7, 2) - producto(n, m)
6. (7 * 2) - producto(n, m)
7. 14 - producto(n, m)
8. 14 - producto(2, m)
9. 14 - producto(2, 7)
10. 14 - (2 * 7)
11. 14 - 14
12. 0

**Conteo: 12 pasos**

---

**Ejemplo 4:**
```scala
def potencia(base: Int, exp: Int): Int = if exp == 0 then 1 else base * potencia(base, exp-1)
def calculo(a: Int, b: Int): Int = potencia(a, b) + potencia(b, a)
val p = 2
val q = 3
calculo(p, q)
```

**Evaluación por valor:**
1. calculo(2, q)
2. calculo(2, 3)
3. potencia(a, b) + potencia(b, a)
4. potencia(2, b) + potencia(b, a)
5. potencia(2, 3) + potencia(b, a)
6. (2 * potencia(2, 2)) + potencia(b, a)
7. (2 * (2 * potencia(2, 1))) + potencia(b, a)
8. (2 * (2 * (2 * potencia(2, 0)))) + potencia(b, a)
9. (2 * (2 * (2 * 1))) + potencia(b, a)
10. (2 * (2 * 2)) + potencia(b, a)
11. (2 * 4) + potencia(b, a)
12. 8 + potencia(b, a)
13. 8 + potencia(3, a)
14. 8 + potencia(3, 2)
15. 8 + (3 * potencia(3, 1))
16. 8 + (3 * (3 * potencia(3, 0)))
17. 8 + (3 * (3 * 1))
18. 8 + (3 * 3)
19. 8 + 9
20. 17

**Conteo: 20 pasos**
# Sesión 04. Funciones de alto orden

# Conceptos

Funciones son ciudadanos de primera clase 

- No hay diferencia entre valores y funciones, una función se considera un valor
- Una función puede entrar cómo argumento
- Una función puede retornar otra función

---

Funciones anónimas

- Es un valor que representa una función
- Se definen como valores directamente

```scala
(x:Int, y:Int):Int => x+y

def x = (x:Boolean, y:Int):Int => if x y else y+1
```

---

Tipos de funciones

$$
(x_i, x_j, \cdots, x_n) => x_t
$$

```scala
(Int, Int) => Int
(Int, Boolean, Int) => Int
(Int, Boolean) => (Int => Int)
(Int, (Int=>Boolean)) => (Boolean => Int)
```

---

Currificación

- Transformar las funciones de más de un argumento en llamados sucesivos de funciones de 1 sólo argumento
- Esto va ser especialmente util cuando veamos operaciones binarias
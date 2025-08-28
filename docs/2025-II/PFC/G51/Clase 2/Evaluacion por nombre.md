La evaluación por nombre únicamente evalua los argumentos **cuando se utilizan**

```scala
// Función que suma x + 2
def s(x: => Int, y: => Int):Int = x+2

// Función de alto orden toma función como parámetro
def g(f: => (Int,Int) => Int, o: => Int, p: => Int):Int = 
  f(s(o,p),o+p)+s(o,p)  // Aplica f y suma resultado

// Función que duplica el primer parámetro
def x(a: => Int, b: => Int) = a*2

val a = 3  // Valor inmutable
val b = 8  // Valor inmutable

// Llama a g pasando función x como argumento
g(x, a, b)
```

**Relación con programación funcional:**
- **Función de alto orden**: `g` recibe función `f` como parámetro
- **Funciones como ciudadanos de primera clase**: Se pasan como argumentos
- **Composición funcional**: `g` combina `f` y `s` en su implementación
- **Inmutabilidad**: `val` asegura valores constantes
- **Evaluación de expresiones**: Todo se evalúa a valores

## Evaluacion

1. g(x,a,b)
2. f(s(o,p),o+p))+s(o,p) 
3. f(x+2,o+p)+s(o,p) 
4. f(3+2,o+p)+s(o,p) 
5. f(5,o+p)+s(o,p) 
6. a*2 + s(o,p)
7. 5*2+s(o,p)
8. 10 + s(o,p)
9. 10 + x + 2
10. 10 + 3 + 2
11. 13 + 2
12. 15
**Ejemplo 1:**
```scala
def suma(x: => Int, y: => Int): Int = x + y
def operacion(f: => (Int, Int) => Int, a: => Int, b: => Int): Int = f(suma(a, b), b)
def duplicar(x: => Int, y: => Int): Int = x * 2
val m = 4
val n = 2
operacion(duplicar, m, n)
```

**Evaluación por nombre:**
1. operacion(duplicar, 4, 2)
2. f(suma(a, b), b)
3. duplicar(suma(4, 2), 2)
4. duplicar(4 + 2, 2)
5. duplicar(6, 2)
6. x * 2
7. 6 * 2
8. 12

**Conteo: 8 pasos**

---

**Ejemplo 2:**
```scala
def triple(x: => Int): Int = x * 3
def calcular(g: => Int => Int, v: => Int): Int = g(v) + g(v + 1)
def incremento(x: => Int): Int = x + 1
val num = 5
calcular(triple, num)
```

**Evaluación por nombre:**
1. calcular(triple, 5)
2. g(v) + g(v + 1)
3. triple(5) + triple(5 + 1)
4. (5 * 3) + triple(6)
5. 15 + (6 * 3)
6. 15 + 18
7. 33

**Conteo: 7 pasos**

---

**Ejemplo 3:**
```scala
def potencia(base: => Int, exp: => Int): Int = if exp == 0 then 1 else base * potencia(base, exp-1)
def operar(h: => (Int, Int) => Int, x: => Int, y: => Int): Int = h(potencia(x, y), potencia(y, x))
def resta(a: => Int, b: => Int): Int = a - b
val p = 2
val q = 1
operar(resta, p, q)
```

**Evaluación por nombre:**
1. operar(resta, 2, 1)
2. h(potencia(x, y), potencia(y, x))
3. resta(potencia(2, 1), potencia(1, 2))
4. resta(2 * potencia(2, 0), potencia(1, 2))
5. resta(2 * 1, potencia(1, 2))
6. resta(2, 1 * potencia(1, 1))
7. resta(2, 1 * (1 * potencia(1, 0)))
8. resta(2, 1 * (1 * 1))
9. resta(2, 1 * 1)
10. resta(2, 1)
11. 2 - 1
12. 1

**Conteo: 12 pasos**

---

**Ejemplo 4:**
```scala
def maximo(a: => Int, b: => Int): Int = if a > b then a else b
def combinador(f: => (Int, Int) => Int, x: => Int, y: => Int): Int = f(f(x, y), f(y, x))
def producto(x: => Int, y: => Int): Int = x * y
val u = 3
val v = 2
combinador(producto, u, v)
```

**Evaluación por nombre:**
1. combinador(producto, 3, 2)
2. f(f(x, y), f(y, x))
3. producto(producto(3, 2), producto(2, 3))
4. producto(3 * 2, producto(2, 3))
5. producto(6, 2 * 3)
6. producto(6, 6)
7. 6 * 6
8. 36

**Conteo: 8 pasos**

# Conclusiones

La evaluación por valor o nombre **no siempre da el mismo resultado**, hay ciertas situaciones donde evaluación por valor no da un resultado y por nombre si.

```scala
scala> val x:Int = x
                   ^
       warning: value x does nothing other than call itself recursively
val x: Int = 0

scala> def x:Int = x
                   ^
       warning: method x does nothing other than call itself recursively
def x: Int
```

1. val es evaluación por valor
2. def es evaluacion por nombre
3. En el primer caso, aplica evaluación por valor o evaluación ansiosa, x al evaluarse cae en el **valor por defecto** por lo tanto vale 0
4. En el segundo caso, aplicación evaluacion por nombre, es decir que x va evaluarse cuando se necesite o use, esto quiere decir cuando se usa x espera a x y a su vez espera a x, ... esto no genera ... un ciclo infinito

```scala
def f(a: => Int, b: => Int):Int = a

def x:Int = 8
def y:Int = y+1
f(x,y)
```
Aqui nos da 8, porque y nunca se utiliza o se usa

```scala
def f(a: Int, b: Int):Int = a

def x:Int = 8
def y:Int = y+1
f(x,y)
```
Nos da un **ciclo infinito** porque al evaluar, se evalua a y luego, b al intentar evaluar b se queda esperando en valor que nunca definio.

**Diferencias Clave:**

| Aspecto        | `val x: Int = x` (Por Valor) | `def x: Int = x` (Por Nombre) |
| -------------- | ---------------------------- | ----------------------------- |
| **Evaluación** | Inmediata                    | Diferida                      |
| **Error**      | En compilación               | En ejecución                  |
| **Solución**   | Valor por defecto (0)        | Stack overflow                |
| **Naturaleza** | Asignación de valor          | Definición de método          |

**Por qué `val` tiene valor por defecto:**
- Scala prioriza la seguridad en inicialización de variables
- Evita errores de null para tipos primitivos
- Mantiene la consistencia del programa aunque haya referencia circular
- Es una decisión de diseño del lenguaje para prevenir crashes

**Conclusión:** La evaluación estricta (por valor) con valores por defecto previene errores de compilación, mientras que la evaluación por nombre difiere el problema hasta el momento de uso.

Además la evaluación por valor evalua una sola vez los parametros, la evaluación por nombre cada vez que se usan, esto tiene el problema de que si es costoso calcular un valor, el rendimiento podría ser peor que por valor.
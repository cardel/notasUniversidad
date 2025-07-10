# Clase 12 de Marzo de 2025 Relaciones de recurrencia I

# Relaciones de recurrencia (RR)

¿Que son?

- Funciones que un término depende de los anteriores
- Funciones deben tener valores conocidos condiciones iniciales (parada de la recursión)

$$
a_n = c_1a_{n-1}+c_2a_{n_2} + \ldots + c_ka_{n-k} 
$$

---

Soluciones a la R.R

- Si no hay condiciones iniciales pueden ser multiples funciones en términos n
- Para que sea una sola solución deben existir las condiciones iniciales

# Relaciones de recurrencia homogeneas

Que forma tienen

$$
a_n = c_1a_{n-1}+c_2a_{n_2} + \ldots + c_ka_{n-k} 
$$

Las constantes C son diferentes de 0

---

Solución

1. Estime la ecuación caracteristica

$$
r_k = c_1r^{k-1}+c_2r^{k-2}+\ldots+ c_k
$$

2. Forma de la solución es estimar las raices de la ecuación caracteristica

$$
a_n = A(r_1)^n+B(r_2)^n+..+W(r_k)^n
$$

3. Estas constantes se estiman resolviendo el sistema reemplazando por las condiciones iniciales

La relación de recurrencia dada es:

$$
a(n) = 5a(n-1) - 6a(n-2)
$$

### Paso 1: Ecuación característica

Para resolver la R.R, planteamos la ecuación característica:

$$
r^2 - 5r + 6 = 0
$$

Factorizamos la ecuación:

$$
(r - 2)(r - 3) = 0
$$

Por lo tanto, las raíces son:

$$
r_1 = 2, \, r_2 = 3
$$

### Paso 2: Forma general de la solución

La solución general para la R.R es:

$$
a(n) = A(2^n) + B(3^n)
$$

### Paso 3: Determinar las constantes usando las condiciones iniciales

Usamos las condiciones iniciales:

$$
a(0) = 5 \quad \text{y} \quad a(1) = 8
$$

Sustituimos en la solución general:

Para \(a(0)\):

$$
a(0) = A(2^0) + B(3^0) \\
5 = A + B
$$

Para \(a(1)\):

$$
a(1) = A(2^1) + B(3^1) \\
8 = 2A + 3B
$$

Esto forma un sistema de ecuaciones:

1. \( A + B = 5 \)
2. \( 2A + 3B = 8 \)

Resolviendo el sistema:

De la primera ecuación:

$$
B = 5 - A
$$

Sustituimos \(B\) en la segunda ecuación:

$$
2A + 3(5 - A) = 8 \\
2A + 15 - 3A = 8 \\
-A + 15 = 8 \\
A = 7
$$

Sustituimos \(A = 7\) en \(B = 5 - A\):

$$
B = 5 - 7 \\
B = -2
$$

### Paso 4: Solución particular

Sustituimos \(A = 7\) y \(B = -2\) en la solución general:

$$
a(n) = 7(2^n) - 2(3^n)
$$

# Ecuaciones homogeneas con raices repetidas

Si aplicamos este metodo para R.R (2,2)

$$
a_{n} = A2^n+B2^n
$$

Supongamos que la condiciones iniciales son a0 = 3  a1= 5

$$
3 = A + B \\ 5 = 2A + 2B
$$

$$
3 = A + B \\ \frac{5}{2} = A + B
$$

**Esto es un sistema inconsistente**

La solución por cada raiz repetida van multiplicando la solución n¹ , n² , n³ ….

$$
a_{n} = A2^n+Bn2^n
$$

# Ejemplo

Raices (2,2,2,3,3)

$$
a_n = A2^n + Bn2^n + Cn²2^n+ D3^n + En3^n
$$

```scala
object recurrencia1 {
  
  def a(n:Int):Int = {
    if (n==0) 4
    else {
      if (n==1) 6
      else 5*a(n-1)-6*a(n-2)
    }
  }

  def f(n:Int):Int = -2*Math.pow(3,n).toInt+6*Math.pow(2,n).toInt

  def main(args: Array[String]): Unit = {
    val l = (0 to 15).toList
    for (n <- l) {
      println("n = "+n+" a(n) = "+a(n)+" f(n) = "+f(n))
         
    }
      
  }
}
```

[2025-03-12-Note-17-59_annotated.pdf](2025-03-12-Note-17-59_annotated.pdf)
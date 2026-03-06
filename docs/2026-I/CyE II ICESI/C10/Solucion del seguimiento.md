# Solución del seguimiento

## Primer y segundo punto

Muestre que la relación $R$ en las cadenas $(x,y)$ tales que tienen longitud de al menos 6, y coinciden en sus primeros dos bits y último bit.

1. $(00111111,001100010001)$  
2. $(101111110, 1000000100000)$

**Propiedad de simetría**  
Ejemplo: $(10000001, 10111111) \rightarrow (10111111,10000001)$  
Dado $(a,b)$ donde $a$ y $b$ coinciden en sus dos primeros bits y último bit, tenemos que la coincidencia $(b,a)$ también coincidirá en los dos primeros y su último bit.

**Propiedad reflexiva**  
Para todas las cadenas de tamaño 6 o más, si tomamos dos veces la misma cadena, esta coincidirá en **todos** sus bits, por lo tanto, coinciden en sus primeros dos bits y último bit.

**Propiedad transitiva**  
Si tenemos $(a,b)$ coincidiendo en sus primeros dos bits y último bit, y tenemos $(b,c)$ coincidiendo en sus primeros dos bits y último bit, entonces $a$ y $c$ también tendrán coincidencia en sus primeros dos bits y último bit.

**Halle un representante**  
- Reflexiva: $(00000000,00000000)$  
- Simétrica: $(00000000,000011000)$ y $(000011000,00000000)$  
- Transitiva: $(00000000,000011000)$ y $(000011000,001111111110)$ implica que existe $(00000000,001111111110)$

**Conclusión**: Dado que la relación es reflexiva, simétrica y transitiva, por lo tanto es una **relación de equivalencia**.

---

## Tercer punto

```scala
def k = 4
def h(k:Int):Int = k-2

def calculo(a:Int, b:Int, c:Int):Int = {
    if (b==0) c                     // Caso base: si b es 0, retorna c
    else calculo(a,b-1,a+c)         // Llamada recursiva: decrementa b y suma a a c
}

calculo(k,h(k),0)
```

**Evaluación por valor**  
```scala
calculo(4,2,0)
calculo(4,1,4)
calculo(4,0,8)
8
```

---

## Cuarto punto

Diseñe un algoritmo recursivo que calcule el producto de los números impares desde 1 hasta $n$.

### Solución en notación matemática

$$
f(n) = \begin{cases}
     1 & \text{si } n \leq 1 \\
     n \cdot f(n-2) & \text{si } n \% 2 = 1 \\
     f(n-1) & \text{en otro caso}
     \end{cases}
$$

El caso base es cuando $n$ es menor o igual que 1, en este caso retornamos 1, que es el elemento neutro en la multiplicación.

El caso recursivo tiene dos variantes:

1. Si $n$ es par, entonces llamamos la función con $n-1$ para volverlo impar.
2. Si $n$ es impar, entonces multiplicamos $n$ por el llamado $n-2$ para encontrar el siguiente impar.

```scala
def multiplicarImpares(n:Int):Int = {
    if (n<=1) 1                     // Caso base: n ≤ 1, retorna 1
    else{
        if (n%2 == 1) n * multiplicarImpares(n-2)  // n impar: multiplica por el siguiente impar
        else multiplicarImpares(n-1)                // n par: ignora y busca el impar anterior
    }
}
```

**Ejemplo**  
```scala
f(10) = f(9)
f(9) = 9 * f(7)
f(7) = 7 * f(5)
f(5) = 5 * f(3)
f(3) = 3 * f(1)
f(1) = 1

f(3) = 3 * 1 = 3
f(5) = 5 * 3 = 15
f(7) = 7 * 15 = 105
f(9) = 9 * 105 = 945
f(10) = 945
```

---

## Tabla de resumen de conceptos

| Concepto | Descripción | Ejemplo / Observación |
|----------|-------------|----------------------|
| **Relación de equivalencia** | Relación que cumple reflexividad, simetría y transitividad. | $R$ definida sobre cadenas de longitud ≥6 que coinciden en primeros 2 bits y último bit. |
| **Reflexividad** | Todo elemento está relacionado consigo mismo. | $(00000000,00000000)$ |
| **Simetría** | Si $(a,b)$ está en la relación, entonces $(b,a)$ también. | $(00000000,000011000)$ y $(000011000,00000000)$ |
| **Transitividad** | Si $(a,b)$ y $(b,c)$ están en la relación, entonces $(a,c)$ también. | $(00000000,000011000)$ y $(000011000,001111111110)$ implica $(00000000,001111111110)$ |
| **Evaluación por valor** | Estrategia de evaluación donde los argumentos se reducen antes de aplicar la función. | `calculo(4,2,0)` se expande completamente antes de operar. |
| **Recursión** | Técnica donde una función se llama a sí misma para resolver subproblemas. | `multiplicarImpares(n)` llama a `multiplicarImpares(n-2)` o `multiplicarImpares(n-1)`. |
| **Caso base** | Condición que detiene la recursión. | En `multiplicarImpares`, el caso base es `n <= 1`. |
| **Producto de impares** | Multiplicación acumulativa de números impares desde 1 hasta $n$. | Para $n=10$, resultado es $9×7×5×3 = 945$. |

---

## Comentarios adicionales

1. **Relaciones de equivalencia y particiones**: Toda relación de equivalencia sobre un conjunto induce una partición del conjunto en clases de equivalencia. En el ejemplo, las cadenas se agrupan según sus primeros dos bits y último bit.
2. **Recursión vs iteración**: El algoritmo recursivo para el producto de impares puede convertirse en iterativo usando un acumulador, lo cual puede ser más eficiente en memoria.
3. **Evaluación de estrategias**: En el ejemplo de `calculo`, la evaluación por valor garantiza que todos los argumentos se reduzcan antes de proceder, lo cual puede ser menos eficiente que la evaluación por nombre si algunos argumentos no se usan.
4. **Validación de entrada**: En implementaciones reales, se debe validar que $n$ sea no negativo en `multiplicarImpares`, ya que la recursión con valores negativos podría no terminar.
5. **Generalización**: El concepto de relación de equivalencia es fundamental en matemáticas discretas y ciencias de la computación, aplicándose en estructuras de datos (como conjuntos disjuntos) y en teoría de lenguajes formales.
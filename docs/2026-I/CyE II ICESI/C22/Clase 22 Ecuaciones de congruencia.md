La estrategia para resolver las ecuaciones  

$ax \equiv b \pmod{m}$  

Este es el proceso:  

```
ax  congruente b mod m   // Representación de la ecuación lineal de congruencia
```

1. `gcd(a,m) = d` debe cumplir `d | b`; si no, no hay solución (F).  
   // d = máximo común divisor de a y m. La condición necesaria y suficiente para que exista solución es que d divida a b (Teorema de existencia de soluciones en congruencias lineales).

2. Calculo Bezout: `d = a(s) + m(t)`, tomo `s`.  
   // Se obtienen los coeficientes de Bezout (s, t) tales que la combinación lineal de a y m da d. El valor s será usado para construir la solución.

3. Si `d ≠ 1`, entonces `m' = m/d` y `b' = b/d`.  
   // Se reducen el módulo y el término independiente dividiendo por d. Si d = 1, no es necesario este paso, pues m' = m y b' = b.

4. Estimo `X0 = s * b' mod m'`.  
   // X0 es una solución particular de la congruencia reducida a' x ≡ b' (mod m'), donde a' = a/d. Como a' y m' son coprimos, la solución es única módulo m'.

5. Ecuación `x = s * b' + m' * c` (con c ∈ ℤ).  
   // Solución general de la congruencia original. Notar que m' = m/d. Al variar c sobre los enteros se obtienen todas las soluciones, que son d soluciones distintas módulo m (c = 0, 1, …, d-1).

---

### Tabla resumen de conceptos

| Concepto | Descripción | Comentario adicional |
| :--- | :--- | :--- |
| **Ecuación de congruencia lineal** | $ax \equiv b \pmod{m}$ | Se busca $x$ entero tal que $m \mid (ax - b)$. |
| **Condición de existencia** | $d = \gcd(a,m)$ debe dividir a $b$ ($d \mid b$) | Si $d \nmid b$, no hay solución. Es un criterio de consistencia. |
| **Identidad de Bezout** | $d = a s + m t$ | Permite hallar una solución particular a partir del coeficiente $s$. |
| **Reducción** | $m' = m/d,\; b' = b/d$ | Se obtiene una congruencia equivalente con módulo y término reducidos. |
| **Solución particular** | $x_0 \equiv s \cdot b' \pmod{m'}$ | Es la única solución módulo $m'$ en el sistema reducido. |
| **Solución general** | $x = x_0 + k \cdot m'$ con $k \in \mathbb{Z}$ | En módulo $m$ hay exactamente $d$ soluciones distintas: $x_0, x_0+m', \dots, x_0+(d-1)m'$. |

### Ejemplos

**1. d = 1 (solución única módulo m)**  
Resolver $3x \equiv 4 \pmod{7}$  
- $d = \gcd(3,7) = 1$, 1 ∣ 4 ⇒ hay solución.  
- Bezout: $1 = 3\cdot(-2) + 7\cdot 1$ ⇒ $s = -2$.  
- $m' = 7$, $b' = 4$, $x_0 = (-2)\cdot4 \mod 7 = -8 \equiv 6 \pmod{7}$.  
- Solución general: $x \equiv 6 \pmod{7}$.

**2. d > 1 y d ∣ b (d soluciones módulo m)**  
Resolver $6x \equiv 9 \pmod{15}$  
- $d = \gcd(6,15) = 3$, 3 ∣ 9 ⇒ hay solución.  
- Bezout: $3 = 6\cdot(-2) + 15\cdot 1$ ⇒ $s = -2$.  
- $m' = 15/3 = 5$, $b' = 9/3 = 3$, $x_0 = (-2)\cdot3 \mod 5 = -6 \equiv 4 \pmod{5}$.  
- Soluciones módulo 15: $x = 4,\;4+5=9,\;4+10=14$ (tres soluciones).

**3. d > 1 y d ∤ b (sin solución)**  
Resolver $6x \equiv 8 \pmod{15}$  
- $d = \gcd(6,15) = 3$, 3 ∤ 8 ⇒ **no existe solución**.  
- No se puede continuar con el método; la congruencia es inconsistente.
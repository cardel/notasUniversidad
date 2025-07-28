Es un algoritmo de fuerza bruta que trabaja bajo la idea que cada iteración vamos dejan en el fondo del arreglo el elemento más pesado, la siguiente iteración no va a tomar en cuenta ya este elemento

## Ejemplo

Aquí está el paso a paso del algoritmo Bubble Sort para ordenar el arreglo `[29, 10, 14, 37, 14, 2, 7, 18, 21]`, mostrando cada comparación e intercambio como en Visualgo.net:

### **Arreglo inicial:**
`[29, 10, 14, 37, 14, 2, 7, 18, 21]`

### **Pasos del Bubble Sort:**

1. **Primera pasada (i=0):**
   - Compara 29 y 10 → 29 > 10 → **Intercambia** → `[10, 29, 14, 37, 14, 2, 7, 18, 21]`
   - Compara 29 y 14 → 29 > 14 → **Intercambia** → `[10, 14, 29, 37, 14, 2, 7, 18, 21]`
   - Compara 29 y 37 → 29 < 37 → No intercambia.
   - Compara 37 y 14 → 37 > 14 → **Intercambia** → `[10, 14, 29, 14, 37, 2, 7, 18, 21]`
   - Compara 37 y 2 → 37 > 2 → **Intercambia** → `[10, 14, 29, 14, 2, 37, 7, 18, 21]`
   - Compara 37 y 7 → 37 > 7 → **Intercambia** → `[10, 14, 29, 14, 2, 7, 37, 18, 21]`
   - Compara 37 y 18 → 37 > 18 → **Intercambia** → `[10, 14, 29, 14, 2, 7, 18, 37, 21]`
   - Compara 37 y 21 → 37 > 21 → **Intercambia** → `[10, 14, 29, 14, 2, 7, 18, 21, 37]`

2. **Segunda pasada (i=1):**
   - Compara 10 y 14 → 10 < 14 → No intercambia.
   - Compara 14 y 29 → 14 < 29 → No intercambia.
   - Compara 29 y 14 → 29 > 14 → **Intercambia** → `[10, 14, 14, 29, 2, 7, 18, 21, 37]`
   - Compara 29 y 2 → 29 > 2 → **Intercambia** → `[10, 14, 14, 2, 29, 7, 18, 21, 37]`
   - Compara 29 y 7 → 29 > 7 → **Intercambia** → `[10, 14, 14, 2, 7, 29, 18, 21, 37]`
   - Compara 29 y 18 → 29 > 18 → **Intercambia** → `[10, 14, 14, 2, 7, 18, 29, 21, 37]`
   - Compara 29 y 21 → 29 > 21 → **Intercambia** → `[10, 14, 14, 2, 7, 18, 21, 29, 37]`

3. **Tercera pasada (i=2):**
   - Compara 10 y 14 → 10 < 14 → No intercambia.
   - Compara 14 y 14 → 14 == 14 → No intercambia.
   - Compara 14 y 2 → 14 > 2 → **Intercambia** → `[10, 14, 2, 14, 7, 18, 21, 29, 37]`
   - Compara 14 y 7 → 14 > 7 → **Intercambia** → `[10, 14, 2, 7, 14, 18, 21, 29, 37]`
   - Compara 14 y 18 → 14 < 18 → No intercambia.
   - Compara 18 y 21 → 18 < 21 → No intercambia.

4. **Cuarta pasada (i=3):**
   - Compara 10 y 14 → 10 < 14 → No intercambia.
   - Compara 14 y 2 → 14 > 2 → **Intercambia** → `[10, 2, 14, 7, 14, 18, 21, 29, 37]`
   - Compara 14 y 7 → 14 > 7 → **Intercambia** → `[10, 2, 7, 14, 14, 18, 21, 29, 37]`
   - Compara 14 y 14 → 14 == 14 → No intercambia.

5. **Quinta pasada (i=4):**
   - Compara 10 y 2 → 10 > 2 → **Intercambia** → `[2, 10, 7, 14, 14, 18, 21, 29, 37]`
   - Compara 10 y 7 → 10 > 7 → **Intercambia** → `[2, 7, 10, 14, 14, 18, 21, 29, 37]`
   - Compara 10 y 14 → 10 < 14 → No intercambia.

6. **Sexta pasada (i=5):**
   - Compara 2 y 7 → 2 < 7 → No intercambia.
   - Compara 7 y 10 → 7 < 10 → No intercambia.

### **Arreglo ordenado:**
`[2, 7, 10, 14, 14, 18, 21, 29, 37]`

### **Resumen:**
- **Total de pasadas:** 6 (aunque el peor caso es $n-1$ pasadas para $n$ elementos).
- **Intercambios realizados:** 13.
- **Complejidad:** $O(n^2)$ en el peor caso.

# Apuntes sobre el código
Después del for interno colocar
```java
if(!swapped) break;
```

En una iteración de j donde no hayan intercambios, se termina el algoritmo
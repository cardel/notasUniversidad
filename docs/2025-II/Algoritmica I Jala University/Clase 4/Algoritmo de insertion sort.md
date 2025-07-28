
Este algoritmo trabaja bajo la idea de que paulatinamente vamos creando una lista ordenada, iniciamos con el primero y asumimos que es una lista ordenada, y le insertamos el segundo, esto nos crea un arreglo ordenado de dos elementos, al cual vamos a insertar el tercero.

## Ejemplo

Aquí está el paso a paso del algoritmo **Insertion Sort** para ordenar el arreglo `[29, 10, 14, 37, 14, 2, 7, 18, 21]`, explicado como en Visualgo.net:

---

### **Arreglo inicial:**
`[29, 10, 14, 37, 14, 2, 7, 18, 21]`

---

### **Paso 1: Primer elemento (i=1, valor=10)**
- **Comparar 10 con 29** (elementos a la izquierda):
  - 10 < 29 → **Mover 29 a la derecha** → `[10, 29, 14, 37, 14, 2, 7, 18, 21]`
- **Resultado parcial:** `[10, 29, 14, 37, 14, 2, 7, 18, 21]`

---

### **Paso 2: Segundo elemento (i=2, valor=14)**
- **Comparar 14 con 29**:
  - 14 < 29 → **Mover 29 a la derecha** → `[10, 14, 29, 37, 14, 2, 7, 18, 21]`
- **Comparar 14 con 10**:
  - 14 > 10 → **Detener**.
- **Resultado parcial:** `[10, 14, 29, 37, 14, 2, 7, 18, 21]`

---

### **Paso 3: Tercer elemento (i=3, valor=37)**
- **Comparar 37 con 29**:
  - 37 > 29 → **Detener** (no hay cambios).
- **Resultado parcial:** `[10, 14, 29, 37, 14, 2, 7, 18, 21]`

---

### **Paso 4: Cuarto elemento (i=4, valor=14)**
- **Comparar 14 con 37**:
  - 14 < 37 → **Mover 37 a la derecha** → `[10, 14, 29, 14, 37, 2, 7, 18, 21]`
- **Comparar 14 con 29**:
  - 14 < 29 → **Mover 29 a la derecha** → `[10, 14, 14, 29, 37, 2, 7, 18, 21]`
- **Comparar 14 con 14**:
  - 14 == 14 → **Detener** (estable).
- **Resultado parcial:** `[10, 14, 14, 29, 37, 2, 7, 18, 21]`

---

### **Paso 5: Quinto elemento (i=5, valor=2)**
- **Comparar 2 con 37**:
  - 2 < 37 → **Mover 37 a la derecha** → `[10, 14, 14, 29, 2, 37, 7, 18, 21]`
- **Comparar 2 con 29**:
  - 2 < 29 → **Mover 29 a la derecha** → `[10, 14, 14, 2, 29, 37, 7, 18, 21]`
- **Comparar 2 con 14**:
  - 2 < 14 → **Mover 14 a la derecha** → `[10, 14, 2, 14, 29, 37, 7, 18, 21]`
- **Comparar 2 con 14**:
  - 2 < 14 → **Mover 14 a la derecha** → `[10, 2, 14, 14, 29, 37, 7, 18, 21]`
- **Comparar 2 con 10**:
  - 2 < 10 → **Mover 10 a la derecha** → `[2, 10, 14, 14, 29, 37, 7, 18, 21]`
- **No hay más elementos a la izquierda → Detener**.
- **Resultado parcial:** `[2, 10, 14, 14, 29, 37, 7, 18, 21]`

---

### **Paso 6: Sexto elemento (i=6, valor=7)**
- **Comparar 7 con 37**:
  - 7 < 37 → **Mover 37 a la derecha** → `[2, 10, 14, 14, 29, 7, 37, 18, 21]`
- **Comparar 7 con 29**:
  - 7 < 29 → **Mover 29 a la derecha** → `[2, 10, 14, 14, 7, 29, 37, 18, 21]`
- **Comparar 7 con 14**:
  - 7 < 14 → **Mover 14 a la derecha** → `[2, 10, 14, 7, 14, 29, 37, 18, 21]`
- **Comparar 7 con 14**:
  - 7 < 14 → **Mover 14 a la derecha** → `[2, 10, 7, 14, 14, 29, 37, 18, 21]`
- **Comparar 7 con 10**:
  - 7 < 10 → **Mover 10 a la derecha** → `[2, 7, 10, 14, 14, 29, 37, 18, 21]`
- **Comparar 7 con 2**:
  - 7 > 2 → **Detener**.
- **Resultado parcial:** `[2, 7, 10, 14, 14, 29, 37, 18, 21]`

---

### **Paso 7: Séptimo elemento (i=7, valor=18)**
- **Comparar 18 con 37**:
  - 18 < 37 → **Mover 37 a la derecha** → `[2, 7, 10, 14, 14, 29, 18, 37, 21]`
- **Comparar 18 con 29**:
  - 18 < 29 → **Mover 29 a la derecha** → `[2, 7, 10, 14, 14, 18, 29, 37, 21]`
- **Comparar 18 con 14**:
  - 18 > 14 → **Detener**.
- **Resultado parcial:** `[2, 7, 10, 14, 14, 18, 29, 37, 21]`

---

### **Paso 8: Octavo elemento (i=8, valor=21)**
- **Comparar 21 con 37**:
  - 21 < 37 → **Mover 37 a la derecha** → `[2, 7, 10, 14, 14, 18, 29, 21, 37]`
- **Comparar 21 con 29**:
  - 21 < 29 → **Mover 29 a la derecha** → `[2, 7, 10, 14, 14, 18, 21, 29, 37]`
- **Comparar 21 con 18**:
  - 21 > 18 → **Detener**.
- **Resultado final:** `[2, 7, 10, 14, 14, 18, 21, 29, 37]`

---

### **Resumen:**
- **Total de pasadas:** 8 (para un arreglo de tamaño 9).
- **Comparaciones e intercambios:** Se realizan en cada paso hasta encontrar la posición correcta.
- **Complejidad:** 
  - **Peor caso (arreglo invertido):** $O(n^2)$.
  - **Mejor caso (arreglo ya ordenado):** $O(n)$.

### **Arreglo ordenado:**
`[2, 7, 10, 14, 14, 18, 21, 29, 37]` ✅
## Análisis de complejidad
- Mejor caso: El arreglo ya está ordenado, sólo se hace una comparación para cada elemento $O(n)$
- Peor caso: El arreglo está ordenado de forma inversa, es necesario comparar con todos
	- El segundo se compara con el primero: 1 comparación
	- El tercero se compara con los  dos anteriores, 2 comparaciones
	- El cuarto se compara con los tres anteriores, 3 comparaciones
	- Y así hasta el ultimo que se compara n-1 veces
	- La sumatoria nos va a salir 1+2+3+...+n-1 => $O(n²)$
- Caso promedio: Asumimos la mitad de comparaciones de el peor caso $O(n²)$
Este algoritmo puede ofrecer tiempos de ordenamiento en tiempo $O(n)$ 
Pero depende
1. Los valores deben ser positivos
2. El valor máximo debe ser en el orden del tamaño del arreglo, si el arreglo tiene tamaño 10, el valor máximo no debe estar muy lejos. **Dependemos el tamaño del arreglo**
3. Sólo funciona en valores enteros
## Operación
1. Se crea el arreglo de conteo de tamaño valor maximo más 1
2. Se toma cada elemento del arreglo, y vamos a ir incrementado el arreglo contador count[arr[i]]++; que vamos contando cada uno de los elementos del arreglo en el arreglo de conteo, es decir nos va a decir cuentos elementos hay de valor i en el arreglo (i posición)
## Ejemplo
Aquí tienes el paso a paso del algoritmo **Counting Sort** para ordenar el arreglo `[1, 2, 3, 1, 1, 1, 4]`, explicado como en Visualgo.net:

---

### **Paso 1: Encontrar el rango (valor máximo)**
- **Arreglo original:** `[1, 2, 3, 1, 1, 1, 4]`
- **Valor máximo (`k`):** 4 (porque el número más grande es 4).

---

### **Paso 2: Crear el arreglo de conteo (count array)**
- **Tamaño del arreglo de conteo:** `k + 1 = 5` (índices del 0 al 4).
- **Inicializar con ceros:** `count = [0, 0, 0, 0, 0]`.

---

### **Paso 3: Contar las ocurrencias de cada elemento**
- Recorremos el arreglo original y actualizamos `count`:
  - **Elemento 1:** `count[1]++` → `count = [0, 1, 0, 0, 0]`
  - **Elemento 2:** `count[2]++` → `count = [0, 1, 1, 0, 0]`
  - **Elemento 3:** `count[3]++` → `count = [0, 1, 1, 1, 0]`
  - **Elemento 1:** `count[1]++` → `count = [0, 2, 1, 1, 0]`
  - **Elemento 1:** `count[1]++` → `count = [0, 3, 1, 1, 0]`
  - **Elemento 1:** `count[1]++` → `count = [0, 4, 1, 1, 0]`
  - **Elemento 4:** `count[4]++` → `count = [0, 4, 1, 1, 1]`

- **Arreglo de conteo final:** `[0, 4, 1, 1, 1]`  
  *(Significa: hay 0 ceros, 4 unos, 1 dos, 1 tres y 1 cuatro)*.

---

### **Paso 4: Calcular las posiciones acumuladas (opcional para Counting Sort estable)**
- Modificamos `count` para que cada posición indique el último índice donde aparecerá el elemento:
  - `count[0] = 0` (no cambia).
  - `count[1] = count[0] + count[1] = 0 + 4 = 4`
  - `count[2] = count[1] + count[2] = 4 + 1 = 5`
  - `count[3] = count[2] + count[3] = 5 + 1 = 6`
  - `count[4] = count[3] + count[4] = 6 + 1 = 7`

- **Arreglo de conteo acumulado:** `[0, 4, 5, 6, 7]`.

---

### **Paso 5: Construir el arreglo ordenado**
- Recorremos el arreglo original **de derecha a izquierda** (para mantener estabilidad) y colocamos cada elemento en su posición correcta usando `count`:
  1. **Elemento 4:**  
     - `count[4] = 7` → Posición 6 (porque los índices empiezan en 0).  
     - **Arreglo ordenado:** `[ , , , , , , 4]`  
     - Decrementamos `count[4]` a 6.
  2. **Elemento 1:**  
     - `count[1] = 4` → Posición 3.  
     - **Arreglo ordenado:** `[ , , , 1, , , 4]`  
     - Decrementamos `count[1]` a 3.
  3. **Elemento 1:**  
     - `count[1] = 3` → Posición 2.  
     - **Arreglo ordenado:** `[ , , 1, 1, , , 4]`  
     - Decrementamos `count[1]` a 2.
  4. **Elemento 1:**  
     - `count[1] = 2` → Posición 1.  
     - **Arreglo ordenado:** `[ , 1, 1, 1, , , 4]`  
     - Decrementamos `count[1]` a 1.
  5. **Elemento 3:**  
     - `count[3] = 6` → Posición 5.  
     - **Arreglo ordenado:** `[ , 1, 1, 1, , 3, 4]`  
     - Decrementamos `count[3]` a 5.
  6. **Elemento 2:**  
     - `count[2] = 5` → Posición 4.  
     - **Arreglo ordenado:** `[ , 1, 1, 1, 2, 3, 4]`  
     - Decrementamos `count[2]` a 4.
  7. **Elemento 1:**  
     - `count[1] = 1` → Posición 0.  
     - **Arreglo ordenado final:** `[1, 1, 1, 1, 2, 3, 4]`.

---

### **Resultado final:**
`[1, 1, 1, 1, 2, 3, 4]`

---

### **Resumen:**
- **Complejidad:** $O(n + k)$, donde $n$ es el tamaño del arreglo y $k$ el rango de valores.
- **Estable:** Sí (mantiene el orden relativo de elementos iguales).
- **Uso de memoria:** Requiere espacio adicional para el arreglo de conteo.


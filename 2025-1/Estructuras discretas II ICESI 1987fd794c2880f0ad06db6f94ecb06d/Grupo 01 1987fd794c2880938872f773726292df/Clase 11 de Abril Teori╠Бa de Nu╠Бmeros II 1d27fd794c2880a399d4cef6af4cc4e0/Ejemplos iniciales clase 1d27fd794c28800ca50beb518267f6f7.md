# Ejemplos iniciales clase

# Algoritmo de la división

# Ejemplo inicial: Algoritmo de la división

### **Enunciado del problema**

Dividir el número entero **a = 127** entre el divisor **d = 5**, donde **d > 0**. Queremos encontrar el cociente **q** y el resto **r** tales que:

127 = 5q + r con 0 ≤ r < 5.

---

### **Paso 1: Identificar los valores**

- Dividendo: **a = 127**
- Divisor: **d = 5**

---

### **Paso 2: Calcular el cociente q**

El cociente **q** es el mayor entero que multiplicado por **d** no excede al dividendo **a**.

Dividimos 127 ÷ 5 ≈ 25.4.

Tomamos la parte entera hacia abajo (floor): **q = 25**.

---

### **Paso 3: Calcular el resto r**

Usamos la fórmula **r = a − d ⋅ q**:

r = 127 − (5 ⋅ 25) = 127 − 125 = 2.

---

### **Paso 4: Verificar las condiciones**

0 ≤ r < d:

0 ≤ 2 < 5 ✅ (se cumple).

---

### **Paso 5: Expresar el resultado**

La división cumple con el teorema:

127 = 5 ⋅ 25 + 2.

**Notación del algoritmo:**

- Cociente: **q = 127 div 5 = 25**
- Resto: **r = 127 mod 5 = 2**

# Ejemplo Máximo común divisor

### **Ejemplo: Cálculo del máximo común divisor**

Sean **a = 56** y **b = 98**. Queremos calcular el máximo común divisor, denotado como **mcd(56, 98)**.

---

### **Paso 1: Dividir el número mayor por el menor**

Dividimos **98** entre **56**:

98 ÷ 56 = 1 (cociente), residuo = 98 - (56 × 1) = 42.

Ahora calculamos **mcd(56, 42)**.

---

### **Paso 2: Dividir el menor entre el residuo**

Dividimos **56** entre **42**:

56 ÷ 42 = 1 (cociente), residuo = 56 - (42 × 1) = 14.

Ahora calculamos **mcd(42, 14)**.

---

### **Paso 3: Dividir el menor entre el residuo**

Dividimos **42** entre **14**:

42 ÷ 14 = 3 (cociente), residuo = 42 - (14 × 3) = 0.

---

### **Finalización**

Al obtener un **residuo 0**, el último residuo no nulo es **14**. Por lo tanto:

**mcd(56, 98) = 14**

---

### **Explicación final**

El máximo común divisor de **56** y **98** es **14**, ya que es el mayor entero que divide a ambos números sin dejar residuo.

# Minimo común múltiplo

### **Ejemplo: Cálculo del mínimo común múltiplo usando factorización en primos**

Supongamos que queremos calcular el mínimo común múltiplo (mcm) de los números **36** y **48** utilizando su descomposición en factores primos.

---

### **Paso 1: Factorización en primos**

- **36**: Descomponemos en factores primos:
    
    36 = 2 × 2 × 3 × 3 = 2² × 3²
    
- **48**: Descomponemos en factores primos:
    
    48 = 2 × 2 × 2 × 2 × 3 = 2⁴ × 3¹
    

---

### **Paso 2: Tomar los factores primos comunes y no comunes con sus mayores exponentes**

- De los factores **2**: Tomamos el mayor exponente que es 2⁴.
- De los factores **3**: Tomamos el mayor exponente que es 3².

---

### **Paso 3: Multiplicar los factores seleccionados**

mcm(36, 48) = 2⁴ × 3² = 16 × 9 = 144

---

### **Resultado final**

El mínimo común múltiplo de **36** y **48** es **144**.

# Algoritmo de Euclides

### **Paso 1**

- **Divide el número mayor (340) por el menor (100):**340÷100=3(cociente),residuo=340−(100×3)=40.
    
    340÷100=3(cociente),residuo=340−(100×3)=40.
    
    Ahora calculamos mcd(100,40)mcd(100,40).
    

---

### **Paso 2**

- **Divide 100 por 40:**100÷40=2(cociente),residuo=100−(40×2)=20.
    
    100÷40=2(cociente),residuo=100−(40×2)=20.
    
    Ahora calculamos mcd(40,20)mcd(40,20).
    

---

### **Paso 3**

- **Divide 40 por 20:**40÷20=2(cociente),residuo=40−(20×2)=0.
    
    40÷20=2(cociente),residuo=40−(20×2)=0.
    

---

### **Finalización**

Al obtener un **residuo 0**, el último residuo no nulo es **20**. Por lo tanto:

20

20

---

**Explicación final:**

El máximo común divisor de 100 y 340 es **20**, ya que divide a ambos números sin dejar residuo (100÷20=5100÷20=5 y 340÷20=17340÷20=17).
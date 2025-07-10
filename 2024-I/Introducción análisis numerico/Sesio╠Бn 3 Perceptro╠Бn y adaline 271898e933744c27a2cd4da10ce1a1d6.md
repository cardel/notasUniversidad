# Sesión 3: Perceptrón y adaline

Conjuntos linealmente separables

Son aquellos conjuntos de datos que podemos separar con una linea, plano o hiperplano

![Untitled](Sesio%CC%81n%203%20Perceptro%CC%81n%20y%20adaline%20271898e933744c27a2cd4da10ce1a1d6/Untitled.png)

---

Perceptrón

Tenemos una neurona con X entradas, W pesos y b bias

1. Inicializamos los pesos entre -1 y 1
2. Calculamos para un patron x dado la salida y
3. Tomamo el error e = t - y
4. Si el e > 0 actualizamos los pesos la regla del perceptrón
5. Repetimos el proceso hasta que tengamos un ciclo sin ERRORES

---

Regla del perceptrón

$$
w_i = w_i + \eta [t_i - y_i]*x_i
$$

---

Limitaciones del perceptrón

Requiere que los datos sean LINEALMENTE SEPARABLES y que sean problemas de clasificación BINARIA 0 o 1

---

Adaline

Usa la función relu como activación, y se usa la derivada del error cuadrático medio, en general el proceso de entrenamiento es similar al perceptron

---

Regla del gradiente descendiente

Es un método usando derivadas para encontrar el minimo del error en función de los pesos

![Untitled](Sesio%CC%81n%203%20Perceptro%CC%81n%20y%20adaline%20271898e933744c27a2cd4da10ce1a1d6/Untitled%201.png)
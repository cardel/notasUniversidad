# Sesión 5: Métricas perceptrón multicapa

Métricas de entrenamiento

Es la medida del error a medida que el algoritmo itera para encontrar los pesos, se toma el error por iteración, usualmente usamos el EMC (Error cuadrático medio)

$$
E_{mc} = \frac{1}{2} \sum \limits_{it = 1}^{n} (t_{it} - y_{it})^2
$$

A esto se les conoce la FUNCION DE PERDIDA (LOSS)

---

Métricas de desempeño

- Matriz de confusión
- Precisión
- Recall
- f1-score

---

Matriz de confusión

vp = verdaderos positivos, son aquellos que esperamos sean de clase 1 y fueron clasificados como clase 1

vn = verdaderos negativos, son auqellos que esperamos sean de clase 0 y fueron clasificados como clase 0

fp = falsos positivos, son aquellos que esperamos sean de clase 0 y fueron clasificados como 1

fn = falso negativos, son aquellos que esperamos sean de clase 1 y fueron clasificados como clase 0

|  |  | Clase 1 | Clase 0 |
| --- | --- | --- | --- |
|  |  | Esperado | Esperado |
| Clase 1 | Predecido | VP | FP |
| Clase 0 | Predecido | FN | VN |

La diagonal representa los casos CORRECTAMENTE predichos: VP+VN

---

Precisión

Responde a la pregunta ¿Cuantos de lo que CLASIFIQUE están bien?

$$
P = \frac{V_p}{V_p+F_p}
$$

---

Recall

Responde a la pregunta ¿De los que esperaba cuantos se clasificaron correctamente?

$$
R = \frac{V_p}{V_p+F_n}
$$

f1-score

De los que clasifique y los que esperaba ¿Cuantos clasifique correctamente?

$$
f_1 = \frac{2*P*R}{P+R} \\
f_1 = \frac{V_p+V_n}{V_p+F_p+V_n+F_n}
$$

# Discusión

## ¿Para que sirven estas métricas?

Sirven para estudiar que tan bueno es un algoritmo con respecto a los datos en el entrenamiento y en la predición de datos una vez se ha entrenado

- La precisión y el recall por si mismo pueden ser ENGAÑOSOS porque solo nos habla de una clase en especifico, si la otra clase está mal predicha no nos brinda información
- f1-score nos da una mejor medida ya que nos habla del TOTAL, sin embargo, si los datos están desbalanceados (muchos 1 y pocos 0, o viceversa, casos AND y OR) nos puede dar una mala medida.
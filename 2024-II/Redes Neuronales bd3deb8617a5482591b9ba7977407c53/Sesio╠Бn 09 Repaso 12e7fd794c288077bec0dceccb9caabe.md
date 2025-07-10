# Sesión 09: Repaso

Rede Neuronal

- Es el resultado de aplicar una función a una suma ponderada
- Los pesos representan el conocimiento de la red neuronal
- El entrenamiento ajusta los pesos
- La red neuronal se representa como un conjunto de PESOS
- Las redes neuronales requieren que los datos estén balanceados (aprox mismo numero de datos por clase) e independentes (no hay caracteristicas que sean dependientes)
- Las redes neuronales deben trabajar con una gran cantidad de datos
- Los algoritmos buscan ajustar los pesos para que la salida sea lo mas cercana posible a la salida esperada

---

PRocesamiento de datos

- Ajustar las entradas a la función de activación (rangos de trabajo)
- Eliminar ruido o caracteristicas que puedan entorpecer el entrenamiento
- Salidas. Onehotencoding (codificación de uno caliente) donde cada clase corresponde a una salida, en el caso de clasificación binaria se deja una sola salida.

---

Metricas de desempeño

- Precisión: De los predecidos cuantos son correctos
- Recall: De los que esperaba cuantos predije bien
- f1-score: Ambos lados

---

Tensorflow

Librería para la gestión de datos

Nos permite manejar los datos de forma optima, solo cargando los datos que requerimos en memoria y no el total

---

Algoritmos entrenamiento

- Ajustar los pesos
- Perceptron / MLP / Adaline / ….
- Estos tienen configuraciones conocidas como hiperparametros,
- El proceso de ajustar hiperparamentros se llaman tunning
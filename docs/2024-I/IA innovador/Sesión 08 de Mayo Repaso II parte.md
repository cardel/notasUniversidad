# Sesión 08 de Mayo Repaso II parte

---

¿Que librerías tenemos?

1. Keras: Interfaz hacia otras librerías, que nos permite tener un especie de lenguaje alto nivel (facil entendimiento) que conecta con varias API, entre ellas Tensorflow
2. Keras facilita la construcción de RN, al ofrecer diferentes métodos para estructurarlas, Sequential() estructurarla como puzzle
3. Nos permite tambien tunnear la RN (selección de parametros) factor de aprendizaje, regularizacion, función de etc, de una forma facil
4. Tensorflow la construcción de funcion para operar las RN, pero nos ofrece la posibilidad de optimizar le ejecución a través grafos de ejecución.

---

Optimización de los modelos

Estandarización de los datos para que trabajen en la función de activación, con eliminamos ruido (una persona de 100 años en un grupo kinder, se nos daña el promedio de edad) la idea es que los datos queden alrededor de 0 para poderlos diferenciar facilmente (depende activación)

Modificación de la regla perceptrón

$$
w_{i+1} = w_i + \eta e x_i
$$

Para evitar nos diverja, es decir se nos vayan a infinito los pesos (o bien se nos quedan estancado)

---

Scheduling

Muchas veces necesitamos encontrar los parametros para nuestro entrenamiento, pero no se sabe a ciencia cierta cual es el mejor

- Optimizer: Adam, rsmpro ….
- Parametros optimizer:
- Factor de aprendizaje
- Como varia el factor de aprendizaje
- Numero de capas y neuronas por capa
- ……

Lanzo diferentes MV (maquina virtuales) probando diferentes modelos al tiempo y me quedo con los mejores de acuerdo a las métricas (loss, precisión, recall, f1-score, ROC, …..)

NECESITAMOS buena capacidad de procesamiento

El Deep Learning provee soluciones AD_HOC son a la medida, una solución de un problema X no necesariamente sirve para un problema Y, así sea parecido!

---

Regularización

Tener control sobre los pesos, no queremos pesos sesgados (un valor muy elevado de un peso vs valores muy pequeños, ejemplo w1 = 10000, w2 = 10 w3= 1

Dos tipos de regularización l1 = promedio de los pesos esté cercano a cero l2 = desviación estandar (que tanto se parecen) es que estén cerca. Se prefiere l2, sin embargo se pueden combinar

---

Dropout

Desconectar neuronas arbitrariamente, ¿Como lo hacemos? vuelva el peso de la conexión (es) de salida 0
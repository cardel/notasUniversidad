# Sesión 27 de Mayo Redes Recurrentes

# Recursos

[Redes Recurrentes.pdf](Sesio%CC%81n%2027%20de%20Mayo%20Redes%20Recurrentes%209c2a8a253eaa444fa7c9c8e6b9af09ef/Redes_Recurrentes.pdf)

# Redes recurrentes

¿Que son redes recurrentes?

---

¿Como funcionan estas redes?

---

¿Que pasa en diferentes capas?

---

Capacidad de memoria de la red.

Las redes recurrentes son aquellas que toman su salida como entrada adiciona, es diferente a lo que hemos visto hasta ahora que solo teniamos la entrada y la salida se propagaba.

---

Estas neuronas se pueden ver como una pila de neuronas donde una salida conecta la siguiente, esto representa la realimentación donde la salida es una entrada adicional. “Desenrrolado”

![Untitled](Sesio%CC%81n%2027%20de%20Mayo%20Redes%20Recurrentes%209c2a8a253eaa444fa7c9c8e6b9af09ef/Untitled.png)

---

Es lo mismo, pero la capa la consideramos como un sólo bloque.

![Untitled](Sesio%CC%81n%2027%20de%20Mayo%20Redes%20Recurrentes%209c2a8a253eaa444fa7c9c8e6b9af09ef/Untitled%201.png)

---

La realimentación (usar la salida como entrada nos da capacidad de recordar las salidas anteriores)

Depende de que tanto a vamos a almacenar.

A medida que avanzamos el instante t depende fuertemente de t-1, pero no depende tanto de t-2 y así sucesivamente, se pierde información porque la entrada CAMBIA.

Temperaturas meses

[35, 40, 38, 29, 19]

xo = 35, x1 = 40, x2= 38, x3=29, x4=19

Tenemos el caso de la traducción, que depende del CONTEXTO, 

The red car is yours, si solo me queedo con el carro rojo podría perder el contexto de que es tuyo

# Entrenando RNN

¿Como entrenamos la RNN recurrente?

1. Se aplica el paso hacia adelante PERO tomando en cuenta que cada capa debe entrenarse con su la salida hasta que alcanza un ESTADO ESTABLE, una vez pase esto se transmite la salida hacia la siguiente capa que repite el mismo
2. Se propaga el error hacia atrás y se actualizan los pesos como normalmente se hecho.

---

¿Que pasa en RRN recurrentes profundas o con muchas capas?

Repetimos el mismo proceso, las salidas de cada capa se van reciclando hasta que tenemos la salida definitiva

---

Implementación

```python
from keras.layers.SimpleRNN

SimpleRNN(30, return_sequences=True)

#Este parametro return_sequences hace que la red sea recurrente

```

Esto nos retorna un arreglo 2D con los pasos de los tiempos

---

Problema de la memoria a largo plazo

Depende de la información que almacenamos en cada capa, es decir el número de veces que iteamos tomando la salida como entrada. Como solución se diseñaron las redes LSTM.

Una de las redes más potentes para memorización es la 1D-Wavenet, que consiste en apilar cada de tasa de dilación (o el número de veces que se va a tomar la salida como entrada) se establece con factores de potencia de 2:  1, 2,4, 8,16,32,64,….

# Resumen

1. Definimos lo que son las redes recurrentes. Toman un la salida como entrada y se puede como un desenrrolado
2. Definimos como se entrenan estas redes, las consideramos con si fueran unas redes independentes interconectadas (desenrollado)
3. Pensamos en redes con capas, aplica el backpropagation normalmente, sólo que en el paso hacia adelante tenemos que debemos resolver las salidas de cada capa hasta alcanzar el valor estable que dpeende la tasa de dilación (cuanto tiempo voy a esperar)
4. Vimos una arquitectura Wavenet que tiene unas capas convolucionales (las convoluciones funcionan igual que las redes totalmente conectadas) con tiempo de dilación en factores de potencias de 2 incrementales, con la idea que las primeras capas tengan memoria a corto plazo y las siguiente a largo plazo.
5. Vimos que en Keras las podemos implementar usando LSTM (especializada para redes recurrentes) y el parámetro return_sequences=True

[Semana_10_annotated.pdf](Sesio%CC%81n%2027%20de%20Mayo%20Redes%20Recurrentes%209c2a8a253eaa444fa7c9c8e6b9af09ef/Semana_10_annotated.pdf)
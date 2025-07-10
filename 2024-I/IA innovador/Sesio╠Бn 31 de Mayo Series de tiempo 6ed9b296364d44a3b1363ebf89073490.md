# Sesión 31 de Mayo Series de tiempo

## Recursos

[https://colab.research.google.com/drive/1Hi3s3IXGG8SLkOHmGsW0XWHRMq-wPwxG?usp=sharing](https://colab.research.google.com/drive/1Hi3s3IXGG8SLkOHmGsW0XWHRMq-wPwxG?usp=sharing) 

## Apuntes de clase

### Predicción de un valor en el futuro

Modelo sencillo de RNN

```python
model = keras.models.Sequential([
    keras.layers.SimpleRNN(1, input_shape = [None,1])
])
optimizer = keras.optimizers.Adam(learning_rate=0.005)
model.compile(loss="mse", optimizer = optimizer)

history = model.fit(X_train,
										y_train,
										epochs=20, 
										validation_data=(X_valid,y_valid))
```

Este modelo solo tiene una neurona recurrente (1 solo paso) solo contiene una neurona recurrente

---

Modelo un poco más elaborado

```python
model = keras.models.Sequential([
    keras.layers.SimpleRNN(20, return_sequences=True, input_shape=[None,1]),
    keras.layers.SimpleRNN(20, return_sequences=True, input_shape=[None,1]),
    keras.layers.SimpleRNN(1)
])
model.compile(loss = "mse", optimizer = "adam")
history = model.fit(X_train,
										y_train,
										epochs = 20, 
										validation_data = (X_valid,y_valid))
```

Este modelo tiene 2 capas ocultas de 20 neuronas recurrentes cada, al decirle return_sequences=True, vamos a tomar varias veces las salidas de cada capa y ajustamos los pesos. Una vez se haya hecho este proceso, entonces se manda la salida a la siguiente capa.

---

Modelo más elaborado modificado

```python
model = keras.models.Sequential([
    keras.layers.SimpleRNN(20,return_sequences = True, input_shape=[None,1]),
    keras.layers.SimpleRNN(20),
    keras.layers.Dense(1)
])
model.compile(loss="mse", optimizer="adam")
history = model.fit(X_train,y_train, 
										epochs=20, 
										validation_data=(X_valid,y_valid))
```

A diferencia del anterior, la segunda capa sólo tiene un paso de memoria, es decir la salida solo se devuelve una vez.

### Predicción de varios valores a futuro

¿Que cambia en el diseño de las redes?

Ya no tenemos una sola salida, si no n salidas, donde n es el número de datos que QUEREMOS PREDECIR.

```python
model_simple = keras.models.Sequential([
    keras.layers.Flatten(input_shape=[50,1]),
    keras.layers.Dense(10)
])

model_mas_complejo = keras.models.Sequential([
    keras.layers.SimpleRNN(20, return_sequences=True, input_shape=[None, 1]),
    keras.layers.SimpleRNN(20),
    keras.layers.Dense(10)
])
```

¿Que diferencia vimos?

La diferencia es que el modelo con memoria (recurrentes) se aproxima mucho mejor a los datos futuros (modelo de juguete)

### Diferentes tipos de neuronas recurrentes

LSTM

Muy precisa, pero costosa en recursos

```python
model = keras.models.Sequential([
    keras.layers.LSTM(20,return_sequences=True, input_shape=[None,1]),
    keras.layers.LSTM(20,return_sequences=True),
    keras.layers.TimeDistributed(keras.layers.Dense(10))
])
```

La capa TimeDistributed permite tomar las salidas en todos los tiempos de las capas anteriores (permite tener memoria a largo plazo)

---

GRU

Es menos costosa en recursos, pero no es tan buena como LSTM

```python
model = keras.models.Sequential([
    keras.layers.GRU(20, return_sequences=True, input_shape=[None,1]),
    keras.layers.GRU(20, return_sequences=True),
    keras.layers.TimeDistributed(keras.layers.Dense(10))
])
```

---

GRU + Conv

De bajo costo, pero mejora el rendimiento del modelo

```python
model = keras.models.Sequential([
    keras.layers.Conv1D(filters = 20, kernel_size = 4, strides = 2, padding = "valid", input_shape=[None,1]),
    keras.layers.GRU(20, return_sequences=True),
    keras.layers.GRU(20, return_sequences=True),
    keras.layers.TimeDistributed(keras.layers.Dense(10))
])
```
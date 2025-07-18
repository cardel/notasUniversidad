# Sesión 07 de Junio Práctica PLN

## Recursos

[https://colab.research.google.com/drive/1oZWgABvh9r2gCHHDG_2-DkygYRhzVOUq?usp=sharing](https://colab.research.google.com/drive/1oZWgABvh9r2gCHHDG_2-DkygYRhzVOUq?usp=sharing) 

https://www.tensorflow.org/api_docs/python/tf/data/Dataset#__len__

[https://keras.io/api/callbacks/model_checkpoint/](https://keras.io/api/callbacks/model_checkpoint/) 

## Carga de datos, procesamiento y generación del modelo para GPT (Generación de texto)

¿Como se transforman los datos a numeros?

```python
text_vec_layer = tf.keras.layers.TextVectorization(split = "character", standardize = "lower")
text_vec_layer.adapt([quijote_text])text_vec_layer.adapt([quijote_text])
encoded = text_vec_layer([quijote_text])[0]
```

Estamos transformando a minusculas todo el texto y luego estamos haciendo embeding (transformarlos numeros)

---

¿Como separamos los datos?

- Datos de entrenamiento (70%)
- Datos de pruebas (20%)
- Datos de validación (10%)

---

¿Que modelo creamos?

```python
#Creamos un modelo sencillo
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(input_dim = n_tokens, output_dim = 16),
    tf.keras.layers.GRU(128, return_sequences = True),
    tf.keras.layers.Dense(n_tokens, activation = "softmax")
])
#Compilamos
model.compile(loss="sparse_categorical_crossentropy", optimizer="nadam",
              metrics=["accuracy"])

```

Este modelo tiene una capa de Embedding (vectores numericos), GRU (red recurrente con memoria), Dense (que se encarga de clasificar)

---

¿Como entrenamos el modelo?

```python
model_ckpt = tf.keras.callbacks.ModelCheckpoint(
    "quijote_modelo", monitor="val_accuracy", save_best_only=True)
```

Creamos checkouts para guardar en cada epoca, porque hay riesgo de saturar el sistema

```python
history = model.fit(train_set, validation_data = valid_set, epochs = epochs, callbacks = [model_ckpt])
```

---

¿Como usamos el modelo?

```python
#Creamos una función llamada next char para crear texto nuevo
def next_char(text, temperature = 1):
    y_proba = quijote_modelo.predict([text])[0,-1:]
    rescaled_logits = tf.math.log(y_proba)/temperature
    char_id = tf.random.categorical(rescaled_logits, num_samples = 1)[0,0]
    return text_vec_layer.get_vocabulary()[char_id+2]
```

Esta función genera los siguientes caracteres, se debe de llamar tantas veces se quieran generar

---

¿Como tenemos más reconocimiento de contexto en el modelo? Es decir más memoria

```python
#OK sigue aplicar el modelo secuencial en keras - embedding, GRU, Dense
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(input_dim=n_tokens, output_dim=16,
                              batch_input_shape=[1, None]),
    tf.keras.layers.GRU(128, return_sequences=True, stateful=True),
    tf.keras.layers.Dense(n_tokens, activation="softmax")
])
```

Los parametros return_sequences=True, stateful=True permiten tener más memoria en la RNN

# Analisis de sentimientos (Clasificación de texto)

¿Que tipos de datasets son utiles?

Datasets de clasificación, en este caso imbd_reviews que son comentarios positivos o negativos de peliculas (2011)

---

¿Que tipo de modelo?

```python
model = tf.keras.Sequential([
    text_vec_layer,
    tf.keras.layers.Embedding(vocab_size, embed_size, mask_zero = True),
    tf.keras.layers.GRU(128),
    tf.keras.layers.Dense(1, activation = "sigmoid")
])
```

La salida es 1, porque vamos a clasificar 0 como comentario negativo y 1 como comentario positivo

mask_zero = True elimina el primer caracter (padding) salto de linea, esto nos añade ruido, al eliminarlo mejora el rendimiento del modelo.

## Traducción de textos

Codificación de los datos

```python
#Convierte ingles a números
text_vec_layer_en = tf.keras.layers.TextVectorization(vocab_size, output_sequence_length=max_length)

#Convierte Español a números
text_vec_layer_es = tf.keras.layers.TextVectorization(vocab_size, output_sequence_length = max_length)

#Usa Adapt para computar un vocabulario de strings desde los tokens en tu vocabulario vectorizado (se tarda)
text_vec_layer_en.adapt(sentences_en)

text_vec_layer_es.adapt(([f"startofseq {s} endofseq" for s in sentences_es]))

```

---

Preparación del encoder y decoder

1. Transformamos con una capa de Input
2. Luego pasamos auna capa de Embeding mask_zero = True

### Encoder (ingles a numeros)

```
embed_size = 128

encoder_inputs = tf.keras.layers.Input(shape=[], dtype = tf.string)
encoder_input_ids = text_vec_layer_en(encoder_inputs)
encoder_embedding_layer = tf.keras.layers.Embedding(vocab_size, embed_size, mask_zero = True)
encoder_embeddings = encoder_embedding_layer(encoder_input_ids)

```

### Decoder (números a español)

```python
decoder_inputs = tf.keras.layers.Input(shape=[], dtype=tf.string)
decoder_input_ids = text_vec_layer_es(decoder_inputs)
decoder_embedding_layer = tf.keras.layers.Embedding(vocab_size, embed_size, mask_zero=True)
decoder_embeddings = decoder_embedding_layer(decoder_input_ids)
```

---

Generación del modelo

1. Capa de codificación (Texto en ingles)
2. Capa de decodificación (Que transforma a español)

```python
model = tf.keras.Model(inputs = [encoder_inputs, decoder_inputs], outputs = [Y_proba])
```

---

Mejoras al modelo

- Podemos incluir una capa de atención en el encoder para realizar tareas de dropout o regulación cuando los pesos tienen problemas (mejora entrenamiento)

```python
#Arma un modelo secuencial con cuna capa GRU y una capa GRU bidireccional
encoder = tf.keras.layers.Bidirectional(
    tf.keras.layers.LSTM(256, return_state=True))
```

Incluimos una capa bidireracional para poder evaluar en el encoder los problemas que hayan con los pesos en el entrenamiento.
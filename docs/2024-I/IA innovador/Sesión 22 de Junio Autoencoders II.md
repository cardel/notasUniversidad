# Sesión 22 de Junio: Autoencoders II

## Recursos

- [https://colab.research.google.com/drive/11cckusQFtUnLhOLIbn7W7v-yXuHVrqKX?usp=sharing](https://colab.research.google.com/drive/11cckusQFtUnLhOLIbn7W7v-yXuHVrqKX?usp=sharing) Autoencoder recurrente
- [https://colab.research.google.com/drive/1bbJPHmp3WgpiokuxQ1nfVjHW_YZX48cQ?usp=sharing](https://colab.research.google.com/drive/1bbJPHmp3WgpiokuxQ1nfVjHW_YZX48cQ?usp=sharing) Autocoder ruido
- [https://colab.research.google.com/drive/1y5-ev41FoyNEaztLZ1LivknGeHECEb5V?usp=sharing](https://colab.research.google.com/drive/1y5-ev41FoyNEaztLZ1LivknGeHECEb5V?usp=sharing) Autoencoder disperso

## Apuntes de clase

Autoencoder recurrente: parte encoder

```python
#Encoder capas de LSTM con la idea de transformar la entrada en secuencias, es tomar fila por fila, como una secuencia:
r_encoder = keras.Sequential(
    [
        keras.layers.LSTM(100, return_sequences=True),
        keras.layers.LSTM(30)
    ]

)
```

¿Que sucede aqui? Pasamos la imagen 28x28, en un autoencoder de 100 neuronas (return secuences vamos a usar la salida de la capa para reentrenarla)y luego a uno de 30 neuronas, entonces esta es nuestra SALIDA (CODIFICACION)

---

Autoencoder recurrente parte decoder

```python
r_decoder = keras.Sequential(
    [
        keras.layers.RepeatVector(28), #El numero de veces que se genera la secuencia de salida
        keras.layers.LSTM(100, return_sequences=True),
        keras.layers.Dense(28) #Tamaño de la salida
    ]
)
```

Tomamos la salida de 30 del anterior

Luego de esto pasamos una de 100 (igual que en el encoder) posteriormente salimos con un densa de 28, esta de 28 se va a convertir en una secuencia de 28x28 ¿Porque? La salida es una secuencia de un vector de 28 repetido 28 veces, dado la capa de repeat vector.

---

Autoencoders para eliminar ruido

- Usualmente son capas Densas
- Se trata de tener varias capas ocultas, ejemplo tiene dos capas ocultas para tener mayor poder de identificacion de patrones
- En el ejemplo, lo que hacemos es sumar un ruido aleatorio a la imagen para dañar la imagen y tratar de recuperar la original

---

Autoencoder disperso

- Se busca que la capa de codigo (salida del encoder) tenga separado las caracteristica de la imagen
- ¿Cuales son las caracteristicas? Son abstractas, sencillamente son patrones encontrados por la red neuronas, algunos activan algunas neuronas otros no
- Esto permite que la salida del encoder sea más representativa
- ¿Como se hace? Agregamos regularización L1 a la salida del encoder, para buscar que los pesos de esas neuronas su suma sea igual a cero, es decir que sean valores cercanos a cero

```python
#Encoder
encoder = keras.Sequential([
    keras.layers.Flatten(input_shape=[28, 28]),
    keras.layers.Dense(100, activation="relu"),
    keras.layers.Dense(300, activation="sigmoid"),
    keras.layers.ActivityRegularization(l1=1e-14)
])

```

La capa ActivityRegularization agrega la regularización L1 al encoder.

Mientras que el decoder y el resto del proceso es como lo hemos visto.

---

## Resumen

1. Se recordó el tema de los retos y el curso de amazon, reto1, 2 y 3 (calificacion automatica) no deben usar librerias, los reto 1, 2 y 3 de calificacion manual reciben son los ipynb descargados de Colab
2. Vimos como mandar un laboratorio en el curso de aws, primero activa el lab, luego hace clic en Aws, despues hace clic en SageMaker y busca la opcion Notebooks, alli aparecera el del trabajo, una vez finalizado, sencillamente darle Submit
3. Vimos los autoencoders recurrentes, se asume que una imagen (matriz) cada fila es una secuencia de columnas, tener en cuenta las capas LSTM en el enconder, la capa repeat vector en la entrada del decoder y la capa de salida Densa, para reconstruir la imagen (repeat vector (filas) x dense (columnas))
4. Vimos autoencoders para limpiar ruido en imagenes, estos al ser capaces de reconocer patrones en imagenes pueden ignorar el ruido en el reconstruccion
5. Vimos autoencoders dispersos, la idea es que el codigo (capa de salida del encoder) conserve las caracteristicas de las imagenes en un pequeño grupo de neuronas, esto hace que se aproveche mejor la capa de codigo ¿Como se hace? Se aplica regularización l1 en el encoder, ¿Como se hace? con la capata activityRegularization.
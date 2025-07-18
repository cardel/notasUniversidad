# Sesión 22 de Mayo Redes Convolucionales + imágenes

## Recursos

[https://colab.research.google.com/drive/1yg6xoSGk8-R-kdkAWa6HrGkB1f2rs6Qn?usp=sharing](https://colab.research.google.com/drive/1yg6xoSGk8-R-kdkAWa6HrGkB1f2rs6Qn?usp=sharing) 

[https://colab.research.google.com/drive/1oihv_3kZEUSuxI-ceYYHiSHs3GY4l6he?usp=sharing](https://colab.research.google.com/drive/1oihv_3kZEUSuxI-ceYYHiSHs3GY4l6he?usp=sharing) 

## Apuntes de clase

¿Como puedo ingresar puedo generar una red convolucional?

1. Cargar las imagenes, estas deben tener el mismo tamaño
2. Generar la red convolucional
3. Compilarla seleccionando el optimizer, la función de loss y las métricas
4. Entrar el modelo

```python
modelo = Sequential()
modelo.add(Input(shape=(28,28,1))) #Capa de entrada
modelo.add(Convolution2D(64, kernel_size=3)) #Vamos a generar 64 convoluciones
modelo.add(MaxPooling2D(strides=(2,2))) #Capa de pooling (reducir dimension)
modelo.add(Convolution2D(32, kernel_size=3)) #Vamos a generar 32 convoluciones
modelo.add(MaxPooling2D(strides=(2,2))) #Capa de pooling (reducir dimension)
modelo.add(Flatten()) #Aplanar
modelo.add(Dense(10, activation="softmax"))

modelo.compile(optimizer="adam",loss="categorical_crossentropy", metrics=["accuracy"])

modelo.fit(x_train,y_train,
           batch_size=2000, #Es el número de entradas por gradiente (lote)
           epochs=15,  #Número de epocas
           validation_data=(x_test,y_test)) #Calcular el accuracy
```

## Modelos entrenados vs preentrenados

1. Los modelos preentrenados ya vienen unas categorias especificas, ejemplo del elefante: 

```python
print('Predicted:', decode_predictions(preds, top=3)[0])
# Predicted: [(u'n02504013', u'Indian_elephant', 0.82658225), (u'n01871265', u'tusker', 0.1122357), (u'n02504458', u'African_elephant', 0.061040461)]
```
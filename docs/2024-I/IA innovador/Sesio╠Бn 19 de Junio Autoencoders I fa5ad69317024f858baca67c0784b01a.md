# Sesión 19 de Junio: Autoencoders I

## Recursos

- [https://colab.research.google.com/drive/1o1k7A3_32jV7fzFjVwN02cmociprb3Em?usp=sharing](https://colab.research.google.com/drive/1o1k7A3_32jV7fzFjVwN02cmociprb3Em?usp=sharing) Colab de autoencoder basico
- [https://colab.research.google.com/drive/12zmbEPOGY7l8HmmYyUIfSKpmd-bSlS7P?usp=sharing](https://colab.research.google.com/drive/12zmbEPOGY7l8HmmYyUIfSKpmd-bSlS7P?usp=sharing)  Autoencoder MINST
- [https://colab.research.google.com/drive/1FaUjYYh2udlgshczh38iRaMzGVn2MZBR?usp=sharing](https://colab.research.google.com/drive/1FaUjYYh2udlgshczh38iRaMzGVn2MZBR?usp=sharing) Autoencoder convolucional MINST

[Semana_13_annotated.pdf](Sesio%CC%81n%2019%20de%20Junio%20Autoencoders%20I%20fa5ad69317024f858baca67c0784b01a/Semana_13_annotated.pdf)

## Autoencoders Parte I

¿Que es un autoencoder?

Es una RN que permite reproducer en la salida la entrada

La idea es aprender patrones de los datos de entrada

![Untitled](Sesio%CC%81n%2019%20de%20Junio%20Autoencoders%20I%20fa5ad69317024f858baca67c0784b01a/Untitled.png)

---

¿Como esta compuesto un autoencoder?

Esta compuesto por un encoder, que convierte la entrada en una representación latente (identificacion de caracteristicas)

El decoder toma la entrada latente (representacion )  y la convierte de vuelta en la salida

---

¿Que tipos de autoencoders hay?

1. Dense (es un MLP normal)
2. Convolucional, el encoder tiene capas Convolucionales y el decoder tiene capa Convolucionales transpuesta

---

Caso 1: Dense

1. Se tiene que el tamaño de la capa de entrada debe ser igual a la salida
2. La estructura del enconder tiene una ultima capa de codigo (es la representacion, ejemplo encoder 100, 200, 30 (la capa de codigo tiene 30 neuronas, 30 caracteristicas)
3. La estructura del decoder tiene una primera capa igual a la ultima del encoder y asi sucesivamente al reves, en el caso anterior: 200, 100, salida = tamaño de la entrada

---

Caso 2: Convolucional

1. Encoder: convolucionales que aplica kernels a la imagen y aumenta la dimension, tenemos capas de pooling para reducir su tamaño
2. Decoder: Tiene capas convolucionales transpuestas que hacen lo contrario de las capas convolucionales y reducen la dimension, la capa de salida debe ser igual al input del encoder.
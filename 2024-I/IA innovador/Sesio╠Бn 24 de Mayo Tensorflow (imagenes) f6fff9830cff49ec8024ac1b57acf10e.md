# Sesión 24 de Mayo Tensorflow (imagenes)

## Recursos

[https://colab.research.google.com/drive/1T-bgm5k8M5b8_FSKu-TZfQJFwg4TW72X?usp=sharing](https://colab.research.google.com/drive/1T-bgm5k8M5b8_FSKu-TZfQJFwg4TW72X?usp=sharing) 

## Procesar datos con TensorFlow

¿Como cargamos datos?

¿Como visualizamos los datos?

¿Como modificamos los datos

¿Como filtramos los datos?

Sólo retornamos los que cumplan alguno criterio

Otras funciones utiles

```python
tf.data.Dataset.from_tensor_slices(Mexico)
```

Cargamos los datos y se nos genera un tensor (Escalar) para cada dato

Es necesario iterar

```python
for item in dataset:
	#Cada item es un elemento
```

```python
dataset.map(lambda x: ...)
```

```python
dataset.filter(lambda x: ...)
```

1. repeat(n) repetir n veces el dataset
2. shuffle es reordenar aleatoriamente el tensor

## Caso de Housing

¿Como cargamos el dataset?

¿Como partimos los datos?

¿Que procesamos?

¿Como procesamos imágenes?

¿Como colocamos los nombres de la clasificación?

¿Que se hace con las imágenes?

```python
from sklearn.datasets import fetch_california_housing

```

Partimos en 3 conjuntos

1. Datos de entrenamiento: 60%, se utilizan para entrenar la red neuronal
2. Datos de validación: 20% se utilizan para calcular el error de entrenamiento
3. Datos de prueba. 20% se utilizan para las métricas de rendimiento

Aplicamos una normalización zscore (datos con media 0 y desviación 1)

Podemos tener carpetas de imágenes que indican su categoría

```python
"""
hotdogs/categoria1
hotdogs/categoria2
"""
#Cargamos los nombres de archivos de una carpeta
images_ds=tf.data.Dataset.list_files

##Cargamos las imagenes
**def process_image(file_path):
    label = get_label(file_path)
    img = tf.io.read_file(file_path)
    img = tf.image.decode_jpeg(img)
    img = tf.image.resize(img, [32,32])
    return img, label**
```

Tomar los nombres de las carpeta

```python
def get_label(file_path):
    parts = tf.strings.split(file_path, os.path.sep)
    return parts[-2]
```

Como las imagenes tienen valores entre 0 y 255 lo que hacemos es scalar dividiendo por ese valor 

```python
#Hay que hacer el scale de la imagen
def scale(image,label):
    return image/255, label
    
train_ds = train_ds.map(scale)
```
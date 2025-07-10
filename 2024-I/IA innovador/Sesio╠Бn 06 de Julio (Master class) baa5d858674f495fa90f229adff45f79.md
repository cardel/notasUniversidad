# Sesión 06 de Julio (Master class)

[Master_Class_3_annotated.pdf](Sesio%CC%81n%2006%20de%20Julio%20(Master%20class)%20baa5d858674f495fa90f229adff45f79/Master_Class_3_annotated.pdf)

# Redes recurrentes

## Recursos

[https://colab.research.google.com/drive/16-HF5hQqQw32KIld8i4VG1HwqTPg-GK6?usp=sharing](https://colab.research.google.com/drive/16-HF5hQqQw32KIld8i4VG1HwqTPg-GK6?usp=sharing)  

## Definiciones

¿Que son?

- Son redes en las cuales la salida es una entrada adicional
- Para se entrenamiento podemos considerar un secuencia (acordeon) a lo largo del tiempo

![Untitled](Sesio%CC%81n%2006%20de%20Julio%20(Master%20class)%20baa5d858674f495fa90f229adff45f79/Untitled.png)

En general la salida en términos del tiempo es:

$$
y_i = \phi(w_x\times x_i + b + w_y \times y_{i-1})
$$

En caso de capas se asume la capa como una sola neurona que recibe un vector de entrada y emite un vector de salida

---

¿Que redes recurrentes secuencia a secuencia?

Estas redes reciben un dato histórico, ejemplo, temperaturas de los ultimos 5 dias y se trata de **predecir** hacia el futuro (dias hacia adelante)

```python
SimpleRNN(1, input_shape = [None,1], return_sequences=True)
```

¿Como es la salida?

```python
array([[ 0.01594417],
       [ 0.02717144],
       [ 0.03144057],
       [ 0.02980227],
       [ 0.02544099],
       [ 0.01712647],
       [ 0.00630384],
       ....
```

---

¿Que son redes recurrentes de secuencia a vector?

Estas redes reciben una secuencia de datos y solo tomamos en cuenta la ultima salida (**clasificacion**), por ejemplo, en una analisis de sentimiento solo nos interesa saber si el texto es positivo o negativo.

```python
SimpleRNN(1, input_shape = [None,1])
#Solo tomamos la última secuencia
```

Solo tendriamos una salida

```python
array([-0.48530778], dtype=float32)
```

# Procesamiento de lenguaje natural

## Recursos

[https://colab.research.google.com/drive/1ISGlD1UVncSJWMA3UXVPegRgNp48xUMh?usp=sharing](https://colab.research.google.com/drive/1ISGlD1UVncSJWMA3UXVPegRgNp48xUMh?usp=sharing) 

## Definiciones

¿Que es el procesamiento de lenguaje natural?

El entendimiento del lenguaje a través de los algoritmos, en nuestro caso es la intesección entre el Deep Learning y la teoría de procesamiento de lenguaje natural.

La idea es comprender la semántica (significado) de los textos

---

Tokens

Los tokens son la unidad básica de un texto (letras, palabras, conjuntos de palabras)

```python
import nltk
from nltk.tokenize import word_tokenize
nltk.download('punkt')

oracion = "....."
tokens = word_tokenize(oracion)
```

---

Estrategias de procesamiento

1. Debemos transformarlo en una representación numérica
2. Usar onehotencoding tiene el problema de muchos columnas y que no es posible mapearlo
3. Para esto usamos embeddings a traves de Word2Vec

```python
from gensim.models import Word2Vec

modelo = Word2Vec([tokens],vector_size=8,window=3, min_count=1, workers=4)
vectores = modelo.wv
```

---

Tomar en cuenta

Se debe hacer un preprocesamiento

1. Normalizar los textos (minusculas o mayusculas) casa = Casa = CASA
2. Eliminar caracteres no ASCII
3. Eliminar stepwords (palabras muy usadas) conectores, pronombres, etc que no aportar valor al texto Yo soy un medico —> medico
4. Extraer las raices (stemming) jugar, jugando, jugo, jugaria, —> jug (raiz)
5. Posteriormente se vectoriza: Word2Vec, TIDF, CountVectorizer

---

## Modelos de lenguaje

¿Que son?

Se basan en la probabilidad de aparición de las palabras en las oraciones a medida que las construimos, estos modelos aprenden estos patrones que construyen un lenguaje humano como el Español: Sintaxis (como se escribe) Semantica (Significado)

---

LSTM

Las Long Short-Term Memory (LSTM) son un tipo especial de red neuronal recurrente (RNN) capaz de aprender dependencias a largo plazo. Fueron introducidas por Hochreiter y Schmidhuber en 1997 y han demostrado ser efectivas en una variedad de tareas de secuencia, como el reconocimiento de voz y la traducción automática. Las LSTM cuentan con una estructura interna llamada celda de memoria que puede mantener información a lo largo de muchas iteraciones, lo que les permite recordar información durante largos períodos de tiempo.

---

Glove

Es un modelo preentrenado por la universidad de Standford, se descarga y carga como un embedding

[https://colab.research.google.com/drive/1agsPAGU9J_9CA-LkdjssdzyUp5w_eQgN?usp=sharing](https://colab.research.google.com/drive/1agsPAGU9J_9CA-LkdjssdzyUp5w_eQgN?usp=sharing) 

```python
from keras.layers import Embedding

embedding_layer = Embedding(
    num_tokens,
    embedding_dim,
    trainable=False,
)
embedding_layer.build((1,))
embedding_layer.set_weights([embedding_matrix])
```

---

Otros modelos

Otros modelos

1. BERT Clasificación y comprensión de textos
2. GPT Generación de texto (Gemini, ChatGPT, etc)

Afinación

1. Preplexidad: “Sorpresa” de un resultado no esperado, debe ser el minimo
2. Precisión / Recall / f1-score que deben tender 1.
3. BLEU (Bilingual Evaluation Understudy)

---

Otras estrategias

Fine Tunning y transfer learning: Utilizar un modelo preentrenado y conectarle capas para entrenamiento, ejemplo Embeddings (ya tiene los pesos calculados) En este caso solo nos preocupamos por los hiperparametros de las capas que vamos entrenar

---

# Autoencoders

## Recursos

[https://colab.research.google.com/drive/1SSkHb3NNnGa-X2DpbSoJSBkeznGjArur?usp=sharing](https://colab.research.google.com/drive/1SSkHb3NNnGa-X2DpbSoJSBkeznGjArur?usp=sharing) MNIST modificado

## Definiciones

¿Que es?

Tiene dos capas

1. Encoder: Transforma la entrada en el codigo (embedding)
2. Decoder: Transforma el codigo en la salida (que deberia ser igual a la entrada)

---

Algunas caracteristicas

Autocoder se dice que es subcompleto porque las representaciones de los vectores (codigo) es menor que la entrada (comprensión) y el decoder (descomprime)

Cuando un autoencoder tiene varias capas ocultas se le conoce como AUTOENCODER APILADO

---

Ventajas

### Reducción del tamaño de entrada

Pensemos en MNIST (28x28) 784, para entrenar un MLP necesitamos que la capa de entrada tenga 784 neuronas (Es mucho)

Encoder + MLP

Supongamos que la capa de codigo tiene tamaño 30,  nuestro MLP recibe una entrada de 30, es decir necesitamos 30 neuronas en la capa de entrada, es una reducción significativa.

---

Tipos de encoder

1. **Densos**
Capaces de reconocer patrones en las imagenes a través del algoritmo MLP
Faciles de ajustar los hiperametros
2. **Recurrentes**
Capaces de reconocer secuencias dentro de las imagenes (especialmente util)
si las imagenes son una secuencia movimientos (Piensen ajedrez)
Dependen de los datos (que representen secuencias)
3. **Convoluciones** Permiten extraer caracteristicas de las imagenes a través de las capas
convolucionales y los paddings, son mas potentes para tareas de CLASIFICACION
Depende mucho de como se ajustan las capas convolucionales
Depende de los hiperparametros (aveces son mas dificiles ajustar)

---

Consideraciones

1. Capa de codigo debe ser estadisticamente independiente: Cada uno de sus valores REPRESENTA efectivamente una caracteristica de la imagen
2. La capa de codigo debe ser lo suficientemente grande para mapear correctamente las imagenes. Si la capa de codigo es muy pequeña, los valores no van ser apropiados, y si es muy grande: hay dos problemas, costo entrenamiento se incrementa y lo segundo es que hay valores que no tienen ninguna utilidad
[Largo cm, ancho cm, color, estilo] si agregamos colorRGB este dato es inutil Tener cuidado con este tamaño, este tamaño se obtiene por EXPERIENCIA

---
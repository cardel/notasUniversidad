# Sesión 05 de Junio Teoria Procesamiento de Lenguaje natural y RNN

# Recursos

[https://colab.research.google.com/drive/1Bz-ozmdy46EZzXuZBhM6Zkw6uRKnIKOW?usp=sharing](https://colab.research.google.com/drive/1Bz-ozmdy46EZzXuZBhM6Zkw6uRKnIKOW?usp=sharing) 

https://radimrehurek.com/gensim/models/word2vec.html

[https://nlp.stanford.edu/projects/glove/](https://nlp.stanford.edu/projects/glove/)  

[https://www.nltk.org/api/nltk.tokenize.html](https://www.nltk.org/api/nltk.tokenize.html) 

[Semana_12_annotated.pdf](Sesio%CC%81n%2005%20de%20Junio%20Teoria%20Procesamiento%20de%20Lengua%20283e0b34848242e19700614acbeab275/Semana_12_annotated.pdf)

# Notas de clase

Tokenización

Extracción de unidades (palabras, subpalabras, oraciones) significativas de un texto, por ejemplo tenemos word_tokenizer, **wordpunct_tokenize**

---

Embeding o representación de palabras

Son un conjunto de técnicas que se utilizan para representar texto en vectores numéricos.

Es importante que tenga relaciones (semanticas, contextuales, función) por ejemplo one hot encoding no es apropiado, solo representa la palabra sola

---

Word2vec

Una representación vectorizal basada en el contexto, función, relaciones entre las palbras

```python
Word2Vect(tokens
	vector_size=20,
	window=4,
	min_count=1)
```

---

Modelos

- LSTM (Redes recurrentes)
- Embeding preentrenados (utilizan el contexto del idioma) (Word2Vec, Glove)
- Podemos incluir estos embedings en las capas de una red
- BERT Comprensión del lenguaje
- GPT Generación de lenguaje (respuestas)

---

Evaluación (rendimiento)

1. Perplexidad: Es la medida de “sorpresa” en las palabras, es decir significan algo diferente a lo esperado
2. Rendimiento: Precisión, recall y f1 score
3. BLEU: La evaluación de la calidad de una traduccion 

Tengo una manzana

I have a apple  ←- Incorrecto

I have an apple

---

Ajuste de hiperparámetros

1. Tasa de aprendizaje
2. Tamaño de la red
3. Longitud de la secuencia
4. Cantidad de capas (tipo)

---

Otras consideraciones

- Aumento de datos
- Fine tuning (ajustar un modelo preentrenado)
- Transfer: Usando un modelo preentrenado (conocimiento)

---

Clasificacion de sentimientos

Determinar si un texto es positivo, negativo o neutral en un contexto de dado LSTM y Embeding preentrenados

LSTM me permite capturar un contexto largo de un texto

Embeding preentrenado: Contexto del idioma objeivo

---

Consideraciones finales

1. Overfitting: Usar estrategias como dropout para evitar que algunos pesos se vuelvan muy grandes
2. Generación de texto significativo (que tenga sentido o sea coherente en el contexto dado)
3. Generación de texto con estilo (Formal, informal, etc)

# Resumen

1. Usamos embedings preentrenados para transformar el texto a vector significativos tomando en cuenta el contexto del lenguaje
2. Usamos modelos preentrenados junto con capas por entrenar LSTM para tener contexto largo de las oraciones (poder relacionar mejor las palabras)
3. Se debe hacer un proceso de evaluación (metricas de rendimiento) y estrategias de ajuste de los hiperparametros
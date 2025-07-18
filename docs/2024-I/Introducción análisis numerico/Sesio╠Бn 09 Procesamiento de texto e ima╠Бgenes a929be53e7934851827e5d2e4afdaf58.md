# Sesión 09: Procesamiento de texto e imágenes

¿Que hacemos con el texto?

La idea general es convertirlo en un vector numérico que represente cada una de las frases

- Eliminar signos de puntuación
- Eliminar texto no ascii
- Eliminar numeros
- Eliminar palabras de uso común (stopwords) palabras como articulos, conectores, pronombres
- Eliminamos espacios repetidos (strip)
- Volvemos todo minusculas o mayúsculas (normalizar)
- Tomamos las raices de las palabras con el fin de eliminar palabras que significan lo mismo (caminar, camina, caminamos) tiene como raiz camin

---

¿Como vectorizamos?

La primera técnica es Count Vectorizer

Count Vectorizer es una técnica de procesamiento de lenguaje natural que convierte el texto en una matriz de tokens (o palabras) contadas. Este proceso se conoce como vectorización y es una parte crucial del procesamiento de texto en el aprendizaje automático.

En primer lugar, se construye un vocabulario a partir de todas las palabras únicas en los textos. A cada palabra única se le asigna un número índice. Luego, para cada texto, se cuenta cuántas veces aparece cada palabra y se registra el recuento en la posición del índice correspondiente en el vector.

Por ejemplo, si tenemos dos textos: "el gato corre" y "el perro salta", nuestra matriz de tokens sería {"el", "gato", "corre", "perro", "salta"}. El vector para "el gato corre" sería [1, 1, 1, 0, 0] y para "el perro salta" sería [1, 0, 0, 1, 1].

Esta técnica es una forma sencilla y eficaz de representar textos para su uso en modelos de aprendizaje automático, aunque tiene limitaciones, como que no tiene en cuenta el orden de las palabras ni su contexto.

Tf-idf para tomar en cuenta la repetición y la aparición (esta tecnica se prefiere porque nos da más a las palabras que caracterizan a una entrada)

Claro, vamos a considerar un pequeño conjunto de documentos:

- Documento 1: "El gato juega en el jardín"
- Documento 2: "El perro juega en el parque"
- Documento 3: "El gato y el perro son amigos"

Primero, calculamos el **Tf (Frecuencia de Término)** para una palabra en un documento. Por ejemplo, si queremos calcular el Tf para "gato" en el Documento 1, contamos cuántas veces aparece "gato" en ese documento. En este caso, aparece una vez en un total de 6 palabras, por lo que su Tf sería 1/6.

Luego, calculamos el **Idf (Frecuencia Inversa de Documento)** para esa palabra en todos los documentos. Esto se calcula tomando el logaritmo natural del total de documentos dividido por el número de documentos en los que aparece la palabra. Para "gato", tenemos 3 documentos en total y "gato" aparece en 2 de ellos. Por lo tanto, su Idf sería ln(3/2).

Finalmente, multiplicamos el Tf y el Idf para obtener el valor Tf-idf para "gato" en el Documento 1. Esto nos da una medida de cuánto contribuye la palabra "gato" a la descripción del Documento 1 en comparación con los demás documentos. Si repetimos este proceso para todas las palabras en todos los documentos, podríamos transformar cada documento en un vector de valores Tf-idf que representan la importancia de cada palabra en ese documento en relación con todo el conjunto de documentos.

Recuerda que este es un ejemplo simplificado para entender el concepto. En la realidad, los cálculos de Tf-idf a menudo incluyen suavizado y normalización para manejar palabras poco comunes y la longitud de los documentos.C

---

¿Como se procesan imágenes?

- Garantizar que todas las imágenes tengan el MISMO TAMAÑO
- Si son a color evaluar si convertirlas a blanco y negro, si lo importante es el contorno es válido, pero si lo importante es color toca trabajarlo en 3D
- Normalizar las imágenes entre 0 y 1 dividiendo usualmente sobre 255
- Aplanamos el vector 2D o 3D a 1D, en python usamos reshape
- 

Aquí te dejo algunos ejemplos de cómo usar la función `reshape` en Python con la biblioteca NumPy:

1. Cambiando la forma de una matriz 1D a una matriz 2D:
    
    ```python
    import numpy as np
    
    # Crear una matriz 1D
    a = np.array([1, 2, 3, 4, 5, 6])
    
    # Cambiar a una matriz 2D con 3 filas y 2 columnas
    b = a.reshape(3, 2)
    
    print(b)
    
    ```
    
    Salida:
    
    ```
    [[1 2]
     [3 4]
     [5 6]]
    
    ```
    
2. Cambiando la forma de una matriz 2D a una matriz 3D:
    
    ```python
    import numpy as np
    
    # Crear una matriz 2D
    a = np.array([[1, 2, 3, 4], [5, 6, 7, 8]])
    
    # Cambiar a una matriz 3D con 2 filas, 2 columnas y 2 profundidades
    b = a.reshape(2, 2, 2)
    
    print(b)
    
    ```
    
    Salida:
    
    ```
    [[[1 2]
      [3 4]]
    
     [[5 6]
      [7 8]]]
    
    ```
    
3. Aplanando una matriz 2D a una matriz 1D:
    
    ```python
    import numpy as np
    
    # Crear una matriz 2D
    a = np.array([[1, 2, 3], [4, 5, 6]])
    
    # Cambiar a una matriz 1D
    b = a.reshape(-1)
    
    print(b)
    
    ```
    
    Salida:
    
    ```
    [1 2 3 4 5 6]
    
    ```
# Sesion 20 de Mayo: Problemas con grandes datos y estrategias

## Recursos

[https://colab.research.google.com/drive/1a_DCF76joqOyLbCLgV6tx4oKYX408Ofs?usp=sharing](https://colab.research.google.com/drive/1a_DCF76joqOyLbCLgV6tx4oKYX408Ofs?usp=sharing)

# Problemas con las redes neuronales y los grandes datos

Problema 1: Cantidad de datos

Una imagen pequeña genera pocos pesos, pero una imagen grande si, por ejemplo 1280*1280 en blanco genera más de 1 millon de pesos, o si fuera a color, fuera 1280*1280*3 más de 3 millones

---

Problema 2: Capacidad de tolerar el ruido

Como la red recibe un vector aplanado, no es posible diferenciar o agrupar caracteristicas, por ende, cualquier cambio en la imágen altera el resultado de forma importante, es decir, es más dificil de entrenar

---

Problema 3: Encontrar patrones dentro de la imagen

No es facil identificar patrones dentro de la red o tomar diferencias sutiles, por ejemplo color de piel y el color de la arena

## Redes Convolucionales CNN

¿Que son?

Son redes que tienen varias etapas, las primeras son para extraer información de los datos de entrada a través de convoluciones y pooling.

Posteriormente la información procesada la mandamos a una capa densa MLP que hace la CLASIFICACION

---

Capa convolucional

Extrae mapas de la entrada, usando kernels (funciones), la idea es extraer caracteristicas, pero aumenta el número de pesos a calcular (hay que tener cuidado)

---

Capa pooling

Reduce el tamaño de los mapas, sin embargo hay perdida información, porque suele sacar promedios (average) o sacar máximos (max)

![Untitled](Academico/2024-I/IA%20innovador%206e475b1c4af94d089299b50cd996aa08/Sesion%2020%20de%20Mayo%20Problemas%20con%20grandes%20datos%20y%20es%208fd7c5360ca64d62a76e08e5e46abc47/Untitled.png)

## ¿Como funciona una red convolucional?

¿Que hace una capa convolutional?

Tomar un kernel de tamaño nxn, usualmente es 2x2, 3x3 y así, es una matriz cuadrada, esta se aplica una producto punto con una ventana deslizante, la cual es el stride

![Untitled](Academico/2024-I/IA%20innovador%206e475b1c4af94d089299b50cd996aa08/Sesion%2020%20de%20Mayo%20Problemas%20con%20grandes%20datos%20y%20es%208fd7c5360ca64d62a76e08e5e46abc47/Untitled%201.png)

---

¿Que hace una capa de pooling?

Una capa de pooling toma un segmento del mapa de tamaño nxn y nos lo convierte un valor, existe dos tipos: que permite solapar (stride), sin solapamiento.

![Untitled](Academico/2024-I/IA%20innovador%206e475b1c4af94d089299b50cd996aa08/Sesion%2020%20de%20Mayo%20Problemas%20con%20grandes%20datos%20y%20es%208fd7c5360ca64d62a76e08e5e46abc47/Untitled%202.png)

Lo que podemos ver es que se toma el máximo, para cada ventana.

---

¿Como alimentamos la red densa?

Para esto debemos hacer flatten(), transformar la matriz en un vector 1D, en este caso 2x2 o un vector 1D de tamaño 4.

[1, 0, 0,1]

---

## Notas

---

Kernel gaussiano

![Untitled](Academico/2024-I/IA%20innovador%206e475b1c4af94d089299b50cd996aa08/Sesion%2020%20de%20Mayo%20Problemas%20con%20grandes%20datos%20y%20es%208fd7c5360ca64d62a76e08e5e46abc47/Untitled%203.png)

Kernel sobel

![Untitled](Academico/2024-I/IA%20innovador%206e475b1c4af94d089299b50cd996aa08/Sesion%2020%20de%20Mayo%20Problemas%20con%20grandes%20datos%20y%20es%208fd7c5360ca64d62a76e08e5e46abc47/Untitled%204.png)

# Resumen

1. Las redes neuronales profundas (muchas c apas) tienen muchos problemas para ajustarse (entrenarse) si los datos crecen (imagenes) necesitamos muchos pesos, son dificiles de entrenar, no toleran el ruido (algo de movio levemente en la imagen) y no son capaces de identificar patrones
2. Las redes convolucionales tienen varias etapas extrayendo las caracteristicas de los datos (imagen, video, texto, series de datos) y pasandolo a una red densa (MLP)
3. Convoluciones que extraen caracteristicas usando un kernel es una matriz de nxn que se desliza por la imagen (con una longitud de stride) y calcula un mapa, el cual pasa por una función de activación (RELU). Esto nos genera un conjunto de mapas.
4. Capas de pooling que se encargan de filtrar los mapas, reducirlo, tenemos el maxpooling y el averagepooling (viejo, obsoleto, no estoy de acuerdo), slide es el tamño del mapa y usualmente no se permite que solapen
5. Capas de flatten: que es tomar la salida y aplanarla en un vector 1D para poder enviarlo a la RNN
6. Capas densas: MLP (backpropagation) y ahi calificacmos
7. Se suele tener de salida una capa softmax (solo toma como 1 la neurona que tiene mayor valor) one-hot-encoding, solo se activa una salida a vez. [0.5, 0.3, 0.1, 0.7] → [0, 0,0, 1]
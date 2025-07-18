# Sesión 15 de Mayo Función de activación

## Recursos

[https://colab.research.google.com/drive/1693G0w4kpDGGS3QtZNIt7bUQTRhi-HSE?usp=sharing](https://colab.research.google.com/drive/1693G0w4kpDGGS3QtZNIt7bUQTRhi-HSE?usp=sharing) 

## Apuntes de clase

¿Que se entiende por aprendizaje por refuerzo?

1. Es sobre problemas donde afectamos el entorno, como es el caso de un partido de fútbol de robots
2. Se debe tener información actualizada del entorno a partir de las acciones que realizamos, ejemplo un robot puede determinar la distancia de la meta enemiga y la distancia a la pelota
3. Se actualizan los pesos de la red a partir de una recompensa (cercania al objetivo) o penalización (una acción que nos aleja del objetivo)

---

Redes convolucionales

1. Son redes con muchas capas
2. Pero, no se entra la red como un todo, si no por etapas, dividimos la red en varias etapas y cada etapa se encarga de una tarea especifica
3. Muchos tipos de red preentrenados, que es basicamente modelos que sirven para cierto propósitos

---

Aplicaciones en lenguaje natural

1. Se puede usar redes recurrentes, estas permiten tener cierta memoria de los eventos pasados, por ejemplo “Me gustó el producto, pero tuvo problemas” memoria: Me gusto, y ahora “Tuve problemas” me ayuda clasificar mejor la opinión. El problema es que son dificiles de entrenar, pueden diverger (pesos hacia el infinito muy facilmente)
2. Encoder - Decoder, el encoder me puede transforma el trexto a algun lenguaje generico y el decoder a un lenguaje destino (Ejemplo la traducción de textos) Generación de textos

---

## Resumen

1. Entrenar redes profundas es un desafio, es dificil ajustar miles o millones de pesos con un solo algoritmo, podemos tener problemas que se nos vayan a infinito o bien que no hayan cambios, es decir no entrena
2. Una buena estrategia es la propuesta por las redes convolucionales que es dividir por etapas, nos permite enfocarnos en cada etapa independientemente lo que mejora el entrenamiento
3. Este campo es muy versatil y tiene muchas aplicaciones: generación de texto, traducción, corrección de textos, generación de imagenes, generación de videos, pero esto tiene implicaciones éticas: pornografia, ridiculizar personas, generación contenido violento, etc
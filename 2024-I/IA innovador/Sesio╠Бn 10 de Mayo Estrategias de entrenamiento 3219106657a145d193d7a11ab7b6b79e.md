# Sesión 10 de Mayo: Estrategias de entrenamiento

## Recursos

[https://colab.research.google.com/drive/1693G0w4kpDGGS3QtZNIt7bUQTRhi-HSE?usp=sharing](https://colab.research.google.com/drive/1693G0w4kpDGGS3QtZNIt7bUQTRhi-HSE?usp=sharing) 

## Estrategias de entrenamiento para redes profundas

¿Para que aplicamos estrategias?

Se aplican estrategias en redes profundas, por dos razones

1) Que el algoritmo finalice apropiadamente

2) Que el algoritmo avance

3) Evitar inestabilidad: Pesos que no cambian (por limitacion de la computadora) o pesos que se van hacia el infinito

---

## Estrategias

---

Inicialización de pesos

Existen varias estrategias para seleccionar adecuadamente los pesos

Xavier/Gorot depende de las entradas (número, su naturaleza, etc)

He: Depende de la función de activación

---

Funciones de activación

Seleccionar una buena función de activación

RELU: Se prefiere por su facilidad de manejo

Sigmoide/Tanh son dificiles de controlar en redes profundas

---

Normalización por lotes

Esto sólo aplica en función RELU, porque ella puede tener valores de altos de salida (la sigmoide ni la tah tienen este problema), buscamos normalizar las salidas de una capa entre 0 y 1 para no saturar la siguiente, es altamente recomendado en redes muy profundas

---

Optimización avanzada

Optimizers: Adam, SGD, etc

---

Ajuste de la tasa de aprendizaje

Controlar el valor del aprendizaje, aumentamos si la red mejora su rendimiento (error mas pequeño, precisión mejor)

Lo disminuimos si la red emperora su rendimiento (error mas grande o peor precisión)
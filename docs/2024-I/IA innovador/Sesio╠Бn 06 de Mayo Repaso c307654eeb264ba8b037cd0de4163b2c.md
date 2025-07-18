# Sesión 06 de Mayo Repaso

# Repaso

¿Que es una red neuronal?

- Representación matemática de un neuronal real
- Una neurona consta de entradas, pesos, función de activación y salida
- El objetivo es ajustar los pesos de tal manerar la neuronal siga un patrón dado

---

Aprendizaje supervisado

Ustedes conocer la salida de antemano, y lo que quieren es aprender patrones,

Tablas demultiplicar  a*b = f

1*1 = 1

… 9*9 = 81

Cuando un niño aprende, el sólo recibe las entradas a y b, 7*6 = 42  / 45 ←- Error

La red neuronal lo corrige a través del ajuste de los PESOS

---

¿Cual es le modelo de red neuronal?

![Untitled](Sesio%CC%81n%2006%20de%20Mayo%20Repaso%20c307654eeb264ba8b037cd0de4163b2c/Untitled.png)

---

¿Que pasa en el proceso de entrenamiento?

- Carga de los datos
- Procesamiento de datos
- Selección del modelo (Perceptron)
- Tunning del modelo (¿Cuales son los parametros? El factor aprendizaje)
- El entrenamiento del modelo (fit) Se calculan los pesos
- Métricas … ¿Que tan bueno es nuestro modelo?

---

Perceptrón multicapa

El algoritmo tiene dos pasos

- Paso hacia adelante: Entradas hacia salidas
- Pasa hacia atrás: Propagamos los errores desde la salida hasta la entrada, con el fin de ajustar los pesos con la regla perceptrón (gradiente descendiente)
- Funciones activación
    - Clasificación (0 o 1) Sigmoide (logistica), Tanh
    - Regresión: RELU
- Esto existe que los datos se ajusten a las funciones de activación
    - Clasificación: Normalizar entre -1 y 1
    - Regresión: Deben ser positivos
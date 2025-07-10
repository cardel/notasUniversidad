# Introducción y elementos de las RN

Aspectos biologicos de las redes neuronales (neuronas)

Una neurona tiene los siguiente elementos:

- Soma o el cuerpo: Produce la energia y configura la reacción de la neurona (salida)
- Dendritas: Entradas
- Axones: Salidas

Aspecto de todo o nada (0 o 1)

Una neurona recibe señales de otras neuronas y esta conectada con otras neuronas.

Los circuitos pueden ser lineales o realimentados.

Sinapsis: Conexiones (pesos) representan el conocimiento

---

Conexto histórico

Esta idea viene desde los años 40, en los años 70 se introduce la idea del perceptrón como mecanismo de aprendizaje emulando como funciona el sistema visual. Para los años 80 se introduce conceptos de RBF y mapas de Kohonen. A finales de los años 90 entra en los conceptos de Machine Learning y despues de la primera decada de los 2000 surge como parte del **deep learning**

---

Modelo de red neuronal artificial

- Nos inspiramos en el funcionamiento del cerebro humano

![image.png](Introduccio%CC%81n%20y%20elementos%20de%20las%20RN%20c330f3aa892a474b8540253ba3507847/image.png)

El modelo de la red neuronal

- Conjunto de entradas Xi
- Un conjunto de pesos Wi (que representan el conocimiento)
- f función de activación

---

# Elementos de las redes neuronales

Modelo matemático

![image.png](Introduccio%CC%81n%20y%20elementos%20de%20las%20RN%20c330f3aa892a474b8540253ba3507847/image%201.png)

1. La salida es una combinación de las entradas con los pesos
2. La combinación se evalua en una función de activación

---

Funciones de activación

Determinan como es la salida de la red neuronal, se aconseja que sea salida sea POSITIVA

$$
R_{elu} (x) = \begin{cases} x & x \geq 0  \\ 0 & \texttt{en otro caso}\end{cases}
$$

$$
E_{escalon}(x) = \begin{cases} 1 & x \geq 0 \\ 0 & \texttt{en otro caso} \end{cases}
$$

$$
S_{igmoide} = \frac{1}{1+e^{-ax}}
$$

El valor de a determina el ancho de la función en el intervalo entre -1 y 1

$$
T_{angenteh}(x) = \tanh(x)
$$

## Algoritmos de aprendizaje

¿Que tipos de aprendizaje se mencionaron?

- Supervisado
- No supervisado
- Por refuerzo
- Evolutivo

---

Supervisado

- Los datos deben venir etiquetados
- Conocemos entradas y salidas
- Ajustamos los pesos de la red neuronal para que se reconozcan las salidas
- Salidas: Continuas (regresión) o categorícas(discretas)

---

No supervisado

- Los datos no son etiquetados
- Tratamos de que la salida se parezca a la entrada
- El entrenamiento busca que los pesos reconozcan los patrones dentro de la entrada

---

Por refuerzo

- Se utilizan funciones de penalización
- Se premia una buen salida y se castiga una mala salida
- Algoritmos en enjambre

---

Evolutivo

- Usa algoritmos geneticos
- Es similar al de refuerzo pero bajo el enfoque evolutivo (Darwin)
    - Conjunto de soluciones
    - Función evaluación
    - Operador de cruce
    - Operador de mutación
    - Reemplazo de población

# Arquitecturas de redes neuronales

¿Que tipos de arquitecturas?

- Monocapa
- Multicapa
- Recurrentes
- Totalmente conectadas*
- Parcialmente conectadas*

---
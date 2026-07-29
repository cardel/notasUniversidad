# Sesión 2:  Introducción RN

Contexto de red neuronal

- Basado en el modelo biologico del cerebro
- Las entradas se suman o se integran
- Las entradas pueden ser discretas o continuas
- La suma de las entrada pasa por una función de activación
- Neurona: Dentritas (entradas), cuerpo (función), axón (salida) Transforma electrico → quimico → electrico (70mv)

---

Aplicaciones de las redes neuronales

Reconocimiento de voz

Reconocimiento de texto

Reconocimiento imagenes (facial, objetos, etc)

Generación de contenido * actual

Clasificación de patrones (and, or)

---

Modelo matemático de la red neuronal

- x entrada
- w pesos
- b bias
- f función de activación
- y salida

$$
y = f(w*x^T + b)
$$

Buscamos AJUSTAR LOS PESOS para reconocer patrones

---

Funciones de activación

Deben ser estrictamente POSITIVAS para los algoritmos que vamos a aplicar (NO SIEMPRE ES NECESARIO)

$$
esc(x) = 1 \texttt{ si } x \geq 0, 0 \texttt{ en otro caso}  \\
 sgm(x) = \frac{1}{1+e^{-ax}} \\ relu(x) = max(0,x)
$$
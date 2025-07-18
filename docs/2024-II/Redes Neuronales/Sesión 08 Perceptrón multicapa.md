# Sesión 08. Perceptrón multicapa

## Observaciones

Problema de los conjuntos linealmente separables

Un perceptrón monocapa puede trabajarlos sin problema, pero cuando el conjunto es NO linealmente separable (no puedo trazar una función que separe las clases 0 no pertenece 1 de pertenece) este no puede predecirles, el clasico problema del XOR

Agregando capas al perceptrón

A medida que agregamos capas, agregamos funciones para separar los datos, esto no permite crear areas donde separamos los datos, entre maś capas podemos tener mayor precisión, pero:

1. La complejidad computacional es exponencial con respecto al numero de capas
2. El entrenamiento puede ser inestable (diverger) pesos tendiendo a infinito
3. El entrenamiento puede producir cambios tan pequeños que entramos en error de truncamiento (estancamiento) a pesar de que hay error NO LO PODEMOS CORREGIR, por las limitaciones de representación de datos

# Perceptrón multicapa

Forward step: Paso hacia adelante

Tomamos la entrada y calculamos la salida(s)

---

Errores

Cuando el error es diferente que 0, cada una de las neuronas aportó a este error, por lo tanto nos toca corregirlo usando **la regla perceptrón**

---

Pasos

1. Inicializar los pesos U(-1,1)
2. Calcular la salida ante el conjunto de entradas
3. Calcular los errores
4. Calcular el error en la capa de salida
5. Calcular el error de las capas oculta n hacia la primera capa
6. Actualizar los pesos con la regla perceptrón tomando en cuenta los errores en cada capa
7. Repetir 2 hasta 6 mientras no se cumpla la condición de parada
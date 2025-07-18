# Cierre del curso

Redes neuronales

1. Sirven para clasificar datos
2. Es una técnica de machine learning
3. Se basa en la idea de aplicar una función a una entrada ponderada
4. El conocimiento está en los pesos
5. Hay muchos algoritmos para calcular los pesos, entre ellos el perceptrón multicapa
6. Se depende de multiplicaciones matrices
7. En general, los algoritmos optimizan el calculo de los pesos
8. Los datos deben ser preprocesados para que puedan trabajar numericamente (imagenes o textos) y trabajen en los rangos activación de las neuronas
9. Para el procesamiento se aplican tecnicas: eliminación, ajuste (normalización) y manejo de datos dificiles (outliers, nulos, datos erroneos)
10. Para entender que tan buenos son los modelos usamos métricas de rendimiento (precisión, recall, f1 score) tenemos la función de perdida de loss que nos habla del error de entrenamiento
11. En general se pueden utilizar las librerías (Sklearn, Keras, Pytorch, etc) vimos este tema para ENTENDER los parametros (tunning) de estas librerías

---

Procesamiento de datos

Para cualquier algoritmo de aprendizaje (IA), nuestro foco es machine learning y dentro de este las redes neuronales

1. Deben ser numericos
2. Deben ser dentro del rango de trabajo de la red neuronal
3. Debemos normalizarlos
4. Debemos tratar los valores nulos (eliminando, cambiando por promedio o por moda)
5. Debemos tratar valores que tengan un significado diferente, ejemplo categoria estudiante, categoria profesor que no COMPARABLEs, por si decimos que el estudiante es 1 y el profesor es 2 ¿Tendria sentido? R/ No porque no son comparables, usar one-hot encoding, crea una entrada para cada caso, entrada profesor y otra entrada estudiante.
6. En caso de texto debemos limpiar, stemminzar (raices) y luego vectorizar (Tdif, count vectorizer, etc)
7. Imagenes se deben normalizar en tamaño (todas iguales), trabajar el color, escalar
8. Los valores por fuera de rango (errores, o valores muy lejanos debemos trabajarlos)

---

Computación numerica

## Errores

1. Errores de truncamiento: Cuando calculamos algo que tiene sumas infinitas, nos toca cortas
2. Errores de redondeo: IEEE 754 Representación de float y double
3. Errores del modelo: La función está mal
4. Errores humanos: Dificiles de controlar y predecir
5. Medición de errores
    1. Error absoluto: Diferencia
    2. Error relativo: Es porcentual y es mejor para entender que sucede con la escala
    3. Error de aproximación: Depende de un metodo iterativo (anterior y el actual) cuando no conocemos el resultado real
6. Como ejemplo vimos la serie de Taylor, la cual nos ayuda a calcular funciones a través de sumas de derivadas, la serie Mcclauring es cuando el punto es 0
7. Hay propagación del error por truncamiento y redondeo a medida que se realizan operaciones
8. Para manejar esto, los lenguajes de programación incluyen librerías de alta precisión, pero son costosas computacionalmente

## Solución de sistemas lineales

Se busca solucionar sistemas del estilo

$$
Ax = b
$$

Buscamos optimizar el calculo de esto, a través:

1. Transformar a matrices tridiagonales (no siempre se puede)
2. Aplicar guass-jordan, pero es costoso
3. Aplicando factorización LU buscando optimizar multiplicaciones
4. Aplicando factorización cholesky buscando optimizar aun las multiplicaciones, se requiere calcular con ecuaciones las matrices L y L transpuesta
5. A través de la inversa

# Deuda técnica

Quedamos debiendo interpolación numérica. Se trata de ajustar una curva a un conjunto de puntos ¿Para que se usa? Para estimar funciones de acuerdo a un conjunto de datos, ¿Como funcionan las librerías de ploteo?

# Reflexiones del curso

¿Para que me sirve lo que vi aqui?

- Para entender que los números en el computador tienen LIMITACIONES: dados por los errores que siempre van a estar presente
- Para entender que las técnicas de machine learning, usan internamente algebra lineal
- Para entender que hacen las librerías matemáticas en los diferentes lenguajes de programación, ejemplo, la librería Math tiene sen y cos, pero solo lo trabaja una tabla y los otros puntos los calcula a través de Taylor
- Los programas que utilizan los ingenieros de alimentos, civiles, matemáticos, …., usan librerías para el calculo de sistemas de ecuaciones, como sistemas ofrecemos tomando en cuenta la limitaciones del computador solución a sus problemas.

¿Que debería acordarme en mucho tiempo?

- La computación numerica tiene errores, tener cuidado cuando el precisión es importante, sistema bancario, sistemas de energía, sistemas de acueducto
- Las funciones matematicas son IMPRECISAS en el computador, son calculadas a través de series de Taylor
- Conocer el porque de la existencia de librerías de alta precisión numérica, por ejemplo BigDecimal
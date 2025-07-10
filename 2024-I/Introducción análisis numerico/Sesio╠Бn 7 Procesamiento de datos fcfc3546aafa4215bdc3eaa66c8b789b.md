# Sesión 7: Procesamiento de datos

¿Cual es la necesidad de procesar datos?

- Ajustar los datos a la función de activación
- Normalizarlos
- Eliminar ruidos
- Reducir al máximo el número de entradas (Matriz correlación / PCA)

Datos deben ajustarse a las características de la red Neuronal, el procesamiento de datos es más importante que el mismo entrenamiento del algoritmo..

---

¿Que se hace para procesar los datos?

Se aplica una función de transformación de datos

Esta función debe ser **biyectiva (invertible)**

Función consta:

- Normalizar los datos
- Transformación de datos f

$$
f(x):   x \rightarrow y
$$

- Eliminar los datos que son ruido (no es invertible) se considera que los eliminamos desde la fuente original
    - Datos unicos
    - Datos que son ruidosos (edades mayores de 120)
    - Datos que son ruidosos (datos que se salen mucho de la media) Cuartiles
    
    ![Untitled-2024-04-10-1433.png](Sesio%CC%81n%207%20Procesamiento%20de%20datos%20fcfc3546aafa4215bdc3eaa66c8b789b/Untitled-2024-04-10-1433.png)
    
    ![Untitled-2024-04-10-1437.png](Sesio%CC%81n%207%20Procesamiento%20de%20datos%20fcfc3546aafa4215bdc3eaa66c8b789b/Untitled-2024-04-10-1437.png)
    

---

Eliminación de nulos

- Eliminarlos directamente
- Reemplazarlos (datos numericos, por ejemplo el promedio) o la moda o por el porcentaje de aparición de las categorías

---

Eliminación de outliers o datos invalidos

- Eliminar quartil  < 3% > 97%
- Eliminar nulos reemplazando por los datos limpios (mediana, media, promedio)
- Datos invalidos: eliminar (edades negativas o mayores de 120) dados que no tienen sentido o bien reemplazar (con cuidado)

---

Datos unicos

Eliminar

---

Datos categorícos

Aplicar one hot encoding (codificación de uno caliente) convertir cada categoria en una entrada (columna) que son mutamente excluyentes.

En caso de tener una categoría binaria, dejar sólo una columna

---

Normalización

Los datos que no son binarios, aplicar normalización z-score para que queden entre -1 y 1 (la mayoria)
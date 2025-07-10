# Clase 10  Solvers completos

# Conceptos

- Evitan la búsqueda al resolver los problemas directamente por propagación (reducción de los dominios) y aplicación de estrategias de solución
- La transformación aplicando las reglas de un CSP inicial nos da uno equivalente, se perserva  que las reglas aplicadas generan un sistema equivalente

# Tipos de reglas

## Reglas de reducción de dominios

![image.png](Academico/Universidad/2025-1/Programacio╠Бn%20por%20restricciones%201987fd794c2880bb9305ed2af33905ce/Clase%2010%20Solvers%20completos%201dd7fd794c28801fa3a5c95ae9faeb9f/image.png)

El dominio del sistema equivalente está contenido o es igual que el inicial

Ejemplos

- Reglas de desigualdad lineal
- Reglas de igualdad
- Reglas de desigualdad (Transformación de desigualdades)
- Eliminación de variables (cuando un variable tiene un valor especifico)

![image.png](Academico/Universidad/2025-1/Programacio╠Бn%20por%20restricciones%201987fd794c2880bb9305ed2af33905ce/Clase%2010%20Solvers%20completos%201dd7fd794c28801fa3a5c95ae9faeb9f/image%201.png)

- Aplicación de las reglas se realiza sobre las partes de los CPS donde hay coincidencia
- El resultado puede diferir del CSP inicial, sin embargo se conserva la equivalencia
- Se considera un CSP cerrado si no se pueden aplicar reglas sobre el

# Derivaciones

Es el CSP resultante a medida que se aplican las reglas

- Satisfecho: La ultima derivación resuelve el sistema
- Fallido: La ultima derivación nos lleva a un inconsistencia o bien una variables tiene dominio vacio
- Establecido: La última derivación nos lleva un sistema no resuelto al cual no se le puede aplicar más reglas, es necesario aplicar búsqueda

![image.png](Academico/Universidad/2025-1/Programacio╠Бn%20por%20restricciones%201987fd794c2880bb9305ed2af33905ce/Clase%2010%20Solvers%20completos%201dd7fd794c28801fa3a5c95ae9faeb9f/image%202.png)

- Este sistema está satisfecho porque se han encontrado los valores de las variables de decisión
- Si el sistema es fallido, una las restricciones es falso, por ejemplo a = b o bien una variables tiene dominio vacio
- El sistema está establecido sii no se aplicar más reglas y no hemos resuelto el sistema

# Problemas de ecuaciones lineales

![image.png](Academico/Universidad/2025-1/Programacio╠Бn%20por%20restricciones%201987fd794c2880bb9305ed2af33905ce/Clase%2010%20Solvers%20completos%201dd7fd794c28801fa3a5c95ae9faeb9f/image%203.png)

**Forma normal:**

Ax + By = C

**Forma pivote:**

y = (-A/B)x + (C/B)

Para llegar a este sistema aplicamos operaciones

- Composición: Sumas, restas entre ecuaciones
- Operaciones con escalares (multiplicar o dividir po un valor)

Las formas pivote

1. 0 = 0 (Verdadero)
2. 0 = r (r distinto de 0) es una contradicción, el CSP falla
3. variables = valor (forma normal o la forma pivote)

# Ejemplo

Por ejemplo

$$
x + y = 8 \\ 2x - 3y = 10
$$

Resolviendo el sistema de ecuaciones:

1. Sistema inicial:
    - Ecuación 1: x + y = 8
    - Ecuación 2: 2x - 3y = 10
2. Eliminar una variable (por ejemplo, x):
    
    Multiplicamos la Ecuación 1 por 2 para igualar los coeficientes de x:
    
    - 2(x + y) = 2(8)
    - 2x + 2y = 16
    
    Nuevo sistema:
    
    - 2x + 2y = 16
    - 2x - 3y = 10
3. Sustitución (restamos la segunda ecuación de la primera):
    
    (2x + 2y) - (2x - 3y) = 16 - 10
    
    5y = 6
    
    Resolviendo para y:
    
    y = 6 / 5
    
4. Sustituimos el valor de y en la Ecuación 1 para encontrar x:
    
    x + (6 / 5) = 8
    
    x = 8 - (6 / 5)
    
    x = (40 / 5) - (6 / 5)
    
    x = 34 / 5
    
5. Verificación:
    
    Sustituimos x = 34 / 5 y y = 6 / 5 en la Ecuación 2:
    
    2(34 / 5) - 3(6 / 5) = 10
    
    (68 / 5) - (18 / 5) = 10
    
    50 / 5 = 10
    
    10 = 10 (Correcto).
    

Resultado final:

- x = 34 / 5
- y = 6 / 5

El sistema ha sido resuelto exitosamente.

# Conclusiones

Solver completo resuelve un sistema utilizando

- Reglas de propagación (Cambio de dominios)
- Estrategias como Gauss Jordan que combina reglas de eliminación y de sustitución

¿Porque evitar la busqueda? Porque puede ser de complejidad NP

## Aspectos más relevantes

1. **Solvers completos**:
    - Los solvers completos resuelven problemas de restricción (CSP) sin recurrir a la búsqueda, utilizando propagación y estrategias de solución.
    - Aplican reglas de reducción de dominios para transformar el sistema inicial en uno equivalente.
    
    **Ejemplo práctico**:
    
    - Si una variable tiene un dominio reducido por una regla, como `x ∈ {1, 2, 3}` reducido a `x ∈ {1, 2}`, el sistema equivalente conserva la solución sin necesidad de buscar explícitamente.
2. **Reglas de propagación**:
    - Estas reglas incluyen desigualdades lineales, igualdades y eliminación de variables para reducir los dominios.
    - Un sistema se considera cerrado cuando no se pueden aplicar más reglas y mantiene la equivalencia.
    
    **Ejemplo práctico**:
    
    - En un sistema donde `x + y = 5` y `x = 2`, sustituyendo `x` en la primera ecuación se reduce el dominio de `y` a un solo valor: `y = 3`.
3. **Estados del sistema derivado**:
    - **Satisfecho**: Se encuentra una solución completa para las variables.
    - **Fallido**: Se detecta inconsistencia (por ejemplo, una variable con dominio vacío).
    - **Establecido**: No se pueden aplicar más reglas, pero el sistema no está resuelto completamente, lo que puede requerir búsqueda.
    
    **Ejemplo práctico**:
    
    - Si al resolver un CSP de ecuaciones lineales llegamos a `0 = 0`, el sistema es verdadero y satisfecho. Si llegamos a `0 = r (r ≠ 0)`, el sistema falla.
4. **Resolución de sistemas de ecuaciones lineales**:
    - Uso de formas normales (`Ax + By = C`) y formas pivote (`y = (-A/B)x + (C/B)`).
    - Se aplican operaciones de composición (sumas, restas) y escalares para simplificar el sistema.
    
    **Ejemplo práctico**:
    Resolver:
    
    - `x + y = 8`
    - `2x - 3y = 10`
    
    Resultado:
    
    - `x = 34 / 5`
    - `y = 6 / 5`
5. **Conclusión teórica**:
    - Los solvers completos son útiles para evitar la búsqueda en problemas con alta complejidad computacional (NP).
    - Utilizan estrategias como Gauss-Jordan, que combina reglas de propagación, eliminación y sustitución para resolver problemas eficientemente.
    
    **Ejemplo teórico**:
    
    - En programación por restricciones, si las variables están definidas por dominios discretos (`x ∈ {1, 2, 3}` y `y ∈ {4, 5}`), las reglas de propagación pueden reducir los dominios antes de realizar una búsqueda exhaustiva, optimizando el proceso de resolución.

### Ejemplo de CSP de la vida real: Programación de horarios de clases

**Problema**:

Una universidad necesita programar las clases de varias materias en diferentes aulas, asignando horarios y asegurándose de que no haya conflictos. Las restricciones incluyen:

1. Cada clase debe tener un aula asignada.
2. Dos clases no pueden usar el mismo aula al mismo tiempo.
3. Algunos profesores solo están disponibles en horarios específicos.
4. Algunas clases requieren aulas específicas (por ejemplo, laboratorios).

**Variables**:

- Clases: Matemáticas, Física, Química, Biología.
- Aulas: Aula 1, Aula 2, Aula 3.
- Horarios: 9:00-10:00, 10:00-11:00, 11:00-12:00.

**Dominios**:

- Cada clase puede asignarse a cualquier combinación de aula y horario (por ejemplo, Matemáticas podría estar en Aula 1 a las 9:00-10:00).

**Restricciones**:

1. Dos clases no pueden usar el mismo aula al mismo tiempo.
2. Los profesores tienen disponibilidad limitada:
    - Profesor de Matemáticas: 9:00-10:00, 10:00-11:00.
    - Profesor de Física: 10:00-11:00.
    - Profesor de Química: 9:00-10:00, 11:00-12:00.
3. Biología requiere Aula 3.

**Resolución con un solver completo**:

1. **Propagación de restricciones**:
    - Eliminamos combinaciones imposibles en los dominios:
        - Biología solo puede estar en Aula 3, por lo que descartamos otras combinaciones para esta clase.
        - Física no puede estar en 9:00-10:00 porque su profesor no está disponible.
    - Si Matemáticas está en Aula 1 a las 9:00-10:00, ninguna otra clase puede usar esa aula en ese horario.
2. **Reducción de dominios**:
    
    Aplicando las restricciones, el dominio de cada variable se reduce:
    
    - Matemáticas: {(Aula 1, 9:00-10:00), (Aula 2, 10:00-11:00)}.
    - Física: {(Aula 2, 10:00-11:00), (Aula 1, 11:00-12:00)}.
    - Química: {(Aula 2, 9:00-10:00), (Aula 3, 11:00-12:00)}.
    - Biología: {(Aula 3, 9:00-10:00), (Aula 3, 11:00-12:00)}.
    
    Al principio teniamos 9*8*7*6 posibilidades = 3024, y pasalos a 8 posibilidades, 378 veces menor ←- El sistema está **establecido**
    
3. **Sistema cerrado**:
    
    Una vez que no se pueden reducir más los dominios, el solver completo verifica todas las combinaciones viables dentro de los dominios reducidos para encontrar una solución que cumpla todas las restricciones. ←- Busqueda
    

**Solución final**:

- Matemáticas: Aula 1, 9:00-10:00.
- Física: Aula 2, 10:00-11:00.
- Química: Aula 3, 11:00-12:00.
- Biología: Aula 3, 9:00-10:00.

**Conclusión**:

El solver completo resuelve el problema aplicando reglas de propagación y reducción de dominios, garantizando que las restricciones se cumplan sin necesidad de realizar una búsqueda exhaustiva. Esto es eficiente y asegura que se obtenga una solución óptima para la programación de horarios.
# Clase 11. Consistencia

# Nodo consistencia

- Evaluamos restricciones de una sola variable
- El dominio de la restricción debe coincidir con el dominio de la restricción, que todo los valores de la variable de decisión **deben satisfacer la restricción**
- Por defecto un CSP es nodo consistente a menos que se demuestre lo contrario

Un ejemplo de un problema CSP que es nodo consistente es el siguiente:

Supongamos que tenemos una variable de decisión **X** con un dominio {1, 2, 3} y una restricción **X > 0**. Este problema es nodo consistente porque todos los valores en el dominio de **X** (1, 2 y 3) satisfacen la restricción **X > 0**. No hay necesidad de eliminar ningún valor del dominio, ya que todos cumplen con la condición impuesta por la restricción.

# Arco consistencia

- Evaluamos restricciones de dos variables
- Se evalua:
    - De X hacia Y, para todo  X existe al menos Y que satisface la restricción
    - De Y hacia X, para todo Y existe al menos X que safisface la restricción

$$
\forall a \in X, \exists y \in Y, C(a,b) \\ \forall b \in Y, \exists a \in X, C(a,b) \\
$$

Un problema es **arco consistente** hasta que se demuestre lo contrario

Un ejemplo de un problema CSP que es arco consistente es el siguiente:

Supongamos que tenemos dos variables de decisión **X** y **Y**, donde el dominio de **X** es {1, 2, 3} y el dominio de **Y** es {2, 3, 4}. La restricción entre estas variables es **X < Y**.

Para verificar si este problema es arco consistente:

1. **De X hacia Y**: Para cada valor en el dominio de **X**, debe existir al menos un valor en el dominio de **Y** que satisfaga la restricción **X < Y**:
    - Si **X = 1**, en el dominio de **Y** existe {2, 3, 4}, y todos los valores satisfacen **1 < Y**.
    - Si **X = 2**, en el dominio de **Y** existe {3, 4}, y ambos valores satisfacen **2 < Y**.
    - Si **X = 3**, en el dominio de **Y** existe {4}, y este valor satisface **3 < Y**.
2. **De Y hacia X**: Para cada valor en el dominio de **Y**, debe existir al menos un valor en el dominio de **X** que satisfaga la restricción **X < Y**:
    - Si **Y = 2**, en el dominio de **X** existe {1}, y este valor satisface **X < 2**.
    - Si **Y = 3**, en el dominio de **X** existe {1, 2}, y ambos valores satisfacen **X < 3**.
    - Si **Y = 4**, en el dominio de **X** existe {1, 2, 3}, y todos los valores satisfacen **X < 4**.

Dado que para cada valor en el dominio de **X** existe al menos un valor en el dominio de **Y** que satisface la restricción, y viceversa, este problema es arco consistente.

[Consistencia1_annotated.pdf](Consistencia1_annotated.pdf)

# Hiper arco consistencia

- Aplica para restricciones que tienen más de dos variables de decisión
- Para cada valor en cada variable, debe existir una combinación que satisfaga la restricción, es decir no existen valores en los cuales la restricción NO SATISFACTIBLE
- Por definición un sistema es hiperarcoconsiste hasta que se demuestre lo contrario
- Se debe aplicar la noción para todas las restricciones con más de dos variables de decisión y si alguna de estas cambia, se debe aplicar a nuevo hasta que el sistema esté CERRADO (no es posible cambiar más los dominios)

Un ejemplo de un problema CSP que es hiper arco consistente es el siguiente:

Supongamos que tenemos tres variables de decisión **X**, **Y** y **Z**, donde los dominios son:

- Dominio de **X**: {1, 2, 3}
- Dominio de **Y**: {2, 3, 4}
- Dominio de **Z**: {3, 4, 5}

Las restricciones entre estas variables son:

1. **X + Y = Z  Evaluar hiperarco consistencia**
2. **X < Y  Evaluar arco consistencia**

Para verificar si este problema es hiper arco consistente, necesitamos evaluar cada combinación de valores en las variables y asegurarnos de que para cada valor en el dominio de una variable, existe una combinación válida de valores en las otras variables que satisfaga todas las restricciones.

### Paso 1: Verificar **X + Y = Z**

- Si **X = 1**:
    - Para **Y = 2**, **Z** debe ser 3 (válido porque 3 está en el dominio de **Z**).
    - Para **Y = 3**, **Z** debe ser 4 (válido porque 4 está en el dominio de **Z**).
    - Para **Y = 4**, **Z** debe ser 5 (válido porque 5 está en el dominio de **Z**).
- Si **X = 2**:
    - Para **Y = 2**, **Z** debe ser 4 (válido porque 4 está en el dominio de **Z**).
    - Para **Y = 3**, **Z** debe ser 5 (válido porque 5 está en el dominio de **Z**).
- Si **X = 3**:
    - Para **Y = 2**, **Z** debe ser 5 (válido porque 5 está en el dominio de **Z**).
    
    Al ser una suma la dirección x → (Y,Z) es bidireccional
    

### Paso 2: Verificar **X < Y**

- Si **X = 1**, **Y** puede ser 2, 3 o 4 (cumple **X < Y** para todos estos valores).
- Si **X = 2**, **Y** puede ser 3 o 4 (cumple **X < Y**).
- Si **X = 3**, **Y** puede ser 4 (cumple **X < Y**).

### Paso 3: Verificar hiper arco consistencia

Para que el problema sea hiper arco consistente, debemos comprobar que para cada valor en cada variable (**X**, **Y**, **Z**):

- Existe una combinación válida de valores en las otras variables que satisfaga todas las restricciones.
1. **Para cada valor de X**:
    - Si **X = 1**, para **Y = 2**, **Z = 3** satisface las restricciones.
    - Si **X = 2**, para **Y = 3**, **Z = 5** satisface las restricciones.
    - Si **X = 3**, para **Y = 4**, **Z = 5** satisface las restricciones.
2. **Para cada valor de Y**:
    - Si **Y = 2**, para **X = 1**, **Z = 3** satisface las restricciones.
    - Si **Y = 3**, para **X = 2**, **Z = 5** satisface las restricciones.
    - Si **Y = 4**, para **X = 3**, **Z = 5** satisface las restricciones.
3. **Para cada valor de Z**:
    - Si **Z = 3**, para **X = 1**, **Y = 2** satisface las restricciones.
    - Si **Z = 4**, para **X = 1**, **Y = 3** satisface las restricciones.
    - Si **Z = 5**, para **X = 2**, **Y = 3** satisface las restricciones.

### Conclusión

Dado que para cada valor en el dominio de cada variable (**X**, **Y**, **Z**) existe al menos una combinación de valores en las otras variables que satisface todas las restricciones, este problema es hiper arco consistente.

[Consistencia2_annotated.pdf](Consistencia2_annotated.pdf)

# Hiper arcoconsistencia direccional

- Se aplica la noción de hiperarconsistencia pero solamente en un sentido por ejemplo x < y —→ evaluamos si todos los valores de x tienen al menos y que lo satisface, pero no lo hacemos al revés
- Esto es importante porque en algunos CSP hay muchas restricciones y muchas variables de decisión por lo tanto el solver puede determinar un orden para evaluar, esto permite propagar más rapidamente aunque los dominios no sean los optimos (existen valores que no se pueden satisfacer en el problema)

### Ejemplo de un problema CSP hiper arco consistente direccional

Supongamos que tenemos tres variables de decisión **A**, **B** y **C**, con los siguientes dominios:

- Dominio de **A**: {1, 2, 3}
- Dominio de **B**: {2, 3, 4}
- Dominio de **C**: {4, 5}

Las restricciones son:

1. **A < B** (evaluaremos la consistencia direccional desde **A** hacia **B**).
2. **B + C = 7** (evaluaremos la consistencia direccional desde **B** hacia **C**).

### Paso 1: Verificar **A < B** (de **A** hacia **B**)

Para que el problema sea hiper arco consistente direccional desde **A** hacia **B**, cada valor en el dominio de **A** debe tener al menos un valor en el dominio de **B** que satisfaga la restricción **A < B**:

- Si **A = 1**, en el dominio de **B** existe {2, 3, 4}, y todos los valores satisfacen **1 < B**.
- Si **A = 2**, en el dominio de **B** existe {3, 4}, y ambos valores satisfacen **2 < B**.
- Si **A = 3**, en el dominio de **B** existe {4}, y este valor satisface **3 < B**.

Por lo tanto, la restricción **A < B** es direccionalmente consistente desde **A** hacia **B**.

### Paso 2: Verificar **B + C = 7** (de **B** hacia **C**)

Para que el problema sea hiper arco consistente direccional desde **B** hacia **C**, cada valor en el dominio de **B** debe tener al menos un valor en el dominio de **C** que satisfaga la restricción **B + C = 7**:

- Si **B = 2**, en el dominio de **C** existe {5}, y este valor satisface **2 + 5 = 7**.
- Si **B = 3**, en el dominio de **C** existe {4}, y este valor satisface **3 + 4 = 7**.
- Si **B = 4**, no existe ningún valor en el dominio de **C** que satisfaga **4 + C = 7**. Por lo tanto, eliminamos **B = 4** del dominio de **B**.

Después de esta eliminación, el dominio actualizado de **B** es {2, 3}.

### Paso 3: Verificar consistencia direccional completa

1. **De A hacia B**: Cada valor en el dominio actualizado de **A** ({1, 2, 3}) tiene al menos un valor en el dominio actualizado de **B** ({2, 3}) que satisface la restricción **A < B**.
    - Si **A = 1**, **B = 2** o **B = 3** satisfacen **A < B**.
    - Si **A = 2**, **B = 3** satisface **A < B**.
    - Si **A = 3**, no hay valores en el dominio de **B** que satisfagan **A < B**, por lo que eliminamos **A = 3** del dominio. Ahora el dominio de **A** es {1, 2}.
2. **De B hacia C**: Cada valor en el dominio actualizado de **B** ({2, 3}) tiene al menos un valor en el dominio de **C** ({4, 5}) que satisface la restricción **B + C = 7**.
    - Si **B = 2**, **C = 5** satisface **B + C = 7**.
    - Si **B = 3**, **C = 4** satisface **B + C = 7**.

Por lo tanto, el problema es direccionalmente hiper arco consistente al evaluar desde **A → B** y **B → C**.

### Conclusión

Este problema es hiper arco consistente direccional porque hemos aplicado la consistencia en un solo sentido: **A → B** y luego **B → C**. Esto permite simplificar los dominios de las variables y garantizar que cada valor en el dominio de una variable tenga una combinación válida en las otras variables que satisface las restricciones en la dirección especificada.

# ¿Para que sirve?

El uso de nodo consistencia, arco consistencia, hiper arco consistencia e hiper arco consistencia direccional en la propagación de un CSP (Problema de Satisfacción de Restricciones) es fundamental para reducir la complejidad de los problemas y optimizar el proceso de búsqueda de soluciones.

### Nodo consistencia

La nodo consistencia asegura que todos los valores en el dominio de cada variable individual satisfacen las restricciones unarias impuestas sobre ella. Esto es útil porque permite detectar y eliminar valores que claramente no pueden formar parte de una solución, reduciendo así el tamaño de los dominios desde el principio. Esto simplifica el problema y evita realizar cálculos innecesarios más adelante.

### Arco consistencia

La arco consistencia extiende esta idea a las restricciones binarias entre pares de variables. Verifica que, para cada valor en el dominio de una variable, exista al menos un valor correspondiente en el dominio de la otra variable que satisfaga la restricción. Esto es crucial para garantizar que las relaciones entre las variables se respeten y que no se consideren valores que no puedan formar parte de una solución válida. Además, ayuda a identificar inconsistencias temprano en el proceso.

### Hiper arco consistencia

La hiper arco consistencia generaliza este concepto a restricciones que involucran tres o más variables. Permite evaluar combinaciones de valores para asegurar que todas las restricciones sean satisfechas. Esto es esencial en problemas más complejos donde múltiples variables están interrelacionadas, ya que garantiza que no se pase por alto ninguna incompatibilidad entre valores.

### Hiper arco consistencia direccional

La hiper arco consistencia direccional aplica las verificaciones en un orden específico, evaluando las restricciones en una dirección determinada. Esto es particularmente útil en problemas con muchas variables y restricciones, ya que permite reducir los dominios de manera eficiente basándose en un orden predefinido. Aunque puede no eliminar todas las inconsistencias de los dominios, es una técnica más eficiente computacionalmente cuando se trabaja con problemas grandes y complejos.

### Ventajas

1. **Reducción de dominios**: Estas técnicas eliminan valores inconsistentes de los dominios, reduciendo el espacio de búsqueda y haciendo que el problema sea más manejable.
2. **Detección temprana de inconsistencias**: Permiten identificar problemas que no tienen solución antes de invertir tiempo en búsquedas exhaustivas.
3. **Optimización del proceso de búsqueda**: Al reducir los dominios y garantizar que solo se consideren valores consistentes, se acelera la búsqueda de soluciones.
4. **Flexibilidad**: La hiper arco consistencia direccional permite ajustar el orden de evaluación para mejorar la eficiencia en problemas específicos.
5. **Propagación de restricciones**: Facilitan la propagación de restricciones, asegurando que los cambios en una variable se reflejen en las demás, lo que ayuda a mantener la consistencia en todo el sistema.

En resumen, estas técnicas son herramientas fundamentales para resolver CSPs de manera eficiente, reduciendo la complejidad del problema y mejorando el rendimiento del proceso de resolución.

# Resumen

## Resumen

Este documento aborda los conceptos fundamentales de la consistencia en Problemas de Satisfacción de Restricciones (CSP), incluyendo nodo consistencia, arco consistencia, hiper arco consistencia e hiper arco consistencia direccional. Estas técnicas son esenciales para resolver CSP de manera eficiente, optimizando la búsqueda de soluciones al eliminar valores inconsistentes y reducir el tamaño de los dominios.

### Características principales:

1. **Nodo consistencia**: Se asegura de que todos los valores en el dominio de una variable individual respeten las restricciones unarias.
2. **Arco consistencia**: Evalúa restricciones binarias entre pares de variables, verificando que cada valor en una variable tenga al menos un valor compatible en la otra.
3. **Hiper arco consistencia**: Extiende el concepto a restricciones que involucran tres o más variables, garantizando combinaciones válidas entre todas.
4. **Hiper arco consistencia direccional**: Aplica las verificaciones en un orden específico, evaluando las restricciones en una dirección determinada para reducir la complejidad computacional.

### Ventajas:

- **Reducción de dominios**: Permite trabajar con un espacio de búsqueda más reducido y manejable.
- **Detección temprana de inconsistencias**: Identifica problemas sin solución antes de realizar cálculos innecesarios.
- **Optimización del proceso de búsqueda**: Acelera la resolución al enfocarse en valores consistentes.
- **Propagación de restricciones**: Mantiene la coherencia entre variables relacionadas.
- **Flexibilidad**: La hiper arco consistencia direccional permite priorizar restricciones críticas en problemas grandes.

### Desventajas:

- **Complejidad computacional**: En problemas con muchas variables y restricciones, la evaluación de consistencia puede ser costosa.
- **Resultados parciales**: La hiper arco consistencia direccional no garantiza un dominio óptimo, pero sí mejora la eficiencia.

### Mensaje motivacional:

Sabemos que este tema puede parecer abstracto o complicado, pero entender la consistencia en CSP es como aprender a resolver un rompecabezas de manera inteligente. Cada técnica que explores te ayudará a enfrentar problemas complejos con herramientas que reducen el esfuerzo y maximizan los resultados. Además, estos conceptos tienen aplicaciones prácticas en inteligencia artificial, planificación, diseño de sistemas y más.

Aprender a trabajar con restricciones no es solo una habilidad técnica, ¡es desarrollar una forma de pensar estructurada y eficiente que te servirá en cualquier ámbito! Así que, aunque ahora parezca tedioso, recuerda que el esfuerzo de hoy es la base del éxito de mañana. ¡Sigue adelante, tienes el potencial para dominarlo y destacar en lo que te propongas!

# Ejemplo con Gecode

En Gecode, para establecer la hiper arco consistencia direccional y seleccionar el orden de las variables, puedes utilizar estrategias de búsqueda específicas que definan el orden en el cual se seleccionan las variables y los valores. Esto se logra mediante el uso de *branching* en Gecode.

### Pasos para implementar hiper arco consistencia direccional en Gecode:

1. **Declarar las variables**: Define las variables de decisión con sus dominios.
2. **Definir las restricciones**: Implementa las restricciones que deben satisfacerse entre las variables.
3. **Utilizar estrategias de branching**: Gecode permite definir estrategias de branching para seleccionar el orden de las variables y los valores. Esto es clave para aplicar la consistencia direccional.

### Ejemplo en código:

```cpp
#include <gecode/int.hh>
#include <gecode/minimodel.hh>
#include <gecode/search.hh>

using namespace Gecode;

class CSP : public Space {
protected:
    IntVarArray variables; // Arreglo de variables de decisión

public:
    // Constructor
    CSP() : variables(*this, 3, 1, 5) { // Tres variables con dominio [1, 5]
        IntVar A = variables[0];
        IntVar B = variables[1];
        IntVar C = variables[2];

        // Restricciones
        rel(*this, A < B);         // Restricción A < B
        rel(*this, B + C == 7);    // Restricción B + C = 7

        // Estrategia de branching con orden específico
        branch(*this, variables, INT_VAR_SIZE_MIN(), INT_VAL_MIN());
    }

    // Constructor para clonar
    CSP(CSP& s) : Space(s) {
        variables.update(*this, s.variables);
    }

    // Método de clonación
    virtual Space* copy() {
        return new CSP(*this);
    }

    // Método para imprimir la solución
    void print() const {
        std::cout << "Solución: ";
        for (int i = 0; i < variables.size(); ++i) {
            std::cout << variables[i] << " ";
        }
        std::cout << std::endl;
    }
};

int main() {
    CSP* m = new CSP;

    // Explorar las soluciones
    DFS<CSP> e(m);
    delete m;

    while (CSP* s = e.next()) {
        s->print();
        delete s;
    }

    return 0;
}

```

### Explicación del código:

1. **Declaración de variables**:
    - Se declaran las variables `A`, `B`, y `C` con dominios en el rango [1, 5].
2. **Definición de restricciones**:
    - `rel(*this, A < B)` asegura que A sea menor que B.
    - `rel(*this, B + C == 7)` garantiza que la suma de B y C sea igual a 7.
3. **Branching (selección de orden)**:
    - `branch(*this, variables, INT_VAR_SIZE_MIN(), INT_VAL_MIN());` define cómo seleccionar las variables y los valores:
        - `INT_VAR_SIZE_MIN()`: Selecciona primero la variable con el dominio más pequeño.
        - `INT_VAL_MIN()`: Asigna el valor más pequeño del dominio a la variable seleccionada.
    
    Este branching asegura que el solver evalúe las variables en un orden específico, logrando la consistencia direccional.
    

### Notas importantes:

- **Custom Branching**: Si necesitas un orden más específico, puedes implementar tu propia estrategia de branching utilizando la clase `Brancher`.
- **Propagadores personalizados**: Gecode también permite definir propagadores para optimizar cómo se aplican las restricciones.

### Conclusión:

Utilizando estrategias de branching en Gecode, puedes controlar el orden de evaluación de las variables y aplicar la hiper arco consistencia direccional de manera eficiente. Esto es especialmente útil en CSP con muchas restricciones y variables. ¡Experimenta con diferentes estrategias para optimizar tu modelo!

En MiniZinc, puedes usar la estrategia de búsqueda `int_search` para seleccionar un orden específico de las variables y aplicar la hiper arco consistencia direccional. Esto se logra definiendo cómo se seleccionan las variables y los valores durante la búsqueda.

### Ejemplo de uso de `int_search` para hiper arco consistencia direccional:

```
include "globals.mzn";

% Declaración de las variables
var 1..5: A;
var 1..5: B;
var 1..5: C;

% Restricciones
constraint A < B;         % Restricción A < B
constraint B + C == 7;    % Restricción B + C = 7

% Estrategia de búsqueda
solve :: int_search([A, B, C], first_fail, indomain_min, complete) satisfy;

% Imprimir la solución
output ["A = \\(A), B = \\(B), C = \\(C)"];

```

### Desglose de la estrategia `int_search`:

1. **Lista de variables** (`[A, B, C]`):
    - Especifica el orden en el que las variables deben evaluarse. En este caso, primero se evaluará `A`, luego `B`, y finalmente `C`.
2. **Estrategia de selección de variables** (`first_fail`):
    - Selecciona primero la variable con el dominio más pequeño. Esto es útil porque reduce rápidamente el espacio de búsqueda al enfocarse en las variables más restringidas.
3. **Estrategia de selección de valores** (`indomain_min`):
    - Selecciona el valor más pequeño del dominio de la variable. Esto ayuda a explorar primero las soluciones más pequeñas, lo que puede ser útil para encontrar inconsistencias rápidamente.
4. **Tipo de búsqueda** (`complete`):
    - Realiza una búsqueda completa en el espacio de soluciones, garantizando que se encuentren todas las soluciones o se determine que no hay ninguna.

### Explicación de cómo funciona esta configuración:

- La estrategia de búsqueda evalúa las variables en el orden definido ([A, B, C]), asegurando que las restricciones se propaguen en esa dirección.
- Al seleccionar primero las variables con dominios más pequeños (`first_fail`) y probar los valores más pequeños disponibles (`indomain_min`), se reduce el espacio de búsqueda y se optimiza la propagación de restricciones.
- Esto simula la hiper arco consistencia direccional, ya que las restricciones se evalúan en una dirección específica, propagando los cambios en los dominios de las variables de manera eficiente.

### Consideraciones adicionales:

- Si necesitas un orden de evaluación diferente, simplemente cambia el orden de las variables en el arreglo `[A, B, C]`.
- Puedes experimentar con otras estrategias de selección de variables, como `input_order` (por el orden en que fueron declaradas) o `most_constrained` (selecciona la variable con más restricciones).
- Para problemas más complejos, usar propagadores adicionales o restricciones globales puede mejorar la eficiencia.

### Resultado esperado:

El modelo evaluará las restricciones en la dirección especificada y generará todas las soluciones válidas que satisfacen las restricciones. Por ejemplo:

```
A = 1, B = 2, C = 5
A = 2, B = 3, C = 4

```

Este enfoque asegura una búsqueda eficiente y dirigida, lo que es especialmente útil en problemas grandes y con muchas restricciones.
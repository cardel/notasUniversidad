# Invariantes de ciclos

Dado un algoritmo que cumple una precondición $P$ (lo que debe cumplir la entrada, el contrato) y nos conecta con la poscondición $Q$ (lo que cumple la salida).

En un algoritmo imperativo, el estado evoluciona como:
$S_0 \rightarrow S_1 \rightarrow \ldots \rightarrow S_f$
donde cada $S_i$ es un conjunto de variables que determinan cómo se transforma la entrada en la salida.

## Método para encontrar invariantes de ciclo

1. **Determinar la forma del estado**: identificar qué variables determinan el estado del programa.
2. **Determinar el estado inicial**: cómo está el estado cuando el algoritmo comienza.
3. **Determinar la transformación de estados**: cómo cambia el estado a medida que el algoritmo avanza.
4. **Evaluar el funcionamiento del algoritmo** para determinar el estado final.
5. **Encontrar la invariante de ciclo** utilizando los elementos anteriores.

## Demostración de una invariante

Para demostrar que una propiedad es una invariante de ciclo, se debe verificar:

1. **Cumple el estado inicial**: la propiedad se satisface al inicio del ciclo.
2. **Cumple el estado final**: la propiedad, al final del ciclo, implica la poscondición deseada.
3. **Se mantiene en la transformación de estados**: si la propiedad se cumple antes de una iteración, también se cumple después de ejecutar el cuerpo del ciclo (inducción).
4. **El algoritmo termina**: se debe garantizar que el ciclo eventualmente finaliza (generalmente mediante una variante que decrece o acota las iteraciones).

**Nota**: Cuando se tienen ciclos anidados, la invariante debe analizarse para cada uno de ellos. Un ciclo interno se conecta con el ciclo externo usando el estado final del interno como parte del estado del externo.

## Ejemplo: algoritmo de ordenación por burbuja (Bubble Sort)

```java
BS (int A[], int N){
    int i, j, aux;
    for (i = 1; i < N ; i++){                     // Ciclo externo: coloca el i-ésimo menor en su posición
        for (j = N; j > i ; j--){                 // Ciclo interno: recorre desde el final hasta i+1
            if (A[j] < A[j - 1]){                 // Compara elementos adyacentes
                // Intercambio (swap) de elementos
                aux = A[j];
                A[j] = A[j - 1];
                A[j - 1] = aux;
            }
        }
    }
}
```

**Nota importante**: Se utiliza indexación lógica desde 1 hasta N (inclusive) en el análisis teórico. En la implementación real en Java, los arreglos se indexan desde 0.

### Prueba de escritorio (ejemplo con indexación desde 1)

```java
A[] = {9,0,1,5,6,3,2,8,6}
N = 9

// Suposición: arreglo indexado desde 1 hasta N
i = 1
j = 9
if(A[9] < A[8]) // 6 < 8 → intercambia
A[] = {9,0,1,5,6,3,2,6,8}

j = 8
if(A[8] < A[7]) // 6 < 2 → no intercambia
A[] = {9,0,1,5,6,3,2,6,8}

j = 7
if(A[7] < A[6]) // 2 < 3 → intercambia
A[] = {9,0,1,5,6,2,3,6,8}

... // continuan iteraciones hasta j = i+1
```

## Análisis del ciclo interno

1. **Estado**: $(j, A[])$
2. **Estado inicial**: $(N, A[])$ donde $A$ es un arreglo arbitrario.
3. **Estado final**: $(i, A[])$ donde $A[i]$ es el menor elemento del subarreglo $A[i..N]$, es decir, $A[i] \leq A[i+1] \leq \ldots \leq A[N]$.
4. **Transformación de estados**:
    - Si $A[j] < A[j-1]$ se intercambian, asegurando $A[j-1] \leq A[j]$.
    - Si no, ya se cumple $A[j-1] \leq A[j]$.
5. **Invariante del ciclo interno**:
    - Para cada valor de $j$ durante la ejecución, el elemento en la posición $j$ es el menor del subarreglo $A[j..N]$. Formalmente:
      $A[j] \leq A[j+1] \wedge A[j] \leq A[j+2] \wedge \ldots \wedge A[j] \leq A[N]$.
    - En palabras: en cada paso, la posición $j$ contiene el mínimo del subarreglo que va desde $j$ hasta $N$.

### Demostración de la invariante interna

1. **Estado inicial**: $j = N$. El subarreglo $A[N..N]$ tiene un solo elemento, que trivialmente es el menor.
2. **Estado final**: $j = i$. Por construcción, después de ejecutar el ciclo interno, $A[i]$ es el menor de $A[i..N]$.
3. **Transformación (paso inductivo)**:
    - Hipótesis inductiva: supongamos que $A[j]$ es el menor de $A[j..N]$.
    - Se considera $A[j-1]$:
        - Si $A[j-1] > A[j]$, se intercambian. Después del intercambio, $A[j-1]$ toma el valor que era $A[j]$ (el menor del subarreglo anterior), por lo que $A[j-1]$ pasa a ser el menor de $A[j-1..N]$.
        - Si $A[j-1] \leq A[j]$, entonces $A[j-1]$ ya es menor o igual que el mínimo del resto, por lo que también es el menor de $A[j-1..N]$.
    - En ambos casos, la propiedad se mantiene para $j-1$.
4. **Terminación**: $j$ decrece desde $N$ hasta $i+1$, por lo que eventualmente $j = i$ y el ciclo termina.

## Análisis del ciclo externo

```java
BS (int A[], int N){
    int i, j, aux;
    for (i = 1; i < N ; i++){
        // Invariante externa: el subarreglo A[1..i] está ordenado ascendentemente
    }
}
```

- **Estado**: $(i, A[])$
- **Estado inicial**: $(1, A[])$ donde $A$ es un arreglo arbitrario.
- **Transformación de estado**: en cada iteración, $i$ aumenta y el ciclo interno asegura que $A[i]$ sea el menor del resto, colocándolo en la posición correcta.
- **Invariante externa**: después de cada iteración $i$, el subarreglo $A[1..i]$ está ordenado ascendentemente:
  $A[1] \leq A[2] \leq \ldots \leq A[i]$.
- **Estado final**: $(N, A[])$, donde $A[1..N]$ está completamente ordenado.

### Demostración de la invariante externa

1. **Estado inicial**: $i=1$. $A[1..1]$ tiene un solo elemento, trivialmente ordenado.
2. **Estado final**: $i=N$. La invariante afirma que $A[1..N]$ está ordenado, que es la poscondición deseada.
3. **Transformación (paso inductivo)**:
    - Hipótesis: antes de la iteración, $A[1..i]$ está ordenado.
    - El ciclo interno asegura que $A[i+1]$ sea el menor de $A[i+1..N]$. En particular, $A[i] \leq A[i+1]$ (porque después del ciclo interno, $A[i]$ es menor o igual que todos los que le siguen).
    - Por lo tanto, $A[1..i+1]$ queda ordenado.
4. **Terminación**: $i$ incrementa desde 1 hasta $N-1$, por lo que el ciclo termina.

## Comprobación con código Java (indexación desde 0)

### Invariante interna (solo primera iteración externa)

```java
import java.util.Arrays;

public class Ordenar {
    void BS (int A[], int N){
        int i, j, aux;
        for (i = 0; i < N ; i++){
            System.out.println("j " + N + " " + Arrays.toString(A));
            for (j = N; j > i ; j--){
                if (A[j] < A[j - 1]){                 // Comparación de elementos adyacentes
                    // Intercambio (swap) usando variable auxiliar
                    aux = A[j];
                    A[j] = A[j - 1];
                    A[j - 1] = aux;
                }
                System.out.println("j " + (j-1) + " " + Arrays.toString(A));
            }
            return; // Solo se ejecuta la primera iteración del ciclo externo para analizar la interna
        }
    }

    public static void main(String[] args) {
        Ordenar objOrdenar = new Ordenar();
        int arr[] = {6,9,1,2,3,9,1,4,6,0,1};
        objOrdenar.BS(arr, arr.length - 1);           // Se pasa el último índice válido
        System.out.println(Arrays.toString(arr));
    }
}
```

```bash
j 10 [6, 9, 1, 2, 3, 9, 1, 4, 6, 0, 1]
j 9 [6, 9, 1, 2, 3, 9, 1, 4, 6, 0, 1]
j 8 [6, 9, 1, 2, 3, 9, 1, 4, 0, 6, 1]
j 7 [6, 9, 1, 2, 3, 9, 1, 0, 4, 6, 1]
j 6 [6, 9, 1, 2, 3, 9, 0, 1, 4, 6, 1]
j 5 [6, 9, 1, 2, 3, 0, 9, 1, 4, 6, 1]
j 4 [6, 9, 1, 2, 0, 3, 9, 1, 4, 6, 1]
j 3 [6, 9, 1, 0, 2, 3, 9, 1, 4, 6, 1]
j 2 [6, 9, 0, 1, 2, 3, 9, 1, 4, 6, 1]
j 1 [6, 0, 9, 1, 2, 3, 9, 1, 4, 6, 1]
j 0 [0, 6, 9, 1, 2, 3, 9, 1, 4, 6, 1]
[0, 6, 9, 1, 2, 3, 9, 1, 4, 6, 1]
```

**Salida observada** (se muestra cómo $A[j]$ se convierte en el menor de $A[j..N-1]$ en cada paso).

### Invariante externa (ejecución completa)

```java
import java.util.Arrays;

public class Ordenar {
    void BS (int A[], int N){
        int i, j, aux;
        System.out.println("i " + 0 + " " + Arrays.toString(A));
        for (i = 0; i < N ; i++){                     // Ciclo externo: construye la parte ordenada
            for (j = N; j > i ; j--){                 // Ciclo interno: lleva el menor al inicio
                if (A[j] < A[j - 1]){
                    aux = A[j];
                    A[j] = A[j - 1];
                    A[j - 1] = aux;
                }
            }
            System.out.println("i " + (i+1) + " " + Arrays.toString(A));
        }
    }

    public static void main(String[] args) {
        Ordenar objOrdenar = new Ordenar();
        int arr[] = {6,9,1,2,3,9,1,4,6,0,1};
        objOrdenar.BS(arr, arr.length - 1);
        System.out.println("Resultado final: " + Arrays.toString(arr));
    }
}
```

```bash
i 0 [6, 9, 1, 2, 3, 9, 1, 4, 6, 0, 1]
i 1 [0, 6, 9, 1, 2, 3, 9, 1, 4, 6, 1]
i 2 [0, 1, 6, 9, 1, 2, 3, 9, 1, 4, 6]
i 3 [0, 1, 1, 6, 9, 1, 2, 3, 9, 4, 6]
i 4 [0, 1, 1, 1, 6, 9, 2, 3, 4, 9, 6]
i 5 [0, 1, 1, 1, 2, 6, 9, 3, 4, 6, 9]
i 6 [0, 1, 1, 1, 2, 3, 6, 9, 4, 6, 9]
i 7 [0, 1, 1, 1, 2, 3, 4, 6, 9, 6, 9]
```

**Salida observada**: después de cada iteración $i$, el subarreglo $A[0..i]$ está ordenado.

## Tabla de resumen de conceptos

| Concepto | Descripción | Ejemplo en Bubble Sort |
|----------|-------------|------------------------|
| **Estado del programa** | Conjunto de variables que capturan la situación en un punto de la ejecución. | $(i, j, A[])$ |
| **Precondición ($P$)** | Condiciones que debe cumplir la entrada antes de ejecutar el algoritmo. | $A$ es un arreglo de enteros de tamaño $N$. |
| **Poscondición ($Q$)** | Condiciones que debe cumplir la salida después de ejecutar el algoritmo. | $A$ está ordenado ascendentemente. |
| **Invariante de ciclo** | Propiedad que se mantiene verdadera antes y después de cada iteración del ciclo. | Interna: $A[j]$ es el menor de $A[j..N]$. Externa: $A[1..i]$ está ordenado. |
| **Demostración por inducción** | Técnica para probar que una invariante se mantiene: caso base y paso inductivo. | Se prueba para $j=N$ y luego para $j-1$ suponiendo válido para $j$. |
| **Terminación** | Garantía de que el ciclo no es infinito, generalmente mediante un **variante** (entero que decrece). | En ciclo interno: $j$ decrece desde $N$ hasta $i+1$. En ciclo externo: $i$ aumenta desde $1$ hasta $N-1$. |
| **Ciclos anidados** | Cuando un ciclo está dentro de otro, cada uno tiene su propia invariante, y la finalización del interno ayuda a probar la del externo. | El ciclo interno ordena un elemento; el externo repite el proceso para cada posición. |

## Comentarios adicionales

- **Importancia de las invariantes**: son la herramienta fundamental para razonar sobre la corrección de algoritmos iterativos. Permiten descomponer la demostración en pasos manejables.
- **Diferencia entre invariante y postcondición**: la invariante es una propiedad que se mantiene **durante** la ejecución; la postcondición es el resultado **final** deseado. Al finalizar, la invariante debe implicar la postcondición.
- **Ajuste por indexación**: en la teoría se suele usar indexación desde 1 para mayor claridad matemática, pero en lenguajes como Java la indexación comienza en 0. Esto no cambia la lógica del algoritmo, solo los rangos.
- **Complejidad del Bubble Sort**: este algoritmo tiene complejidad $O(n^2)$ en el peor caso, lo que lo hace ineficiente para arreglos grandes. Sin embargo, es excelente para entender conceptos de invariantes y demostración de algoritmos.
- **Variante de terminación**: en cada ciclo, existe una expresión entera que decrece (o aumenta) monótonamente y está acotada, lo que garantiza la terminación. Para el ciclo interno: $j - i$; para el externo: $N - i$.
- **Generalización**: el método de invariantes se aplica a cualquier algoritmo iterativo, no solo a ordenación. Es la base de la verificación formal de programas.

Los problemas computacionales son aquellos que se resuelven utilizando algoritmos, estos a su vez requiere un números de pasos dado para encontrar una solución, a esto lo conocemos como **complejidad computacional**

Problema dado: ordenar una secuencia de números $(0,4,3,2,1)$ y obtenemos $(0,1,2,3,4)$ como salida, para hacer este paso se requiere realizar un proceso.  Sabemos bien que la solución ingenua (permutacion) $O(n!)$ no polinomial pero los algoritmos toman $(O(nlog(n))$ para el general de los casos.

Con la notación $O$ podemos analizar que algoritmo es mejor con respecto a otro, utilizando como medida el número que se demora para calcular una solución en términos del tamaño de la entrada $n$ 

Para esto usualmente utilizamos la notación $O$ para describir un algoritmo dado su **peor caso**. Pero tambien tenemos otras notaciones $\Theta$ o $\Omega$ para describir su complejidad, sin embargo $O$ es la más utilizada por practicidad.

# Para que sirve esto

Entender que el mejor algoritmo para un problema dado toma tiempo $O(f(n))$ nos ayuda a entender que es imposible optimizar más alla de eso (reducir el tiempo) porque no existe un mejor solución.

Esto ayuda **a no prometer requerimientos imposibles**

Dependiendo del nivel de dificultad del problema aparecen las diferentes cotas

$O(1) \leq O(log(n)) \leq O(n) \leq O(nlog(n) \leq O(n^2) \leq O(n^3) \ldots \leq O(r^n, r> 1) \leq O(n!) \leq O(n^n)$
Las cotas que tienen la forma $O(n^d)$ las consideramos polinomiales, pero el $d$ tambien tiene otras implicaciones $O(n^{1000})$ no tiene aplicación practica.


# Tipos de problemas

## Dificultad (desición)

1. **Decidibles**: Es que se pueden resolver en un computador
2. **Indecidibles**: Que no se pueden resolver en un computador, el problema de la para de Turing

## Halting problem

El problema de la parada (Halting Problem) es un problema de decisión indecidible en teoría de la computación. Formalmente se define de la siguiente manera:

**Entrada**: Un programa $P$ y una entrada $I$ para dicho programa.

**Salida**: Determinar si el programa $P$ con entrada $I$ se detiene (termina su ejecución) o continúa ejecutándose indefinidamente.

Alan Turing demostró en 1936 que no existe un algoritmo general que pueda resolver este problema para todos los pares posibles $(P, I)$. La demostración utiliza un argumento de diagonalización y reducción al absurdo: supongamos que existe una máquina de Turing $H$ que decide el problema de la parada. Entonces se puede construir otra máquina de Turing $M$ que, al recibir como entrada su propia descripción, se comporte de manera contradictoria respecto a lo que $H$ predice, llevando a una paradoja.

Este resultado establece una limitación fundamental de lo que puede ser computado, mostrando que existen problemas bien definidos para los cuales ningún algoritmo puede proporcionar una respuesta correcta en todos los casos.

# Clasificación decidibles

1. Problemas tratables: Se pueden resolver en tiempo polinomial (su mejor algoritmo)
2. Problemas intratables: No se puede pueden resolver (hasta ahora) en tiempo polinomial.

Problemas tratables. ordenamiento $O(nlog(n))$, maximo $O(n), ...
Problemas intratables: SAT, problema de camino largo en un grafo, agente viajero $O(r^n, r> 1)$


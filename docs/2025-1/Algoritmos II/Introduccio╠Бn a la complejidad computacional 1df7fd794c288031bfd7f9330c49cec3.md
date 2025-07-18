# Introducción a la complejidad computacional

# Algoritmo

3 partes. Entrada (instancia) la cual debe cumplir unas precondiciones

Proceso secuencia instrucciones

Salida (poscondición) que podemos verificar

# Complejidad

- Temporal: Lo que tardar resolver el problema
- Espacial: Espacio que requieren las estructuras de datos

¿Que es lo mas importante a la hora resolver problemas? Que sea rapido y de la soluciń correcta, por ende es más importante un buen algoritmo que una buena maquina

La complejidad de un problema es la complejidad del mejor algoritmo, por para ordenar la complejidad O(nlog(n)) porque el mejor algoritmo que lo resuelve tiene esa complejidad

# Clasificación de problemas

## De acuerdo a su solución

- Decibles: Que se puede programar en un MT (computable)
    - Tratables: Existen algoritmo polinomiales que los resuelven
    - Intratables: No existen algoritmo polinomiales que lo resuelvan
- Indecidibles: No se puede programar en una MT (no computable)  Problema de la parada de Turing: Determinar si un algoritmo termina ante una instancia dada

## De acuerdo a su naturaleza

- Optimización: Encontrar el mejor valor de acuerdo a unas condiciones dada
- Decisión: Cuya respuesta es 1 o 0 (SI o NO)

# Maquinas de Turing

- Deterministas: Cada combinación de simbolo estado sólo tiene una posible transición (Modelo computación actual)
- No deterministas: Se puede explorar la ramificación de todas las posibilidades (2^n) al tiempo

### Ejemplos de Máquinas de Turing Deterministas y No Deterministas

**Problema dado:** Determinar si una cadena pertenece a un lenguaje que consta de palabras con el mismo número de `a`s y `b`s, por ejemplo, el lenguaje `{a^n b^n | n ≥ 0}`.

### Máquina de Turing Determinista

Una máquina de Turing determinista (MTD) resolvería este problema de manera secuencial y paso a paso:

1. Leería el primer símbolo de la cadena.
2. Si encuentra una `a`, marcaría esa `a` y buscaría la primera `b` que aún no esté marcada. Luego marcaría esa `b`.
3. Repetiría este proceso hasta que no queden más `a`s o `b`s sin marcar.
4. Finalmente, comprobaría si las dos partes de la cadena están completamente marcadas y balanceadas.

Esta máquina es determinista porque en cada paso sólo hay una transición posible basada en el estado actual y el símbolo que está leyendo. No puede "adivinar" soluciones; debe seguir las reglas linealmente.

---

### Máquina de Turing No Determinista

Una máquina de Turing no determinista (MTND) resolvería el mismo problema explorando simultáneamente todas las posibles combinaciones de marcaje:

1. La MTND "adivinaría" cuáles `a`s emparejar con cuáles `b`s, creando una ramificación por cada posible combinación.
2. Todas las ramificaciones serían exploradas al mismo tiempo, y si alguna de ellas encuentra una solución válida (es decir, las `a`s y `b`s están balanceadas), la máquina aceptaría la cadena.
3. Si ninguna ramificación encuentra una solución válida, la máquina rechazaría la cadena.

---

### ¿Por qué la MTND puede explorar todas las ramificaciones al mismo tiempo?

La clave está en que una máquina de Turing no determinista no opera bajo las mismas restricciones que las máquinas deterministas. En lugar de seguir un único camino secuencial, puede "simular" que sigue todas las posibles decisiones simultáneamente. En cada punto de decisión (como elegir qué `a` emparejar con qué `b`), la máquina puede bifurcarse en múltiples caminos, cada uno representando una combinación diferente. Aunque esto no es físicamente posible en una computadora real, el modelo teórico asume que todas las ramificaciones ocurren al mismo tiempo, permitiendo explorar todas las posibilidades de manera simultánea.

Esta capacidad de explorar todas las ramificaciones es lo que hace que las máquinas de Turing no deterministas sean útiles para estudiar problemas complejos, especialmente en el contexto de clases de problemas como NP (nondeterministic polynomial time).

# Clases P, NP y NPC

Clase P: Son aquellos una **maquina de turing determinista** puede soluciones **tiempo polinomial**

Clase NP:

- Definición 1: Es un problema que una **maquina de turing no determinista** puede solucionar en tiempo polinomial, esta analogia hace que $P \subseteq NP$ obviamente una maquina de turing determinista no lo puede solucionar en tiempo polinomial
- Definición 2: Es una problema que **una maquina de turing determinista** puede verificar **en tiempo polinomial Verificar. Validar que la respuesta es CORRECTA**

Clase NPC:

- No han podido ser solucionados en tiempo polinomial en MTD
- Si pueden ser solucionados en tiempo polinomial por una MTND
- Todo problema NPC puede ser solucionado a traves de ellos por un proceso denominado reducción

# P = NP

Es un problema del milenio aun no resuelto

Esta nos dice que existen algoritmos que trabajan MTD que los pueden solucionar en **tiempo polinomial**

**Si es esto es cierto tendría grandes implicaciones en la computación, especialmente en el area de seguridad (Criptografia)**

# Operacion de reducción

Para demostrar que un problema B es NPc partirmos del hecho que A es NPc, se cumple A ≤p B y se puede transformar una instancia a A a B en tiempo polinomial.

- Instancias positivas de A son instancias instancias en B
- Instancias negativas de A son instancias negativas en B
- El procedimiento de reducción se hace en tiempo polinomial

El hecho que A ≤p B implica que B es tan o más fuerte/duro/dificil/desafiante/complejo/complicado que A

Se dice que B es NPCs si

1. $B \in NP$ Demostrar que el mejor algoritmo para resolver B es No polinomial determinista MTD  / Polinomial no determinista MTND ←-**La salida se puede probar que es CORRECTA en tiempo polinomial**
2. Ser NP Duro $A \leq_p B$ y se puede transformar A en B

Para validar que un problema es NP, se deben seguir los siguientes pasos basados en los puntos 1 y 2 proporcionados:

1. **Demostrar que el problema pertenece a NP ($B \in NP$):**
    - Identificar que el problema puede ser resuelto por una máquina de Turing no determinista (MTND) en tiempo polinomial.
    - O, alternativamente, verificar que para cualquier solución propuesta del problema, existe un algoritmo determinista que puede validar dicha solución en tiempo polinomial.
    - Esto implica que, aunque no sepamos cómo encontrar la solución en tiempo polinomial, podemos al menos verificar que una solución dada es correcta en tiempo polinomial.
2. **Demostrar que el problema es NP-Duro ($A \leq_p B$):**
    - Seleccionar un problema $A$ que ya sea conocido como NP-Completo (NPC).
    - Probar que cualquier instancia del problema $A$ puede transformarse (reducirse) a una instancia del problema $B$ en tiempo polinomial.
    - Esto asegura que el problema $B$ es al menos tan difícil como $A$, ya que resolver $B$ permitiría también resolver $A$.

### Pasos realizados:

- **Paso 1:** Verificar si el problema pertenece a NP probando que la solución puede validarse en tiempo polinomial.
- **Paso 2:** Probar que el problema es NP-Duro reduciendo un problema conocido como NP-Completo al problema en cuestión en tiempo polinomial.
- **Conclusión:** Si ambos pasos se cumplen, el problema es NP-Completo (NPC).

Este procedimiento formaliza cómo validar que un problema es NP y asegura que cumple con las propiedades necesarias para ser clasificado dentro de esta categoría.

# Problema SAT

Demostrado que es NPC (La demostración esta por fuera del alcance del curso) esto es creeme wey

Un ejemplo de un problema SAT en forma normal conjuntiva (CNF) podría ser el siguiente:

Supongamos que tienes tres variables proposicionales: \$x_1, x_2 \texttt{ y } x_3.$ El problema SAT consiste en determinar si existe una asignación de valores de verdad (true o false) para estas variables que haga verdadera la fórmula lógica dada.

### Fórmula en CNF:
$(x_1 \vee \neg x_2 \vee x_3) \wedge (\neg x_1 \vee x_2) \wedge (x_2 \vee \neg x_3)$

En este caso, la fórmula está en forma normal conjuntiva porque consiste en una conjunción (AND) de cláusulas, y cada cláusula es una disyunción (OR) de literales. El objetivo es encontrar una asignación de valores a \(x_1\), \(x_2\) y \(x_3\) que haga verdadera la fórmula completa.

A partir de SAT podemos realizar la reducción hacia otros problemas

![image.png](Introduccio%CC%81n%20a%20la%20complejidad%20computacional%201df7fd794c288031bfd7f9330c49cec3/image.png)

## Aspectos de SAT

- Si se llega a demostrar que SAT es P, entonces cualquier problema NPC es P
- Esto tiene implicaciones en muchos problemas que se manejan en la vida diaria
- Al reducir SAT a cualquier problema NP se muestra que este es NP-duro

Si se demuestra que SAT se puede solucionar en tiempo polinomial, una desastrosa consecuencia para la humanidad sería el colapso de los sistemas de seguridad basados en criptografía. La mayor parte de los métodos criptográficos modernos, como RSA y ECC, dependen de la dificultad computacional de ciertos problemas matemáticos que son considerados NP o NP-duros. Si SAT es resoluble en tiempo polinomial, esto implicaría que cualquier problema NP, incluidos los problemas utilizados en criptografía, también sería resoluble en tiempo polinomial.

Esto significaría que cualquier persona con acceso a un algoritmo eficiente para resolver SAT podría romper la seguridad de casi todos los sistemas de cifrado utilizados en comunicaciones, banca, comercio electrónico y sistemas gubernamentales. La privacidad y la confidencialidad de los datos desaparecerían, exponiendo información sensible a nivel global y poniendo en riesgo infraestructuras críticas, finanzas y la seguridad personal de millones de personas. En resumen, el mundo enfrentaría un caos digital sin precedentes.

# Aspecto importante

Comprometerse con un proyecto que involucre problemas como el del "agente viajero" sin considerar su complejidad computacional puede tener serias implicaciones. El problema del agente viajero (TSP, por sus siglas en inglés) es un problema NP-Duro, lo que significa que no existe un algoritmo determinista conocido que pueda resolverlo de manera eficiente para todas las posibles instancias en tiempo polinomial. Esto tiene consecuencias prácticas y teóricas que deben entenderse antes de aceptar un proyecto de este tipo.

### Implicaciones prácticas:

1. **Ineficiencia en el tiempo de ejecución**:
Para instancias pequeñas, el problema puede resolverse con métodos exactos como fuerza bruta, pero a medida que el problema escala (más ciudades o rutas), el tiempo de ejecución crece exponencialmente. Esto puede llevar a soluciones que toman horas, días o incluso años, dependiendo del tamaño del problema.
2. **Expectativas poco realistas**:
Si aceptas el proyecto sin comprender su complejidad, puedes prometer soluciones que sean imposibles de entregar en un tiempo razonable o con los recursos disponibles, lo que puede afectar tu reputación profesional.
3. **Costos elevados**:
Resolver problemas computacionalmente complejos puede requerir hardware avanzado (clusters, supercomputadoras) o el desarrollo de algoritmos especializados, lo que incrementa los costos del proyecto.
4. **Dependencia de aproximaciones**:
Muchas veces, la única solución práctica para problemas NP-Duros son algoritmos de aproximación o heurísticos, que no garantizan la solución óptima, pero ofrecen soluciones razonables en un tiempo aceptable. Esto puede no cumplir con las expectativas del cliente si esperan una solución perfecta.

### Por qué esto importa más allá del desarrollo:

Muchos estudiantes creen que la computación solo se trata de desarrollar aplicaciones o sistemas funcionales, pero comprender la complejidad computacional es fundamental para abordar problemas del mundo real. Aquí hay razones para convencerlos:

1. **Impacto en la vida cotidiana**:
Problemas como el del agente viajero tienen aplicaciones en logística, distribución de recursos, planificación de rutas, optimización de redes y más. Estos problemas afectan industrias como el comercio electrónico, la atención médica, y la gestión de infraestructuras críticas.
2. **Toma de decisiones informada**:
Conocer la complejidad computacional permite identificar cuándo un problema es intratable y encontrar enfoques prácticos para solucionarlo. Esto no solo es clave en computación, sino también en disciplinas como economía, ingeniería y biología.
3. **Innovación y avances tecnológicos**:
Los límites impuestos por la complejidad computacional impulsan la creación de nuevos algoritmos, modelos matemáticos y tecnologías. Por ejemplo, las metaheurísticas como algoritmos genéticos o de colonia de hormigas han encontrado aplicaciones en campos tan diversos como la inteligencia artificial y la medicina.
4. **Preparación para el futuro**:
La computación no solo trata de construir sistemas; también trata de resolver problemas. Entender la teoría detrás de estos problemas prepara a los estudiantes para enfrentar desafíos complejos de manera eficiente y creativa.

### Conclusión:

Aceptar proyectos como el del agente viajero sin considerar la complejidad computacional puede llevar a resultados insatisfactorios tanto para el cliente como para el desarrollador. Sin embargo, este tipo de problemas son un recordatorio de por qué la computación no es solo desarrollo: es una disciplina que combina lógica, matemáticas y creatividad para resolver problemas importantes. Estudiar y entender la complejidad computacional no es solo una habilidad técnica, sino una herramienta esencial para transformar el mundo a través de la tecnología. ¡No se queden solo en la superficie, porque la verdadera magia está en los fundamentos teóricos!

# Resumen

### Resumen

La complejidad computacional es una rama fundamental de la computación que estudia cuánto tiempo y recursos se necesitan para resolver problemas. Los aspectos clave del documento son:

1. **Definición de la complejidad computacional**:
    - **Temporal**: Tiempo necesario para resolver un problema.
    - **Espacial**: Espacio de memoria requerido.
2. **Clasificación de problemas**:
    - **Decidibles**: Se pueden programar en una Máquina de Turing (MT).
        - **Tratables**: Resolubles en tiempo polinomial.
        - **Intratables**: No hay algoritmos polinomiales que los resuelvan.
    - **Indecidibles**: No se pueden programar en una MT, como el problema de la parada de Turing.
3. **Clases de problemas**:
    - **P**: Resolubles en tiempo polinomial con una Máquina de Turing Determinista (MTD).
    - **NP**: Verificables en tiempo polinomial o resolubles en tiempo polinomial con una Máquina de Turing No Determinista (MTND).
    - **NPC (NP-Completo)**: Problemas más difíciles de NP, que pueden reducirse unos a otros.
4. **Problema P vs NP**:
    - Un problema abierto: Si \( P = NP \), significaría que todos los problemas NP tienen soluciones rápidas, con grandes implicaciones en criptografía y seguridad.
5. **Reducción de problemas**:
    - Proceso de transformar un problema en otro para demostrar su complejidad (NP-duro o NPC).
6. **Problema SAT**:
    - Un problema fundamental en NP que, si se resolviera en tiempo polinomial, afectaría a toda la seguridad criptográfica.
7. **Implicaciones prácticas**:
    - Problemas como el del agente viajero (TSP) demuestran la importancia de entender la complejidad para no asumir proyectos inalcanzables sin los recursos adecuados.

### Frase Motivadora

"Recuerden: cada gran problema es una oportunidad para crecer como programadores y pensadores. No se queden en la superficie; ¡ustedes son jóvenes, no tienen excusa para pensar como ancianos aburridos de 80 años!"
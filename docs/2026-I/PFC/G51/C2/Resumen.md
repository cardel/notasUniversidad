# Resumen de Conceptos de Programación Funcional en Scala

## Conceptos Fundamentales

### 1. Expresiones y Operaciones
- **Todo es una expresión** que se evalúa a un valor (principio fundamental de los lenguajes funcionales)
- **Tipos primitivos**: `Int`, `Boolean`, `Char` como bloques básicos
- **Precedencia de operadores**: Reglas jerárquicas (multiplicación antes que suma)
- **Asociatividad**: La mayoría de operadores evalúan de izquierda a derecha
- **Paréntesis**: Máxima prioridad en la evaluación

### 2. Funciones
- **Definición con `def`**: `def nombre(parámetros): TipoRetorno = expresión`
- **Parámetros vs Argumentos**: Los parámetros son variables en la definición, los argumentos son valores en la invocación
- **Tipo función**: Representación de funciones como valores (`Int => Int`)
- **Diferenciación**: `def` define funciones (evaluación por nombre), `val` define valores (evaluación por valor)

### 3. Listas
- **Estructura recursiva**: `head` (primer elemento) + `tail` (lista restante)
- **Inmutabilidad**: Una vez creada no se puede modificar
- **Constructores**: `List(...)` y operador `::` (cons)
- **Caso base**: `Nil` representa la lista vacía
- **Tipado paramétrico**: `List[T]` donde `T` es el tipo de elementos

### 4. Mecanismos de Evaluación
- **CBV (Call By Value)**: Evalúa argumentos antes de invocar la función
- **CBN (Call By Name)**: Pasa argumentos sin evaluar, evalúa solo si se usan
- **Operador `=>`**: Sintaxis para CBN en Scala
- **Efectos secundarios**: Diferente comportamiento según estrategia de evaluación

### 5. Expresiones Condicionales y Booleanos
- **`if-else` obligatorio**: Debe retornar valor en ambos casos
- **Operadores de cortocircuito**: `&&` (AND) y `||` (OR) evalúan condicionalmente
- **Operadores sin cortocircuito**: `&` y `|` evalúan siempre ambos operandos
- **Expresiones totales**: Retornan valor para todas las entradas posibles

### 6. Alcance Léxico y Bloques
- **Encapsulación**: Funciones auxiliares anidadas dentro de funciones principales
- **Shadowing**: Variables internas enmascaran variables externas con el mismo nombre
- **Bloques**: Secuencias de expresiones que retornan el valor de la última expresión
- **Ámbito estático**: La visibilidad se determina por la estructura del código fuente

## Conceptos Teóricos Adicionales

### Modelo de Sustitución
Formalización matemática de cómo las expresiones se reducen a valores mediante reemplazo sistemático.

### Estrategias de Evaluación y Terminación
- **Teorema de Church-Rosser**: Si una expresión termina, el resultado es único independientemente del orden de evaluación
- **Propiedad de terminación**: CBN puede terminar cuando CBV no termina


## Aplicaciones Prácticas e Importancia

### 1. Desarrollo de Sistemas Concurrentes y Distribuidos
- **Inmutabilidad**: Elimina condiciones de carrera en programas concurrentes
- **Funciones puras**: Permite paralelización automática y caching de resultados
- **Ejemplo**: Apache Spark usa principios funcionales para procesamiento distribuido de datos

### 2. Procesamiento de Datos y Big Data
- **Listas y operaciones de orden superior**: Base de frameworks como Spark y Flink
- **Evaluación perezosa**: Manejo eficiente de grandes volúmenes de datos
- **Ejemplo**: Pipelines de datos donde se procesan solo los datos necesarios

### 3. Desarrollo de Compiladores y Lenguajes
- **Modelo de sustitución**: Base teórica para implementación de lenguajes
- **Estrategias de evaluación**: Diferentes lenguajes usan diferentes estrategias (Haskell: perezosa, Scala: mixta)
- **Ejemplo**: Optimizaciones de compilador basadas en análisis de evaluación

### 4. Inteligencia Artificial y Machine Learning
- **Funciones de orden superior**: Permiten componer transformaciones complejas
- **Inmutabilidad**: Facilita debugging y reproducibilidad de experimentos
- **Ejemplo**: Frameworks como TensorFlow Functional API usan principios funcionales

### 5. Desarrollo de APIs y DSLs (Lenguajes de Dominio Específico)
- **Funciones como valores**: Permiten APIs flexibles y expresivas
- **Alcance léxico**: Facilita creación de contextos específicos
- **Ejemplo**: Play Framework para web usa rutas como funciones

### 6. Verificación Formal y Pruebas
- **Transparencia referencial**: Permite razonamiento matemático sobre programas
- **Inmutabilidad**: Facilita pruebas y verificaciones formales
- **Ejemplo**: Librerías de pruebas basadas en propiedades (ScalaCheck)

### 7. Optimización de Recursos
- **Evaluación perezosa**: Ahorra memoria y CPU cuando hay datos no utilizados
- **Estructuras persistentes**: Comparten datos entre versiones, reduciendo consumo
- **Ejemplo**: Procesamiento de streams infinitos en tiempo real

## Importancia en la Industria

1. **Scalabilidad**: Los principios funcionales permiten sistemas que escalan mejor horizontalmente
2. **Mantenibilidad**: Código más predecible y fácil de modificar
3. **Confiabilidad**: Menos bugs por efectos secundarios inesperados
4. **Productividad**: Abstracciones de alto nivel permiten resolver problemas complejos con menos código
5. **Interoperabilidad**: Scala corre en la JVM, permitiendo integrar con ecosistema Java

---

**Frase de motivación**: Estos conceptos son las herramientas fundamentales para construir sistemas robustos, escalables y mantenibles que dominan la industria tecnológica actual.
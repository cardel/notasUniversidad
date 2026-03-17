# Como vamos

1. Semantica de lenguajes PF: Hasta ahora hemos abordado lo que es la sintaxis, ahora pasamos a semantica, darle significado a lo que escribimos en código fuente.
2. Compilación: Codigo fuente (lenguaje fuente) -> Frontend -> El cual puede ser compilado o interpretado
	1. Compilado: Se pasa a lenguaje maquina o bytecode (Java)
	2. Interpretado: A partir del de AST se da una respuesta
3. Interpretador simple:
	1. Valores expresados: Los valores que tenemos como respuesta Numero
	2. Valores denotados: Son los almacenados en los ambientes
4. SLLGEN: Generacion de lenguajes por la izquierda, la gramatica tipo 3 por la izquierda
	1. $<regla> ::= <terminal> | <terminal><regla>$
	2. Se debe tener en cuenta que inicio por la izquierda permite diferenciar la variante
	3. Especificación lexica: Cuales son las unidades significativas: numeros, comentarios, identificadores y que se hace con ellos: symbol, string, skip, number
	4. Especificación gramatical: Como se construyen las diferentes expresiones en el lenguaje
5. Intepretador simple
	1. Operaciones matematicas: suma, resta, multiplicacion
	2. Ambientes: Para un conjunto de variables inicial
6. Por regla: Siempre vamos a estar trabajando con un AST, por lo que la idea es que las funciones de evaluación uses cases
7. Tener enc uenta los tipos de TAD
	1. Expresiones: La representación de lo que se escribe en código
	2. Datos: Los utilizamos en diferentes rutina, ejemplo el ambiente

# Temas

1. Condicionales, introducimos los booleanos
2. Ligaduras locales para introducir nuevas ligaduras
3. Procedimientos


# Contenido

1. [Condicionales](Condicionales.md)
2. [Ligaduras](Ligaduras.md)
3. [Ejercicio ligaduras](Ejercicio%20ligaduras.md)
4. [Ejericicio 2 Ligaduras y condicionales](Ejericicio%202%20Ligaduras%20y%20condicionales.md)
5. [Procedimientos](Procedimientos.md)
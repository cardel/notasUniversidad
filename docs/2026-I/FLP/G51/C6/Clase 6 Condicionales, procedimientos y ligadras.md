
# Como vamos

1. Semantica de los lenguajes de programación, esto tiene que ver con el funcionamiento de las diferentes expresiones que tiene un lenguaje
2. Vimos el proceso de compilación e interpretación, un codigo fuente es pasado a través del frontend: Construye el arbol de sintaxis abstracta
	1. Interpretar: Realiza las ejecuciones y nos retorna una respuesta
	2. Compilar: Se transforma a código fuente y se ejecuta en la maquina
		1. Codigo binario: CPU
		2. Bycode (Java) es posteriormente interpretado
3. Frontend
	1. Scanner: Captura unidades significativas y deja ultimo (elimina espacios en blanco y comentarios)
	2. Parser: Recibe una secuencia de tokens (scanner) y nos retorna AST
4. Un interpretador:
	1. Una especificación léxica: Especificamos que son las unidades significativas: numeros, identificadores, comentarios, y que hacemos con ellos: skip (ignorar), symbol, number o string
	2. Especificación gramatical: COmo construimos el AST a partir de las reglas de escritura del codigo.
5. SLLGEN: Lenguajes por la izquierda, que el inicio debe ser diferente, gramatica regular:  $<regla>:= <terminal> | <terminal> <regla>$
	1. Rutinas para hacer los datatypes de expresiones
	2. Rutinar para hace el scanner y el parser
	3. Rutina para hacer el interprete
6. Interprete simple
	1. Valores expresados: Son aquellos que se manejan directamente en el lenguaje
	2. Valores denotados: Son aquellos que se almacen en los ambientes
7. TADs
	1. Expresiones: Representaciones del codigo fuente, por ejemplo identificador es un var-exp, un numero es lit-exp
	2. Datos: Ambientes
8. Este interprete inicial nos ofrece operaciones matematicas.

# Temas

1. [Condicionales](Condicionales.md)
2. [Ligaduras locales](Ligaduras%20locales.md)
3. [Ejemplo](Ejemplo.md)
4. [Ejercicio condicionales y ligaduras](Ejercicio%20condicionales%20y%20ligaduras.md)
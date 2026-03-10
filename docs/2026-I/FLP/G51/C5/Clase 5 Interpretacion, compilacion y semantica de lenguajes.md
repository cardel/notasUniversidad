
# Como vamos

1. Representación recursiva de datos
	1. Representación inductiva
	2. Representación mediante gramáticas
2. Creación de programas para datos recursivos
	1. Considerar el caso base
	2. Considerar que el caso recursivo estructura la salida y paulatinamente nos lleva al caso base
3. TAD: Tipo abstracto de datos
	1. Implementación y la interfaz
	2. Interfaz
		1. Constructores: Crear un elemento que pertenece al TAD
		2. Observadores
			1. Predicados: Nos permite conocer si un elemento pertenece a una variante del TAD
			2. Extractores: Permite extraer información dentro de un TAD
	3. Diseño de TADs
		1. Incluya un constructor para cada variante de cada tipo de dato
		2. Incluya un predicado para cada variante de cada tipo de dato
		3. Incluya un extractor para cada parte de cada variante de cada tipo de dato
	4. Representaciones de TADs
		1. Listas
		2. Procedimientos
		3. Datatypes (AST arboles de sintaxis abstracta)
4. Alcance y ligadura de variables
	1. let Alcance el bloque (funcional)
	2. let* Alcance secuencial (imperativo)
	3. letrec Alcance recursivo, solo para funciones
5. Define-datatype
	1. Permite AST, que es una representación dependiente de la gramática
	2. Usamos cases para trabajar los datatypes
	3. Un AST mapea los elementos pertenecientes a una gramática
6. Sintaxis concreta y abstracta
	1. Concreta: Es el código fuente 
	2. Abstracta: Es el AST obtenido desde el código fuente

# Temas

1. [Interpretación y compilación](Interpretación%20y%20compilación.md)
2. [Parser y scanner](Parser%20y%20scanner.md)
3. [Especificacion lexica y gramatical](Especificacion%20lexica%20y%20gramatical.md)
4. [Interpretación y compilación](Interpretación%20y%20compilación.md)
5. [Interprete simple](Interprete%20simple.md)
6. [Resumen](Resumen.md)